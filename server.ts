import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import fs from 'fs';
import axios from 'axios';
import admin from 'firebase-admin';
import pg from 'pg';

const { Pool } = pg;

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize PostgreSQL
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

// Initialize Tables
async function initDb() {
  try {
    const schema = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf-8');
    await pool.query(schema);
    console.log("PostgreSQL Schema initialized successfully");

    // Optional Seeding
    const checkEngines = await pool.query('SELECT COUNT(*) FROM game_engines');
    if (parseInt(checkEngines.rows[0].count) === 0) {
      const seed = fs.readFileSync(path.join(__dirname, 'seed.sql'), 'utf-8');
      await pool.query(seed);
      console.log("PostgreSQL Database seeded successfully");
    }
  } catch (err) {
    console.error("Failed to initialize PostgreSQL schema:", err);
  }
}

// Initialize Firebase Admin
if (process.env.FIREBASE_SERVICE_ACCOUNT) {
  try {
    const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
    });
  } catch (err) {
    console.error("Failed to initialize Firebase Admin with service account. Using default or failing...");
  }
} else if (!admin.apps.length) {
  console.warn("FIREBASE_SERVICE_ACCOUNT not found. Server-side Firestore updates might fail.");
}

async function startServer() {
  await initDb();
  
  const app = express();
  const PORT = process.env.PORT || 3000;

  // Middleware
  app.use(express.json());

  // --- Auth Middleware ---
  const authenticate = async (req: any, res: any, next: any) => {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    const token = authHeader.split('Bearer ')[1];
    try {
      if (admin.apps.length) {
        const decodedToken = await admin.auth().verifyIdToken(token);
        req.user = decodedToken;
        next();
      } else {
        // Fallback for dev without firebase admin
        req.user = { uid: 'dev-user', email: 'dev@example.com' };
        next();
      }
    } catch (err) {
      res.status(401).json({ error: 'Invalid token' });
    }
  };

  // Basic Health Route
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', project: 'LearnPlay', version: 'v16-postgres-enhanced' });
  });

  // --- Users API ---
  app.get('/api/users/me', authenticate, async (req: any, res) => {
    try {
      const { uid } = req.user;
      const result = await pool.query('SELECT * FROM users WHERE id = $1', [uid]);
      if (result.rows.length === 0) {
        // Sync from firebase if not in PG yet
        const newUser = await pool.query(
          'INSERT INTO users (id, email, display_name, photo_url) VALUES ($1, $2, $3, $4) RETURNING *',
          [uid, req.user.email, req.user.name || '', req.user.picture || '']
        );
        return res.json(newUser.rows[0]);
      }
      res.json(result.rows[0]);
    } catch (err) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

  // --- Games & Engines API ---
  app.get('/api/engines', async (req, res) => {
    try {
      const result = await pool.query('SELECT * FROM game_engines ORDER BY plays_count DESC');
      res.json(result.rows);
    } catch (err) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

  // --- Datasets API ---
  app.get('/api/datasets', async (req, res) => {
    try {
      const result = await pool.query('SELECT * FROM datasets WHERE is_public = true ORDER BY created_at DESC');
      res.json(result.rows);
    } catch (err) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

  app.post('/api/datasets', authenticate, async (req: any, res) => {
    const { title, description, domain, content, gameType, isPublic } = req.body;
    try {
      const result = await pool.query(
        'INSERT INTO datasets (title, description, domain, content, game_type, author_id, is_public) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
        [title, description, domain, content, gameType, req.user.uid, isPublic]
      );
      res.json(result.rows[0]);
    } catch (err) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

  // --- Sessions & Stats ---
  app.get('/api/sessions/recent', authenticate, async (req: any, res) => {
    try {
      const result = await pool.query(
        `SELECT s.*, e.name as game_name, d.title as dataset_title 
         FROM game_sessions s
         JOIN game_engines e ON s.game_id = e.id
         JOIN datasets d ON s.dataset_id = d.id
         WHERE s.user_id = $1 
         ORDER BY s.completed_at DESC LIMIT 10`,
        [req.user.uid]
      );
      res.json(result.rows);
    } catch (err) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

  app.post('/api/sessions', authenticate, async (req: any, res) => {
    const { gameId, datasetId, score, maxScore, accuracy, durationMs } = req.body;
    try {
      const result = await pool.query(
        'INSERT INTO game_sessions (user_id, game_id, dataset_id, score, max_score, accuracy, duration_ms) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
        [req.user.uid, gameId, datasetId, score, maxScore, accuracy, durationMs]
      );
      // Increment plays count on engine
      await pool.query('UPDATE game_engines SET plays_count = plays_count + 1 WHERE id = $1', [gameId]);
      res.json(result.rows[0]);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

  // --- Nedarim Plus Direct Payment (Updated for PG) ---
  const PRICING = {
    pro: { monthly: 35, annual: 350 },
    premium: { monthly: 59, annual: 590 },
    creator: { monthly: 99, annual: 990 }
  };

  app.post('/api/payments/nedarim/direct', authenticate, async (req: any, res) => {
    const { 
      plan, 
      billingCycle, 
      creditCard, 
      expiry, 
      cvv, 
      customerName, 
      email, 
      zeout 
    } = req.body;
    const userId = req.user.uid;

    const planType = (plan || 'pro').toLowerCase() as keyof typeof PRICING;
    const cycle = (billingCycle || 'monthly').toLowerCase() as 'monthly' | 'annual';
    
    if (!PRICING[planType] || !PRICING[planType][cycle]) {
      return res.status(400).json({ success: false, message: "Invalid plan or billing cycle" });
    }

    const amount = PRICING[planType][cycle];
    
    try {
      const isSuccess = !creditCard.startsWith('4111'); 
      
      if (isSuccess) {
        const kevaId = `KEVA_${Math.random().toString(36).substring(7).toUpperCase()}`;
        const expiryDate = new Date();
        expiryDate.setDate(expiryDate.getDate() + (cycle === 'annual' ? 365 : 30));

        // 1. Update User in Postgres
        await pool.query(
          'UPDATE users SET plan = $1, is_premium = true, subscription_expiry = $2, billing_cycle = $3, updated_at = NOW() WHERE id = $4',
          [planType, expiryDate, cycle, userId]
        );

        // 2. Record Payment in Postgres
        await pool.query(
          'INSERT INTO payments (user_id, amount, status, keva_id, plan, billing_cycle, method) VALUES ($1, $2, $3, $4, $5, $6, $7)',
          [userId, amount, 'completed', kevaId, planType, cycle, 'nedarim_direct']
        );

        return res.json({
          success: true,
          message: "תשלום בוצע בהצלחה!",
          kevaId,
          plan,
          amount
        });
      } else {
        return res.status(400).json({ success: false, message: "העסקה נדחתה." });
      }

    } catch (err) {
      console.error("Payment Error:", err);
      return res.status(500).json({ success: false, message: "Server error." });
    }
  });

  // Dynamic API Config
  app.get('/api/config', (req, res) => {
    res.json({ 
      GEMINI_API_KEY: process.env.GEMINI_API_KEY || "",
      BUILD_ID: '2026-04-19-v16',
      VERSION: 'v16'
    });
  });

  // Vite Integration
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`========================================`);
    console.log(`LEARNPLAY SERVER STARTED - v16 (POSTGRE)`);
    console.log(`PORT: ${PORT}`);
    console.log(`========================================`);
  });
}

startServer();

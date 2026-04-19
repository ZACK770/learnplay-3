import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig, loadEnv} from 'vite';

// Cache bust: 2026-04-19 16:46
export default defineConfig(({mode}) => {
  const env = loadEnv(mode, '.', '');
  const apiKey = (process.env.GEMINI_API_KEY || env.GEMINI_API_KEY || "").trim();
  console.log(`Vite Config: Injecting GEMINI_API_KEY (Length: ${apiKey.length})`);
  
  return {
    plugins: [react(), tailwindcss()],
    define: {
      // process.env.GEMINI_API_KEY is handled dynamically by the platform. 
      // Do not bake it in here.
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modifyâfile watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
    },
  };
});

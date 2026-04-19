/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { 
  Gamepad2, 
  Sparkles, 
  BarChart3, 
  User as UserIcon, 
  Search, 
  Layout, 
  Share2, 
  Star, 
  Users,
  BrainCircuit,
  Settings,
  LogOut,
  ChevronRight,
  Plus,
  Database,
  ShieldAlert,
  BookOpen,
  Gamepad,
  GraduationCap,
  Clapperboard,
  PencilRuler,
  Rocket,
  Eye,
  LayoutDashboard,
  Contact,
  Gift,
  Briefcase,
  Settings as SettingsIcon,
  Coins,
  Shield,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { auth, loginWithGoogle } from './lib/firebase';
import { onAuthStateChanged, User } from 'firebase/auth';
import { AppState, GameEngine, Dataset, GameSession, UserProfile } from './types';
import { cn } from './lib/utils';
import { api } from './services/api';
// import { MOCK_GAME_ENGINES, MOCK_DATASETS } from './constants/mockData';
import LandingPage from './components/LandingPage';
import PricingPage from './components/PricingPage';
import LegalPage from './components/LegalPage';
import UserProfilePage from './components/UserProfilePage';
import GamePreviewModal from './components/GamePreviewModal';
import UavGame from './components/UavGame';
import GameNavbar from './components/GameNavbar';
import HeroCarousel from './components/HeroCarousel';
import LanguageGame from './components/LanguageGame';
import NedarimCheckout from './components/NedarimCheckout';
import { useTranslation, Language } from './contexts/TranslationContext';

// --- Admin Components ---
const UnifiedTable = <T extends Record<string, any>>({ 
  data, 
  columns, 
  title 
}: { 
  data: T[], 
  columns: { key: keyof T, label: string, render?: (val: any) => React.ReactNode }[],
  title: string
}) => (
  <div className="bg-[#1E1E2E] rounded-3xl border border-white/5 overflow-hidden w-full">
    <div className="px-8 py-6 border-b border-white/5 flex justify-between items-center">
      <h3 className="font-bold text-lg">{title}</h3>
      <div className="text-xs text-gray-500 font-mono italic">Total: {data.length} records</div>
    </div>
    <div className="overflow-x-auto">
      <table className="w-full text-left">
        <thead>
          <tr className="text-[10px] text-gray-500 uppercase tracking-widest border-b border-white/5 bg-[#0F0F1A]/50 font-black">
            {columns.map(col => <th key={col.key as string} className="px-8 py-4">{col.label}</th>)}
          </tr>
        </thead>
        <tbody className="text-sm">
          {data.map((row, i) => (
            <tr key={i} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors group">
              {columns.map(col => (
                <td key={col.key as string} className="px-8 py-4">
                  {col.render ? col.render(row[col.key]) : <span className="text-gray-300">{String(row[col.key])}</span>}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

const AdminDashboard = ({ sessions }: { sessions: GameSession[] }) => (
  <div className="p-8 space-y-10">
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      {[
        { label: 'Total Revenue', value: '$12,450', sub: '+12% from last month', color: 'text-green-500' },
        { label: 'Active Users', value: '1,204', sub: '85% retention', color: 'text-blue-500' },
        { label: 'AI Success Rate', value: '98.2%', sub: '2.4s avg extraction', color: 'text-purple-500' },
        { label: 'Game Sessions', value: sessions.length.toString(), sub: 'Across 12 domains', color: 'text-orange-500' },
      ].map((stat, i) => (
        <div key={i} className="bg-[#1E1E2E] p-6 rounded-3xl border border-white/5">
          <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2">{stat.label}</p>
          <p className={cn("text-3xl font-black mb-1", stat.color)}>{stat.value}</p>
          <p className="text-[10px] text-gray-500 font-medium">{stat.sub}</p>
        </div>
      ))}
    </div>

    <UnifiedTable 
      title="Recent AI Ingestions"
      data={[
        { id: 'tx-1', user: 'Alex Regev', type: 'Match', status: 'Success', tokens: 1205, cost: '$0.002' },
        { id: 'tx-2', user: 'Maya Cohen', type: 'Trivia', status: 'Success', tokens: 4504, cost: '$0.009' },
        { id: 'tx-3', user: 'Yossi Levi', type: 'Sort', status: 'Failed', tokens: 0, cost: '$0.000' },
      ]}
      columns={[
        { key: 'user', label: 'User' },
        { key: 'type', label: 'Engine' },
        { key: 'status', label: 'Status', render: (val) => (
          <span className={cn("px-2 py-1 rounded-full text-[10px] font-black", val === 'Success' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500')}>
            {val}
          </span>
        )},
        { key: 'tokens', label: 'Tokens' },
        { key: 'cost', label: 'Cost' },
      ]}
    />
  </div>
);

// Marketplace component
const GameMarket = ({ 
  engines, 
  datasets, 
  onSelectGame, 
  onSelectDataset 
}: { 
  engines: GameEngine[], 
  datasets: Dataset[], 
  onSelectGame: (g: GameEngine) => void, 
  onSelectDataset: (d: Dataset) => void 
}) => {
  const [activeTab, setActiveTab] = useState<'engines' | 'datasets'>('engines');

  return (
    <div className="p-6">
      <div className="flex items-center gap-6 mb-8 border-b border-white/5 pb-1">
        <button 
          onClick={() => setActiveTab('engines')}
          className={cn(
            "pb-4 px-2 text-sm font-bold transition-all relative",
            activeTab === 'engines' ? "text-blue-400" : "text-gray-500 hover:text-white"
          )}
        >
          Game Mechanics
          {activeTab === 'engines' && <motion.div layoutId="tab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-400" />}
        </button>
        <button 
          onClick={() => setActiveTab('datasets')}
          className={cn(
            "pb-4 px-2 text-sm font-bold transition-all relative",
            activeTab === 'datasets' ? "text-blue-400" : "text-gray-500 hover:text-white"
          )}
        >
          Community Creations
          {activeTab === 'datasets' && <motion.div layoutId="tab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-400" />}
        </button>
      </div>

      {activeTab === 'engines' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {engines.map((game) => (
            <motion.div
              key={game.gameId || (game as any).id}
              whileHover={{ y: -5 }}
              className="group relative bg-[#1E1E2E] rounded-2xl overflow-hidden border border-white/5 shadow-2xl cursor-pointer"
              onClick={() => onSelectGame(game)}
            >
              <div className="aspect-video w-full overflow-hidden">
                <img 
                  src={game.thumbnail} 
                  alt={game.name} 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1E1E2E] via-transparent to-transparent opacity-60" />
                <div className="absolute top-3 left-3 bg-black/40 backdrop-blur-md px-2 py-1 rounded-lg flex items-center gap-1">
                  <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                  <span className="text-xs font-medium text-white">{game.rating}</span>
                </div>
              </div>
              <div className="p-5 text-left">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl font-bold text-white tracking-tight">{game.name}</h3>
                  <div className="bg-blue-500/10 text-blue-400 text-[10px] uppercase tracking-wider font-bold px-2 py-1 rounded-full border border-blue-500/20">
                    {game.type}
                  </div>
                </div>
                <p className="text-gray-400 text-sm mb-4 line-clamp-2 leading-relaxed">
                  {game.description}
                </p>
                <div className="flex items-center justify-between mt-auto">
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <Users className="w-4 h-4" />
                    <span>{(game.plays_count || (game as any).playsCount || 0).toLocaleString()} users</span>
                  </div>
                  <span className="text-xs text-blue-400 font-medium capitalize">By {game.author_id === 'dev-user' ? 'LearnPlay' : (game as any).authorName || 'User'}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
           {datasets.map((ds) => (
            <motion.div
              key={ds.datasetId || (ds as any).id}
              whileHover={{ scale: 1.02 }}
              onClick={() => onSelectDataset(ds)}
              className="bg-[#1E1E2E]/50 border border-white/5 p-6 rounded-2xl flex flex-col gap-4 group cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-400">
                  <BrainCircuit className="w-6 h-6" />
                </div>
                <div className="text-left">
                  <h4 className="font-bold text-white">{ds.title}</h4>
                  <p className="text-xs text-gray-500">For {ds.gameType} Games</p>
                </div>
              </div>
              <p className="text-sm text-gray-400 text-left">{ds.description}</p>
              <div className="flex items-center justify-between pt-4 border-t border-white/5 mt-auto">
                <span className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">{ds.domain}</span>
                <span className="text-xs text-blue-400 font-bold group-hover:underline">Play Now</span>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default function App() {
  const { language, setLanguage, t, isRTL } = useTranslation();
  const [activeState, setActiveState] = useState<AppState>('landing');
  const [user, setUser] = useState<User | null>(null);
  const [selectedGame, setSelectedGame] = useState<GameEngine | null>(null);
  const [wizardInput, setWizardInput] = useState('');
  const [domain, setDomain] = useState('Language & Vocab');
  const [difficulty, setDifficulty] = useState('Apprentice (Easy)');
  const [isGenerating, setIsGenerating] = useState(false);
  const [knowledgeSearch, setKnowledgeSearch] = useState('');
  const [debugLogs, setDebugLogs] = useState<any[]>([]);
  const [allDatasets, setAllDatasets] = useState<Dataset[]>([]);
  const [allEngines, setAllEngines] = useState<GameEngine[]>([]);
  const [currentDataset, setCurrentDataset] = useState<Dataset | null>(null);
  const [sessions, setSessions] = useState<GameSession[]>([]);
  const [aiUsage, setAiUsage] = useState({ left: 3, isPremium: false });
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [previewGame, setPreviewGame] = useState<{ game: GameEngine, dataset?: Dataset } | null>(null);
  const [debugKeyStatus, setDebugKeyStatus] = useState<{ length: number, masked: string, version: string } | null>(null);
  const [viewingDataset, setViewingDataset] = useState<Dataset | null>(null);
  const [checkoutConfig, setCheckoutConfig] = useState<{ plan: 'pro' | 'premium' | 'creator', billingCycle: 'monthly' | 'annual' } | null>(null);

  const refreshKeyInfo = async () => {
    const { getDebugKeyInfo } = await import('./services/geminiService');
    const info = await getDebugKeyInfo(true);
    setDebugKeyStatus(info);
  };

  useEffect(() => {
    refreshKeyInfo();
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser && activeState === 'landing') {
        setActiveState('lobby');
      }
    });
    return () => unsubscribe();
  }, [activeState]);

  useEffect(() => {
    if (!user) {
      setSessions([]);
      setAiUsage({ left: 3, isPremium: false });
      setProfile(null);
      return;
    }
    
    // Fetch data from PostgreSQL via Express API
    const fetchData = async () => {
      try {
        const [me, engines, datasets, recentSessions] = await Promise.all([
          api.getMe(),
          api.getEngines(),
          api.getDatasets(),
          api.getRecentSessions()
        ]);
        
        setProfile(me);
        setAiUsage({ left: 3, isPremium: !!me.is_premium }); // Simulating quota
        setAllEngines(engines);
        setAllDatasets(datasets);
        setSessions(recentSessions);
      } catch (err) {
        console.error("API Fetch Error:", err);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 30000); // Poll every 30s for freshness
    return () => clearInterval(interval);
  }, [user]);

  const handleLogin = async () => {
    try {
      await loginWithGoogle();
    } catch (e) {
      console.error(e);
    }
  };

  const handleLogout = async () => {
    try {
      await auth.signOut();
      setActiveState('landing');
    } catch (err) {
      console.error("Logout Error:", err);
    }
  };

  const handleUpgrade = async (plan: 'pro' | 'premium' | 'creator', cycle: 'monthly' | 'annual') => {
    if (!user) {
      handleLogin();
      return;
    }
    setCheckoutConfig({ plan, billingCycle: cycle });
  };

  const handleGenerate = async () => {
    console.log("LearnPlay UI: Triggering handleGenerate...");
    if (!selectedGame || !wizardInput || !user) {
      console.warn("LearnPlay UI: Missing requirements for handleGenerate", { selectedGame: !!selectedGame, wizardInput: !!wizardInput, user: !!user });
      return;
    }
    
    console.log("LearnPlay UI: Checking AI usage quotas...");
    if (!aiUsage.isPremium && aiUsage.left <= 0) {
      console.warn("LearnPlay UI: AI usage limit reached.");
      alert("You have reached your free generation limit. Please upgrade to Pro to continue generating custom content!");
      setActiveState('account');
      return;
    }

    setIsGenerating(true);
    console.log("LearnPlay UI: Invoking generateGameContent service...");
    try {
      const { generateGameContent } = await import('./services/geminiService');
      console.log("LearnPlay UI: Service imported successfully.");
      const content = await generateGameContent(domain, selectedGame.type, wizardInput, selectedGame.schema, language);
      console.log("LearnPlay UI: Content generated successfully. Proceeding to save...");
      const newDataset: Dataset = {
        datasetId: crypto.randomUUID(),
        title: `${selectedGame.name}: ${wizardInput.slice(0, 20)}...`,
        description: `Generated for ${domain} (${difficulty})`,
        domain,
        content,
        gameType: selectedGame.type,
        authorId: user.uid,
        isPublic: true,
        createdAt: new Date().toISOString()
      };

      // Save to PostgreSQL via API
      const datasetToSave = {
        ...newDataset,
        datasetId: undefined, // Let backend generate UUID if needed, or keep if using randomUUID
      };
      
      const savedDataset = await api.createDataset(newDataset);
      
      setCurrentDataset(savedDataset);
      setActiveState('playing');
    } catch (e) {
      console.error(e);
      alert("Failed to generate content. Please try a different prompt.");
    } finally {
      setIsGenerating(false);
    }
  };

  const GameStage = ({ game, dataset, onComplete }: { game: GameEngine, dataset: Dataset, onComplete: (score: number) => void }) => {
    // If it's the UAV Intercept game, use the specialized component
    if (game.type === 'uav-intercept') {
      return (
        <UavGame 
          dataset={dataset} 
          onComplete={(accuracy) => onComplete(Math.floor(accuracy * 100))} 
          onExit={() => setActiveState('lobby')}
        />
      );
    }

    return (
      <div className="p-8 max-w-5xl mx-auto h-[calc(100vh-140px)] flex flex-col">
        <div className="bg-[#1E1E2E] rounded-3xl border border-white/5 flex-1 flex flex-col overflow-hidden relative shadow-2xl">
          <div className="p-6 border-b border-white/5 flex justify-between items-center bg-[#1E1E2E]/50 backdrop-blur-sm z-10">
            <div>
              <h2 className="text-xl font-bold">{game.name}</h2>
              <p className="text-xs text-gray-500 uppercase tracking-widest">{dataset.title}</p>
            </div>
            <button 
              onClick={() => setActiveState('lobby')}
              className="text-gray-400 hover:text-white transition-colors"
            >
              Exit Game
            </button>
          </div>
          
          <div className="flex-1 flex flex-col items-center justify-center p-10 overflow-y-auto">
            {game.type === 'language' && (
              <LanguageGame data={dataset.content} onComplete={onComplete} />
            )}

            {game.type === 'match' && (
              <div className="grid grid-cols-4 gap-4 w-full max-w-2xl">
                {dataset.content.pairs?.map((pair: any, i: number) => (
                  <motion.div
                    key={i}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="aspect-square bg-[#2A2A3E] border border-white/10 rounded-2xl flex items-center justify-center p-4 text-center cursor-pointer hover:border-blue-500/50 transition-colors"
                  >
                    <span className="text-sm font-medium">{pair.front}</span>
                  </motion.div>
                ))}
              </div>
            )}
            
            {game.type === 'sort' && (
              <div className="w-full flex gap-6 min-h-[300px]">
                {dataset.content.buckets?.map((bucket: any, i: number) => (
                  <div key={i} className="flex-1 bg-[#2A2A3E] border border-dashed border-white/20 rounded-3xl p-6 flex flex-col gap-4">
                    <h5 className="font-black text-center text-blue-400 uppercase tracking-widest">{bucket.category}</h5>
                    <div className="flex-1 flex flex-wrap gap-2 content-start">
                      {/* Items will be draggable/sortable in a real engine */}
                      {bucket.items?.map((item: string, j: number) => (
                        <div key={j} className="bg-white/5 border border-white/10 px-3 py-2 rounded-xl text-sm">
                          {item}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {game.type === 'trivia' && (
              <div className="w-full max-w-xl space-y-8">
                {dataset.content.questions?.map((q: any, i: number) => (
                  <div key={i} className="text-center">
                    <h4 className="text-2xl font-bold mb-8">{q.question}</h4>
                    <div className="grid gap-4">
                      {q.options?.map((opt: string) => (
                        <button 
                          key={opt}
                          onClick={() => alert(`Correct answer: ${q.answer}\nExplanation: ${q.explanation}`)}
                          className="w-full p-6 rounded-2xl bg-[#2A2A3E] border border-white/10 hover:border-blue-500 hover:bg-blue-500/10 text-left font-bold transition-all flex items-center justify-between group"
                        >
                          {opt}
                          <ChevronRight className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="p-8 border-t border-white/5 flex justify-center">
             <button 
              onClick={() => onComplete(100)}
              className="bg-green-600 hover:bg-green-500 text-white font-black px-10 py-4 rounded-xl shadow-lg transition-all"
            >
              Finish & Save Progress
            </button>
          </div>
        </div>
      </div>
    );
  };
  const navGroups = [
    {
      title: t('group.main'),
      items: [
        { id: 'lobby', icon: Layout, label: t('nav.lobby') },
        { id: 'courses', icon: BookOpen, label: t('nav.courses') },
        { id: 'playrooms', icon: Gamepad, label: t('nav.playrooms') },
        { id: 'reports', icon: BarChart3, label: t('nav.reports') },
      ]
    },
    ...(user?.email === 'A0527698420@gmail.com' ? [{
      title: 'Admin Panel',
      items: [
        { id: 'admin-dash', icon: Shield, label: 'Analytics & Logs' },
        { id: 'admin-users', icon: Users, label: 'Users' },
        { id: 'admin-content', icon: Database, label: 'Content Management' },
        { id: 'admin-finance', icon: Coins, label: 'Finance' },
      ]
    }] : []),
    {
      title: t('group.creation'),
      items: [
        { id: 'wizard', icon: Sparkles, label: t('nav.wizard') },
        { id: 'academy', icon: GraduationCap, label: t('nav.academy') },
        { id: 'studio', icon: Clapperboard, label: t('nav.studio') },
        { id: 'course-builder', icon: PencilRuler, label: t('nav.course_builder') },
        { id: 'playroom-setup', icon: Rocket, label: t('nav.playroom_setup') },
        { id: 'overview', icon: Eye, label: t('nav.overview') },
      ]
    },
    {
      title: t('group.creators'),
      items: [
        { id: 'creator-dash', icon: LayoutDashboard, label: t('nav.creator_dash') },
        { id: 'leads', icon: Contact, label: t('nav.leads') },
      ]
    },
    {
      title: t('group.system'),
      items: [
        { id: 'prizes', icon: Gift, label: t('nav.prizes') },
        { id: 'prize-bag', icon: Briefcase, label: t('nav.prize_bag') },
        { id: 'knowledge', icon: Database, label: t('nav.knowledge') },
        { id: 'pricing', icon: Coins, label: t('nav.pricing') },
        { id: 'account', icon: SettingsIcon, label: t('nav.account') },
        { id: 'landing', icon: Layout, label: t('nav.back_to_home') },
      ]
    }
  ];

  const adminNavItems = [
    { id: 'admin-dash', icon: BarChart3, label: 'Overview' },
    { id: 'admin-users', icon: Users, label: 'Manage Users' },
    { id: 'admin-content', icon: Database, label: 'Global Content' },
    { id: 'admin-finance', icon: Star, label: 'Financials' },
  ];

  if (activeState === 'terms' || activeState === 'privacy' || activeState === 'refunds') {
    return (
      <LegalPage type={activeState} onBack={() => setActiveState(user ? 'account' : 'landing')} />
    );
  }

  if (activeState === 'pricing') {
    return (
      <PricingPage 
        isLoggedIn={!!user} 
        onBack={() => setActiveState(user ? 'account' : 'landing')} 
        onSelect={() => {
            if (!user) handleLogin();
            else handleUpgrade('pro', 'monthly');
          }}
        />
    );
  }

  if (!user && activeState === 'landing') {
    return (
      <LandingPage onLogin={handleLogin} onNavigate={setActiveState} />
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-[#0A0A12] flex items-center justify-center p-8 relative">
        <div className="max-w-md w-full text-center">
          <div className="w-20 h-20 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-blue-500/20">
            <BrainCircuit className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-4xl font-black mb-4">Welcome back!</h2>
          <p className="text-gray-500 mb-10">Sign in to continue your learning journey.</p>
          <button 
            onClick={handleLogin}
            className="w-full bg-white text-black py-4 rounded-xl font-black text-lg hover:bg-gray-100 transition-all flex items-center justify-center gap-3"
          >
            Sign in with Google
          </button>
          <button 
            onClick={() => setActiveState('landing')}
            className="mt-6 text-gray-500 hover:text-white transition-colors text-sm font-bold"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("flex min-h-screen bg-[#0A0A12] text-white", isRTL ? "rtl" : "ltr")} dir={isRTL ? "rtl" : "ltr"}>
      {/* Sidebar */}
      <aside className={cn("w-72 bg-[#0F0F1A] border-white/5 flex flex-col pt-8", isRTL ? "border-l" : "border-r")}>
        <div className="px-8 mb-10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
              <BrainCircuit className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-xl font-black tracking-tight">LEARNPLAY</h1>
          </div>
        </div>

        <nav className="flex-1 px-4 space-y-6 overflow-y-auto pb-8 custom-scrollbar">
          {navGroups.map((group, gIdx) => (
            <div key={gIdx} className="space-y-2">
              <h2 className="px-4 text-[10px] font-black uppercase tracking-[0.2em] text-gray-600 mb-2">
                {group.title}
              </h2>
              <div className="space-y-1">
                {group.items.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveState(item.id as AppState);
                      if (item.id.startsWith('admin-')) {
                        setIsAdminMode(true);
                      } else {
                        setIsAdminMode(false);
                      }
                    }}
                    className={cn(
                      "w-full flex items-center gap-4 px-4 py-2.5 rounded-xl transition-all duration-200 group text-left",
                      activeState === item.id 
                        ? "bg-blue-600/10 text-blue-400 border border-blue-500/20" 
                        : "text-gray-500 hover:text-white hover:bg-white/5"
                    )}
                  >
                    <item.icon className={cn("w-5 h-5 transition-colors", activeState === item.id ? "text-blue-400" : "text-gray-500 group-hover:text-blue-400")} />
                    <span className="font-bold text-xs">{item.label}</span>
                    {activeState === item.id && (
                      <motion.div layoutId="activeNavUser" className="ml-auto w-1 h-1 bg-blue-400 rounded-full" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </nav>

        <div className="p-4 mt-auto">
          <div className="bg-[#1E1E2E] rounded-2xl p-4 border border-white/5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-700">
                  <img src={user.photoURL || ''} alt="" referrerPolicy="no-referrer" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold truncate">{user.displayName}</p>
                  <p className="text-xs text-gray-500 truncate">Student Plan</p>
                </div>
              </div>
              <button 
                onClick={() => setLanguage(language === 'he' ? 'en' : 'he')}
                className="w-8 h-8 rounded-lg bg-white/5 border border-white/5 flex items-center justify-center text-[10px] font-black text-gray-500 hover:text-white hover:bg-white/10 transition-all"
              >
                {language === 'he' ? 'EN' : 'HE'}
              </button>
            </div>
            <button 
              onClick={() => auth.signOut()}
              className="w-full flex items-center justify-center gap-2 py-2 text-xs font-bold text-gray-400 hover:text-red-400 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              {t('nav.logout')}
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto bg-[#0A0A12] relative">
        <header className="sticky top-0 z-30 bg-[#0A0A12]/80 backdrop-blur-md px-8 py-6 flex items-center justify-between border-b border-white/5">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">
              {activeState.startsWith('admin-') 
                ? [...adminNavItems, ...navGroups.flatMap(g => g.items)].find(i => i.id === activeState)?.label 
                : navGroups.flatMap(g => g.items).find(i => i.id === activeState)?.label}
            </h2>
            <p className="text-sm text-gray-500">{t('header.explore') || 'Welcome back, exploring new knowledge?'}</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative group">
              <Search className={cn("absolute top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-hover:text-blue-400 transition-colors", isRTL ? "right-3" : "left-3")} />
              <input 
                type="text" 
                placeholder={t('header.search') || 'Search games or topics...'} 
                className={cn("bg-[#0F0F1A] border border-white/5 rounded-xl py-2 text-sm focus:outline-none focus:border-blue-500 transition-all w-64", isRTL ? "pr-10 pl-4" : "pl-10 pr-4")}
              />
            </div>
            <button className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 transition-colors">
              <Plus className="w-4 h-4" />
              {t('header.create') || 'Create'}
            </button>
          </div>
        </header>

        <AnimatePresence mode="wait">
          {activeState === 'lobby' && (
            <motion.div 
              key="lobby"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="p-8"
            >
              <HeroCarousel 
                isRTL={isRTL}
                onNavigate={setActiveState}
                onPreviewGame={(type) => {
                  const game = allEngines.find(g => g.type === type);
                  if (game) setPreviewGame({ game });
                }}
              />
              <GameMarket 
                engines={allEngines}
                datasets={allDatasets}
                onSelectGame={(g) => {
                  setPreviewGame({ game: g });
                }} 
                onSelectDataset={(d) => {
                  const game = allEngines.find(g => g.type === d.gameType);
                  if (game) {
                    setPreviewGame({ game, dataset: d });
                  }
                }}
              />
            </motion.div>
          )}

          {activeState === 'wizard' && (
            <motion.div
              key="wizard"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="p-8 max-w-4xl mx-auto"
            >
              {selectedGame ? (
                <div className="bg-[#1E1E2E] rounded-3xl border border-white/5 p-10">
                  <div className="flex items-center gap-4 mb-8">
                    <div className="bg-blue-600/10 p-3 rounded-2xl">
                      <Sparkles className="w-8 h-8 text-blue-500" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold">
                        {t('wizard.title').replace('{gameName}', selectedGame.name)}
                      </h3>
                      <p className="text-gray-500">{t('wizard.subtitle')}</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-500 uppercase tracking-widest pl-1">{t('wizard.domain')}</label>
                      <select 
                        value={domain}
                        onChange={(e) => setDomain(e.target.value)}
                        className="w-full bg-[#0F0F1A] border border-white/5 rounded-xl p-4 focus:outline-none focus:border-blue-500 transition-all font-bold"
                      >
                        <option value="Language & Vocab">{language === 'he' ? 'שפות ואוצר מילים' : 'Language & Vocab'}</option>
                        <option value="Science & Tech">{language === 'he' ? 'מדע וטכנולוגיה' : 'Science & Tech'}</option>
                        <option value="History & Arts">{language === 'he' ? 'היסטוריה ואמנות' : 'History & Arts'}</option>
                        <option value="Coding & Math">{language === 'he' ? 'תכנות ומתמטיקה' : 'Coding & Math'}</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-500 uppercase tracking-widest pl-1">{t('wizard.difficulty')}</label>
                      <select 
                        value={difficulty}
                        onChange={(e) => setDifficulty(e.target.value)}
                        className="w-full bg-[#0F0F1A] border border-white/5 rounded-xl p-4 focus:outline-none focus:border-blue-500 transition-all font-bold"
                      >
                        <option value="Apprentice">{language === 'he' ? 'מתחיל (קל)' : 'Apprentice (Easy)'}</option>
                        <option value="Journeyman">{language === 'he' ? 'מתקדם (בינוני)' : 'Journeyman (Mid)'}</option>
                        <option value="Master">{language === 'he' ? 'מאסטר (קשה)' : 'Master (Hard)'}</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-2 mb-10">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest pl-1">{t('wizard.prompt_label')}</label>
                    <textarea 
                      value={wizardInput}
                      onChange={(e) => setWizardInput(e.target.value)}
                      placeholder={t('wizard.prompt_placeholder')} 
                      className="w-full bg-[#0F0F1A] border border-white/5 rounded-2xl p-6 min-h-[200px] focus:outline-none focus:border-blue-500 transition-all text-gray-300 resize-none"
                      disabled={isGenerating}
                    />
                  </div>

                  <div className="flex flex-col md:flex-row items-center justify-between gap-6 pt-6 border-t border-white/5">
                    <div className="max-w-sm text-right rtl:text-right ltr:text-left">
                      <p className="text-xs text-gray-500 italic mb-2 leading-relaxed">
                        {language === 'he' 
                          ? 'הבינה המלאכותית שלנו תנתח את המידע ותבנה עבורך את המשחק המושלם.' 
                          : 'Our AI will extract the key information and structure it perfectly for this game.'}
                      </p>
                      {!aiUsage.isPremium && (
                        <p className="text-[10px] text-blue-400 font-bold uppercase tracking-wider">
                          {language === 'he' ? 'יצירות AI שנותרו' : 'Free Generations remaining'}: {aiUsage.left}/3
                        </p>
                      )}
                    </div>
                    <button 
                      onClick={handleGenerate}
                      disabled={isGenerating || !wizardInput}
                      className={cn(
                        "font-black px-10 py-4 rounded-xl transition-all flex items-center gap-3 shadow-xl min-w-[200px] justify-center",
                        isGenerating 
                          ? "bg-gray-800 text-gray-500 cursor-not-allowed" 
                          : "bg-blue-600 text-white hover:bg-blue-500 hover:scale-105 active:scale-95 shadow-blue-600/20"
                      )}
                    >
                      {isGenerating ? (
                        <>
                          <div className="w-5 h-5 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
                          <span>{t('wizard.generating')}</span>
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-5 h-5" />
                          <span>{t('wizard.generate')}</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-20 bg-[#1E1E2E] rounded-3xl border border-white/5">
                   <BrainCircuit className="w-20 h-20 text-blue-500/20 mx-auto mb-6" />
                   <h3 className="text-2xl font-bold mb-2 text-gray-400">{t('wizard.no_game_selected') || 'No game selected.'}</h3>
                   <button onClick={() => setActiveState('lobby')} className="text-blue-500 font-bold hover:underline">
                      {language === 'he' ? 'חזור לגלריה לבחירת משחק' : 'Go back to gallery'}
                   </button>
                </div>
              )}
            </motion.div>
          )}

          {activeState === 'reports' && (
            <motion.div
              key="reports"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="p-8"
            >
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                <div className="bg-[#1E1E2E] p-6 rounded-2xl border border-white/5 flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center">
                    <Star className="w-6 h-6 text-blue-500" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">Total Sessions</p>
                    <p className="text-2xl font-black">{sessions.length}</p>
                  </div>
                </div>
                <div className="bg-[#1E1E2E] p-6 rounded-2xl border border-white/5 flex items-center gap-4">
                  <div className="w-12 h-12 bg-purple-500/10 rounded-xl flex items-center justify-center">
                    <Gamepad2 className="w-6 h-6 text-purple-500" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">Avg Accuracy</p>
                    <p className="text-2xl font-black">
                      {sessions.length > 0 
                        ? (sessions.reduce((acc, s) => acc + s.accuracy, 0) / sessions.length * 100).toFixed(0) 
                        : 0}%
                    </p>
                  </div>
                </div>
                <div className="bg-[#1E1E2E] p-6 rounded-2xl border border-white/5 flex items-center gap-4">
                  <div className="w-12 h-12 bg-green-500/10 rounded-xl flex items-center justify-center">
                    <Sparkles className="w-6 h-6 text-green-500" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">Unique Games</p>
                    <p className="text-2xl font-black">{new Set(sessions.map(s => s.gameId)).size}</p>
                  </div>
                </div>
              </div>

              <div className="bg-[#1E1E2E] rounded-3xl border border-white/5 overflow-hidden">
                <div className="px-8 py-6 border-b border-white/5 flex justify-between items-center">
                  <h3 className="font-bold">Recent Learning History</h3>
                  <button className="text-blue-400 text-xs font-bold hover:underline">Download CSV</button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="text-xs text-gray-500 uppercase tracking-widest border-b border-white/5 bg-[#0F0F1A]/50">
                        <th className="px-8 py-4">Date</th>
                        <th className="px-8 py-4">Topic</th>
                        <th className="px-8 py-4">Game</th>
                        <th className="px-8 py-4">Score</th>
                        <th className="px-8 py-4">Accuracy</th>
                      </tr>
                    </thead>
                    <tbody className="text-sm">
                      {sessions.map(session => (
                        <tr key={session.sessionId || (session as any).id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                          <td className="px-8 py-4 text-gray-400">
                            {session.completed_at ? new Date(session.completed_at).toLocaleDateString() : 'Just now'}
                          </td>
                          <td className="px-8 py-4 font-semibold">{session.datasetTitle || (session as any).dataset_title}</td>
                          <td className="px-8 py-4 text-xs font-mono text-blue-400 uppercase">{session.gameName || (session as any).game_name}</td>
                          <td className="px-8 py-4 font-bold text-white">{session.score} / {session.maxScore || (session as any).max_score}</td>
                          <td className="px-8 py-4">
                            <div className="flex items-center gap-2">
                              <span className="font-bold">{((session.accuracy || 0) * 100).toFixed(0)}%</span>
                              <div className="w-16 h-1.5 bg-gray-800 rounded-full overflow-hidden">
                                <div 
                                  className={cn(
                                    "h-full transition-all duration-1000",
                                    (session.accuracy || 0) > 0.8 ? "bg-green-500" : (session.accuracy || 0) > 0.5 ? "bg-yellow-500" : "bg-red-500"
                                  )} 
                                  style={{ width: `${(session.accuracy || 0) * 100}%` }} 
                                />
                              </div>
                            </div>
                          </td>
                        </tr>
                      ))}
                      {sessions.length === 0 && (
                        <tr>
                          <td colSpan={5} className="px-8 py-20 text-center text-gray-500">
                            No learning sessions found. Start generating content to see your progress!
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          )}

          {activeState === 'knowledge' && (
            <motion.div key="knowledge" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-full">
              {viewingDataset ? (
                <div className="p-8 max-w-6xl mx-auto space-y-8">
                  <header className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <button 
                        onClick={() => setViewingDataset(null)}
                        className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors"
                      >
                        <ChevronRight className={cn("w-5 h-5", isRTL ? "" : "rotate-180")} />
                      </button>
                      <div className="text-right">
                        <h2 className="text-2xl font-black">{viewingDataset.title}</h2>
                        <p className="text-gray-500 text-sm">{language === 'he' ? 'מאגר ידע מעובד' : 'Processed Knowledge Base'} • {viewingDataset.domain}</p>
                      </div>
                    </div>
                  </header>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Content Section */}
                    <div className="bg-[#1E1E2E] rounded-3xl border border-white/5 p-8">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-500">
                          <Database className="w-4 h-4" />
                        </div>
                        <h3 className="font-bold">{language === 'he' ? 'תוכן המאגר' : 'Dataset Content'}</h3>
                      </div>
                      <div className="bg-[#0F0F1A] rounded-2xl p-6 border border-white/5 max-h-[500px] overflow-y-auto custom-scrollbar font-mono text-xs text-blue-300/80 leading-relaxed shadow-inner">
                        <pre>{JSON.stringify(viewingDataset.content, null, 2)}</pre>
                      </div>
                    </div>

                    {/* Metadata & Actions */}
                    <div className="space-y-6">
                      <div className="bg-[#1E1E2E] rounded-3xl border border-white/5 p-8">
                        <div className="flex items-center gap-3 mb-6">
                          <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center text-purple-400">
                            <BrainCircuit className="w-4 h-4" />
                          </div>
                          <h3 className="font-bold text-right">{language === 'he' ? 'ניתוח סכמות AI' : 'AI Schema Analysis'}</h3>
                        </div>
                        <div className="space-y-4">
                          <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                            <p className="text-[10px] text-gray-500 uppercase font-black mb-1">{language === 'he' ? 'מכניקת משחק' : 'Engine type'}</p>
                            <p className="font-bold text-white uppercase">{viewingDataset.gameType}</p>
                          </div>
                          <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                            <p className="text-[10px] text-gray-500 uppercase font-black mb-1">{language === 'he' ? 'סטטוס עיבוד' : 'Extraction Status'}</p>
                            <div className="flex items-center gap-2 text-green-500 text-sm font-bold">
                              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                              {language === 'he' ? 'בוצע בהצלחה' : 'Success'}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="bg-gradient-to-br from-blue-600/20 to-purple-600/20 rounded-3xl border border-blue-500/20 p-8">
                         <h4 className="font-black text-xl mb-4">{language === 'he' ? 'מוכן להפעלה!' : 'Ready to Play!'}</h4>
                         <p className="text-sm text-gray-400 mb-8 leading-relaxed">
                          {language === 'he' 
                            ? 'ה-AI עיבד את המידע ודאג שהוא יתאים בדיוק למכניקת המשחק שבחרתם. אתם יכולים להתחיל לשחק עם המידע הזה עכשיו.' 
                            : 'AI has processed this data to perfectly fit your chosen game mechanics. You can start playing with this content immediately.'}
                         </p>
                         <button 
                          onClick={() => {
                            const engine = allEngines.find(e => e.type === viewingDataset.gameType);
                            if (engine) {
                              setSelectedGame(engine);
                              setCurrentDataset(viewingDataset);
                              setActiveState('playing');
                            }
                          }}
                          className="w-full py-4 bg-white text-black rounded-xl font-black hover:bg-gray-100 transition-all flex items-center justify-center gap-3"
                         >
                           <Gamepad2 className="w-5 h-5" />
                           {language === 'he' ? 'שחק עכשיו עם המאגר' : 'Launch Game with Dataset'}
                         </button>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-8">
                  <header className="mb-10 text-right">
                    <h2 className="text-3xl font-black mb-2">{language === 'he' ? 'מאגרי ידע' : 'Knowledge Base'}</h2>
                    <p className="text-gray-500">{language === 'he' ? 'כל התכנים שה-AI יצר עבורך ממסמכים ומידע חיצוני' : 'All assets generated by AI from your documents and URLs'}</p>
                  </header>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {allDatasets
                      .filter(d => d.title.toLowerCase().includes(knowledgeSearch.toLowerCase()) || d.domain.toLowerCase().includes(knowledgeSearch.toLowerCase()))
                      .map((ds) => (
                      <motion.div
                        key={ds.datasetId || (ds as any).id}
                        whileHover={{ scale: 1.02 }}
                        onClick={() => setViewingDataset(ds)}
                        className="bg-[#1E1E2E]/50 border border-white/5 p-6 rounded-3xl flex flex-col gap-4 group cursor-pointer hover:border-blue-500/30 transition-all text-right"
                      >
                         <div className="flex items-center gap-3 justify-end">
                          <Eye className="w-4 h-4 text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                          <div className="text-right flex-1">
                            <h4 className="font-bold text-white group-hover:text-blue-400 transition-colors">{ds.title}</h4>
                            <p className="text-xs text-gray-500">{ds.domain}</p>
                          </div>
                          <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-400">
                            <BrainCircuit className="w-6 h-6" />
                          </div>
                        </div>
                        <p className="text-sm text-gray-400 line-clamp-2">{ds.description}</p>
                        <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between">
                          <span className="text-xs text-blue-500 font-bold group-hover:underline">{language === 'he' ? 'צפה בנתונים' : 'View Content'}</span>
                          <span className="px-3 py-1 bg-white/5 rounded-full text-[10px] font-black uppercase text-gray-500">{ds.gameType}</span>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {activeState === 'admin-dash' && (
            <motion.div key="admin" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-8">
              <h2 className="text-4xl font-black mb-10">Admin Dashboard & AI Logs</h2>
              <div className="space-y-6">
                {debugLogs.map(log => (
                  <div key={log.id} className="bg-[#1E1E2E] rounded-2xl p-6 border border-white/5 font-mono text-xs">
                    <div className="flex justify-between mb-4 items-center">
                      <span className={cn(
                        "px-2 py-1 rounded-full text-[10px] font-black uppercase",
                        log.type === 'success' ? "bg-green-500/10 text-green-500" : 
                        log.type === 'request' ? "bg-blue-500/10 text-blue-500" : "bg-red-500/10 text-red-500"
                      )}>
                        {log.type}
                      </span>
                      <span className="text-gray-500">{log.timestamp ? new Date(log.timestamp.seconds * 1000).toLocaleString() : 'Just now'}</span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <p className="font-bold text-blue-400 text-[10px] uppercase underline">Input / Prompt</p>
                        <div className="bg-black/50 p-4 rounded-xl overflow-auto max-h-48 text-gray-300">
                          {log.prompt || log.customInput || JSON.stringify(log)}
                        </div>
                      </div>
                      <div className="space-y-2">
                         <p className="font-bold text-purple-400 text-[10px] uppercase underline">Output / Result</p>
                         <div className="bg-black/50 p-4 rounded-xl overflow-auto max-h-48 text-gray-300">
                          {log.responseText || log.error || "No response recorded."}
                        </div>
                      </div>
                    </div>
                    {log.systemInstruction && (
                      <div className="mt-4">
                         <p className="font-bold text-yellow-400 text-[10px] uppercase underline">System Instruction</p>
                         <div className="bg-black/50 p-4 rounded-xl text-gray-400 mt-2">
                           {log.systemInstruction}
                         </div>
                      </div>
                    )}
                  </div>
                ))}
                {debugLogs.length === 0 && (
                  <div className="text-center py-20 text-gray-500">No AI logs available.</div>
                )}
              </div>
            </motion.div>
          )}
          {activeState === 'playing' && selectedGame && currentDataset && (
            <div className="fixed inset-0 z-[200] flex flex-col bg-[#050510]">
              <GameNavbar 
                onBack={() => setActiveState('lobby')}
                onSwapLanguages={() => {
                  const swapped = { ...currentDataset };
                  if (swapped.content.items) {
                    swapped.content.items = swapped.content.items.map((i: any) => ({
                      ...i,
                      prompt: i.target || i.label || i.prompt,
                      target: i.prompt
                    }));
                  } else if (swapped.content.pairs) {
                    swapped.content.pairs = swapped.content.pairs.map((i: any) => ({
                      ...i,
                      prompt: i.target || i.label || i.prompt,
                      target: i.prompt
                    }));
                  }
                  setCurrentDataset({ ...swapped, datasetId: crypto.randomUUID() });
                }}
                onChangeFile={() => setActiveState('lobby')}
              />
              <motion.div
                key="playing"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex-1 relative overflow-hidden"
              >
                {selectedGame.type === 'uav-intercept' ? (
                  <UavGame 
                    dataset={currentDataset} 
                    onExit={() => setActiveState('lobby')}
                    onComplete={async (acc) => {
                      const score = Math.round(acc * 100);
                      if (!user) return;
                      
                      const sessionId = crypto.randomUUID();
                      const session = {
                        sessionId,
                        userId: user.uid,
                        userName: user.displayName || '',
                        gameId: selectedGame.gameId || (selectedGame as any).id,
                        gameName: selectedGame.name,
                        datasetId: currentDataset.datasetId || (currentDataset as any).id,
                        datasetTitle: currentDataset.title,
                        domain,
                        score,
                        maxScore: 100,
                        accuracy: acc,
                        durationMs: 0,
                      };
                      
                      await api.saveSession(session);
                      setActiveState('reports');
                    }}
                  />
                ) : (
                  <GameStage 
                    game={selectedGame} 
                    dataset={currentDataset} 
                    onComplete={async (score) => {
                      if (!user) return;
                      
                      const sessionId = crypto.randomUUID();
                      const session = {
                        sessionId,
                        userId: user.uid,
                        userName: user.displayName || '',
                        gameId: selectedGame.gameId || (selectedGame as any).id,
                        gameName: selectedGame.name,
                        datasetId: currentDataset.datasetId || (currentDataset as any).id,
                        datasetTitle: currentDataset.title,
                        domain,
                        score,
                        maxScore: 100,
                        accuracy: score/100,
                        durationMs: 0,
                      };
                      
                      await api.saveSession(session);
                      setActiveState('reports');
                    }}
                  />
                )}
              </motion.div>
            </div>
          )}

          {activeState === 'admin-dash' && isAdminMode && (
            <motion.div key="admin-dash-legacy" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <AdminDashboard sessions={sessions} />
            </motion.div>
          )}

          {activeState === 'admin-users' && isAdminMode && (
            <motion.div key="admin-users" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-8">
               <UnifiedTable 
                title="User Management"
                data={[
                  { name: 'Alex Regev', email: 'alex@example.com', plan: 'Pro', usage: 124, lastActive: '2h ago' },
                  { name: 'Maya Cohen', email: 'maya@example.com', plan: 'Free', usage: 3, lastActive: '1d ago' },
                  { name: 'Dan Levi', email: 'dan@example.com', plan: 'Free', usage: 1, lastActive: '1w ago' },
                ]}
                columns={[
                  { key: 'name', label: 'Name' },
                  { key: 'email', label: 'Email' },
                  { key: 'plan', label: 'Plan', render: (val) => (
                    <span className={cn("px-2 py-0.5 rounded-lg text-[10px] font-black outline outline-1 outline-white/10", val === 'Pro' ? 'bg-blue-500/20 text-blue-400' : 'bg-white/5 text-gray-500')}>
                      {val}
                    </span>
                  )},
                  { key: 'usage', label: 'AI Quota' },
                  { key: 'lastActive', label: 'Activity' },
                ]}
              />
            </motion.div>
          )}

          {activeState === 'admin-content' && isAdminMode && (
            <motion.div key="admin-content" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-8">
               <UnifiedTable 
                title="Community & System Content"
                data={allDatasets}
                columns={[
                  { key: 'title', label: 'Dataset Title' },
                  { key: 'domain', label: 'Domain', render: (val) => <span className="text-blue-400 font-mono text-xs">{val}</span> },
                  { key: 'gameType', label: 'Engine' },
                  { key: 'isPublic', label: 'Visibility', render: (val) => val ? 'Public' : 'Private' },
                  { key: 'createdAt', label: 'Created' },
                ]}
              />
            </motion.div>
          )}

          {activeState === 'admin-finance' && isAdminMode && (
            <motion.div key="admin-finance" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-8">
               <UnifiedTable 
                title="Global Revenue Streams"
                data={[
                  { id: 'pay_1', user: 'alex@example', amount: '$9.99', provider: 'Paddle', status: 'Completed' },
                  { id: 'pay_2', user: 'itai@example', amount: '₪120', provider: 'Nedarim', status: 'Pending' },
                ]}
                columns={[
                  { key: 'id', label: 'TX ID' },
                  { key: 'user', label: 'Payer' },
                  { key: 'amount', label: 'Value' },
                  { key: 'provider', label: 'Gateway' },
                  { key: 'status', label: 'Status' },
                ]}
              />
            </motion.div>
          )}

          {['courses', 'playrooms', 'academy', 'studio', 'course-builder', 'playroom-setup', 'overview', 'creator-dash', 'leads', 'prizes', 'prize-bag'].includes(activeState) && (
            <motion.div 
              key={activeState}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-12 flex flex-col items-center justify-center min-h-[60vh] text-center"
            >
              <div className="w-24 h-24 bg-blue-500/10 rounded-3xl flex items-center justify-center mb-8">
                <Rocket className="w-12 h-12 text-blue-500 animate-pulse" />
              </div>
              <h2 className="text-3xl font-black mb-4">בקרוב ב-LearnPlay!</h2>
              <p className="text-gray-500 max-w-md mx-auto leading-relaxed">
                אנחנו עובדים במרץ על פיתוח הפיצ'ר "{navGroups.flatMap(g => g.items).find(i => i.id === activeState)?.label}" כדי להפוך את הלמידה שלכם למרתקת עוד יותר. הישארו מעודכנים!
              </p>
              <button 
                onClick={() => setActiveState('lobby')}
                className="mt-10 px-8 py-3 bg-white/5 border border-white/10 hover:bg-white/10 rounded-xl font-bold transition-all"
              >
                חזרה לגלריית המשחקים
              </button>
            </motion.div>
          )}

          {activeState === 'account' && (
             <motion.div
              key="account"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="min-h-screen"
            >
              {checkoutConfig ? (
                <div className="p-8 max-w-4xl mx-auto">
                  <div className="bg-[#1E1E2E] rounded-3xl border border-white/5 overflow-hidden shadow-2xl">
                    <NedarimCheckout 
                      user={user}
                      plan={checkoutConfig.plan}
                      billingCycle={checkoutConfig.billingCycle}
                      onSuccess={() => {
                        setCheckoutConfig(null);
                        setActiveState('lobby');
                      }}
                      onCancel={() => setCheckoutConfig(null)}
                    />
                  </div>
                </div>
              ) : (
                <UserProfilePage 
                  profile={profile}
                  sessions={sessions}
                  isRTL={isRTL}
                  onLogout={handleLogout}
                  onUpgrade={(plan, cycle) => setCheckoutConfig({ plan, billingCycle: cycle })}
                />
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <AnimatePresence>
        {previewGame && (
          <GamePreviewModal 
            game={previewGame.game} 
            dataset={previewGame.dataset}
            onClose={() => setPreviewGame(null)}
            onPlay={() => {
              setSelectedGame(previewGame.game);
              const targetDataset = previewGame.dataset || allDatasets.find(d => d.gameType === previewGame.game.type);
              
              if (targetDataset) {
                setCurrentDataset(targetDataset);
                setActiveState('playing');
              } else {
                setActiveState('wizard');
              }
              setPreviewGame(null);
            }}
            onCustomize={() => {
              setSelectedGame(previewGame.game);
              setActiveState('wizard');
              setPreviewGame(null);
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}


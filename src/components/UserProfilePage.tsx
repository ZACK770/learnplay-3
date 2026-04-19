import React from 'react';
import { motion } from 'motion/react';
import { 
  User, Mail, Calendar, Award, TrendingUp, Target, 
  Settings, LogOut, CheckCircle2, Crown, Star, Shield,
  CreditCard, Clock, ChevronRight
} from 'lucide-react';
import { UserProfile, GameSession } from '../types';
import { cn } from '../lib/utils';

interface UserProfilePageProps {
  profile: UserProfile | null;
  sessions: GameSession[];
  onLogout: () => void;
  onUpgrade: (plan: 'pro' | 'premium' | 'creator', cycle: 'monthly' | 'annual') => void;
  isRTL?: boolean;
}

export default function UserProfilePage({ 
  profile, 
  sessions, 
  onLogout, 
  onUpgrade,
  isRTL = false 
}: UserProfilePageProps) {
  if (!profile) {
    return (
      <div className="flex items-center justify-center p-20">
        <div className="w-12 h-12 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" />
      </div>
    );
  }

  const stats = {
    totalPlays: sessions.length,
    avgAccuracy: sessions.length > 0 
      ? (sessions.reduce((acc, s) => acc + (s.accuracy || 0), 0) / sessions.length) * 100 
      : 0,
    topGame: sessions.length > 0
      ? sessions.reduce((acc: any, s) => {
          acc[s.gameName] = (acc[s.gameName] || 0) + 1;
          return acc;
        }, {})
      : null
  };

  const getTopGame = () => {
    if (!stats.topGame) return 'N/A';
    return Object.entries(stats.topGame).sort((a: any, b: any) => b[1] - a[1])[0][0];
  };

  return (
    <div className={cn("max-w-6xl mx-auto p-4 md:p-8 space-y-8", isRTL && "text-right")}>
      {/* Profile Header */}
      <section className="bg-[#1E1E2E] rounded-3xl border border-white/5 p-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 blur-3xl -mr-32 -mt-32 rounded-full" />
        <div className="relative flex flex-col md:flex-row items-center gap-8">
          <div className="relative">
            <div className="w-32 h-32 rounded-3xl bg-gradient-to-br from-blue-500 to-purple-600 p-1">
              <div className="w-full h-full rounded-[20px] bg-[#1E1E2E] flex items-center justify-center overflow-hidden">
                {profile.photoURL || profile.photo_url ? (
                  <img src={profile.photoURL || profile.photo_url} alt={profile.display_name} className="w-full h-full object-cover" />
                ) : (
                  <User className="w-12 h-12 text-blue-400" />
                )}
              </div>
            </div>
            {profile.is_premium && (
              <div className="absolute -bottom-2 -right-2 bg-yellow-500 text-black p-2 rounded-xl shadow-lg">
                <Crown className="w-4 h-4" />
              </div>
            )}
          </div>

          <div className="flex-1 space-y-2">
            <h2 className="text-4xl font-black text-white">{profile.display_name || profile.displayName}</h2>
            <div className="flex flex-wrap items-center gap-4 text-gray-400">
              <span className="flex items-center gap-2 text-sm"><Mail className="w-4 h-4" /> {profile.email}</span>
              <span className="flex items-center gap-2 text-sm">
                <Calendar className="w-4 h-4" /> 
                {isRTL ? 'חבר מאז' : 'Joined'} {new Date(profile.created_at || profile.createdAt!).toLocaleDateString()}
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-3 w-full md:w-auto">
            <button 
              onClick={onLogout}
              className="px-6 py-3 bg-red-500/10 text-red-500 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-red-500/20 transition-all"
            >
              <LogOut className="w-4 h-4" />
              {isRTL ? 'התנתק מהחשבון' : 'Sign Out'}
            </button>
          </div>
        </div>
      </section>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          icon={<TrendingUp className="w-5 h-5 text-blue-400" />}
          label={isRTL ? 'סה"כ נקודות XP' : 'Total XP'}
          value={(profile.total_xp || profile.totalXP || 0).toLocaleString()}
          color="blue"
        />
        <StatCard 
          icon={<Award className="w-5 h-5 text-purple-400" />}
          label={isRTL ? 'משחקים ששוחקו' : 'Games Played'}
          value={stats.totalPlays.toString()}
          color="purple"
        />
        <StatCard 
          icon={<Target className="w-5 h-5 text-green-400" />}
          label={isRTL ? 'דיוק ממוצע' : 'Avg Accuracy'}
          value={`${stats.avgAccuracy.toFixed(1)}%`}
          color="green"
        />
        <StatCard 
          icon={<Star className="w-5 h-5 text-yellow-500" />}
          label={isRTL ? 'משחק מועדף' : 'Top Game'}
          value={getTopGame()}
          color="yellow"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Progress & Sessions */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-[#1E1E2E] rounded-3xl border border-white/5 p-8">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-xl font-black">{isRTL ? 'התקדמות אחרונה' : 'Recent Progress'}</h3>
              <TrendingUp className="w-5 h-5 text-gray-500" />
            </div>
            
            <div className="space-y-4">
              {sessions.slice(0, 5).map((session) => (
                <div 
                  key={session.sessionId || (session as any).id}
                  className="bg-white/5 p-4 rounded-2xl flex items-center justify-between group hover:bg-white/10 transition-all"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400">
                      <Target className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm">{session.datasetTitle || (session as any).dataset_title}</h4>
                      <p className="text-[10px] text-gray-500 uppercase tracking-widest">{session.gameName || (session as any).game_name}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-black text-white">{session.score} XP</div>
                    <div className="text-[10px] text-gray-500">{new Date(session.completed_at || session.completedAt).toLocaleDateString()}</div>
                  </div>
                </div>
              ))}
              {sessions.length === 0 && (
                <p className="text-center py-12 text-gray-500 italic">{isRTL ? 'עדיין לא שוחקו משחקים' : 'No games played yet'}</p>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Settings & Subscription */}
        <div className="space-y-8">
          {/* Subscription Info */}
          <div className="bg-[#1E1E2E] rounded-3xl border border-white/5 p-8 relative overflow-hidden group">
            {profile.is_premium && <div className="absolute top-0 right-0 w-24 h-24 bg-yellow-500/10 blur-2xl rounded-full -mr-12 -mt-12" />}
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-black">{isRTL ? 'החבילה שלי' : 'My Plan'}</h3>
              {profile.is_premium ? <Crown className="w-5 h-5 text-yellow-500" /> : <Shield className="w-5 h-5 text-gray-500" />}
            </div>

            <div className="space-y-6">
              <div className="p-4 bg-white/5 rounded-2xl">
                <div className="text-[10px] text-gray-500 uppercase tracking-widest font-bold mb-1">{isRTL ? 'מסלול פעיל' : 'Active Tier'}</div>
                <div className="text-2xl font-black text-blue-400 uppercase">{profile.plan}</div>
              </div>

              {!profile.is_premium ? (
                <button 
                  onClick={() => onUpgrade('pro', 'monthly')}
                  className="w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl font-black text-white shadow-xl shadow-blue-500/20 hover:scale-[1.02] transition-all"
                >
                  {isRTL ? 'שדרג ל-PRO עכשיו' : 'Upgrade to PRO'}
                </button>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-400">{isRTL ? 'תוקף המנוי' : 'Subscription Expiry'}</span>
                    <span className="text-white font-bold">{profile.subscription_expiry ? new Date(profile.subscription_expiry).toLocaleDateString() : 'N/A'}</span>
                  </div>
                  <button className="w-full py-3 bg-white/5 border border-white/10 rounded-xl text-xs font-bold text-gray-400">
                    {isRTL ? 'נהל מנוי' : 'Manage Subscription'}
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Quick Settings */}
          <div className="bg-[#1E1E2E] rounded-3xl border border-white/5 p-8">
            <h3 className="text-xl font-black mb-6">{isRTL ? 'הגדרות חשבון' : 'Account Settings'}</h3>
            <div className="space-y-2">
              <SettingsLink icon={<Settings className="w-4 h-4" />} label={isRTL ? 'עריכת פרופיל' : 'Edit Profile'} isRTL={isRTL} />
              <SettingsLink icon={<Shield className="w-4 h-4" />} label={isRTL ? 'אבטחה ופרטיות' : 'Security & Privacy'} isRTL={isRTL} />
              <SettingsLink icon={<CreditCard className="w-4 h-4" />} label={isRTL ? 'אמצעי תשלום' : 'Payment Methods'} isRTL={isRTL} />
              <SettingsLink icon={<Clock className="w-4 h-4" />} label={isRTL ? 'היסטוריית חיובים' : 'Billing History'} isRTL={isRTL} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, color }: { icon: React.ReactNode, label: string, value: string, color: string }) {
  const colors: Record<string, string> = {
    blue: "bg-blue-500/10 border-blue-500/20",
    purple: "bg-purple-500/10 border-purple-500/20",
    green: "bg-green-500/10 border-green-500/20",
    yellow: "bg-yellow-500/10 border-yellow-500/20"
  };

  return (
    <div className={cn("bg-[#1E1E2E] rounded-2xl border border-white/5 p-6 flex flex-col gap-4", colors[color])}>
      <div className="flex items-center justify-between text-gray-500">
        <span className="text-[10px] uppercase font-black tracking-widest">{label}</span>
        {icon}
      </div>
      <div className="text-3xl font-black text-white">{value}</div>
    </div>
  );
}

function SettingsLink({ icon, label, isRTL }: { icon: React.ReactNode, label: string, isRTL: boolean }) {
  return (
    <button className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-white/5 transition-all text-sm group">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-gray-400 group-hover:text-white group-hover:bg-white/10">
          {icon}
        </div>
        <span className="text-gray-400 group-hover:text-white font-medium">{label}</span>
      </div>
      <ChevronRight className={cn("w-4 h-4 text-gray-600 group-hover:text-blue-500 transition-all", isRTL ? "rotate-180" : "")} />
    </button>
  );
}

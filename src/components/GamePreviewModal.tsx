import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  Play, 
  Settings, 
  Star, 
  Users, 
  Info, 
  TrendingUp, 
  Gamepad, 
  Target,
  Clock,
  MessageCircle,
  BarChart3,
  ChevronLeft
} from 'lucide-react';
import { cn } from '../lib/utils';
import { GameEngine, Dataset } from '../types';

import { useTranslation } from '../contexts/TranslationContext';

interface GamePreviewModalProps {
  game: GameEngine;
  dataset?: Dataset;
  onClose: () => void;
  onPlay: () => void;
  onCustomize: () => void;
}

const GamePreviewModal: React.FC<GamePreviewModalProps> = ({ 
  game, 
  dataset, 
  onClose, 
  onPlay, 
  onCustomize 
}) => {
  const { t, isRTL } = useTranslation();
  
  const ratings = [
    { label: t('game.rating.content') || 'איכות התוכן', value: 3.0 },
    { label: t('game.rating.ease') || 'קלות הלמידה', value: 1.5 },
    { label: t('game.rating.knowledge') || 'רמת הידע', value: 2.5 },
    { label: t('game.rating.fun') || 'כיף', value: 3.0 },
    { label: t('game.rating.design') || 'עיצוב', value: 2.5 }
  ];

  const comments = [
    { user: 'd0527698420', text: 'אחלה משחק', time: 'לפני שעה' },
    { user: 'אביק', text: 'שיחליף ע"י לחיצה ולא לחזור לתפריט', time: 'לפני 3 שעות' }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
      />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="relative w-full max-w-5xl bg-[#0F0F1A] border border-white/10 rounded-[40px] overflow-hidden shadow-2xl flex flex-col md:flex-row max-h-[90vh]"
      >
        {/* Navigation - Top corner (logical) */}
        <button 
          onClick={onClose}
          className={cn(
            "absolute top-6 p-2 rounded-xl bg-white/5 hover:bg-white/10 transition-all border border-white/10 z-10",
            isRTL ? "left-6" : "right-6"
          )}
        >
          <X className="w-5 h-5" />
        </button>

        {/* Left Side (Visual & Stats) */}
        <div className="md:w-[450px] bg-[#1E1E2E] p-8 border-white/5 flex flex-col overflow-y-auto custom-scrollbar">
          <div className="relative aspect-video rounded-3xl overflow-hidden mb-8 shadow-2xl group">
            <img 
              src={game.thumbnail} 
              alt={game.name} 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="absolute top-4 right-4 bg-blue-600 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">
              {game.type.replace('-', ' ')}
            </div>
          </div>

          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <div className="min-w-0">
                <h1 className="text-3xl font-black mb-2 truncate">{game.name}</h1>
                <div className="flex items-center gap-2 text-gray-400 text-sm">
                  <span className="bg-[#0A0A12] px-2 py-0.5 rounded text-[10px] font-mono border border-white/5 truncate">
                    {t('game.by')} {game.authorName}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1 text-yellow-400 shrink-0">
                    <Star className="w-3 h-3 fill-yellow-400" />
                    {game.rating}
                  </span>
                </div>
              </div>
              <div className="text-right shrink-0">
                <p className="text-2xl font-black text-blue-500">{game.playsCount}</p>
                <p className="text-[10px] font-bold uppercase text-gray-500 tracking-wider font-mono">{t('game.players')}</p>
              </div>
            </div>

            <p className="text-gray-400 leading-relaxed text-sm">
              {game.description}
            </p>

            {dataset && (
              <div className="bg-blue-600/10 border border-blue-500/20 p-5 rounded-3xl">
                <div className="flex items-center gap-3 mb-2">
                  <Info className="w-4 h-4 text-blue-400" />
                  <span className="text-xs font-black uppercase text-blue-400 tracking-widest truncate">{dataset.title}</span>
                </div>
                <p className="text-xs text-gray-300 leading-relaxed font-medium">
                  {dataset.description}
                </p>
              </div>
            )}

            {/* Ratings Breakdown */}
            <div className="space-y-4">
              <h3 className="text-xs font-black uppercase text-gray-500 tracking-widest border-b border-white/5 pb-2">
                {t('game.what_others_think')}
              </h3>
              <div className="grid gap-3">
                {ratings.map((r, i) => (
                  <div key={i} className="space-y-1.5">
                    <div className="flex justify-between items-center text-[11px] font-bold">
                      <span className="text-gray-400">{r.label}</span>
                      <span className="text-blue-400">{r.value.toFixed(1)}</span>
                    </div>
                    <div className="h-1.5 bg-[#0A0A12] rounded-full overflow-hidden border border-white/5">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${(r.value / 5) * 100}%` }}
                        className="h-full bg-blue-600"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Side (Actions) */}
        <div className="flex-1 p-10 flex flex-col overflow-y-auto custom-scrollbar relative">
          <header className="mb-12 mt-4">
            <h2 className="text-xs font-black uppercase text-gray-600 tracking-[0.3em] mb-4 text-center">
              {t('game.choose_mission')}
            </h2>
            <div className="flex items-center justify-center gap-6">
               <div className="text-center">
                  <p className="text-4xl font-black text-white">#1</p>
                  <p className="text-[10px] text-gray-500 font-bold uppercase">{t('game.stat.daily_rank')}</p>
               </div>
               <div className="w-px h-10 bg-white/5" />
               <div className="text-center">
                  <p className="text-4xl font-black text-white">4.2</p>
                  <p className="text-[10px] text-gray-500 font-bold uppercase">9 {t('game.reviews')}</p>
               </div>
            </div>
          </header>

          <div className="grid grid-cols-1 gap-6 mb-12">
             <button 
              onClick={onPlay}
              className="group relative h-32 rounded-3xl bg-blue-600 hover:bg-blue-500 transition-all shadow-2xl shadow-blue-600/20 overflow-hidden flex items-center p-8 gap-6 text-right rtl:flex-row-reverse ltr:flex-row"
             >
                <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform shrink-0">
                   <Play className={cn("w-8 h-8 fill-white", isRTL && "rotate-180")} />
                </div>
                <div className="flex-1">
                   <h3 className="text-3xl font-black mb-1">{t('game.play_now')}</h3>
                   <p className="text-blue-100 text-sm opacity-80">{t('game.play_now_sub')}</p>
                </div>
                <div className="absolute bottom-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mb-16 blur-3xl" />
             </button>

             <button 
              onClick={onCustomize}
              className="group relative h-32 rounded-3xl bg-[#1E1E2E] border border-white/10 hover:border-blue-500/50 transition-all overflow-hidden flex items-center p-8 gap-6 text-right rtl:flex-row-reverse ltr:flex-row"
             >
                <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center group-hover:bg-blue-500/20 transition-all shrink-0">
                   <Settings className="w-8 h-8 text-blue-400" />
                </div>
                <div className="flex-1">
                   <h3 className="text-3xl font-black mb-1">{t('game.customize')}</h3>
                   <p className="text-gray-500 text-sm">{t('game.customize_sub')}</p>
                </div>
             </button>
          </div>

          {/* Comments Section */}
          <div className="mt-auto pt-10 border-t border-white/5">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-lg font-bold flex items-center gap-3">
                <MessageCircle className="w-5 h-5 text-gray-500" />
                {t('game.recent_comments')}
              </h3>
              <button className="text-blue-400 text-sm font-bold hover:underline">{t('game.rate_btn')}</button>
            </div>
            <div className="space-y-6">
              {comments.map((c, i) => (
                <div key={i} className="bg-[#1E1E2E]/50 p-6 rounded-3xl border border-white/5 shadow-sm">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-black text-blue-400">@{c.user}</span>
                    <span className="text-[10px] text-gray-600 uppercase font-bold tracking-widest">{c.time}</span>
                  </div>
                  <p className="text-gray-300 text-sm leading-relaxed">{c.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default GamePreviewModal;

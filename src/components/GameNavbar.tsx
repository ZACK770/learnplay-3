import React from 'react';
import { ArrowLeft, FolderOpen, Star, Zap, Coins } from 'lucide-react';
import { cn } from '../lib/utils';

interface GameNavbarProps {
  onBack: () => void;
  onSwapLanguages?: () => void;
  onChangeFile?: () => void;
  stats?: {
    stars: number;
    zap: number;
    coins: number;
  };
}

const GameNavbar: React.FC<GameNavbarProps> = ({ 
  onBack, 
  onSwapLanguages, 
  onChangeFile,
  stats = { stars: 0, zap: 1919, coins: 833 } 
}) => {
  return (
    <div className="flex-shrink-0 bg-[#0a0a1a] border-b border-white/10 z-[60]" dir="rtl">
      <div className="flex items-center justify-between px-4 py-3">
        {/* Navigation Actions */}
        <div className="flex items-center gap-3">
          <button 
            onClick={onBack}
            className="flex items-center gap-2 px-4 py-2 bg-white/95 text-gray-800 rounded-xl hover:bg-white text-sm font-black shadow-xl transition-all active:scale-95"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>חזרה</span>
          </button>
          
          <button 
            onClick={onSwapLanguages}
            className="flex items-center gap-2 px-4 py-2 bg-white/95 text-gray-800 rounded-xl hover:bg-white text-sm font-black shadow-xl transition-all active:scale-95"
            title="הפוך שפת מקור ויעד"
          >
            <span className="text-lg leading-none">🔄</span>
            <span>הפוך שפות</span>
          </button>

          <button 
            onClick={onChangeFile}
            className="flex items-center gap-2 px-4 py-2 bg-white/95 text-gray-800 rounded-xl hover:bg-white text-sm font-black shadow-xl transition-all active:scale-95"
            title="בחר קובץ ממאגרי מידע"
          >
            <FolderOpen className="w-4 h-4" />
            <span>החלף קובץ</span>
          </button>
        </div>

        {/* Global Game Stats */}
        <div className="flex items-center gap-2 sm:gap-4">
          <div className="flex items-center gap-2 bg-blue-600/90 text-white px-4 py-2 rounded-xl shadow-xl border border-blue-400/30">
            <Star className="w-4 h-4 fill-yellow-300 text-yellow-300" />
            <span className="font-black text-lg leading-none">{stats.stars}</span>
          </div>
          
          <div className="flex items-center gap-3 bg-white/95 px-4 py-2 rounded-xl shadow-xl border border-white/20">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-blue-600 fill-blue-600" />
              <span className="font-black text-md text-blue-800 leading-none">{stats.zap}</span>
            </div>
            <div className="h-4 w-[1px] bg-gray-300" />
            <div className="flex items-center gap-2">
              <Coins className="w-4 h-4 text-amber-500 fill-amber-500" />
              <span className="font-black text-md text-amber-700 leading-none">{stats.coins}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameNavbar;

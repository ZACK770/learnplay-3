import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Play, 
  Copy, 
  Sparkles, 
  Wand2, 
  BookOpen, 
  Search, 
  Star 
} from 'lucide-react';
import { cn } from '../lib/utils';

interface Slide {
  id: number;
  badge: string;
  badgeIcon: React.ReactNode;
  badgeColor: string;
  title: React.ReactNode;
  description: string;
  image: string;
  primaryBtn: {
    label: string;
    icon: React.ReactNode;
    color: string;
    onClick?: () => void;
  };
  secondaryBtn?: {
    label: string;
    icon: React.ReactNode;
    onClick?: () => void;
  };
  overlayColor: string;
}

const slides: Slide[] = [
  {
    id: 0,
    badge: "מומלץ השבוע",
    badgeIcon: <Star className="w-3.5 h-3.5 fill-current" />,
    badgeColor: "bg-amber-500 shadow-amber-500/30",
    title: "חדר בריחה: אמת או שקר",
    description: "התראת אבטחה! רמות החמצן קריטיות. ענו מהר על השאלות כדי לפרוץ את המערכת ולמנוע נעילה מוחלטת. כל שנייה קובעת!",
    image: "https://images.unsplash.com/photo-1519074069444-1ba4fff66d16?q=80&w=1200",
    primaryBtn: {
      label: "יאללה לשחק",
      icon: <Play className="w-5 h-5 fill-current" />,
      color: "bg-blue-600 hover:bg-blue-500 shadow-blue-500/40"
    },
    secondaryBtn: {
      label: "שכפל לעריכה",
      icon: <Copy className="w-5 h-5" />
    },
    overlayColor: "from-slate-900/95 via-slate-900/60 to-transparent"
  },
  {
    id: 1,
    badge: "חדש ב-LearnPlay",
    badgeIcon: <Sparkles className="w-3.5 h-3.5 fill-current" />,
    badgeColor: "bg-fuchsia-600 shadow-fuchsia-600/30",
    title: (
      <>
        הכירו את <br />
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-300 to-pink-200">סטודיו היוצרים</span>
      </>
    ),
    description: "הפכו כל דף עבודה יבש למשחק אינטראקטיבי ומרתק תוך דקות בעזרת הבינה המלאכותית שלנו. אין צורך בידע קודם!",
    image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=1200",
    primaryBtn: {
      label: "נסה את סטודיו היוצרים",
      icon: <Wand2 className="w-5 h-5" />,
      color: "bg-white text-blue-900 hover:bg-slate-50"
    },
    overlayColor: "from-blue-900/95 via-blue-950/80 to-transparent"
  },
  {
    id: 2,
    badge: "קורס הדגל",
    badgeIcon: <BookOpen className="w-3.5 h-3.5 fill-current" />,
    badgeColor: "bg-teal-600 shadow-teal-600/30",
    title: (
      <>
        לומדים אנגלית <br />
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-300 to-green-100">בלי לשים לב</span>
      </>
    ),
    description: "סדרת משחקי אנגלית המותאמת במיוחד לתלמידי כיתות ה'-ו'. מהכרת אותיות ועד לאוצר מילים מתקדם והרכבת משפטים.",
    image: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?q=80&w=1200",
    primaryBtn: {
      label: "צפה בקורס המלא",
      icon: <Search className="w-5 h-5" />,
      color: "bg-teal-500 hover:bg-teal-400 shadow-teal-500/40"
    },
    overlayColor: "from-teal-900/95 via-teal-950/70 to-transparent"
  }
];

export default function HeroCarousel({ onNavigate, onPreviewGame, isRTL }: { onNavigate: (s: any) => void, onPreviewGame: (type: string) => void, isRTL: boolean }) {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent(prev => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const next = () => setCurrent(prev => (prev + 1) % slides.length);
  const prev = () => setCurrent(prev => (prev - 1 + slides.length) % slides.length);

  return (
    <div className="relative w-full h-[320px] sm:h-[380px] lg:h-[420px] bg-slate-900 overflow-hidden group mb-10 rounded-3xl mt-4">
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          className="absolute inset-0 z-0"
        >
          <motion.img
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            transition={{ duration: 10, ease: "linear" }}
            src={slides[current].image}
            alt="Hero background"
            className="absolute inset-0 w-full h-full object-cover opacity-50"
            referrerPolicy="no-referrer"
          />
          <div className={cn("absolute inset-0 bg-gradient-to-l", slides[current].overlayColor)} dir="rtl" />
          
          <div className="relative z-10 h-full flex items-center max-w-7xl mx-auto px-6 lg:px-12 w-full" dir="rtl">
            <motion.div 
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="max-w-xl text-right"
            >
              <span className={cn(
                "inline-flex items-center gap-1.5 px-3 py-1 text-white text-[10px] font-black rounded-full mb-4 shadow-lg uppercase tracking-wide",
                slides[current].badgeColor
              )}>
                {slides[current].badgeIcon}
                {slides[current].badge}
              </span>
              
              <h2 className="text-3xl md:text-5xl lg:text-6xl font-black text-white mb-4 leading-tight tracking-tight drop-shadow-2xl">
                {slides[current].title}
              </h2>
              
              <p className="text-slate-200 text-base md:text-lg mb-8 font-medium line-clamp-2 max-w-lg opacity-90">
                {slides[current].description}
              </p>
              
              <div className="flex flex-wrap gap-4">
                <button 
                  onClick={() => {
                    if (current === 0) onPreviewGame('trivia');
                    if (current === 1) onNavigate('wizard');
                    if (current === 2) onNavigate('courses');
                  }}
                  className={cn(
                    "flex items-center gap-2 px-8 py-4 rounded-xl font-black transition-all shadow-lg hover:scale-105 active:scale-95",
                    slides[current].primaryBtn.color
                  )}
                >
                  {slides[current].primaryBtn.icon}
                  {slides[current].primaryBtn.label}
                </button>
                
                {slides[current].secondaryBtn && (
                  <button 
                    onClick={() => onNavigate('wizard')}
                    className="flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white backdrop-blur-md px-8 py-4 rounded-xl font-black transition-all hover:scale-105 active:scale-95"
                  >
                    {slides[current].secondaryBtn.icon}
                    {slides[current].secondaryBtn.label}
                  </button>
                )}
              </div>
            </motion.div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation Arrows */}
      <button 
        onClick={prev}
        className="absolute left-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/30 backdrop-blur-md border border-white/20 flex items-center justify-center text-white transition-all z-20 opacity-0 group-hover:opacity-100 hover:scale-110 active:scale-90"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>
      <button 
        onClick={next}
        className="absolute right-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/30 backdrop-blur-md border border-white/20 flex items-center justify-center text-white transition-all z-20 opacity-0 group-hover:opacity-100 hover:scale-110 active:scale-90"
      >
        <ChevronRight className={cn("w-6 h-6", isRTL ? "" : "rotate-180")} />
      </button>

      {/* Pagination Dots */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3 z-20">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={cn(
              "h-1.5 rounded-full transition-all duration-300 shadow-sm",
              current === i ? "w-10 bg-white" : "w-2 bg-white/30 hover:bg-white/50"
            )}
          />
        ))}
      </div>
    </div>
  );
}

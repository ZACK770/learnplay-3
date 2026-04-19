import React from 'react';
import { motion } from 'motion/react';
import { 
  BrainCircuit, 
  ArrowRight, 
  Sparkles, 
  Gamepad2, 
  Layout, 
  Coins, 
  Eye, 
  BookOpen,
  CheckCircle2,
  ChevronLeft,
  Search,
  Users,
  Globe
} from 'lucide-react';
import { cn } from '../lib/utils';
import { useTranslation, Language } from '../contexts/TranslationContext';

interface LandingPageProps {
  onLogin: () => void;
  onNavigate: (state: any) => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onLogin, onNavigate }) => {
  const { language, setLanguage, t, isRTL } = useTranslation();

  const toggleLanguage = () => {
    const next: Language = language === 'he' ? 'en' : 'he';
    setLanguage(next);
  };

  return (
    <div className={cn("min-h-screen bg-[#0A0A12] text-white overflow-x-hidden", isRTL ? "rtl text-right" : "ltr text-left")} dir={isRTL ? "rtl" : "ltr"}>
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0A0A12]/80 backdrop-blur-md border-b border-white/5 px-8 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
                <BrainCircuit className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-black tracking-tight">LEARNPLAY</span>
            </div>
            <div className="hidden md:flex items-center gap-8">
              <button 
                onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
                className="text-sm font-bold text-gray-400 hover:text-white transition-colors"
              >
                {t('nav.features') || 'פיצ\'רים'}
              </button>
              <button 
                onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })}
                className="text-sm font-bold text-gray-400 hover:text-white transition-colors"
              >
                {t('nav.how_it_works') || 'איך זה עובד'}
              </button>
              <button 
                onClick={() => onNavigate('pricing')}
                className="text-sm font-bold text-gray-400 hover:text-white transition-colors"
              >
                {t('nav.pricing') || 'כמה זה עולה'}
              </button>
              <button 
                className="text-sm font-bold text-gray-400 hover:text-white transition-colors"
              >
                {t('nav.faq') || 'שאלות נפוצות'}
              </button>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={toggleLanguage}
              className="px-3 py-1.5 flex items-center gap-2 text-sm font-bold text-gray-400 hover:text-white border border-white/5 rounded-lg hover:bg-white/5 transition-all"
            >
              <Globe className="w-4 h-4" />
              {language === 'he' ? 'English' : 'עברית'}
            </button>
            <button 
              onClick={onLogin}
              className="px-6 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm font-black hover:bg-white/10 transition-all"
            >
              {t('nav.login') || 'כניסה'}
            </button>
            <button 
              onClick={onLogin}
              className="px-6 py-2.5 bg-blue-600 rounded-xl text-sm font-black hover:bg-blue-500 shadow-lg shadow-blue-500/20 transition-all"
            >
              {t('landing.cta.try_free')}
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-40 pb-32 overflow-hidden">
        {/* Glow Effects */}
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-blue-600/10 blur-[150px] -translate-y-1/2 translate-x-1/2 rounded-full" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-purple-600/5 blur-[120px] translate-y-1/2 -translate-x-1/2 rounded-full" />
        
        <div className="max-w-7xl mx-auto px-8 relative">
          <div className="flex flex-col md:flex-row items-center gap-20">
            <div className={cn("flex-1", isRTL ? "text-right" : "text-left")}>
              <motion.div
                initial={{ opacity: 0, x: isRTL ? 50 : -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
              >
                <div className="inline-flex items-center gap-2 bg-blue-600/10 px-4 py-2 rounded-full text-blue-400 text-xs font-black tracking-widest uppercase mb-8 border border-blue-500/20">
                  <Sparkles className="w-3 h-3" />
                  {t('landing.hero.badge') || 'AI × למידה × משחק — הנוסחה שעובדת'}
                </div>
                <h1 className="text-6xl md:text-8xl font-black leading-[0.9] tracking-tighter mb-8 bg-gradient-to-l from-white via-white to-gray-500 bg-clip-text text-transparent">
                  {t('landing.hero.title')}
                </h1>
                <p className="text-xl text-gray-400 max-w-xl mb-12 leading-relaxed">
                  {t('landing.hero.subtitle')}
                </p>
                <div className="flex flex-wrap items-center gap-6">
                  <button 
                    onClick={onLogin}
                    className="px-10 py-5 bg-blue-600 rounded-2xl text-xl font-black hover:bg-blue-500 hover:-translate-y-1 transition-all shadow-2xl shadow-blue-500/40 flex items-center gap-3"
                  >
                    {t('landing.cta.try_free')}
                    <ArrowRight className={cn("w-6 h-6", isRTL ? "rotate-180" : "")} />
                  </button>
                  <button 
                    onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })}
                    className="px-8 py-5 bg-white/5 border border-white/10 rounded-2xl text-xl font-bold hover:bg-white/10 transition-all"
                  >
                    {t('landing.cta.how_it_works')}
                  </button>
                </div>
                
                <div className="mt-12 flex items-center gap-4">
                  <div className="flex -space-x-3 space-x-reverse">
                    {[1, 2, 3, 4].map(i => (
                      <img 
                        key={i} 
                        src={`https://picsum.photos/seed/${i+100}/100/100`} 
                        className="w-10 h-10 rounded-full border-2 border-[#0A0A12]" 
                        referrerPolicy="no-referrer" alt=""
                      />
                    ))}
                  </div>
                  <p className="text-sm text-gray-500 font-bold">1,000+ משפחות כבר בפנים</p>
                </div>
              </motion.div>
            </div>
            
            <motion.div 
              className="flex-1 relative hidden lg:block"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
            >
              <div className="relative">
                <div className="absolute inset-0 bg-blue-600/20 blur-[100px] animate-pulse" />
                <img 
                   src="https://picsum.photos/seed/learnplay/800/600" 
                   className="rounded-3xl border border-white/10 shadow-2xl skew-y-3 relative z-10"
                   referrerPolicy="no-referrer" alt="App interface preview"
                />
                
                {/* Floating Stats Cards */}
                <div className="absolute -top-10 -right-10 bg-white p-6 rounded-2xl shadow-2xl z-20 animate-bounce cursor-default">
                   <p className="text-blue-600 font-black text-2xl">+10,000</p>
                   <p className="text-gray-900 text-[10px] font-bold uppercase tracking-widest">משחקים שנוצרו</p>
                </div>
                
                <div className="absolute -bottom-10 -left-10 bg-blue-600 p-6 rounded-2xl shadow-2xl z-20">
                   <div className="flex items-center gap-2 mb-1">
                      {[1,2,3,4,5].map(i => <Sparkles key={i} className="w-3 h-3 text-white fill-white" />)}
                   </div>
                   <p className="text-white font-black text-xl">4.9★ דירוג ממוצע</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-white/5 border-y border-white/5 relative z-10">
        <div className="max-w-7xl mx-auto px-8">
           <div className="grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
              <div>
                <p className="text-4xl font-black mb-2">+10,000</p>
                <p className="text-gray-500 text-sm font-bold uppercase">משחקים נוצרו עד היום</p>
              </div>
              <div>
                <p className="text-4xl font-black mb-2">+1,000</p>
                <p className="text-gray-500 text-sm font-bold uppercase">משפחות לומדות</p>
              </div>
              <div>
                <p className="text-4xl font-black mb-2">95%</p>
                <p className="text-gray-500 text-sm font-bold uppercase">שיפור ממוצע בציונים</p>
              </div>
              <div>
                <p className="text-4xl font-black mb-2">4.9★</p>
                <p className="text-gray-500 text-sm font-bold uppercase">דירוג ממוצע</p>
              </div>
           </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-32 relative">
        <div className="max-w-7xl mx-auto px-8">
          <div className="text-center mb-20">
            <h2 className="text-5xl font-black mb-6">למה LearnPlay?</h2>
            <p className="text-xl text-gray-500">בנינו את הכלים שהיינו רוצים שיהיו לנו כשהיינו ילדים</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { title: 'AI שמבין את החומר', desc: 'מנתח טקסט, תמונה או נושא — ויוצר שאלות מדויקות תוך שניות', icon: BrainCircuit, color: 'blue' },
              { title: '7+ סוגי משחקים', desc: 'טריוויה, זיכרון, איות, בניית משפטים, מיון ועוד — כל פעם סיבוב אחר', icon: Gamepad2, color: 'purple' },
              { title: 'תעלו → תשחקו → תצליחו', desc: 'תמונה של דף עבודה, PDF, או סתם נושא — והמערכת עושה את השאר', icon: Layout, color: 'green' },
              { title: 'XP, מטבעות ופרסים', desc: 'הילדים צוברים נקודות, עולים רמות ופודים פרסים — מוטיבציה אמיתית', icon: Coins, color: 'yellow' },
              { title: 'גם קורסים שלמים', desc: 'שיעורים, מצגות, תרגול ומבחנים — מסלולי לימוד מלאים עם מעקב התקדמות', icon: BookOpen, color: 'pink' },
              { title: 'דשבורד להורים ומורים', desc: 'מעקב התקדמות בזמן אמת, דוחות מפורטים ושליטה מלאה', icon: Eye, color: 'cyan' }
            ].map((f, i) => (
              <motion.div 
                key={i}
                whileHover={{ y: -5 }}
                className="bg-[#1E1E2E] p-10 rounded-3xl border border-white/5 group"
              >
                <div className={cn(
                  "w-14 h-14 rounded-2xl flex items-center justify-center mb-8",
                  f.color === 'blue' ? 'bg-blue-500/10 text-blue-400' :
                  f.color === 'purple' ? 'bg-purple-500/10 text-purple-400' :
                  f.color === 'green' ? 'bg-green-500/10 text-green-400' :
                  f.color === 'yellow' ? 'bg-yellow-500/10 text-yellow-400' :
                  f.color === 'pink' ? 'bg-pink-500/10 text-pink-400' :
                  'bg-cyan-500/10 text-cyan-400'
                )}>
                  <f.icon className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold mb-4">{f.title}</h3>
                <p className="text-gray-500 leading-relaxed text-sm">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section id="how-it-works" className="py-32 bg-[#0F0F1A] border-y border-white/5">
         <div className="max-w-7xl mx-auto px-8 relative">
            <div className="text-center mb-24">
              <h2 className="text-5xl font-black mb-6 italic">איך זה עובד?</h2>
              <p className="text-xl text-gray-500">30 שניות מחומר לימוד למשחק מוכן</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-16 relative">
               {/* Connector Line */}
               <div className="hidden md:block absolute top-[28px] left-[15%] right-[15%] h-px bg-dashed border-t border-dashed border-gray-800" />
               
               {[
                 { step: '01', title: 'תעלו חומר', desc: 'צלמו דף, הקלידו טקסט, או פשוט כתבו נושא' },
                 { step: '02', title: 'ה-AI עושה קסמים', desc: 'תוך שניות — שאלות, רמות קושי ומשחק מוכן' },
                 { step: '03', title: 'הילדים לומדים', desc: 'XP, מטבעות, רצפים — והציונים עולים מעצמם' }
               ].map((s, i) => (
                 <div key={i} className="relative z-10 text-center">
                    <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-xl shadow-blue-500/20 text-white font-black text-xl">
                      {s.step}
                    </div>
                    <h4 className="text-2xl font-bold mb-4">{s.title}</h4>
                    <p className="text-gray-500 leading-relaxed">{s.desc}</p>
                 </div>
               ))}
            </div>
         </div>
      </section>

      {/* Testimonials */}
      <section className="py-32 px-8 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-black mb-20 text-center">הורים אמיתיים. תוצאות אמיתיות.</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { name: 'שרה כ.', role: 'אמא לשלושה', text: '"הילדים שלי פשוט מתים על זה! הם מבקשים ללמוד — דבר שלא קרה מעולם. השיפור בציונים היה מיידי."' },
              { name: 'דוד מ.', role: 'אבא לשניים', text: '"הדשבורד להורים מדהים. אני רואה בדיוק מה הילדים למדו, כמה זמן השקיעו ואיפה הם צריכים חיזוק."' },
              { name: 'רחל א.', role: 'מורה ואמא', text: '"כמורה, אני יכולה להגיד שהמשחקים ברמה גבוהה מאוד. ה-AI באמת מבין את החומר ויוצר שאלות רלוונטיות."' }
            ].map((t, i) => (
              <div key={i} className="bg-white/5 p-10 rounded-3xl border border-white/5 relative">
                <p className="text-xl text-gray-300 mb-10 leading-relaxed italic">{t.text}</p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center font-black text-blue-500">
                    {t.name.charAt(0)}
                  </div>
                  <div>
                    <h5 className="font-bold">{t.name}</h5>
                    <p className="text-xs text-gray-500 font-bold uppercase tracking-widest">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Dropdowns */}
      <section className="py-32 px-8 bg-[#0A0A12] border-t border-white/5">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-4xl font-black mb-16 text-center">שאלות נפוצות</h2>
          <div className="space-y-4">
            {[
              { q: 'האם השירות באמת חינמי?', a: 'כן! התוכנית הבסיסית שלנו חינמית לנצח ומאפשרת ליצור עד 3 משחקים בחודש.' },
              { q: 'לאילו גילאים מתאים?', a: 'הפלטפורמה מתאימה לילדים בגילאי גן ועד כיתה י"ב, כולל הכנה לבגרויות.' },
              { q: 'איך ה-AI יוצר את המשחקים?', a: 'אנחנו משתמשים במודלי השפה המתקדמים ביותר של Google כדי לנתח את המידה ולחלץ ממנו שאלות ותוכן משחקי.' },
              { q: 'האם המידע של הילדים שלי מוגן?', a: 'בוודאי. המערכת עומדת בתקני אבטחה מחמירים ומבטיחה שמידע אישי לא ייחשף.' }
            ].map((item, i) => (
              <details key={i} className="group bg-[#1E1E2E] rounded-2xl border border-white/5 p-4 cursor-pointer">
                <summary className="flex items-center justify-between font-bold text-lg list-none p-4">
                  {item.q}
                  <ChevronLeft className="w-5 h-5 transition-transform group-open:-rotate-90" />
                </summary>
                <div className="px-4 pb-4 text-gray-400 text-sm leading-relaxed">
                  {item.a}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-32 px-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-blue-600/20 to-transparent pointer-events-none" />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h2 className="text-6xl font-black mb-8">30 שניות. זה כל מה שצריך.</h2>
          <p className="text-xl text-gray-400 mb-12">
            תעלו חומר לימוד, תקבלו משחק מותאם, והילדים יעשו את השאר. <br />
            חינם לנצח בתוכנית הבסיסית. ללא כרטיס אשראי.
          </p>
          <button 
            onClick={onLogin}
            className="px-12 py-6 bg-white text-black rounded-2xl text-2xl font-black hover:scale-105 transition-all shadow-2xl shadow-white/10"
          >
            נסו עכשיו — בחינם
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#0F0F1A] border-t border-white/5 pt-20 pb-10 px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 mb-20 border-b border-white/5 pb-20">
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
                <BrainCircuit className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-black tracking-tight">LEARNPLAY</span>
            </div>
            <p className="text-gray-500 text-sm leading-relaxed">
              פלטפורמת EdTech ישראלית. AI שהופך חומר לימוד למשחקים.
            </p>
          </div>
          <div>
            <h5 className="font-bold mb-6 text-white">מוצר</h5>
            <ul className="space-y-4 text-gray-500 text-sm font-bold uppercase tracking-wider">
              <li><button onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })} className="hover:text-white">פיצ'רים</button></li>
              <li><button onClick={() => onNavigate('pricing')} className="hover:text-white">כמה זה עולה</button></li>
              <li><button onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })} className="hover:text-white">איך זה עובד</button></li>
              <li><button className="hover:text-white">שאלות נפוצות</button></li>
            </ul>
          </div>
          <div>
            <h5 className="font-bold mb-6 text-white">משפטי / Legal</h5>
            <ul className="space-y-4 text-gray-500 text-sm font-bold uppercase tracking-wider">
              <li><button onClick={() => onNavigate('terms')} className="hover:text-white">Terms of Service</button></li>
              <li><button onClick={() => onNavigate('privacy')} className="hover:text-white">Privacy Policy</button></li>
              <li><button onClick={() => onNavigate('refunds')} className="hover:text-white">Refund Policy</button></li>
              <li><button className="hover:text-white flex items-center gap-2">Pricing Sheet (PDF)</button></li>
            </ul>
          </div>
          <div>
            <h5 className="font-bold mb-6 text-white">צור קשר</h5>
            <ul className="space-y-4 text-gray-500 text-sm font-bold uppercase tracking-wider">
              <li>support@learnplay.app</li>
              <li>ישראל</li>
            </ul>
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between text-gray-600 text-xs">
          <p>© 2026 LearnPlay. כל הזכויות שמורות.</p>
          <div className="flex items-center gap-6 mt-4 md:mt-0">
             <button onClick={() => onNavigate('terms')} className="hover:text-white">Terms</button>
             <button onClick={() => onNavigate('privacy')} className="hover:text-white">Privacy</button>
             <button onClick={() => onNavigate('refunds')} className="hover:text-white">Refunds</button>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;

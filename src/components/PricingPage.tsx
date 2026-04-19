import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Check, Rocket, Zap, Crown, UserPlus, Info, ArrowLeft } from 'lucide-react';
import { cn } from '../lib/utils';

interface PricingPageProps {
  onBack: () => void;
  onSelect: (plan: string) => void;
  isLoggedIn?: boolean;
}

const PricingPage: React.FC<PricingPageProps> = ({ onBack, onSelect, isLoggedIn }) => {
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>('monthly');

  const plans = [
    {
      name: 'חינם',
      price: billingPeriod === 'monthly' ? '0' : '0',
      description: 'ללא עלות, לנצח',
      tokens: '1,000',
      features: [
        '1,000 טוקני AI לחודש',
        'עד 3 יצירות תוכן',
        'ילד אחד (מצב הורה)',
        'כל המשחקים והקורסים הציבוריים',
        'גישה לתוכן בתשלום',
        'רכישת טוקנים נוספים (₪9.90/5K)',
        'מכירת תוכן (יוצרים)'
      ],
      buttonText: 'התחל בחינם',
      icon: Rocket,
      color: 'gray'
    },
    {
      name: 'Pro',
      price: billingPeriod === 'monthly' ? '29.9' : '24.9',
      description: 'מומלץ למשפחות',
      tokens: '10,000',
      features: [
        '10,000 טוקני AI לחודש',
        'יצירת תוכן ללא הגבלה',
        'עד 3 ילדים (מצב הורה)',
        'כל המשחקים והקורסים הציבוריים',
        'גישה לתוכן בתשלום',
        'רכישת טוקנים נוספים (₪9.90/5K)',
        'מכירת תוכן (יוצרים)'
      ],
      buttonText: 'התחל עכשיו',
      icon: Zap,
      color: 'blue',
      popular: true
    },
    {
      name: 'פרימיום',
      price: billingPeriod === 'monthly' ? '49.9' : '39.9',
      description: 'עבור למידה אינטנסיבית',
      tokens: '30,000',
      features: [
        '30,000 טוקני AI לחודש',
        'יצירת תוכן ללא הגבלה',
        'ילדים ללא הגבלה (מצב הורה)',
        'כל המשחקים והקורסים הציבוריים',
        'גישה לתוכן בתשלום',
        'רכישת טוקנים נוספים (₪9.90/5K)',
        'מכירת תוכן (יוצרים)'
      ],
      buttonText: 'התחל עכשיו',
      icon: Crown,
      color: 'purple'
    },
    {
      name: 'ליוצרים',
      price: billingPeriod === 'monthly' ? '100' : '85',
      description: 'לאקדמיות ומוסדות',
      tokens: '100,000',
      features: [
        '100,000 טוקני AI לחודש',
        'יצירת תוכן ללא הגבלה',
        'ילדים ללא הגבלה (מצב הורה)',
        'כל המשחקים והקורסים הציבוריים',
        'גישה לתוכן בתשלום',
        'רכישת טוקנים נוספים (₪9.90/5K)',
        'מכירת תוכן (יוצרים)'
      ],
      buttonText: 'התחל עכשיו',
      icon: UserPlus,
      color: 'orange'
    }
  ];

  return (
    <div className="min-h-screen bg-[#0A0A12] text-white p-8 rtl pb-20" dir="rtl">
      <div className="max-w-7xl mx-auto">
        <header className="flex items-center justify-between mb-16">
          <button 
            onClick={onBack}
            className="flex items-center gap-2 text-gray-500 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4 rotate-180" />
            <span>חזרה לדף הבית</span>
          </button>
          <div className="text-center flex-1">
            <h1 className="text-4xl font-black mb-4">שדרוג ורכישה</h1>
            <p className="text-gray-500">בחר את המסלול שמתאים לך או רכוש טוקנים לשימוש בבינה מלאכותית.</p>
          </div>
          <div className="w-32" /> {/* Spacer */}
        </header>

        {/* Toggle */}
        <div className="flex justify-center mb-16">
          <div className="bg-[#1E1E2E] p-1 rounded-2xl flex items-center relative">
            <button 
              onClick={() => setBillingPeriod('monthly')}
              className={cn(
                "px-8 py-2 rounded-xl text-sm font-bold transition-all relative z-10",
                billingPeriod === 'monthly' ? "text-white" : "text-gray-500"
              )}
            >
              חודשי
            </button>
            <button 
              onClick={() => setBillingPeriod('yearly')}
              className={cn(
                "px-8 py-2 rounded-xl text-sm font-bold transition-all relative z-10",
                billingPeriod === 'yearly' ? "text-white" : "text-gray-500"
              )}
            >
              שנתי
            </button>
            <motion.div 
              className="absolute bg-blue-600 rounded-xl h-[calc(100%-8px)]"
              initial={false}
              animate={{
                right: billingPeriod === 'monthly' ? '4px' : '50%',
                width: 'calc(50% - 4px)'
              }}
            />
          </div>
          <div className="mr-4 px-3 py-1 bg-green-500/10 text-green-500 text-[10px] font-black uppercase rounded-full flex items-center">
            חיסכון של 17%
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {plans.map((plan, idx) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className={cn(
                "bg-[#1E1E2E] rounded-3xl p-8 border border-white/5 flex flex-col relative",
                plan.popular && "ring-2 ring-blue-500 bg-gradient-to-b from-[#1E1E2E] to-blue-900/10"
              )}
            >
              {plan.popular && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-blue-600 px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">
                  הכי מומלץ
                </div>
              )}
              
              <div className="flex items-center gap-3 mb-6">
                <div className={cn(
                  "w-10 h-10 rounded-xl flex items-center justify-center",
                  plan.color === 'blue' ? 'bg-blue-500/10 text-blue-400' :
                  plan.color === 'purple' ? 'bg-purple-500/10 text-purple-400' :
                  plan.color === 'orange' ? 'bg-orange-500/10 text-orange-400' :
                  'bg-white/5 text-gray-400'
                )}>
                  <plan.icon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-lg">{plan.name}</h3>
                  <p className="text-xs text-gray-500">{plan.description}</p>
                </div>
              </div>

              <div className="mb-8">
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-black">₪{plan.price}</span>
                  <span className="text-xs text-gray-500">/חודש</span>
                </div>
              </div>

              <div className="bg-[#0A0A12] rounded-2xl p-4 mb-8 text-center border border-white/5">
                <p className="text-2xl font-black text-blue-400">{plan.tokens}</p>
                <p className="text-[10px] font-black uppercase text-gray-500 tracking-wider">טוקנים בחודש</p>
              </div>

              <ul className="space-y-4 mb-10 flex-1">
                {plan.features.map((feature, fIdx) => (
                  <li key={fIdx} className="flex items-start gap-3 text-sm text-gray-400 leading-tight">
                    <Check className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <button 
                onClick={() => onSelect(plan.name)}
                className={cn(
                  "w-full py-4 rounded-2xl font-bold transition-all",
                  plan.popular 
                    ? "bg-blue-600 hover:bg-blue-500 shadow-lg shadow-blue-500/20" 
                    : "bg-white/5 hover:bg-white/10 border border-white/5"
                )}
              >
                {plan.buttonText}
              </button>
            </motion.div>
          ))}
        </div>

        {/* Tokens Info */}
        <div className="mt-20 bg-gradient-to-r from-blue-600/10 to-purple-600/10 rounded-3xl p-10 border border-blue-500/20">
          <div className="flex flex-col md:flex-row items-center gap-10">
            <div className="flex-1">
              <h3 className="text-2xl font-bold mb-4 flex items-center gap-3">
                <Zap className="text-yellow-400 fill-yellow-400" />
                נגמרו הטוקנים?
              </h3>
              <p className="text-gray-400 leading-relaxed max-w-2xl">
                מנויים בתשלום יכולים לרכוש חבילות של 5,000 טוקנים נוספים ב-₪9.90 בכל עת.
                <br />
                <span className="text-blue-400 font-bold">* טוקנים שנרכשו בנפרד לא פגים לעולם!</span>
              </p>
            </div>
            <div className="shrink-0 text-center">
              <div className="bg-white/5 px-6 py-4 rounded-2xl border border-white/5 flex flex-col items-center">
                <UserPlus className="text-blue-400 mb-2" />
                <p className="text-sm font-bold">הזמן חבר = 2,000 טוקנים!</p>
                <p className="text-[10px] text-gray-500 mt-1">על כל חבר חדש שיירשם</p>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ */}
        <div className="mt-20">
          <h3 className="text-2xl font-bold mb-10 text-center">שאלות נפוצות</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-[#1E1E2E] p-8 rounded-3xl border border-white/5">
              <h4 className="font-bold mb-3">מה זה טוקנים?</h4>
              <p className="text-sm text-gray-400">טוקנים הם המטבע בו המערכת משתמשת עבור יצירת תוכן באמצעות בינה מלאכותית. כל דף עבודה או נושא שאתם מעלים צורך כמות מסוימת של טוקנים.</p>
            </div>
            <div className="bg-[#1E1E2E] p-8 rounded-3xl border border-white/5">
              <h4 className="font-bold mb-3">מה קורה כשנגמרים הטוקנים?</h4>
              <p className="text-sm text-gray-400">במסלול החינמי המכסה מתחדשת בכל חודש. במסלולים בתשלום ניתן לרכוש חבילות השלמה זולות שנשארות איתכם לתמיד.</p>
            </div>
          </div>
        </div>

        <footer className="mt-20 flex flex-wrap justify-center gap-6 text-gray-600 text-sm">
           <button className="hover:text-blue-400">תנאי שירות</button>
           <button className="hover:text-blue-400">מדיניות פרטיות</button>
           <button className="hover:text-blue-400">מדיניות החזרים</button>
           <button className="hover:text-blue-400 flex items-center gap-2">
             <Info className="w-3 h-3" />
             הורד PDF תמחור
           </button>
        </footer>
      </div>
    </div>
  );
};

export default PricingPage;

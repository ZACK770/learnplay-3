import React from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, ShieldCheck, ScrollText, RefreshCw } from 'lucide-react';
import { cn } from '../lib/utils';

interface LegalPageProps {
  type: 'terms' | 'privacy' | 'refunds';
  onBack: () => void;
}

const LegalPage: React.FC<LegalPageProps> = ({ type, onBack }) => {
  const content = {
    terms: {
      title: 'תנאי שימוש',
      icon: ScrollText,
      sections: [
        { title: '1. קבלת התנאים', text: 'בשימוש באתר LearnPlay הנך מסכים לתנאים המפורטים להלן. אם אינך מסכים לאחד התנאים, עליך להפסיק את השימוש במערכת באופן מיידי.' },
        { title: '2. חשבון משתמש', text: 'השימוש במערכת מחייב יצירת חשבון. אתה אחראי על שמירת סודיות פרטי הגישה שלך. אין להעביר גישה לחשבון לאנשים אחרים.' },
        { title: '3. שימוש הוגן ב-AI', text: 'מערכת ה-AI נועדה לצרכים לימודיים בלבד. אין להשתמש במערכת ליצירת תוכן פוגעני, לא חוקי או מפר זכויות יוצרים.' },
        { title: '4. טוקנים ומנויים', text: 'טוקנים הם המטבע הפנימי של המערכת. מנויים משתלמים חודשית או שנתית. ביטול מנוי יהיה בתוקף לסוף תקופת החיוב הנוכחית.' }
      ]
    },
    privacy: {
      title: 'מדיניות פרטיות',
      icon: ShieldCheck,
      sections: [
        { title: '1. איסוף מידע', text: 'אנחנו אוספים מידע הנמסר על ידך בעת הרישום (שם, אימייל) ומידע על פעילותך במערכת (תוצאות משחק, יצירת תוכן).' },
        { title: '2. אבטחת מידע', text: 'LearnPlay משתמשת בטכנולוגיות הצפנה מתקדמות (SSL) להגנה על המידע שלך. המידע נשמר על שרתים מאובטחים.' },
        { title: '3. שימוש במידע', text: 'המידע משמש לשיפור חווית הלמידה, התאמה אישית של תוכן וניהול חשבון המשתמש.' },
        { title: '4. צד ג\'', text: 'אנחנו לא מוכרים מידע אישי לצדדים שלישיים. מידע עשוי לעבור לספקי שירות (כמו שירותי סליקה) לצורך תפעול המערכת בלבד.' }
      ]
    },
    refunds: {
      title: 'מדיניות החזרים',
      icon: RefreshCw,
      sections: [
        { title: '1. ביטול עסקה', text: 'ניתן לבטל עסקה תוך 14 ימים מיום הרכישה, בתנאי שלא נעשה שימוש משמעותי במכסת הטוקנים של המנוי.' },
        { title: '2. החזר יחסי', text: 'במקרה של ביטול מנוי שנתי, החזר יבוצע על החודשים הנותרים בניכוי חודשים שנוצלו במחיר חודשי מלא.' },
        { title: '3. רכישת טוקנים', text: 'חבילות טוקנים שנרכשו בנפרד אינן ניתנות להחזר לאחר שהחל השימוש בהן.' },
        { title: '4. אופן קבלת ההחזר', text: 'החזרים יבוצעו לאמצעי התשלום בו בוצעה העסקה המקורית תוך 10 ימי עסקים.' }
      ]
    }
  };

  const active = content[type];

  return (
    <div className="min-h-screen bg-[#0A0A12] text-white p-8 rtl" dir="rtl">
      <div className="max-w-4xl mx-auto">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-gray-500 hover:text-white transition-colors mb-12"
        >
          <ArrowLeft className="w-4 h-4 rotate-180" />
          <span>חזרה</span>
        </button>

        <div className="flex items-center gap-4 mb-12">
          <div className="w-16 h-16 bg-blue-600/10 rounded-2xl flex items-center justify-center">
            <active.icon className="w-8 h-8 text-blue-500" />
          </div>
          <h1 className="text-4xl font-black">{active.title}</h1>
        </div>

        <div className="space-y-12">
          {active.sections.map((section, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="bg-[#1E1E2E] p-8 rounded-3xl border border-white/5"
            >
              <h2 className="text-xl font-bold mb-4 text-blue-400">{section.title}</h2>
              <p className="text-gray-400 leading-relaxed">{section.text}</p>
            </motion.div>
          ))}
        </div>

        <footer className="mt-20 py-10 border-t border-white/5 text-center text-gray-600 text-sm">
          &copy; 2026 LearnPlay. כל הזכויות שמורות.
        </footer>
      </div>
    </div>
  );
};

export default LegalPage;

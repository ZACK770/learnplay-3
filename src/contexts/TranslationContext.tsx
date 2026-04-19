import React, { createContext, useContext, useState, useEffect } from 'react';

export type Language = 'he' | 'en' | 'ar' | 'es' | 'fr';

interface TranslationContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  isRTL: boolean;
}

const translations: Record<Language, Record<string, string>> = {
  he: {
    'landing.hero.title': 'הילדים לומדים. בלי לדעת שהם לומדים.',
    'landing.hero.subtitle': 'תעלו חומר לימוד. ה-AI ייצור משחק. הילדים יתאהבו. כל זה בפחות מ-30 שניות. ובחינם.',
    'landing.cta.try_free': 'נסו בחינם',
    'landing.cta.how_it_works': 'ראו איך זה עובד',
    'nav.lobby': 'גלריית משחקים',
    'nav.courses': 'קורסים',
    'nav.playrooms': 'משחקיות',
    'nav.reports': 'מה למדנו?',
    'nav.wizard': 'מרכז היצירה',
    'nav.academy': 'האקדמיה שלי',
    'nav.studio': 'סטודיו למשחקים',
    'nav.course_builder': 'בניית קורס',
    'nav.playroom_setup': 'הקמת משחקייה',
    'nav.overview': 'מבט על',
    'nav.creator_dash': 'דשבורד יוצר',
    'nav.leads': 'אנשי קשר ולידים',
    'nav.prizes': 'חנות הפרסים',
    'nav.prize_bag': 'תיק הפרסים',
    'nav.knowledge': 'מאגרי ידע',
    'nav.pricing': 'שדרוג ורכישה',
    'nav.account': 'הגדרות מערכת',
    'nav.back_to_home': 'חזרה לדף הבית',
    'nav.logout': 'התנתקות',
    'nav.features': 'פיצ\'רים',
    'nav.how_it_works': 'איך זה עובד',
    'nav.faq': 'שאלות נפוצות',
    'nav.login': 'כניסה',
    'common.back': 'חזרה',
    'pricing.title': 'שדרוג ורכישה',
    'pricing.subtitle': 'בחר את המסלול שמתאים לך או רכוש טוקנים לשימוש בבינה מלאכולית.',
    'group.main': 'ראשי',
    'group.creation': 'יצירה וניהול',
    'group.creators': 'ניהול יוצרים',
    'group.system': 'מערכת',
    'header.explore': 'ברוכים השבים, מה נלמד היום?',
    'header.search': 'חיפוש משחקים או נושאים...',
    'header.create': 'יצירה',
    'game.players': 'שחקנים',
    'game.reviews': 'דירוגים',
    'game.play_now': 'משחק מיידי',
    'game.customize': 'התאמה אישית',
    'game.play_now_sub': 'התחל עכשיו עם התוכן המובנה',
    'game.customize_sub': 'העלה חומר משלך וצור משחק ייחודי',
    'game.what_others_think': 'מה אחרים חושבים',
    'game.recent_comments': 'תגובות אחרונות',
    'game.choose_mission': 'בחר את המשימה הבאה שלך',
    'game.stat.daily_rank': 'בדירוג היום',
    'game.rate_btn': 'דרג (תהיה עדין)',
    'game.by': 'מאת',
    'wizard.title': 'הגדרת {gameName}',
    'wizard.subtitle': 'ספר לבינה המלאכותית שלנו איזה חומר תרצה ללמוד.',
    'wizard.domain': 'תחום דעת',
    'wizard.difficulty': 'רמת קושי',
    'wizard.prompt_label': 'מה ללמוד?',
    'wizard.prompt_placeholder': 'למשל: אוצר מילים של פירות באנגלית, או ההבדל בין חומצה לבסיס...',
    'wizard.generate': 'צור לי משחק!',
    'wizard.generating': 'הבינה המלאכותית יוצרת עבורך...',
  },
  en: {
    'landing.hero.title': 'Kids learn. Without knowing they are learning.',
    'landing.hero.subtitle': 'Upload study material. AI creates a game. Kids fall in love. All in less than 30 seconds. And for free.',
    'landing.cta.try_free': 'Try for Free',
    'landing.cta.how_it_works': 'See How it Works',
    'nav.lobby': 'Game Gallery',
    'nav.courses': 'Courses',
    'nav.playrooms': 'Playrooms',
    'nav.reports': 'Learning History',
    'nav.wizard': 'Creation Center',
    'nav.academy': 'My Academy',
    'nav.studio': 'Game Studio',
    'nav.course_builder': 'Course Builder',
    'nav.playroom_setup': 'Playroom Setup',
    'nav.overview': 'Overview',
    'nav.creator_dash': 'Creator Dashboard',
    'nav.leads': 'Leads & Contacts',
    'nav.prizes': 'Prize Shop',
    'nav.prize_bag': 'Prize Bag',
    'nav.knowledge': 'Knowledge Base',
    'nav.pricing': 'Upgrade & Pricing',
    'nav.account': 'System Settings',
    'nav.back_to_home': 'Back to Home',
    'nav.logout': 'Logout',
    'nav.features': 'Features',
    'nav.how_it_works': 'How it Works',
    'nav.faq': 'FAQ',
    'nav.login': 'Login',
    'common.back': 'Back',
    'pricing.title': 'Upgrade & Purchase',
    'pricing.subtitle': 'Choose the plan that fits you or buy AI tokens.',
    'group.main': 'Main',
    'group.creation': 'Creation & Management',
    'group.creators': 'Creators Management',
    'group.system': 'System',
    'header.explore': 'Welcome back, what shall we learn today?',
    'header.search': 'Search games or topics...',
    'header.create': 'Create',
    'game.players': 'players',
    'game.reviews': 'reviews',
    'game.play_now': 'Play Now',
    'game.customize': 'Customize',
    'game.play_now_sub': 'Start now with default content',
    'game.customize_sub': 'Upload your own material',
    'game.what_others_think': 'What others think',
    'game.recent_comments': 'Recent comments',
    'game.choose_mission': 'Choose your next mission',
    'game.stat.daily_rank': 'Today\'s rank',
    'game.rate_btn': 'Rate (be gentle)',
    'game.by': 'by',
    'wizard.title': 'Configure {gameName}',
    'wizard.subtitle': 'Tell our AI what material you want to learn.',
    'wizard.domain': 'Knowledge Domain',
    'wizard.difficulty': 'Difficulty',
    'wizard.prompt_label': 'What to learn?',
    'wizard.prompt_placeholder': 'e.g., Hebrew vocabulary for animals, or basic laws of physics...',
    'wizard.generate': 'Generate Game!',
    'wizard.generating': 'AI is creating for you...',
  },
  ar: {
    'landing.hero.title': 'يتعلم الأطفال. دون معرفة أنهم يتعلمون.',
    'landing.hero.subtitle': 'ارفع المواد الدراسية. يقوم الذكاء الاصطناعي بإنشاء لعبة. يقع الأطفال في الحب. كل ذلك في أقل من 30 ثانية. ومجانًا.',
    // ... more Arabic translations can be added
  },
  es: {
    'landing.hero.title': 'Los niños aprenden. Sin saber que están aprendiendo.',
    'landing.hero.subtitle': 'Sube material de estudio. La IA crea un juego. Los niños se enamoran. Todo en menos de 30 segundos. Y gratis.',
    // ... more Spanish translations can be added
  },
  fr: {
    'landing.hero.title': 'Les enfants apprennent. Sans savoir qu\'ils apprennent.',
    'landing.hero.subtitle': 'Téléchargez du matériel pédagogique. L\'IA crée un jeu. Les enfants tombent amoureux. Le tout en moins de 30 secondes. Et gratuitement.',
    // ... more French translations can be added
  }
};

const TranslationContext = createContext<TranslationContextType | undefined>(undefined);

export const TranslationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('he');

  const isRTL = language === 'he' || language === 'ar';

  useEffect(() => {
    document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
  }, [language, isRTL]);

  const t = (key: string): string => {
    return translations[language][key] || translations['he'][key] || key;
  };

  return (
    <TranslationContext.Provider value={{ language, setLanguage, t, isRTL }}>
      <div className={isRTL ? 'font-sans rtl' : 'font-sans ltr'}>
        {children}
      </div>
    </TranslationContext.Provider>
  );
};

export const useTranslation = () => {
  const context = useContext(TranslationContext);
  if (!context) throw new Error('useTranslation must be used within a TranslationProvider');
  return context;
};

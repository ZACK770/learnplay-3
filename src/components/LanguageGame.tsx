import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Volume2, 
  ChevronRight, 
  CheckCircle2, 
  XCircle, 
  BookOpen, 
  Gamepad, 
  Sparkles, 
  Heart,
  RotateCcw,
  Trophy
} from 'lucide-react';
import { LanguageDatasetContent, LanguageSchema } from '../types';
import { cn } from '../lib/utils';

interface LanguageGameProps {
  data: LanguageDatasetContent;
  onComplete: (score: number) => void;
}

export default function LanguageGame({ data, onComplete }: LanguageGameProps) {
  const [currentStage, setCurrentStage] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const [hearts, setHearts] = useState(5);
  const [score, setScore] = useState(0);
  const [isFeedbackVisible, setIsFeedbackVisible] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  
  // Stages based on data.schemas
  const stages = data.schemas;
  const currentSchema = stages[currentStage];
  const items = currentSchema?.items || [];
  const currentItem = items[currentStep];

  const handleNext = () => {
    setIsFeedbackVisible(false);
    if (currentStep < items.length - 1) {
      setCurrentStep(v => v + 1);
    } else if (currentStage < stages.length - 1) {
      setCurrentStage(v => v + 1);
      setCurrentStep(0);
    } else {
      onComplete(score);
    }
  };

  const submitAnswer = (correct: boolean) => {
    setIsCorrect(correct);
    setIsFeedbackVisible(true);
    if (correct) {
      setScore(s => s + 10);
    } else {
      setHearts(h => Math.max(0, h - 1));
    }
  };

  const speak = (text: string) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    window.speechSynthesis.speak(utterance);
  };

  if (hearts === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] p-8 text-center bg-[#1E1E2E] rounded-3xl border border-red-500/20">
        <XCircle className="w-20 h-20 text-red-500 mb-6" />
        <h2 className="text-3xl font-black mb-4">Game Over</h2>
        <p className="text-gray-400 mb-8 font-medium">Don't worry, every mistake is a lesson. Let's try again!</p>
        <button 
          onClick={() => window.location.reload()}
          className="px-8 py-4 bg-blue-600 hover:bg-blue-500 rounded-2xl font-black text-white transition-all transform hover:scale-105"
        >
          RETRY SESSION
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto w-full space-y-8">
      {/* Progress Bar & Status */}
      <div className="flex items-center gap-6 px-4">
        <div className="flex-1 h-3 bg-white/5 rounded-full overflow-hidden border border-white/5">
          <motion.div 
            className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
            initial={{ width: 0 }}
            animate={{ width: `${((currentStage * items.length + currentStep) / (stages.length * items.length)) * 100}%` }}
          />
        </div>
        <div className="flex items-center gap-2">
          <Heart className={cn("w-6 h-6 fill-red-500 text-red-500 transition-transform", hearts <= 1 && "animate-pulse")} />
          <span className="font-black text-xl">{hearts}</span>
        </div>
      </div>

      <div className="min-h-[500px] flex flex-col justify-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={`${currentStage}-${currentStep}`}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="w-full"
          >
            {currentSchema.type === 'LANGUAGE_LIVE_STORY' && (
              <LiveStoryStage item={currentItem} onSpeak={speak} onContinue={() => handleNext()} />
            )}

            {currentSchema.type === 'LANGUAGE_SENTENCE_BUILDER' && (
              <SentenceBuilderStage item={currentItem} onSubmit={submitAnswer} />
            )}

            {(currentSchema.type === 'GENERAL_QUIZ_TERMS' || currentSchema.type === 'GENERAL_QUIZ_SHORT') && (
              <QuizStage item={currentItem} onSubmit={submitAnswer} />
            )}

            {currentSchema.type === 'SCIENCES_QUIZ_BOOLEAN' && (
              <BooleanStage item={currentItem} onSubmit={submitAnswer} />
            )}
            
            {currentSchema.type === 'LANGUAGES_PAIRS_GLOSSARY' && (
              <GlossaryTrainingStage item={currentItem} onSpeak={speak} onSubmit={submitAnswer} />
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Feedback Overlay */}
      <AnimatePresence>
        {isFeedbackVisible && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className={cn(
              "fixed bottom-0 left-0 right-0 p-8 z-50",
              isCorrect ? "bg-green-500" : "bg-red-500"
            )}
          >
            <div className="max-w-4xl mx-auto flex items-center justify-between">
              <div className="flex items-center gap-4 text-white">
                {isCorrect ? <CheckCircle2 className="w-10 h-10" /> : <XCircle className="w-10 h-10" />}
                <div>
                  <h3 className="text-2xl font-black">{isCorrect ? 'Excellent!' : 'Correct Answer:'}</h3>
                  <p className="font-bold opacity-90">
                    {isCorrect ? '+10 Knowledge Points' : (currentItem.correctAnswer || currentItem.correct_sentence || currentItem.target)}
                  </p>
                </div>
              </div>
              <button
                onClick={handleNext}
                className="px-10 py-4 bg-white text-black rounded-2xl font-black hover:bg-gray-100 transition-colors shadow-2xl"
              >
                CONTINUE
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// --- Specific Stage Components ---

function LiveStoryStage({ item, onSpeak, onContinue }: any) {
  const [activeWord, setActiveWord] = useState<string | null>(null);

  return (
    <div className="bg-[#1E1E2E] p-10 rounded-[3rem] border border-white/5 shadow-2xl relative overflow-hidden rtl">
      <div className="absolute top-0 right-0 p-8 opacity-5">
        <BookOpen className="w-32 h-32" />
      </div>
      
      <h2 className="text-3xl font-black mb-8 text-blue-400 ltr">{item.title}</h2>
      
      <div className="space-y-6 mb-10 ltr">
        {item.paragraphs.map((para: string, i: number) => (
          <p key={i} className="text-2xl leading-relaxed text-white font-medium flex flex-wrap gap-x-2">
            {para.split(' ').map((word, j) => {
              const cleanWord = word.replace(/[.,!?]/g, '');
              const translation = item.glossary[cleanWord];
              return (
                <span 
                  key={j}
                  onClick={() => {
                    onSpeak(cleanWord);
                    setActiveWord(cleanWord === activeWord ? null : cleanWord);
                  }}
                  className={cn(
                    "cursor-pointer hover:text-blue-400 border-b-2 border-transparent hover:border-blue-400 transition-all relative pb-1",
                    activeWord === cleanWord && "text-blue-400 border-blue-400"
                  )}
                >
                  {word}
                  {activeWord === cleanWord && translation && (
                    <motion.span 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1 bg-blue-600 text-white text-sm rounded-lg whitespace-nowrap z-10"
                    >
                      {translation}
                    </motion.span>
                  )}
                </span>
              );
            })}
          </p>
        ))}
      </div>

      <div className="flex justify-between items-center pt-8 border-t border-white/5">
        <button 
          onClick={() => onSpeak(item.paragraphs.join(' '))}
          className="flex items-center gap-3 text-blue-400 font-bold hover:text-blue-300 transition-colors"
        >
          <Volume2 className="w-6 h-6" />
          Listen to Story
        </button>
        <button 
          onClick={onContinue}
          className="px-8 py-3 bg-blue-600 rounded-2xl font-black hover:bg-blue-500 transition-all"
        >
          I UNDERSTOOD
        </button>
      </div>
    </div>
  );
}

function SentenceBuilderStage({ item, onSubmit }: any) {
  const [selectedWords, setSelectedWords] = useState<string[]>([]);
  const [availableWords, setAvailableWords] = useState<string[]>(item.scrambled_words);

  const toggleWord = (word: string, isRemoving: boolean) => {
    if (isRemoving) {
      setSelectedWords(prev => prev.filter(w => w !== word));
      setAvailableWords(prev => [...prev, word]);
    } else {
      setSelectedWords(prev => [...prev, word]);
      setAvailableWords(prev => prev.filter(w => w !== word));
    }
  };

  const check = () => {
    onSubmit(selectedWords.join(' ') === item.correct_sentence);
  };

  return (
    <div className="space-y-10 text-center">
      <div className="bg-white/5 p-8 rounded-3xl border border-white/5 inline-block mx-auto">
         <h2 className="text-2xl font-black text-gray-400 uppercase tracking-widest mb-4">Build the sentence</h2>
         <p className="text-3xl font-black text-white rtl">{item.hebrew_prompt}</p>
      </div>

      <div className="min-h-[120px] flex flex-wrap justify-center gap-3 p-6 border-2 border-dashed border-white/10 rounded-[2rem]">
        {selectedWords.map((word, i) => (
          <motion.div
            layoutId={word}
            key={i}
            onClick={() => toggleWord(word, true)}
            className="px-6 py-4 bg-blue-600 border-b-4 border-blue-800 rounded-2xl text-xl font-bold cursor-pointer hover:bg-blue-500"
          >
            {word}
          </motion.div>
        ))}
      </div>

      <div className="flex flex-wrap justify-center gap-3">
        {availableWords.map((word, i) => (
          <motion.div
            layoutId={word}
            key={i}
            onClick={() => toggleWord(word, false)}
            className="px-6 py-4 bg-[#1E1E2E] border-2 border-white/10 rounded-2xl text-xl font-bold cursor-pointer hover:bg-white/5"
          >
            {word}
          </motion.div>
        ))}
      </div>

      <div className="pt-10">
        <button
          disabled={selectedWords.length === 0}
          onClick={check}
          className="px-12 py-5 bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl font-black text-2xl shadow-xl hover:scale-105 transition-all disabled:opacity-50 disabled:scale-100"
        >
          CHECK ANSWER
        </button>
      </div>
    </div>
  );
}

function GlossaryTrainingStage({ item, onSpeak, onSubmit }: any) {
  // Use generic related emojis for "icons"
  const getIcon = (word: string) => {
    const emojis: Record<string, string> = {
      'apple': '🍎', 'dog': '🐶', 'cat': '🐱', 'book': '📖', 'water': '💧',
      'happy': '😊', 'run': '🏃', 'sun': '☀️', 'home': '🏠', 'car': '🚗'
    };
    return emojis[word.toLowerCase()] || '✨';
  };

  return (
    <div className="flex flex-col items-center gap-12 text-center">
      <motion.div 
        animate={{ scale: [1, 1.1, 1] }} 
        transition={{ repeat: Infinity, duration: 3 }}
        className="w-48 h-48 bg-[#1E1E2E] flex items-center justify-center text-8xl rounded-full border-4 border-white/5 shadow-[0_0_50px_rgba(59,130,246,0.2)]"
      >
        {getIcon(item.prompt)}
      </motion.div>

      <div className="space-y-4">
        <h2 className="text-6xl font-black tracking-tighter ltr">{item.prompt}</h2>
        <button onClick={() => onSpeak(item.prompt)} className="text-blue-400 hover:text-blue-300">
          <Volume2 className="w-8 h-8 mx-auto" />
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4 w-full">
        {/* Simplified for demo, usually we'd have distractors from other item targets */}
        <button 
          onClick={() => onSubmit(true)}
          className="p-8 bg-[#1E1E2E] rounded-3xl border border-white/5 hover:bg-blue-600 transition-all font-black text-2xl"
        >
          {item.target}
        </button>
        <button 
          onClick={() => onSubmit(false)}
          className="p-8 bg-[#1E1E2E] rounded-3xl border border-white/5 hover:bg-red-600 transition-all font-black text-2xl"
        >
          שגיאה
        </button>
      </div>
    </div>
  );
}

function QuizStage({ item, onSubmit }: any) {
  const options = [...item.distractors, item.correctAnswer].sort(() => Math.random() - 0.5);

  return (
    <div className="space-y-12">
      <div className="text-center">
        <h2 className="text-4xl font-black mb-4 ltr">{item.question}</h2>
        <div className="h-1 w-24 bg-blue-500 mx-auto rounded-full" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4">
        {options.map((opt, i) => (
          <motion.button
            key={i}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onSubmit(opt === item.correctAnswer)}
            className="p-8 bg-[#1E1E2E] border-2 border-white/5 rounded-[2rem] text-xl font-bold transition-all hover:bg-white/5 hover:border-blue-500 group"
          >
            <div className="flex items-center gap-6">
               <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-blue-500/20 group-hover:text-blue-500 font-black">
                 {String.fromCharCode(65 + i)}
               </div>
               <span className="flex-1 text-left">{opt}</span>
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  );
}

function BooleanStage({ item, onSubmit }: any) {
  return (
    <div className="flex flex-col items-center gap-12 py-10">
      <div className="bg-[#1E1E2E] p-12 rounded-[3.5rem] border border-white/5 text-center shadow-2xl relative w-full">
         <Sparkles className="w-12 h-12 text-purple-500 absolute -top-6 left-1/2 -translate-x-1/2" />
         <p className="text-3xl font-bold leading-relaxed">{item.statement}</p>
      </div>

      <div className="flex gap-8 w-full max-w-md">
        <button 
          onClick={() => onSubmit(item.isTrue === true)}
          className="flex-1 py-10 bg-green-500/10 border-2 border-green-500/20 rounded-[2.5rem] text-green-500 font-black text-3xl hover:bg-green-500 hover:text-white transition-all transform hover:-rotate-2"
        >
          YES
        </button>
        <button 
          onClick={() => onSubmit(item.isTrue === false)}
          className="flex-1 py-10 bg-red-500/10 border-2 border-red-500/20 rounded-[2.5rem] text-red-500 font-black text-3xl hover:bg-red-500 hover:text-white transition-all transform hover:rotate-2"
        >
          NO
        </button>
      </div>
    </div>
  );
}

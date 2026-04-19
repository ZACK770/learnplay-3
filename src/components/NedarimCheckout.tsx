import React, { useState } from 'react';
import { motion } from 'motion/react';
import { CreditCard, ShieldCheck, Lock, ChevronRight, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { cn } from '../lib/utils';
import { useTranslation } from '../contexts/TranslationContext';
import { api } from '../services/api';

interface NedarimCheckoutProps {
  user: any;
  plan: 'pro' | 'premium' | 'creator';
  billingCycle: 'monthly' | 'annual';
  onSuccess: () => void;
  onCancel: () => void;
}

export default function NedarimCheckout({ user, plan, billingCycle, onSuccess, onCancel }: NedarimCheckoutProps) {
  const { language } = useTranslation();
  const isRTL = language === 'he';

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    creditCard: '',
    expiry: '',
    cvv: '',
    customerName: user?.displayName || '',
    email: user?.email || '',
    zeout: ''
  });

  const getPrice = () => {
    const prices = {
      pro: { monthly: 35, annual: 350 },
      premium: { monthly: 59, annual: 590 },
      creator: { monthly: 99, annual: 990 }
    };
    return prices[plan][billingCycle];
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const result = await api.processDirectPayment({
        plan,
        billingCycle,
        ...formData
      });

      if (result.success) {
        setSuccess(true);
        setTimeout(() => {
          onSuccess();
        }, 3000);
      } else {
        setError(result.message || (isRTL ? "החיוב נכשל. נא לוודא את פרטי הכרטיס." : "Payment failed. Please check your card details."));
      }
    } catch (err: any) {
      setError(err.response?.data?.message || (isRTL ? "שגיאה בשרת. נא לנסות שוב מאוחר יותר." : "Server error. Please try again later."));
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center space-y-6">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center text-green-500"
        >
          <CheckCircle2 className="w-12 h-12" />
        </motion.div>
        <h2 className="text-3xl font-black">{isRTL ? "התשלום עבר בהצלחה!" : "Payment Successful!"}</h2>
        <p className="text-gray-400">
          {isRTL ? "המנוי שלך הופעל. כעת תוכל ליהנות מיצירות AI ללא הגבלה." : "Your subscription is active. Enjoy unlimited AI generations now."}
        </p>
        <div className="animate-pulse text-blue-400 font-bold">
          {isRTL ? "מעביר אותך חזרה..." : "Redirecting you back..."}
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <header className="flex items-center justify-between mb-8">
        <button onClick={onCancel} className="text-gray-500 hover:text-white flex items-center gap-2 text-sm font-bold">
           <ChevronRight className={cn("w-4 h-4", !isRTL && "rotate-180")} />
           {isRTL ? "חזרה" : "Back"}
        </button>
        <div className="text-right">
          <h2 className="text-2xl font-black">{isRTL ? "חיוב מאובטח" : "Secure Checkout"}</h2>
          <p className="text-gray-500 text-xs uppercase tracking-widest">{plan} • {billingCycle}</p>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        {/* Payment Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-[10px] text-gray-500 uppercase font-black pl-1">{isRTL ? "שם בעל הכרטיס" : "Cardholder Name"}</label>
            <input
              required
              name="customerName"
              value={formData.customerName}
              onChange={handleInputChange}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 transition-all"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] text-gray-500 uppercase font-black pl-1">{isRTL ? "מספר כרטיס" : "Card Number"}</label>
            <div className="relative">
              <input
                required
                name="creditCard"
                placeholder="0000 0000 0000 0000"
                value={formData.creditCard}
                onChange={handleInputChange}
                className="w-full bg-white/5 border border-white/10 rounded-xl pl-4 pr-12 py-3 focus:outline-none focus:border-blue-500 transition-all font-mono"
              />
              <CreditCard className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
               <label className="text-[10px] text-gray-500 uppercase font-black pl-1">{isRTL ? "תוקף (MMYY)" : "Expiry (MMYY)"}</label>
               <input
                required
                name="expiry"
                placeholder="MMYY"
                maxLength={4}
                value={formData.expiry}
                onChange={handleInputChange}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 transition-all font-mono"
              />
            </div>
            <div className="space-y-1">
               <label className="text-[10px] text-gray-500 uppercase font-black pl-1">CVV</label>
               <input
                required
                name="cvv"
                placeholder="123"
                maxLength={3}
                value={formData.cvv}
                onChange={handleInputChange}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 transition-all font-mono"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] text-gray-500 uppercase font-black pl-1">{isRTL ? "תעודת זהות" : "ID Number"}</label>
            <input
              required
              name="zeout"
              value={formData.zeout}
              onChange={handleInputChange}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 transition-all font-mono"
            />
          </div>

          {error && (
            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 text-sm flex items-center gap-3">
              <AlertCircle className="w-4 h-4 shrink-0" />
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className={cn(
              "w-full py-4 rounded-xl font-black text-lg transition-all flex items-center justify-center gap-3 mt-6",
              isLoading ? "bg-gray-800 text-gray-500" : "bg-blue-600 text-white hover:bg-blue-500 shadow-xl shadow-blue-600/20"
            )}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>{isRTL ? "מעבד תשלום..." : "Processing..."}</span>
              </>
            ) : (
              <>
                <ShieldCheck className="w-5 h-5" />
                <span>{isRTL ? `שלם כעת ₪${getPrice()}` : `Pay ₪${getPrice()} Now`}</span>
              </>
            )}
          </button>
        </form>

        {/* Info Section */}
        <div className="space-y-6">
          <div className="bg-[#1E1E2E] p-6 rounded-2xl border border-white/5 space-y-4">
             <h4 className="font-bold text-lg">{isRTL ? "פרטי הזמנה" : "Order Summary"}</h4>
             <div className="space-y-2 text-sm">
                <div className="flex justify-between items-center">
                  <span className="text-gray-500">{isRTL ? "מסלול" : "Plan"}</span>
                  <span className="font-bold uppercase text-blue-400">{plan}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-500">{isRTL ? "מחזור חיוב" : "Billing"}</span>
                  <span className="font-bold">{isRTL ? (billingCycle === 'annual' ? "שנתי" : "חודשי") : billingCycle}</span>
                </div>
                <div className="pt-4 border-t border-white/5 flex justify-between items-center">
                  <span className="font-bold">{isRTL ? "סה\"כ לתשלום" : "Total Amount"}</span>
                  <span className="text-2xl font-black">₪{getPrice()}</span>
                </div>
             </div>
          </div>

          <div className="p-6 rounded-2xl bg-blue-500/5 border border-blue-500/10 space-y-3">
            <div className="flex items-center gap-2 text-blue-400">
               <Lock className="w-4 h-4" />
               <span className="text-xs font-black uppercase tracking-widest">{isRTL ? "אבטחה מקסימלית" : "Server-Side Security"}</span>
            </div>
            <p className="text-[10px] text-gray-500 leading-relaxed">
              {isRTL 
                ? "המידע שלך מעורבל ומאובטח באמצעות פרוטוקול SSL 256-bit. התשלום מתבצע ישירות מול שרתי נדרים פלוס ללא שימוש ב-iframe, להבטחת חוויה חלקה ובטוחה."
                : "Your data is encrypted using 256-bit SSL protocol. Payments are processed directly through Nedarim Plus servers without iframes for maximum security and seamless experience."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

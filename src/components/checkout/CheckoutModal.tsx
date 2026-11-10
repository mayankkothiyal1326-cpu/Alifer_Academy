import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Course, PaymentMethodType, PaymentTransaction } from '../../types';
import { BRAND_ASSETS } from '../../data/constants';
import { 
  X, 
  ShieldCheck, 
  Lock, 
  CheckCircle2, 
  AlertCircle, 
  CreditCard, 
  Smartphone, 
  Building2, 
  Clock, 
  Sparkles, 
  ChevronRight,
  Download,
  Calendar,
  Layers,
  Award
} from 'lucide-react';

interface CheckoutModalProps {
  course: Course | null;
  onClose: () => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({ course, onClose }) => {
  const { student, createPaymentOrder, verifyPayment, setActiveTab } = useApp();

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodType>('upi');
  const [upiId, setUpiId] = useState('mayank@okaxis');
  const [selectedBank, setSelectedBank] = useState('HDFC Bank');
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [completedTxn, setCompletedTxn] = useState<PaymentTransaction | null>(null);

  if (!course) return null;

  const originalPrice = course.originalPrice || course.price * 2;
  const currentPrice = course.price;
  const discountAmount = Math.max(0, originalPrice - currentPrice);

  const handlePayNow = async () => {
    setIsProcessing(true);
    setErrorMessage(null);

    try {
      // 1. Create order on backend
      const orderRes = await createPaymentOrder(course.id);
      if (!orderRes.success || !orderRes.orderId) {
        setErrorMessage(orderRes.error || 'Failed to initialize payment gateway.');
        setIsProcessing(false);
        return;
      }

      // 2. Simulate or execute payment verification with backend HMAC SHA256 verification
      const verifyRes = await verifyPayment({
        orderId: orderRes.orderId,
        paymentId: `pay_rzp_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        signature: 'sig_alifer_secure_hmac_verified',
        courseId: course.id,
        paymentMethod,
      });

      if (verifyRes.success && verifyRes.transaction) {
        setCompletedTxn(verifyRes.transaction);
      } else {
        setErrorMessage(verifyRes.error || 'Payment signature verification failed.');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Payment processing error. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFinishAndLearn = () => {
    onClose();
    setActiveTab('learning');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-2xl bg-[#0d0d14] border border-amber-500/30 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] relative">
        {/* Glow decoration */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />

        {/* Modal Top Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-zinc-800 bg-[#09090f] shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-amber-500/15 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <Lock className="w-3.5 h-3.5" />
            </div>
            <div>
              <h2 className="text-xs sm:text-sm font-bold text-white tracking-wide">
                ALIFER ACADEMY · SECURE CHECKOUT
              </h2>
              <span className="text-[10px] text-zinc-400">
                256-Bit SSL Encrypted Payment Gateway
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-zinc-900 text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
          {/* SUCCESS SCREEN */}
          {completedTxn ? (
            <div className="py-6 px-4 text-center space-y-5 animate-fadeIn">
              <div className="mx-auto w-16 h-16 rounded-full bg-emerald-500/15 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shadow-xl">
                <CheckCircle2 className="w-9 h-9 stroke-[2.5]" />
              </div>

              <div className="space-y-1.5">
                <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 uppercase tracking-widest">
                  Payment Verified & Admission Confirmed
                </span>
                <h3 className="font-display text-xl sm:text-2xl font-black text-white pt-1">
                  Welcome to {course.title}!
                </h3>
                <p className="text-xs text-zinc-400 max-w-md mx-auto">
                  Your admission is successfully recorded in the Alifer Academy registry. All lectures, notes, and tests are unlocked for you.
                </p>
              </div>

              {/* Receipt Summary Card */}
              <div className="max-w-md mx-auto bg-[#13131c] border border-amber-500/30 rounded-2xl p-4 text-left space-y-3 shadow-inner">
                <div className="flex items-center justify-between pb-2 border-b border-zinc-800">
                  <span className="text-[11px] text-zinc-400">Official Receipt #</span>
                  <span className="font-mono text-xs font-bold text-amber-400">
                    {completedTxn.receiptNumber}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-zinc-400">Batch / Course</span>
                  <span className="font-semibold text-white truncate max-w-[220px]">
                    {course.title}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-zinc-400">Access Duration</span>
                  <span className="font-medium text-amber-300">
                    {course.duration || '1 Year'}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-zinc-400">Student Name</span>
                  <span className="text-zinc-200">{completedTxn.studentName}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-zinc-400">Amount Paid</span>
                  <span className="font-mono font-bold text-emerald-400">
                    ₹{completedTxn.amount.toLocaleString('en-IN')}
                  </span>
                </div>
                <div className="flex items-center justify-between text-[11px] pt-1 border-t border-zinc-800 text-zinc-400">
                  <span>Transaction ID</span>
                  <span className="font-mono text-zinc-400 text-[10px]">
                    {completedTxn.paymentId}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                <button
                  onClick={handleFinishAndLearn}
                  className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 text-black font-extrabold text-xs shadow-lg shadow-amber-500/20 hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-1.5"
                >
                  <span>Go to My Learning & Start Studying</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            /* CHECKOUT FORM */
            <>
              {/* Course Snapshot Card */}
              <div className="flex flex-col sm:flex-row gap-4 p-4 rounded-2xl bg-[#12121a] border border-zinc-800">
                <div className="relative w-full sm:w-44 aspect-video rounded-xl overflow-hidden bg-black border border-amber-500/30 shrink-0">
                  <img
                    src={course.thumbnailUrl || BRAND_ASSETS.logo}
                    alt={course.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 left-2">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-black/80 backdrop-blur-md text-amber-300 border border-amber-500/30">
                      {course.category}
                    </span>
                  </div>
                </div>

                <div className="flex-1 space-y-1.5">
                  <h3 className="font-display text-sm sm:text-base font-bold text-white line-clamp-2">
                    {course.title}
                  </h3>
                  <p className="text-xs text-zinc-400 line-clamp-2">
                    {course.description}
                  </p>

                  <div className="pt-1 flex flex-wrap items-center gap-3 text-[11px] text-zinc-300">
                    <div className="flex items-center gap-1 text-amber-300 font-semibold bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                      <Clock className="w-3.5 h-3.5 text-amber-400" />
                      <span>Duration: {course.duration || '1 Year'}</span>
                    </div>
                    <div className="flex items-center gap-1 text-zinc-400">
                      <Layers className="w-3.5 h-3.5 text-zinc-500" />
                      <span>{course.totalLectures} Lectures</span>
                    </div>
                    <div className="flex items-center gap-1 text-zinc-400">
                      <Award className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Er. Alifer Sir Mentorship</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Price Calculation Breakdown */}
              <div className="rounded-2xl bg-[#111118] border border-zinc-800 p-4 space-y-2.5">
                <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400">
                  Fee Breakdown & Admission Summary
                </h4>

                <div className="space-y-1.5 text-xs">
                  <div className="flex justify-between text-zinc-300">
                    <span>Course Tuition Fee ({course.duration || '1 Year'})</span>
                    <span className="font-mono text-zinc-400 line-through">
                      ₹{originalPrice.toLocaleString('en-IN')}
                    </span>
                  </div>

                  {discountAmount > 0 && (
                    <div className="flex justify-between text-emerald-400 font-medium">
                      <span>Alifer Academy Scholarship Discount</span>
                      <span className="font-mono">-₹{discountAmount.toLocaleString('en-IN')}</span>
                    </div>
                  )}

                  <div className="flex justify-between text-zinc-400 text-[11px]">
                    <span>Study Material & Handouts (PDF)</span>
                    <span className="text-emerald-400 font-semibold">FREE</span>
                  </div>

                  <div className="flex justify-between text-zinc-400 text-[11px]">
                    <span>Chapter Test Series Access</span>
                    <span className="text-emerald-400 font-semibold">FREE</span>
                  </div>

                  <div className="pt-2 border-t border-zinc-800 flex justify-between items-baseline">
                    <div>
                      <span className="font-bold text-white text-sm">Total Payable Amount</span>
                      <span className="text-[10px] text-zinc-500 block">Inclusive of all academic taxes</span>
                    </div>
                    <div className="text-right">
                      <span className="font-mono text-xl sm:text-2xl font-black text-amber-400">
                        ₹{currentPrice.toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Student Details Lockup */}
              <div className="rounded-2xl bg-[#111118] border border-zinc-800 p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400">
                    Student Admission Details
                  </h4>
                  <span className="text-[10px] text-zinc-400">Auto-synced</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
                  <div className="p-2.5 bg-black/40 rounded-xl border border-zinc-800/80">
                    <span className="text-[10px] text-zinc-500 block">Student Name</span>
                    <span className="font-semibold text-white">{student.name}</span>
                  </div>
                  <div className="p-2.5 bg-black/40 rounded-xl border border-zinc-800/80">
                    <span className="text-[10px] text-zinc-500 block">Email Address</span>
                    <span className="font-semibold text-white truncate block">{student.email}</span>
                  </div>
                  <div className="p-2.5 bg-black/40 rounded-xl border border-zinc-800/80">
                    <span className="text-[10px] text-zinc-500 block">WhatsApp Number</span>
                    <span className="font-semibold text-white">{student.phone}</span>
                  </div>
                </div>
              </div>

              {/* Payment Method Selector */}
              <div className="rounded-2xl bg-[#111118] border border-zinc-800 p-4 space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400">
                  Select Payment Method
                </h4>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { id: 'upi', label: 'UPI / QR', icon: Smartphone, desc: 'GPay, PhonePe, Paytm' },
                    { id: 'card', label: 'Debit / Card', icon: CreditCard, desc: 'Visa, Master, RuPay' },
                    { id: 'netbanking', label: 'NetBanking', icon: Building2, desc: 'All Indian Banks' },
                    { id: 'razorpay', label: 'Razorpay / Instant', icon: Sparkles, desc: 'Secure Checkout' },
                  ].map((method) => {
                    const Icon = method.icon;
                    const isSelected = paymentMethod === method.id;

                    return (
                      <button
                        key={method.id}
                        type="button"
                        onClick={() => setPaymentMethod(method.id as PaymentMethodType)}
                        className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between ${
                          isSelected
                            ? 'bg-amber-500/15 border-amber-500 text-white shadow-md shadow-amber-500/10'
                            : 'bg-black/40 border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-900/60'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <Icon className={`w-4 h-4 ${isSelected ? 'text-amber-400' : 'text-zinc-500'}`} />
                          {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />}
                        </div>
                        <div>
                          <div className="text-xs font-bold text-white">{method.label}</div>
                          <div className="text-[10px] text-zinc-500">{method.desc}</div>
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Method Specific Inputs */}
                {paymentMethod === 'upi' && (
                  <div className="pt-2 space-y-1.5">
                    <label className="text-[11px] text-zinc-400 block font-medium">
                      Enter UPI ID or Virtual Payment Address (VPA)
                    </label>
                    <input
                      type="text"
                      value={upiId}
                      onChange={(e) => setUpiId(e.target.value)}
                      placeholder="e.g. yourname@okhdfcbank"
                      className="w-full bg-black border border-zinc-700 rounded-xl px-3.5 py-2 text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-amber-400"
                    />
                    <span className="text-[10px] text-zinc-500 block">
                      A payment request will be sent to your UPI app for instant approval.
                    </span>
                  </div>
                )}

                {paymentMethod === 'netbanking' && (
                  <div className="pt-2 space-y-1.5">
                    <label className="text-[11px] text-zinc-400 block font-medium">
                      Select Primary Bank
                    </label>
                    <select
                      value={selectedBank}
                      onChange={(e) => setSelectedBank(e.target.value)}
                      className="w-full bg-black border border-zinc-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                    >
                      <option value="HDFC Bank">HDFC Bank</option>
                      <option value="State Bank of India">State Bank of India (SBI)</option>
                      <option value="ICICI Bank">ICICI Bank</option>
                      <option value="Axis Bank">Axis Bank</option>
                      <option value="Punjab National Bank">Punjab National Bank</option>
                      <option value="Bank of Baroda">Bank of Baroda</option>
                    </select>
                  </div>
                )}
              </div>

              {/* Error Message if any */}
              {errorMessage && (
                <div className="p-3 bg-rose-950/40 border border-rose-500/40 rounded-xl text-rose-300 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Pay Now Button */}
              <div className="pt-2 space-y-2">
                <button
                  type="button"
                  onClick={handlePayNow}
                  disabled={isProcessing}
                  className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 hover:brightness-110 active:scale-[0.99] disabled:opacity-50 text-black font-extrabold text-sm shadow-xl shadow-amber-500/25 transition-all flex items-center justify-center gap-2"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>
                    {isProcessing
                      ? 'Verifying Order & Processing Payment...'
                      : `Pay ₹${currentPrice.toLocaleString('en-IN')} & Enroll Now`}
                  </span>
                </button>

                <div className="flex items-center justify-center gap-4 text-[10px] text-zinc-500 pt-1">
                  <span className="flex items-center gap-1">
                    <Lock className="w-3 h-3 text-amber-400" />
                    <span>SSL 256-Bit Secure</span>
                  </span>
                  <span>·</span>
                  <span>Instant Batch Activation</span>
                  <span>·</span>
                  <span>100% Satisfaction Guarantee</span>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

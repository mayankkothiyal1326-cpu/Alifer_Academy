import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { BRAND_ASSETS } from '../../data/constants';
import { X, Smartphone, Mail, Lock, ShieldCheck, ArrowRight, CheckCircle2 } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const { updateStudent, setIsOnboardingOpen } = useApp();
  const [authMode, setAuthMode] = useState<'otp' | 'email' | 'signup'>('otp');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otpStep, setOtpStep] = useState(false);
  const [otpCode, setOtpCode] = useState(['', '', '', '', '', '']);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  if (!isOpen) return null;

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneNumber || phoneNumber.length < 10) {
      setErrorMessage('Please enter a valid 10-digit mobile number.');
      return;
    }
    setErrorMessage('');
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setOtpStep(true);
    }, 600);
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      updateStudent({
        phone: `+91 ${phoneNumber}`,
      });
      onClose();
    }, 600);
  };

  const handleEmailAuth = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMessage('Please enter both email and password.');
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      updateStudent({
        email,
        name: name || email.split('@')[0],
      });
      onClose();
    }, 600);
  };

  const handleGoogleLogin = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      updateStudent({
        name: 'Mayank Vaishno (Google)',
        email: 'vaishnomayank@gmail.com',
      });
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-[#0e0e15] border border-amber-500/30 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Top Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-800 bg-[#09090d]">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-full overflow-hidden p-0.5 bg-amber-500">
              <img src={BRAND_ASSETS.logo} alt="" className="w-full h-full object-cover rounded-full" />
            </div>
            <span className="font-display text-xs sm:text-sm font-extrabold text-white tracking-wider">
              ALIFER ACADEMY
            </span>
          </div>
          <button onClick={onClose} className="p-1 text-zinc-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          <div className="text-center space-y-1">
            <h2 className="font-display text-lg sm:text-xl font-bold text-white">
              {authMode === 'signup' ? 'Create Student Account' : 'Welcome to Alifer Academy'}
            </h2>
            <p className="text-xs text-zinc-400">
              Access your enrolled courses, test series & lecture notes
            </p>
          </div>

          {/* Mode Switcher Tabs */}
          <div className="grid grid-cols-2 p-1 bg-zinc-950 rounded-xl border border-zinc-800 text-xs font-semibold">
            <button
              onClick={() => { setAuthMode('otp'); setOtpStep(false); setErrorMessage(''); }}
              className={`py-2 rounded-lg transition-colors ${
                authMode === 'otp'
                  ? 'bg-amber-400 text-black shadow-sm'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              Mobile OTP
            </button>
            <button
              onClick={() => { setAuthMode('email'); setErrorMessage(''); }}
              className={`py-2 rounded-lg transition-colors ${
                authMode === 'email' || authMode === 'signup'
                  ? 'bg-amber-400 text-black shadow-sm'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              Email & Password
            </button>
          </div>

          {errorMessage && (
            <div className="p-2.5 rounded-lg bg-rose-950/40 border border-rose-500/40 text-rose-300 text-xs">
              {errorMessage}
            </div>
          )}

          {/* 1. MOBILE OTP FORM */}
          {authMode === 'otp' && (
            !otpStep ? (
              <form onSubmit={handleSendOtp} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-semibold text-zinc-300 block">
                    Mobile Number
                  </label>
                  <div className="flex items-center bg-[#121219] border border-zinc-700 rounded-xl px-3 py-2.5">
                    <span className="text-xs font-bold text-amber-400 mr-2">+91</span>
                    <input
                      type="tel"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, '').slice(0, 10))}
                      placeholder="Enter 10-digit number"
                      maxLength={10}
                      className="bg-transparent flex-1 text-xs text-white focus:outline-none"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading || phoneNumber.length < 10}
                  className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-40 text-black font-extrabold text-xs transition-colors flex items-center justify-center gap-1.5 shadow-lg shadow-amber-950/40"
                >
                  <span>{loading ? 'Sending OTP...' : 'Send Verification OTP'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            ) : (
              <form onSubmit={handleVerifyOtp} className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-zinc-300">Enter OTP sent to +91 {phoneNumber}</span>
                    <button
                      type="button"
                      onClick={() => setOtpStep(false)}
                      className="text-amber-400 text-[11px] hover:underline"
                    >
                      Change
                    </button>
                  </div>

                  <div className="flex justify-between gap-2">
                    {otpCode.map((digit, i) => (
                      <input
                        key={i}
                        id={`otp-${i}`}
                        type="text"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => {
                          const val = e.target.value;
                          const newArr = [...otpCode];
                          newArr[i] = val;
                          setOtpCode(newArr);
                          if (val && i < 5) {
                            document.getElementById(`otp-${i + 1}`)?.focus();
                          }
                        }}
                        className="w-10 h-12 text-center text-base font-mono font-bold bg-[#121219] border border-zinc-700 focus:border-amber-400 rounded-xl text-white focus:outline-none"
                      />
                    ))}
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-xs transition-colors"
                >
                  {loading ? 'Verifying...' : 'Verify OTP & Enter'}
                </button>
              </form>
            )
          )}

          {/* 2. EMAIL & PASSWORD FORM */}
          {(authMode === 'email' || authMode === 'signup') && (
            <form onSubmit={handleEmailAuth} className="space-y-3">
              {authMode === 'signup' && (
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-zinc-300 block">
                    Full Student Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Rahul Sharma"
                    className="w-full bg-[#121219] border border-zinc-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
              )}

              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-zinc-300 block">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="student@example.com"
                  className="w-full bg-[#121219] border border-zinc-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-zinc-300 block">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-[#121219] border border-zinc-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-xs transition-colors"
              >
                {loading ? 'Authenticating...' : authMode === 'signup' ? 'Sign Up' : 'Log In'}
              </button>

              <div className="text-center pt-1 text-xs">
                {authMode === 'email' ? (
                  <span className="text-zinc-400">
                    New student?{' '}
                    <button
                      type="button"
                      onClick={() => setAuthMode('signup')}
                      className="text-amber-400 font-bold hover:underline"
                    >
                      Sign Up
                    </button>
                  </span>
                ) : (
                  <span className="text-zinc-400">
                    Already have an account?{' '}
                    <button
                      type="button"
                      onClick={() => setAuthMode('email')}
                      className="text-amber-400 font-bold hover:underline"
                    >
                      Log In
                    </button>
                  </span>
                )}
              </div>
            </form>
          )}

          {/* Google Sign In Divider */}
          <div className="relative flex py-1 items-center">
            <div className="flex-grow border-t border-zinc-800" />
            <span className="flex-shrink mx-3 text-[10px] text-zinc-500 uppercase tracking-wider font-semibold">
              Or continue with
            </span>
            <div className="flex-grow border-t border-zinc-800" />
          </div>

          {/* Google Login Button */}
          <button
            onClick={handleGoogleLogin}
            className="w-full py-2.5 rounded-xl bg-[#13131b] hover:bg-[#181824] border border-zinc-800 text-xs font-semibold text-zinc-200 flex items-center justify-center gap-2 transition-colors"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>Continue with Google</span>
          </button>
        </div>
      </div>
    </div>
  );
};

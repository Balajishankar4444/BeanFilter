'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import {
  auth,
  googleProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
} from '@/lib/firebase';
import {
  Lock,
  Mail,
  User,
  Coffee,
  ArrowRight,
  LogOut,
  ShieldCheck,
  KeyRound,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';

export default function LoginPage() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [resetModalOpen, setResetModalOpen] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetLoading, setResetLoading] = useState(false);

  // 1. Google Sign-In
  const handleGoogleSignIn = async () => {
    setError(null);
    setSuccess(null);
    setLoading(true);
    try {
      await signInWithPopup(auth, googleProvider);
      setSuccess('Successfully signed in with Google!');
      setTimeout(() => router.push('/catalog'), 1000);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to sign in with Google');
    } finally {
      setLoading(false);
    }
  };

  // 2. Email & Password Auth (Login or Signup)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!email || !password) {
      setError('Please enter both email and password.');
      return;
    }

    if (isSignUp && password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    setLoading(true);

    try {
      if (isSignUp) {
        await createUserWithEmailAndPassword(auth, email, password);
        setSuccess('Account created successfully! Redirecting...');
      } else {
        await signInWithEmailAndPassword(auth, email, password);
        setSuccess('Signed in successfully! Redirecting...');
      }
      setTimeout(() => router.push('/catalog'), 1200);
    } catch (err: any) {
      console.error(err);
      if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
        setError('Invalid email or password.');
      } else if (err.code === 'auth/email-already-in-use') {
        setError('An account with this email already exists.');
      } else if (err.code === 'auth/invalid-email') {
        setError('Please enter a valid email address.');
      } else {
        setError(err.message || 'Authentication failed.');
      }
    } finally {
      setLoading(false);
    }
  };

  // 3. Password Reset
  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetEmail) return;
    setResetLoading(true);
    try {
      await sendPasswordResetEmail(auth, resetEmail);
      setSuccess(`Password reset email sent to ${resetEmail}`);
      setResetModalOpen(false);
      setResetEmail('');
    } catch (err: any) {
      setError(err.message || 'Failed to send password reset email.');
    } finally {
      setResetLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] py-12 px-4 sm:px-6 lg:px-8 flex flex-col justify-center items-center animate-fade-up">
      <div className="w-full max-w-md space-y-8">
        
        {/* LOGO & HEADER */}
        <div className="text-center">
          <div className="mx-auto h-16 w-16 rounded-2xl bg-amber-900 flex items-center justify-center text-white shadow-xl mb-4 transform hover:scale-105 transition-transform">
            <Coffee className="h-9 w-9 text-amber-300" />
          </div>
          <h2 className="text-3xl font-black text-stone-950 tracking-tight">
            {user ? 'Your Coffee Base Account' : isSignUp ? 'Create your Account' : 'Welcome to Leaf to Bean'}
          </h2>
          <p className="mt-2 text-xs font-semibold text-stone-600">
            {user
              ? 'Logged in with Firebase Authentication'
              : isSignUp
              ? 'Join to save favorite roasters and track price alerts'
              : 'Sign in to access price alerts, saved coffees & basket deals'}
          </p>
        </div>

        {/* ALERTS */}
        {error && (
          <div className="flex items-center gap-2 rounded-2xl bg-red-50 border border-red-200 p-4 text-xs font-bold text-red-800 shadow-sm animate-fade-up">
            <AlertCircle className="h-4 w-4 shrink-0 text-red-600" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="flex items-center gap-2 rounded-2xl bg-emerald-50 border border-emerald-200 p-4 text-xs font-bold text-emerald-800 shadow-sm animate-fade-up">
            <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
            <span>{success}</span>
          </div>
        )}

        {/* LOGGED IN USER CARD */}
        {user ? (
          <div className="rounded-3xl border border-stone-300/80 bg-white p-8 shadow-xl space-y-6 text-center">
            <div className="flex justify-center">
              {user.photoURL ? (
                <img src={user.photoURL} alt={user.displayName || 'User'} className="h-20 w-20 rounded-full border-4 border-amber-900/20 shadow-md" />
              ) : (
                <div className="h-20 w-20 rounded-full bg-amber-900 text-white font-black text-2xl flex items-center justify-center shadow-md">
                  {(user.email || 'U')[0].toUpperCase()}
                </div>
              )}
            </div>

            <div>
              <h3 className="text-lg font-black text-stone-900">{user.displayName || 'Coffee Enthusiast'}</h3>
              <p className="text-xs text-stone-500 font-semibold mt-0.5">{user.email}</p>
              <div className="inline-flex items-center gap-1 mt-3 rounded-full bg-emerald-100/80 px-3 py-1 text-[11px] font-bold text-emerald-900 border border-emerald-300">
                <ShieldCheck size={13} className="text-emerald-700" />
                <span>Verified Firebase Account</span>
              </div>
            </div>

            <div className="pt-4 border-t border-stone-200 flex flex-col gap-3">
              <Link
                href="/catalog"
                className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-amber-900 px-4 py-3 text-xs font-bold text-white shadow-md hover:bg-amber-800 transition-colors"
              >
                <span>Explore Coffee Catalog</span>
                <ArrowRight size={14} />
              </Link>

              <button
                onClick={async () => {
                  await logout();
                  setSuccess('Logged out successfully.');
                }}
                className="w-full inline-flex items-center justify-center gap-2 rounded-xl border border-stone-300 bg-stone-100 px-4 py-2.5 text-xs font-bold text-stone-700 hover:bg-stone-200 transition-colors"
              >
                <LogOut size={14} />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        ) : (
          /* LOGIN / SIGNUP FORM */
          <div className="rounded-3xl border border-stone-300/80 bg-white p-8 shadow-xl space-y-6">
            
            {/* GOOGLE SIGN-IN BUTTON */}
            <button
              onClick={handleGoogleSignIn}
              disabled={loading}
              className="w-full flex items-center justify-center gap-3 rounded-2xl border border-stone-300 bg-white px-4 py-3 text-xs font-extrabold text-stone-800 shadow-sm hover:bg-stone-50 transition-all hover:border-stone-400 active:scale-98 disabled:opacity-50"
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
              </svg>
              <span>Continue with Google</span>
            </button>

            <div className="relative flex items-center justify-center">
              <div className="w-full border-t border-stone-200"></div>
              <span className="absolute bg-white px-3 text-[11px] font-extrabold uppercase tracking-wider text-stone-400">
                Or with Email
              </span>
            </div>

            {/* FORM */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-3 h-4 w-4 text-stone-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    required
                    className="w-full rounded-xl border border-stone-300 bg-[#FAF7F2] py-2.5 pl-10 pr-4 text-xs font-semibold text-stone-900 placeholder-stone-400 outline-none focus:border-amber-900 focus:ring-2 focus:ring-amber-900/20"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-bold text-stone-700">Password</label>
                  {!isSignUp && (
                    <button
                      type="button"
                      onClick={() => setResetModalOpen(true)}
                      className="text-[11px] font-bold text-amber-900 hover:underline"
                    >
                      Forgot password?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-3 h-4 w-4 text-stone-400" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="w-full rounded-xl border border-stone-300 bg-[#FAF7F2] py-2.5 pl-10 pr-4 text-xs font-semibold text-stone-900 placeholder-stone-400 outline-none focus:border-amber-900 focus:ring-2 focus:ring-amber-900/20"
                  />
                </div>
              </div>

              {isSignUp && (
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Confirm Password</label>
                  <div className="relative">
                    <KeyRound className="absolute left-3.5 top-3 h-4 w-4 text-stone-400" />
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                      className="w-full rounded-xl border border-stone-300 bg-[#FAF7F2] py-2.5 pl-10 pr-4 text-xs font-semibold text-stone-900 placeholder-stone-400 outline-none focus:border-amber-900 focus:ring-2 focus:ring-amber-900/20"
                    />
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-2xl bg-amber-900 py-3 text-xs font-extrabold text-white shadow-md hover:bg-amber-800 transition-all active:scale-98 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <span>{loading ? 'Processing...' : isSignUp ? 'Create Account' : 'Sign In'}</span>
                <ArrowRight size={14} />
              </button>
            </form>

            {/* TOGGLE LOGIN / SIGNUP */}
            <div className="text-center pt-2 border-t border-stone-200">
              <button
                type="button"
                onClick={() => {
                  setIsSignUp(!isSignUp);
                  setError(null);
                  setSuccess(null);
                }}
                className="text-xs font-bold text-stone-600 hover:text-amber-900 transition-colors"
              >
                {isSignUp ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
              </button>
            </div>
          </div>
        )}

        {/* PASSWORD RESET MODAL */}
        {resetModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950/60 p-4 backdrop-blur-sm">
            <div className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl space-y-4 border border-stone-200">
              <h3 className="text-lg font-black text-stone-950">Reset Password</h3>
              <p className="text-xs text-stone-600">Enter your email address and we will send you a password reset link.</p>
              <form onSubmit={handlePasswordReset} className="space-y-3">
                <input
                  type="email"
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  className="w-full rounded-xl border border-stone-300 bg-[#FAF7F2] p-2.5 text-xs font-semibold text-stone-900 outline-none"
                />
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setResetModalOpen(false)}
                    className="flex-1 rounded-xl border border-stone-300 bg-stone-100 py-2 text-xs font-bold text-stone-700"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={resetLoading}
                    className="flex-1 rounded-xl bg-amber-900 py-2 text-xs font-bold text-white shadow"
                  >
                    {resetLoading ? 'Sending...' : 'Send Link'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

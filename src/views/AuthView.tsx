import React, { useState } from 'react';
import { EyeOff, Eye } from 'lucide-react';
import { ViewState } from '../types';

export function AuthView({ onViewChange }: { onViewChange: (v: ViewState) => void }) {
  const [activeTab, setActiveTab] = useState<'signin' | 'signup'>('signin');
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="w-full h-full relative font-sans flex flex-col bg-white overflow-hidden">
      {/* Background Image Header */}
      <div className="absolute top-0 left-0 right-0 h-[50%] z-0">
         <img 
            src="/src/assets/images/luxury_lifestyle_bg_1780414338595.png" 
            alt="Hero Background" 
            className="w-full h-full object-cover"
         />
         <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-white to-transparent" />
      </div>

      <div className="relative z-10 flex flex-col pt-12 h-full text-zinc-900 w-full mx-auto pointer-events-none">
         <div className="flex flex-col items-center px-5 shrink-0">
            <div className="w-10 h-10 rounded-full border-[1.5px] border-zinc-900 flex items-center justify-center mb-2 bg-white/20 backdrop-blur-md">
              <div className="w-5 h-5 flex items-center justify-center gap-[3px]">
                 <div className="w-px h-4 bg-zinc-900"></div>
                 <div className="w-px h-4 bg-zinc-900"></div>
              </div>
            </div>
            <h1 className="text-[22px] tracking-[0.3em] font-serif font-bold text-zinc-900 ml-1">OTULIA</h1>
            <p className="text-[7px] uppercase tracking-[0.2em] font-bold text-zinc-800 mt-1">All in one luxury marketplace</p>
         </div>

         <div className="flex-1 min-h-[20px] shrink-0" />

         {/* Floating Card Modal */}
         <div className="bg-white/95 backdrop-blur-xl border border-white/80 rounded-[36px] p-6 shadow-2xl shrink-0 relative flex flex-col max-h-[85%] pointer-events-auto mx-4 mb-2">
            {/* Tabs */}
            <div className="flex w-full mb-4 relative shrink-0">
              <button 
                className={`flex-1 pb-2 text-[13px] font-bold transition-colors z-10 ${activeTab === 'signin' ? 'text-zinc-900' : 'text-zinc-400'}`}
                onClick={() => setActiveTab('signin')}
              >
                Sign In
              </button>
              <button 
                className={`flex-1 pb-2 text-[13px] font-bold transition-colors z-10 ${activeTab === 'signup' ? 'text-zinc-900' : 'text-zinc-400'}`}
                onClick={() => setActiveTab('signup')}
              >
                Sign Up
              </button>
              <div className="absolute bottom-0 left-0 right-0 h-px bg-zinc-200" />
              <div 
                className={`absolute bottom-0 w-1/2 h-0.5 bg-zinc-900 transition-transform duration-300 ${activeTab === 'signup' ? 'translate-x-full' : ''}`}
              />
            </div>

            {/* Form */}
            <div className="flex flex-col gap-3 flex-1 pb-1">
              <div>
                <label className="text-[11px] font-bold text-zinc-800 mb-1.5 block">Email Address</label>
                <div className="border border-zinc-200 rounded-xl flex items-center px-3 py-2.5 w-full focus-within:border-zinc-900 focus-within:ring-1 focus-within:ring-zinc-900 transition-shadow">
                  <MailIcon className="w-4 h-4 text-zinc-400 mr-2 flex-shrink-0" />
                  <input type="email" placeholder="Enter your email" className="flex-1 outline-none text-[12px] bg-transparent text-zinc-900 placeholder:text-zinc-400 min-w-0 font-bold" />
                </div>
              </div>
              
              <div>
                <label className="text-[11px] font-bold text-zinc-800 mb-1.5 block">Password</label>
                <div className="border border-zinc-200 rounded-xl flex items-center px-3 py-2.5 w-full focus-within:border-zinc-900 focus-within:ring-1 focus-within:ring-zinc-900 transition-shadow">
                  <LockIcon className="w-4 h-4 text-zinc-400 mr-2 flex-shrink-0" />
                  <input type={showPassword ? 'text' : 'password'} placeholder="Enter your password" className="flex-1 outline-none text-[12px] bg-transparent text-zinc-900 placeholder:text-zinc-400 min-w-0 font-bold" />
                  <button onClick={() => setShowPassword(!showPassword)} className="text-zinc-400 ml-2">
                    {showPassword ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                  </button>
                </div>
                {activeTab === 'signin' && (
                  <div className="flex justify-end mt-2 shrink-0">
                     <button className="text-[10px] font-bold text-zinc-800 underline decoration-zinc-400 underline-offset-2">Forgot Password?</button>
                  </div>
                )}
              </div>

              <button 
                className="w-full bg-[#111113] text-white rounded-xl py-3 text-[13px] font-bold mt-1 shadow-md shadow-zinc-900/10 hover:bg-black transition-colors shrink-0"
                onClick={() => onViewChange('home')}
              >
                {activeTab === 'signin' ? 'Sign In' : 'Create Account'}
              </button>

              <div className="relative flex items-center justify-center my-2 shrink-0">
                 <div className="absolute w-full h-px bg-zinc-100" />
                 <span className="bg-white px-3 text-[10px] text-zinc-400 relative z-10 font-bold">or continue with</span>
              </div>

              <div className="flex justify-center gap-4 shrink-0">
                 <button className="w-12 h-12 rounded-full border border-zinc-200 flex items-center justify-center bg-white hover:bg-zinc-50 transition-colors shadow-sm" aria-label="Google">
                    <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-5 h-5" alt="G"/>
                 </button>
                 <button className="w-12 h-12 rounded-full border border-zinc-200 flex items-center justify-center bg-white hover:bg-zinc-50 transition-colors shadow-sm" aria-label="Apple">
                    <svg viewBox="0 0 24 24" width="18" height="18" xmlns="http://www.w3.org/2000/svg"><path d="M16.636 12.115c-.015-2.616 2.138-3.864 2.238-3.92-1.218-1.782-3.116-2.022-3.8-2.05-1.616-.16-3.16 1.056-3.984 1.056-.822 0-2.11-1.036-3.447-1.008-1.73.028-3.328.995-4.225 2.535-1.815 3.125-.465 7.746 1.306 10.284.868 1.248 1.888 2.65 3.208 2.602 1.272-.05 1.76-.818 3.303-.818 1.528 0 1.988.818 3.315.79 1.353-.028 2.21-1.282 3.072-2.52 1.004-1.454 1.417-2.864 1.436-2.937-.03-.016-2.756-1.045-2.774-4.08M14.996 4.316c.69-.824 1.156-1.972 1.026-3.116-1.01.04-2.228.665-2.94 1.488-.636.725-1.196 1.905-1.042 3.03 1.134.088 2.264-.576 2.956-1.402" fill="#000"/></svg>
                 </button>
                 <button className="w-12 h-12 rounded-full border border-zinc-200 flex items-center justify-center bg-white hover:bg-zinc-50 transition-colors shadow-sm" aria-label="Facebook">
                    <svg viewBox="0 0 24 24" width="20" height="20" xmlns="http://www.w3.org/2000/svg" fill="#1877F2"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                 </button>
              </div>
              
              <p className="text-[9px] text-center text-zinc-500 mt-2 px-2 leading-tight flex-shrink-0 font-bold">
                 By continuing, you agree to our <span className="font-bold px-0.5 text-zinc-700 underline underline-offset-2">Terms of Use</span> and <span className="font-bold px-0.5 text-zinc-700 underline underline-offset-2">Privacy Policy</span>.
              </p>
            </div>
          </div>
         
         {/* Footer text */}
         <div className="pt-2 text-center w-full z-20 pb-safe pb-4 shrink-0 pointer-events-auto mt-auto">
            <h3 className="font-serif tracking-wide text-zinc-900 text-[13px] font-bold mb-2">Explore. Invest. Live Luxury.</h3>
            <div className="flex justify-center items-center gap-3">
               <div className="w-12 h-px bg-zinc-300" />
               <div className="w-5 h-5 rounded-full border border-zinc-300 flex items-center justify-center bg-white/50 backdrop-blur-sm">
                  <div className="flex gap-[2px]">
                    <div className="w-[1.5px] h-[7px] bg-zinc-500 rounded-full"></div>
                    <div className="w-[1.5px] h-[7px] bg-zinc-500 rounded-full"></div>
                  </div>
               </div>
               <div className="w-12 h-px bg-zinc-300" />
            </div>
         </div>
      </div>
    </div>
  );
}

function MailIcon(props: any) {
  return <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
}

function LockIcon(props: any) {
  return <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
}

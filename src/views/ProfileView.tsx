import React from 'react';
import { Settings, Edit2, Heart, Bell, Eye, Calendar, FileText, Search, Shield, User as UserIcon, HelpCircle, LogOut, ChevronRight, CheckCircle2 } from 'lucide-react';
import { currentUser } from '../data';
import { useTheme } from '../theme';

export function ProfileView() {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="pb-24 w-full h-full overflow-y-auto bg-white dark:bg-dark-bg">
      <header className="px-4 py-8 pt-12 flex justify-between items-start relative">
        <div className="absolute inset-0 h-48 bg-black/5 dark:bg-black/20 z-0">
          <img src="https://images.unsplash.com/photo-1613490900233-ea41ddbc05d0?auto=format&fit=crop&q=80&w=1200" className="w-full h-full object-cover opacity-30" alt="cover"/>
          <div className="absolute inset-0 bg-gradient-to-t from-white dark:from-[#0a0a0c] to-transparent" />
        </div>
        
        <div className="z-10 w-full">
          <div className="flex justify-center mb-6">
            <div className="flex flex-col items-center">
              <div className="w-8 h-8 rounded-full border-2 border-gold flex items-center justify-center mb-1">
                <div className="w-4 h-4 border border-gold" />
              </div>
              <h1 className="text-x tracking-widest font-serif font-semibold text-zinc-900 dark:text-zinc-50">OTULIA</h1>
            </div>
          </div>

          <div className="flex justify-between items-start">
            <div className="flex items-end gap-4">
              <div className="relative">
                <div className="w-20 h-20 rounded-full border-2 border-gold overflow-hidden bg-zinc-200">
                  <img src={currentUser.avatar} alt="Avatar" className="w-full h-full object-cover" />
                </div>
                <button className="absolute bottom-0 right-0 w-6 h-6 bg-gold rounded-full flex items-center justify-center text-white border-2 border-white dark:border-dark-bg">
                  <Edit2 className="w-3 h-3" />
                </button>
              </div>
              <div className="mb-1">
                <h2 className="text-xl font-serif text-zinc-900 dark:text-white flex items-center gap-1">
                  {currentUser.name}
                </h2>
                <p className="text-sm text-zinc-500">{currentUser.email}</p>
                <p className="text-xs text-zinc-500 mt-0.5">{currentUser.phone}</p>
                {currentUser.isVerified && (
                  <p className="text-xs text-gold flex items-center gap-1 mt-1"><CheckCircle2 className="w-3 h-3"/> Verified</p>
                )}
              </div>
            </div>
            <button className="text-zinc-500"><Settings className="w-6 h-6" /></button>
          </div>
        </div>
      </header>

      {/* Stats */}
      <div className="px-4 mt-8 flex justify-between">
        {[
          { icon: Heart, count: '28', label: 'Saved Properties' },
          { icon: Bell, count: '14', label: 'Alerts' },
          { icon: Eye, count: '36', label: 'Viewed' },
          { icon: Calendar, count: '8', label: 'Viewings' },
          { icon: FileText, count: '3', label: 'Offers Made' }
        ].map((stat, i) => (
          <div key={i} className="flex flex-col items-center">
            <stat.icon className="w-5 h-5 text-gold mb-2" />
            <span className="font-semibold text-lg dark:text-white">{stat.count}</span>
            <span className="text-[9px] text-zinc-500 text-center w-12 leading-tight">{stat.label}</span>
          </div>
        ))}
      </div>

      {/* Preferences Preview */}
      <div className="mx-4 mt-8 bg-zinc-50 dark:bg-dark-surface rounded-xl p-4 border border-zinc-200 dark:border-dark-border">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-serif text-lg dark:text-white">My Preferences</h3>
          <button className="text-gold text-xs font-medium flex items-center">View & Edit <ChevronRight className="w-3 h-3 ml-1"/></button>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
             <p className="text-xs text-zinc-400 mb-1 flex items-center gap-1"><Search className="w-3 h-3 text-gold"/> Locations</p>
             <p className="text-sm font-medium dark:text-zinc-200">Marbella, Spain</p>
          </div>
          <div>
             <p className="text-xs text-zinc-400 mb-1 flex items-center gap-1"><HomeIcon className="w-3 h-3 text-gold"/> Property Types</p>
             <p className="text-sm font-medium dark:text-zinc-200">Villa, Apartment, Penthouse</p>
          </div>
          <div>
             <p className="text-xs text-zinc-400 mb-1 flex items-center gap-1"><DollarSign className="w-3 h-3 text-gold"/> Price Range</p>
             <p className="text-sm font-medium dark:text-zinc-200">€1M - €5M</p>
          </div>
          <div>
             <p className="text-xs text-zinc-400 mb-1 flex items-center gap-1"><Bed className="w-3 h-3 text-gold"/> Bedrooms</p>
             <p className="text-sm font-medium dark:text-zinc-200">3 - 6 Bedrooms</p>
          </div>
        </div>
      </div>

      {/* Menu List */}
      <div className="mt-8">
        {[
          { icon: MessageCircle, title: 'My Inquiries', desc: 'Track your inquiries and conversations' },
          { icon: Calendar, title: 'My Viewings', desc: 'Upcoming and past property viewings' },
          { icon: FileText, title: 'Offers & Proposals', desc: 'Manage your offers and proposals' },
          { icon: Search, title: 'Saved Searches', desc: 'View and manage your saved searches' },
          { icon: Bell, title: 'Notifications', desc: 'Manage your notification preferences' }
        ].map((item, i) => (
          <div key={i} className="flex items-center justify-between p-4 border-b border-zinc-100 dark:border-dark-border cursor-pointer">
            <div className="flex items-center gap-4">
               <item.icon className="w-5 h-5 text-gold" />
               <div>
                 <h4 className="text-sm font-medium text-zinc-900 dark:text-zinc-100">{item.title}</h4>
                 <p className="text-xs text-zinc-500">{item.desc}</p>
               </div>
            </div>
            <ChevronRight className="w-4 h-4 text-zinc-400" />
          </div>
        ))}

        <div className="h-4" />

        {[
          { icon: Shield, title: 'Privacy & Security', desc: 'Manage your privacy and account security' },
          { icon: UserIcon, title: 'Account Settings', desc: 'Personal information and account preferences' },
          { icon: HelpCircle, title: 'Help & Support', desc: 'Get help and contact support' },
        ].map((item, i) => (
          <div key={`settings-${i}`} className="flex items-center justify-between p-4 border-b border-zinc-100 dark:border-dark-border cursor-pointer">
            <div className="flex items-center gap-4">
               <item.icon className="w-5 h-5 text-zinc-500" />
               <div>
                 <h4 className="text-sm font-medium text-zinc-900 dark:text-zinc-100">{item.title}</h4>
                 <p className="text-xs text-zinc-500">{item.desc}</p>
               </div>
            </div>
            <ChevronRight className="w-4 h-4 text-zinc-400" />
          </div>
        ))}
        
        {/* Theme Toggle inside Preferences for demonstration */}
        <div className="flex items-center justify-between p-4 border-b border-zinc-100 dark:border-dark-border cursor-pointer" onClick={toggleTheme}>
            <div className="flex items-center gap-4">
               <div className="w-5 h-5 rounded-full border border-gold flex items-center justify-center p-0.5" >
                  <div className={`w-full h-full rounded-full ${theme === 'dark' ? 'bg-zinc-800' : 'bg-white'}`} />
               </div>
               <div>
                 <h4 className="text-sm font-medium text-zinc-900 dark:text-zinc-100">Color Theme</h4>
                 <p className="text-xs text-zinc-500">Tap to toggle {theme === 'dark' ? 'Light' : 'Dark'} mode</p>
               </div>
            </div>
            <div className="flex gap-2">
               <div className={`w-4 h-4 rounded-full border ${theme === 'dark' ? 'bg-zinc-800 border-zinc-600' : 'bg-transparent border-zinc-300'}`}></div>
               <div className={`w-4 h-4 rounded-full border border-gold bg-gold`}></div>
            </div>
          </div>

        <div className="p-4 flex justify-center mt-4">
           <button className="text-red-500 flex items-center gap-2 text-sm font-medium py-2">
             <LogOut className="w-4 h-4" /> Log Out
           </button>
        </div>
      </div>
    </div>
  );
}

// Few missing icons implemented locally for layout simplicity
function HomeIcon(props: any) {
  return <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
}

function DollarSign(props: any) {
  return <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" x2="12" y1="2" y2="22"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
}

function Bed(props: any) {
  return <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 4v16"/><path d="M2 8h18a2 2 0 0 1 2 2v10"/><path d="M2 17h20"/><path d="M6 8v9"/></svg>
}

function MessageCircle(props: any) {
  return <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/></svg>
}

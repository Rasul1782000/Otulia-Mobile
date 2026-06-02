import React, { useState } from 'react';
import { Edit, Image as ImageIcon } from 'lucide-react';
import { messages, senders, listings } from '../data';
import { cn } from '../lib/utils';
import { ViewState } from '../types';

export function InboxView() {
  const [activeTab, setActiveTab] = useState('All Messages');
  const tabs = ['All Messages', 'Unread', 'Starred', 'Archive'];

  return (
    <div className="pb-24 w-full h-full overflow-y-auto bg-white dark:bg-dark-bg">
      <header className="px-4 py-8 pt-16 flex justify-between items-center">
        <div className="flex flex-col">
          <div className="w-8 h-8 rounded-full border-2 border-gold flex items-center justify-center mb-4 mx-auto">
            <div className="w-4 h-4 border border-gold" />
          </div>
          <h1 className="text-3xl font-serif text-zinc-900 dark:text-white">Inbox</h1>
        </div>
        <button className="text-gold mt-6"><Edit className="w-6 h-6" /></button>
      </header>

      {/* Tabs */}
      <div className="px-4 border-b border-zinc-200 dark:border-dark-border flex overflow-x-auto no-scrollbar gap-6">
        {tabs.map(tab => (
          <button 
            key={tab} 
            onClick={() => setActiveTab(tab)}
            className={cn(
              "pb-3 text-sm font-medium whitespace-nowrap transition-colors border-b-2 flex items-center gap-1",
              activeTab === tab ? "text-gold border-gold" : "text-zinc-500 border-transparent"
            )}
          >
            {tab}
            {tab === 'Unread' && <span className="w-2 h-2 rounded-full bg-gold ml-1"></span>}
          </button>
        ))}
      </div>

      {/* Message List */}
      <div className="divide-y divide-zinc-100 dark:divide-dark-border">
        {messages.map(msg => {
          const sender = senders[msg.senderId];
          const listing = msg.listingId ? listings.find(l => l.id === msg.listingId) : null;
          
          return (
            <div key={msg.id} className="p-4 flex gap-4 hover:bg-zinc-50 dark:hover:bg-dark-surface cursor-pointer transition-colors relative">
              {msg.unread && <div className="absolute left-2 top-10 w-2 h-2 rounded-full bg-gold" />}
              
              <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0 bg-zinc-200 dark:bg-zinc-800">
                {sender?.avatar ? (
                  <img src={sender.avatar} alt={sender.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-lg font-serif">
                    {sender?.name?.[0] || 'U'}
                  </div>
                )}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start mb-1">
                  <div className="flex items-center gap-2">
                    <h4 className={cn("text-sm truncate", msg.unread ? "font-bold text-zinc-900 dark:text-white" : "font-medium text-zinc-700 dark:text-zinc-300")}>
                      {sender?.name}
                    </h4>
                    {msg.tag && (
                      <span className="text-[9px] px-1.5 py-0.5 rounded bg-gold/10 text-gold border border-gold/20 whitespace-nowrap">
                        {msg.tag}
                      </span>
                    )}
                  </div>
                  <span className="text-xs text-zinc-400 whitespace-nowrap flex-shrink-0 ml-2">
                    {msg.timestamp}
                  </span>
                </div>
                
                <h5 className="text-xs font-semibold text-zinc-800 dark:text-zinc-200 mb-1 truncate">
                  {listing ? `Inquiry about ${listing.title}` : 'General Inquiry'}
                </h5>
                
                <p className="text-xs text-zinc-500 line-clamp-2 pr-12">
                  {msg.snippet}
                </p>
              </div>

              {listing && (
                <div className="w-16 h-12 rounded overflow-hidden flex-shrink-0 relative mt-6">
                  <img src={listing.images[0]} className="w-full h-full object-cover opacity-80" alt="property" />
                  {msg.unread && (
                    <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-gold rounded-full flex items-center justify-center text-[10px] font-bold text-white border-2 border-white dark:border-dark-bg">
                      2
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

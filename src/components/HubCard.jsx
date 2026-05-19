import React, { useState } from 'react';
import { translations } from '../utils/languages';
import { trackEvent } from '../utils/analytics'; // 🔥 HIGH-SPEED SILENT METRICS SYSTEM LOGGING

export default function HubCard({ hub, lang = 'en', selectedLocation = 'All' }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const t = translations[lang];

  // Helper formatting to ensure local Kenyan numbers format to WhatsApp link standards
  const formatWhatsAppLink = (phone) => {
    let cleaned = phone.replace(/\D/g, ''); // strip non-digits
    if (cleaned.startsWith('0')) {
      cleaned = '254' + cleaned.substring(1);
    }
    return `https://wa.me/${cleaned}?text=Hello,%20I%20found%20your%20listing%20on%20Mombasa%20Tech%20Hub!`;
  };

  // 🔥 INTERACTION INTERCEPTOR: LOGS SELECTION LOG TO SUPABASE ON TAP
  const handleTrackingAction = (actionType) => {
    trackEvent(hub.id, actionType, selectedLocation);
  };

  // Maps raw database category text arrays dynamically into Pwani translations
  const getLocalizedCategory = (cat) => {
    if (cat === "Web Agency") return t.categories.web;
    if (cat === "Video Editor") return t.categories.video;
    if (cat === "ICT Training") return t.categories.ict;
    if (cat === "Graphics Design") return t.categories.graphics;
    if (cat === "Community & Incubation") return t.categories.incubation;
    if (cat === "Hardware & Repair") return t.categories.repair;
    return cat;
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 hover:border-teal-500/40 transition-all duration-300 flex flex-col justify-between relative group backdrop-blur-sm w-full">
      <div>
        {/* Category Label */}
        <div className="flex justify-between items-center gap-2 mb-4">
          <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-teal-400 bg-teal-950/40 px-2.5 py-1 rounded-md border border-teal-900/30">
            {getLocalizedCategory(hub.category)}
          </span>
        </div>
        
        {/* Hub Name */}
        <h3 className="text-xl font-bold mt-2 text-white group-hover:text-teal-300 transition-colors tracking-tight">
          {hub.name}
        </h3>
        
        {/* Description */}
        <p className="text-slate-400 text-sm mt-2 leading-relaxed font-normal">
          {hub.description}
        </p>
      </div>
      
      <div className="mt-6 relative">
        {/* Info Meta Row */}
        <div className="pt-4 border-t border-slate-800/60 text-xs font-mono text-slate-400 flex flex-col gap-2 mb-4">
          <div className="flex items-center gap-2">
            <span className="text-slate-600 font-bold">📍 LOC:</span> 
            <span className="text-slate-300">{hub.location}</span>
          </div>
        </div>

        {/* Action Toggle Button */}
        <button 
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="w-full bg-teal-500 text-slate-950 hover:opacity-90 font-mono text-xs font-bold py-2.5 rounded-xl transition-all duration-200 tracking-wider uppercase flex items-center justify-center gap-2 cursor-pointer"
        >
          {isMenuOpen ? 'Close Menu ✕' : t.connectBtn}
        </button>

        {/* Interactive Dropdown Contact Panel */}
        {isMenuOpen && (
          <div className="absolute bottom-14 left-0 right-0 bg-slate-950 border border-slate-800 p-2 rounded-xl shadow-2xl z-20 flex flex-col gap-1 animate-fadeIn">
            <p className="text-[10px] font-mono text-slate-500 px-3 py-1 uppercase tracking-wider border-b border-slate-900 mb-1">
              {lang === 'sw' ? 'Chagua Njia ya Mawasiliano' : 'Select Channel'}
            </p>

            {/* 1. WhatsApp Option */}
            <a 
              href={formatWhatsAppLink(hub.contact)}
              onClick={() => handleTrackingAction('whatsapp_click')} // 👈 LOGS WHATSAPP LEAD
              target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2 text-xs font-sans font-medium px-3 py-2 text-slate-300 hover:bg-teal-500/10 hover:text-teal-400 rounded-lg transition-colors"
            >
              {lang === 'sw' ? '💬 Ongea kwa WhatsApp' : '💬 WhatsApp Chat'}
            </a>

            {/* 2. Voice Call Option */}
            <a 
              href={`tel:${hub.contact}`}
              onClick={() => handleTrackingAction('call_click')} // 👈 LOGS CELLULAR VOICE DIAL LEAD
              className="flex items-center gap-2 text-xs font-sans font-medium px-3 py-2 text-slate-300 hover:bg-teal-500/10 hover:text-teal-400 rounded-lg transition-colors"
            >
              {lang === 'sw' ? '📞 Piga Simu Moja kwa Moja' : '📞 Voice Direct Call'}
            </a>

            {/* 3. Portfolio / Website Option */}
            {hub.website_url && (
              <a 
                href={hub.website_url}
                onClick={() => handleTrackingAction('portfolio_click')} // 👈 LOGS EXT PORTFOLIO LINK TRAFFIC
                target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2 text-xs font-sans font-medium px-3 py-2 text-slate-300 hover:bg-teal-500/10 hover:text-teal-400 rounded-lg transition-colors"
              >
                {lang === 'sw' ? '🌐 Kiungo cha Kazi zao (Portfolio)' : '🌐 Business Portfolio Link'}
              </a>
            )}

            {/* 4. Direct Email Option */}
            {hub.publisher_email && (
              <a 
                href={`mailto:${hub.publisher_email}?subject=Inquiry%20from%20Mombasa%20Tech%20Hub`}
                onClick={() => handleTrackingAction('email_click')} // 👈 LOGS NATIVE MAIL ROUTE LEAD
                className="flex items-center gap-2 text-xs font-sans font-medium px-3 py-2 text-slate-300 hover:bg-teal-500/10 hover:text-teal-400 rounded-lg transition-colors"
              >
                {lang === 'sw' ? '✉️ Tuma Barua Pepe' : '✉️ Send Email'}
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
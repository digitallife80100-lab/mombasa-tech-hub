import React from 'react';

export default function Navbar({ lang, setLang, theme, setTheme }) {
  return (
    <nav className="border-b border-slate-800/80 bg-slate-900/40 backdrop-blur-md sticky top-0 z-50 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        
        {/* LOGO AREA */}
        <div className="flex items-center gap-3">
          <div className="h-7 w-7 rounded-lg bg-gradient-to-tr from-teal-500 to-emerald-400 flex items-center justify-center shadow-[0_0_15px_rgba(20,184,166,0.2)]">
            <span className="text-slate-950 font-mono font-black text-sm">M</span>
          </div>
          <span className="font-mono font-black tracking-tighter text-sm uppercase text-white">
            Mombasa.<span className="text-teal-400">Tech_Hub</span>
          </span>
        </div>

        {/* ⚙️ CONTROLS HUB: LANGUAGE & THEME SWAPPERS */}
        <div className="flex items-center gap-3">
          
          {/* 🗣️ SWAHILI / ENGLISH TOGGLE SWITCH */}
          <div className="flex items-center bg-slate-950/80 rounded-xl p-1 border border-slate-800/80">
            <button
              onClick={() => setLang('en')}
              className={`px-2.5 py-1 text-[10px] font-mono font-bold uppercase rounded-lg transition-all cursor-pointer ${
                lang === 'en' 
                  ? 'bg-teal-500 text-slate-950 shadow-md' 
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              EN
            </button>
            <button
              onClick={() => setLang('sw')}
              className={`px-2.5 py-1 text-[10px] font-mono font-bold uppercase rounded-lg transition-all cursor-pointer ${
                lang === 'sw' 
                  ? 'bg-teal-500 text-slate-950 shadow-md' 
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              SW
            </button>
          </div>

          {/* 🎨 THREE-WAY THEME SELECTOR DROPDOWN */}
          <div className="relative">
            <select
              value={theme}
              onChange={(e) => setTheme(e.target.value)}
              className="bg-slate-950/80 text-slate-300 border border-slate-800/80 px-3 py-1.5 rounded-xl font-mono text-[10px] uppercase font-bold tracking-wider cursor-pointer outline-none hover:border-slate-700 transition-colors focus:border-teal-500"
            >
              <option value="dark">🌙 Dark Mode</option>
              <option value="light">☀️ Light Mode</option>
              <option value="coastal">🌊 Coastal Vibe</option>
            </select>
          </div>

        </div>

      </div>
    </nav>
  );
}
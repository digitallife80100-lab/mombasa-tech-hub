export default function Navbar() {
  return (
    <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 py-4 flex flex-col sm:flex-row justify-between items-center gap-4">
        {/* Logo/Brand */}
        <h1 className="text-2xl font-black tracking-wider text-teal-400">
          MOMBASA<span className="text-white font-light text-xl">.TECH_HUB</span>
        </h1>
        
        {/* Status Indicator */}
        <div className="flex items-center gap-2 bg-slate-800/80 px-4 py-1.5 rounded-full border border-slate-700/50">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-teal-500"></span>
          </span>
          <p className="text-xs font-mono text-slate-300 uppercase tracking-wide">
            Directory Live
          </p>
        </div>
      </div>
    </header>
  );
}
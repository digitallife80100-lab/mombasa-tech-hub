export default function HubCard({ hub }) {
  return (
    <div className="bg-slate-800/40 border border-slate-800 rounded-2xl p-6 hover:border-teal-500/40 transition-all duration-300 flex flex-col justify-between group backdrop-blur-sm">
      <div>
        {/* Category Label */}
        <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-teal-400 bg-teal-950/40 px-2.5 py-1 rounded-md border border-teal-900/30">
          {hub.category}
        </span>
        
        {/* Hub Name */}
        <h3 className="text-xl font-bold mt-4 text-white group-hover:text-teal-300 transition-colors tracking-tight">
          {hub.name}
        </h3>
        
        {/* Description */}
        <p className="text-slate-400 text-sm mt-2 leading-relaxed font-normal">
          {hub.description}
        </p>
      </div>
      
      {/* Meta Footer Details */}
      <div className="mt-6 pt-4 border-t border-slate-800/60 text-xs font-mono text-slate-400 flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <span className="text-slate-600 font-bold">📍 LOC:</span> 
          <span className="text-slate-300">{hub.location}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-slate-600 font-bold">📞 CON:</span> 
          <span className="text-slate-300">{hub.contact}</span>
        </div>
      </div>
    </div>
  );
}
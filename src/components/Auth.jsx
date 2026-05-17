import { useState } from 'react';
import { supabase } from '../supabaseClient';

export default function Auth({ onAuthSuccess, onCancel }) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    if (isSignUp) {
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) setMessage(`❌ ${error.message}`);
      else setMessage('🎉 Account created successfully! You can now sign in.');
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) setMessage(`❌ ${error.message}`);
      else if (onAuthSuccess) onAuthSuccess();
    }
    setLoading(false);
  };

  return (
    <div className="w-full bg-slate-900/40 border border-slate-900 rounded-3xl overflow-hidden min-h-[500px] grid grid-cols-1 md:grid-cols-2 shadow-2xl backdrop-blur-md">
      
      {/* LEFT SIDE: Cinematic Brand Pitch */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-950 to-teal-950/20 p-8 flex flex-col justify-between border-r border-slate-900 relative group">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(20,184,166,0.05),transparent_50%)]"></div>
        
        <div>
          <span className="text-[9px] font-mono font-bold tracking-widest text-teal-400 bg-teal-950/40 px-2.5 py-1 rounded-full border border-teal-900/40 uppercase">
            Mombasa Partner Network
          </span>
          <h2 className="text-2xl font-black text-white tracking-tight mt-6 leading-tight">
            Claim Your Space in the Coastal Directory.
          </h2>
          <p className="text-slate-400 text-xs mt-3 leading-relaxed max-w-sm">
            Create a verified partner identity to publish services, list physical tech spaces, manage contact portals, and attract local clients effortlessly.
          </p>
        </div>

        {/* Feature List */}
        <div className="space-y-3 my-8 md:my-0">
          <div className="flex items-center gap-3 text-xs text-slate-300 font-mono">
            <span className="text-teal-400">⚡</span> Direct WhatsApp/Call Routing
          </div>
          <div className="flex items-center gap-3 text-xs text-slate-300 font-mono">
            <span className="text-teal-400">🛡️</span> Verified Local Trust Badge
          </div>
          <div className="flex items-center gap-3 text-xs text-slate-300 font-mono">
            <span className="text-teal-400">📊</span> Live Visibility Analytics
          </div>
        </div>

        <button 
          onClick={onCancel}
          className="text-left text-xs font-mono text-slate-500 hover:text-slate-300 transition-colors flex items-center gap-2 cursor-pointer"
        >
          ← Return to Directory Grid
        </button>
      </div>

      {/* RIGHT SIDE: Interactive Secure Form */}
      <div className="p-8 flex flex-col justify-center bg-slate-900/60 relative">
        <div className="max-w-sm w-full mx-auto">
          <div className="mb-6">
            <h3 className="text-lg font-bold text-white tracking-tight">
              {isSignUp ? 'Create Gateway Access' : 'Partner Portal Sign In'}
            </h3>
            <p className="text-slate-400 text-xs mt-1 font-mono">
              {isSignUp ? 'Register your email' : 'Secure developer authentication'}
            </p>
          </div>

          <form onSubmit={handleAuth} className="flex flex-col gap-4 text-sm">
            <div>
              <label className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider block mb-1.5">Email Address</label>
              <input 
                type="email" placeholder="name@domain.com" required
                className="w-full bg-slate-950 border border-slate-800/80 rounded-xl px-4 py-3 text-slate-200 focus:outline-none focus:border-teal-500/40 transition-colors"
                value={email} onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div>
              <label className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider block mb-1.5">Secure Password</label>
              <input 
                type="password" placeholder="••••••••" required
                className="w-full bg-slate-950 border border-slate-800/80 rounded-xl px-4 py-3 text-slate-200 focus:outline-none focus:border-teal-500/40 transition-colors"
                value={password} onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button 
              type="submit" disabled={loading}
              className="w-full bg-teal-500 text-slate-950 font-bold py-3 rounded-xl hover:bg-teal-400 hover:shadow-[0_0_20px_rgba(20,184,166,0.2)] transition-all font-mono uppercase text-xs tracking-wider cursor-pointer disabled:opacity-50 mt-2"
            >
              {loading ? 'Verifying Gateway...' : isSignUp ? 'Create Free Account' : 'Authenticate Access'}
            </button>
          </form>

          {message && (
            <div className="mt-4 p-3 bg-slate-950/60 border border-slate-800/60 rounded-xl text-xs font-mono text-center text-teal-400 animate-fadeIn">
              {message}
            </div>
          )}

          <div className="mt-8 text-center border-t border-slate-800/60 pt-4">
            <button 
              onClick={() => { setIsSignUp(!isSignUp); setMessage(''); }}
              className="text-xs text-slate-400 hover:text-teal-400 transition-colors font-mono cursor-pointer"
            >
              {isSignUp ? 'Already have an active workspace? Sign In' : "New local service creator? Sign Up"}
            </button>
          </div>
        </div>
      </div>

    </div>
  );
}
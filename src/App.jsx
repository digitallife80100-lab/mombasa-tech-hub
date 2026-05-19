import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import SearchBar from './components/SearchBar';
import HubCard from './components/HubCard';
import DirectoryMap from './components/DirectoryMap';
import Auth from './components/Auth';
import AddHubForm from './components/AddHubForm';
import { supabase } from './supabaseClient'; // Ensure your client import is clean
import { translations } from './utils/languages';
import AnalyticsDashboard from './components/AnalyticsDashboard';

export default function App() {
  // ==================== STATE MANAGEMENT ====================
  const [session, setSession] = useState(null);
  const [showAuthPortal, setShowAuthPortal] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [hubs, setHubs] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // FILTERS STATE
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedLocation, setSelectedLocation] = useState('All');
  const [isDashboardOpen, setIsDashboardOpen] = useState(false); // 🔥 Active State Engine

  // 🔥 CUSTOM CONTROLS FOR MULTI-THEME & SWAHILI LOCALIZATION
  const [lang, setLang] = useState('en'); 
  const [theme, setTheme] = useState('dark'); 

  // Direct reference targeting the translations dictionary file
  const t = translations[lang];

  // ==================== EFFECTS & SYNCING ====================
  
  // Dynamic Theme Attributor Hook
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Auth Session Tracking
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Fetch Live Data Rows from Supabase Table Ledger
  const fetchHubs = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('hubs')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setHubs(data || []);
    } catch (err) {
      console.error("Error pulling live catalog:", err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHubs();
  }, []);

  // Secure User Logout Handler
  const handleLogout = async () => {
    await supabase.auth.signOut();
    setSession(null);
  };

  // ==================== SEARCH & FILTER LOGIC ====================
  const filteredHubs = hubs.filter((hub) => {
    const matchesSearch = 
      hub.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      hub.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      hub.category?.toLowerCase().includes(searchTerm.toLowerCase());
      
    const matchesCategory = selectedCategory === 'All' || hub.category === selectedCategory;
    const matchesLocation = selectedLocation === 'All' || hub.location === selectedLocation;

    return matchesSearch && matchesCategory && matchesLocation;
  });

  // ==================== APPLICATION DISPLAY RENDER ====================
  return (
    <div className="min-h-screen text-slate-100 antialiased relative selection:bg-teal-500 selection:text-slate-950 transition-colors duration-300">
      
      {/* ⚙️ Premium Global Top Header Navigation controls */}
      <Navbar lang={lang} setLang={setLang} theme={theme} setTheme={setTheme} />
      
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* GLOBAL TWO-COLUMN GRID PROFILE LAYOUT */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
          
          {/* ================= LEFT SIDE CATALOG CANVAS (3 COLS) ================= */}
          <div className="lg:col-span-3 order-2 lg:order-1">
            
            {showAuthPortal ? (
              <div className="animate-fadeIn">
                <Auth 
                  onAuthSuccess={() => setShowAuthPortal(false)} 
                  onCancel={() => setShowAuthPortal(false)} 
                />
              </div>
            ) : (
              <>
                {/* Main Filter Action Bar Container */}
                <SearchBar 
                  searchTerm={searchTerm} 
                  setSearchTerm={setSearchTerm} 
                  selectedCategory={selectedCategory}
                  setSelectedCategory={setSelectedCategory}
                  selectedLocation={selectedLocation}
                  setSelectedLocation={setSelectedLocation}
                  lang={lang}
                />
                
                {/* Dynamic Heading Title Counters */}
                <div className="mb-6 mt-4">
                  <h2 className="text-xs font-mono font-bold uppercase tracking-widest text-slate-500 mb-1">
                    {t.liveDirectory} ({filteredHubs.length})
                  </h2>
                  <div className="h-[1px] w-12 bg-teal-500/50"></div>
                </div>

                {loading ? (
                  <div className="text-sm font-mono text-slate-500 animate-pulse py-8">
                    {t.fetching}
                  </div>
                ) : (
                  /* Spacious 2-Column Responsive Card Distribution Mesh */
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {filteredHubs.length > 0 ? (
                      filteredHubs.map((hub) => (
                        <HubCard 
                          key={hub.id} 
                          hub={hub} 
                          lang={lang} 
                          selectedLocation={selectedLocation} // 🔥 TRACKS CURRENT AREA FOR TELEMETRY
                        />
                      ))
                    ) : (
                      <div className="col-span-full text-center py-16 text-slate-600 font-mono border border-dashed border-slate-900 rounded-2xl bg-slate-900/10">
                        {t.noHubs}
                      </div>
                    )}
                  </div>
                )}
              </>
            )}
          </div>

          {/* ================= RIGHT SIDEBAR (1 COL) ================= */}
          <div className="lg:col-span-1 order-1 lg:order-2 lg:sticky lg:top-24 flex flex-col gap-6">
            
            {/* CARD A: MARKETING & PARTNER PORTAL CONTROLLER */}
            <div className="bg-gradient-to-br from-slate-900 to-slate-900/40 border border-slate-800/80 p-6 rounded-2xl shadow-xl">
              <span className="text-[9px] font-mono font-bold tracking-widest text-teal-400 bg-teal-950/50 px-2 py-1 rounded border border-teal-900/30 uppercase">
                {session ? t.partnerActive : t.openMarket}
              </span>
              <h2 className="text-lg font-black mt-3 tracking-tight text-white leading-tight">
                {t.advertiseTitle}
              </h2>
              <p className="text-slate-400 text-xs mt-2 leading-relaxed font-sans">
                {t.advertiseDesc}
              </p>
              
              <button
                onClick={() => {
                  if (session) setIsModalOpen(true); 
                  else setShowAuthPortal(true); 
                }}
                className="mt-5 w-full bg-teal-500 text-slate-950 font-mono text-[11px] font-bold py-3 rounded-xl hover:bg-teal-400 hover:shadow-[0_0_15px_rgba(20,184,166,0.3)] transition-all duration-300 cursor-pointer uppercase tracking-wider"
              >
                {session ? t.addHub : t.partnerPortal}
              </button>

              {session && (
                <button
                  onClick={handleLogout}
                  className="mt-2 w-full text-center text-slate-500 hover:text-rose-400 font-mono text-[10px] transition-colors cursor-pointer block"
                >
                  {t.signOut}
                </button>
              )}

              {session && (
                <button
                  onClick={() => setIsDashboardOpen(true)}
                  className="mt-2 w-full text-center text-teal-400 hover:text-teal-300 font-mono text-[10px] uppercase tracking-wider transition-colors cursor-pointer block border border-teal-900/40 py-1.5 rounded-lg bg-teal-950/20"
                >
                  📊 {lang === 'sw' ? 'Angalia Metrics Zako' : 'View Live Insights'}
                </button>
              )}
            </div>

            {/* CARD B: INTERACTIVE SIDEBAR LEAFLET LOCAL RADAR MAP */}
            <div className="w-full">
              <DirectoryMap hubs={filteredHubs} selectedLocation={selectedLocation} />
            </div>

          </div>

        </div>
      </main>

      {/* FLOATING DATA SUBMISSION POPUP ENTRY FORM */}
      {isModalOpen && session && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-md bg-slate-950/60">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-lg p-6 rounded-2xl shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-slate-800/60 pb-3 mb-4">
              <h3 className="text-sm font-mono font-bold text-slate-400 uppercase tracking-wider">
                Create Directory Entry
              </h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-rose-400 font-mono text-sm transition-colors cursor-pointer"
              >
                ✕ Close
              </button>
            </div>
            <AddHubForm onHubAdded={() => {
              setIsModalOpen(false);
              fetchHubs(); 
            }} />
          </div>
        </div>
      )}

      {/* 🔥 NEW: FLOATING ANALYTICS INSIGHTS DASHBOARD MODAL */}
      {isDashboardOpen && session && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-md bg-slate-950/70">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-xl p-6 rounded-2xl shadow-2xl relative max-h-[90vh] overflow-y-auto animate-fadeIn">
            <AnalyticsDashboard 
              session={session} 
              lang={lang} 
              onClose={() => setIsDashboardOpen(false)} 
            />
          </div>
        </div>
      )}

    </div>
  );
}
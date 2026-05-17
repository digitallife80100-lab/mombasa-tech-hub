import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import SearchBar from './components/SearchBar';
import HubCard from './components/HubCard';
import AddHubForm from './components/AddHubForm';
import Auth from './components/Auth'; 
import DirectoryMap from './components/DirectoryMap'; // 🔥 1. IMPORT THE MAP HERE
import { supabase } from './supabaseClient'; 

function App() {
  const [hubsList, setHubsList] = useState([]); 
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedLocation, setSelectedLocation] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false); 
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState(null);
  const [showAuthPortal, setShowAuthPortal] = useState(false);

  const fetchHubs = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('hubs')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching dynamic directory:', error.message);
    } else {
      setHubsList(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) setShowAuthPortal(false); 
    });

    fetchHubs();
    return () => subscription.unsubscribe();
  }, []);

  const filteredHubs = hubsList.filter(hub => {
    const matchesSearch = (hub.name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
                          (hub.description?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
                          (hub.location?.toLowerCase() || '').includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || hub.category === selectedCategory;
    const matchesLocation = selectedLocation === 'All' || hub.location === selectedLocation;
    return matchesSearch && matchesCategory && matchesLocation;
  });

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setShowAuthPortal(false);
    setIsModalOpen(false);
    alert('Logged out successfully!');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 antialiased selection:bg-teal-500 selection:text-slate-950 relative">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* 1. GLOBAL LAYOUT GRID: Left Canvas (3 Columns) vs Right Sidebar (1 Column) */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
          
          {/* ================= LEFT SIDE CANVAS (3 COLS) ================= */}
          <div className="lg:col-span-3 order-2 lg:order-1">
            
            {showAuthPortal ? (
              <div className="animate-fadeIn">
                <Auth 
                  onAuthSuccess={() => setShowAuthPortal(false)} 
                  onCancel={() => setShowAuthPortal(false)} 
                />
              </div>
            ) : (
              /* Standard Full-Width Marketplace Catalog Interface */
              <>
                <SearchBar 
                  searchTerm={searchTerm} 
                  setSearchTerm={setSearchTerm} 
                  selectedCategory={selectedCategory}
                  setSelectedCategory={setSelectedCategory}
                  selectedLocation={selectedLocation}
                  setSelectedLocation={setSelectedLocation}
                />
                
                <div className="mb-6">
                  <h2 className="text-xs font-mono font-bold uppercase tracking-widest text-slate-500 mb-1">
                    Live Directory ({filteredHubs.length})
                  </h2>
                  <div className="h-[1px] w-12 bg-teal-500/50"></div>
                </div>

                {loading ? (
                  <div className="text-sm font-mono text-slate-500 animate-pulse py-8">
                    📡 Fetching live Mombasa market lines...
                  </div>
                ) : (
                  /* Main cards now grid out beautifully in a wide 2-column format */
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {filteredHubs.length > 0 ? (
                      filteredHubs.map((hub) => (
                        <HubCard key={hub.id} hub={hub} />
                      ))
                    ) : (
                      <div className="col-span-full text-center py-16 text-slate-600 font-mono border border-dashed border-slate-900 rounded-2xl bg-slate-900/10">
                        No active verified hubs listed in this region yet.
                      </div>
                    )}
                  </div>
                )}
              </>
            )}
          </div>

          {/* ================= RIGHT SIDEBAR (1 COL) ================= */}
          {/* Sticky wrapper handles the absolute spacing constraints neatly */}
          <div className="lg:col-span-1 order-1 lg:order-2 lg:sticky lg:top-24 flex flex-col gap-6">
            
            {/* CARD A: ADVERTISE SERVICES CONTROL PANEL */}
            <div className="bg-gradient-to-br from-slate-900 to-slate-900/40 border border-slate-800/80 p-6 rounded-2xl shadow-xl">
              <span className="text-[9px] font-mono font-bold tracking-widest text-teal-400 bg-teal-950/50 px-2 py-1 rounded border border-teal-900/30 uppercase">
                {session ? 'Partner Active' : 'Open Source Market'}
              </span>
              <h2 className="text-lg font-black mt-3 tracking-tight text-white leading-tight">
                Advertise Your Services
              </h2>
              <p className="text-slate-400 text-xs mt-2 leading-relaxed">
                Add your listings, link your social channels, phone contacts, or portfolios, and tap directly into the coastal client pipeline.
              </p>
              
              <button
                onClick={() => {
                  if (session) {
                    setIsModalOpen(true); 
                  } else {
                    setShowAuthPortal(true); 
                  }
                }}
                className="mt-5 w-full bg-teal-500 text-slate-950 font-mono text-[11px] font-bold py-3 rounded-xl hover:bg-teal-400 hover:shadow-[0_0_15px_rgba(20,184,166,0.3)] transition-all duration-300 cursor-pointer uppercase tracking-wider"
              >
                {session ? '🚀 Add Hub Listing' : '🔑 Partner Portal'}
              </button>

              {session && (
                <button
                  onClick={handleLogout}
                  className="mt-2 w-full text-center text-slate-500 hover:text-rose-400 font-mono text-[10px] transition-colors cursor-pointer block"
                >
                  Sign Out Account
                </button>
              )}
            </div>

            {/* CARD B: INTERACTIVE MAP (Perfectly stacked underneath the details card) */}
            <div className="w-full">
              <DirectoryMap hubs={filteredHubs} selectedLocation={selectedLocation} />
            </div>

          </div>

        </div>
      </main>

      {/* FLOATING DIRECTORY ENTRY MODAL */}
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
    </div>
  );
}


export default App;
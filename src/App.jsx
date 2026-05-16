import Navbar from './components/Navbar';
import HubCard from './components/HubCard';
import { hubsData } from './data/hubsData';

function App() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 antialiased selection:bg-teal-500 selection:text-slate-950">
      {/* Brand Header */}
      <Navbar />
      
      {/* Layout Main Container */}
      <main className="max-w-6xl mx-auto px-4 py-12">
        
        {/* Dynamic Section Header */}
        <div className="mb-8">
          <h2 className="text-xs font-mono font-bold uppercase tracking-widest text-slate-500 mb-1">
            Verified Listings
          </h2>
          <div className="h-[1px] w-12 bg-teal-500/50"></div>
        </div>

        {/* Responsive Grid System */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {hubsData.map((individualHub) => (
            <HubCard key={individualHub.id} hub={individualHub} />
          ))}
        </div>

      </main>
    </div>
  );
}

export default App;
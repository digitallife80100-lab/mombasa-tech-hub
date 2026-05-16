import { useState } from 'react';
import Navbar from './components/Navbar';
import SearchBar from './components/SearchBar';
import HubCard from './components/HubCard';
import AddHubForm from './components/AddHubForm'; // 1. Import the form
import { hubsData } from './data/hubsData';

function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const filteredHubs = hubsData.filter(hub => {
    const matchesSearch = hub.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          hub.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          hub.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || hub.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 antialiased selection:bg-teal-500 selection:text-slate-950">
      <Navbar />
      
      <main className="max-w-6xl mx-auto px-4 py-12">
        
        {/* 2. Display the Form at the top */}
        <AddHubForm onHubAdded={() => console.log("Refresh list placeholder")} />
        
        <div className="my-12 border-t border-slate-900"></div>

        <SearchBar 
          searchTerm={searchTerm} 
          setSearchTerm={setSearchTerm} 
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
        />
        
        <div className="mb-8">
          <h2 className="text-xs font-mono font-bold uppercase tracking-widest text-slate-500 mb-1">
            Results ({filteredHubs.length})
          </h2>
          <div className="h-[1px] w-12 bg-teal-500/50"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredHubs.length > 0 ? (
            filteredHubs.map((hub) => (
              <HubCard key={hub.id} hub={hub} />
            ))
          ) : (
            <div className="col-span-full text-center py-16 text-slate-600 font-mono border border-dashed border-slate-900 rounded-2xl bg-slate-900/10">
              No local hubs match your search query.
            </div>
          )}
        </div>

      </main>
    </div>
  );
}

export default App;
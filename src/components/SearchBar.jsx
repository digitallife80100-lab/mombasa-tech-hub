export default function SearchBar({ 
  searchTerm, setSearchTerm, 
  selectedCategory, setSelectedCategory,
  selectedLocation, setSelectedLocation // <-- Receive new location state props
}) {
  const categories = ['All', 'ICT Training', 'Web & Digital Agency', 'Community & Incubation', 'Hardware & Repair'];
  const locations = ['All Locations', 'Mvita (CBD)', 'Nyali', 'Kisauni', 'Likoni', 'Changamwe', 'Jomvu'];

  return (
    <div className="flex flex-col gap-4 mb-8 bg-slate-900/40 p-4 border border-slate-900 rounded-2xl backdrop-blur-md">
      
      {/* Search Input field */}
      <input
        type="text"
        placeholder="Search hubs by name or keywords..."
        className="w-full bg-slate-950 border border-slate-800/80 rounded-xl px-4 py-3 text-slate-200 text-sm focus:outline-none focus:border-teal-500/40 transition-colors"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      {/* DUAL DROPDOWN SELECTION FILTERS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        
        {/* Category Filter */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider">Filter Category</label>
          <select
            className="w-full bg-slate-950 border border-slate-800/80 rounded-xl px-3 py-2.5 text-slate-300 text-xs focus:outline-none focus:border-teal-500/40 cursor-pointer"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        {/* Location Filter */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider">Filter Area</label>
          <select
            className="w-full bg-slate-950 border border-slate-800/80 rounded-xl px-3 py-2.5 text-slate-300 text-xs focus:outline-none focus:border-teal-500/40 cursor-pointer"
            value={selectedLocation}
            onChange={(e) => setSelectedLocation(e.target.value)}
          >
            {locations.map((loc) => (
              <option key={loc} value={loc === 'All Locations' ? 'All' : loc}>
                {loc}
              </option>
            ))}
          </select>
        </div>

      </div>
    </div>
  );
}
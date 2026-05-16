export default function SearchBar({ searchTerm, setSearchTerm, selectedCategory, setSelectedCategory }) {
  return (
    <div className="flex flex-col md:flex-row gap-4 mb-12">
      {/* Search Input text field */}
      <input
        type="text"
        placeholder="Search hubs, services, institutes..."
        className="flex-1 bg-slate-900/60 border border-slate-800 rounded-xl px-4 py-3 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-teal-500/50 transition-colors font-sans text-sm backdrop-blur-sm"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      
      {/* Category Dropdown filter */}
      <select
        className="bg-slate-900/60 border border-slate-800 rounded-xl px-4 py-3 text-slate-300 focus:outline-none focus:border-teal-500/50 transition-colors text-sm cursor-pointer font-sans backdrop-blur-sm"
        value={selectedCategory}
        onChange={(e) => setSelectedCategory(e.target.value)}
      >
        <option value="All">All Categories</option>
        <option value="ICT Training">ICT Training</option>
        <option value="Web & Digital Agency">Web & Digital Agency</option>
        <option value="Community & Incubation">Community & Incubation</option>
      </select>
    </div>
  );
}
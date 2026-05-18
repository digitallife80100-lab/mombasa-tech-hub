import React from 'react';
import { translations } from '../utils/languages';

export default function SearchBar({ 
  searchTerm, setSearchTerm, 
  selectedCategory, setSelectedCategory, 
  selectedLocation, setSelectedLocation,
  lang = 'en'
}) {
  const t = translations[lang];

  return (
    <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl flex flex-col md:flex-row gap-4 items-center transition-colors duration-300 w-full">
      
      <div className="w-full md:flex-1 relative">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder={t.searchPlaceholder}
          className="w-full bg-slate-950 text-white font-sans text-xs border border-slate-800/80 rounded-xl px-4 py-3 outline-none focus:border-teal-500 transition-colors"
        />
      </div>

      <div className="w-full md:w-48 flex flex-col gap-1">
        <label className="text-[9px] font-mono font-bold uppercase text-slate-500 tracking-wider">
          {t.filterCategory}
        </label>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="w-full bg-slate-950 text-slate-300 border border-slate-800/80 rounded-xl px-3 py-2.5 font-mono text-[11px] cursor-pointer outline-none"
        >
          <option value="All">{t.all}</option>
          <option value="Web Agency">{t.categories.web}</option>
          <option value="Video Editor">{t.categories.video}</option>
          <option value="ICT Training">{t.categories.ict}</option>
          <option value="Graphics Design">{t.categories.graphics}</option>
          <option value="Community & Incubation">{t.categories.incubation}</option>
          <option value="Hardware & Repair">{t.categories.repair}</option>
        </select>
      </div>

      <div className="w-full md:w-48 flex flex-col gap-1">
        <label className="text-[9px] font-mono font-bold uppercase text-slate-500 tracking-wider">
          {t.filterArea}
        </label>
        <select
          value={selectedLocation}
          onChange={(e) => setSelectedLocation(e.target.value)}
          className="w-full bg-slate-950 text-slate-300 border border-slate-800/80 rounded-xl px-3 py-2.5 font-mono text-[11px] cursor-pointer outline-none"
        >
          <option value="All">{t.allLocations}</option>
          <option value="Mvita">Mvita</option>
          <option value="Nyali">Nyali</option>
          <option value="Changamwe">Changamwe</option>
          <option value="Kisauni">Kisauni</option>
          <option value="Likoni">Likoni</option>
          <option value="Jomvu">Jomvu</option>
        </select>
      </div>

    </div>
  );
}
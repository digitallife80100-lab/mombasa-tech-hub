import { useState } from 'react';
import { supabase } from '../supabaseClient';

export default function AddHubForm({ onHubAdded }) {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('ICT Training');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [contact, setContact] = useState('');
  const [websiteUrl, setWebsiteUrl] = useState(''); 
  // 1. New state field for email
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // 2. Pass the email column data down to Supabase insert
    const { data, error } = await supabase
      .from('hubs')
      .insert([{ 
        name, 
        category, 
        location, 
        description, 
        contact,
        website_url: websiteUrl,
        publisher_email: email
      }]);

    setLoading(false);
    if (error) {
      alert('Error publishing hub: ' + error.message);
    } else {
      alert('🎉 Hub published successfully to the Mombasa Directory!');
      setName('');
      setLocation('');
      setDescription('');
      setContact('');
      setWebsiteUrl(''); 
      setEmail(''); // Clear input
      if (onHubAdded) onHubAdded(); 
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-slate-900/80 border border-slate-800 p-6 rounded-2xl mb-12 backdrop-blur-sm max-w-xl mx-auto">
      <h3 className="text-lg font-bold text-teal-400 mb-4 font-mono uppercase tracking-wide">Publish Your Tech Hub</h3>
      
      <div className="flex flex-col gap-4 text-sm">
        <input 
          type="text" placeholder="Business / Institute Name" required
          className="bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-slate-200 focus:outline-none focus:border-teal-500/50"
          value={name} onChange={(e) => setName(e.target.value)}
        />
        
        <select 
          className="bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-slate-300 focus:outline-none focus:border-teal-500/50 cursor-pointer"
          value={category} onChange={(e) => setCategory(e.target.value)}
        >
          <option value="ICT Training">ICT Training</option>
          <option value="Web & Digital Agency">Web & Digital Agency</option>
          <option value="Community & Incubation">Community & Incubation</option>
          <option value="Hardware & Repair">Hardware & Repair</option>
        </select>

        <input 
          type="text" placeholder="Location (e.g., Nyali, Bamburi, CBD)" required
          className="bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-slate-200 focus:outline-none focus:border-teal-500/50"
          value={location} onChange={(e) => setLocation(e.target.value)}
        />

        <textarea 
          placeholder="What services do you provide? (Description)" required rows="3"
          className="bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-slate-200 focus:outline-none focus:border-teal-500/50 resize-none"
          value={description} onChange={(e) => setDescription(e.target.value)}
        />

        <input 
          type="text" placeholder="Phone Number (e.g., 0712345678)" required
          className="bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-slate-200 focus:outline-none focus:border-teal-500/50"
          value={contact} onChange={(e) => setContact(e.target.value)}
        />

        {/* 3. New Email Input Field */}
        <input 
          type="email" placeholder="Business / Publisher Email Address" required
          className="bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-slate-200 focus:outline-none focus:border-teal-500/50"
          value={email} onChange={(e) => setEmail(e.target.value)}
        />

        <input 
          type="url" placeholder="Marketplace Link (Website, Portfolio, Facebook Page)" required
          className="bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-slate-200 focus:outline-none focus:border-teal-500/50"
          value={websiteUrl} onChange={(e) => setWebsiteUrl(e.target.value)}
        />

        <button 
          type="submit" disabled={loading}
          className="bg-teal-500 text-slate-950 font-bold py-3 rounded-xl hover:bg-teal-400 transition-colors cursor-pointer mt-2 disabled:opacity-50"
        >
          {loading ? 'Publishing Link...' : 'Publish to Directory'}
        </button>
      </div>
    </form>
  );
}
import { useState } from 'react';
import { supabase } from '../supabaseClient'; 

export default function AddHubForm({ onHubAdded }) {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('ICT Training');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [contact, setContact] = useState('');
  const [websiteUrl, setWebsiteUrl] = useState(''); 
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // 1. Fetch the currently authenticated user's ID from the session cache
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
      alert('Authentication session expired. Please log in again.');
      setLoading(false);
      return;
    }

    // 2. Insert rows, including the active user_id string
    const { error } = await supabase
      .from('hubs')
      .insert([{ 
        name, 
        category, 
        location, 
        description, 
        contact,
        website_url: websiteUrl,
        publisher_email: email,
        user_id: user.id // <-- Connects this listing to the account owner permanently!
      }]);

    setLoading(false);
    
    if (error) {
      alert('Database Error: ' + error.message);
    } else {
      alert('🎉 Success! Your listing has been submitted and sent to the moderation queue.');
      
      // Clear out fields completely
      setName('');
      setLocation('');
      setDescription('');
      setContact('');
      setWebsiteUrl(''); 
      setEmail(''); 
      
      if (onHubAdded) onHubAdded(); 
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-slate-900/80 p-2 text-sm flex flex-col gap-4">
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
        className="bg-teal-500 text-slate-950 font-bold py-3 rounded-xl hover:bg-teal-400 transition-colors cursor-pointer mt-2 disabled:opacity-50 font-mono tracking-wider text-xs uppercase"
      >
        {loading ? 'Submitting to Queue...' : 'Submit Hub for Verification'}
      </button>
    </form>
  );
}
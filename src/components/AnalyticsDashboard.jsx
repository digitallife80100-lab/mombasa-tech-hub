import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

export default function AnalyticsDashboard({ session, onClose, lang = 'en' }) {
  const [loading, setLoading] = useState(true);
  const [metrics, setMetrics] = useState({
    totalClicks: 0,
    whatsapp: 0,
    calls: 0,
    portfolios: 0,
    emails: 0,
    topLocation: 'None'
  });

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        // 1. Fetch the hub belonging to the logged-in partner user
        const { data: hubData, error: hubError } = await supabase
          .from('hubs')
          .select('id')
          .eq('publisher_email', session.user.email)
          .maybeSingle();

        if (hubError) throw hubError;
        
        if (!hubData) {
          setLoading(false);
          return;
        }

        // 2. Pull all tracking events logged for this hub
        const { data: clickData, error: clickError } = await supabase
          .from('analytics_clicks')
          .select('action_type, visitor_sub_county')
          .eq('hub_id', hubData.id);

        if (clickError) throw clickError;

        if (clickData && clickData.length > 0) {
          // 3. Aggregate tracking statistics via structural counter mapping
          const counts = { whatsapp: 0, calls: 0, portfolios: 0, emails: 0 };
          const locationMap = {};

          clickData.forEach(row => {
            if (row.action_type === 'whatsapp_click') counts.whatsapp++;
            if (row.action_type === 'call_click') counts.calls++;
            if (row.action_type === 'portfolio_click') counts.portfolios++;
            if (row.action_type === 'email_click') counts.emails++;

            if (row.visitor_sub_county && row.visitor_sub_county !== 'All') {
              locationMap[row.visitor_sub_county] = (locationMap[row.visitor_sub_county] || 0) + 1;
            }
          });

          // Compute top sub-county demographic point
          let topLoc = 'All Mombasa';
          let maxCount = 0;
          Object.entries(locationMap).forEach(([loc, val]) => {
            if (val > maxCount) {
              maxCount = val;
              topLoc = loc;
            }
          });

          setMetrics({
            totalClicks: clickData.length,
            whatsapp: counts.whatsapp,
            calls: counts.calls,
            portfolios: counts.portfolios,
            emails: counts.emails,
            topLocation: topLoc
          });
        }
      } catch (err) {
        console.error("Dashboard error compiling stats:", err.message);
      } finally {
        setLoading(false);
      }
    };

    if (session) fetchAnalytics();
  }, [session]);

  const isSwahili = lang === 'sw';

  return (
    <div className="text-white font-sans">
      <div className="flex justify-between items-center border-b border-slate-800/80 pb-4 mb-6">
        <div>
          <h3 className="text-base font-mono font-black text-teal-400 uppercase tracking-wider">
            {isSwahili ? '📈 DATABOIDI YA INSIGHTS PULSE' : '📈 INSIGHTS PULSE DASHBOARD'}
          </h3>
          <p className="text-[11px] text-slate-500 font-mono mt-0.5">
            {isSwahili ? 'Métricas za wakati halisi kutoka Mombasa' : 'Real-time campaign telemetry tracking'}
          </p>
        </div>
        <button 
          onClick={onClose}
          className="text-slate-500 hover:text-rose-400 font-mono text-xs transition-colors cursor-pointer bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800/60"
        >
          ✕ {isSwahili ? 'Funga' : 'Close'}
        </button>
      </div>

      {loading ? (
        <div className="text-center py-12 font-mono text-xs text-slate-500 animate-pulse">
          📡 {isSwahili ? 'Kupakia metrics zako za soko...' : 'Calculating conversion ledger ratios...'}
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          
          {/* TOP CORE HIGH-LIGHT METRIC PLATES */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800/60 flex flex-col justify-between">
              <span className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-widest">
                {isSwahili ? 'JUMLA YA MIUNGANISHO' : 'TOTAL CLIENT CONVERSIONS'}
              </span>
              <span className="text-3xl font-mono font-black text-white mt-2 block">
                {metrics.totalClicks} <span className="text-xs text-teal-500 font-sans font-normal">leads</span>
              </span>
            </div>

            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800/60 flex flex-col justify-between">
              <span className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-widest">
                {isSwahili ? 'ENEO KUU LA WATEJA' : 'TOP TARGET CUSTOMER REGION'}
              </span>
              <span className="text-xl font-mono font-black text-teal-400 mt-3 block uppercase tracking-tight">
                📍 {metrics.topLocation}
              </span>
            </div>
          </div>

          {/* CHANNELS PERFORMANCE BREAKDOWN TRACKS */}
          <div className="bg-slate-900/40 border border-slate-800/80 rounded-xl p-5">
            <h4 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider mb-4">
              {isSwahili ? 'Mchanganuo wa Njia za Mawasiliano' : 'Channel Pipeline Distribution'}
            </h4>
            
            <div className="flex flex-col gap-3.5">
              {/* WhatsApp bar row */}
              <div>
                <div className="flex justify-between text-xs font-mono mb-1">
                  <span className="text-slate-400">💬 WhatsApp Link-outs</span>
                  <span className="text-teal-400 font-bold">{metrics.whatsapp}</span>
                </div>
                <div className="h-2 w-full bg-slate-950 rounded-full overflow-hidden">
                  <div className="h-full bg-teal-500 rounded-full transition-all duration-500" style={{ width: `${metrics.totalClicks ? (metrics.whatsapp/metrics.totalClicks)*100 : 0}%` }}></div>
                </div>
              </div>

              {/* Voice Call bar row */}
              <div>
                <div className="flex justify-between text-xs font-mono mb-1">
                  <span className="text-slate-400">📞 Phone Voice Dials</span>
                  <span className="text-teal-400 font-bold">{metrics.calls}</span>
                </div>
                <div className="h-2 w-full bg-slate-950 rounded-full overflow-hidden">
                  <div className="h-full bg-cyan-500 rounded-full transition-all duration-500" style={{ width: `${metrics.totalClicks ? (metrics.calls/metrics.totalClicks)*100 : 0}%` }}></div>
                </div>
              </div>

              {/* Portfolio Click bar row */}
              <div>
                <div className="flex justify-between text-xs font-mono mb-1">
                  <span className="text-slate-400">🌐 Portfolio Conversions</span>
                  <span className="text-teal-400 font-bold">{metrics.portfolios}</span>
                </div>
                <div className="h-2 w-full bg-slate-950 rounded-full overflow-hidden">
                  <div className="h-full bg-indigo-500 rounded-full transition-all duration-500" style={{ width: `${metrics.totalClicks ? (metrics.portfolios/metrics.totalClicks)*100 : 0}%` }}></div>
                </div>
              </div>

              {/* Email outbound row */}
              <div>
                <div className="flex justify-between text-xs font-mono mb-1">
                  <span className="text-slate-400">✉️ Direct Email Inquiries</span>
                  <span className="text-teal-400 font-bold">{metrics.emails}</span>
                </div>
                <div className="h-2 w-full bg-slate-950 rounded-full overflow-hidden">
                  <div className="h-full bg-amber-500 rounded-full transition-all duration-500" style={{ width: `${metrics.totalClicks ? (metrics.emails/metrics.totalClicks)*100 : 0}%` }}></div>
                </div>
              </div>
            </div>

          </div>

        </div>
      )}
    </div>
  );
}
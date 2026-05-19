import { supabase } from '../supabaseClient';

/**
 * Silently logs a client interaction event straight to the analytics ledger
 * @param {string} hubId - The UUID target of the tech hub card
 * @param {string} actionType - The specific trigger ('connect_click', 'profile_view')
 * @param {string} currentFilterArea - The active sub-county selection on the screen
 */
export const trackEvent = async (hubId, actionType, currentFilterArea = 'All') => {
  try {
    const { error } = await supabase
      .from('analytics_clicks')
      .insert([
        { 
          hub_id: hubId, 
          action_type: actionType, 
          visitor_sub_county: currentFilterArea 
        }
      ]);
    
    if (error) throw error;
  } catch (err) {
    // Fail silently in background so client browsing navigation never hangs
    console.debug("Analytics silent skip:", err.message);
  }
};
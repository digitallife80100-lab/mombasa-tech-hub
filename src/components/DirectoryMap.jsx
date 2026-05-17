import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { subCountyCoords } from '../utils/geoData';

// 🌟 CREATING A CUSTOM NEON-TEAL PIN GLOW SVG
const customTealIcon = new L.DivIcon({
  className: 'custom-teal-marker',
  html: `
    <div class="relative flex items-center justify-center w-8 h-8">
      <span class="absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-20 animate-ping"></span>
      <span class="absolute inline-flex rounded-full h-4 w-4 bg-teal-500/40 border border-teal-300"></span>
      <span class="relative inline-flex rounded-full h-2.5 w-2.5 bg-teal-400 shadow-[0_0_10px_#14b8a6]"></span>
    </div>
  `,
  iconSize: [32, 32],
  iconAnchor: [16, 16], // Centers the pin exact over the coordinate location point
  popupAnchor: [0, -14]  // Spaces the popup card nicely right above the glowing point
});

function MapRecenter({ center }) {
  const map = useMap();
  map.setView(center, map.getZoom(), { animate: true });
  return null;
}

export default function DirectoryMap({ hubs, selectedLocation }) {
  const centerPos = subCountyCoords[selectedLocation] || subCountyCoords["Default"];
  const zoomLevel = selectedLocation === 'All' ? 12 : 14;

  return (
    <div className="w-full h-[320px] rounded-2xl overflow-hidden border border-slate-800/80 bg-slate-950 shadow-2xl relative">
      <MapContainer 
        center={centerPos} 
        zoom={zoomLevel} 
        className="w-full h-full z-10"
        zoomControl={false} // Clean up default controls for a minimal sidebar look
      >
        <TileLayer
          attribution='&copy; CARTO'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />
        
        <MapRecenter center={centerPos} />

        {hubs.map((hub) => {
          const coords = subCountyCoords[hub.location] || subCountyCoords["Default"];
          
          // Micro-jitter so overlapping sub-county records separate on zoom
          const jitterCoords = [
            coords[0] + (Math.random() - 0.5) * 0.003,
            coords[1] + (Math.random() - 0.5) * 0.003
          ];

          return (
            <Marker 
              key={hub.id} 
              position={jitterCoords} 
              icon={customTealIcon} // 🔥 ASSIGNING NEON PIN HERE
            >
              <Popup closeButton={false}>
                {/* UPGRADED TEXT CARDS INSIDE POPUPS */}
                <div className="p-1 font-mono flex flex-col gap-1 select-none">
                  <span className="text-[9px] uppercase font-bold tracking-wider text-teal-400">
                    {hub.category}
                  </span>
                  <h4 className="font-sans font-bold text-sm text-white m-0 tracking-tight">
                    {hub.name}
                  </h4>
                  <p className="text-slate-400 text-[11px] m-0 flex items-center gap-1 mt-1">
                    📍 <span className="text-slate-300 font-sans">{hub.location}</span>
                  </p>
                  
                  <div className="mt-2 pt-2 border-t border-slate-800/80 flex items-center justify-between gap-4">
                    <span className="text-[10px] text-slate-500 font-sans truncate max-w-[120px]">
                      {hub.contact}
                    </span>
                    <a 
                      href={`tel:${hub.contact}`}
                      className="text-[10px] bg-teal-500 text-slate-950 px-2 py-1 rounded-md font-bold uppercase no-underline hover:bg-teal-400 transition-colors"
                    >
                      Call
                    </a>
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}
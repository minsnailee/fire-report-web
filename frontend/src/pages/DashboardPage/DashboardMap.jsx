import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useState } from "react";
import { FiPlus, FiMinus } from "react-icons/fi";

delete L.Icon.Default.prototype._getIconUrl;

const customPingIcon = L.divIcon({
   className: "",
   html: `
    <span class="relative block">
      <span class="absolute right-0 top-0.5 z-10 h-3 w-3 rounded-full bg-red-400 flex">
        <span class="absolute inline-flex w-full h-full bg-red-500 rounded-full opacity-75 animate-ping"></span>
      </span>
    </span>
  `,
   iconSize: [20, 20],
   iconAnchor: [10, 10],
});

function MapController({ zoom }) {
   const map = useMap();
   map.setZoom(zoom);
   return null;
}

export default function DashboardMap() {
   const [zoom, setZoom] = useState(8);

   const handleZoomIn = () => setZoom((z) => Math.min(z + 1, 18));
   const handleZoomOut = () => setZoom((z) => Math.max(z - 1, 1));

   return (
      <div className="rounded-2xl border border-gray-200 bg-white">
         <div className="flex items-center justify-between px-6 py-4">
            <h3 className="text-base font-medium text-gray-800">관리 지역</h3>
            <div className="flex gap-1">
               <button
                  onClick={handleZoomIn}
                  className="rounded-md border border-gray-300 px-1 py-1 hover:bg-gray-100"
               >
                  <FiPlus className="w-4 h-4 text-gray-700" />
               </button>
               <button
                  onClick={handleZoomOut}
                  className="rounded-md border border-gray-300 px-1 py-1 hover:bg-gray-100"
               >
                  <FiMinus className="w-4 h-4 text-gray-700" />
               </button>
            </div>
         </div>

         <div className="p-4 border-t border-gray-100 sm:p-6">
            <MapContainer
               center={[35.1595, 126.8526]}
               zoom={zoom}
               className="w-full h-[500px] rounded-xl border"
            >
               <TileLayer
                  attribution='&copy; <a href="https://carto.com/">CARTO</a>'
                  url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
               />
               <Marker position={[35.1595, 126.8526]} icon={customPingIcon}>
                  <Popup>여기는 광주입니다!</Popup>
               </Marker>
               <MapController zoom={zoom} />
            </MapContainer>
         </div>
      </div>
   );
}

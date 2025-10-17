import React, { useEffect, useRef } from 'react';

// TypeScript declaration for the global Leaflet object
declare var L: any;

interface InteractiveMapProps {
  lat: number;
  lng: number;
  zoom: number;
}

const InteractiveMap: React.FC<InteractiveMapProps> = ({ lat, lng, zoom }) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any | null>(null); // Using `any` to avoid full Leaflet type definitions

  useEffect(() => {
    // Initialize map only if the container exists and map instance is not already created
    if (mapContainerRef.current && !mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current).setView([lat, lng], zoom);
      mapInstanceRef.current = map;

      // Add tile layer from OpenStreetMap
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(map);

      // Create a custom SVG icon for the marker
      const pitayaPinIconSVG = `
        <svg viewBox="0 0 28 40" xmlns="http://www.w3.org/2000/svg" width="35" height="50">
          <path d="M14 0 C6.268 0 0 6.268 0 14 C0 24.5 14 40 14 40 S28 24.5 28 14 C28 6.268 21.732 0 14 0 Z" fill="#e04377"/>
          <circle cx="14" cy="14" r="6" fill="#FCFBF8"/>
        </svg>`;

      const customIcon = L.divIcon({
          html: pitayaPinIconSVG,
          className: 'custom-leaflet-icon', // Custom class for styling (see index.html)
          iconSize: [35, 50],
          iconAnchor: [17.5, 50],       // Point of the icon which will correspond to marker's location
          popupAnchor: [0, -50]         // Point from which the popup should open relative to the iconAnchor
      });

      // Add marker to the map with the custom icon and a popup
      L.marker([lat, lng], { icon: customIcon })
        .addTo(map)
        .bindPopup('<b>Pitaya Nails</b><br>¡Te esperamos aquí!')
        .openPopup();
    }

    // Cleanup function to run when component unmounts
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [lat, lng, zoom]); // Re-run effect if location changes

  // The div that will contain the map
  return <div ref={mapContainerRef} style={{ height: '100%', width: '100%' }} aria-label="Mapa de ubicación del salón" />;
};

export default InteractiveMap;

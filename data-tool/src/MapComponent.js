import React, { useEffect } from 'react';
import L from 'leaflet';


function MapComponent({ markers, polylines}) {
    
  useEffect(() => {
    // Creating a map instance
    const map = L.map('map').setView([52.5128, 13.3892], 13); // Centered at 52.5128° N, 13.3892° E, with zoom level 13

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    // Set map container to take up the full viewport height
    const mapContainer = document.getElementById('map');
    mapContainer.style.height = `${window.innerHeight}px`;
    
    // Create a resize function 
    // (need to do this so can call it when removing later)
    function handleResize() {
        mapContainer.style.height = `${window.innerHeight}px`;
        map.invalidateSize(); // Update the map size
    }


    // Add markers/polylines when the map is ready
    // Else there is an error 
    map.whenReady(() => {
      markers.forEach(marker => {
        L.circleMarker(marker.position, {
          radius: 5,
          fillColor: "#ff7800",
          color: "#000",
          weight: 1,
          opacity: 1,
          fillOpacity: 0.8
        }).addTo(map);
      });

    });
    
    // Cleanup function, removing unwanted markers and polylines from screen
    return () => {
      window.removeEventListener('resize', handleResize);
      map.remove();
    };
  }, [markers, polylines]);

  return <div id="map" style={{ width: '100%', height: '100vh' }}></div>;
}

export default MapComponent;

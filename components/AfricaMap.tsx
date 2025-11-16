import React, { useEffect, useRef, useState } from 'react';
import type { Station } from '../types';

declare global {
  interface Window {
    google: any;
    gm_authFailure?: () => void;
  }
}

const loadGoogleMapsApi = (apiKey: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (window.google?.maps) {
      resolve();
      return;
    }
    const existingScript = document.getElementById('googleMapsScript');
    if (existingScript) {
        existingScript.addEventListener('load', () => resolve());
        existingScript.addEventListener('error', () => reject(new Error('Google Maps script failed to load.')));
        return;
    }

    const script = document.createElement('script');
    script.id = 'googleMapsScript';
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&v=beta&libraries=marker`;
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Google Maps script failed to load.'));
    document.head.appendChild(script);
  });
};

const mapStyles = [
    { elementType: "geometry", stylers: [{ color: "#242f3e" }] },
    { elementType: "labels.text.stroke", stylers: [{ color: "#242f3e" }] },
    { elementType: "labels.text.fill", stylers: [{ color: "#746855" }] },
    { featureType: "administrative.locality", elementType: "labels.text.fill", stylers: [{ color: "#d59563" }] },
    { featureType: "poi", elementType: "labels.text.fill", stylers: [{ color: "#d59563" }] },
    { featureType: "poi.park", elementType: "geometry", stylers: [{ color: "#263c3f" }] },
    { featureType: "poi.park", elementType: "labels.text.fill", stylers: [{ color: "#6b9a76" }] },
    { featureType: "road", elementType: "geometry", stylers: [{ color: "#38414e" }] },
    { featureType: "road", elementType: "geometry.stroke", stylers: [{ color: "#212a37" }] },
    { featureType: "road", elementType: "labels.text.fill", stylers: [{ color: "#9ca5b3" }] },
    { featureType: "road.highway", elementType: "geometry", stylers: [{ color: "#746855" }] },
    { featureType: "road.highway", elementType: "geometry.stroke", stylers: [{ color: "#1f2835" }] },
    { featureType: "road.highway", elementType: "labels.text.fill", stylers: [{ color: "#f3d19c" }] },
    { featureType: "transit", elementType: "geometry", stylers: [{ color: "#2f3948" }] },
    { featureType: "transit.station", elementType: "labels.text.fill", stylers: [{ color: "#d59563" }] },
    { featureType: "water", elementType: "geometry", stylers: [{ color: "#17263c" }] },
    { featureType: "water", elementType: "labels.text.fill", stylers: [{ color: "#515c6d" }] },
    { featureType: "water", elementType: "labels.text.stroke", stylers: [{ color: "#17263c" }] },
];

interface AfricaMapProps {
  center: { lat: number; lng: number };
  zoom: number;
  stations: Station[];
  currentStation: Station | null;
  onSelectStation: (station: Station) => void;
}

export const AfricaMap: React.FC<AfricaMapProps> = ({ center, zoom, stations, currentStation, onSelectStation }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  const infoWindowRef = useRef<any>(null);
  const [isApiLoaded, setIsApiLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const authFailureCallback = () => {
        setError("Google Maps API Authentication Failed. The provided MAPS_API_KEY might be invalid, restricted, or missing required APIs (Maps JavaScript API). See: https://developers.google.com/maps/documentation/javascript/error-messages#invalid-key-map-error");
    };

    // Use a dedicated API key for Google Maps for better security and management.
    const mapsApiKey = process.env.MAPS_API_KEY;

    if (mapsApiKey) {
        window.gm_authFailure = authFailureCallback;

        loadGoogleMapsApi(mapsApiKey)
        .then(() => setIsApiLoaded(true))
        .catch((err) => {
            console.error(err);
            setError("Failed to load Google Maps. Please check your network connection.");
        });
    } else {
        setError("Google Maps API key is not configured. Please provide it in the MAPS_API_KEY environment variable.");
    }

    // Cleanup on unmount
    return () => {
        if (window.gm_authFailure === authFailureCallback) {
            delete window.gm_authFailure;
        }
    }
  }, []);
  
  useEffect(() => {
    if (isApiLoaded && mapRef.current && !mapInstance.current) {
        const map = new window.google.maps.Map(mapRef.current, {
            center,
            zoom,
            styles: mapStyles,
            disableDefaultUI: true,
            zoomControl: true,
            // A Map ID is required for using Advanced Markers and cloud-based map styling.
            // Replace 'DEMO_MAP_ID' with your actual Map ID from Google Cloud Console.
            mapId: 'DEMO_MAP_ID',
        });
        mapInstance.current = map;
        infoWindowRef.current = new window.google.maps.InfoWindow();
    }
  }, [isApiLoaded, center, zoom]);

  useEffect(() => {
    if (mapInstance.current) {
      mapInstance.current.panTo(center);
      mapInstance.current.setZoom(zoom);
    }
  }, [center, zoom]);

  useEffect(() => {
    if (mapInstance.current && window.google.maps.marker) {
      markersRef.current.forEach(marker => marker.setMap(null));
      markersRef.current = [];

      stations.forEach(station => {
        if (!station.location) return;

        const isCurrent = station.streamUrl === currentStation?.streamUrl;
        
        const markerElement = document.createElement('div');
        markerElement.className = `station-marker ${isCurrent ? 'current' : ''}`;
        markerElement.innerHTML = `<div class="dot"></div>`;

        const marker = new window.google.maps.marker.AdvancedMarkerElement({
          position: station.location,
          map: mapInstance.current,
          title: station.name,
          content: markerElement,
        });
        
        marker.addListener('click', () => {
            const infoWindow = infoWindowRef.current;
            const buttonId = `tune-in-${station.streamUrl.replace(/[^a-zA-Z0-9]/g, '')}`;
            const content = `
                <div class="map-popup">
                    <img src="${station.coverArt}" alt="${station.name}" class="popup-art"/>
                    <div class="popup-info">
                        <h3 class="popup-title" title="${station.name}">${station.name}</h3>
                        <p class="popup-genre">${station.genre}</p>
                        <button id="${buttonId}" class="popup-button">Tune In</button>
                    </div>
                </div>
            `;
            infoWindow.setContent(content);
            infoWindow.open({
                anchor: marker,
                map: mapInstance.current,
            });

            infoWindow.addListener('domready', () => {
                const button = document.getElementById(buttonId);
                if (button) {
                    button.onclick = () => onSelectStation(station);
                }
            });
        });

        markersRef.current.push(marker);
      });
    }
  }, [stations, currentStation, onSelectStation, isApiLoaded]);

  if (error) {
    return <div className="w-full h-full flex items-center justify-center bg-gray-900 text-red-400 p-4 text-center">{error}</div>
  }

  return (
    <>
      <div ref={mapRef} id="map" className="w-full h-full" />
      <style>{`
        /* Custom Google Maps InfoWindow styles */
        .gm-style-iw-d {
            overflow: hidden !important;
        }
        .gm-style .gm-style-iw-c {
            padding: 0 !important;
            background-color: rgba(31, 41, 55, 0.9) !important;
            border-radius: 8px !important;
            border: 1px solid rgba(75, 85, 99, 0.5) !important;
            box-shadow: 0 4px 12px rgba(0,0,0,0.4) !important;
        }
        .gm-style .gm-style-iw-t::after {
            background: rgba(31, 41, 55, 0.9) !important;
        }
        button.gm-ui-hover-effect {
            background: rgba(55, 65, 81, 0.9) !important;
        }
        
        /* Our custom popup content styles */
        .map-popup {
          display: flex;
          gap: 12px;
          padding: 12px;
          font-family: 'Poppins', sans-serif;
          color: #e5e7eb;
        }
        .popup-art {
          width: 60px;
          height: 60px;
          border-radius: 6px;
          object-fit: cover;
          flex-shrink: 0;
        }
        .popup-info {
          min-width: 0;
        }
        .popup-title {
          font-size: 1rem;
          font-weight: bold;
          margin: 0 0 4px 0;
          color: #fff;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          max-width: 160px;
        }
        .popup-genre {
          font-size: 0.75rem;
          color: #d1d5db; /* text-gray-300 */
          margin: 0;
        }
        .popup-button {
          margin-top: 8px;
          width: 100%;
          padding: 6px 12px;
          font-size: 0.8rem;
          font-weight: bold;
          color: #000;
          background-color: var(--accent-color);
          border: none;
          border-radius: 4px;
          cursor: pointer;
          transition: opacity 0.2s;
        }
        .popup-button:hover {
          opacity: 0.8;
        }

        /* Custom marker styles */
        .station-marker {
          position: relative;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background-color: rgba(0, 0, 0, 0.6);
          border: 2px solid #fff;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: transform 0.2s ease;
          cursor: pointer;
        }
        .station-marker .dot {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background-color: var(--accent-color);
          transition: background-color 0.2s ease;
        }
        .station-marker:hover {
          transform: scale(1.2);
        }
        .station-marker.current {
          border-color: var(--accent-color);
          animation: pulse 2s infinite;
        }
        .station-marker.current .dot {
          background-color: #fff;
        }
        @keyframes pulse {
          0% {
            box-shadow: 0 0 0 0 rgba(var(--accent-color-rgb), 0.7);
          }
          70% {
            box-shadow: 0 0 0 10px rgba(var(--accent-color-rgb), 0);
          }
          100% {
            box-shadow: 0 0 0 0 rgba(var(--accent-color-rgb), 0);
          }
        }
      `}</style>
    </>
  );
};
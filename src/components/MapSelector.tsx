"use client";

import React, { useState, useCallback, useRef, useEffect } from 'react';
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';
import usePlacesAutocomplete, { getGeocode, getLatLng } from 'use-places-autocomplete';
import { Search, Navigation, MapPin, Loader2, X, CheckCircle2, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const libraries: ("places" | "drawing" | "geometry" | "visualization")[] = ["places", "geometry"];

const mapContainerStyle = {
  width: '100%',
  height: '100%',
};

// Coordenadas de las sedes (Aproximadas para Caracas)
const STORES = [
  { name: "Sede El Bosque", lat: 10.4950, lng: -66.8650 },
  { name: "Sede Campo Claro", lat: 10.4910, lng: -66.8370 }
];

const MAX_DELIVERY_RADIUS_KM = 15;

function calculateDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371;
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

interface MapSelectorProps {
  onAddressSelect: (address: {
    formatted_address: string;
    lat: number;
    lng: number;
    label?: string;
    reference_point?: string;
    unit?: string;
    zone?: string;
  }) => void;
  onClose: () => void;
  autoLocate?: boolean;
}

export const MapSelector = ({ onAddressSelect, onClose, autoLocate }: MapSelectorProps) => {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  if (!apiKey || apiKey.trim() === "" || apiKey.includes("placeholder")) {
    return <InteractiveFallbackMap onAddressSelect={onAddressSelect} onClose={onClose} autoLocate={autoLocate} />;
  }

  return <GoogleMapWrapper onAddressSelect={onAddressSelect} onClose={onClose} autoLocate={autoLocate} apiKey={apiKey} />;
};

const GoogleMapWrapper = ({ onAddressSelect, onClose, autoLocate, apiKey }: MapSelectorProps & { apiKey: string }) => {
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: apiKey,
    libraries,
  });

  if (loadError) return <InteractiveFallbackMap onAddressSelect={onAddressSelect} onClose={onClose} autoLocate={autoLocate} />;
  if (!isLoaded) return (
    <div className="p-10 flex flex-col items-center justify-center h-full gap-4 text-primary bg-white">
      <Loader2 className="w-10 h-10 animate-spin" />
      <p className="font-black animate-pulse">CARGANDO MAPA...</p>
    </div>
  );

  return <MapContent onAddressSelect={onAddressSelect} onClose={onClose} autoLocate={autoLocate} />;
};

/* ========================================================================= */
/* MAPA INTERACTIVO DE RESPALDO (OPENSTREETMAP / LEAFLET DYNAMIC LOAD)        */
/* ========================================================================= */
const InteractiveFallbackMap = ({ onAddressSelect, onClose, autoLocate }: MapSelectorProps) => {
  const [markerPos, setMarkerPos] = useState({ lat: 10.4806, lng: -66.9036 });
  const [addressName, setAddressName] = useState("Av. Principal de Las Mercedes, Caracas");
  const [deliveryStatus, setDeliveryStatus] = useState<'LOCAL' | 'OUT_OF_BOUNDS'>('LOCAL');
  const [searchValue, setSearchValue] = useState("");
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const [label, setLabel] = useState("Casa");
  const [refPoint, setRefPoint] = useState("");
  const [unit, setUnit] = useState("");
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const leafletMapRef = useRef<any>(null);
  const leafletMarkerRef = useRef<any>(null);

  const evaluateZone = (lat: number, lng: number) => {
    let isLocal = false;
    STORES.forEach(store => {
      const dist = calculateDistanceKm(lat, lng, store.lat, store.lng);
      if (dist <= MAX_DELIVERY_RADIUS_KM) {
        isLocal = true;
      }
    });
    setDeliveryStatus(isLocal ? 'LOCAL' : 'OUT_OF_BOUNDS');
  };

  const reverseGeocode = async (lat: number, lng: number) => {
    evaluateZone(lat, lng);
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`);
      const data = await res.json();
      if (data && data.display_name) {
        const cleanName = data.display_name.split(',').slice(0, 4).join(', ');
        setAddressName(cleanName);
      }
    } catch {
      setAddressName(`Ubicación seleccionada (${lat.toFixed(4)}, ${lng.toFixed(4)})`);
    }
  };

  useEffect(() => {
    if (!document.getElementById('leaflet-css')) {
      const link = document.createElement('link');
      link.id = 'leaflet-css';
      link.rel = 'stylesheet';
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      document.head.appendChild(link);
    }

    const loadLeaflet = async () => {
      if (!(window as any).L) {
        await new Promise((resolve) => {
          const script = document.createElement('script');
          script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
          script.onload = resolve;
          document.head.appendChild(script);
        });
      }

      const L = (window as any).L;
      if (L && mapContainerRef.current && !leafletMapRef.current) {
        const map = L.map(mapContainerRef.current).setView([markerPos.lat, markerPos.lng], 15);
        leafletMapRef.current = map;

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; OpenStreetMap contributors'
        }).addTo(map);

        const customIcon = L.divIcon({
          className: 'custom-leaflet-marker',
          html: `<div style="background-color: #e81e25; width: 28px; height: 28px; border-radius: 50%; border: 3px solid white; box-shadow: 0 4px 10px rgba(0,0,0,0.3); cursor: grab;"></div>`,
          iconSize: [28, 28],
          iconAnchor: [14, 14]
        });

        const marker = L.marker([markerPos.lat, markerPos.lng], { draggable: true, icon: customIcon }).addTo(map);
        leafletMarkerRef.current = marker;

        marker.on('dragend', () => {
          const pos = marker.getLatLng();
          setMarkerPos({ lat: pos.lat, lng: pos.lng });
          reverseGeocode(pos.lat, pos.lng);
        });

        map.on('click', (e: any) => {
          marker.setLatLng(e.latlng);
          setMarkerPos({ lat: e.latlng.lat, lng: e.latlng.lng });
          reverseGeocode(e.latlng.lat, e.latlng.lng);
        });

        reverseGeocode(markerPos.lat, markerPos.lng);
      }
    };

    loadLeaflet();
  }, []);

  const handleSearch = async (val: string) => {
    setSearchValue(val);
    if (val.trim().length < 3) {
      setSuggestions([]);
      return;
    }
    setIsSearching(true);
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(val + ", Venezuela")}&limit=5`);
      const data = await res.json();
      setSuggestions(data || []);
    } catch {
      setSuggestions([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSelectSuggestion = (sug: any) => {
    const lat = parseFloat(sug.lat);
    const lng = parseFloat(sug.lon);
    const newPos = { lat, lng };
    setMarkerPos(newPos);
    setSearchValue(sug.display_name.split(',')[0]);
    setSuggestions([]);

    if (leafletMapRef.current) {
      leafletMapRef.current.setView([lat, lng], 16);
    }
    if (leafletMarkerRef.current) {
      leafletMarkerRef.current.setLatLng([lat, lng]);
    }
    reverseGeocode(lat, lng);
  };

  const handleCurrentLocation = () => {
    if (navigator.geolocation) {
      setIsLocating(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          setMarkerPos({ lat, lng });

          if (leafletMapRef.current) {
            leafletMapRef.current.setView([lat, lng], 16);
          }
          if (leafletMarkerRef.current) {
            leafletMarkerRef.current.setLatLng([lat, lng]);
          }
          reverseGeocode(lat, lng).then(() => setIsLocating(false));
        },
        () => {
          setIsLocating(false);
        }
      );
    }
  };

  useEffect(() => {
    if (autoLocate) handleCurrentLocation();
  }, [autoLocate]);

  const handleConfirm = () => {
    onAddressSelect({
      formatted_address: addressName,
      lat: markerPos.lat,
      lng: markerPos.lng,
      label,
      reference_point: refPoint,
      unit,
      zone: deliveryStatus
    });
  };

  return (
    <div className="h-full bg-slate-50 flex flex-col overflow-y-auto relative">
      {/* Floating Header */}
      <div className="flex-none z-20 p-4 pb-4 bg-white/95 backdrop-blur-md border-b border-slate-100 shadow-sm rounded-b-3xl">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h2 className="text-lg sm:text-xl font-display text-brand-darkgray">Agregar Dirección</h2>
            <p className="text-[10px] text-slate-400 font-body uppercase font-black">Mueve el pin sobre tu punto de entrega</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
            <X className="w-5 h-5 text-slate-400" />
          </button>
        </div>

        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="bg-amber-50 border border-amber-100 p-2 rounded-xl flex items-center gap-2 mb-2">
          <div className="bg-amber-100 p-1 rounded-lg shrink-0">
            <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
          </div>
          <p className="text-[10px] font-bold text-amber-900 uppercase tracking-tight leading-tight">
            Haz clic o arrastra el pin sobre el mapa para ajustar tu entrega
          </p>
        </motion.div>

        {/* Search Bar */}
        <div className="relative group z-30">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors">
            {isSearching ? <Loader2 className="w-4 h-4 animate-spin text-primary" /> : <Search className="w-4 h-4" />}
          </div>
          <input
            value={searchValue}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Buscar calle, avenida, urbanización..."
            className="w-full bg-slate-50 border-2 border-slate-100 focus:border-primary/30 focus:bg-white rounded-2xl py-2.5 pl-11 pr-4 outline-none font-body text-xs sm:text-sm transition-all"
          />

          <AnimatePresence>
            {suggestions.length > 0 && (
              <motion.ul initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="absolute top-[calc(100%+8px)] left-0 right-0 bg-white shadow-2xl rounded-2xl overflow-hidden border border-slate-100 z-50 max-h-48 overflow-y-auto">
                {suggestions.map((sug, idx) => (
                  <li key={idx} onClick={() => handleSelectSuggestion(sug)} className="p-3 hover:bg-slate-50 cursor-pointer flex items-center gap-3 border-b border-slate-50 last:border-none transition-colors">
                    <MapPin className="w-4 h-4 text-slate-300 shrink-0" />
                    <span className="text-xs font-medium text-slate-600 truncate">{sug.display_name}</span>
                  </li>
                ))}
              </motion.ul>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Map Element */}
      <div className="flex-1 relative z-0 min-h-[180px] sm:min-h-[220px]">
        <div ref={mapContainerRef} className="w-full h-full" />
        <div className="absolute bottom-3 right-3 z-20">
          <button onClick={handleCurrentLocation} className="flex items-center justify-center gap-2 py-2 px-3 bg-white shadow-xl rounded-xl text-slate-700 hover:text-primary border border-slate-100 transition-all active:scale-90">
            {isLocating ? <Loader2 className="w-4 h-4 animate-spin text-primary" /> : <Navigation className="w-4 h-4 text-primary" />}
            <span className="text-[9px] font-black uppercase tracking-widest">Usar mi ubicación</span>
          </button>
        </div>
      </div>

      {/* Bottom Panel */}
      <div className="flex-none z-20 bg-white/95 backdrop-blur-md border-t border-slate-100 p-3 sm:p-4 shadow-[0_-20px_40px_rgba(0,0,0,0.1)] rounded-t-2xl overflow-y-auto max-h-[50vh]">
        <div className="space-y-2.5 max-w-xl mx-auto">
          <div className="flex gap-2">
            {["Casa", "Trabajo", "Otro"].map((l) => (
              <button key={l} onClick={() => setLabel(l)} className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-wider transition-all ${label === l ? 'bg-primary text-white shadow-md shadow-primary/20' : 'bg-slate-100 text-slate-400 hover:bg-slate-200'}`}>
                {l}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <div className="space-y-0.5">
              <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-1 ml-1">Piso / Oficina / Casa <span className="text-primary">*</span></label>
              <input type="text" placeholder="Ej: Apto 4B, Casa 3..." value={unit} onChange={(e) => setUnit(e.target.value)} className="w-full p-2 rounded-xl bg-slate-50 border border-slate-100 outline-none font-medium text-xs" />
            </div>

            <div className="space-y-0.5">
              <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-1 ml-1"><MapPin className="w-3 h-3 text-primary" /> Detalles / Ref. <span className="text-primary">*</span></label>
              <input type="text" placeholder="Ej: Portón blanco..." value={refPoint} onChange={(e) => setRefPoint(e.target.value)} className="w-full p-2 rounded-xl bg-slate-50 border border-slate-100 outline-none font-medium text-xs" />
            </div>
          </div>

          <div className={`p-2.5 rounded-xl flex items-start gap-2 border transition-all ${deliveryStatus === 'LOCAL' ? 'bg-slate-50/50 border-slate-100' : 'bg-red-50/50 border-red-200'}`}>
            {deliveryStatus === 'LOCAL' ? <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0 mt-0.5" /> : <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />}
            <div>
              <p className={`text-[8px] font-black uppercase tracking-[0.1em] ${deliveryStatus === 'LOCAL' ? 'text-green-600' : 'text-red-600'}`}>
                {deliveryStatus === 'LOCAL' ? "ZONA DE COBERTURA ACTIVA" : "FUERA DE COBERTURA LOCAL"}
              </p>
              <p className="text-[11px] font-bold text-slate-700 leading-tight">
                {deliveryStatus === 'OUT_OF_BOUNDS' ? "Esta dirección está fuera de cobertura. Por favor selecciona Envío Nacional." : (addressName || "Selecciona un punto en el mapa")}
              </p>
            </div>
          </div>

          <button onClick={handleConfirm} disabled={!addressName || !unit.trim() || !refPoint.trim() || deliveryStatus === 'OUT_OF_BOUNDS'} className="w-full bg-primary text-white py-3 rounded-xl font-black shadow-lg shadow-primary/20 text-sm uppercase tracking-wider transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50">
            Confirmar Dirección
          </button>
        </div>
      </div>
    </div>
  );
};

/* ========================================================================= */
/* COMPONENTE ORIGINAL DE GOOGLE MAPS                                         */
/* ========================================================================= */
const MapContent = ({ onAddressSelect, onClose, autoLocate }: MapSelectorProps) => {
  const [center, setCenter] = useState({ lat: 10.4806, lng: -66.9036 });
  const [markerPos, setMarkerPos] = useState({ lat: 10.4806, lng: -66.9036 });
  const [addressName, setAddressName] = useState("");
  const [deliveryStatus, setDeliveryStatus] = useState<'LOCAL' | 'OUT_OF_BOUNDS'>('LOCAL');
  const [isLocating, setIsLocating] = useState(false);
  const [label, setLabel] = useState("Casa");
  const [refPoint, setRefPoint] = useState("");
  const [unit, setUnit] = useState("");

  const mapRef = useRef<google.maps.Map | null>(null);

  const { ready, value, suggestions: { status, data }, setValue, clearSuggestions } = usePlacesAutocomplete({
    requestOptions: { locationBias: { radius: 20000, center: { lat: 10.4806, lng: -66.9036 } }, componentRestrictions: { country: "ve" } },
    debounce: 300,
  });

  const evaluateZone = useCallback(async (lat: number, lng: number, preFetchedResults?: any[]) => {
    if (!window.google) return;
    let results = preFetchedResults;
    if (!results) {
      try { results = await getGeocode({ location: { lat, lng } }); } catch { return; }
    }
    if (results && results.length > 0) {
      const bestResult = results.find(r => r.types.includes('street_address') || r.types.includes('route') || r.types.includes('establishment')) || results[0];
      setAddressName(bestResult.formatted_address);
      setValue(bestResult.formatted_address, false);
    }
    const point = new google.maps.LatLng(lat, lng);
    let isLocal = false;
    STORES.forEach(store => {
      const storePos = new google.maps.LatLng(store.lat, store.lng);
      const distance = google.maps.geometry.spherical.computeDistanceBetween(point, storePos);
      if (distance <= MAX_DELIVERY_RADIUS_KM * 1000) isLocal = true;
    });
    setDeliveryStatus(isLocal ? 'LOCAL' : 'OUT_OF_BOUNDS');
  }, [setValue]);

  const onMapLoad = useCallback((map: google.maps.Map) => { mapRef.current = map; }, []);

  const onMarkerDragEnd = (e: google.maps.MapMouseEvent) => {
    if (e.latLng) {
      const newPos = { lat: e.latLng.lat(), lng: e.latLng.lng() };
      setMarkerPos(newPos);
      evaluateZone(newPos.lat, newPos.lng);
    }
  };

  const handleSelect = async (description: string) => {
    setValue(description, false);
    clearSuggestions();
    try {
      const results = await getGeocode({ address: description });
      const { lat, lng } = await getLatLng(results[0]);
      const newPos = { lat, lng };
      setCenter(newPos);
      setMarkerPos(newPos);
      evaluateZone(lat, lng, results);
    } catch (error) { console.error("Error selecting place:", error); }
  };

  const handleCurrentLocation = () => {
    if (navigator.geolocation) {
      setIsLocating(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const newPos = { lat: position.coords.latitude, lng: position.coords.longitude };
          setCenter(newPos);
          setMarkerPos(newPos);
          evaluateZone(newPos.lat, newPos.lng).then(() => setIsLocating(false));
        },
        () => setIsLocating(false)
      );
    }
  };

  useEffect(() => {
    if (autoLocate) handleCurrentLocation();
  }, [autoLocate]);

  const handleConfirm = () => {
    onAddressSelect({
      formatted_address: addressName,
      lat: markerPos.lat,
      lng: markerPos.lng,
      label,
      reference_point: refPoint,
      unit,
      zone: deliveryStatus
    });
  };

  return (
    <div className="h-full bg-slate-50 flex flex-col overflow-y-auto relative">
      <div className="flex-none z-20 p-4 pb-4 bg-white/95 backdrop-blur-md border-b border-slate-100 shadow-sm rounded-b-3xl">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h2 className="text-lg sm:text-xl font-display text-brand-darkgray">Agregar Dirección</h2>
            <p className="text-[10px] text-slate-400 font-body uppercase font-black">Ubica el pin sobre tu entrega</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
            <X className="w-5 h-5 text-slate-400" />
          </button>
        </div>

        <div className="relative group z-30">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors">
            <Search className="w-4 h-4" />
          </div>
          <input
            value={value}
            onChange={(e) => setValue(e.target.value)}
            disabled={!ready}
            placeholder="Buscar calle, edificio, zona..."
            className="w-full bg-slate-50 border-2 border-slate-100 focus:border-primary/30 focus:bg-white rounded-2xl py-2.5 pl-11 pr-4 outline-none font-body text-xs sm:text-sm transition-all"
          />

          <AnimatePresence>
            {status === "OK" && (
              <motion.ul initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="absolute top-[calc(100%+8px)] left-0 right-0 bg-white shadow-2xl rounded-2xl overflow-hidden border border-slate-100 z-50 max-h-48 overflow-y-auto">
                {data.map(({ place_id, description }) => (
                  <li key={place_id} onClick={() => handleSelect(description)} className="p-3 hover:bg-slate-50 cursor-pointer flex items-center gap-3 border-b border-slate-50 last:border-none transition-colors">
                    <MapPin className="w-4 h-4 text-slate-300" />
                    <span className="text-xs font-medium text-slate-600">{description}</span>
                  </li>
                ))}
              </motion.ul>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div className="flex-1 relative z-0 min-h-[180px] sm:min-h-[220px]">
        <GoogleMap mapContainerStyle={mapContainerStyle} center={center} zoom={15} onLoad={onMapLoad} options={{ disableDefaultUI: true, zoomControl: true }}>
          <Marker position={markerPos} draggable={true} onDragEnd={onMarkerDragEnd} />
        </GoogleMap>
        <div className="absolute bottom-3 right-3 z-20">
          <button onClick={handleCurrentLocation} className="flex items-center justify-center gap-2 py-2 px-3 bg-white shadow-xl rounded-xl text-slate-700 hover:text-primary border border-slate-100 transition-all active:scale-90">
            {isLocating ? <Loader2 className="w-4 h-4 animate-spin text-primary" /> : <Navigation className="w-4 h-4 text-primary" />}
            <span className="text-[9px] font-black uppercase tracking-widest">Usar mi ubicación</span>
          </button>
        </div>
      </div>

      <div className="flex-none z-20 bg-white/95 backdrop-blur-md border-t border-slate-100 p-3 sm:p-4 shadow-[0_-20px_40px_rgba(0,0,0,0.1)] rounded-t-2xl overflow-y-auto max-h-[50vh]">
        <div className="space-y-2.5 max-w-xl mx-auto">
          <div className="flex gap-2">
            {["Casa", "Trabajo", "Otro"].map((l) => (
              <button key={l} onClick={() => setLabel(l)} className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-wider transition-all ${label === l ? 'bg-primary text-white shadow-md shadow-primary/20' : 'bg-slate-100 text-slate-400 hover:bg-slate-200'}`}>
                {l}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <div className="space-y-0.5">
              <label className="text-[9px] font-black uppercase tracking-widest text-slate-400">Piso / Oficina / Casa <span className="text-primary">*</span></label>
              <input type="text" placeholder="Ej: Apto 4B, Casa 3..." value={unit} onChange={(e) => setUnit(e.target.value)} className="w-full p-2 rounded-xl bg-slate-50 border border-slate-100 outline-none font-medium text-xs" />
            </div>

            <div className="space-y-0.5">
              <label className="text-[9px] font-black uppercase tracking-widest text-slate-400">Detalles / Ref. <span className="text-primary">*</span></label>
              <input type="text" placeholder="Ej: Portón blanco..." value={refPoint} onChange={(e) => setRefPoint(e.target.value)} className="w-full p-2 rounded-xl bg-slate-50 border border-slate-100 outline-none font-medium text-xs" />
            </div>
          </div>

          <div className={`p-2.5 rounded-xl flex items-start gap-2 border transition-all ${deliveryStatus === 'LOCAL' ? 'bg-slate-50/50 border-slate-100' : 'bg-red-50/50 border-red-200'}`}>
            {deliveryStatus === 'LOCAL' ? <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0 mt-0.5" /> : <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />}
            <div>
              <p className={`text-[8px] font-black uppercase tracking-[0.1em] ${deliveryStatus === 'LOCAL' ? 'text-green-600' : 'text-red-600'}`}>
                {deliveryStatus === 'LOCAL' ? "ZONA DE COBERTURA ACTIVA" : "FUERA DE COBERTURA LOCAL"}
              </p>
              <p className="text-[11px] font-bold text-slate-700 leading-tight">
                {deliveryStatus === 'OUT_OF_BOUNDS' ? "Esta dirección está fuera de cobertura." : (addressName || "Selecciona un punto en el mapa")}
              </p>
            </div>
          </div>

          <button onClick={handleConfirm} disabled={!addressName || !unit.trim() || !refPoint.trim() || deliveryStatus === 'OUT_OF_BOUNDS'} className="w-full bg-primary text-white py-3 rounded-xl font-black shadow-lg shadow-primary/20 text-sm uppercase tracking-wider transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50">
            Confirmar Dirección
          </button>
        </div>
      </div>
    </div>
  );
};

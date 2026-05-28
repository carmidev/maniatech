"use client";

import React, { useState, useCallback, useRef, useEffect } from 'react';
import { GoogleMap, useJsApiLoader, Marker, Circle } from '@react-google-maps/api';
import usePlacesAutocomplete, { getGeocode, getLatLng } from 'use-places-autocomplete';
import { Search, Navigation, MapPin, Loader2, X, CheckCircle2, AlertCircle, Truck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const libraries: ("places" | "drawing" | "geometry" | "visualization")[] = ["places", "geometry"];

const mapContainerStyle = {
  width: '100%',
  height: '100%',
};

// Coordenadas de las sedes (Aproximadas para Caracas)
const STORES = [
  { name: "Dolce Candy El Bosque", lat: 10.4950, lng: -66.8650 },
  { name: "Dolce Candy Campo Claro", lat: 10.4910, lng: -66.8370 }
];

const MAX_DELIVERY_RADIUS_KM = 15; // Radio máximo de entrega

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
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
    libraries,
  });

  if (loadError) return <div className="p-10 text-center text-red-500 font-bold">Error cargando el mapa</div>;
  if (!isLoaded) return (
    <div className="p-10 flex flex-col items-center justify-center h-full gap-4 text-primary bg-white">
      <Loader2 className="w-10 h-10 animate-spin" />
      <p className="font-black animate-pulse">CARGANDO MAPA...</p>
    </div>
  );

  return <MapContent onAddressSelect={onAddressSelect} onClose={onClose} autoLocate={autoLocate} />;
};

const MapContent = ({ onAddressSelect, onClose, autoLocate }: MapSelectorProps) => {
  const [center, setCenter] = useState({ lat: 10.4806, lng: -66.9036 }); // Centro inicial Caracas
  const [markerPos, setMarkerPos] = useState({ lat: 10.4806, lng: -66.9036 });
  const [addressName, setAddressName] = useState("");
  type DeliveryStatus = 'LOCAL' | 'OUT_OF_BOUNDS';
  const [deliveryStatus, setDeliveryStatus] = useState<DeliveryStatus>('LOCAL');
  const [regionName, setRegionName] = useState("");
  const [isLocating, setIsLocating] = useState(false);
  const [label, setLabel] = useState("Casa");
  const [refPoint, setRefPoint] = useState("");
  const [unit, setUnit] = useState("");

  const mapRef = useRef<google.maps.Map | null>(null);

  const {
    ready,
    value,
    suggestions: { status, data },
    setValue,
    clearSuggestions,
  } = usePlacesAutocomplete({
    requestOptions: {
      locationBias: { radius: 20000, center: { lat: 10.4806, lng: -66.9036 } }, // Preferencia Caracas
      componentRestrictions: { country: "ve" },
    },
    debounce: 300,
  });

  const evaluateZone = useCallback(async (lat: number, lng: number, preFetchedResults?: any[]) => {
    if (!window.google) return;

    let results = preFetchedResults;
    if (!results) {
      try {
        results = await getGeocode({ location: { lat, lng } });
      } catch (error) {
        console.error("Geocoding error:", error);
        return;
      }
    }

    if (results && results.length > 0) {
      // Intentar encontrar un resultado que sea dirección de calle o establecimiento
      const bestResult = results.find(r => r.types.includes('street_address') || r.types.includes('route') || r.types.includes('establishment')) || results[0];

      let betterAddress = bestResult.formatted_address;

      // Lógica de "Traducción" a Humano:
      // Si la dirección parece un Plus Code (ej: "FC86+GM9, Guarenas...") o es muy técnica
      const isPlusCode = /^[A-Z0-9]{4}\+[A-Z0-9]{2}/.test(betterAddress);

      if (isPlusCode || betterAddress.includes('Unnamed Road')) {
        const components = bestResult.address_components;

        // Extraemos partes orgánicas
        const neighborhood = components.find((c: any) =>
          c.types.includes('sublocality') ||
          c.types.includes('neighborhood') ||
          c.types.includes('sublocality_level_1')
        )?.long_name;

        const city = components.find((c: any) => c.types.includes('locality'))?.long_name;
        const state = components.find((c: any) => c.types.includes('administrative_area_level_1'))?.long_name;

        if (neighborhood && city) {
          betterAddress = `${neighborhood}, ${city}${state ? `, ${state}` : ''}`;
        } else if (city && state) {
          betterAddress = `${city}, ${state}`;
        }
      }

      setAddressName(betterAddress);
      setValue(betterAddress, false);

      let stateName = "";
      bestResult.address_components.forEach((comp: any) => {
        if (comp.types.includes("administrative_area_level_1")) {
          stateName = comp.long_name;
        }
      });
      setRegionName(stateName);
    }

    const point = new google.maps.LatLng(lat, lng);
    let isLocal = false;

    STORES.forEach(store => {
      const storePos = new google.maps.LatLng(store.lat, store.lng);
      const distance = google.maps.geometry.spherical.computeDistanceBetween(point, storePos);
      if (distance <= MAX_DELIVERY_RADIUS_KM * 1000) {
        isLocal = true;
      }
    });

    setDeliveryStatus(isLocal ? 'LOCAL' : 'OUT_OF_BOUNDS');
  }, [setValue]);

  const onMapLoad = useCallback((map: google.maps.Map) => {
    mapRef.current = map;
  }, []);

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
    } catch (error) {
      console.error("Error selecting place:", error);
    }
  };

  const handleCurrentLocation = () => {
    if (navigator.geolocation) {
      setIsLocating(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const newPos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setCenter(newPos);
          setMarkerPos(newPos);
          evaluateZone(newPos.lat, newPos.lng).then(() => {
            setIsLocating(false);
          });
        },
        () => {
          alert("No se pudo obtener tu ubicación. Por favor, búscala manualmente.");
          setIsLocating(false);
        }
      );
    }
  };

  useEffect(() => {
    if (autoLocate) {
      handleCurrentLocation();
    }
  }, [autoLocate]);

  const handleConfirm = () => {
    onAddressSelect({
      formatted_address: addressName,
      lat: markerPos.lat,
      lng: markerPos.lng,
      label: label,
      reference_point: refPoint,
      unit: unit,
      zone: deliveryStatus
    });
  };

  return (
    <div className="h-full bg-slate-50 flex flex-col overflow-hidden relative">
      {/* Floating Header UI */}
      <div className="flex-none z-20 p-4 pb-5 bg-white/95 backdrop-blur-md border-b border-slate-100 shadow-sm rounded-b-3xl">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h2 className="text-xl font-display text-brand-darkgray">Agregar Dirección</h2>
            <p className="text-xs text-slate-400 font-body uppercase font-black">Ubica el pin sobre tu entrega</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
            <X className="w-6 h-6 text-slate-400" />
          </button>
        </div>

        {/* Aviso de seguridad */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-amber-50 border border-amber-100 p-2.5 rounded-xl flex items-center gap-3 mb-3"
        >
          <div className="bg-amber-100 p-1.5 rounded-lg shrink-0">
            <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
          </div>
          <p className="text-[10px] font-bold text-amber-900 uppercase tracking-tight leading-tight">
            Asegúrate de poner la dirección correctamente para evitar cualquier imprevisto
          </p>
        </motion.div>

        {/* Search Bar */}
        <div className="relative group z-30">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors">
            <Search className="w-5 h-5" />
          </div>
          <input
            value={value}
            onChange={(e) => setValue(e.target.value)}
            disabled={!ready}
            placeholder="Buscar calle, edificio, zona..."
            className="w-full bg-slate-50 border-2 border-slate-100 focus:border-primary/30 focus:bg-white rounded-2xl py-3 pl-12 pr-4 outline-none font-body text-sm transition-all"
          />

          <AnimatePresence>
            {status === "OK" && (
              <motion.ul
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute top-[calc(100%+8px)] left-0 right-0 bg-white shadow-2xl rounded-2xl overflow-hidden border border-slate-100 z-50 max-h-60 overflow-y-auto"
              >
                {data.map(({ place_id, description }) => (
                  <li
                    key={place_id}
                    onClick={() => handleSelect(description)}
                    className="p-4 hover:bg-slate-50 cursor-pointer flex items-center gap-3 border-b border-slate-50 last:border-none transition-colors"
                  >
                    <MapPin className="w-4 h-4 text-slate-300" />
                    <span className="text-sm font-medium text-slate-600">{description}</span>
                  </li>
                ))}
              </motion.ul>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Map Container - Takes remaining space */}
      <div className="flex-1 relative z-0">
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          center={center}
          zoom={15}
          onLoad={onMapLoad}
          options={{
            disableDefaultUI: true,
            zoomControl: true,
            padding: { top: 0, bottom: 0 },
            styles: [
              {
                "featureType": "poi",
                "stylers": [{ "visibility": "off" }]
              }
            ]
          } as any}
        >
          <Marker
            position={markerPos}
            draggable={true}
            onDragEnd={onMarkerDragEnd}
            animation={google.maps.Animation.DROP}
            icon={{
              path: "M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z",
              fillColor: "#e81e25",
              fillOpacity: 1,
              strokeWeight: 2,
              strokeColor: "#FFFFFF",
              scale: 2,
              anchor: new google.maps.Point(12, 22),
            }}
          />
        </GoogleMap>

        {/* Location Button */}
        <div className="absolute bottom-4 right-4 z-20">
          <button
            onClick={handleCurrentLocation}
            className="flex items-center justify-center gap-2 py-3 px-4 bg-white shadow-xl rounded-2xl text-slate-700 hover:text-primary border border-slate-100 transition-all active:scale-90"
          >
            {isLocating ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin text-primary" />
                <span className="text-[10px] font-black uppercase tracking-widest text-primary">Cargando...</span>
              </>
            ) : (
              <>
                <Navigation className="w-5 h-5 text-primary" />
                <span className="text-[10px] font-black uppercase tracking-widest">Usar mi ubicación actual</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Bottom Card */}
      <div className="flex-none z-20 bg-white/95 backdrop-blur-md border-t border-slate-100 p-4 sm:p-5 shadow-[0_-20px_40px_rgba(0,0,0,0.1)] rounded-t-[2rem]">
        <div className="space-y-3 max-w-xl mx-auto">
          <div className="flex gap-2">
            {["Casa", "Trabajo", "Otro"].map((l) => (
              <button
                key={l}
                onClick={() => setLabel(l)}
                className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider transition-all ${label === l ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'bg-slate-100 text-slate-400 hover:bg-slate-200'}`}
              >
                {l}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-1 ml-1">
                Piso / Oficina / Casa <span className="text-primary">*</span>
              </label>
              <input
                type="text"
                placeholder="Ej: Apto 4B, Casa 3..."
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-100 focus:border-primary/30 focus:ring-2 focus:ring-primary/5 outline-none transition-all font-medium text-xs"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center justify-between gap-2 ml-1">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-primary" /> Detalles / Ref. <span className="text-primary">*</span>
                </span>
              </label>
              <input
                type="text"
                placeholder="Ej: Portón blanco..."
                value={refPoint}
                onChange={(e) => setRefPoint(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-100 focus:border-primary/30 focus:ring-2 focus:ring-primary/5 outline-none transition-all font-medium text-xs"
              />
            </div>
          </div>

          <div className={`p-3 rounded-xl flex items-start gap-2.5 border transition-all ${deliveryStatus === 'LOCAL' ? 'bg-slate-50/50 border-slate-100' : 'bg-red-50/50 border-red-200'
            }`}>
            {deliveryStatus === 'LOCAL' && <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />}
            {deliveryStatus === 'OUT_OF_BOUNDS' && <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />}

            <div className="space-y-0">
              <p className={`text-[8px] font-black uppercase tracking-[0.1em] ${deliveryStatus === 'LOCAL' ? 'text-green-600' : 'text-red-600'
                }`}>
                {deliveryStatus === 'LOCAL' && "ZONA DE COBERTURA ACTIVA"}
                {deliveryStatus === 'OUT_OF_BOUNDS' && "FUERA DE COBERTURA LOCAL"}
              </p>
              <p className="text-xs font-bold text-slate-700 leading-tight">
                {deliveryStatus === 'OUT_OF_BOUNDS' 
                  ? "Esta dirección está muy lejos de nuestras tiendas. Por favor, cierra este mapa y selecciona la opción 'Envío Nacional'." 
                  : (addressName || "Selecciona un punto en el mapa")}
              </p>
            </div>
          </div>

          <button
            onClick={handleConfirm}
            disabled={!addressName || !unit.trim() || !refPoint.trim() || deliveryStatus === 'OUT_OF_BOUNDS'}
            className="w-full bg-primary text-white py-3 rounded-xl font-black shadow-lg shadow-primary/20 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 text-base uppercase tracking-wider"
          >
            Confirmar Dirección
          </button>
        </div>
      </div>
    </div>
  );
};

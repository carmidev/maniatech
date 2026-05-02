"use client";

import React, { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/context/AuthContext";
import { User, MapPin, Phone, User as UserIcon } from "lucide-react";
import { motion } from "framer-motion";
import { CountryCodeSelect } from "./CountryCodeSelect";

interface ProfileFormProps {
  onComplete: () => void;
}

export const ProfileForm = ({ onComplete }: ProfileFormProps) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    first_name: user?.user_metadata?.full_name?.split(" ")[0] || "",
    last_name: user?.user_metadata?.full_name?.split(" ").slice(1).join(" ") || "",
    country_code: "+58",
    phone: user?.phone?.replace(/^58/, "") || "",
    id_number: "",
    gender: "",
    address: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Forzar estrictamente los valores permitidos por la base de datos ("google" o "phone")
      const isGoogle = user?.app_metadata?.provider === "google";
      const provider = isGoogle ? "google" : "phone";

      const payload = {
        id: user?.id,
        first_name: formData.first_name,
        last_name: formData.last_name,
        phone: `+${formData.country_code.replace(/\D/g, "")}${formData.phone.replace(/\D/g, "")}`,
        id_number: formData.id_number,
        gender: formData.gender,
        address: formData.address,
        email: user?.email || null,
        auth_provider: provider,
        updated_at: new Date().toISOString(),
      };

      console.log("Guardando perfil completo:", payload);

      const { error } = await supabase.from("customers").upsert(payload);

      if (error) {
        console.error("Error de Supabase:", error);
        throw error;
      }
      
      onComplete();
    } catch (error: any) {
      console.error("Error saving profile:", error);
      const message = error.message || "Verifica que todos los campos sean correctos.";
      alert(`Hubo un error al guardar tu perfil: ${message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* First Name */}
          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase text-gray-400 ml-1">Nombre</label>
            <input
              type="text"
              value={formData.first_name}
              onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
              className="w-full rounded-2xl bg-slate-50 border border-slate-200 py-3.5 px-4 font-inter-display outline-none focus:border-primary/50 focus:ring-4 focus:ring-primary/10 transition-all text-base"
              required
            />
          </div>
          {/* Last Name */}
          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase text-gray-400 ml-1">Apellido</label>
            <input
              type="text"
              value={formData.last_name}
              onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
              className="w-full rounded-2xl bg-slate-50 border border-slate-200 py-3.5 px-4 font-inter-display outline-none focus:border-primary/50 focus:ring-4 focus:ring-primary/10 transition-all text-base"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* ID Number */}
          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase text-gray-400 ml-1">Cédula / ID</label>
            <input
              type="text"
              placeholder="Ej. 12.345.678"
              value={formData.id_number}
              onChange={(e) => setFormData({ ...formData, id_number: e.target.value })}
              className="w-full rounded-2xl bg-slate-50 border border-slate-200 py-3.5 px-4 font-inter-display outline-none focus:border-primary/50 focus:ring-4 focus:ring-primary/10 transition-all text-base"
              required
            />
          </div>

          {/* Gender */}
          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase text-gray-400 ml-1">Género</label>
            <select
              value={formData.gender}
              onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
              className="w-full rounded-2xl bg-slate-50 border border-slate-200 py-3.5 px-4 font-inter-display outline-none focus:border-primary/50 focus:ring-4 focus:ring-primary/10 transition-all text-base appearance-none cursor-pointer"
              required
            >
              <option value="" disabled>Selecciona...</option>
              <option value="Femenino">Femenino</option>
              <option value="Masculino">Masculino</option>
              <option value="Otro">Otro</option>
            </select>
          </div>
        </div>

        {/* Phone */}
        <div className="space-y-1">
          <label className="text-[10px] font-black uppercase text-gray-400 ml-1">Teléfono</label>
          <div className="flex gap-2">
            <CountryCodeSelect
              value={formData.country_code}
              onChange={(val) => setFormData({ ...formData, country_code: val })}
              className="w-[120px] shrink-0"
            />
            <input
              type="tel"
              placeholder="Ej. 4141234567"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full rounded-2xl bg-slate-50 border border-slate-200 py-3.5 px-4 font-inter-display outline-none focus:border-primary/50 focus:ring-4 focus:ring-primary/10 transition-all text-base"
              required
            />
          </div>
        </div>

        {/* Address */}
        <div className="space-y-1">
          <label className="text-[10px] font-black uppercase text-gray-400 ml-1">Dirección de Envío</label>
          <textarea
            placeholder="Urbanización, calle, edificio, referencia..."
            value={formData.address}
            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            className="w-full rounded-2xl bg-slate-50 border border-slate-200 py-3.5 px-4 font-inter-display outline-none focus:border-primary/50 focus:ring-4 focus:ring-primary/10 transition-all text-base min-h-[60px] sm:min-h-[80px] resize-none"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-primary text-white py-4 md:py-5 rounded-2xl font-black shadow-xl shadow-primary/20 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 mt-6 text-lg tracking-wider uppercase"
        >
          {loading ? "Guardando..." : "Guardar Perfil ✨"}
        </button>
      </form>
    </div>
  );
};

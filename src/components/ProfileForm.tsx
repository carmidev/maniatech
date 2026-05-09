"use client";

import React, { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/context/AuthContext";
import { CountryCodeSelect } from "./CountryCodeSelect";
import { CustomSelect } from "./CustomSelect";

interface ProfileFormProps {
  onComplete: () => void;
  deliveryMethod?: "pickup" | "delivery";
}

const ID_RULES: Record<string, { min: number, max: number, placeholder: string, pattern: RegExp }> = {
  V: { min: 6, max: 8, placeholder: "Ej. 12345678", pattern: /[^0-9]/g },
  E: { min: 8, max: 8, placeholder: "Ej. 12345678", pattern: /[^0-9]/g },
  J: { min: 9, max: 9, placeholder: "Ej. 123456789", pattern: /[^0-9]/g },
  G: { min: 9, max: 9, placeholder: "Ej. 123456789", pattern: /[^0-9]/g },
  P: { min: 5, max: 10, placeholder: "Ej. 12345678", pattern: /[^A-Z0-9]/g }, // Alfanumérico opcional
};

export const ProfileForm = ({ onComplete, deliveryMethod }: ProfileFormProps) => {
  const { user } = useAuth();
  
  // Parse initial ID
  const initialId = user?.id_number || "";
  const prefixMatch = initialId.match(/^[VEJGP]/);
  const initPrefix = prefixMatch ? prefixMatch[0] : "V";
  const initNum = prefixMatch ? initialId.substring(1) : initialId;

  const [loading, setLoading] = useState(false);
  const [phoneError, setPhoneError] = useState("");
  const [idError, setIdError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [duplicateErrors, setDuplicateErrors] = useState<Record<string, string>>({});
  
  const [idPrefix, setIdPrefix] = useState(initPrefix);
  const [idNumber, setIdNumber] = useState(initNum);

  const [formData, setFormData] = useState({
    first_name: user?.user_metadata?.full_name?.split(" ")[0] || "",
    last_name: user?.user_metadata?.full_name?.split(" ").slice(1).join(" ") || "",
    country_code: "+58",
    phone: user?.phone?.replace(/^58/, "") || "",
    email: user?.email || "",
    gender: "",
  });

  const checkDuplication = async (field: string, value: string) => {
    if (!value || !user) return;
    
    try {
      const { data, error } = await supabase
        .from("customers")
        .select("id")
        .eq(field, value)
        .neq("id", user.id) // Ignorar si es el mismo usuario
        .maybeSingle();

      if (data) {
        setDuplicateErrors(prev => ({
          ...prev,
          [field]: `Este ${field === 'id_number' ? 'ID' : field === 'phone' ? 'teléfono' : 'correo'} ya está registrado.`
        }));
      } else {
        setDuplicateErrors(prev => {
          const newErrors = { ...prev };
          delete newErrors[field];
          return newErrors;
        });
      }
    } catch (err) {
      console.error("Error checking duplication:", err);
    }
  };

  const handleIdPrefixChange = (val: string) => {
    setIdPrefix(val);
    setIdNumber(""); 
    setIdError("");
    setDuplicateErrors(prev => {
      const n = {...prev}; delete n.id_number; return n;
    });
  };

  const handleIdNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.toUpperCase();
    const rule = ID_RULES[idPrefix];
    val = val.replace(rule.pattern, "");
    if (val.length > rule.max) val = val.substring(0, rule.max);
    setIdNumber(val);
    if (idError) setIdError("");
  };

  const handleIdBlur = () => {
    const rule = ID_RULES[idPrefix];
    if (idNumber && idNumber.length < rule.min) {
      setIdError(`Mínimo ${rule.min} caracteres requeridos.`);
    } else if (idNumber) {
      checkDuplication("id_number", `${idPrefix}${idNumber}`);
    }
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/[^\d\s]/g, ""); 
    let numericVal = val.replace(/\D/g, "");

    if (numericVal.startsWith("0")) numericVal = numericVal.substring(1);
    if (numericVal.length > 10) numericVal = numericVal.substring(0, 10);

    if (numericVal.length >= 3) {
      const prefix = numericVal.substring(0, 3);
      const validPrefixes = ["412", "414", "424", "416", "426", "422"];
      const isValidMobile = validPrefixes.includes(prefix);
      const isValidFixed = prefix.startsWith("2");
      
      if (!isValidMobile && !isValidFixed) {
        setPhoneError("Código de operadora no reconocido");
      } else {
        setPhoneError("");
      }
    } else {
      setPhoneError("");
    }

    let maskedVal = numericVal;
    if (numericVal.length > 3 && numericVal.length <= 6) {
      maskedVal = `${numericVal.slice(0, 3)} ${numericVal.slice(3)}`;
    } else if (numericVal.length > 6) {
      maskedVal = `${numericVal.slice(0, 3)} ${numericVal.slice(3, 6)} ${numericVal.slice(6)}`;
    }

    setFormData({ ...formData, phone: maskedVal });
  };

  const handlePhoneBlur = () => {
    const numericVal = formData.phone.replace(/\D/g, "");
    if (numericVal && numericVal.length < 10 && !phoneError) {
      setPhoneError("El número debe contener exactamente 10 dígitos.");
    } else if (numericVal && !phoneError) {
      const fullPhone = `${formData.country_code.replace(/\D/g, "")}${numericVal}`;
      checkDuplication("phone", fullPhone);
    }
  };

  const handleEmailBlur = () => {
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setEmailError("Ingresa un correo válido.");
    } else if (formData.email) {
      setEmailError("");
      checkDuplication("email", formData.email);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validaciones Finales
    const rule = ID_RULES[idPrefix];
    if (idNumber.length < rule.min) {
      setIdError(`Mínimo ${rule.min} caracteres.`);
      return;
    }
    
    const phoneNum = formData.phone.replace(/\D/g, "");
    if (phoneNum.length !== 10 || phoneError) {
      if (!phoneError) setPhoneError("Número inválido.");
      return;
    }

    if (Object.keys(duplicateErrors).length > 0) {
      alert("Algunos datos ya están registrados por otro cliente. Por favor revísalos.");
      return;
    }

    setLoading(true);

    try {
      // Detección más robusta del proveedor
      const identities = (user as any)?.identities || [];
      const providers = user?.app_metadata?.providers || [];
      const isGoogle = providers.includes("google") || identities.some((i: any) => i.provider === "google");
      
      const provider = isGoogle ? "google" : "phone";

      const payload = {
        id: user?.id,
        first_name: formData.first_name,
        last_name: formData.last_name,
        phone: `${formData.country_code}${phoneNum}`, // Mantiene el + (Ej: +584141234567)
        id_number: `${idPrefix}${idNumber}`, 
        gender: formData.gender,
        email: formData.email,
        auth_provider: provider,
        updated_at: new Date().toISOString(),
      };

      const { error } = await supabase.from("customers").upsert(payload);
      if (error) throw error;
      onComplete();
    } catch (error: any) {
      console.error("Error saving profile:", error);
      alert(`Error: ${error.message || "No se pudo guardar."}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase text-gray-400 ml-1">Nombre</label>
            <input
              type="text"
              value={formData.first_name}
              onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
              className="w-full rounded-2xl bg-slate-50 border border-slate-200 py-3.5 px-4 font-body outline-none focus:border-primary/50 focus:ring-4 focus:ring-primary/10 transition-all text-base"
              required
            />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase text-gray-400 ml-1">Apellido</label>
            <input
              type="text"
              value={formData.last_name}
              onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
              className="w-full rounded-2xl bg-slate-50 border border-slate-200 py-3.5 px-4 font-body outline-none focus:border-primary/50 focus:ring-4 focus:ring-primary/10 transition-all text-base"
              required
            />
          </div>
        </div>

        {/* Email */}
        <div className="space-y-1">
          <label className="text-[10px] font-black uppercase text-gray-400 ml-1">Correo Electrónico</label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            onBlur={handleEmailBlur}
            className={`w-full rounded-2xl bg-slate-50 border py-3.5 px-4 font-body outline-none focus:ring-4 transition-all text-base ${emailError || duplicateErrors.email ? 'border-primary focus:border-primary focus:ring-primary/10' : 'border-slate-200 focus:border-primary/50 focus:ring-primary/10'}`}
            required
          />
          {(emailError || duplicateErrors.email) && (
            <span className="text-[10px] font-black text-primary ml-1 block mt-1">
              {emailError || duplicateErrors.email}
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase text-gray-400 ml-1">Cédula / ID</label>
            <div className="flex gap-2">
              <CustomSelect
                value={idPrefix}
                onChange={handleIdPrefixChange}
                options={[
                  { value: "V", label: "V" },
                  { value: "E", label: "E" },
                  { value: "J", label: "J" },
                  { value: "G", label: "G" },
                  { value: "P", label: "P" },
                ]}
                className="w-[85px] shrink-0 z-10"
              />
              <input
                type="text"
                placeholder={ID_RULES[idPrefix].placeholder}
                value={idNumber}
                onChange={handleIdNumberChange}
                onBlur={handleIdBlur}
                className={`w-full rounded-2xl bg-slate-50 border py-3.5 px-4 font-body outline-none focus:ring-4 transition-all text-base ${idError || duplicateErrors.id_number ? 'border-primary focus:border-primary focus:ring-primary/10' : 'border-slate-200 focus:border-primary/50 focus:ring-primary/10'}`}
                required
              />
            </div>
            {(idError || duplicateErrors.id_number) && (
              <span className="text-[10px] font-black text-primary ml-1 block mt-1">
                {idError || duplicateErrors.id_number}
              </span>
            )}
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase text-gray-400 ml-1">Género</label>
            <CustomSelect
              value={formData.gender}
              onChange={(val) => setFormData({ ...formData, gender: val })}
              options={[
                { value: "Femenino", label: "Femenino" },
                { value: "Masculino", label: "Masculino" },
                { value: "Otro", label: "Otro" },
              ]}
              placeholder="Selecciona..."
              className="z-0"
            />
          </div>
        </div>

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
              placeholder="Ej. 414 123 4567"
              value={formData.phone}
              onChange={handlePhoneChange}
              onBlur={handlePhoneBlur}
              className={`w-full rounded-2xl bg-slate-50 border py-3.5 px-4 font-body outline-none focus:ring-4 transition-all text-base ${phoneError || duplicateErrors.phone ? 'border-primary focus:border-primary focus:ring-primary/10' : 'border-slate-200 focus:border-primary/50 focus:ring-primary/10'}`}
              required
            />
          </div>
          {(phoneError || duplicateErrors.phone) && (
            <span className="text-[10px] font-black text-primary ml-1 block mt-1">
              {phoneError || duplicateErrors.phone}
            </span>
          )}
        </div>

        <button
          type="submit"
          disabled={loading || Object.keys(duplicateErrors).length > 0}
          className="w-full bg-primary text-white py-4 md:py-5 rounded-2xl font-black shadow-xl shadow-primary/20 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 mt-6 text-lg tracking-wider uppercase"
        >
          {loading ? "Guardando..." : "Guardar Perfil ✨"}
        </button>
      </form>
    </div>
  );
};

"use client";

import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { X, Mail, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/lib/supabase";
import { ProfileForm } from "./ProfileForm";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const AuthModal = ({ isOpen, onClose, onSuccess }: AuthModalProps) => {
  const { signInWithGoogle, user } = useAuth();
  const [email, setEmail] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState("");
  const [view, setView] = useState<"login" | "otp" | "profile">("login");

  // Check if user has a profile after login
  React.useEffect(() => {
    if (user && isOpen) {
      checkUserProfile();
    }
  }, [user, isOpen]);

  const checkUserProfile = async () => {
    const { data, error } = await supabase
      .from("customers")
      .select("id")
      .eq("id", user?.id)
      .single();

    if (error || !data) {
      setView("profile");
    } else {
      handleComplete();
    }
  };

  const handleComplete = () => {
    if (onSuccess) onSuccess();
    onClose();
    // Reset view for next time
    setTimeout(() => {
      setView("login");
      setEmail("");
      setOtpCode("");
      setError("");
    }, 500);
  };

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSending(true);
    setError("");

    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
      });

      if (error) throw error;
      setView("otp");
    } catch (err: any) {
      console.error("Error sending email OTP:", err);
      const msg = err.message?.toLowerCase() || "";
      if (msg.includes("rate limit")) {
        setError("Has superado el límite de intentos. Espera 1 minuto o usa otro correo.");
      } else {
        setError("No pudimos enviar el código. Verifica el correo e intenta de nuevo.");
      }
    } finally {
      setIsSending(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSending(true);
    setError("");

    try {
      const { error } = await supabase.auth.verifyOtp({
        email,
        token: otpCode,
        type: "email",
      });

      if (error) throw error;
      // The useEffect will catch the user update and check profile
    } catch (err: any) {
      console.error("Error verifying OTP:", err);
      const msg = err.message?.toLowerCase() || "";
      if (msg.includes("invalid") || msg.includes("expired")) {
        setError("El código ingresado es incorrecto o ha expirado.");
      } else {
        setError("Hubo un error al verificar el código. Intenta de nuevo.");
      }
    } finally {
      setIsSending(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
          />
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className={`relative w-full overflow-hidden rounded-3xl bg-white shadow-2xl max-h-[90vh] flex flex-col ${view === "profile" ? "max-w-lg" : "max-w-md"}`}
          >
            {/* Header with brand color */}
            <div className="bg-primary p-8 text-center text-white">
              <button
                onClick={onClose}
                className="absolute right-4 top-4 rounded-full bg-white/20 p-2 transition-colors hover:bg-white/40"
              >
                <X size={20} />
              </button>
              <h2 className="font-display text-2xl uppercase tracking-wider">
                {view === "login" && "¡Hola, Amigo!"}
                {view === "otp" && "Revisa tu Correo"}
                {view === "profile" && "¡Bienvenido!"}
              </h2>
              <p className="mt-2 font-body opacity-90 text-sm">
                {view === "login" && "Inicia sesión para continuar con tu pedido."}
                {view === "otp" && `Ingresa el código que enviamos a ${email}`}
                {view === "profile" && "Por favor, completa tu perfil para continuar."}
              </p>
            </div>

            <div className="p-8 overflow-y-auto custom-scrollbar">
              {error && (
                <div className="mb-6 rounded-xl bg-red-50 p-4 text-xs font-medium text-red-500 border border-red-100">
                  {error}
                </div>
              )}

              <AnimatePresence mode="wait">
                {view === "login" && (
                  <motion.div
                    key="login"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="space-y-6"
                  >
                    {/* Email Form */}
                    <form onSubmit={handleEmailLogin} className="space-y-4">
                      <div className="relative">
                        <Mail
                          size={18}
                          className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                        />
                        <input
                          type="email"
                          placeholder="tucorreo@ejemplo.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="w-full rounded-2xl bg-gray-100 py-4 pl-12 pr-4 font-body outline-none ring-primary/30 transition-all focus:ring-2 focus:bg-white"
                          required
                        />
                      </div>
                      <button
                        type="submit"
                        disabled={isSending}
                        className="flex w-full items-center justify-center gap-3 rounded-2xl bg-primary py-4 font-body font-bold text-white shadow-lg shadow-primary/20 transition-all hover:opacity-90 active:scale-[0.98] disabled:opacity-50"
                      >
                        <Sparkles size={20} />
                        {isSending ? "Enviando código..." : "Enviar código"}
                      </button>
                    </form>

                    <div className="relative flex items-center justify-center py-2">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-100"></div>
                      </div>
                      <span className="relative bg-white px-4 text-[10px] font-black uppercase tracking-widest text-gray-400">
                        O
                      </span>
                    </div>

                    {/* Google Button */}
                    <form onSubmit={(e) => { e.preventDefault(); signInWithGoogle(); }}>
                      <button
                        type="submit"
                        className="flex w-full items-center justify-center gap-3 rounded-2xl border-2 border-gray-100 py-4 font-body font-medium transition-all hover:bg-gray-50 active:scale-[0.98] cursor-pointer"
                      >
                        <svg className="w-6 h-6" viewBox="0 0 24 24">
                          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.16v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.16C1.43 8.55 1 10.22 1 12s.43 3.45 1.16 4.93l3.68-2.84z" fill="#FBBC05" />
                          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.16 7.07l3.68 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                        </svg>
                        Continuar con Google
                      </button>
                    </form>
                  </motion.div>
                )}

                {view === "otp" && (
                  <motion.div
                    key="otp"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    <form onSubmit={handleVerifyOtp} className="space-y-6">
                      <input
                        type="text"
                        maxLength={6}
                        placeholder="0 0 0 0 0 0"
                        value={otpCode}
                        onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ""))}
                        className="w-full text-center text-3xl tracking-[0.5em] font-numbers rounded-2xl bg-gray-200 py-6 outline-none ring-primary/30 transition-all focus:ring-2"
                        required
                      />
                      <button
                        type="submit"
                        disabled={isSending || otpCode.length < 6}
                        className="flex w-full items-center justify-center gap-3 rounded-2xl bg-primary py-4 font-body font-bold text-white shadow-lg shadow-primary/20 transition-all hover:opacity-90 active:scale-[0.98] disabled:opacity-50"
                      >
                        {isSending ? "Verificando..." : "Verificar Código"}
                      </button>
                    </form>
                    <button
                      onClick={() => setView("login")}
                      className="w-full text-center text-sm font-body text-gray-400 hover:text-primary transition-colors"
                    >
                      ¿Correo incorrecto? Volver atrás
                    </button>
                  </motion.div>
                )}

                {view === "profile" && (
                  <motion.div
                    key="profile"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <ProfileForm onComplete={handleComplete} />
                  </motion.div>
                )}
              </AnimatePresence>

              <p className="mt-8 text-center text-[10px] text-gray-400 font-body uppercase tracking-widest">
                Dolce Candy Boutique © 2026
              </p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

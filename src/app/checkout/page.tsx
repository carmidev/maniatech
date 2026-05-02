"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, CheckCircle, Upload, CreditCard, Copy, ChevronRight, Truck, Store, Wallet, MapPin, Smartphone, MessageCircle } from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase";
import { ProfileForm } from "@/components/ProfileForm";
import { CountryCodeSelect } from "@/components/CountryCodeSelect";

type DeliveryMethod = "delivery" | "pickup";
type PaymentMethod = "pm" | "card";
type AuthView = "login" | "otp" | "profile" | null;

export default function CheckoutPage() {
  const router = useRouter();
  const { totalPrice, clearCart } = useCart();
  const { user, loading: authLoading, loginWithWhatsApp, verifyOtp, signInWithGoogle } = useAuth();
  
  // Navigation & Checkout States
  const [step, setStep] = useState(1);
  const [deliveryMethod, setDeliveryMethod] = useState<DeliveryMethod>("delivery");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("pm");
  const [address, setAddress] = useState("");
  const [isCheckingProfile, setIsCheckingProfile] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);
  const [isProcessingRedirect, setIsProcessingRedirect] = useState(false);

  // Auth States
  const [authView, setAuthView] = useState<AuthView>(null);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [countryCode, setCountryCode] = useState("+58");
  const [otpCode, setOtpCode] = useState("");
  const [authError, setAuthError] = useState("");
  const [isSending, setIsSending] = useState(false);

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopied(type);
    setTimeout(() => setCopied(null), 2000);
  };

  const handleFinish = () => {
    clearCart();
    router.push('/');
  };

  const nextStep = () => setStep(prev => prev + 1);
  const prevStep = () => setStep(prev => prev - 1);

  const handleStep1Next = async () => {
    if (!user) {
      setAuthView("login");
    } else {
      setIsCheckingProfile(true);
      try {
        const { data, error } = await supabase
          .from("customers")
          .select("id")
          .eq("id", user.id)
          .single();

        if (error || !data) {
          setAuthView("profile");
        } else {
          nextStep();
        }
      } catch (err) {
        console.error("Error checking profile:", err);
      } finally {
        setIsCheckingProfile(false);
      }
    }
  };

  // Auth Handlers
  const handleWhatsAppLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSending(true);
    setAuthError("");
    try {
      const fullPhone = `+${countryCode.replace(/\D/g, "")}${phoneNumber.replace(/\D/g, "")}`;
      await loginWithWhatsApp(fullPhone);
      setAuthView("otp");
    } catch (err: any) {
      console.error("Error logging in:", err);
      setAuthError("No pudimos enviar el código. Verifica el número e intenta de nuevo.");
    } finally {
      setIsSending(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSending(true);
    setAuthError("");
    try {
      const fullPhone = `+${countryCode.replace(/\D/g, "")}${phoneNumber.replace(/\D/g, "")}`;
      const { user } = await verifyOtp(fullPhone, otpCode);
      const { data } = await supabase.from("customers").select("id").eq("id", user?.id).single();
      
      if (!data) {
        setAuthView("profile");
      } else {
        setAuthView(null);
        nextStep();
      }
    } catch (err: any) {
      console.error("Error verifying OTP:", err);
      setAuthError("El código ingresado es incorrecto o ha expirado.");
    } finally {
      setIsSending(false);
    }
  };

  const handleProfileComplete = () => {
    setAuthView(null);
    nextStep();
  };

  // If user navigated directly here, ensure we clear authView on mount if they have profile
  useEffect(() => {
    if (user && authView === "login") {
      handleStep1Next();
    }
  }, [user]);

  // Check for redirect flag synchronously on mount to show loader immediately
  useEffect(() => {
    if (localStorage.getItem("open_checkout") === "true") {
      setIsProcessingRedirect(true);
    }
  }, []);

  // Handle auto-open logic from OAuth redirect
  useEffect(() => {
    const shouldOpenCheckout = localStorage.getItem("open_checkout");
    if (shouldOpenCheckout === "true") {
      if (!authLoading) {
        localStorage.removeItem("open_checkout");
        if (user) {
          handleStep1Next().then(() => {
            setIsProcessingRedirect(false);
          });
        } else {
          setIsProcessingRedirect(false);
        }
      }
    }
  }, [user, authLoading]);

  if (authLoading || isProcessingRedirect) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4">
        <motion.div
          animate={{ 
            scale: [1, 1.1, 1],
            rotate: [0, 5, -5, 0]
          }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="w-24 h-24 rounded-[2rem] bg-brand-cream/50 flex items-center justify-center mb-8 shadow-xl shadow-brand-cream/20"
        >
          <span className="text-5xl">🍭</span>
        </motion.div>
        <h1 className="font-display text-2xl uppercase tracking-wider text-primary mb-3 text-center">
          Verificando tu Dulce Sesión...
        </h1>
        <div className="flex gap-3">
          {[0, 0.2, 0.4].map((delay) => (
            <motion.div
              key={delay}
              animate={{ y: [0, -12, 0] }}
              transition={{ duration: 1, repeat: Infinity, delay }}
              className="w-3 h-3 rounded-full bg-primary"
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      {/* Left Side: Summary */}
      <div className="bg-primary p-8 md:p-12 text-white md:w-5/12 flex flex-col justify-between relative overflow-hidden">
        <div className="relative z-10">
          <button onClick={() => router.back()} className="mb-8 hover:bg-white/10 p-2 rounded-full inline-flex transition-colors">
            <X className="w-6 h-6" />
          </button>
          <h2 className="text-4xl md:text-5xl font-black mb-2 font-script">Tu Pedido</h2>
          <p className="text-white/80 text-sm md:text-base">Casi terminamos de preparar tu magia dulce.</p>
        </div>
        
        <div className="space-y-4 relative z-10 mt-12 md:mt-0">
          <div className="bg-white/10 p-6 rounded-3xl backdrop-blur-md border border-white/20">
            <p className="text-xs text-white/60 mb-1 uppercase tracking-widest font-body font-bold">Total a pagar</p>
            <p className="text-5xl font-numbers font-semibold">{totalPrice.toFixed(2)} €</p>
            <p className="text-[10px] text-white/40 mt-2 leading-tight">Monto sujeto a tasa oficial BCV del día.</p>
          </div>
          
          {(step > 1 && !authView) && (
            <div className="text-xs space-y-2 bg-black/10 p-5 rounded-3xl border border-white/5">
              <p className="flex justify-between items-center"><span className="text-white/60 uppercase font-bold tracking-wider text-[10px]">Método de Entrega:</span> <span className="font-bold uppercase text-sm">{deliveryMethod}</span></p>
              {step > 2 && <p className="flex justify-between items-center pt-2 border-t border-white/10"><span className="text-white/60 uppercase font-bold tracking-wider text-[10px]">Método de Pago:</span> <span className="font-bold uppercase text-sm">{paymentMethod === 'pm' ? 'Pago Móvil' : 'Tarjeta'}</span></p>}
            </div>
          )}
        </div>

        <div className="text-xs text-white/50 relative z-10 mt-12 hidden md:block">
          <p>© 2026 Dolce Candy Boutique</p>
        </div>

        {/* Decorative circle */}
        <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
      </div>

      {/* Right Side: Flow Content */}
      <div className="flex-1 p-6 md:p-12 bg-white relative flex flex-col justify-center items-center min-h-[60vh] md:min-h-0">
        <div className="w-full max-w-xl mx-auto">
          <AnimatePresence mode="wait">
            
            {/* --- AUTH FLOW --- */}
            {authView && (
              <motion.div
                key="auth-flow"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="w-full"
              >
                <div className="text-center mb-8">
                  <h2 className="font-cocogoose-titles text-3xl md:text-4xl uppercase tracking-tight text-brand-darkgray">
                    {authView === "login" && "¡Hola, Dulce Amigo!"}
                    {authView === "otp" && "Verifica tu WhatsApp"}
                    {authView === "profile" && "¡Bienvenido!"}
                  </h2>
                  <p className="mt-2 font-inter-display opacity-80 text-sm md:text-base text-gray-500">
                    {authView === "login" && "Inicia sesión para continuar con tu pedido."}
                    {authView === "otp" && `Ingresa el código que enviamos al +58 ${phoneNumber}`}
                    {authView === "profile" && "Por favor, completa tu perfil para continuar."}
                  </p>
                </div>

                {authError && (
                  <div className="mb-6 rounded-xl bg-red-50 p-4 text-xs font-medium text-red-500 border border-red-100">
                    {authError}
                  </div>
                )}

                {authView === "login" && (
                  <div className="space-y-6 max-w-md mx-auto">
                    <form onSubmit={handleWhatsAppLogin} className="space-y-4">
                      <div className="flex gap-2 relative">
                        <CountryCodeSelect
                          value={countryCode}
                          onChange={setCountryCode}
                          className="w-[120px]"
                        />
                        <input
                          type="tel"
                          placeholder="Número de teléfono"
                          value={phoneNumber}
                          onChange={(e) => setPhoneNumber(e.target.value)}
                          className="w-full rounded-2xl bg-slate-50 border border-slate-200 py-4 font-inter-display px-5 outline-none focus:border-primary/50 focus:ring-4 focus:ring-primary/10 transition-all text-lg"
                          required
                        />
                      </div>
                      <button
                        type="submit"
                        disabled={isSending}
                        className="flex w-full items-center justify-center gap-3 rounded-2xl bg-[#25D366] py-4 font-inter-display font-bold text-white shadow-xl shadow-[#25D366]/20 transition-all hover:bg-[#20ba5a] active:scale-[0.98] disabled:opacity-50 text-lg"
                      >
                        <MessageCircle size={24} />
                        {isSending ? "Enviando..." : "Enviar código por WhatsApp"}
                      </button>
                    </form>

                    <div className="relative flex items-center justify-center py-4">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-100"></div>
                      </div>
                      <span className="relative bg-white px-4 text-xs font-black uppercase tracking-widest text-gray-400">
                        O
                      </span>
                    </div>

                    <button
                      onClick={signInWithGoogle}
                      className="flex w-full items-center justify-center gap-3 rounded-2xl border-2 border-gray-100 py-4 font-inter-display font-bold text-gray-700 transition-all hover:bg-gray-50 active:scale-[0.98] text-lg"
                    >
                      <svg className="w-6 h-6" viewBox="0 0 24 24">
                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.16v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.16C1.43 8.55 1 10.22 1 12s.43 3.45 1.16 4.93l3.68-2.84z" fill="#FBBC05" />
                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.16 7.07l3.68 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                      </svg>
                      Continuar con Google
                    </button>
                    
                    <button onClick={() => setAuthView(null)} className="w-full text-center mt-6 text-sm text-gray-400 font-bold uppercase hover:text-gray-600 transition-colors">
                      Volver atrás
                    </button>
                  </div>
                )}

                {authView === "otp" && (
                  <div className="space-y-6 max-w-md mx-auto">
                    <form onSubmit={handleVerifyOtp} className="space-y-6">
                      <input
                        type="text"
                        maxLength={6}
                        placeholder="0 0 0 0 0 0"
                        value={otpCode}
                        onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ""))}
                        className="w-full text-center text-4xl tracking-[0.5em] font-cocogoose-titles rounded-2xl bg-slate-50 border border-slate-200 py-6 outline-none focus:border-primary/50 focus:ring-4 focus:ring-primary/10 transition-all"
                        required
                      />
                      <button
                        type="submit"
                        disabled={isSending || otpCode.length < 6}
                        className="flex w-full items-center justify-center gap-3 rounded-2xl bg-primary py-4 font-inter-display font-bold text-white shadow-xl shadow-primary/20 transition-all hover:opacity-90 active:scale-[0.98] disabled:opacity-50 text-lg"
                      >
                        {isSending ? "Verificando..." : "Verificar Código"}
                      </button>
                    </form>
                    <button
                      onClick={() => setAuthView("login")}
                      className="w-full text-center text-sm font-inter-display text-gray-400 hover:text-primary transition-colors font-medium"
                    >
                      ¿Número incorrecto? Volver atrás
                    </button>
                  </div>
                )}

                {authView === "profile" && (
                  <ProfileForm onComplete={handleProfileComplete} />
                )}
              </motion.div>
            )}

            {/* --- CHECKOUT FLOW --- */}
            {!authView && step === 1 && (
              <motion.div key="step-1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8 w-full">
                <div className="space-y-2">
                  <h3 className="text-3xl md:text-4xl font-display text-brand-darkgray leading-tight">¿Cómo lo recibes?</h3>
                  <p className="text-brand-darkgray/60 font-body font-normal text-base">Selecciona tu método de entrega preferido.</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <button 
                    onClick={() => setDeliveryMethod("delivery")}
                    className={`p-8 rounded-3xl border-2 transition-all flex flex-col items-center gap-4 ${deliveryMethod === 'delivery' ? 'border-primary bg-primary/5 text-primary shadow-lg shadow-primary/10 scale-[1.02]' : 'border-slate-100 hover:border-slate-200 text-slate-400 bg-slate-50 hover:bg-slate-100'}`}
                  >
                    <Truck className="w-10 h-10" />
                    <span className="font-bold text-base uppercase tracking-wider">Delivery</span>
                  </button>
                  <button 
                    onClick={() => setDeliveryMethod("pickup")}
                    className={`p-8 rounded-3xl border-2 transition-all flex flex-col items-center gap-4 ${deliveryMethod === 'pickup' ? 'border-primary bg-primary/5 text-primary shadow-lg shadow-primary/10 scale-[1.02]' : 'border-slate-100 hover:border-slate-200 text-slate-400 bg-slate-50 hover:bg-slate-100'}`}
                  >
                    <Store className="w-10 h-10" />
                    <span className="font-bold text-base uppercase tracking-wider">Pickup</span>
                  </button>
                </div>

                {deliveryMethod === 'delivery' ? (
                  <div className="space-y-3 pt-4">
                    <label className="text-xs font-black uppercase tracking-wider text-slate-400 flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-primary" /> Dirección de Entrega
                    </label>
                    <textarea 
                      placeholder="Escribe tu dirección exacta (Urbanización, calle, edificio/casa, punto de referencia)..."
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="w-full p-6 rounded-2xl bg-slate-50 border border-slate-100 focus:border-primary/50 focus:ring-4 focus:ring-primary/10 outline-none transition-all font-medium text-base min-h-[120px] resize-none"
                    />
                  </div>
                ) : (
                  <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 pt-4 mt-4">
                    <p className="text-base font-bold text-slate-700 mb-2 flex items-center gap-2"><MapPin className="w-5 h-5 text-primary" /> Tienda Campo Claro</p>
                    <p className="text-sm text-slate-500 leading-relaxed">Av. Principal de Campo Claro, Edif. Dolce Candy. Caracas.</p>
                    <p className="text-xs text-primary font-black mt-4 uppercase tracking-wider">Horario: 8AM - 6PM</p>
                  </div>
                )}

                <button 
                  onClick={handleStep1Next}
                  disabled={(deliveryMethod === 'delivery' && address.length < 10) || isCheckingProfile}
                  className="w-full bg-brand-red text-white py-5 rounded-full font-black text-lg flex items-center justify-center gap-2 shadow-xl shadow-brand-red/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:scale-100 mt-8"
                >
                  {isCheckingProfile ? "Cargando..." : (
                    <>Continuar al Pago <ChevronRight className="w-6 h-6" /></>
                  )}
                </button>
              </motion.div>
            )}

            {!authView && step === 2 && (
              <motion.div key="step-2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8 w-full">
                <div className="space-y-2">
                  <h3 className="text-3xl md:text-4xl font-black text-slate-800 leading-tight">Método de Pago</h3>
                  <p className="text-slate-400 text-base">Elige cómo deseas pagar tu pedido.</p>
                </div>

                <div className="space-y-4">
                  <button 
                    onClick={() => setPaymentMethod("pm")}
                    className={`w-full p-6 rounded-3xl border-2 transition-all flex items-center gap-5 ${paymentMethod === 'pm' ? 'border-primary bg-primary/5 shadow-lg shadow-primary/10' : 'border-slate-100 hover:border-slate-200 bg-slate-50'}`}
                  >
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${paymentMethod === 'pm' ? 'bg-primary text-white shadow-md' : 'bg-white text-slate-400 shadow-sm border border-slate-100'}`}>
                      <Smartphone className="w-7 h-7" />
                    </div>
                    <div className="text-left">
                      <p className={`font-black text-lg ${paymentMethod === 'pm' ? 'text-primary' : 'text-slate-600'}`}>Pago Móvil</p>
                      <p className="text-[11px] text-slate-400 uppercase tracking-widest font-bold mt-1">Bolívares (Tasa BCV)</p>
                    </div>
                  </button>

                  <button 
                    onClick={() => setPaymentMethod("card")}
                    className={`w-full p-6 rounded-3xl border-2 transition-all flex items-center gap-5 ${paymentMethod === 'card' ? 'border-primary bg-primary/5 shadow-lg shadow-primary/10' : 'border-slate-100 hover:border-slate-200 bg-slate-50'}`}
                  >
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${paymentMethod === 'card' ? 'bg-primary text-white shadow-md' : 'bg-white text-slate-400 shadow-sm border border-slate-100'}`}>
                      <CreditCard className="w-7 h-7" />
                    </div>
                    <div className="text-left">
                      <p className={`font-black text-lg ${paymentMethod === 'card' ? 'text-primary' : 'text-slate-600'}`}>Tarjeta / Débito</p>
                      <p className="text-[11px] text-slate-400 uppercase tracking-widest font-bold mt-1">Internacional / Nacional</p>
                    </div>
                  </button>
                </div>

                <div className="flex gap-4 pt-8">
                  <button onClick={prevStep} className="flex-1 py-5 font-black text-slate-400 hover:text-slate-600 transition-colors uppercase tracking-wider text-sm bg-slate-100 hover:bg-slate-200 rounded-full">Atrás</button>
                  <button 
                    onClick={nextStep}
                    className="flex-[2] bg-brand-red text-white py-5 rounded-full font-black text-lg flex items-center justify-center gap-2 shadow-xl shadow-brand-red/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
                  >
                    Siguiente <ChevronRight className="w-6 h-6" />
                  </button>
                </div>
              </motion.div>
            )}

            {!authView && step === 3 && (
              <motion.div key="step-3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8 w-full">
                {paymentMethod === 'pm' ? (
                  <div className="space-y-8">
                    <div className="space-y-2">
                      <h3 className="text-3xl md:text-4xl font-black text-slate-800 flex items-center gap-3 leading-tight"><Smartphone className="w-8 h-8 text-primary" /> Datos de Pago</h3>
                      <p className="text-slate-400 text-base">Realiza el pago y sube el comprobante.</p>
                    </div>

                    <div className="bg-slate-50 p-8 rounded-3xl border border-slate-100 space-y-6 shadow-sm">
                      <div className="flex justify-between items-center group">
                        <div><p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-1">Banco</p><p className="font-black text-slate-700 text-lg">0134 - Banesco</p></div>
                        <Copy className="w-5 h-5 text-slate-300 cursor-pointer hover:text-primary transition-colors" onClick={() => copyToClipboard('0134', 'bnk')} />
                      </div>
                      <div className="flex justify-between items-center group">
                        <div><p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-1">Teléfono</p><p className="font-black text-slate-700 text-lg">0412-1234567</p></div>
                        <Copy className="w-5 h-5 text-slate-300 cursor-pointer hover:text-primary transition-colors" onClick={() => copyToClipboard('04121234567', 'tel')} />
                      </div>
                      <div className="flex justify-between items-center group">
                        <div><p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-1">Cédula</p><p className="font-black text-slate-700 text-lg">V-12.345.678</p></div>
                        <Copy className="w-5 h-5 text-slate-300 cursor-pointer hover:text-primary transition-colors" onClick={() => copyToClipboard('12345678', 'ci')} />
                      </div>
                      <AnimatePresence>
                        {copied && (
                           <motion.p initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="text-center text-[10px] font-black text-green-500 uppercase tracking-widest pt-2 border-t border-slate-200">¡Copiado al portapapeles!</motion.p>
                        )}
                      </AnimatePresence>
                    </div>

                    <div className="border-4 border-dashed border-slate-200 rounded-3xl p-10 flex flex-col items-center justify-center text-center hover:bg-slate-50 hover:border-primary/30 transition-colors cursor-pointer group">
                      <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                        <Upload className="w-10 h-10 text-primary" />
                      </div>
                      <p className="font-black text-lg text-slate-700 mb-1">Subir Captura</p>
                      <p className="text-xs text-slate-400 font-medium">Formato JPG o PNG</p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-8">
                    <div className="space-y-2">
                      <h3 className="text-3xl md:text-4xl font-black text-slate-800 flex items-center gap-3 leading-tight"><CreditCard className="w-8 h-8 text-primary" /> Tarjeta</h3>
                      <p className="text-slate-400 text-base">Introduce los datos de tu tarjeta.</p>
                    </div>

                    <div className="space-y-5">
                      <div className="space-y-2">
                         <label className="text-xs font-black uppercase text-slate-400 tracking-wider">Número de Tarjeta</label>
                         <div className="relative">
                           <input type="text" placeholder="0000 0000 0000 0000" className="w-full p-5 rounded-2xl bg-slate-50 border border-slate-200 outline-none focus:border-primary/50 focus:ring-4 focus:ring-primary/10 transition-all font-mono text-lg" />
                           <div className="absolute right-5 top-1/2 -translate-y-1/2 flex gap-1">
                             <div className="w-8 h-5 bg-orange-400 rounded-md" />
                             <div className="w-8 h-5 bg-red-400 rounded-md -ml-3 mix-blend-multiply" />
                           </div>
                         </div>
                      </div>
                      <div className="grid grid-cols-2 gap-5">
                        <div className="space-y-2">
                           <label className="text-xs font-black uppercase text-slate-400 tracking-wider">Vencimiento</label>
                           <input type="text" placeholder="MM/YY" className="w-full p-5 rounded-2xl bg-slate-50 border border-slate-200 outline-none focus:border-primary/50 transition-all text-lg text-center" />
                        </div>
                        <div className="space-y-2">
                           <label className="text-xs font-black uppercase text-slate-400 tracking-wider">CVC</label>
                           <input type="password" placeholder="***" className="w-full p-5 rounded-2xl bg-slate-50 border border-slate-200 outline-none focus:border-primary/50 transition-all text-lg text-center tracking-[0.2em]" />
                        </div>
                      </div>
                    </div>

                    <div className="bg-blue-50/50 p-5 rounded-2xl flex gap-4 items-start border border-blue-100">
                      <Wallet className="w-5 h-5 text-blue-500 mt-0.5 shrink-0" />
                      <p className="text-xs text-blue-800 font-medium leading-relaxed">Tus datos están protegidos con encriptación de grado bancario (Simulado).</p>
                    </div>
                  </div>
                )}

                <div className="flex gap-4 pt-6">
                  <button onClick={prevStep} className="flex-1 py-5 font-black text-slate-400 hover:text-slate-600 transition-colors uppercase tracking-wider text-sm bg-slate-100 hover:bg-slate-200 rounded-full">Atrás</button>
                  <button 
                    onClick={nextStep}
                    className="flex-[2] bg-brand-red text-white py-5 rounded-full font-black text-lg flex items-center justify-center gap-2 shadow-xl shadow-brand-red/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
                  >
                    Confirmar Pedido <CheckCircle className="w-6 h-6" />
                  </button>
                </div>
              </motion.div>
            )}

            {!authView && step === 4 && (
              <motion.div key="step-4" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="h-full flex flex-col items-center justify-center text-center py-12 w-full">
                <motion.div
                  initial={{ scale: 0, rotate: -20 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: "spring", bounce: 0.5 }}
                  className="w-40 h-40 bg-green-100 rounded-full flex items-center justify-center mb-10 shadow-inner"
                >
                  <CheckCircle className="w-20 h-20 text-green-500" />
                </motion.div>
                <h3 className="text-4xl md:text-5xl font-display mb-4 text-brand-darkgray leading-tight">¡Pedido Recibido! ✨</h3>
                <p className="text-slate-500 mb-12 max-w-sm text-base leading-relaxed">
                  {deliveryMethod === 'delivery' 
                    ? "Estamos preparando tus dulces. Pulsa abajo para enviar el reporte de pago por WhatsApp y que despachemos."
                    : "Tu pedido estará listo para retirar en tienda una vez envíes el comprobante por WhatsApp."}
                </p>
                
                <button 
                  onClick={() => {
                    const whatsappNumber = "584142403001";
                    const orderSummary = `¡Hola Dolce Candy! 🍭\n\n🎯 *Resumen de mi Pedido*\n━━━━━━━━━━━━━━\n💰 *Total:* ${totalPrice.toFixed(2)} €\n🚚 *Entrega:* ${deliveryMethod === 'delivery' ? `Delivery a: ${address}` : 'Pickup en Tienda'}\n💳 *Pago:* ${paymentMethod === 'pm' ? 'Pago Móvil' : 'Tarjeta'}\n\n✨ Adjunto mi comprobante abajo. ¡Gracias!`;
                    const encodedMsg = encodeURIComponent(orderSummary);
                    window.open(`https://wa.me/${whatsappNumber}?text=${encodedMsg}`, "_blank");
                    handleFinish();
                  }}
                  className="bg-[#25D366] text-white px-10 md:px-14 py-6 rounded-full font-black text-lg shadow-2xl shadow-[#25D366]/30 flex items-center gap-3 hover:scale-105 active:scale-95 transition-all w-full md:w-auto"
                >
                  <MessageCircle className="w-7 h-7 fill-current" />
                  Enviar por WhatsApp
                </button>
              </motion.div>
            )}
            
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

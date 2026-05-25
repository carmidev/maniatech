"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, CheckCircle, Upload, CreditCard, Copy, ChevronRight, ChevronDown, Truck, Store, Wallet, MapPin, Smartphone, Mail, Sparkles, User, Clock, Navigation, Map, MessageCircle } from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import dynamic from "next/dynamic";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase";
import { getImagePath } from "@/utils/imagePath";

// Carga dinámica de componentes pesados para agilizar la navegación inicial
const ProfileForm = dynamic(() => import("@/components/ProfileForm").then(mod => mod.ProfileForm), { 
  loading: () => <div className="h-40 flex items-center justify-center font-bold text-primary animate-pulse uppercase tracking-widest text-xs">Cargando Formulario...</div>,
  ssr: false 
});

const MapSelector = dynamic(() => import("@/components/MapSelector").then(mod => mod.MapSelector), { 
  loading: () => <div className="h-60 bg-slate-50 rounded-3xl flex items-center justify-center font-bold text-primary animate-pulse uppercase tracking-widest text-xs">Cargando Mapa...</div>,
  ssr: false 
});

type DeliveryMethod = "delivery" | "pickup";
type Address = {
  id: string;
  formatted_address: string;
  lat: number;
  lng: number;
  label?: string;
  reference_point?: string;
  unit?: string;
  zone?: string;
};
type PaymentMethod = "zelle" | "pm" | "cash" | "paypal";
type AuthView = "login" | "otp" | "profile" | null;

export default function CheckoutPage() {
  const router = useRouter();
  const { items, totalPrice, clearCart } = useCart();
  const { user, loading: authLoading, signInWithGoogle } = useAuth();

  // Navigation & Checkout States
  const [step, setStep] = useState(1);
  const [deliveryMethod, setDeliveryMethod] = useState<DeliveryMethod>("delivery");
  const [pickupStore, setPickupStore] = useState<string>("campoclaro");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("zelle");
  const [paymentHolder, setPaymentHolder] = useState("");
  const [paymentReference, setPaymentReference] = useState("");
  const [cashAmount, setCashAmount] = useState("");
  const [isExactCash, setIsExactCash] = useState(false);
  const [receiptFile, setReceiptFile] = useState<File | null>(null);
  const [receiptUrl, setReceiptUrl] = useState<string | null>(null);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPaymentDropdownOpen, setIsPaymentDropdownOpen] = useState(false);
  const [address, setAddress] = useState(""); // Current selected address string
  const [referencePoint, setReferencePoint] = useState(""); // Nuevo: Punto de referencia
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
  const [showMap, setShowMap] = useState(false);
  const [mapAutoLocate, setMapAutoLocate] = useState(false);
  const [isCheckingProfile, setIsCheckingProfile] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);
  const [isProcessingRedirect, setIsProcessingRedirect] = useState(false);
  const [isScheduledOrder, setIsScheduledOrder] = useState(false);
  const [bcvRate, setBcvRate] = useState<number | null>(null);
  const [isFetchingRate, setIsFetchingRate] = useState(true);
  const [resendTimer, setResendTimer] = useState(0);

  // Carga de datos inicial
  useEffect(() => {
    const fetchBcvRate = async () => {
      try {
        const res = await fetch('https://ve.dolarapi.com/v1/euros/oficial', {
          headers: { 'Accept': 'application/json' }
        });
        const data = await res.json();
        if (data && data.promedio) {
          setBcvRate(parseFloat(data.promedio));
        } else {
          setBcvRate(36.50); // Fallback seguro
        }
      } catch (err) {
        console.error("Error al obtener la tasa:", err);
        setBcvRate(36.50); // Fallback en caso de error de red
      } finally {
        setIsFetchingRate(false);
      }
    };
    fetchBcvRate();

    const fetchCustomerData = async () => {
      if (user) {
        const { data, error } = await supabase
          .from("customers")
          .select("*")
          .eq("id", user.id)
          .maybeSingle();

        if (data) {
          setCustomerProfile(data);
          setHasProfile(true);
          if (data.first_name) setFirstName(data.first_name);
          if (data.address) {
            try {
              const parsed = JSON.parse(data.address);
              setAddresses(parsed);
              if (parsed.length > 0) {
                setSelectedAddressId(prev => prev ? prev : parsed[0].id);
                setAddress(prev => prev ? prev : parsed[0].formatted_address);
                setReferencePoint(prev => prev || (parsed[0].reference_point || ""));
              }
            } catch (e) {
              console.error("Error parsing address JSON:", e);
            }
          }
        }
      }
    };
    fetchCustomerData();
  }, [user]);

  // Horario States & Logic
  const checkIfStoreIsOpen = () => {
    // Sincronización exacta con la hora de Caracas (UTC-4)
    const caracasString = new Date().toLocaleString("en-US", {timeZone: "America/Caracas"});
    const caracasTime = new Date(caracasString);
    const day = caracasTime.getDay(); // 0 = Dom, 1 = Lun, ..., 6 = Sab
    const hour = caracasTime.getHours();

    let storeToEval = pickupStore;
    if (deliveryMethod === 'delivery') {
      storeToEval = 'elbosque'; // Asumimos el horario más amplio para Delivery por defecto
    }

    if (storeToEval === 'campoclaro') {
      if (day >= 1 && day <= 5) return hour >= 8 && hour < 18; // Lun-Vier 8:00 AM - 6:00 PM
      if (day === 6) return hour >= 10 && hour < 16; // Sab 10:00 AM - 4:00 PM
      return false; // Dom Cerrado
    } else {
      // El Bosque
      if (day >= 1 && day <= 5) return hour >= 9 && hour < 19; // Lun-Vier 9:00 AM - 7:00 PM
      if (day === 6) return hour >= 10 && hour < 18; // Sab 10:00 AM - 6:00 PM
      if (day === 0) return hour >= 12 && hour < 18; // Dom 12:00 PM - 6:00 PM
      return false;
    }
  };

  // Auth States
  const [authView, setAuthView] = useState<AuthView>(null);
  const [email, setEmail] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [authError, setAuthError] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [hasProfile, setHasProfile] = useState(false);
  const [createdOrderId, setCreatedOrderId] = useState<number | string | null>(null);
  const [firstName, setFirstName] = useState("");
  const [customerProfile, setCustomerProfile] = useState<any>(null);

  // Resend Timer Logic
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (authView === "otp" && resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [authView, resendTimer]);

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopied(type);
    setTimeout(() => setCopied(null), 2000);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setHasProfile(false);
    setCustomerProfile(null);
    setFirstName("");
    setAddresses([]);
    setSelectedAddressId(null);
    setAddress("");
    setStep(1);
    setAuthView("login");
  };

  const nextStep = () => setStep(prev => prev + 1);
  const prevStep = () => setStep(prev => prev - 1);

  const handleConfirmOrder = async () => {
    setPaymentError(null);

    // Validación según método
    if (paymentMethod === 'zelle' || paymentMethod === 'paypal') {
      if (!paymentHolder.trim()) return setPaymentError("Por favor, ingresa el titular de la cuenta.");
      if (!paymentReference.trim() && !receiptFile) return setPaymentError("Debes ingresar el número de referencia o subir una captura.");
    }
    if (paymentMethod === 'pm') {
      if (!paymentReference.trim() && !receiptFile) return setPaymentError("Debes ingresar los últimos 4 dígitos de la referencia o subir una captura.");
    }
    if (paymentMethod === 'cash') {
      if (!cashAmount || parseFloat(cashAmount) <= 0) return setPaymentError("Por favor, ingresa el monto a entregar.");
      if (!receiptFile) return setPaymentError("Debes subir una foto de los billetes.");
    }

    setIsSubmitting(true);
    let uploadedUrl = null;

    try {
      if (receiptFile) {
        const fileExt = receiptFile.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
        const filePath = `${user?.id || 'guest'}/${fileName}`;
        
        const { error: uploadError } = await supabase.storage
          .from('payment_receipts')
          .upload(filePath, receiptFile);

        if (uploadError) throw uploadError;

        const { data: publicUrlData } = supabase.storage
          .from('payment_receipts')
          .getPublicUrl(filePath);

        uploadedUrl = publicUrlData.publicUrl;
        setReceiptUrl(uploadedUrl);
      }

      const finalItems = [...items];
      const deliveryCost = deliveryMethod === 'delivery' ? 5 : 0;
      
      if (deliveryCost > 0) {
        finalItems.push({
          product: { id: 'delivery', name: 'Costo de Envío / Delivery', price: deliveryCost, images: [], description: 'Tarifa de entrega' },
          quantity: 1,
          price: deliveryCost,
          subtotal: deliveryCost
        } as any);
      }

      const orderData = {
        user_id: user?.id || null,
        customer_name: (hasProfile && customerProfile) 
          ? `${customerProfile.first_name} ${customerProfile.last_name}`.trim() 
          : (firstName || user?.phone || 'Invitado'),
        customer_email: user?.email || 'no-email@dolce.com',
        customer_phone: customerProfile?.phone || user?.phone || null,
        items: finalItems,
        total_amount: totalPrice + deliveryCost,
        delivery_method: deliveryMethod.toUpperCase(),
        delivery_address: deliveryMethod === 'delivery' ? (
          (() => {
            const selectedAddr = addresses.find(a => a.id === selectedAddressId);
            const isNational = selectedAddr?.zone === 'NATIONAL';
            const prefix = isNational ? '[MRW] ' : '';
            if (selectedAddr) {
              return `${prefix}${selectedAddr.formatted_address}${selectedAddr.unit ? `\nInmueble: ${selectedAddr.unit}` : ''}${referencePoint ? `\nRef: ${referencePoint}` : ''}\nMapa: https://www.google.com/maps/search/?api=1&query=${selectedAddr.lat},${selectedAddr.lng}`;
            }
            return address;
          })()
        ) : null,
        pickup_store: deliveryMethod === 'pickup' 
          ? (pickupStore === 'campoclaro' ? 'Dolce Candy Campo Claro' : 'Dolce Candy El Bosque')
          : null,
        payment_method: paymentMethod,
        payment_holder: paymentHolder || null,
        payment_reference: paymentReference || null,
        payment_cash_amount: cashAmount ? parseFloat(cashAmount) : null,
        payment_receipt_url: uploadedUrl,
        admin_notes: null
      };

      const { createOrderAndDeductInventory } = await import('./actions');
      const result = await createOrderAndDeductInventory(orderData, items);
      
      if (!result.success) {
        throw new Error(result.error);
      }

      setCreatedOrderId(result.order?.id || "N/A");

      setIsSubmitting(false);
      nextStep();
    } catch (err: any) {
      console.error("Checkout Error:", err);
      const errorMessage = err.message || (typeof err === 'object' ? JSON.stringify(err) : String(err));
      setPaymentError(`Error al guardar el pedido: ${errorMessage}`);
      setIsSubmitting(false);
    }
  };

  const handleFinish = () => {
    clearCart();
    router.push('/catalogo');
  };

  const handleStep1Next = async () => {
    const isOpen = checkIfStoreIsOpen();
    setIsScheduledOrder(!isOpen);

    if (!user) {
      setAuthView("login");
    } else if (hasProfile) {
      if (deliveryMethod === "pickup") {
        setStep(3);
      } else {
        nextStep();
      }
    } else {
      setIsCheckingProfile(true);
      try {
        // Búsqueda inteligente: Por ID o por Teléfono (unificación de cuentas)
        const { data: profile, error } = await supabase
          .from("customers")
          .select("*")
          .or(`id.eq.${user.id}${user.phone ? `,phone.eq.${user.phone}` : ''}`)
          .maybeSingle();

        if (error) throw error;

        if (!profile) {
          // Chequeo de colisión de identidad por email
          if (user.email) {
            const { data: existingUser } = await supabase
              .from("customers")
              .select("auth_provider")
              .eq("email", user.email)
              .maybeSingle();

            if (existingUser) {
              const identities = (user as any)?.identities || [];
              const providers = user?.app_metadata?.providers || [];
              const isGoogle = providers.includes("google") || identities.some((i: any) => i.provider === "google");
              const currentProvider = isGoogle ? "google" : (existingUser.auth_provider === "phone" ? "phone" : "email");
              
              if (currentProvider !== existingUser.auth_provider && !(currentProvider === "email" && existingUser.auth_provider === "phone")) {
                const expectedMethod = existingUser.auth_provider === "google" ? "Continuar con Google" : "código por correo";
                await supabase.auth.signOut();
                setAuthError(`Esta cuenta se creó usando ${expectedMethod}. Por favor, usa esa opción.`);
                setAuthView("login");
                setIsCheckingProfile(false);
                return;
              } else {
                // El método es correcto, pero el ID cambió (probablemente un usuario eliminado y recreado en Auth).
                // Vinculamos el nuevo ID a la fila existente.
                await supabase.from("customers").update({ id: user.id }).eq('email', user.email);
                
                // Recargamos el perfil
                const { data: updatedProfile } = await supabase.from("customers").select("*").eq("id", user.id).single();
                if (updatedProfile) {
                  setCustomerProfile(updatedProfile);
                  setHasProfile(true);
                  if (deliveryMethod === "pickup") {
                    setStep(3);
                  } else {
                    nextStep();
                  }
                  setIsCheckingProfile(false);
                  return;
                }
              }
            }
          }
          setAuthView("profile");
        } else {
          // Si lo encontramos por teléfono pero el ID es distinto, lo vinculamos
          if (profile.id !== user.id) {
            await supabase.from("customers").update({ id: user.id }).eq('phone', user.phone);
          }
          setCustomerProfile(profile);
          setHasProfile(true);
          if (deliveryMethod === "pickup") {
            setStep(3);
          } else {
            nextStep();
          }
        }
      } catch (err) {
        console.error("Error checking profile:", err);
        setAuthView("profile"); // Ante la duda, pedir perfil
      } finally {
        setIsCheckingProfile(false);
      }
    }
  };

  // Auth Handlers
  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSending(true);
    setAuthError("");
    try {
      // Pre-check if this email belongs to a Google account
      const { data: existingUser } = await supabase
        .from("customers")
        .select("auth_provider")
        .eq("email", email)
        .maybeSingle();

      if (existingUser && existingUser.auth_provider === "google") {
        setAuthError("Esta cuenta se creó con Google. Por favor, usa el botón de Continuar con Google abajo.");
        setIsSending(false);
        return;
      }

      const { error } = await supabase.auth.signInWithOtp({
        email,
      });

      if (error) throw error;
      setAuthView("otp");
      setResendTimer(60);
    } catch (err: any) {
      console.error("Error logging in:", err);
      const msg = err.message?.toLowerCase() || "";
      if (msg.includes("rate limit")) {
        setAuthError("Has superado el límite de intentos. Espera 1 minuto o usa otro correo.");
      } else {
        setAuthError("No pudimos enviar el código. Verifica el correo e intenta de nuevo.");
      }
    } finally {
      setIsSending(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSending(true);
    setAuthError("");
    try {
      const { data, error } = await supabase.auth.verifyOtp({
        email,
        token: otpCode,
        type: "email",
      });

      if (error) throw error;

      if (data.user) {
        // Verificación dual tras login
        const { data: profile } = await supabase
          .from("customers")
          .select("*")
          .eq("id", data.user.id)
          .maybeSingle();

        if (!profile) {
          setAuthView("profile");
        } else {
          setAuthView(null);
          setHasProfile(true);
          nextStep();
        }
      }
    } catch (err: any) {
      console.error("Error verifying OTP:", err);
      const msg = err.message?.toLowerCase() || "";
      if (msg.includes("invalid") || msg.includes("expired")) {
        setAuthError("El código ingresado es incorrecto o ha expirado.");
      } else {
        setAuthError("Hubo un error al verificar el código. Intenta de nuevo.");
      }
    } finally {
      setIsSending(false);
    }
  };

  const handleAddressAdd = async (newAddr: Omit<Address, 'id'>) => {
    if (addresses.length >= 3) return;

    const addressWithId = { ...newAddr, id: Date.now().toString() };
    const updatedAddresses = [...addresses, addressWithId];

    setAddresses(updatedAddresses as Address[]);
    setSelectedAddressId(addressWithId.id);
    setAddress(addressWithId.formatted_address);
    setReferencePoint(addressWithId.reference_point || ""); // Sync reference point
    setShowMap(false);

    // Persist to DB
    if (user) {
      await supabase
        .from("customers")
        .update({ address: JSON.stringify(updatedAddresses) })
        .eq("id", user.id);
    }
  };

  const handleAddressDelete = async (id: string) => {
    const updatedAddresses = addresses.filter(a => a.id !== id);
    setAddresses(updatedAddresses);
    if (selectedAddressId === id) {
      setSelectedAddressId(updatedAddresses[0]?.id || null);
      setAddress(updatedAddresses[0]?.formatted_address || "");
    }

    // Persist to DB
    if (user) {
      await supabase
        .from("customers")
        .update({ address: JSON.stringify(updatedAddresses) })
        .eq("id", user.id);
    }
  };

  const handleProfileComplete = () => {
    setAuthView(null);
    setHasProfile(true);
    nextStep();
  };

  // Pre-fill address if user is logged in and has a profile
  useEffect(() => {
    if (user && !authLoading) {
      const fetchProfile = async () => {
        try {
          const { data, error } = await supabase
            .from("customers")
            .select("first_name, address")
            .eq("id", user.id)
            .single();

          if (data && !error) {
            setHasProfile(true);
            if (data.first_name) setFirstName(data.first_name);

            if (data.address) {
              try {
                // Try to parse as JSON for multi-address
                if (data.address.startsWith('[') || data.address.startsWith('{')) {
                  const parsed = JSON.parse(data.address);
                  const addressList = Array.isArray(parsed) ? parsed : [parsed];
                  setAddresses(addressList);
                  if (addressList.length > 0) {
                    setSelectedAddressId(prev => prev ? prev : addressList[0].id);
                    setAddress(prev => prev ? prev : addressList[0].formatted_address);
                    setReferencePoint(prev => prev || (addressList[0].reference_point || ""));
                  }
                } else {
                  // Legacy plain string address
                  const legacyAddr = {
                    id: 'legacy-' + Date.now(),
                    formatted_address: data.address,
                    lat: 10.4806,
                    lng: -66.9036,
                    label: 'Casa'
                  };
                  setAddresses([legacyAddr]);
                  setSelectedAddressId(prev => prev ? prev : legacyAddr.id);
                  setAddress(prev => prev ? prev : data.address);
                }
              } catch (e) {
                console.error("Error parsing saved address:", e);
                setAddress(data.address);
              }
            }
          }
        } catch (err) {
          console.error("Error fetching profile for pre-fill:", err);
        }
      };
      fetchProfile();
    }
  }, [user, authLoading]);

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

  if ((authLoading && !user) || isProcessingRedirect) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4">
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            rotate: [0, 5, -5, 0]
          }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="w-24 h-24 rounded-[2rem] bg-brand-cream/50 flex items-center justify-center mb-8 shadow-xl shadow-brand-cream/20 overflow-hidden"
        >
          <img src={getImagePath("/images/chupeta1.png")} alt="Cargando..." className="w-16 h-16 object-contain drop-shadow-md" />
        </motion.div>

        <h1 className="font-display text-2xl uppercase tracking-wider text-primary mb-3 text-center">
          Golosina en Camino...
        </h1>
        
        <p className="font-body text-slate-500 text-sm text-center max-w-[280px] leading-relaxed">
          Estamos verificando tu acceso. Te llevaremos de vuelta en un instante.
        </p>

        <div className="mt-10 flex gap-3">
          <motion.div
            animate={{ y: [0, -12, 0] }}
            transition={{ duration: 1, repeat: Infinity, delay: 0 }}
            className="w-3.5 h-3.5 rounded-full bg-primary"
          />
          <motion.div
            animate={{ y: [0, -12, 0] }}
            transition={{ duration: 1, repeat: Infinity, delay: 0.2 }}
            className="w-3.5 h-3.5 rounded-full bg-secondary"
          />
          <motion.div
            animate={{ y: [0, -12, 0] }}
            transition={{ duration: 1, repeat: Infinity, delay: 0.4 }}
            className="w-3.5 h-3.5 rounded-full bg-brand-blue"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 md:bg-primary flex flex-col md:flex-row">
      {/* Left Side: Summary */}
      <div className="bg-primary p-6 md:p-10 text-white md:w-5/12 flex flex-col justify-between relative overflow-hidden md:sticky md:top-0 md:h-screen">
        <div className="relative z-10">
          <button 
            onClick={() => {
              if (step === 4) {
                clearCart();
              }
              router.push("/catalogo");
            }} 
            className="mb-8 hover:bg-white/10 p-2 rounded-full inline-flex transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
          <h2 className="text-4xl md:text-5xl font-black mb-2 font-script">Tu Pedido</h2>
          <p className="text-white/80 text-sm md:text-base">Casi terminamos de preparar tu magia dulce.</p>
        </div>

        <div className="space-y-4 relative z-10 mt-12 md:mt-0">
          <div className="bg-white/10 p-6 rounded-[2rem] backdrop-blur-md border border-white/20 shadow-xl">
            {deliveryMethod === 'delivery' && (
              <div className="mb-4 pb-4 border-b border-white/10 space-y-2">
                <div className="flex justify-between items-center text-sm text-white/80">
                  <span>Subtotal</span>
                  <span className="font-numbers font-semibold">ref {totalPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center text-sm text-white/80">
                  <span>Envío / Delivery</span>
                  <span className="font-numbers font-semibold">ref 5.00</span>
                </div>
              </div>
            )}
            
            <p className="text-xs text-white/70 mb-1 uppercase tracking-widest font-body font-bold">Total a pagar</p>
            <div className="flex items-baseline gap-3">
              <p className="text-5xl font-numbers font-semibold">
                ref {(deliveryMethod === 'delivery' ? totalPrice + 5 : totalPrice).toFixed(2)}
              </p>
            </div>
            
            {bcvRate && (
              <div className="mt-3 pt-3 border-t border-white/10 flex items-center justify-between">
                <span className="text-xs font-bold text-white/60 uppercase tracking-widest">En Bs.</span>
                <span className="text-lg font-numbers font-bold text-white">
                  Bs. {((deliveryMethod === 'delivery' ? totalPrice + 5 : totalPrice) * bcvRate).toFixed(2)}
                </span>
              </div>
            )}
            
            {step > 1 && deliveryMethod === 'delivery' && addresses.find(a => a.id === selectedAddressId)?.zone === 'NATIONAL' && (
              <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} className="mt-3 p-2.5 bg-[#231f20] rounded-xl shadow-lg border border-white/5">
                 <p className="text-[11px] text-white/90 leading-tight">
                   📦 <strong>Nota de Logística:</strong> Los ref 5.00 cobrados aquí en el total cubren exclusivamente el embalaje de seguridad y el traslado de tu pedido hasta la agencia de MRW.
                 </p>
              </motion.div>
            )}
            
            <p className="text-[10px] text-white/40 mt-3 leading-tight flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {isFetchingRate 
                ? "Calculando tasa oficial BCV..." 
                : bcvRate ? `Tasa BCV calculada a Bs. ${bcvRate}` : "No se pudo cargar la tasa BCV actual."}
            </p>
          </div>

          {(step > 1 && !authView) && (
            <div className="text-xs space-y-2 bg-black/10 p-4 rounded-3xl border border-white/5">
              <p className="flex justify-between items-center"><span className="text-white/60 uppercase font-bold tracking-wider text-[10px]">Método de Entrega:</span> <span className="font-bold uppercase text-sm">{deliveryMethod}</span></p>
              {step > 2 && (
                <p className="flex justify-between items-center pt-2 border-t border-white/10">
                  <span className="text-white/60 uppercase font-bold tracking-wider text-[10px]">Método de Pago:</span> 
                  <span className="font-bold uppercase text-sm">
                    {paymentMethod === 'pm' ? 'Pago Móvil' : 
                     paymentMethod === 'zelle' ? 'Zelle' : 
                     paymentMethod === 'paypal' ? 'PayPal' : 'Efectivo'}
                  </span>
                </p>
              )}
            </div>
          )}

          {hasProfile && customerProfile && !authView && (
            <div className="bg-black/20 p-4 rounded-3xl border border-white/5 flex items-center justify-between mt-3">
              <div>
                <p className="font-bold text-sm leading-tight">{customerProfile.first_name} {customerProfile.last_name}</p>
                <p className="text-[10px] text-white/60 uppercase tracking-widest mt-0.5">{customerProfile.id_number}</p>
              </div>
              <div className="flex items-center gap-1.5 bg-white/5 px-3 py-1.5 rounded-full">
                <Smartphone className="w-3.5 h-3.5 text-white/50" /> 
                <p className="text-xs font-medium">{customerProfile.phone}</p>
              </div>
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
          
          {!authView && step > 1 && step < 4 && deliveryMethod === 'delivery' && addresses.find(a => a.id === selectedAddressId)?.zone === 'NATIONAL' && (
            <motion.div 
              initial={{ opacity: 0, y: -20 }} 
              animate={{ opacity: 1, y: 0 }} 
              className="w-full bg-blue-50 border border-blue-200 text-blue-900 p-5 rounded-[2rem] mb-8 flex items-center gap-5 shadow-sm"
            >
              <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center shrink-0">
                <Truck className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="font-black text-sm uppercase tracking-widest mb-0.5">🚚 ENVÍO NACIONAL (MRW / ZOOM)</p>
                <p className="text-xs font-medium opacity-80 leading-relaxed max-w-sm">
                  Tu dirección está fuera de Caracas. Enviaremos tus golosinas por MRW bajo la modalidad de <b>Cobro a Destino</b>.
                </p>
              </div>
            </motion.div>
          )}

          {!authView && step > 1 && step < 4 && isScheduledOrder && (
            <motion.div 
              initial={{ opacity: 0, y: -20 }} 
              animate={{ opacity: 1, y: 0 }} 
              className="w-full bg-amber-50 border border-amber-200 text-amber-900 p-5 rounded-[2rem] mb-8 flex items-center gap-5 shadow-sm"
            >
              <div className="w-12 h-12 bg-amber-100 rounded-2xl flex items-center justify-center shrink-0">
                <Clock className="w-6 h-6 text-amber-600" />
              </div>
              <div>
                <p className="font-black text-sm uppercase tracking-widest mb-0.5">Orden Programada</p>
                <p className="text-xs font-medium opacity-80 leading-relaxed max-w-sm">
                  Estamos fuera de horario comercial. Tu pedido será procesado a primera hora de nuestro próximo día hábil.
                </p>
              </div>
            </motion.div>
          )}

          <AnimatePresence mode="wait">
            {authView ? (
              <motion.div
                key="auth-flow"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="w-full"
              >
                <div className="text-center mb-8">
                  <h2 className="font-display text-3xl md:text-4xl uppercase tracking-tight text-brand-darkgray">
                    {authView === "login" && "¡Hola, Amigo!"}
                    {authView === "otp" && "Revisa tu Correo"}
                    {authView === "profile" && "¡Bienvenido!"}
                  </h2>
                  <p className="mt-2 font-body opacity-80 text-sm md:text-base text-gray-500">
                    {authView === "login" && "Ingresa tu correo para iniciar sesión o crear una cuenta nueva automáticamente."}
                    {authView === "otp" && `Ingresa el código que enviamos a ${email}`}
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
                    <form onSubmit={handleEmailLogin} className="space-y-4">
                      <div className="relative">
                        <Mail
                          size={18}
                          className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                        />
                        <input
                          type="email"
                          placeholder="tucorreo@ejemplo.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="w-full rounded-2xl bg-slate-50 border border-slate-200 py-4 pl-12 pr-5 font-body outline-none focus:border-primary/50 focus:ring-4 focus:ring-primary/10 transition-all text-lg"
                          required
                        />
                      </div>
                      <button
                        type="submit"
                        disabled={isSending}
                        className="flex w-full items-center justify-center gap-3 rounded-2xl bg-primary py-4 font-body font-bold text-white shadow-xl shadow-primary/20 transition-all hover:opacity-90 active:scale-[0.98] disabled:opacity-50 text-lg"
                      >
                        <Sparkles size={24} />
                        {isSending ? "Enviando código..." : "Enviar código"}
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

                    {/* Google Button */}
                    <form onSubmit={(e) => { e.preventDefault(); signInWithGoogle(); }}>
                      <button
                        type="submit"
                        className="flex w-full items-center justify-center gap-3 rounded-2xl border-2 border-gray-100 py-4 font-body font-bold text-gray-700 transition-all hover:bg-gray-50 active:scale-[0.98] text-lg cursor-pointer"
                      >
                        <svg className="w-6 h-6" viewBox="0 0 24 24">
                          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.16v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.16C1.43 8.55 1 10.22 1 12s.43 3.45 1.16 4.93l3.68-2.84z" fill="#FBBC05" />
                          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.16 7.07l3.68 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                        </svg>
                        Ingresar o registrarse con Google
                      </button>
                    </form>

                    <button onClick={() => setAuthView(null)} className="w-full text-center mt-6 text-sm text-gray-400 font-bold uppercase hover:text-gray-600 transition-colors">
                      Volver atrás
                    </button>
                  </div>
                )}

                {authView === "otp" && (
                  <motion.div
                    key="otp"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6 max-w-md mx-auto"
                  >
                    <form onSubmit={handleVerifyOtp} className="space-y-6">
                      <input
                        type="text"
                        maxLength={6}
                        placeholder="0 0 0 0 0 0"
                        value={otpCode}
                        onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ""))}
                        className="w-full text-center text-4xl tracking-[0.5em] font-numbers rounded-2xl bg-slate-50 border border-slate-200 py-6 outline-none focus:border-primary/50 focus:ring-4 focus:ring-primary/10 transition-all"
                        required
                      />
                      <button
                        type="submit"
                        disabled={isSending || otpCode.length < 6}
                        className="flex w-full items-center justify-center gap-3 rounded-2xl bg-primary py-4 font-body font-bold text-white shadow-xl shadow-primary/20 transition-all hover:opacity-90 active:scale-[0.98] disabled:opacity-50 text-lg"
                      >
                        {isSending ? "Verificando..." : "Verificar Código"}
                      </button>
                    </form>
                    <div className="flex flex-col gap-4 pt-2">
                      <button
                        onClick={(e) => handleEmailLogin(e as unknown as React.FormEvent)}
                        disabled={resendTimer > 0 || isSending}
                        className="w-full text-center text-sm font-body text-primary transition-colors font-bold disabled:text-gray-400 disabled:font-medium hover:underline"
                      >
                        {resendTimer > 0 
                          ? `Reenviar código en ${resendTimer}s` 
                          : "¿No recibiste el código? Reenviar ahora"}
                      </button>
                      <button
                        onClick={() => setAuthView("login")}
                        className="w-full text-center text-sm font-body text-gray-400 hover:text-gray-600 transition-colors font-medium"
                      >
                        ¿Correo incorrecto? Volver atrás
                      </button>
                    </div>
                  </motion.div>
                )}

                {authView === "profile" && (
                  <ProfileForm onComplete={handleProfileComplete} deliveryMethod={deliveryMethod} />
                )}
              </motion.div>
            ) : step === 1 ? (
              <motion.div key="step-1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8 w-full">
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-4">
                    <h3 className="text-3xl md:text-4xl font-display text-brand-darkgray leading-tight">
                      {firstName ? `Hola ${firstName}, ¿Cómo lo recibes?` : '¿Cómo lo recibes?'}
                    </h3>
                    {user && (
                      <button 
                        onClick={handleLogout}
                        className="text-xs font-bold text-primary bg-primary/5 px-3 py-1.5 rounded-full hover:bg-primary/10 transition-colors uppercase tracking-wider shrink-0"
                      >
                        Cambiar usuario
                      </button>
                    )}
                  </div>
                  <p className="text-brand-darkgray/60 font-body font-normal text-base">
                    Selecciona tu método de entrega preferido para continuar.
                  </p>
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

                {deliveryMethod === "pickup" && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                      <div
                        onClick={() => setPickupStore("campoclaro")}
                        className={`p-5 rounded-3xl border-2 text-left transition-all relative cursor-pointer ${pickupStore === 'campoclaro' ? 'border-primary bg-primary/5 shadow-lg shadow-primary/10 scale-[1.02]' : 'border-slate-100 bg-slate-50 hover:border-slate-200'}`}
                      >
                        <p className="font-display text-slate-800 mb-1 flex items-center gap-2 text-base leading-tight">
                          <MapPin className={`w-4 h-4 shrink-0 ${pickupStore === 'campoclaro' ? 'text-primary' : 'text-slate-400'}`} />
                          Dolce Candy Campo Claro
                        </p>
                        <p className="text-[10px] text-slate-500 mb-1 pl-6 leading-relaxed">Avenida Principal de Campo Claro, Edificio San Antonio</p>
                        <p className="text-[9px] text-slate-400 italic mb-3 pl-6 leading-relaxed">Punto de Referencia: Bajando por la calle de la taberna el greco, en la siguiente esquina, frente a la Pescadería Puerto Santo. Local de toldos de rayas rojas.</p>
                        <div className="flex items-center justify-between pl-6 gap-2">
                          <p className="text-[9px] font-black text-primary uppercase tracking-widest flex flex-col gap-0.5">
                            <span>Lun - Vier: 8:00 AM - 6:00 PM</span>
                            <span>Sáb: 10:00 AM - 4:00 PM</span>
                          </p>
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              window.open('https://www.google.com/maps/place/Dolce+Candy+boutique/@10.4918386,-66.8312842,17z/data=!4m6!3m5!1s0x8c2a592bab8cb72b:0x193d00d576f1fa49!8m2!3d10.49191!4d-66.8312609!16s%2Fg%2F11sg06nlzq?entry=ttu&g_ep=EgoyMDI2MDUxMC4wIKXMDSoASAFQAw%3D%3D', '_blank');
                            }}
                            className="flex items-center gap-1 text-[10px] font-bold text-slate-400 hover:text-primary transition-colors bg-white/50 py-1 px-2 rounded-lg"
                          >
                            <Map className="w-3 h-3" /> Ver mapa
                          </button>
                        </div>
                      </div>
                      
                      <div
                        onClick={() => setPickupStore("elbosque")}
                        className={`p-5 rounded-3xl border-2 text-left transition-all relative cursor-pointer ${pickupStore === 'elbosque' ? 'border-primary bg-primary/5 shadow-lg shadow-primary/10 scale-[1.02]' : 'border-slate-100 bg-slate-50 hover:border-slate-200'}`}
                      >
                        <p className="font-display text-slate-800 mb-1 flex items-center gap-2 text-base leading-tight">
                          <MapPin className={`w-4 h-4 shrink-0 ${pickupStore === 'elbosque' ? 'text-primary' : 'text-slate-400'}`} />
                          Dolce Candy El Bosque
                        </p>
                        <p className="text-[10px] text-slate-500 mb-1 pl-6 leading-relaxed">Av. Principal del Bosque, Edificio El Bosque</p>
                        <p className="text-[9px] text-slate-400 italic mb-3 pl-6 leading-relaxed">Punto de Referencia: Local de la Esquina con Santa Marias Rojas, Frente al módulo de policía, bajando hacia Chacaito.</p>
                        <div className="flex items-center justify-between pl-6 gap-2">
                          <p className="text-[9px] font-black text-primary uppercase tracking-widest flex flex-col gap-0.5">
                            <span>Lun - Vier: 9:00 AM - 7:00 PM</span>
                            <span>Sáb: 10:00 AM - 6:00 PM</span>
                          </p>
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              window.open('https://www.google.com/maps/place/Dolce+Candy+Boutique/@10.4943073,-66.8678368,17z/data=!3m1!4b1!4m6!3m5!1s0x8c2a59005758af9d:0x726cc440dca98fcf!8m2!3d10.4943073!4d-66.8678368!16s%2Fg%2F11xn3czjry?entry=ttu&g_ep=EgoyMDI2MDUxMC4wIKXMDSoASAFQAw%3D%3D', '_blank');
                            }}
                            className="flex items-center gap-1 text-[10px] font-bold text-slate-400 hover:text-primary transition-colors bg-white/50 py-1 px-2 rounded-lg"
                          >
                            <Map className="w-3 h-3" /> Ver mapa
                          </button>
                        </div>
                      </div>
                  </motion.div>
                )}

                <button
                  onClick={handleStep1Next}
                  className="w-full bg-primary text-white py-5 rounded-full font-black text-lg flex items-center justify-center gap-2 shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
                >
                  Continuar <ChevronRight className="w-6 h-6" />
                </button>
              </motion.div>
            ) : step === 2 ? (
              <motion.div key="step-2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8 w-full">
                <div className="space-y-2">
                  <h3 className="text-3xl md:text-4xl font-display text-brand-darkgray leading-tight">Dirección de Entrega</h3>
                  <p className="text-brand-darkgray/60 font-body font-normal text-base">Gestiona tus lugares favoritos para recibir tus dulces.</p>
                </div>

                <div className="space-y-6">
                  <div className="grid grid-cols-1 gap-3">
                    {addresses.map((addr) => (
                      <div
                        key={addr.id}
                        onClick={() => {
                          setSelectedAddressId(addr.id);
                          setAddress(addr.formatted_address);
                          setReferencePoint(addr.reference_point || "");
                        }}
                        className={`p-5 rounded-2xl border-2 transition-all cursor-pointer relative group ${selectedAddressId === addr.id ? 'border-primary bg-primary/5 shadow-md' : 'border-slate-100 hover:border-slate-200 bg-white'}`}
                      >
                        <div className="flex items-start gap-3">
                          <div className={`mt-1 w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${selectedAddressId === addr.id ? 'border-primary' : 'border-slate-200'}`}>
                            {selectedAddressId === addr.id && <div className="w-2.5 h-2.5 bg-primary rounded-full" />}
                          </div>
                          <div className="flex-1">
                            <p className="text-[10px] font-black uppercase tracking-widest text-primary mb-0.5">{addr.label}</p>
                            <p className="text-sm font-medium text-slate-600 line-clamp-2 pr-8">
                              {addr.unit ? `${addr.unit}, ` : ''}{addr.formatted_address}
                            </p>

                          </div>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAddressDelete(addr.id);
                          }}
                          className="absolute right-4 top-1/2 -translate-y-1/2 p-2 text-slate-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}

                    {addresses.length < 3 && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <button
                          onClick={() => {
                            setShowMap(true);
                            setMapAutoLocate(false);
                          }}
                          className="p-5 rounded-2xl border-2 border-dashed border-slate-200 text-slate-400 hover:border-primary/50 hover:text-primary transition-all flex items-center justify-center gap-2 font-black text-sm uppercase tracking-wider"
                        >
                          <MapPin className="w-5 h-5" /> Agregar Dirección
                        </button>
                        <button
                          onClick={() => {
                            setShowMap(true);
                            setMapAutoLocate(true);
                          }}
                          className="p-5 rounded-2xl border-2 border-slate-100 text-slate-500 hover:border-primary/50 hover:text-primary transition-all flex items-center justify-center gap-2 font-black text-sm uppercase tracking-wider bg-white shadow-sm"
                        >
                          <Navigation className="w-5 h-5" /> Ubicación Actual
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex gap-4 pt-6">
                  <button onClick={prevStep} className="flex-1 py-5 font-black text-slate-400 hover:text-slate-600 transition-colors uppercase tracking-wider text-sm bg-slate-100 hover:bg-slate-200 rounded-full">Atrás</button>
                  <button
                    disabled={deliveryMethod === 'delivery' && !selectedAddressId}
                    onClick={nextStep}
                    className="flex-[2] bg-primary text-white py-5 rounded-full font-black text-lg flex items-center justify-center gap-2 shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
                  >
                    Siguiente <ChevronRight className="w-6 h-6" />
                  </button>
                </div>
              </motion.div>
            ) : step === 3 ? (
              <motion.div key="step-3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8 w-full">
                <div className="space-y-2">
                  <h3 className="text-3xl md:text-4xl font-display text-brand-darkgray leading-tight">Finalizar Pedido</h3>
                  <p className="text-brand-darkgray/60 font-body font-normal text-base">Elige tu método de pago y completa la información.</p>
                </div>

                {/* Dropdown Selector */}
                <div className="relative">
                  <button 
                    onClick={() => setIsPaymentDropdownOpen(!isPaymentDropdownOpen)}
                    className="w-full bg-slate-50 border-2 border-slate-200 rounded-2xl p-5 flex items-center justify-between focus:border-primary/50 focus:ring-4 focus:ring-primary/10 transition-all"
                  >
                    <div className="flex items-center gap-4">
                      {paymentMethod === 'zelle' && <div className="w-10 h-10 rounded-xl bg-[#741BCC] text-white flex items-center justify-center font-black text-lg">Z</div>}
                      {paymentMethod === 'pm' && <div className="w-10 h-10 rounded-xl bg-[#00B0F0] text-white flex items-center justify-center"><Smartphone className="w-5 h-5" /></div>}
                      {paymentMethod === 'cash' && <div className="w-10 h-10 rounded-xl bg-[#1D9A5B] text-white flex items-center justify-center"><Wallet className="w-5 h-5" /></div>}
                      {paymentMethod === 'paypal' && <div className="w-10 h-10 rounded-xl bg-[#00457C] text-white flex items-center justify-center font-black text-lg italic">P</div>}
                      <span className="font-black text-slate-700 text-xl">
                        {paymentMethod === 'zelle' && 'Zelle'}
                        {paymentMethod === 'pm' && 'Pago Móvil'}
                        {paymentMethod === 'cash' && 'Efectivo'}
                        {paymentMethod === 'paypal' && 'PayPal'}
                      </span>
                    </div>
                    <ChevronDown className={`w-6 h-6 text-slate-400 transition-transform duration-300 ${isPaymentDropdownOpen ? 'rotate-180' : ''}`} />
                  </button>
                  
                  <AnimatePresence>
                    {isPaymentDropdownOpen && (
                      <motion.div 
                        initial={{ opacity: 0, y: -10 }} 
                        animate={{ opacity: 1, y: 0 }} 
                        exit={{ opacity: 0, y: -10 }} 
                        transition={{ duration: 0.2 }}
                        className="absolute top-[calc(100%+8px)] left-0 w-full bg-white border border-slate-200 rounded-2xl shadow-xl z-10 overflow-hidden"
                      >
                        {[
                          { id: 'zelle', name: 'Zelle', icon: <span className="font-black text-white text-base">Z</span>, bg: 'bg-[#741BCC]' },
                          { id: 'pm', name: 'Pago Móvil', icon: <Smartphone className="w-5 h-5 text-white" />, bg: 'bg-[#00B0F0]' },
                          { id: 'cash', name: 'Efectivo', icon: <Wallet className="w-5 h-5 text-white" />, bg: 'bg-[#1D9A5B]' },
                          { id: 'paypal', name: 'PayPal', icon: <span className="font-black text-white text-base italic">P</span>, bg: 'bg-[#00457C]' }
                        ].map((option) => (
                          <button
                            key={option.id}
                            onClick={() => {
                              setPaymentMethod(option.id as PaymentMethod);
                              setIsPaymentDropdownOpen(false);
                            }}
                            className={`w-full text-left p-4 flex items-center gap-4 hover:bg-slate-50 transition-colors border-b border-slate-100 last:border-0 ${paymentMethod === option.id ? 'bg-primary/5' : ''}`}
                          >
                            <div className={`w-10 h-10 rounded-xl ${option.bg} flex items-center justify-center`}>
                              {option.icon}
                            </div>
                            <span className={`font-black text-lg ${paymentMethod === option.id ? 'text-primary' : 'text-slate-600'}`}>{option.name}</span>
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* FORMULARIOS DINÁMICOS */}
                <div className="pt-2">
                  {paymentMethod === 'zelle' && (
                    <div className="space-y-6">
                      <div className="bg-slate-50 p-6 rounded-[2.5rem] space-y-4 border border-slate-100">
                        <div className="flex justify-between items-center group">
                          <div><p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-1">Correo Zelle</p><p className="font-black text-slate-700 text-base md:text-lg break-all">Anakarinapeca@gmail.com</p></div>
                          <Copy className="w-5 h-5 text-slate-300 cursor-pointer hover:text-primary transition-colors shrink-0 ml-2" onClick={() => copyToClipboard('Anakarinapeca@gmail.com', 'email')} />
                        </div>
                        <div className="flex justify-between items-center group">
                          <div><p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-1">Titular</p><p className="font-black text-slate-700 text-base md:text-lg">Ana Karina Pérez Caraciolo</p></div>
                          <Copy className="w-5 h-5 text-slate-300 cursor-pointer hover:text-primary transition-colors shrink-0 ml-2" onClick={() => copyToClipboard('Ana Karina Pérez Caraciolo', 'name')} />
                        </div>
                      </div>

                      <div className="space-y-4">
                        <label className="text-sm font-bold text-slate-700 uppercase tracking-widest">¿Quién envía el pago?</label>
                        <input type="text" value={paymentHolder} onChange={(e) => setPaymentHolder(e.target.value)} placeholder="Nombre del titular de la cuenta" className="w-full bg-slate-50 border border-slate-200 p-4 rounded-2xl outline-none focus:border-primary/50 focus:ring-4 focus:ring-primary/10 transition-all font-body text-base" />
                      </div>

                      <div className="space-y-4">
                        <label className="text-sm font-bold text-slate-700 uppercase tracking-widest">Número de Referencia</label>
                        <input type="text" value={paymentReference} onChange={(e) => setPaymentReference(e.target.value)} placeholder="Opcional si subes foto" className="w-full bg-slate-50 border border-slate-200 p-4 rounded-2xl outline-none focus:border-primary/50 focus:ring-4 focus:ring-primary/10 transition-all font-body text-base font-numbers" />
                      </div>

                      <div className="space-y-4">
                        <label className="text-sm font-bold text-slate-700 uppercase tracking-widest">Captura (Opcional si escribes referencia)</label>
                        <label className="border-4 border-dashed border-slate-200 rounded-3xl p-8 flex flex-col items-center justify-center text-center hover:bg-slate-50 hover:border-primary/30 transition-colors cursor-pointer group relative">
                          <input type="file" accept="image/*" onChange={(e) => setReceiptFile(e.target.files?.[0] || null)} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                          <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 transition-transform group-hover:scale-110 ${receiptFile ? 'bg-green-100' : 'bg-primary/10'}`}>
                            {receiptFile ? <CheckCircle className="w-8 h-8 text-green-600" /> : <Upload className="w-8 h-8 text-primary" />}
                          </div>
                          <p className={`font-black text-base mb-1 ${receiptFile ? 'text-green-600' : 'text-slate-700'}`}>{receiptFile ? '¡Captura lista!' : 'Subir Captura'}</p>
                          <p className="text-[10px] text-slate-400 font-medium truncate max-w-[200px]">{receiptFile ? receiptFile.name : 'JPG o PNG'}</p>
                        </label>
                      </div>
                    </div>
                  )}

                  {paymentMethod === 'pm' && (
                    <div className="space-y-6">
                      <div className="bg-slate-50 p-6 rounded-[2.5rem] space-y-4 border border-slate-100">
                        <div className="flex justify-between items-center group">
                          <div><p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-1">Banco</p><p className="font-black text-slate-700 text-lg">Banesco (0134)</p></div>
                          <Copy className="w-5 h-5 text-slate-300 cursor-pointer hover:text-primary transition-colors shrink-0 ml-2" onClick={() => copyToClipboard('0134', 'bank')} />
                        </div>
                        <div className="flex justify-between items-center group">
                          <div><p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-1">Teléfono</p><p className="font-black text-slate-700 text-lg">0424-1315741</p></div>
                          <Copy className="w-5 h-5 text-slate-300 cursor-pointer hover:text-primary transition-colors shrink-0 ml-2" onClick={() => copyToClipboard('04241315741', 'tel')} />
                        </div>
                        <div className="flex justify-between items-center group">
                          <div><p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-1">Cédula</p><p className="font-black text-slate-700 text-lg">V-21.354.295</p></div>
                          <Copy className="w-5 h-5 text-slate-300 cursor-pointer hover:text-primary transition-colors shrink-0 ml-2" onClick={() => copyToClipboard('21354295', 'ci')} />
                        </div>
                        {bcvRate && (
                          <div className="pt-4 border-t border-slate-200 flex justify-between items-center mt-2">
                            <p className="text-[10px] md:text-xs text-slate-400 font-bold uppercase tracking-wider">Monto a Transferir</p>
                            <p className="font-black text-primary text-xl md:text-2xl font-numbers">Bs. {((deliveryMethod === 'delivery' ? totalPrice + 5 : totalPrice) * bcvRate).toFixed(2)}</p>
                          </div>
                        )}
                      </div>

                      <div className="space-y-4">
                        <label className="text-sm font-bold text-slate-700 uppercase tracking-widest">Últimos 4 dígitos de Ref.</label>
                        <input type="text" value={paymentReference} onChange={(e) => setPaymentReference(e.target.value)} placeholder="Opcional si subes foto" className="w-full bg-slate-50 border border-slate-200 p-4 rounded-2xl outline-none focus:border-primary/50 focus:ring-4 focus:ring-primary/10 transition-all font-body text-base font-numbers tracking-widest" />
                      </div>

                      <div className="space-y-4">
                        <label className="text-sm font-bold text-slate-700 uppercase tracking-widest">Captura (Opcional si escribes referencia)</label>
                        <label className="border-4 border-dashed border-slate-200 rounded-3xl p-8 flex flex-col items-center justify-center text-center hover:bg-slate-50 hover:border-primary/30 transition-colors cursor-pointer group relative">
                          <input type="file" accept="image/*" onChange={(e) => setReceiptFile(e.target.files?.[0] || null)} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                          <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 transition-transform group-hover:scale-110 ${receiptFile ? 'bg-green-100' : 'bg-primary/10'}`}>
                            {receiptFile ? <CheckCircle className="w-8 h-8 text-green-600" /> : <Upload className="w-8 h-8 text-primary" />}
                          </div>
                          <p className={`font-black text-base mb-1 ${receiptFile ? 'text-green-600' : 'text-slate-700'}`}>{receiptFile ? '¡Captura lista!' : 'Subir Captura'}</p>
                          <p className="text-[10px] text-slate-400 font-medium truncate max-w-[200px]">{receiptFile ? receiptFile.name : 'JPG o PNG'}</p>
                        </label>
                      </div>
                    </div>
                  )}

                  {paymentMethod === 'cash' && (
                    <div className="space-y-6">
                      <div className="bg-amber-50 p-6 rounded-[2.5rem] border border-amber-200 flex items-start gap-4">
                        <div className="p-3 bg-amber-100 rounded-2xl shrink-0"><Wallet className="w-6 h-6 text-amber-600" /></div>
                        <div>
                          <p className="font-black text-amber-900 text-sm uppercase tracking-widest mb-1">Pago en Divisas</p>
                          <p className="text-xs font-medium text-amber-800/80 leading-relaxed">Asegúrate de que los billetes estén en buen estado. Requerimos una foto de los billetes que entregarás.</p>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <label className="text-sm font-bold text-slate-700 uppercase tracking-widest">Monto a entregar</label>
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input type="checkbox" checked={isExactCash} onChange={(e) => {
                              setIsExactCash(e.target.checked);
                              if(e.target.checked) setCashAmount((deliveryMethod === 'delivery' ? totalPrice + 5 : totalPrice).toFixed(2));
                            }} className="w-4 h-4 rounded text-primary focus:ring-primary accent-primary" />
                            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Monto Exacto</span>
                          </label>
                        </div>
                        <div className="relative">
                          <span className="absolute left-5 top-1/2 -translate-y-1/2 font-black text-slate-400 text-lg">$</span>
                          <input type="number" step="0.01" value={cashAmount} onChange={(e) => {
                            setCashAmount(e.target.value);
                            setIsExactCash(false);
                          }} placeholder="Ej. 50.00" className="w-full bg-slate-50 border border-slate-200 p-4 pl-10 rounded-2xl outline-none focus:border-primary/50 focus:ring-4 focus:ring-primary/10 transition-all font-numbers text-lg" />
                        </div>
                      </div>

                      <div className="space-y-4">
                        <label className="text-sm font-bold text-slate-700 uppercase tracking-widest">Foto de los billetes (Obligatorio)</label>
                        <label className="border-4 border-dashed border-slate-200 rounded-3xl p-8 flex flex-col items-center justify-center text-center hover:bg-slate-50 hover:border-primary/30 transition-colors cursor-pointer group relative">
                          <input type="file" accept="image/*" onChange={(e) => setReceiptFile(e.target.files?.[0] || null)} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                          <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 transition-transform group-hover:scale-110 ${receiptFile ? 'bg-green-100' : 'bg-primary/10'}`}>
                            {receiptFile ? <CheckCircle className="w-8 h-8 text-green-600" /> : <Upload className="w-8 h-8 text-primary" />}
                          </div>
                          <p className={`font-black text-base mb-1 ${receiptFile ? 'text-green-600' : 'text-slate-700'}`}>{receiptFile ? '¡Foto lista!' : 'Subir Foto'}</p>
                          <p className="text-[10px] text-slate-400 font-medium truncate max-w-[200px]">{receiptFile ? receiptFile.name : 'Asegúrate que se vean claros'}</p>
                        </label>
                      </div>
                    </div>
                  )}

                  {paymentMethod === 'paypal' && (
                    <div className="space-y-6">
                      <div className="bg-slate-50 p-6 rounded-[2.5rem] space-y-4 border border-slate-100">
                        <div className="flex justify-between items-center group">
                          <div><p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-1">Usuario PayPal</p><p className="font-black text-slate-700 text-lg">@marimagda95</p></div>
                          <Copy className="w-5 h-5 text-slate-300 cursor-pointer hover:text-primary transition-colors shrink-0 ml-2" onClick={() => copyToClipboard('@marimagda95', 'paypal')} />
                        </div>
                        <div className="flex justify-between items-center group">
                          <div><p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-1">Correo</p><p className="font-black text-slate-700 text-base md:text-lg break-all">Mavimagdalena@gmail.com</p></div>
                          <Copy className="w-5 h-5 text-slate-300 cursor-pointer hover:text-primary transition-colors shrink-0 ml-2" onClick={() => copyToClipboard('Mavimagdalena@gmail.com', 'email')} />
                        </div>
                        <div className="flex justify-between items-center group">
                          <div><p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-1">Titular</p><p className="font-black text-slate-700 text-base md:text-lg">Victoria Magdalena Carranza</p></div>
                          <Copy className="w-5 h-5 text-slate-300 cursor-pointer hover:text-primary transition-colors shrink-0 ml-2" onClick={() => copyToClipboard('Victoria Magdalena Carranza', 'name')} />
                        </div>
                      </div>

                      <div className="space-y-4">
                        <label className="text-sm font-bold text-slate-700 uppercase tracking-widest">¿Quién envía el pago?</label>
                        <input type="text" value={paymentHolder} onChange={(e) => setPaymentHolder(e.target.value)} placeholder="Nombre del titular de la cuenta PayPal" className="w-full bg-slate-50 border border-slate-200 p-4 rounded-2xl outline-none focus:border-primary/50 focus:ring-4 focus:ring-primary/10 transition-all font-body text-base" />
                      </div>

                      <div className="space-y-4">
                        <label className="text-sm font-bold text-slate-700 uppercase tracking-widest">ID de Transacción</label>
                        <input type="text" value={paymentReference} onChange={(e) => setPaymentReference(e.target.value)} placeholder="Opcional si subes foto" className="w-full bg-slate-50 border border-slate-200 p-4 rounded-2xl outline-none focus:border-primary/50 focus:ring-4 focus:ring-primary/10 transition-all font-body text-base font-numbers" />
                      </div>

                      <div className="space-y-4">
                        <label className="text-sm font-bold text-slate-700 uppercase tracking-widest">Captura (Opcional si escribes referencia)</label>
                        <label className="border-4 border-dashed border-slate-200 rounded-3xl p-8 flex flex-col items-center justify-center text-center hover:bg-slate-50 hover:border-primary/30 transition-colors cursor-pointer group relative">
                          <input type="file" accept="image/*" onChange={(e) => setReceiptFile(e.target.files?.[0] || null)} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                          <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 transition-transform group-hover:scale-110 ${receiptFile ? 'bg-green-100' : 'bg-primary/10'}`}>
                            {receiptFile ? <CheckCircle className="w-8 h-8 text-green-600" /> : <Upload className="w-8 h-8 text-primary" />}
                          </div>
                          <p className={`font-black text-base mb-1 ${receiptFile ? 'text-green-600' : 'text-slate-700'}`}>{receiptFile ? '¡Captura lista!' : 'Subir Captura'}</p>
                          <p className="text-[10px] text-slate-400 font-medium truncate max-w-[200px]">{receiptFile ? receiptFile.name : 'JPG o PNG'}</p>
                        </label>
                      </div>
                    </div>
                  )}
                </div>

                <div className="pt-6 text-center">
                  <button 
                    onClick={handleLogout}
                    className="text-xs font-black uppercase tracking-widest text-slate-400 hover:text-primary transition-colors flex items-center justify-center gap-2 mx-auto group"
                  >
                    <User className="w-4 h-4 group-hover:scale-110 transition-transform" />
                    <span className="underline decoration-2 underline-offset-4">Cambiar de Usuario</span>
                  </button>
                </div>

                {paymentError && (
                  <div className="p-4 bg-red-50 text-red-600 border-2 border-red-100 rounded-2xl text-sm font-bold flex items-center gap-2 mt-6">
                    <span className="text-lg">⚠️</span> {paymentError}
                  </div>
                )}

                <div className="flex gap-4 pt-4">
                  <button onClick={() => deliveryMethod === 'pickup' ? setStep(1) : prevStep()} disabled={isSubmitting} className="flex-1 py-5 font-black text-slate-400 hover:text-slate-600 transition-colors uppercase tracking-wider text-sm bg-slate-100 hover:bg-slate-200 rounded-full disabled:opacity-50">Atrás</button>
                  <button
                    onClick={handleConfirmOrder}
                    disabled={isSubmitting}
                    className="flex-[2] bg-primary text-white py-5 rounded-full font-black text-lg flex items-center justify-center gap-2 shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <span className="flex items-center gap-2">Procesando <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /></span>
                    ) : (
                      <>Confirmar Pedido <CheckCircle className="w-6 h-6" /></>
                    )}
                  </button>
                </div>
              </motion.div>
            ) : step === 4 ? (
              <motion.div key="step-4" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="h-full flex flex-col items-center justify-center text-center py-8 md:py-12 w-full px-4 md:px-0">
                <motion.div
                  initial={{ scale: 0, rotate: -20 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: "spring", bounce: 0.5 }}
                  className="w-28 h-28 md:w-40 md:h-40 bg-green-100 rounded-full flex items-center justify-center mb-6 md:mb-10 shadow-inner"
                >
                  <CheckCircle className="w-14 h-14 md:w-20 md:h-20 text-green-500" />
                </motion.div>
                <h3 className="text-2xl sm:text-3xl md:text-5xl font-display mb-3 md:mb-4 text-brand-darkgray leading-tight whitespace-nowrap">¡Pedido Recibido! ✨</h3>
                <p className="text-slate-500 mb-8 md:mb-12 max-w-sm text-sm md:text-base leading-relaxed">
                  {deliveryMethod === 'delivery'
                    ? "Estamos preparando tus dulces. Pulsa abajo para enviar el reporte de pago por WhatsApp y que despachemos."
                    : "Tu pedido estará listo para retirar en tienda una vez envíes el comprobante por WhatsApp."}
                </p>

                <button
                  onClick={() => {
                    const whatsappNumber = "584122861719";
                    const selectedAddr = addresses.find(a => a.id === selectedAddressId);
                    const mapsLink = selectedAddr ? `\n📍 *Ubicación:* https://www.google.com/maps/search/?api=1&query=${selectedAddr.lat},${selectedAddr.lng}` : '';
                    const scheduledBadge = isScheduledOrder ? `⚠️ *ORDEN PROGRAMADA (Fuera de horario)* ⚠️\n\n` : '';
                    
                    const isNational = selectedAddr?.zone === 'NATIONAL';
                    const storeMapLink = pickupStore === 'campoclaro' 
                      ? 'https://www.google.com/maps/place/Dolce+Candy+boutique/@10.4918386,-66.8312842,17z/data=!4m6!3m5!1s0x8c2a592bab8cb72b:0x193d00d576f1fa49!8m2!3d10.49191!4d-66.8312609!16s%2Fg%2F11sg06nlzq?entry=ttu&g_ep=EgoyMDI2MDUxMC4wIKXMDSoASAFQAw%3D%3D' 
                      : 'https://www.google.com/maps/place/Dolce+Candy+Boutique/@10.4943073,-66.8678368,17z/data=!3m1!4b1!4m6!3m5!1s0x8c2a59005758af9d:0x726cc440dca98fcf!8m2!3d10.4943073!4d-66.8678368!16s%2Fg%2F11xn3czjry?entry=ttu&g_ep=EgoyMDI2MDUxMC4wIKXMDSoASAFQAw%3D%3D';

                    const deliveryText = deliveryMethod === 'delivery' 
                      ? (isNational ? `Envío Nacional (MRW/Zoom) a: ${address}` : `Delivery a: ${address}`)
                      : `Pickup en: ${pickupStore === 'campoclaro' ? 'Dolce Candy Campo Claro' : 'Dolce Candy El Bosque'}\n📍 *Mapa Tienda:* ${storeMapLink}`;
                      
                    let paymentText = '';
                    if (paymentMethod === 'zelle') paymentText = `Zelle (Titular: ${paymentHolder || 'N/A'}) - Ref: ${paymentReference || 'Ver Foto'}`;
                    if (paymentMethod === 'pm') paymentText = `Pago Móvil - Ref: ${paymentReference || 'Ver Foto'}`;
                    if (paymentMethod === 'paypal') paymentText = `PayPal (Titular: ${paymentHolder || 'N/A'}) - Ref: ${paymentReference || 'Ver Foto'}`;
                    if (paymentMethod === 'cash') paymentText = `Efectivo - Monto a entregar: ref ${cashAmount || (deliveryMethod === 'delivery' ? totalPrice + 5 : totalPrice).toFixed(2)}${isExactCash ? ' (Monto Exacto)' : ''}`;
                      
                    const receiptLinkText = receiptUrl ? `\n📸 *Comprobante:* ${receiptUrl}` : '';
                    
                    // Obtener dirección formateada final para WhatsApp
                    const selectedAddrObj = addresses.find(a => a.id === selectedAddressId);
                    const finalDeliveryText = deliveryMethod === 'delivery' && selectedAddrObj
                      ? `${isNational ? `Envío Nacional (MRW/Zoom) a:` : `Delivery a:`} ${selectedAddrObj.formatted_address}${selectedAddrObj.unit ? `\n🏢 *Inmueble:* ${selectedAddrObj.unit}` : ''}${referencePoint ? `\n📍 *Ref:* ${referencePoint}` : ''}`
                      : deliveryText;

                    const paymentMethodNames = {
                      zelle: "Zelle",
                      pm: "Pago Móvil",
                      paypal: "PayPal",
                      cash: "Efectivo"
                    };
                    const paymentMethodText = paymentMethodNames[paymentMethod as keyof typeof paymentMethodNames] || paymentMethod;

                    const customerName = (hasProfile && customerProfile) 
                      ? `${customerProfile.first_name} ${customerProfile.last_name}`.trim() 
                      : (firstName || user?.phone || "Invitado");

                    const orderId = createdOrderId ? String(createdOrderId).slice(0, 8).toUpperCase() : "N/A";
                    const totalAmount = (deliveryMethod === 'delivery' ? totalPrice + 5 : totalPrice).toFixed(2);

                    const orderSummary = `¡Hola Dolce Candy! 🍭✨ He realizado un pedido y acabo de subir mi comprobante de pago en la web. Aquí tienes los detalles para la validación:\n\n🆔 Orden: #${orderId}\n👤 Cliente: ${customerName}\n🛵 *Entrega:*\n${finalDeliveryText}\n\n💳 Método: ${paymentMethodText}\n💰 Total: ref ${totalAmount}\n\nQuedo a la espera de su confirmación para el despacho. ¡Gracias! 🙏`;
                    const encodedMsg = encodeURIComponent(orderSummary);
                    window.open(`https://api.whatsapp.com/send?phone=${whatsappNumber}&text=${encodedMsg}`, "_blank");
                    handleFinish();
                  }}
                  className="bg-[#25D366] text-white px-6 md:px-14 py-4 md:py-6 rounded-full font-black text-sm md:text-lg shadow-2xl shadow-[#25D366]/30 flex items-center justify-center gap-2 md:gap-3 hover:scale-105 active:scale-95 transition-all w-full md:w-auto uppercase tracking-wider"
                >
                  <MessageCircle className="w-5 h-5 md:w-7 md:h-7 fill-current shrink-0" />
                  Enviar por WhatsApp
                </button>

                {deliveryMethod === 'pickup' && (
                  <button
                    onClick={() => {
                      const mapLink = pickupStore === 'campoclaro' 
                        ? 'https://www.google.com/maps/place/Dolce+Candy+boutique/@10.4918386,-66.8312842,17z/data=!4m6!3m5!1s0x8c2a592bab8cb72b:0x193d00d576f1fa49!8m2!3d10.49191!4d-66.8312609!16s%2Fg%2F11sg06nlzq?entry=ttu&g_ep=EgoyMDI2MDUxMC4wIKXMDSoASAFQAw%3D%3D'
                        : 'https://www.google.com/maps/place/Dolce+Candy+Boutique/@10.4943073,-66.8678368,17z/data=!3m1!4b1!4m6!3m5!1s0x8c2a59005758af9d:0x726cc440dca98fcf!8m2!3d10.4943073!4d-66.8678368!16s%2Fg%2F11xn3czjry?entry=ttu&g_ep=EgoyMDI2MDUxMC4wIKXMDSoASAFQAw%3D%3D';
                      window.open(mapLink, '_blank');
                    }}
                    className="mt-4 flex items-center gap-2 text-slate-400 hover:text-primary transition-colors font-bold text-xs uppercase tracking-widest"
                  >
                    <Map className="w-4 h-4" /> ¿Cómo llegar a la tienda?
                  </button>
                )}
              </motion.div>
            ) : null}

            {/* --- MAP MODAL --- */}
            <AnimatePresence>
              {showMap && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-sm flex items-end sm:items-center justify-center sm:p-4"
                >
                  <motion.div
                    initial={{ y: "100%" }}
                    animate={{ y: 0 }}
                    exit={{ y: "100%" }}
                    transition={{ type: "spring", damping: 25, stiffness: 200 }}
                    className="w-full max-w-2xl bg-white h-[90vh] sm:h-[80vh] sm:rounded-[3rem] overflow-hidden shadow-2xl"
                  >
                    <MapSelector
                      onClose={() => {
                        setShowMap(false);
                        setMapAutoLocate(false);
                      }}
                      onAddressSelect={(addr) => {
                        handleAddressAdd(addr);
                        setMapAutoLocate(false);
                      }}
                      autoLocate={mapAutoLocate}
                    />
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>

          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

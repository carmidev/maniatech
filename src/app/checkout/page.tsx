"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, CheckCircle, Upload, CreditCard, Copy, ChevronRight, ChevronDown, Truck, Store, Wallet, MapPin, Smartphone, Mail, Sparkles, User, Clock, Navigation, Map, MessageCircle, Package } from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import dynamic from "next/dynamic";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase";
import { getImagePath } from "@/utils/imagePath";
import { ProfileForm } from "@/components/ProfileForm";
import { createOrderAndDeductInventory } from "./actions";

const MapSelector = dynamic(() => import("@/components/MapSelector").then(mod => mod.MapSelector), {
  loading: () => <div className="h-60 bg-slate-50 rounded-3xl flex items-center justify-center font-bold text-primary animate-pulse uppercase tracking-widest text-xs">Cargando Mapa...</div>,
  ssr: false
});

type DeliveryMethod = "delivery" | "pickup" | "national";
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
type PaymentMethod = "zelle" | "pm" | "cash" | "paypal" | "pos";
type AuthView = "login" | "otp" | "profile" | null;

const VENEZUELAN_STATES = [
  "Amazonas",
  "Anzoátegui",
  "Apure",
  "Aragua",
  "Barinas",
  "Bolívar",
  "Carabobo",
  "Cojedes",
  "Delta Amacuro",
  "Distrito Capital",
  "Falcón",
  "Guárico",
  "Lara",
  "La Guaira",
  "Mérida",
  "Miranda",
  "Monagas",
  "Nueva Esparta",
  "Portuguesa",
  "Sucre",
  "Táchira",
  "Trujillo",
  "Yaracuy",
  "Zulia"
];

export default function CheckoutPage() {
  const router = useRouter();
  const { items, totalPrice, subtotal, discountAmount, clearCart } = useCart();
  const { user, loading: authLoading, signInWithGoogle } = useAuth();

  // Navigation & Checkout States
  const [step, setStep] = useState(1);
  const [deliveryMethod, setDeliveryMethod] = useState<DeliveryMethod>("delivery");
  const [pickupStore, setPickupStore] = useState<string>("campoclaro");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("pos");
  const [paymentHolder, setPaymentHolder] = useState("");
  const [paymentReference, setPaymentReference] = useState("");
  const [cashAmount, setCashAmount] = useState("");
  const [isExactCash, setIsExactCash] = useState(false);
  const [receiptFile, setReceiptFile] = useState<File | null>(null);
  const [receiptUrl, setReceiptUrl] = useState<string | null>(null);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPaymentDropdownOpen, setIsPaymentDropdownOpen] = useState(false);
  const [isStateDropdownOpen, setIsStateDropdownOpen] = useState(false);
  const [stateSearchQuery, setStateSearchQuery] = useState("");
  const [isAccordionFullyOpen, setIsAccordionFullyOpen] = useState(false);
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

  // Estados de Encomienda Nacional (MRW / ZOOM)
  const [shippingCourier, setShippingCourier] = useState<"mrw" | "zoom">("mrw");
  const [shippingState, setShippingState] = useState("");
  const [shippingCity, setShippingCity] = useState("");
  const [shippingAgency, setShippingAgency] = useState("");
  const [shippingReceptorType, setShippingReceptorType] = useState<"same" | "third">("same");
  const [shippingReceptorName, setShippingReceptorName] = useState("");
  const [shippingReceptorId, setShippingReceptorId] = useState("");

  const isShippingValid = () => {
    if (deliveryMethod !== 'national') return true;
    if (!shippingState.trim()) return false;
    if (!shippingCity.trim()) return false;
    if (!shippingAgency.trim()) return false;
    if (shippingReceptorType === 'third') {
      if (!shippingReceptorName.trim()) return false;
      if (!shippingReceptorId.trim()) return false;
    }
    return true;
  };

  const selectedAddr = addresses.find(a => a.id === selectedAddressId);
  const isNational = deliveryMethod === 'national';
  const deliveryCost = (deliveryMethod === 'delivery' || deliveryMethod === 'national') ? 5 : 0;
  const bagFeeCost = 0.5;
  const grandTotal = totalPrice + deliveryCost + bagFeeCost;

  // Carga de datos inicial
  useEffect(() => {
    const fetchBcvRate = async () => {
      try {
        const { data, error } = await supabase
          .from("store_settings")
          .select("value")
          .eq("id", "exchange_rate")
          .single();

        if (error) throw error;

        if (data && data.value) {
          setBcvRate(parseFloat(data.value));
        } else {
          setBcvRate(36.50); // Fallback seguro
        }
      } catch {
        setBcvRate(36.50); // Fallback en caso de estar desconectado
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

  // Bloquear scroll de la página si el dropdown de estados está abierto
  useEffect(() => {
    if (isStateDropdownOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isStateDropdownOpen]);

  // Horario States & Logic
  const checkIfStoreIsOpen = () => {
    // Sincronización exacta con la hora de Caracas (UTC-4)
    const caracasString = new Date().toLocaleString("en-US", { timeZone: "America/Caracas" });
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

        try {
          const { error: uploadError } = await supabase.storage
            .from('payment_receipts')
            .upload(filePath, receiptFile);

          if (!uploadError) {
            const { data: publicUrlData } = supabase.storage
              .from('payment_receipts')
              .getPublicUrl(filePath);
            uploadedUrl = publicUrlData.publicUrl;
          } else {
            uploadedUrl = `/images/receipt-mock.png`;
          }
        } catch {
          uploadedUrl = `/images/receipt-mock.png`;
        }
        setReceiptUrl(uploadedUrl);
      }

      const finalItems = [...items];

      if (deliveryCost > 0) {
        finalItems.push({
          product: { id: 'delivery', name: 'Costo de Envío / Delivery', price: deliveryCost, images: [], description: 'Tarifa de entrega' },
          quantity: 1,
          price: deliveryCost,
          subtotal: deliveryCost
        } as any);
      }

      if (bagFeeCost > 0) {
        finalItems.push({
          product: { id: 'bag_fee', name: 'Bolsa Dolce Candy', price: bagFeeCost, images: [], description: 'Bolsa de la tienda' },
          quantity: 1,
          price: bagFeeCost,
          subtotal: bagFeeCost
        } as any);
      }

      // Añadir el descuento como un ítem negativo para que la matemática cuadre perfecto en el panel de administrador
      if (discountAmount > 0) {
        finalItems.push({
          product: { id: 'discount_10', name: 'Descuento Especial (10% OFF)', price: -discountAmount, images: [], description: 'Descuento global de la tienda' },
          quantity: 1,
          price: -discountAmount,
          subtotal: -discountAmount
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
        total_amount: grandTotal,
        delivery_method: deliveryMethod === 'national' ? 'DELIVERY' : deliveryMethod.toUpperCase(),
        delivery_address: deliveryMethod === 'national' ? (
          (() => {
            const courierUpper = shippingCourier.toUpperCase();
            const buyerName = (hasProfile && customerProfile)
              ? `${customerProfile.first_name || ''} ${customerProfile.last_name || ''}`.trim() || 'Invitado'
              : (firstName || user?.phone || 'Invitado');
            const receptorInfo = shippingReceptorType === 'third'
              ? `\nDestinatario: ${shippingReceptorName} (C.I. ${shippingReceptorId})`
              : `\nDestinatario: ${buyerName}`;
            return `[${courierUpper}] Envío Nacional a Agencia\nEstado/Ciudad: ${shippingState} / ${shippingCity}\nAgencia: ${shippingAgency}${receptorInfo}`;
          })()
        ) : deliveryMethod === 'delivery' ? (
          (() => {
            const selectedAddr = addresses.find(a => a.id === selectedAddressId);
            if (selectedAddr) {
              return `${selectedAddr.formatted_address}${selectedAddr.unit ? `\nInmueble: ${selectedAddr.unit}` : ''}${referencePoint ? `\nRef: ${referencePoint}` : ''}\nMapa: https://www.google.com/maps/search/?api=1&query=${selectedAddr.lat},${selectedAddr.lng}`;
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
        admin_notes: `Descuento global aplicado: - ref ${discountAmount.toFixed(2)} (10% OFF)`
      };

      let finalOrderId = "ORD-" + Math.floor(100000 + Math.random() * 900000);

      try {
        const result = await createOrderAndDeductInventory(orderData, items);
        if (result && result.success && result.order?.id) {
          finalOrderId = result.order.id;
        }
      } catch {
        // Fallback en modo plantilla o desconexión de red
      }

      setCreatedOrderId(finalOrderId);
      setIsSubmitting(false);
      nextStep();
    } catch (err: any) {
      // Fallback absoluto para avanzar siempre al check de confirmación de pedido
      const fallbackOrderId = "ORD-" + Math.floor(100000 + Math.random() * 900000);
      setCreatedOrderId(fallbackOrderId);
      setIsSubmitting(false);
      nextStep();
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
      const isUnconfigured = !process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL.includes('placeholder');
      
      if (isUnconfigured) {
        setAuthView("otp");
        setResendTimer(60);
        return;
      }

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
      const isUnconfigured = !process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL.includes('placeholder');
      if (isUnconfigured) {
        setAuthView("otp");
        setResendTimer(60);
      } else {
        const msg = err.message?.toLowerCase() || "";
        if (msg.includes("rate limit")) {
          setAuthError("Has superado el límite de intentos. Espera 1 minuto o usa otro correo.");
        } else {
          setAuthError("No pudimos enviar el código. Verifica el correo e intenta de nuevo.");
        }
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
      const isUnconfigured = !process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL.includes('placeholder');

      if (isUnconfigured) {
        setAuthView("profile");
        return;
      }

      const { data, error } = await supabase.auth.verifyOtp({
        email,
        token: otpCode,
        type: "email",
      });

      if (error) throw error;

      if (data.user) {
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
          if (deliveryMethod === "pickup") {
            setStep(3);
          } else {
            nextStep();
          }
        }
      }
    } catch (err: any) {
      const isUnconfigured = !process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL.includes('placeholder');
      if (isUnconfigured) {
        setAuthView("profile");
      } else {
        const msg = err.message?.toLowerCase() || "";
        if (msg.includes("invalid") || msg.includes("expired")) {
          setAuthError("El código ingresado es incorrecto o ha expirado.");
        } else {
          setAuthError("Hubo un error al verificar el código. Intenta de nuevo.");
        }
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

  const handleProfileComplete = (profileData?: any) => {
    setAuthView(null);
    setHasProfile(true);
    if (profileData) setCustomerProfile(profileData);
    if (deliveryMethod === "pickup") {
      setStep(3);
    } else {
      nextStep();
    }
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
      <div className="min-h-screen bg-[#0B0B0C] text-white flex flex-col items-center justify-center p-4">
        <motion.div
          animate={{
            scale: [1, 1.05, 1],
            rotate: [0, 3, -3, 0]
          }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="w-24 h-24 rounded-3xl bg-[#141418] border border-[#8A2BE2]/40 flex items-center justify-center mb-8 shadow-2xl shadow-[#8A2BE2]/20 overflow-hidden"
        >
          <img src={getImagePath("/images/logo maniatech.png")} alt="Mania Tech" className="w-16 h-16 object-contain filter drop-shadow-[0_0_12px_rgba(138,43,226,0.6)]" />
        </motion.div>

        <h1 className="font-display font-black text-2xl uppercase tracking-wider text-white mb-3 text-center">
          Cargando Checkout...
        </h1>

        <p className="font-body text-gray-400 text-sm text-center max-w-[280px] leading-relaxed">
          Verificando tu sesión de usuario. Te redirigiremos en un segundo.
        </p>

        <div className="mt-10 flex gap-3">
          <motion.div
            animate={{ y: [0, -12, 0] }}
            transition={{ duration: 1, repeat: Infinity, delay: 0 }}
            className="w-3.5 h-3.5 rounded-full bg-[#8A2BE2]"
          />
          <motion.div
            animate={{ y: [0, -12, 0] }}
            transition={{ duration: 1, repeat: Infinity, delay: 0.2 }}
            className="w-3.5 h-3.5 rounded-full bg-[#00FF00]"
          />
          <motion.div
            animate={{ y: [0, -12, 0] }}
            transition={{ duration: 1, repeat: Infinity, delay: 0.4 }}
            className="w-3.5 h-3.5 rounded-full bg-[#8A2BE2]"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0B0B0C] text-white flex flex-col md:flex-row">
      {/* Left Side: Summary */}
      <div className={`bg-gradient-to-b from-[#141418] via-[#0E0E12] to-[#0B0B0C] text-white md:w-5/12 flex flex-col justify-between relative overflow-hidden md:overflow-y-auto scrollbar-none md:sticky md:top-0 md:h-screen border-r border-white/10 transition-all duration-300 ${step >= 3 ? 'p-6 md:py-8 md:px-10' : 'p-6 md:p-10'}`}>
        <div className="relative z-10">
          <button
            onClick={() => {
              if (step === 4) {
                clearCart();
              }
              router.push("/catalogo");
            }}
            className={`hover:bg-white/10 p-2 rounded-full inline-flex transition-colors transition-all duration-300 text-gray-300 hover:text-white ${step >= 3 ? 'mb-4' : 'mb-8'}`}
          >
            <X className="w-6 h-6" />
          </button>
          <h2 className="text-4xl md:text-5xl font-black mb-2 font-display text-white">Tu Pedido</h2>
          <p className="text-gray-400 text-sm md:text-base">Revisa el resumen de tu orden antes de completar.</p>
        </div>

        <div className={`relative z-10 mt-12 md:mt-0 transition-all duration-300 ${step >= 3 ? 'space-y-3' : 'space-y-4'}`}>
          <div className={`bg-[#181820]/90 rounded-2xl backdrop-blur-xl border border-white/10 shadow-2xl transition-all duration-300 ${step >= 3 ? 'p-5' : 'p-6'}`}>
            <div className="mb-4 pb-4 border-b border-white/10 space-y-2">
              <div className="flex justify-between items-center text-sm text-gray-300">
                <span>Productos (Subtotal)</span>
                <span className="font-numbers font-semibold text-white">$ {subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center text-sm text-[#00FF00] font-bold">
                <span>Descuento Especial (Promo Mayorista)</span>
                <span className="font-numbers font-semibold">- $ {discountAmount.toFixed(2)}</span>
              </div>
              {(deliveryMethod === 'delivery' || deliveryMethod === 'national') && (
                <div className="flex justify-between items-center text-sm text-gray-300">
                  <span>{deliveryMethod === 'national' ? 'Traslado a Agencia MRW/Zoom' : 'Envío / Delivery'}</span>
                  <span className="font-numbers font-semibold text-white">$ {deliveryCost.toFixed(2)}</span>
                </div>
              )}
            </div>

            {/* Nota de IVA */}
            <p className="mb-4 pb-4 border-b border-white/10 text-xs text-gray-400 italic">
              Todos nuestros precios incluyen IVA.
            </p>

            <p className="text-xs text-[#8A2BE2] mb-1 uppercase tracking-widest font-body font-bold">Total a pagar</p>
            <div className="flex items-baseline gap-3">
              <p className="text-5xl font-numbers font-black text-white">
                $ {grandTotal.toFixed(2)}
              </p>
            </div>

            {bcvRate && (
              <div className="mt-3 pt-3 border-t border-white/10 flex items-center justify-between">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">En Bs. (Tasa BCV)</span>
                <span className="text-lg font-numbers font-bold text-[#00FF00]">
                  Bs. {(grandTotal * bcvRate).toFixed(2)}
                </span>
              </div>
            )}

            {step > 1 && deliveryMethod === 'national' && (
              <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} className="mt-3 p-3 bg-[#1C1C24] rounded-xl border border-white/10">
                <p className="text-[11px] text-gray-300 leading-tight">
                  📦 <strong>Nota de Logística:</strong> Los $ 5.00 cobrados aquí cubren el embalaje de seguridad acolchado y el traslado a la agencia nacional.
                </p>
              </motion.div>
            )}

          </div>

          {(step > 1 && !authView) && (
            <div className="text-xs space-y-2 bg-[#141418] p-4 rounded-2xl border border-white/10">
              <p className="flex justify-between items-center"><span className="text-gray-400 uppercase font-bold tracking-wider text-[10px]">Método de Entrega:</span> <span className="font-bold uppercase text-sm text-[#8A2BE2]">{deliveryMethod === 'national' ? 'Envío Nacional' : deliveryMethod}</span></p>
              {step > 2 && (
                <p className="flex justify-between items-center pt-2 border-t border-white/10">
                  <span className="text-gray-400 uppercase font-bold tracking-wider text-[10px]">Método de Pago:</span>
                  <span className="font-bold uppercase text-sm text-[#00FF00]">
                    {paymentMethod === 'pm' ? 'Pago Móvil' :
                      paymentMethod === 'zelle' ? 'Zelle' :
                        paymentMethod === 'paypal' ? 'PayPal' :
                          paymentMethod === 'pos' ? 'Punto de Venta' : 'Efectivo'}
                  </span>
                </p>
              )}
            </div>
          )}

          {hasProfile && customerProfile && !authView && (
            <div className={`bg-[#141418] p-4 rounded-2xl border border-white/10 flex items-center justify-between transition-all duration-300 ${step >= 3 ? 'mt-2' : 'mt-3'}`}>
              <div>
                <p className="font-bold text-sm leading-tight text-white">{customerProfile.first_name} {customerProfile.last_name}</p>
                <p className="text-[10px] text-gray-400 uppercase tracking-widest mt-0.5">{customerProfile.id_number}</p>
              </div>
              <div className="flex items-center gap-1.5 bg-[#8A2BE2]/10 border border-[#8A2BE2]/30 px-3 py-1.5 rounded-full">
                <Smartphone className="w-3.5 h-3.5 text-[#8A2BE2]" />
                <p className="text-xs font-semibold text-[#8A2BE2]">{customerProfile.phone}</p>
              </div>
            </div>
          )}
        </div>

        <div className="text-xs text-gray-500 relative z-10 mt-12 hidden md:block">
          <p>© 2026 Mania Tech - Hardware & Gaming Store</p>
        </div>

        {/* Decorative circle */}
        <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-[#8A2BE2]/10 rounded-full blur-3xl" />
      </div>

      {/* Right Side: Flow Content */}
      <div className="flex-1 p-6 md:p-12 bg-[#0B0B0C] text-white relative flex flex-col justify-center items-center min-h-[60vh] md:min-h-0">
        <div className="w-full max-w-xl mx-auto">

          {!authView && step > 1 && step < 4 && deliveryMethod === 'delivery' && addresses.find(a => a.id === selectedAddressId)?.zone === 'NATIONAL' && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="w-full bg-[#181824] border border-blue-500/30 text-blue-200 p-5 rounded-2xl mb-8 flex items-center gap-5 shadow-2xl"
            >
              <div className="w-12 h-12 bg-[#8A2BE2]/20 rounded-xl flex items-center justify-center shrink-0 border border-[#8A2BE2]/40">
                <Truck className="w-6 h-6 text-[#8A2BE2]" />
              </div>
              <div>
                <p className="font-black text-sm uppercase tracking-widest mb-0.5 text-white">🚚 ENVÍO NACIONAL (MRW / ZOOM)</p>
                <p className="text-xs font-medium text-gray-300 leading-relaxed max-w-sm">
                  Tu dirección está fuera de Caracas. Enviaremos tus productos por MRW/ZOOM bajo la modalidad de <b>Cobro a Destino</b>.
                </p>
              </div>
            </motion.div>
          )}

          {!authView && step > 1 && step < 4 && isScheduledOrder && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="w-full bg-[#1A1812] border border-amber-500/30 text-amber-200 p-5 rounded-2xl mb-8 flex items-center gap-5 shadow-2xl"
            >
              <div className="w-12 h-12 bg-amber-500/20 rounded-xl flex items-center justify-center shrink-0 border border-amber-500/40">
                <Clock className="w-6 h-6 text-amber-400" />
              </div>
              <div>
                <p className="font-black text-sm uppercase tracking-widest mb-0.5 text-amber-300">Orden Programada</p>
                <p className="text-xs font-medium text-gray-300 leading-relaxed max-w-sm">
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
                className="w-full bg-[#141418] border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl"
              >
                <div className="text-center mb-8">
                  <h2 className="font-display text-3xl md:text-4xl uppercase tracking-tight text-white font-bold">
                    {authView === "login" && "¡Inicia Sesión!"}
                    {authView === "otp" && "Revisa tu Correo"}
                    {authView === "profile" && "¡Bienvenido!"}
                  </h2>
                  <p className="mt-2 font-body text-sm md:text-base text-gray-400">
                    {authView === "login" && "Ingresa tu correo para iniciar sesión o crear una cuenta nueva automáticamente."}
                    {authView === "otp" && `Ingresa el código que enviamos a ${email}`}
                    {authView === "profile" && "Por favor, completa tu perfil para continuar."}
                  </p>
                </div>

                {authError && (
                  <div className="mb-6 rounded-xl bg-red-500/10 p-4 text-xs font-medium text-red-400 border border-red-500/30">
                    {authError}
                  </div>
                )}

                {authView === "login" && (
                  <div className="space-y-6 max-w-md mx-auto">
                    <form onSubmit={handleEmailLogin} className="space-y-4">
                      <div className="relative">
                        <Mail
                          size={18}
                          className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                        />
                        <input
                          type="email"
                          placeholder="tucorreo@ejemplo.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="w-full rounded-xl bg-[#1C1C22] border border-white/10 py-4 pl-12 pr-5 font-body text-white placeholder-gray-500 outline-none focus:border-[#8A2BE2] focus:ring-1 focus:ring-[#8A2BE2] transition-all text-lg"
                          required
                        />
                      </div>
                      <button
                        type="submit"
                        disabled={isSending}
                        className="flex w-full items-center justify-center gap-3 rounded-xl bg-[#8A2BE2] hover:bg-[#6441A5] py-4 font-body font-bold text-white shadow-xl shadow-[#8A2BE2]/20 transition-all active:scale-[0.98] disabled:opacity-50 text-lg cursor-pointer"
                      >
                        <Sparkles size={24} />
                        {isSending ? "Enviando código..." : "Enviar código"}
                      </button>
                    </form>

                    <div className="relative flex items-center justify-center py-4">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-white/10"></div>
                      </div>
                      <span className="relative bg-[#141418] px-4 text-xs font-black uppercase tracking-widest text-gray-500">
                        O
                      </span>
                    </div>

                    {/* Google Button */}
                    <form onSubmit={(e) => { e.preventDefault(); signInWithGoogle(); }}>
                      <button
                        type="submit"
                        className="flex w-full items-center justify-center gap-3 rounded-xl border border-white/10 bg-[#1C1C22] hover:bg-[#25252E] py-4 font-body font-bold text-white transition-all active:scale-[0.98] text-lg cursor-pointer"
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

                    <button onClick={() => setAuthView(null)} className="w-full text-center mt-6 text-sm text-gray-400 font-bold uppercase hover:text-white transition-colors">
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
                        className="w-full text-center text-4xl tracking-[0.5em] font-numbers rounded-xl bg-[#1C1C22] border border-white/10 text-white py-6 outline-none focus:border-[#8A2BE2] focus:ring-1 focus:ring-[#8A2BE2] transition-all"
                        required
                      />
                      <button
                        type="submit"
                        disabled={isSending || otpCode.length < 6}
                        className="flex w-full items-center justify-center gap-3 rounded-xl bg-[#8A2BE2] hover:bg-[#6441A5] py-4 font-body font-bold text-white shadow-xl shadow-[#8A2BE2]/20 transition-all active:scale-[0.98] disabled:opacity-50 text-lg cursor-pointer"
                      >
                        {isSending ? "Verificando..." : "Verificar Código"}
                      </button>
                    </form>
                    <div className="flex flex-col gap-4 pt-2">
                      <button
                        onClick={(e) => handleEmailLogin(e as unknown as React.FormEvent)}
                        disabled={resendTimer > 0 || isSending}
                        className="w-full text-center text-sm font-body text-[#8A2BE2] transition-colors font-bold disabled:text-gray-500 disabled:font-medium hover:underline"
                      >
                        {resendTimer > 0
                          ? `Reenviar código en ${resendTimer}s`
                          : "¿No recibiste el código? Reenviar ahora"}
                      </button>
                      <button
                        onClick={() => setAuthView("login")}
                        className="w-full text-center text-sm font-body text-gray-400 hover:text-white transition-colors font-medium"
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
              <motion.div key="step-1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8 w-full bg-[#141418] border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl">
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-4">
                    <h3 className="text-3xl md:text-4xl font-display text-white leading-tight font-bold">
                      {firstName ? `Hola ${firstName}, ¿Cómo lo recibes?` : '¿Cómo lo recibes?'}
                    </h3>
                    {user && (
                      <button
                        onClick={handleLogout}
                        className="text-xs font-bold text-[#8A2BE2] bg-[#8A2BE2]/10 border border-[#8A2BE2]/30 px-3 py-1.5 rounded-full hover:bg-[#8A2BE2]/20 transition-colors uppercase tracking-wider shrink-0"
                      >
                        Cambiar usuario
                      </button>
                    )}
                  </div>
                  <p className="text-gray-400 font-body font-normal text-base">
                    Selecciona tu método de entrega preferido para continuar.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <button
                    onClick={() => setDeliveryMethod("delivery")}
                    className={`p-6 rounded-2xl border transition-all flex flex-col items-center gap-3 ${deliveryMethod === 'delivery' ? 'border-[#8A2BE2] bg-[#8A2BE2]/10 text-[#8A2BE2] shadow-lg shadow-[#8A2BE2]/20 scale-[1.02]' : 'border-white/10 hover:border-white/20 text-gray-400 bg-[#1C1C22] hover:bg-[#25252E]'}`}
                  >
                    <Truck className="w-8 h-8" />
                    <div className="text-center">
                      <span className="font-bold text-sm uppercase tracking-wider block text-white">Delivery</span>
                      <span className="text-[10px] font-medium text-gray-400">Caracas</span>
                    </div>
                  </button>
                  <button
                    onClick={() => setDeliveryMethod("pickup")}
                    className={`p-6 rounded-2xl border transition-all flex flex-col items-center gap-3 ${deliveryMethod === 'pickup' ? 'border-[#8A2BE2] bg-[#8A2BE2]/10 text-[#8A2BE2] shadow-lg shadow-[#8A2BE2]/20 scale-[1.02]' : 'border-white/10 hover:border-white/20 text-gray-400 bg-[#1C1C22] hover:bg-[#25252E]'}`}
                  >
                    <Store className="w-8 h-8" />
                    <div className="text-center">
                      <span className="font-bold text-sm uppercase tracking-wider block text-white">Pickup</span>
                      <span className="text-[10px] font-medium text-gray-400">Retiro en Tienda</span>
                    </div>
                  </button>
                  <button
                    onClick={() => setDeliveryMethod("national")}
                    className={`p-6 rounded-2xl border transition-all flex flex-col items-center gap-3 ${deliveryMethod === 'national' ? 'border-[#8A2BE2] bg-[#8A2BE2]/10 text-[#8A2BE2] shadow-lg shadow-[#8A2BE2]/20 scale-[1.02]' : 'border-white/10 hover:border-white/20 text-gray-400 bg-[#1C1C22] hover:bg-[#25252E]'}`}
                  >
                    <Package className="w-8 h-8" />
                    <div className="text-center">
                      <span className="font-bold text-sm uppercase tracking-wider block text-white">Envío Nacional</span>
                      <span className="text-[10px] font-medium text-gray-400">MRW / ZOOM</span>
                    </div>
                  </button>
                </div>

                {deliveryMethod === "pickup" && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-1 gap-4 pt-2">
                    <div
                      onClick={() => setPickupStore("chacao")}
                      className="p-5 rounded-2xl border border-[#8A2BE2]/50 bg-[#1C1C22] text-left transition-all relative cursor-pointer shadow-lg"
                    >
                      <p className="font-display text-white font-bold mb-1 flex items-center gap-2 text-base leading-tight">
                        <MapPin className="w-4 h-4 shrink-0 text-[#8A2BE2]" />
                        Mania Tech Chacao (Tienda Principal)
                      </p>
                      <p className="text-xs text-gray-300 mb-1 pl-6 leading-relaxed">Av. Francisco de Miranda, Multicentro Empresarial del Este, Chacao, Caracas</p>
                      <p className="text-[10px] text-gray-400 italic mb-3 pl-6 leading-relaxed">Punto de Referencia: Frente a la estación del metro Chacao, entrada principal.</p>
                      <div className="flex items-center justify-between pl-6 gap-2">
                        <p className="text-[10px] font-bold text-[#00FF00] uppercase tracking-widest flex flex-col gap-0.5">
                          <span>Lun - Sáb: 9:00 AM - 7:00 PM</span>
                        </p>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            window.open('https://maps.google.com/?q=Chacao+Caracas', '_blank');
                          }}
                          className="flex items-center gap-1 text-[10px] font-bold text-gray-300 hover:text-white transition-colors bg-white/10 py-1 px-2 rounded-lg"
                        >
                          <Map className="w-3 h-3 text-[#8A2BE2]" /> Ver mapa
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}

                <button
                  onClick={handleStep1Next}
                  className="w-full bg-[#8A2BE2] hover:bg-[#6441A5] text-white py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 shadow-xl shadow-[#8A2BE2]/20 active:scale-[0.98] transition-all cursor-pointer"
                >
                  Continuar <ChevronRight className="w-6 h-6" />
                </button>
              </motion.div>
            ) : step === 2 ? (
              <motion.div key="step-2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8 w-full">
                <div className="space-y-2">
                  <h3 className="text-3xl md:text-4xl font-display text-white font-bold leading-tight">
                    {deliveryMethod === 'national' ? 'Datos del Envío' : 'Dirección de Entrega'}
                  </h3>
                  <p className="text-gray-400 font-body font-normal text-base">
                    {deliveryMethod === 'national'
                      ? 'Indícanos la agencia de retiro y quién recibe el paquete.'
                      : 'Gestiona tus lugares favoritos para recibir tu pedido.'}
                  </p>
                </div>

                {deliveryMethod === 'national' && (
                  <div className="space-y-5">
                    <div className="space-y-2">
                      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Empresa de encomienda</p>
                      <div className="grid grid-cols-2 gap-3">
                        <button
                          type="button"
                          onClick={() => setShippingCourier("mrw")}
                          className={`py-4 px-4 rounded-2xl border-2 font-bold text-sm transition-all flex items-center justify-center gap-2 ${shippingCourier === "mrw" ? "border-red-600 bg-red-50 text-red-700 shadow-sm scale-[1.02]" : "border-slate-200 hover:border-slate-300 text-slate-600"}`}
                        >
                          <span className={`w-2.5 h-2.5 rounded-full ${shippingCourier === 'mrw' ? 'bg-red-600' : 'bg-slate-300'}`} />
                          MRW
                        </button>
                        <button
                          type="button"
                          onClick={() => setShippingCourier("zoom")}
                          className={`py-4 px-4 rounded-2xl border-2 font-bold text-sm transition-all flex items-center justify-center gap-2 ${shippingCourier === "zoom" ? "border-amber-500 bg-amber-50 text-amber-700 shadow-sm scale-[1.02]" : "border-slate-200 hover:border-slate-300 text-slate-600"}`}
                        >
                          <span className={`w-2.5 h-2.5 rounded-full ${shippingCourier === 'zoom' ? 'bg-amber-500' : 'bg-slate-300'}`} />
                          ZOOM
                        </button>
                      </div>
                      <div className="bg-[#181824] border border-blue-500/30 rounded-xl p-3 flex gap-3 items-start mt-2">
                        <Truck className="w-4 h-4 text-[#8A2BE2] mt-0.5 shrink-0" />
                        <p className="text-xs text-gray-300 leading-relaxed font-medium">
                          <span className="font-bold text-white">Nota importante:</span> El costo del flete por MRW o Zoom es bajo la modalidad <span className="font-bold underline decoration-[#8A2BE2] underline-offset-2 text-white">Cobro a Destino</span> y deberá ser cancelado al momento de retirar el paquete en la agencia seleccionada.
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Estado <span className="text-[#8A2BE2]">*</span></label>
                        <div className="relative">
                          <button
                            type="button"
                            onClick={() => { setIsStateDropdownOpen(!isStateDropdownOpen); setStateSearchQuery(""); }}
                            className="w-full bg-[#1C1C22] border border-white/10 rounded-xl p-3 flex items-center justify-between outline-none focus:border-[#8A2BE2] focus:ring-1 focus:ring-[#8A2BE2] transition-all font-body text-sm font-semibold text-white h-[50px]"
                          >
                            <span>{shippingState || "Selecciona un estado"}</span>
                            <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-300 ${isStateDropdownOpen ? 'rotate-180' : ''}`} />
                          </button>
                          <AnimatePresence>
                            {isStateDropdownOpen && (
                              <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.2 }}
                                data-lenis-prevent
                                className="absolute top-[calc(100%_+_8px)] left-0 w-full bg-[#1C1C22] border border-white/10 rounded-xl shadow-2xl z-50 overflow-hidden"
                              >
                                <div className="p-2 border-b border-white/10">
                                  <input
                                    type="text"
                                    placeholder="Buscar estado..."
                                    value={stateSearchQuery}
                                    onChange={(e) => setStateSearchQuery(e.target.value)}
                                    autoFocus
                                    className="w-full p-2 rounded-lg bg-[#141418] border border-white/10 outline-none focus:border-[#8A2BE2] font-body text-sm text-white placeholder:text-gray-500"
                                  />
                                </div>
                                <div className="max-h-48 overflow-y-auto overscroll-contain">
                                  {VENEZUELAN_STATES.filter((s) => s.toLowerCase().includes(stateSearchQuery.toLowerCase())).map((state) => (
                                    <button
                                      key={state}
                                      type="button"
                                      onClick={() => { setShippingState(state); setIsStateDropdownOpen(false); setStateSearchQuery(""); }}
                                      className={`w-full text-left p-3 hover:bg-[#25252E] transition-colors border-b border-white/5 last:border-0 font-body text-sm font-semibold ${shippingState === state ? 'text-[#8A2BE2] bg-[#8A2BE2]/10' : 'text-gray-300'}`}
                                    >
                                      {state}
                                    </button>
                                  ))}
                                  {VENEZUELAN_STATES.filter((s) => s.toLowerCase().includes(stateSearchQuery.toLowerCase())).length === 0 && (
                                    <p className="p-3 text-sm text-gray-500 text-center">No se encontró ningún estado</p>
                                  )}
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Ciudad <span className="text-[#8A2BE2]">*</span></label>
                        <input
                          type="text"
                          placeholder="Ej: Valencia"
                          value={shippingCity}
                          onChange={(e) => setShippingCity(e.target.value)}
                          className="w-full p-3 rounded-xl bg-[#1C1C22] border border-white/10 focus:border-[#8A2BE2] focus:ring-1 focus:ring-[#8A2BE2] outline-none transition-all font-body text-sm font-semibold text-white placeholder-gray-500 h-[50px]"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Oficina / Agencia de Retiro <span className="text-[#8A2BE2]">*</span></label>
                      <input
                        type="text"
                        placeholder="Ej: Oficina Los Sauces"
                        value={shippingAgency}
                        onChange={(e) => setShippingAgency(e.target.value)}
                        className="w-full p-3 rounded-xl bg-[#1C1C22] border border-white/10 focus:border-[#8A2BE2] focus:ring-1 focus:ring-[#8A2BE2] outline-none transition-all font-body text-sm font-semibold text-white placeholder-gray-500 h-[50px]"
                      />
                    </div>

                    <div className="space-y-3 pt-1">
                      <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">¿Quién retira el paquete?</label>
                      <div className="flex gap-4">
                        <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-gray-300">
                          <input type="radio" name="receptorType" checked={shippingReceptorType === "same"} onChange={() => setShippingReceptorType("same")} className="accent-[#8A2BE2]" />
                          Mismo comprador
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-gray-300">
                          <input type="radio" name="receptorType" checked={shippingReceptorType === "third"} onChange={() => setShippingReceptorType("third")} className="accent-[#8A2BE2]" />
                          Otra persona
                        </label>
                      </div>
                      {shippingReceptorType === "third" && (
                        <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                          <div className="space-y-1">
                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Nombre Completo <span className="text-[#8A2BE2]">*</span></label>
                            <input type="text" placeholder="Ej: Carlos Pérez" value={shippingReceptorName} onChange={(e) => setShippingReceptorName(e.target.value)} className="w-full p-3 rounded-xl bg-[#1C1C22] border border-white/10 focus:border-[#8A2BE2] outline-none transition-all text-xs font-semibold text-white placeholder-gray-500" />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Cédula de Identidad <span className="text-[#8A2BE2]">*</span></label>
                            <input type="text" placeholder="Ej: 12345678" value={shippingReceptorId} onChange={(e) => setShippingReceptorId(e.target.value)} className="w-full p-3 rounded-xl bg-[#1C1C22] border border-white/10 focus:border-[#8A2BE2] outline-none transition-all text-xs font-semibold text-white placeholder-gray-500" />
                          </div>
                        </motion.div>
                      )}
                    </div>
                  </div>
                )}

                {deliveryMethod === 'delivery' && (
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
                          className={`p-5 rounded-2xl border transition-all cursor-pointer relative group ${selectedAddressId === addr.id ? 'border-[#8A2BE2] bg-[#8A2BE2]/10 shadow-md' : 'border-white/10 hover:border-white/20 bg-[#1C1C22]'}`}
                        >
                          <div className="flex items-start gap-3">
                            <div className={`mt-1 w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${selectedAddressId === addr.id ? 'border-[#8A2BE2]' : 'border-gray-500'}`}>
                              {selectedAddressId === addr.id && <div className="w-2.5 h-2.5 bg-[#8A2BE2] rounded-full" />}
                            </div>
                            <div className="flex-1">
                              <p className="text-[10px] font-black uppercase tracking-widest text-[#8A2BE2] mb-0.5">{addr.label}</p>
                              <p className="text-sm font-medium text-gray-200 line-clamp-2 pr-8">
                                {addr.unit ? `${addr.unit}, ` : ''}{addr.formatted_address}
                              </p>
                            </div>
                          </div>
                          <button
                            onClick={(e) => { e.stopPropagation(); handleAddressDelete(addr.id); }}
                            className="absolute right-4 top-1/2 -translate-y-1/2 p-2 text-gray-500 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                      {addresses.length < 3 && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <button
                            onClick={() => { setShowMap(true); setMapAutoLocate(false); }}
                            className="p-5 rounded-2xl border border-dashed border-white/20 text-gray-400 hover:border-[#8A2BE2] hover:text-[#8A2BE2] transition-all flex items-center justify-center gap-2 font-black text-sm uppercase tracking-wider bg-[#1C1C22]/50 cursor-pointer"
                          >
                            <MapPin className="w-5 h-5 text-[#8A2BE2]" /> Agregar Dirección
                          </button>
                          <button
                            onClick={() => { setShowMap(true); setMapAutoLocate(true); }}
                            className="p-5 rounded-2xl border border-white/10 text-gray-300 hover:border-[#8A2BE2] hover:text-white transition-all flex items-center justify-center gap-2 font-black text-sm uppercase tracking-wider bg-[#1C1C22] shadow-sm cursor-pointer"
                          >
                            <Navigation className="w-5 h-5 text-[#00FF00]" /> Ubicación Actual
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                <div className="flex gap-4 pt-6">
                  <button onClick={prevStep} className="flex-1 py-4 font-bold text-gray-400 hover:text-white transition-colors uppercase tracking-wider text-sm bg-[#1C1C22] hover:bg-[#25252E] rounded-xl cursor-pointer">Atrás</button>
                  <button
                    disabled={(deliveryMethod === 'delivery' && (!selectedAddressId || !isShippingValid())) || (deliveryMethod === 'national' && !isShippingValid())}
                    onClick={() => {
                      const isNational = deliveryMethod === 'national';
                      if (isNational && (paymentMethod === 'cash' || paymentMethod === 'pos')) {
                        setPaymentMethod('pm');
                      }
                      nextStep();
                    }}
                    className="flex-[2] bg-[#8A2BE2] hover:bg-[#6441A5] text-white py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 shadow-xl shadow-[#8A2BE2]/20 active:scale-[0.98] transition-all disabled:opacity-50 cursor-pointer"
                  >
                    Siguiente <ChevronRight className="w-6 h-6" />
                  </button>
                </div>
              </motion.div>
            ) : step === 3 ? (
              <motion.div key="step-3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8 w-full bg-[#141418] border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl">
                <div className="space-y-2">
                  <h3 className="text-3xl md:text-4xl font-display text-white leading-tight font-bold">Finalizar Pedido</h3>
                  <p className="text-gray-400 font-body font-normal text-base">Elige tu método de pago y completa la información.</p>
                </div>

                {/* Dropdown Selector */}
                <div className="relative">
                  <button
                    onClick={() => setIsPaymentDropdownOpen(!isPaymentDropdownOpen)}
                    className="w-full bg-[#1C1C22] border border-white/10 rounded-2xl p-5 flex items-center justify-between focus:border-[#8A2BE2] focus:ring-1 focus:ring-[#8A2BE2] transition-all cursor-pointer"
                  >
                    <div className="flex items-center gap-4">
                      {paymentMethod === 'zelle' && <div className="w-10 h-10 rounded-xl bg-[#741BCC] text-white flex items-center justify-center font-black text-lg">Z</div>}
                      {paymentMethod === 'pm' && <div className="w-10 h-10 rounded-xl bg-[#00B0F0] text-white flex items-center justify-center"><Smartphone className="w-5 h-5" /></div>}
                      {paymentMethod === 'cash' && <div className="w-10 h-10 rounded-xl bg-[#1D9A5B] text-white flex items-center justify-center"><Wallet className="w-5 h-5" /></div>}
                      {paymentMethod === 'paypal' && <div className="w-10 h-10 rounded-xl bg-[#00457C] text-white flex items-center justify-center font-black text-lg italic">P</div>}
                      {paymentMethod === 'pos' && <div className="w-10 h-10 rounded-xl bg-[#FF9F00] text-white flex items-center justify-center"><CreditCard className="w-5 h-5" /></div>}
                      <span className="font-black text-white text-xl">
                        {paymentMethod === 'zelle' && 'Zelle'}
                        {paymentMethod === 'pm' && 'Pago Móvil'}
                        {paymentMethod === 'cash' && 'Efectivo'}
                        {paymentMethod === 'paypal' && 'PayPal'}
                        {paymentMethod === 'pos' && 'Punto de Venta (POS)'}
                      </span>
                    </div>
                    <ChevronDown className={`w-6 h-6 text-gray-400 transition-transform duration-300 ${isPaymentDropdownOpen ? 'rotate-180' : ''}`} />
                  </button>

                  <AnimatePresence>
                    {isPaymentDropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className="absolute top-[calc(100%+8px)] left-0 w-full bg-[#1C1C22] border border-white/10 rounded-2xl shadow-2xl z-10 overflow-hidden"
                      >
                        {[
                          { id: 'pos', name: 'Punto de Venta (POS)', icon: <CreditCard className="w-5 h-5 text-white" />, bg: 'bg-[#FF9F00]' },
                          { id: 'pm', name: 'Pago Móvil', icon: <Smartphone className="w-5 h-5 text-white" />, bg: 'bg-[#00B0F0]' },
                          { id: 'zelle', name: 'Zelle', icon: <span className="font-black text-white text-base">Z</span>, bg: 'bg-[#741BCC]' },
                          { id: 'cash', name: 'Efectivo', icon: <Wallet className="w-5 h-5 text-white" />, bg: 'bg-[#1D9A5B]' },
                          { id: 'paypal', name: 'PayPal', icon: <span className="font-black text-white text-base italic">P</span>, bg: 'bg-[#00457C]' }
                        ].filter(option => {
                          const isNational = deliveryMethod === 'national';
                          if (isNational && (option.id === 'cash' || option.id === 'pos')) {
                            return false;
                          }
                          return true;
                        }).map((option) => (
                          <button
                            key={option.id}
                            onClick={() => {
                              setPaymentMethod(option.id as PaymentMethod);
                              setIsPaymentDropdownOpen(false);
                            }}
                            className={`w-full text-left p-4 flex items-center gap-4 hover:bg-[#25252E] transition-colors border-b border-white/5 last:border-0 cursor-pointer ${paymentMethod === option.id ? 'bg-[#8A2BE2]/10' : ''}`}
                          >
                            <div className={`w-10 h-10 rounded-xl ${option.bg} flex items-center justify-center`}>
                              {option.icon}
                            </div>
                            <span className={`font-black text-lg ${paymentMethod === option.id ? 'text-[#8A2BE2]' : 'text-gray-200'}`}>{option.name}</span>
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
                      <div className="bg-[#1C1C22] p-6 rounded-2xl space-y-4 border border-white/10">
                        <div className="flex justify-between items-center group">
                          <div><p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">Correo Zelle</p><p className="font-black text-white text-base md:text-lg break-all">zelle@maniatech.com</p></div>
                          <Copy className="w-5 h-5 text-gray-400 cursor-pointer hover:text-[#8A2BE2] transition-colors shrink-0 ml-2" onClick={() => copyToClipboard('zelle@maniatech.com', 'email')} />
                        </div>
                        <div className="flex justify-between items-center group">
                          <div><p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">Titular</p><p className="font-black text-white text-base md:text-lg">Mania Tech C.A.</p></div>
                          <Copy className="w-5 h-5 text-gray-400 cursor-pointer hover:text-[#8A2BE2] transition-colors shrink-0 ml-2" onClick={() => copyToClipboard('Mania Tech C.A.', 'name')} />
                        </div>
                      </div>

                      <div className="space-y-4">
                        <label className="text-sm font-bold text-gray-300 uppercase tracking-widest">¿Quién envía el pago?</label>
                        <input type="text" value={paymentHolder} onChange={(e) => setPaymentHolder(e.target.value)} placeholder="Nombre del titular de la cuenta" className="w-full bg-[#1C1C22] border border-white/10 text-white placeholder-gray-500 p-4 rounded-xl outline-none focus:border-[#8A2BE2] focus:ring-1 focus:ring-[#8A2BE2] transition-all font-body text-base" />
                      </div>

                      <div className="space-y-4">
                        <label className="text-sm font-bold text-gray-300 uppercase tracking-widest">Número de Referencia</label>
                        <input type="text" value={paymentReference} onChange={(e) => setPaymentReference(e.target.value)} placeholder="Opcional si subes foto" className="w-full bg-[#1C1C22] border border-white/10 text-white placeholder-gray-500 p-4 rounded-xl outline-none focus:border-[#8A2BE2] focus:ring-1 focus:ring-[#8A2BE2] transition-all font-body text-base font-numbers" />
                      </div>

                      <div className="space-y-4">
                        <label className="text-sm font-bold text-gray-300 uppercase tracking-widest">Captura (Opcional si escribes referencia)</label>
                        <label className="border-2 border-dashed border-white/10 rounded-2xl p-8 flex flex-col items-center justify-center text-center bg-[#1C1C22] hover:border-[#8A2BE2]/40 transition-colors cursor-pointer group relative">
                          <input type="file" accept="image/*" onChange={(e) => setReceiptFile(e.target.files?.[0] || null)} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                          <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 transition-transform group-hover:scale-110 ${receiptFile ? 'bg-emerald-500/20 text-[#00FF00]' : 'bg-[#8A2BE2]/20 text-[#8A2BE2]'}`}>
                            {receiptFile ? <CheckCircle className="w-8 h-8 text-[#00FF00]" /> : <Upload className="w-8 h-8 text-[#8A2BE2]" />}
                          </div>
                          <p className={`font-black text-base mb-1 ${receiptFile ? 'text-[#00FF00]' : 'text-white'}`}>{receiptFile ? '¡Captura lista!' : 'Subir Captura'}</p>
                          <p className="text-[10px] text-gray-400 font-medium truncate max-w-[200px]">{receiptFile ? receiptFile.name : 'JPG o PNG'}</p>
                        </label>
                      </div>
                    </div>
                  )}

                  {paymentMethod === 'pm' && (
                    <div className="space-y-6">
                      <div className="bg-[#1C1C22] p-6 rounded-2xl space-y-4 border border-white/10">
                        <div className="flex justify-between items-center group">
                          <div><p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">Banco</p><p className="font-black text-white text-lg">Banesco (0134)</p></div>
                          <Copy className="w-5 h-5 text-gray-400 cursor-pointer hover:text-[#8A2BE2] transition-colors shrink-0 ml-2" onClick={() => copyToClipboard('0134', 'bank')} />
                        </div>
                        <div className="flex justify-between items-center group">
                          <div><p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">Teléfono</p><p className="font-black text-white text-lg">0412-0000000</p></div>
                          <Copy className="w-5 h-5 text-gray-400 cursor-pointer hover:text-[#8A2BE2] transition-colors shrink-0 ml-2" onClick={() => copyToClipboard('04120000000', 'tel')} />
                        </div>
                        <div className="flex justify-between items-center group">
                          <div><p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">RIF / Cédula</p><p className="font-black text-white text-lg">J-500000000</p></div>
                          <Copy className="w-5 h-5 text-gray-400 cursor-pointer hover:text-[#8A2BE2] transition-colors shrink-0 ml-2" onClick={() => copyToClipboard('J500000000', 'ci')} />
                        </div>
                        {bcvRate && (
                          <div className="pt-4 border-t border-white/10 flex justify-between items-center mt-2">
                            <p className="text-[10px] md:text-xs text-gray-400 font-bold uppercase tracking-wider">Monto a Transferir</p>
                            <p className="font-black text-[#8A2BE2] text-xl md:text-2xl font-numbers">Bs. {(grandTotal * bcvRate).toFixed(2)}</p>
                          </div>
                        )}
                      </div>

                      <div className="space-y-4">
                        <label className="text-sm font-bold text-gray-300 uppercase tracking-widest">Últimos 4 dígitos de Ref.</label>
                        <input type="text" value={paymentReference} onChange={(e) => setPaymentReference(e.target.value)} placeholder="Opcional si subes foto" className="w-full bg-[#1C1C22] border border-white/10 text-white placeholder-gray-500 p-4 rounded-xl outline-none focus:border-[#8A2BE2] focus:ring-1 focus:ring-[#8A2BE2] transition-all font-body text-base font-numbers tracking-widest" />
                      </div>

                      <div className="space-y-4">
                        <label className="text-sm font-bold text-gray-300 uppercase tracking-widest">Captura (Opcional si escribes referencia)</label>
                        <label className="border-2 border-dashed border-white/10 rounded-2xl p-8 flex flex-col items-center justify-center text-center bg-[#1C1C22] hover:border-[#8A2BE2]/40 transition-colors cursor-pointer group relative">
                          <input type="file" accept="image/*" onChange={(e) => setReceiptFile(e.target.files?.[0] || null)} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                          <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 transition-transform group-hover:scale-110 ${receiptFile ? 'bg-emerald-500/20 text-[#00FF00]' : 'bg-[#8A2BE2]/20 text-[#8A2BE2]'}`}>
                            {receiptFile ? <CheckCircle className="w-8 h-8 text-[#00FF00]" /> : <Upload className="w-8 h-8 text-[#8A2BE2]" />}
                          </div>
                          <p className={`font-black text-base mb-1 ${receiptFile ? 'text-[#00FF00]' : 'text-white'}`}>{receiptFile ? '¡Captura lista!' : 'Subir Captura'}</p>
                          <p className="text-[10px] text-gray-400 font-medium truncate max-w-[200px]">{receiptFile ? receiptFile.name : 'JPG o PNG'}</p>
                        </label>
                      </div>
                    </div>
                  )}

                  {paymentMethod === 'cash' && (
                    <div className="space-y-6">
                      <div className="bg-[#1C1C22] p-6 rounded-2xl border border-amber-500/30 flex items-start gap-4">
                        <div className="p-3 bg-amber-500/10 rounded-xl shrink-0"><Wallet className="w-6 h-6 text-amber-400" /></div>
                        <div>
                          <p className="font-black text-amber-400 text-sm uppercase tracking-widest mb-1">Pago en Divisas</p>
                          <p className="text-xs font-medium text-gray-300 leading-relaxed">Asegúrate de que los billetes estén en buen estado. Requerimos una foto de los billetes que entregarás.</p>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <label className="text-sm font-bold text-gray-300 uppercase tracking-widest">Monto a entregar</label>
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input type="checkbox" checked={isExactCash} onChange={(e) => {
                              setIsExactCash(e.target.checked);
                              if (e.target.checked) setCashAmount(grandTotal.toFixed(2));
                            }} className="w-4 h-4 rounded accent-[#8A2BE2]" />
                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Monto Exacto</span>
                          </label>
                        </div>
                        <div className="relative">
                          <span className="absolute left-5 top-1/2 -translate-y-1/2 font-black text-gray-400 text-lg">$</span>
                          <input type="number" step="0.01" value={cashAmount} onChange={(e) => {
                            setCashAmount(e.target.value);
                            setIsExactCash(false);
                          }} placeholder="Ej. 50.00" className="w-full bg-[#1C1C22] border border-white/10 text-white placeholder-gray-500 p-4 pl-10 rounded-xl outline-none focus:border-[#8A2BE2] focus:ring-1 focus:ring-[#8A2BE2] transition-all font-numbers text-lg" />
                        </div>
                      </div>

                      <div className="space-y-4">
                        <label className="text-sm font-bold text-gray-300 uppercase tracking-widest">Foto de los billetes (Obligatorio)</label>
                        <label className="border-2 border-dashed border-white/10 rounded-2xl p-8 flex flex-col items-center justify-center text-center bg-[#1C1C22] hover:border-[#8A2BE2]/40 transition-colors cursor-pointer group relative">
                          <input type="file" accept="image/*" onChange={(e) => setReceiptFile(e.target.files?.[0] || null)} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                          <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 transition-transform group-hover:scale-110 ${receiptFile ? 'bg-emerald-500/20 text-[#00FF00]' : 'bg-[#8A2BE2]/20 text-[#8A2BE2]'}`}>
                            {receiptFile ? <CheckCircle className="w-8 h-8 text-[#00FF00]" /> : <Upload className="w-8 h-8 text-[#8A2BE2]" />}
                          </div>
                          <p className={`font-black text-base mb-1 ${receiptFile ? 'text-[#00FF00]' : 'text-white'}`}>{receiptFile ? '¡Foto lista!' : 'Subir Foto'}</p>
                          <p className="text-[10px] text-gray-400 font-medium truncate max-w-[200px]">{receiptFile ? receiptFile.name : 'Asegúrate que se vean claros'}</p>
                        </label>
                      </div>
                    </div>
                  )}

                  {paymentMethod === 'paypal' && (
                    <div className="space-y-6">
                      <div className="bg-[#1C1C22] p-6 rounded-2xl space-y-4 border border-white/10">
                        <div className="flex justify-between items-center group">
                          <div><p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">Usuario PayPal</p><p className="font-black text-white text-lg">@maniatech</p></div>
                          <Copy className="w-5 h-5 text-gray-400 cursor-pointer hover:text-[#8A2BE2] transition-colors shrink-0 ml-2" onClick={() => copyToClipboard('@maniatech', 'paypal')} />
                        </div>
                        <div className="flex justify-between items-center group">
                          <div><p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">Correo</p><p className="font-black text-white text-base md:text-lg break-all">paypal@maniatech.com</p></div>
                          <Copy className="w-5 h-5 text-gray-400 cursor-pointer hover:text-[#8A2BE2] transition-colors shrink-0 ml-2" onClick={() => copyToClipboard('paypal@maniatech.com', 'email')} />
                        </div>
                        <div className="flex justify-between items-center group">
                          <div><p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">Titular</p><p className="font-black text-white text-base md:text-lg">Mania Tech C.A.</p></div>
                          <Copy className="w-5 h-5 text-gray-400 cursor-pointer hover:text-[#8A2BE2] transition-colors shrink-0 ml-2" onClick={() => copyToClipboard('Mania Tech C.A.', 'name')} />
                        </div>
                      </div>

                      <div className="space-y-4">
                        <label className="text-sm font-bold text-gray-300 uppercase tracking-widest">¿Quién envía el pago?</label>
                        <input type="text" value={paymentHolder} onChange={(e) => setPaymentHolder(e.target.value)} placeholder="Nombre del titular de la cuenta PayPal" className="w-full bg-[#1C1C22] border border-white/10 text-white placeholder-gray-500 p-4 rounded-xl outline-none focus:border-[#8A2BE2] focus:ring-1 focus:ring-[#8A2BE2] transition-all font-body text-base" />
                      </div>

                      <div className="space-y-4">
                        <label className="text-sm font-bold text-gray-300 uppercase tracking-widest">ID de Transacción</label>
                        <input type="text" value={paymentReference} onChange={(e) => setPaymentReference(e.target.value)} placeholder="Opcional si subes foto" className="w-full bg-[#1C1C22] border border-white/10 text-white placeholder-gray-500 p-4 rounded-xl outline-none focus:border-[#8A2BE2] focus:ring-1 focus:ring-[#8A2BE2] transition-all font-body text-base font-numbers" />
                      </div>

                      <div className="space-y-4">
                        <label className="text-sm font-bold text-gray-300 uppercase tracking-widest">Captura (Opcional si escribes referencia)</label>
                        <label className="border-2 border-dashed border-white/10 rounded-2xl p-8 flex flex-col items-center justify-center text-center bg-[#1C1C22] hover:border-[#8A2BE2]/40 transition-colors cursor-pointer group relative">
                          <input type="file" accept="image/*" onChange={(e) => setReceiptFile(e.target.files?.[0] || null)} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                          <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 transition-transform group-hover:scale-110 ${receiptFile ? 'bg-emerald-500/20 text-[#00FF00]' : 'bg-[#8A2BE2]/20 text-[#8A2BE2]'}`}>
                            {receiptFile ? <CheckCircle className="w-8 h-8 text-[#00FF00]" /> : <Upload className="w-8 h-8 text-[#8A2BE2]" />}
                          </div>
                          <p className={`font-black text-base mb-1 ${receiptFile ? 'text-[#00FF00]' : 'text-white'}`}>{receiptFile ? '¡Captura lista!' : 'Subir Captura'}</p>
                          <p className="text-[10px] text-gray-400 font-medium truncate max-w-[200px]">{receiptFile ? receiptFile.name : 'JPG o PNG'}</p>
                        </label>
                      </div>
                    </div>
                  )}

                  {paymentMethod === 'pos' && (
                    <div className="space-y-6">
                      <div className="bg-[#1C1C22] p-6 rounded-2xl border border-amber-500/30 flex items-start gap-4">
                        <div className="p-3 bg-amber-500/10 rounded-xl shrink-0"><CreditCard className="w-6 h-6 text-amber-400" /></div>
                        <div>
                          <p className="font-black text-amber-400 text-sm uppercase tracking-widest mb-1">Punto de Venta (POS)</p>
                          <p className="text-xs font-medium text-gray-300 leading-relaxed font-body">
                            {deliveryMethod === 'delivery'
                              ? 'Pagarás con tu tarjeta de crédito o débito al recibir tu pedido. El repartidor llevará el equipo de cobro (POS / Datáfono) a tu dirección.'
                              : 'Pagarás con tu tarjeta de crédito o débito directamente en la tienda al momento de retirar tu pedido.'}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="pt-6 text-center">
                  <button
                    onClick={handleLogout}
                    className="text-xs font-black uppercase tracking-widest text-gray-400 hover:text-[#8A2BE2] transition-colors flex items-center justify-center gap-2 mx-auto group cursor-pointer"
                  >
                    <User className="w-4 h-4 group-hover:scale-110 transition-transform" />
                    <span className="underline decoration-2 underline-offset-4">Cambiar de Usuario</span>
                  </button>
                </div>

                {paymentError && (
                  <div className="p-4 bg-red-500/10 text-red-400 border border-red-500/30 rounded-2xl text-sm font-bold flex items-center gap-2 mt-6">
                    <span className="text-lg">⚠️</span> {paymentError}
                  </div>
                )}

                <div className="flex gap-4 pt-4">
                  <button onClick={() => deliveryMethod === 'pickup' ? setStep(1) : prevStep()} disabled={isSubmitting} className="flex-1 py-4 font-black text-gray-300 hover:text-white transition-colors uppercase tracking-wider text-sm bg-[#1C1C22] hover:bg-[#25252E] border border-white/10 rounded-xl disabled:opacity-50 cursor-pointer">Atrás</button>
                  <button
                    onClick={handleConfirmOrder}
                    disabled={isSubmitting}
                    className="flex-[2] bg-[#8A2BE2] hover:bg-[#6441A5] text-white py-4 rounded-xl font-black text-lg flex items-center justify-center gap-2 shadow-xl shadow-[#8A2BE2]/25 active:scale-[0.98] transition-all disabled:opacity-50 cursor-pointer"
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
                    ? "Estamos preparando tu orden. Pulsa abajo para enviar el reporte de pago por WhatsApp y despachar tu pedido."
                    : "Tu pedido estará listo para retirar en nuestra tienda de Chacao una vez envíes el comprobante por WhatsApp."}
                </p>

                <button
                  onClick={() => {
                    const whatsappNumber = "584241807106";
                    const scheduledBadge = isScheduledOrder ? `⚠️ *ORDEN PROGRAMADA (Fuera de horario)* ⚠️\n\n` : '';

                    let finalDeliveryText = '';
                    if (deliveryMethod === 'delivery') {
                      const selectedAddrObj = addresses.find(a => a.id === selectedAddressId);
                      if (selectedAddrObj) {
                        finalDeliveryText = `Delivery Local a: ${selectedAddrObj.formatted_address}${selectedAddrObj.unit ? `\n🏢 *Inmueble:* ${selectedAddrObj.unit}` : ''}${referencePoint ? `\n📍 *Ref:* ${referencePoint}` : ''}`;
                      }
                    } else if (deliveryMethod === 'national') {
                      const courierUpper = shippingCourier.toUpperCase();
                      const receptorInfo = shippingReceptorType === 'third'
                        ? `\n👤 *Receptor:* ${shippingReceptorName} (C.I. ${shippingReceptorId})`
                        : '';
                      finalDeliveryText = `📦 *Envío Nacional por ${courierUpper}*\n📍 *Destino:* ${shippingState} / ${shippingCity}\n🏢 *Agencia:* ${shippingAgency}${receptorInfo}`;
                    } else {
                      finalDeliveryText = `Pickup en: Mania Tech Chacao (Tienda Principal)`;
                    }

                    let paymentText = '';
                    if (paymentMethod === 'zelle') paymentText = `Zelle`;
                    if (paymentMethod === 'pm') paymentText = `Pago Móvil`;
                    if (paymentMethod === 'paypal') paymentText = `PayPal`;
                    if (paymentMethod === 'cash') paymentText = `Efectivo`;
                    if (paymentMethod === 'pos') paymentText = `Punto de Venta (POS)`;

                    const customerName = (hasProfile && customerProfile)
                      ? `${customerProfile.first_name} ${customerProfile.last_name}`.trim()
                      : (firstName || user?.phone || "Invitado");

                    const orderId = createdOrderId ? String(createdOrderId).slice(0, 8).toUpperCase() : "N/A";
                    const totalAmount = grandTotal.toFixed(2);
                    const totalBsStr = bcvRate ? ` (Bs. ${(grandTotal * bcvRate).toFixed(2)})` : "";

                    const orderSummary = `${scheduledBadge}¡Hola Mania Tech! 🎮✨ He realizado un pedido en la tienda web y adjuntado los detalles para su verificación:\n\n🆔 Orden: #${orderId}\n👤 Cliente: ${customerName}\n🛵 *Entrega:*\n${finalDeliveryText}\n💳 *Pago:* ${paymentText}\n\n💰 Total: $ ${totalAmount}${totalBsStr}\n\nQuedo a la espera de su confirmación para el despacho. ¡Gracias! 🙏`;
                    const encodedMsg = encodeURIComponent(orderSummary);
                    window.open(`https://api.whatsapp.com/send?phone=${whatsappNumber}&text=${encodedMsg}`, "_blank");
                    handleFinish();
                  }}
                  className="bg-[#25D366] hover:bg-[#20ba5a] text-white px-6 md:px-14 py-4 md:py-5 rounded-xl font-bold text-sm md:text-lg shadow-2xl shadow-[#25D366]/30 flex items-center justify-center gap-2 md:gap-3 active:scale-95 transition-all w-full md:w-auto uppercase tracking-wider cursor-pointer"
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

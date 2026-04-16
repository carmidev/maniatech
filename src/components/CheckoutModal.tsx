"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, CheckCircle, Upload, CreditCard, Copy, ChevronRight, Truck, Store, Wallet, MapPin, Smartphone, MessageCircle } from "lucide-react";
import { useState } from "react";
import { useCart } from "@/context/CartContext";

type DeliveryMethod = "delivery" | "pickup";
type PaymentMethod = "pm" | "card";

export const CheckoutModal = ({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) => {
  const [step, setStep] = useState(1);
  const { totalPrice, clearCart } = useCart();
  const [copied, setCopied] = useState<string | null>(null);
  
  // Selection states
  const [deliveryMethod, setDeliveryMethod] = useState<DeliveryMethod>("delivery");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("pm");
  const [address, setAddress] = useState("");

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopied(type);
    setTimeout(() => setCopied(null), 2000);
  };

  const handleFinish = () => {
    clearCart();
    setStep(1);
    onClose();
  };

  const nextStep = () => setStep(prev => prev + 1);
  const prevStep = () => setStep(prev => prev - 1);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-[100] p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-md"
          />
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white w-full max-w-2xl rounded-[3rem] overflow-hidden shadow-2xl relative z-10 flex flex-col md:flex-row min-h-[500px]"
          >
            {/* Left Side: Summary */}
            <div className="bg-primary p-8 text-white md:w-5/12 hidden md:flex flex-col justify-between relative overflow-hidden">
              <div className="relative z-10">
                <h2 className="text-3xl font-black mb-2 font-script">Tu Pedido</h2>
                <p className="text-white/80 text-sm">Casi terminamos de preparar tu magia dulce.</p>
              </div>
              
              <div className="space-y-4 relative z-10">
                <div className="bg-white/10 p-5 rounded-3xl backdrop-blur-md border border-white/20">
                  <p className="text-[10px] text-white/60 mb-1 uppercase tracking-widest font-body font-bold">Total a pagar</p>
                  <p className="text-4xl font-numbers font-semibold">{totalPrice.toFixed(2)} €</p>
                  <p className="text-[10px] text-white/40 mt-2 leading-tight">Monto sujeto a tasa oficial BCV del día.</p>
                </div>
                
                {step > 1 && (
                  <div className="text-xs space-y-2 bg-black/10 p-4 rounded-2xl border border-white/5">
                    <p className="flex justify-between"><span>Método:</span> <span className="font-bold uppercase">{deliveryMethod}</span></p>
                    {step > 2 && <p className="flex justify-between"><span>Pago:</span> <span className="font-bold uppercase">{paymentMethod === 'pm' ? 'Pago Móvil' : 'Tarjeta'}</span></p>}
                  </div>
                )}
              </div>

              <div className="text-[10px] text-white/50 relative z-10">
                <p>© 2026 Dolce Candy Boutique</p>
              </div>

              {/* Decorative circle */}
              <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-white/5 rounded-full blur-3xl" />
            </div>

            {/* Right Side: Flow */}
            <div className="flex-1 p-8 bg-white relative flex flex-col">
              <button 
                onClick={onClose}
                className="absolute top-6 right-6 p-2 hover:bg-gray-100 rounded-full transition-colors z-20"
              >
                <X className="w-5 h-5 text-gray-400" />
              </button>

              <div className="flex-1">
                {/* STEP 1: DELIVERY METHOD */}
                {step === 1 && (
                  <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                    <div className="space-y-1">
                      <h3 className="text-2xl font-display text-brand-darkgray">¿Cómo lo recibes?</h3>
                      <p className="text-brand-darkgray/60 font-body font-normal text-sm">Selecciona tu método de entrega preferido.</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <button 
                        onClick={() => setDeliveryMethod("delivery")}
                        className={`p-6 rounded-3xl border-2 transition-all flex flex-col items-center gap-3 ${deliveryMethod === 'delivery' ? 'border-primary bg-primary/5 text-primary' : 'border-slate-100 hover:border-slate-200 text-slate-400'}`}
                      >
                        <Truck className="w-8 h-8" />
                        <span className="font-bold text-sm">Delivery</span>
                      </button>
                      <button 
                        onClick={() => setDeliveryMethod("pickup")}
                        className={`p-6 rounded-3xl border-2 transition-all flex flex-col items-center gap-3 ${deliveryMethod === 'pickup' ? 'border-primary bg-primary/5 text-primary' : 'border-slate-100 hover:border-slate-200 text-slate-400'}`}
                      >
                        <Store className="w-8 h-8" />
                        <span className="font-bold text-sm">Pickup</span>
                      </button>
                    </div>

                    {deliveryMethod === 'delivery' ? (
                      <div className="space-y-3">
                        <label className="text-xs font-black uppercase tracking-wider text-slate-400 flex items-center gap-2">
                          <MapPin className="w-3 h-3 text-primary" /> Dirección de Entrega
                        </label>
                        <textarea 
                          placeholder="Escribe tu dirección exacta (Urbanización, calle, edificio/casa, punto de referencia)..."
                          value={address}
                          onChange={(e) => setAddress(e.target.value)}
                          className="w-full p-5 rounded-2xl bg-slate-50 border border-slate-100 focus:border-primary/30 focus:ring-4 focus:ring-primary/5 outline-none transition-all font-medium text-sm min-h-[100px] resize-none"
                        />
                      </div>
                    ) : (
                      <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100">
                        <p className="text-sm font-bold text-slate-700 mb-2 flex items-center gap-2"><MapPin className="w-4 h-4 text-primary" /> Tienda Campo Claro</p>
                        <p className="text-xs text-slate-500 leading-relaxed">Av. Principal de Campo Claro, Edif. Dolce Candy. Caracas.</p>
                        <p className="text-[10px] text-primary font-black mt-3 uppercase">Horario: 8AM - 6PM</p>
                      </div>
                    )}

                    <button 
                      onClick={nextStep}
                      disabled={deliveryMethod === 'delivery' && address.length < 10}
                      className="w-full bg-brand-red text-white py-4 rounded-full font-black flex items-center justify-center gap-2 shadow-lg shadow-brand-red/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:scale-100"
                    >
                      Continuar al Pago <ChevronRight className="w-5 h-5" />
                    </button>
                  </motion.div>
                )}

                {/* STEP 2: PAYMENT METHOD */}
                {step === 2 && (
                  <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                    <div className="space-y-1">
                      <h3 className="text-2xl font-black text-slate-800">Método de Pago</h3>
                      <p className="text-slate-400 text-sm">Elige cómo deseas pagar tu pedido.</p>
                    </div>

                    <div className="space-y-3">
                      <button 
                        onClick={() => setPaymentMethod("pm")}
                        className={`w-full p-5 rounded-2xl border-2 transition-all flex items-center gap-4 ${paymentMethod === 'pm' ? 'border-primary bg-primary/5' : 'border-slate-100 hover:border-slate-200'}`}
                      >
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${paymentMethod === 'pm' ? 'bg-primary text-white' : 'bg-slate-100 text-slate-400'}`}>
                          <Smartphone className="w-6 h-6" />
                        </div>
                        <div className="text-left">
                          <p className={`font-black text-sm ${paymentMethod === 'pm' ? 'text-primary' : 'text-slate-600'}`}>Pago Móvil</p>
                          <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">Bolívares (Tasa BCV)</p>
                        </div>
                      </button>

                      <button 
                        onClick={() => setPaymentMethod("card")}
                        className={`w-full p-5 rounded-2xl border-2 transition-all flex items-center gap-4 ${paymentMethod === 'card' ? 'border-primary bg-primary/5' : 'border-slate-100 hover:border-slate-200'}`}
                      >
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${paymentMethod === 'card' ? 'bg-primary text-white' : 'bg-slate-100 text-slate-400'}`}>
                          <CreditCard className="w-6 h-6" />
                        </div>
                        <div className="text-left">
                          <p className={`font-black text-sm ${paymentMethod === 'card' ? 'text-primary' : 'text-slate-600'}`}>Tarjeta de Crédito / Débito</p>
                          <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">Internacional / Nacional</p>
                        </div>
                      </button>
                    </div>

                    <div className="flex gap-4 pt-4">
                      <button onClick={prevStep} className="flex-1 py-4 font-black text-slate-400 hover:text-slate-600 transition-colors">Atrás</button>
                      <button 
                        onClick={nextStep}
                        className="flex-[2] bg-brand-red text-white py-4 rounded-full font-black flex items-center justify-center gap-2 shadow-lg shadow-brand-red/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
                      >
                        Siguiente <ChevronRight className="w-5 h-5" />
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* STEP 3: PAYMENT DETAILS */}
                {step === 3 && (
                  <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                    {paymentMethod === 'pm' ? (
                      <div className="space-y-6">
                        <div className="space-y-1">
                          <h3 className="text-2xl font-black text-slate-800 flex items-center gap-2"><Smartphone className="w-6 h-6 text-primary" /> Datos de Pago Móvil</h3>
                          <p className="text-slate-400 text-sm">Realiza el pago y sube el comprobante.</p>
                        </div>

                        <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 space-y-4">
                          <div className="flex justify-between items-center group">
                            <div><p className="text-[10px] text-slate-400 font-bold uppercase">Banco</p><p className="font-black text-slate-700">0134 - Banesco</p></div>
                            <Copy className="w-4 h-4 text-slate-300 cursor-pointer hover:text-primary transition-colors" onClick={() => copyToClipboard('0134', 'bnk')} />
                          </div>
                          <div className="flex justify-between items-center group">
                            <div><p className="text-[10px] text-slate-400 font-bold uppercase">Teléfono</p><p className="font-black text-slate-700">0412-1234567</p></div>
                            <Copy className="w-4 h-4 text-slate-300 cursor-pointer hover:text-primary transition-colors" onClick={() => copyToClipboard('04121234567', 'tel')} />
                          </div>
                          <div className="flex justify-between items-center group">
                            <div><p className="text-[10px] text-slate-400 font-bold uppercase">Cédula</p><p className="font-black text-slate-700">V-12.345.678</p></div>
                            <Copy className="w-4 h-4 text-slate-300 cursor-pointer hover:text-primary transition-colors" onClick={() => copyToClipboard('12345678', 'ci')} />
                          </div>
                          {copied && <p className="text-center text-[10px] font-black text-green-500 uppercase animate-bounce">¡Copiado al portapapeles!</p>}
                        </div>

                        <div className="border-4 border-dashed border-slate-100 rounded-3xl p-8 flex flex-col items-center justify-center text-center hover:bg-slate-50 transition-colors cursor-pointer group">
                          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                            <Upload className="w-8 h-8 text-primary" />
                          </div>
                          <p className="font-black text-sm text-slate-700">Subir Captura</p>
                          <p className="text-[10px] text-slate-400">Formato JPG o PNG</p>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-6">
                        <div className="space-y-1">
                          <h3 className="text-2xl font-black text-slate-800 flex items-center gap-2"><CreditCard className="w-6 h-6 text-primary" /> Pago con Tarjeta</h3>
                          <p className="text-slate-400 text-sm">Introduce los datos de tu tarjeta.</p>
                        </div>

                        <div className="space-y-4">
                          <div className="space-y-2">
                             <label className="text-[10px] font-black uppercase text-slate-400">Número de Tarjeta</label>
                             <div className="relative">
                               <input type="text" placeholder="0000 0000 0000 0000" className="w-full p-4 rounded-xl bg-slate-50 border border-slate-100 outline-none focus:border-primary/30 transition-all font-mono" />
                               <div className="absolute right-4 top-1/2 -translate-y-1/2 flex gap-1">
                                 <div className="w-6 h-4 bg-orange-400 rounded-sm" />
                                 <div className="w-6 h-4 bg-red-400 rounded-sm -ml-2" />
                               </div>
                             </div>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                               <label className="text-[10px] font-black uppercase text-slate-400">Vencimiento</label>
                               <input type="text" placeholder="MM/YY" className="w-full p-4 rounded-xl bg-slate-50 border border-slate-100 outline-none" />
                            </div>
                            <div className="space-y-2">
                               <label className="text-[10px] font-black uppercase text-slate-400">CVC</label>
                               <input type="text" placeholder="***" className="w-full p-4 rounded-xl bg-slate-50 border border-slate-100 outline-none" />
                            </div>
                          </div>
                        </div>

                        <div className="bg-blue-50 p-4 rounded-2xl flex gap-3 items-start">
                          <Wallet className="w-4 h-4 text-blue-500 mt-0.5" />
                          <p className="text-[10px] text-blue-700 font-medium leading-relaxed">Tus datos están protegidos con encriptación de grado bancario (Simulado).</p>
                        </div>
                      </div>
                    )}

                    <div className="flex gap-4">
                      <button onClick={prevStep} className="flex-1 py-4 font-black text-slate-400 hover:text-slate-600 transition-colors">Atrás</button>
                      <button 
                        onClick={nextStep}
                        className="flex-[2] bg-brand-red text-white py-4 rounded-full font-black flex items-center justify-center gap-2 shadow-lg shadow-brand-red/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
                      >
                        Confirmar Pedido <CheckCircle className="w-5 h-5" />
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* STEP 4: SUCCESS */}
                {step === 4 && (
                  <div className="h-full flex flex-col items-center justify-center text-center py-10">
                    <motion.div
                      initial={{ scale: 0, rotate: -20 }}
                      animate={{ scale: 1, rotate: 0 }}
                      className="w-32 h-32 bg-green-100 rounded-full flex items-center justify-center mb-8 shadow-inner"
                    >
                      <CheckCircle className="w-16 h-16 text-green-500" />
                    </motion.div>
                    <h3 className="text-3xl font-display mb-3 text-brand-darkgray leading-tight">¡Pedido Recibido! ✨</h3>
                    <p className="text-slate-500 mb-10 max-w-[280px] text-sm leading-relaxed">
                      {deliveryMethod === 'delivery' 
                        ? "Estamos preparando tus dulces. Pulsa abajo para enviar el reporte de pago por WhatsApp ."
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
                      className="bg-[#25D366] text-white px-12 py-5 rounded-full font-black shadow-xl shadow-[#25D366]/20 flex items-center gap-3 hover:scale-105 transition-transform"
                    >
                      <MessageCircle className="w-6 h-6 fill-current" />
                      Enviar por WhatsApp
                    </button>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

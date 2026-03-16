"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, CheckCircle, Upload, CreditCard, Copy, ChevronRight } from "lucide-react";
import { useState } from "react";
import { useCart } from "@/context/CartContext";

export const CheckoutModal = ({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) => {
  const [step, setStep] = useState(1);
  const { totalPrice, clearCart } = useCart();
  const [copied, setCopied] = useState<string | null>(null);

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
            className="bg-white w-full max-w-2xl rounded-5xl overflow-hidden shadow-2xl relative z-10 flex flex-col md:flex-row"
          >
            {/* Left Side: Summary */}
            <div className="bg-primary p-8 text-white md:w-5/12 hidden md:flex flex-col justify-between">
              <div>
                <h2 className="text-3xl font-black mb-2 font-script">Pagar Orden</h2>
                <p className="text-white/80">Estás a un paso de tener tus dulces.</p>
              </div>
              
              <div className="space-y-4">
                <div className="bg-white/10 p-4 rounded-3xl backdrop-blur-sm">
                  <p className="text-sm text-white/60 mb-1">Monto a pagar</p>
                  <p className="text-4xl font-black">{totalPrice.toFixed(2)} €</p>
                  <p className="text-xs text-white/40 mt-1">Sujeto a tasa oficial BCV</p>
                </div>
              </div>

              <div className="text-xs text-white/60">
                <p>Centro de Ayuda</p>
                <p>+58 412 1234567</p>
              </div>
            </div>

            {/* Right Side: Flow */}
            <div className="flex-1 p-8 bg-white relative">
              <button 
                onClick={onClose}
                className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full"
              >
                <X className="w-5 h-5 text-gray-400" />
              </button>

              {step === 1 && (
                <div className="space-y-6 pt-4">
                  <h3 className="text-2xl font-bold flex items-center gap-2">
                    <span className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm">1</span>
                    Datos de Pago
                  </h3>
                  
                  <div className="space-y-4">
                    {/* Pago Movil Box */}
                    <div className="border-2 border-primary/20 p-5 rounded-4xl bg-primary/5 hover:border-primary/40 transition-colors">
                      <div className="flex items-center justify-between mb-3">
                        <span className="font-bold flex items-center gap-2"><CreditCard className="w-4 h-4 text-primary" /> Pago Móvil</span>
                        {copied === 'pm' && <span className="text-xs text-green-600 font-bold bg-green-100 px-2 py-0.5 rounded-full">¡Copiado!</span>}
                      </div>
                      <div className="space-y-1 text-sm">
                        <p className="flex justify-between">Banco: <b>Banesco (0134)</b> <Copy className="w-4 h-4 text-gray-300 cursor-pointer hover:text-primary" onClick={() => copyToClipboard('0134', 'pm')} /></p>
                        <p className="flex justify-between">Cédula: <b>V-12.345.678</b> <Copy className="w-4 h-4 text-gray-300 cursor-pointer hover:text-primary" onClick={() => copyToClipboard('12345678', 'pm')} /></p>
                        <p className="flex justify-between">Teléfono: <b>0412-1234567</b> <Copy className="w-4 h-4 text-gray-300 cursor-pointer hover:text-primary" onClick={() => copyToClipboard('04121234567', 'pm')} /></p>
                      </div>
                    </div>

                    {/* Transferencia Box */}
                    <div className="border-2 border-secondary/20 p-5 rounded-4xl bg-secondary/5 hover:border-secondary/40 transition-colors">
                       <span className="font-bold block mb-3">Transferencia Bancaria</span>
                       <div className="space-y-1 text-sm">
                        <p>Cuenta Corriente Banesco</p>
                        <p className="text-[11px] font-mono bg-white p-2 rounded-xl border flex justify-between items-center mt-1">
                          0134-0000-00-0000000000
                          <Copy className="w-4 h-4 text-gray-300 cursor-pointer hover:text-secondary" onClick={() => copyToClipboard('01340000000000000000', 'bank')} />
                        </p>
                      </div>
                    </div>
                  </div>

                  <button 
                    onClick={() => setStep(2)}
                    className="w-full bg-primary text-white py-4 rounded-full font-bold flex items-center justify-center gap-2"
                  >
                    Ya realicé el pago <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-6 pt-4 flex flex-col items-center">
                   <h3 className="text-2xl font-bold flex items-center gap-2 w-full">
                    <span className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm">2</span>
                    Subir Comprobante
                  </h3>

                  <div className="w-full aspect-[4/3] border-4 border-dashed border-gray-100 rounded-5xl flex flex-col items-center justify-center text-center p-8 hover:bg-gray-50 transition-colors cursor-pointer group">
                    <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      <Upload className="w-10 h-10 text-primary" />
                    </div>
                    <p className="font-bold text-gray-800">Cargar captura de pantalla</p>
                    <p className="text-sm text-gray-400">Archivos JPG, PNG o PDF hasta 5MB</p>
                  </div>

                  <div className="w-full grid grid-cols-2 gap-4">
                    <button 
                      onClick={() => setStep(1)}
                      className="py-4 font-bold text-gray-500 hover:bg-gray-100 rounded-full"
                    >
                      Atrás
                    </button>
                    <button 
                      onClick={() => setStep(3)}
                      className="bg-primary text-white py-4 rounded-full font-bold shadow-lg shadow-primary/20"
                    >
                      Enviar Reporte
                    </button>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="h-full flex flex-col items-center justify-center text-center py-10">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-32 h-32 bg-green-100 rounded-full flex items-center justify-center mb-6"
                  >
                    <CheckCircle className="w-16 h-16 text-green-500" />
                  </motion.div>
                  <h3 className="text-3xl font-black mb-2">¡Reporte Enviado!</h3>
                  <p className="text-gray-500 mb-8 max-w-xs">
                    Un trabajador de Dolce Candy verificará tu pago pronto. Te avisaremos por WhatsApp.
                  </p>
                  <button 
                    onClick={handleFinish}
                    className="bg-primary text-white px-12 py-4 rounded-full font-bold shadow-xl"
                  >
                    Volver a la Tienda
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

const fs = require('fs');
let code = fs.readFileSync('src/app/checkout/page.tsx', 'utf8');

const STEP2_START = '            ) : step === 2 ? (';
const STEP3_START = '            ) : step === 3 ? (';

const startIdx = code.indexOf(STEP2_START);
const endIdx = code.indexOf(STEP3_START);

if (startIdx === -1 || endIdx === -1) {
  console.error('Could not find markers. Start:', startIdx, 'End:', endIdx);
  process.exit(1);
}

const newStep2 = `            ) : step === 2 ? (
              <motion.div key="step-2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8 w-full">
                <div className="space-y-2">
                  <h3 className="text-3xl md:text-4xl font-display text-brand-darkgray leading-tight">
                    {deliveryMethod === 'national' ? 'Datos del Envío' : 'Dirección de Entrega'}
                  </h3>
                  <p className="text-brand-darkgray/60 font-body font-normal text-base">
                    {deliveryMethod === 'national'
                      ? 'Indícanos la agencia de retiro y quién recibe el paquete.'
                      : 'Gestiona tus lugares favoritos para recibir tus dulces.'}
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
                          className={\`py-4 px-4 rounded-2xl border-2 font-bold text-sm transition-all flex items-center justify-center gap-2 \${shippingCourier === "mrw" ? "border-red-600 bg-red-50 text-red-700 shadow-sm scale-[1.02]" : "border-slate-200 hover:border-slate-300 text-slate-600"}\`}
                        >
                          <span className={\`w-2.5 h-2.5 rounded-full \${shippingCourier === 'mrw' ? 'bg-red-600' : 'bg-slate-300'}\`} />
                          MRW
                        </button>
                        <button
                          type="button"
                          onClick={() => setShippingCourier("zoom")}
                          className={\`py-4 px-4 rounded-2xl border-2 font-bold text-sm transition-all flex items-center justify-center gap-2 \${shippingCourier === "zoom" ? "border-amber-500 bg-amber-50 text-amber-700 shadow-sm scale-[1.02]" : "border-slate-200 hover:border-slate-300 text-slate-600"}\`}
                        >
                          <span className={\`w-2.5 h-2.5 rounded-full \${shippingCourier === 'zoom' ? 'bg-amber-500' : 'bg-slate-300'}\`} />
                          ZOOM
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Estado <span className="text-primary">*</span></label>
                        <div className="relative">
                          <button
                            type="button"
                            onClick={() => setIsStateDropdownOpen(!isStateDropdownOpen)}
                            className="w-full bg-white border border-slate-200 rounded-xl p-3 flex items-center justify-between outline-none focus:border-primary/50 focus:ring-4 focus:ring-primary/10 transition-all font-body text-sm font-semibold text-slate-700 h-[50px]"
                          >
                            <span>{shippingState || "Selecciona un estado"}</span>
                            <ChevronDown className={\`w-4 h-4 text-slate-400 transition-transform duration-300 \${isStateDropdownOpen ? 'rotate-180' : ''}\`} />
                          </button>
                          <AnimatePresence>
                            {isStateDropdownOpen && (
                              <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.2 }}
                                data-lenis-prevent
                                className="absolute top-[calc(100%_+_8px)] left-0 w-full bg-white border border-slate-200 rounded-xl shadow-xl z-50 overflow-hidden max-h-60 overflow-y-auto overscroll-contain"
                              >
                                {VENEZUELAN_STATES.map((state) => (
                                  <button
                                    key={state}
                                    type="button"
                                    onClick={() => { setShippingState(state); setIsStateDropdownOpen(false); }}
                                    className={\`w-full text-left p-3 hover:bg-slate-50 transition-colors border-b border-slate-100 last:border-0 font-body text-sm font-semibold \${shippingState === state ? 'text-primary bg-primary/5' : 'text-slate-600'}\`}
                                  >
                                    {state}
                                  </button>
                                ))}
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Ciudad <span className="text-primary">*</span></label>
                        <input
                          type="text"
                          placeholder="Ej: Valencia"
                          value={shippingCity}
                          onChange={(e) => setShippingCity(e.target.value)}
                          className="w-full p-3 rounded-xl bg-white border border-slate-200 focus:border-primary/50 focus:ring-4 focus:ring-primary/10 outline-none transition-all font-body text-sm font-semibold text-slate-700 h-[50px]"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Oficina / Agencia de Retiro <span className="text-primary">*</span></label>
                      <input
                        type="text"
                        placeholder="Ej: Oficina Los Sauces"
                        value={shippingAgency}
                        onChange={(e) => setShippingAgency(e.target.value)}
                        className="w-full p-3 rounded-xl bg-white border border-slate-200 focus:border-primary/50 focus:ring-4 focus:ring-primary/10 outline-none transition-all font-body text-sm font-semibold text-slate-700 h-[50px]"
                      />
                    </div>

                    <div className="space-y-3 pt-1">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">¿Quién retira el paquete?</label>
                      <div className="flex gap-4">
                        <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-600">
                          <input type="radio" name="receptorType" checked={shippingReceptorType === "same"} onChange={() => setShippingReceptorType("same")} className="accent-primary" />
                          Mismo comprador
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-600">
                          <input type="radio" name="receptorType" checked={shippingReceptorType === "third"} onChange={() => setShippingReceptorType("third")} className="accent-primary" />
                          Otra persona
                        </label>
                      </div>
                      {shippingReceptorType === "third" && (
                        <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                          <div className="space-y-1">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Nombre Completo <span className="text-primary">*</span></label>
                            <input type="text" placeholder="Ej: Carlos Pérez" value={shippingReceptorName} onChange={(e) => setShippingReceptorName(e.target.value)} className="w-full p-3 rounded-xl bg-white border border-slate-200 focus:border-primary/50 focus:ring-2 focus:ring-primary/5 outline-none transition-all text-xs font-semibold text-slate-700" />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Cédula de Identidad <span className="text-primary">*</span></label>
                            <input type="text" placeholder="Ej: 12345678" value={shippingReceptorId} onChange={(e) => setShippingReceptorId(e.target.value)} className="w-full p-3 rounded-xl bg-white border border-slate-200 focus:border-primary/50 focus:ring-2 focus:ring-primary/5 outline-none transition-all text-xs font-semibold text-slate-700" />
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
                          className={\`p-5 rounded-2xl border-2 transition-all cursor-pointer relative group \${selectedAddressId === addr.id ? 'border-primary bg-primary/5 shadow-md' : 'border-slate-100 hover:border-slate-200 bg-white'}\`}
                        >
                          <div className="flex items-start gap-3">
                            <div className={\`mt-1 w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 \${selectedAddressId === addr.id ? 'border-primary' : 'border-slate-200'}\`}>
                              {selectedAddressId === addr.id && <div className="w-2.5 h-2.5 bg-primary rounded-full" />}
                            </div>
                            <div className="flex-1">
                              <p className="text-[10px] font-black uppercase tracking-widest text-primary mb-0.5">{addr.label}</p>
                              <p className="text-sm font-medium text-slate-600 line-clamp-2 pr-8">
                                {addr.unit ? \`\${addr.unit}, \` : ''}{addr.formatted_address}
                              </p>
                            </div>
                          </div>
                          <button
                            onClick={(e) => { e.stopPropagation(); handleAddressDelete(addr.id); }}
                            className="absolute right-4 top-1/2 -translate-y-1/2 p-2 text-slate-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                      {addresses.length < 3 && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <button
                            onClick={() => { setShowMap(true); setMapAutoLocate(false); }}
                            className="p-5 rounded-2xl border-2 border-dashed border-slate-200 text-slate-400 hover:border-primary/50 hover:text-primary transition-all flex items-center justify-center gap-2 font-black text-sm uppercase tracking-wider"
                          >
                            <MapPin className="w-5 h-5" /> Agregar Dirección
                          </button>
                          <button
                            onClick={() => { setShowMap(true); setMapAutoLocate(true); }}
                            className="p-5 rounded-2xl border-2 border-slate-100 text-slate-500 hover:border-primary/50 hover:text-primary transition-all flex items-center justify-center gap-2 font-black text-sm uppercase tracking-wider bg-white shadow-sm"
                          >
                            <Navigation className="w-5 h-5" /> Ubicación Actual
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                <div className="flex gap-4 pt-6">
                  <button onClick={prevStep} className="flex-1 py-5 font-black text-slate-400 hover:text-slate-600 transition-colors uppercase tracking-wider text-sm bg-slate-100 hover:bg-slate-200 rounded-full">Atrás</button>
                  <button
                    disabled={(deliveryMethod === 'delivery' && (!selectedAddressId || !isShippingValid())) || (deliveryMethod === 'national' && !isShippingValid())}
                    onClick={() => {
                      const isNational = deliveryMethod === 'national';
                      if (isNational && (paymentMethod === 'cash' || paymentMethod === 'pos')) {
                        setPaymentMethod('pm');
                      }
                      nextStep();
                    }}
                    className="flex-[2] bg-primary text-white py-5 rounded-full font-black text-lg flex items-center justify-center gap-2 shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
                  >
                    Siguiente <ChevronRight className="w-6 h-6" />
                  </button>
                </div>
              </motion.div>
`;

code = code.substring(0, startIdx) + newStep2 + code.substring(endIdx);
fs.writeFileSync('src/app/checkout/page.tsx', code);
console.log('Done. Replaced Step 2 successfully.');

"use client";

import { useState, type FormEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X, ArrowLeft, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { storeConfig } from "@/config/store";
import { formatPrice } from "@/lib/format-price";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import { useCartContext } from "@/hooks/cart-context";
import { useUIContext } from "@/hooks/ui-context";
import type { CheckoutData, PaymentMethod } from "@/types";

const initialForm: CheckoutData = {
  name: "",
  phone: "",
  address: "",
  comments: "",
  paymentMethod: "efectivo",
};

export function CheckoutModal() {
  const { view, close, openCart } = useUIContext();
  const { items, totalPrice, clearCart } = useCartContext();
  const [form, setForm] = useState<CheckoutData>(initialForm);
  const [errors, setErrors] = useState<Partial<Record<keyof CheckoutData, string>>>({});

  const isOpen = view === "checkout";

  const validate = (): boolean => {
    const next: Partial<Record<keyof CheckoutData, string>> = {};
    if (!form.name.trim()) next.name = "Ingresá tu nombre";
    if (!form.phone.trim()) next.phone = "Ingresá un teléfono de contacto";
    if (!form.address.trim()) next.address = "Ingresá la dirección de entrega";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const url = buildWhatsAppUrl(items, form);
    window.open(url, "_blank", "noopener,noreferrer");
    clearCart();
    setForm(initialForm);
    close();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 z-[60] bg-black/70"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={close}
          />
          <motion.div
            className="fixed inset-x-0 bottom-0 z-[61] max-h-[92vh] overflow-y-auto rounded-t-3xl bg-noche-suave shadow-2xl sm:inset-0 sm:m-auto sm:h-fit sm:max-w-lg sm:rounded-3xl"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "tween", duration: 0.3 }}
          >
            <div className="sticky top-0 flex items-center justify-between border-b border-dorado/20 bg-noche-suave px-5 py-4">
              <button
                type="button"
                onClick={openCart}
                aria-label="Volver al carrito"
                className="rounded-full p-2 text-crema/70 hover:bg-white/10"
              >
                <ArrowLeft size={20} />
              </button>
              <h2 className="font-display text-xl font-bold text-dorado">
                Completar pedido
              </h2>
              <button
                type="button"
                onClick={close}
                aria-label="Cerrar"
                className="rounded-full p-2 text-crema/70 hover:bg-white/10"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4 px-5 py-5">
              <div className="rounded-2xl border border-dorado/20 bg-noche px-4 py-3">
                <p className="text-sm font-bold text-dorado">Resumen de compra</p>
                <p className="mt-0.5 text-xs text-crema/60">
                  Revisá tus datos antes de enviar el pedido.
                </p>
                <ul className="mt-3 flex flex-col gap-1.5">
                  {items.map((item) => (
                    <li
                      key={item.key}
                      className="flex items-center justify-between text-sm text-crema/80"
                    >
                      <span>
                        {item.quantity}x {item.name}
                        {item.variantName ? ` (${item.variantName})` : ""}
                      </span>
                      <span className="font-semibold text-crema">
                        {formatPrice(item.price * item.quantity)}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              <Field
                label="Nombre"
                value={form.name}
                onChange={(v) => setForm((f) => ({ ...f, name: v }))}
                error={errors.name}
                placeholder="Tu nombre y apellido"
              />
              <Field
                label="Teléfono"
                value={form.phone}
                onChange={(v) => setForm((f) => ({ ...f, phone: v }))}
                error={errors.phone}
                placeholder="Tu número de contacto"
                type="tel"
              />
              <Field
                label="Dirección"
                value={form.address}
                onChange={(v) => setForm((f) => ({ ...f, address: v }))}
                error={errors.address}
                placeholder="Calle, número y referencia"
              />

              <div>
                <label className="mb-1.5 block text-sm font-semibold text-crema/80">
                  Comentarios (opcional)
                </label>
                <textarea
                  value={form.comments}
                  onChange={(e) => setForm((f) => ({ ...f, comments: e.target.value }))}
                  placeholder="Aclaraciones sobre el pedido, sin cebolla, etc."
                  rows={3}
                  className="w-full rounded-xl border border-dorado/20 bg-noche px-4 py-3 text-crema placeholder:text-crema/30 focus:border-amarillo focus:outline-none"
                />
              </div>

              <div>
                <p className="mb-2 text-sm font-semibold text-crema/80">Forma de pago</p>
                <div className="flex gap-3">
                  {storeConfig.paymentMethods.map((method) => (
                    <button
                      key={method.id}
                      type="button"
                      onClick={() =>
                        setForm((f) => ({
                          ...f,
                          paymentMethod: method.id as PaymentMethod,
                        }))
                      }
                      className={`flex-1 rounded-xl border px-4 py-3 text-sm font-semibold transition-colors ${
                        form.paymentMethod === method.id
                          ? "border-amarillo bg-amarillo text-noche"
                          : "border-dorado/30 text-crema/80 hover:border-dorado"
                      }`}
                    >
                      {method.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-2 flex items-center justify-between rounded-2xl bg-noche px-4 py-3">
                <span className="font-semibold text-crema">Total a pagar</span>
                <span className="font-display text-3xl font-extrabold text-amarillo">
                  {formatPrice(totalPrice)}
                </span>
              </div>

              <p className="flex items-center justify-center gap-1.5 text-xs font-medium text-crema/60">
                <ShieldCheck size={14} className="text-amarillo" />
                Pedido seguro · Confirmación inmediata por WhatsApp
              </p>

              <Button type="submit" size="lg" variant="whatsapp" className="w-full">
                Enviar pedido por WhatsApp
              </Button>
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

function Field({
  label,
  value,
  onChange,
  error,
  placeholder,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  placeholder: string;
  type?: string;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-semibold text-crema/80">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`w-full rounded-xl border bg-noche px-4 py-3 text-crema placeholder:text-crema/30 focus:outline-none ${
          error ? "border-rojo" : "border-dorado/20 focus:border-amarillo"
        }`}
      />
      {error && <p className="mt-1 text-xs text-rojo">{error}</p>}
    </div>
  );
}

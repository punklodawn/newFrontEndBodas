"use client";

import React, { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import NotificationPopup from "@/components/NotifiacionPopup";
import PopUpTicket from "@/components/popUpTicket"
import { supabase } from "../supabase/supabase";
import { useRSVP } from "@/context/RSVPContext";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion"


interface FormData {
  name: string;
  email: string;
  adults: string;
  children: string;
}

const RSVPForm = () => {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    adults: "1",
    children: "0",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {alreadyConfirmed, setAlreadyConfirmed } = useRSVP();
  const [notification, setNotification] = useState<{message: string;type: "success" | "error";} | null>(null);
  const [showTicket, setShowTicket] = useState(false);
  const [savedData, setSavedData] = useState<FormData | null>(null);

  useEffect(() => {
    // Verificar localStorage al cargar el componente
    const savedData = localStorage.getItem('rsvpConfirmation');
    if (savedData) {
        const parsedData = JSON.parse(savedData);
        setSavedData(parsedData); // Guardar los datos en el estado
        setAlreadyConfirmed(true);
    }
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleOpenTicket = () => {
    setShowTicket(true);
  };

  const handleCloseTicket = () => {
    setShowTicket(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Enviar los datos a Supabase
      const { data, error } = await supabase.from("rsvp").insert([
        {
          name: formData.name,
          email: formData.email,
          adults: parseInt(formData.adults, 10),
          children: parseInt(formData.children, 10),
        },
      ]);

      if (error) {
        if (error.message.includes("duplicate key value") && 
            error.message.includes("email")) {
                setNotification({
                    message: "Este email ya ha sido registrado.",
                    type: "error",
                  });
          return;
        }
        throw new Error(error.message);
      }

        // Guardar en localStorage
        localStorage.setItem('rsvpConfirmation', JSON.stringify({
            name: formData.name,
            email: formData.email,
            adults: formData.adults,
            children: formData.children,
            timestamp: new Date().toISOString()
            }));

      // Mostrar mensaje de éxito
      setNotification({message: "¡Gracias por confirmar tu asistencia!",type: "success"});
      setFormData({ name: "", email: "", adults: "1", children: "0" });
      setAlreadyConfirmed(true);
    } catch (error) {       
      console.error("Error al guardar los datos:", error);
      setNotification({message: "Hubo un error al enviar tu confirmación. Por favor, intenta nuevamente.", type: "error"});
    } finally {
      setIsSubmitting(false);
    }
  };

  if (alreadyConfirmed) {
    return (
        <>
        <div className="bg-white backdrop-blur-sm rounded-xl shadow-xl overflow-hidden border border-nature-sage p-40 text-center">
            <h3 className="text-xl font-bold text-nature-green mb-4">¡Ya confirmaste tu asistencia!</h3>
            <Button onClick={handleOpenTicket}
            className="w-full bg-gradient-to-r from-nature-green to-nature-sage hover:from-nature-sage hover:to-nature-cream text-white h-12 text-lg"
            >
            Ver Ticket
            </Button>

      </div>
      <div>
            {/* Popup del Ticket */}
            {showTicket && (
                <PopUpTicket
                onClose={handleCloseTicket}
                />
            )}
      </div>
        </>
    );
  }

  return (
    <>
    <div className="max-w-4xl w-full mx-auto">
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="text-center mb-12 pointer-events-none"
      >
      <div className="inline-block bg-nature-sage text-nature-green px-3 py-1 rounded-full text-sm font-medium mb-4 border border-nature-cream">
        PASO 1
      </div>
      <h2 className="text-3xl md:text-4xl font-bold mb-4 nature-gradient">Confirma tu Asistencia</h2>
      <p className="text-lg text-nature-green max-w-2xl mx-auto">
        Por favor completa tu check-in antes del 15 de mayo para asegurar tu asiento en nuestro vuelo hacia la
        felicidad
      </p>
    </motion.div>

    <div className="bg-white backdrop-blur-sm rounded-xl shadow-xl overflow-hidden border border-nature-sage">
      <div className="bg-gradient-to-r from-nature-green to-nature-sage p-4 text-green">
        <h3 className="text-xl font-bold">FORMULARIO DE CHECK-IN</h3>
      </div>

      <div className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Nombre completo */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="name">Nombre completo</Label>
              <Input
                id="name"
                name="name"
                placeholder="Tu nombre"
                required
                value={formData.name}
                onChange={handleChange}
                className="border-nature-sage focus:border-nature-green focus:ring-nature-green"
              />
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="tu@email.com"
                required
                value={formData.email}
                onChange={handleChange}
                className="border-nature-sage focus:border-nature-green focus:ring-nature-green"
              />
            </div>
          </div>

          {/* Cantidad de adultos */}
          <div className="space-y-2">
            <Label htmlFor="adults">Cantidad de adultos</Label>
            <RadioGroup
              value={formData.adults}
              onValueChange={(value) =>
                setFormData({ ...formData, adults: value })
              }
              className="flex space-x-4"
            >
              {["1", "2", "3", "4"].map((num) => (
                <div key={num} className="flex items-center space-x-2">
                  <RadioGroupItem value={num} id={`adults-${num}`} />
                  <Label htmlFor={`adults-${num}`}>{num}</Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          {/* Cantidad de niños */}
          <div className="space-y-2">
            <Label htmlFor="children">Cantidad de niños</Label>
            <RadioGroup
              value={formData.children}
              onValueChange={(value) =>
                setFormData({ ...formData, children: value })
              }
              className="flex space-x-4"
            >
              {["0", "1", "2", "3", "4"].map((num) => (
                <div key={num} className="flex items-center space-x-2">
                  <RadioGroupItem value={num} id={`children-${num}`} />
                  <Label htmlFor={`children-${num}`}>{num}</Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          {/* Botón de envío */}
          <div className="pt-4">
            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-nature-green to-nature-sage hover:from-nature-sage hover:to-nature-cream text-white h-12 text-lg"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Enviando..." : "Confirmar Asistencia"}
            </Button>
          </div>
        </form>
         {/* Popup de Notificación */}
        {notification && (
        <NotificationPopup
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}/>)}
      </div>
    </div>
  </div>
    
    </>
  );
};

export default RSVPForm;
// components/RSVPForm.tsx
"use client";

import React, { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import NotificationPopup from "@/components/NotifiacionPopup"; // Asegúrate de la ruta correcta
import PopUpTicket from "@/components/popUpTicket"; // Asegúrate de la ruta correcta
import { supabase } from "../supabase/supabase"; // Asegúrate de la ruta correcta
import { useRSVP } from "@/context/RSVPContext";
import { motion } from "framer-motion";
import { CustomCheckbox } from "@/components/CustomCheckbox"


interface MainGuest {
  id?: number; // id es opcional porque se asigna al insertar en BD
  name: string;
  email?: string | null;
  code: string;
  is_attending: boolean;
}

interface CompanionGuest {
  id: number;
  main_guest_id: number;
  name: string;
  is_adult: boolean;
  is_attending: boolean;
}

interface SavedConfirmationData {
  mainGuest: MainGuest;
  attendingCompanions: CompanionGuest[];
  isMainGuestAttending: boolean;
}

export default function RSVPForm() {
  const [step, setStep] = useState<"code" | "form">("code");
  const [code, setCode] = useState("");
const [mainGuest, setMainGuest] = useState<MainGuest | null>(null);
const [isMainGuestAttending, setIsMainGuestAttending] = useState<boolean>(true);
const [companions, setCompanions] = useState<CompanionGuest[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { alreadyConfirmed, setAlreadyConfirmed } = useRSVP();
  const [notification, setNotification] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);
  const [showTicket, setShowTicket] = useState(false);
  const [savedData, setSavedData] = useState<SavedConfirmationData | null>(null);

  // Verificar si ya hay una confirmación guardada localmente
  useEffect(() => {
    const savedDataString = localStorage.getItem("rsvpConfirmation");
    if (savedDataString) {
      try {
        const parsedData: SavedConfirmationData = JSON.parse(savedDataString);
        setSavedData(parsedData);
        setAlreadyConfirmed(true);
      } catch (e) {
        console.error("Error parsing saved data from localStorage", e);
        localStorage.removeItem('rsvpConfirmation');
      }
    }
  }, [setAlreadyConfirmed]);

  const verifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setNotification(null);

    try {
      const { data: mainGuestData, error: mainGuestsError } = await supabase
        .from("main_guests")
        .select("*")
        .eq("code", code.trim())
        .single();

      if (mainGuestsError || !mainGuestData) {
        throw new Error("Código inválido o no encontrado");
      }

      const { data: companionsData, error: companionsError } = await supabase
        .from("companion_guests")
        .select("*")
        .eq("main_guest_id", mainGuestData.id);

      if (companionsError) {
        throw companionsError;
      }

      const hasConfirmedMainGuest = mainGuestData.is_attending !== null;
      const hasConfirmedCompanions = companionsData.some(c => c.is_attending !== null);
      
      if (hasConfirmedMainGuest || hasConfirmedCompanions) {
        const attendingCompanions = companionsData.filter(c => c.is_attending === true);
        const savedConfirmation: SavedConfirmationData = {
          mainGuest: mainGuestData,
          attendingCompanions: attendingCompanions,
          isMainGuestAttending: mainGuestData.is_attending === true
        };
        
        setSavedData(savedConfirmation);
        setAlreadyConfirmed(true);
        localStorage.setItem('rsvpConfirmation', JSON.stringify(savedConfirmation));
        setIsSubmitting(false);
        return;
      }

      setMainGuest(mainGuestData);
      setIsMainGuestAttending(mainGuestData.is_attending !== false);
      setCompanions(
        companionsData.map((c) => ({
          ...c,
          is_attending: c.is_attending === true
        }))
      );
      setStep("form");
      
      setNotification({
        message: `¡Hola ${mainGuestData.name}! Por favor confirma la asistencia de tu grupo.`,
        type: "success",
      });
    } catch (error) {
      console.error("Error al verificar el código:", error);
      setNotification({
        message: error.message || "Error al verificar el código. Por favor, inténtalo de nuevo.",
        type: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleMainGuestAttendingChange = (value: boolean) => {
    setIsMainGuestAttending(value);
  };

  const handleCompanionChange = (id: number, value: boolean) => {
    setCompanions(companions.map(c => 
      c.id === id ? { ...c, is_attending: value } : c
    ));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setNotification(null);

    try {
      if (!mainGuest) throw new Error("Datos de invitado no encontrados");

      // Actualizar estado del invitado principal
      const { error: mainGuestUpdateError } = await supabase
        .from("main_guests")
        .update({ is_attending: isMainGuestAttending })
        .eq("id", mainGuest.id);

      if (mainGuestUpdateError) throw mainGuestUpdateError;

      // Actualizar estado de acompañantes
      const updatesPromises = companions.map(companion => 
        supabase
          .from("companion_guests")
          .update({ is_attending: companion.is_attending || false }) // false si es null o false
          .eq("id", companion.id)
      );

      const results = await Promise.allSettled(updatesPromises);
      
      // Verificar si hubo errores en alguna actualización
      const errors = results.filter(result => 
        result.status === 'rejected' || 
        (result.status === 'fulfilled' && result.value.error)
      );

      if (errors.length > 0) {
        console.error("Errores al actualizar acompañantes:", errors);
        throw new Error(`Error al actualizar la confirmación de algunos acompañantes. (${errors.length} errores)`);
      }

      // Guardar confirmación en localStorage
      const attendingCompanions = companions.filter(c => c.is_attending);
      const dataToSave: SavedConfirmationData = {
        mainGuest: { ...mainGuest, is_attending: isMainGuestAttending },
        attendingCompanions: attendingCompanions,
        isMainGuestAttending: isMainGuestAttending
      };
      
      localStorage.setItem('rsvpConfirmation', JSON.stringify(dataToSave));

      // Actualizar estado local y contexto
      setSavedData(dataToSave);
      setAlreadyConfirmed(true);
      
      setNotification({
        message: "¡Gracias por confirmar tu asistencia!",
        type: "success",
      });
    } catch (error) {
      console.error("Error al guardar los datos:", error);
      setNotification({
        message: error.message || "Error al confirmar asistencia. Por favor, inténtalo de nuevo.",
        type: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOpenTicket = () => {
    setShowTicket(true);
  };

  const handleCloseTicket = () => {
    setShowTicket(false);
  };

  // Si ya confirmó, mostrar mensaje y ticket
  if (alreadyConfirmed || savedData) {
    const mainGuestName = savedData?.mainGuest.name || "Invitado";
    const attendingCompanions = savedData?.attendingCompanions || [];
    const isMainAttending = savedData?.isMainGuestAttending ?? true;
    
    return (
      <>
        <div className="bg-white backdrop-blur-sm rounded-xl shadow-xl overflow-hidden border border-nature-sage p-6 md:p-10 text-center max-w-2xl mx-auto">
          <h3 className="text-xl md:text-2xl font-bold text-nature-green mb-4">
            ¡Hola, {mainGuestName}! Ya confirmaste tu asistencia.
          </h3>
          {isMainAttending ? (
            attendingCompanions.length > 0 ? (
              <p className="text-nature-green mb-4">
                Confirmaste la asistencia de: {mainGuestName} (Tú) y {attendingCompanions.map(c => c.name).join(', ')}.
              </p>
            ) : (
              <p className="text-nature-green mb-4">
                Confirmaste que solo tú ({mainGuestName}) asistirás.
              </p>
            )
          ) : (
            <p className="text-nature-green mb-4">
              Has confirmado que no asistirás tú ni ningún invitado de tu grupo.
            </p>
          )}
          <Button
            onClick={handleOpenTicket}
            className="w-full sm:w-auto bg-gradient-to-r from-nature-green to-nature-sage hover:from-nature-sage hover:to-nature-cream text-white h-12 text-lg"
          >
            Ver Ticket
          </Button>
        </div>
        <div>
          {showTicket && (
            <PopUpTicket
              onClose={handleCloseTicket}
              // Puedes pasar datos específicos al ticket si lo deseas
              // invitado={savedData.mainGuest}
              // acompanantes={savedData.attendingCompanions}
            />
          )}
        </div>
        {notification && (
          <NotificationPopup
            message={notification.message}
            type={notification.type}
            onClose={() => setNotification(null)}
          />
        )}
      </>
    );
  }

  return (
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
        <h2 className="text-3xl md:text-4xl font-bold mb-4 nature-gradient">
          Confirma tu Asistencia
        </h2>
        <p className="text-lg text-nature-green max-w-2xl mx-auto">
          Por favor completa tu check-in antes del 15 de mayo para asegurar tu
          asiento en nuestro vuelo hacia la felicidad
        </p>
      </motion.div>

      <div className="bg-white backdrop-blur-sm rounded-xl shadow-xl overflow-hidden border border-nature-sage">
        <div className="bg-gradient-to-r from-nature-green to-nature-sage p-4 text-white">
          <h3 className="text-xl font-bold">FORMULARIO DE CHECK-IN</h3>
        </div>

        <div className="p-6">
          {step === "code" ? (
            <form onSubmit={verifyCode} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="code">Código de Invitación</Label>
                <Input
                  id="code"
                  name="code"
                  placeholder="Ingresa tu código único"
                  required
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="border-nature-sage focus:border-nature-green focus:ring-nature-green"
                />
              </div>

              <div className="pt-4">
                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-nature-green to-nature-sage hover:from-nature-sage hover:to-nature-cream text-white h-12 text-lg"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Verificando..." : "Verificar Código"}
                </Button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <h4 className="text-lg font-semibold text-nature-green">
                  Invitado Principal: {mainGuest?.name}
                </h4>
                
                {/* Checkbox para el invitado principal */}
                <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-nature-cream">
                  <CustomCheckbox
                    id={`main-guest-${mainGuest?.id}`}
                    checked={isMainGuestAttending}
                    onChange={(e) => handleMainGuestAttendingChange(e.target.checked)}
                    label={`${mainGuest?.name} (Yo asisto)`}
                  />
                </div>

                {/* Sección de acompañantes */}
                <div className="space-y-2">
                  <Label>Confirmar asistencia de acompañantes:</Label>
                  <div className="space-y-3">
                    {companions.length > 0 ? (
                      companions.map((companion) => (
                        <div key={companion.id} className="p-3 rounded-lg hover:bg-nature-cream">
                          <CustomCheckbox
                            id={`companion-${companion.id}`}
                            checked={companion.is_attending}
                            onChange={(e) => handleCompanionChange(companion.id, e.target.checked)}
                            label={`${companion.name} (${companion.is_adult ? "Adulto" : "Niño"})`}
                          />
                        </div>
                      ))
                    ) : (
                      <p className="text-nature-green italic">No tienes acompañantes registrados.</p>
                    )}
                  </div>
                </div>
              </div>

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
          )}

          {notification && (
            <NotificationPopup
              message={notification.message}
              type={notification.type}
              onClose={() => setNotification(null)}
            />
          )}
        </div>
      </div>
    </div>
  );
}
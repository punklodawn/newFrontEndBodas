"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import {Plane, Heart} from "lucide-react"
import confetti from "canvas-confetti"

interface PopUpTicketProps {
    onClose: () => void;
  }
  interface UserData {
    name: string;
    email: string;
    adults: string;
    children: string;
  }

  const PopUpTicket: React.FC<PopUpTicketProps> = ({onClose }) => {

    const [userData, setUserData] = useState<UserData>({
        name: "Invitado Especial",
        email: "correo@ejemplo.com",
        adults: "1",
        children: "0",
      });

      const [seatNumber, setSeatNumber] = useState<string>("");

        // Función para mostrar confeti
  const showConfetti = () => {
    const canvas = document.createElement("canvas");
    canvas.style.position = "fixed";
    canvas.style.inset = "0";
    canvas.style.width = "100vw";
    canvas.style.height = "100vh";
    canvas.style.zIndex = "999";
    canvas.style.pointerEvents = "none";
    document.body.appendChild(canvas);

    const myConfetti = confetti.create(canvas, {
      resize: true,
      useWorker: true,
    });

    myConfetti({
      particleCount: 100,
      spread: 160,
      colors: ["#f2f2f0", "#e5e6d8", "#c5d1b8", "#7d9d7f"],
      origin: { y: 0.6 },
    });

    setTimeout(() => {
      document.body.removeChild(canvas);
    }, 3000);
  };

  useEffect(() => {
    // Mostrar confeti cuando se abre el ticket
    const timer = setTimeout(() => {
      showConfetti();
    }, 500); }, []);

      useEffect(() => {
        // Obtener datos del localStorage al cargar el componente
        const savedData = localStorage.getItem("rsvpConfirmation");
        if (savedData) {
          try {
            const parsedData = JSON.parse(savedData);
    
            // Validar que los datos tengan la estructura esperada
            if (parsedData && typeof parsedData === "object") {
              setUserData({
                name: parsedData.name || "Invitado Especial",
                email: parsedData.email || "correo@ejemplo.com",
                adults: parsedData.adults || "1",
                children: parsedData.children || "0",
              });
    
              // Función para calcular el número de asiento VIP
              const getSeatNumber = () => {
                const adults = parseInt(parsedData.adults || "1", 10); // Usar parsedData en lugar de userData
                const children = parseInt(parsedData.children || "0", 10); // Usar parsedData en lugar de userData
    
                // Calcular la suma de adultos y niños
                const totalPeople = adults + children;
    
                // Generar un número aleatorio entre 0 y 99
                const randomSuffix = Math.floor(Math.random() * 100).toString().padStart(2, "0");
    
                // Si no hay niños, usar solo la cantidad de adultos
                if (children === 0) {
                  return `VIP-${adults}${randomSuffix}`;
                }
    
                // Si hay niños, sumar adultos y niños
                return `VIP-${totalPeople}${randomSuffix}`;
              };
    
              // Almacenar el número de asiento generado
              setSeatNumber(getSeatNumber());
            }
          } catch (error) {
            console.error("Error al parsear datos del localStorage:", error);
          }
        }
      }, []);

    return (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4"
            onClick={onClose}
          >
            <motion.div
              initial={{ scale: 0.8, y: 50, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.8, y: 50, opacity: 0 }}
              transition={{ type: "spring", damping: 25 }}
              className="bg-white rounded-xl overflow-hidden max-w-md w-full shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="bg-gradient-to-r from-nature-green to-nature-sage p-4 text-white">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-sm font-medium opacity-80">TARJETA DE EMBARQUE</h3>
                    <h2 className="text-2xl font-bold">LM-2026 - VUELO AMOR</h2>
                  </div>
                  <Plane className="h-8 w-8" />
                </div>
              </div>

              <div className="p-6 border-b border-dashed border-nature-sage">
                <div className="flex justify-between mb-4">
                  <div>
                    <p className="text-xs text-nature-green">PASAJERO</p>
                    <p className="font-medium">{userData.name}</p>
                  </div>
                  <div>
                    <p className="text-xs text-nature-green">ASIENTOS</p>
                    <p className="font-medium">{seatNumber}</p>
                  </div>
                </div>

                <div className="flex justify-between mb-4">
                  <div>
                    <p className="text-xs text-nature-green">DESDE</p>
                    <p className="font-medium">SOLTERÍA</p>
                  </div>
                  <div className="text-center">
                    <Plane className="h-4 w-4 inline-block transform rotate-90 text-nature-green" />
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-nature-green">HACIA</p>
                    <p className="font-medium">MATRIMONIO</p>
                  </div>
                </div>

                <div className="flex justify-between">
                  <div>
                    <p className="text-xs text-nature-green">FECHA</p>
                    <p className="font-medium">14 FEB 2026</p>
                  </div>
                  <div>
                    <p className="text-xs text-nature-green">HORA</p>
                    <p className="font-medium">20:00</p>
                  </div>
                  <div>
                    <p className="text-xs text-nature-green">PUERTA</p>
                    <p className="font-medium">AMOR</p>
                  </div>
                </div>
              </div>

            {/* Información Adicional */}
            <div className="p-6 flex justify-between items-center">
            <div>
                <p className="text-xs text-nature-green">ADULTOS</p>
                <p className="font-medium">{userData.adults}</p>
            </div>
            <div>
                <p className="text-xs text-nature-green mt-2">NIÑOS</p>
                <p className="font-medium">{userData.children}</p>
            </div>
            <div className="text-right">
                <Heart className="h-6 w-6 text-nature-green" />
            </div>
            </div>
            </motion.div>
          </motion.div>
        )
    }

    export default PopUpTicket;
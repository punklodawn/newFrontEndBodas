"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import {Plane, Heart, Users, User, Baby } from "lucide-react"
import confetti from "canvas-confetti"

interface PopUpTicketProps {
    onClose: () => void;
  }

interface RSVPData {
  mainGuest: {
    name: string;
    email?: string;
    code: string;
    is_attending: boolean;
  };
  attendingCompanions: {
    name: string;
    is_adult: boolean;
  }[];
  isMainGuestAttending: boolean;
}
  const PopUpTicket: React.FC<PopUpTicketProps> = ({ onClose }) => {
  const [rsvpData, setRsvpData] = useState<RSVPData | null>(null)
  const [seatNumber, setSeatNumber] = useState<string>("")

const countAttendees = () => {
    if (!rsvpData) return { adults: 0, children: 0 }

    let adults = 0
    let children = 0

    // Contar el invitado principal si asiste
    if (rsvpData.isMainGuestAttending) {
      adults++
    }

    // Contar acompañantes
    rsvpData.attendingCompanions.forEach(companion => {
      if (companion.is_adult) {
        adults++
      } else {
        children++
      }
    })

    return { adults, children }
  }


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
    // Obtener datos del localStorage
    const savedData = localStorage.getItem("rsvpConfirmation")
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData)
        setRsvpData(parsedData)

        // Generar número de asiento
        const { adults, children } = countAttendees()
        const randomSuffix = Math.floor(Math.random() * 100).toString().padStart(2, "0")
        setSeatNumber(`VIP-${adults + children}${randomSuffix}`)
      } catch (error) {
        console.error("Error al parsear datos:", error)
      }
    }
    // Mostrar confeti cuando se abre el ticket
    const timer = setTimeout(() => {
      showConfetti();
    }, 500); }, []);

      if (!rsvpData) {
    return (
      <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl p-6 max-w-md w-full text-center">
          <p>Cargando información del ticket...</p>
        </div>
      </div>
    )
  }

    const { adults, children } = countAttendees()
  const totalAttendees = adults + children

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
        {/* Encabezado */}
        <div className="bg-gradient-to-r from-nature-green to-nature-sage p-4 text-white">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-sm font-medium opacity-80">TARJETA DE EMBARQUE</h3>
              <h2 className="text-2xl font-bold">LM-2026 - VUELO AMOR</h2>
            </div>
            <Plane className="h-8 w-8" />
          </div>
        </div>

        {/* Cuerpo principal */}
        <div className="p-6 border-b border-dashed border-nature-sage">
          <div className="flex justify-between mb-4">
            <div>
              <p className="text-xs text-nature-green">PASAJERO</p>
              <p className="font-medium">{rsvpData.mainGuest.name}</p>
            </div>
            <div>
              <p className="text-xs text-nature-green">CÓDIGO</p>
              <p className="font-mono font-medium">{rsvpData.mainGuest.code}</p>
            </div>
          </div>

          <div className="flex justify-between mb-6">
            <div>
              <p className="text-xs text-nature-green">ASIENTOS</p>
              <p className="font-medium">{seatNumber}</p>
            </div>
            <div>
              <p className="text-xs text-nature-green">TOTAL PERSONAS</p>
              <div className="flex items-center gap-1">
                <Users className="h-4 w-4" />
                <span className="font-medium">{totalAttendees}</span>
              </div>
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

        {/* Información de acompañantes */}
        <div className="p-6">
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="bg-nature-cream/50 p-3 rounded-lg">
              <div className="flex items-center gap-2 text-nature-green">
                <User className="h-4 w-4" />
                <span className="text-xs">ADULTOS</span>
              </div>
              <p className="text-2xl font-bold mt-1">{adults}</p>
            </div>
            <div className="bg-nature-cream/50 p-3 rounded-lg">
              <div className="flex items-center gap-2 text-nature-green">
                <Baby className="h-4 w-4" />
                <span className="text-xs">NIÑOS</span>
              </div>
              <p className="text-2xl font-bold mt-1">{children}</p>
            </div>
          </div>

          {/* Lista de acompañantes si hay */}
          {rsvpData.attendingCompanions.length > 0 && (
            <div className="mt-4">
              <p className="text-xs text-nature-green mb-2">ACOMPAÑANTES:</p>
              <ul className="space-y-1">
                {rsvpData.attendingCompanions.map((companion, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <span className="text-nature-green">
                      {companion.is_adult ? <User className="h-3 w-3" /> : <Baby className="h-3 w-3" />}
                    </span>
                    <span>{companion.name}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Pie */}
        <div className="bg-nature-sage/10 p-4 text-center">
          <Heart className="h-6 w-6 mx-auto text-nature-green" />
          <p className="text-xs text-nature-green mt-1">¡Gracias por confirmar tu asistencia!</p>
        </div>
      </motion.div>
    </motion.div>
  )
}

    export default PopUpTicket;
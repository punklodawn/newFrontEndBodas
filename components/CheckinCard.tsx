"use client";

import React, { useState } from "react";
import {Plane, MapPin, ChevronDown, Heart, Utensils} from "lucide-react"
import { Button } from "@/components/ui/button";
import { useRSVP } from "@/context/RSVPContext";
import { motion} from "framer-motion"
import PopUpTicket from "@/components/popUpTicket"

const CheckinCard = () => {

  const {alreadyConfirmed } = useRSVP();
  const [showTicket, setShowTicket] = useState(false);

    const handleCloseTicket = () => {
        setShowTicket(false);
      };

      const handleOpenTicket = () => {
        setShowTicket(true);
      };
    

  return (
    <>
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1 }} className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-0 w-full h-full bg-[url('/placeholder.svg?height=1080&width=1920')] bg-cover bg-center opacity-10"></div>
          </motion.div>

        <div className="max-w-4xl w-full mx-auto z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="text-center mb-8"
          >
            <div className="inline-block bg-nature-sage text-nature-green px-3 py-1 rounded-full text-sm font-medium mb-4 border border-nature-cream">
             {alreadyConfirmed && (`CHECK-IN CERRADO`)}
             {!alreadyConfirmed && (`CHECK-IN ABIERTO`)} 
            </div>
            {/* <h1 className="text-4xl md:text-6xl font-bold mb-4 nature-gradient">Lilian & Miguel</h1> */}
            <p className="text-xl text-nature-green">Estás cordialmente invitado a nuestra boda. Hemos pensado en vos con mucho cariño y queremos que nos acompañes en este viaje tan especial hacia el matrimonio</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="bg-white backdrop-blur-sm rounded-xl shadow-xl overflow-hidden mb-8 border border-nature-sage"
          >
            <div className="bg-gradient-to-r from-nature-green to-nature-sage p-4 text-green">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold">TARJETA DE EMBARQUE</h2>
                <Plane className="h-6 w-6" />
              </div>
            </div>

            <div className="p-6">
              <div className="flex flex-col md:flex-row justify-between gap-6 mb-6">
                <div>
                  <p className="text-sm text-nature-green mb-1">VUELO</p>
                  <p className="text-2xl font-bold">LM-2026</p>
                </div>
                <div>
                  <p className="text-sm text-nature-green mb-1">FECHA</p>
                  <p className="text-2xl font-bold">14 FEB 2026</p>
                </div>
                <div>
                  <p className="text-sm text-nature-green mb-1">HORA</p>
                  <p className="text-2xl font-bold">20:00 HRS</p>
                </div>
              </div>

              <div className="flex flex-col md:flex-row justify-between gap-6 mb-6">
                <div>
                  <p className="text-sm text-nature-green mb-1">ORIGEN</p>
                  <div className="flex items-center">
                    <p className="text-xl font-bold mr-2">SOLTERÍA</p>
                    <p className="text-sm text-nature-green">(SLT)</p>
                  </div>
               </div>
               <div className="hidden md:flex items-center justify-center">
                  <div className="w-24 h-0.5 bg-nature-sage relative">
                    <Plane className="absolute -top-2 -right-3 h-5 w-5 text-nature-green transform rotate-[40deg]" />
                  </div>
               </div>
                <div>
                  <p className="text-sm text-nature-green mb-1">DESTINO</p>
                  <div className="flex items-center">
                    <p className="text-xl font-bold mr-2">MATRIMONIO</p>
                    <p className="text-sm text-nature-green">(MTR)</p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col md:flex-row justify-between gap-6 mb-6">
                <div>
                  <p className="text-sm text-nature-green mb-1">CEREMONIA</p>
                  <div className="flex items-center">
                    <MapPin className="h-5 w-5 text-nature-green mr-2" />
                    <p className="text-sm font-bold">EL TEMPLO CATÓLICO DEL PUEBLO DE LA ESPERANZA</p>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-nature-green mb-1">RECEPCIÓN</p>
                  <div className="flex items-center">
                    <Utensils className="h-5 w-5 text-nature-green mr-2" />
                    <p className="text-sm font-bold">GOLF CLUB - LA ESPERANZA</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t border-dashed border-nature-sage p-6 flex justify-between items-center">

              <div className="flex items-center">
                <Heart className="h-6 w-6 text-nature-green mr-2" />
                <p className="font-medium">
                  {alreadyConfirmed && (`¡Tu asistencia ya fue confirmada!`)}
                  {!alreadyConfirmed && (`¡No olvides confirmar tu asistencia!`)} 
                </p>
              </div>

              {alreadyConfirmed && (
              <Button
                onClick={handleOpenTicket}
                className="bg-gradient-to-r from-nature-green to-nature-sage hover:from-nature-sage hover:to-nature-cream text-white"
              >
                Ver Ticket
              </Button>

              )}
              {!alreadyConfirmed && (              
                <Button
                onClick={() => {
                  document.getElementById("rsvp")?.scrollIntoView({ behavior: "smooth" })
                }}
                className="bg-gradient-to-r from-nature-green to-nature-sage hover:from-nature-sage hover:to-nature-cream text-white"
              >
                Check-in
              </Button>)} 
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.9 }}
            className="flex justify-center"
          >
            <Button
              size="lg"
              className="rounded-full bg-nature-green hover:bg-nature-sage text-white px-8 group"
              onClick={() => {
                document.getElementById("rsvp")?.scrollIntoView({ behavior: "smooth" })
              }}
            >
              Hacer Check-in
              <ChevronDown className="ml-2 h-4 w-4 transition-transform group-hover:translate-y-1" />
            </Button>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.5 }}
          className="absolute bottom-10 left-0 right-0 flex justify-center"
        >
          <div
            className="animate-bounce cursor-pointer"
            onClick={() => {
              document.getElementById("rsvp")?.scrollIntoView({ behavior: "smooth" })
            }}
          >
            <ChevronDown className="h-8 w-8 text-nature-green" />
          </div>
        </motion.div>

        {/* Popup del Ticket */}
        {showTicket && (
            <PopUpTicket
            onClose={handleCloseTicket}
            />
        )}

    </>
  );
};

export default CheckinCard;
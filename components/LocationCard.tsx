"use client"

import type React from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { TbMapPinHeart } from "react-icons/tb";

interface LocationCardProps {
  type: "origen" | "destino"
  title: string
  place: string
  address: string
  onMapClick?: () => void
}

const LocationCard: React.FC<LocationCardProps> = ({ type, title, place, address, onMapClick }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
      className="relative w-full max-w-md mx-auto rounded-xl overflow-hidden mb-8"
    >
      {/* Fondo con imagen difuminada */}
      <div className="absolute inset-0 bg-[url('/placeholder.svg?height=800&width=450')] bg-cover bg-center">
        <div className="absolute inset-0 bg-white/80 backdrop-blur-sm"></div>
      </div>

      {/* Contenido */}
      <div className="relative h-full flex flex-col items-center justify-center p-6 text-center">
        {/* Icono de ubicación con corazón */}
        <div className="mb-4">
          <div className="relative w-16 h-16">
            <TbMapPinHeart className="w-16 h-16 text-nature-green" strokeWidth={1.5} />
          </div>
        </div>

        {/* Título estilizado */}
        <h2 className="text-5xl font-serif text-nature-green mb-6">
          {type === "origen" ? "Origen" : "Destino"}
        </h2>

        {/* Información */}
        <div className="space-y-2 mb-8">
          <p className="text-2xl font-medium text-nature-green">{title}</p>
          <p className="text-xl text-nature-green">"{place}"</p>
          <p className="text-lg text-nature-green/80">{address}</p>
        </div>

        {/* Botón Ver mapa */}
        <Button onClick={onMapClick} className="bg-nature-green hover:bg-nature-sage text-white rounded-full px-8 py-2">
          Ver mapa
        </Button>
      </div>
    </motion.div>
  )
}

export default LocationCard


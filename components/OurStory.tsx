'use client'
import { motion } from 'framer-motion'
import { Heart } from 'lucide-react'

export default function OurStory() {
  return (
    <motion.div
      initial={{ opacity: 0, x: -30 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.8, delay: 0.3 }}
      viewport={{ once: true }}
      className="bg-white backdrop-blur-sm rounded-xl shadow-xl overflow-hidden h-full border border-nature-sage"
    >
      <div className="bg-gradient-to-r from-nature-green to-nature-sage p-4 text-white">
        <h3 className="text-xl font-bold">NUESTRA HISTORIA</h3>
      </div>

      <div className="p-6 flex flex-col justify-between">
        <p className="text-nature-green mb-6">
          Hace 5 años, nuestros caminos se cruzaron en un vuelo con
          destino a París. Lo que comenzó como una conversación casual
          entre dos desconocidos, se convirtió en el inicio de nuestra
          historia de amor.
        </p>

        <p className="text-nature-green mb-6">
          Desde entonces, hemos compartido innumerables aventuras,
          risas, y momentos inolvidables. Cada día juntos ha sido un
          nuevo capítulo en nuestro viaje.
        </p>

        <p className="text-nature-green mb-6">
          Hoy, queremos comenzar la aventura más importante de nuestras
          vidas, y no podríamos imaginar emprenderla sin ti a nuestro
          lado.
        </p>

        <div className="flex justify-center">
          <Heart className="h-12 w-12 text-nature-green" />
        </div>
      </div>
    </motion.div>
  )
}
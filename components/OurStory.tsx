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
        <h3 className="text-xl font-bold">VOTOS MATRIMONIALES</h3>
      </div>

      <div className="p-6 flex flex-col justify-between">
        <p className="text-nature-green mb-6">
          Hoy prometo embarcarme contigo en el viaje más hermoso de todos: la vida juntos.
          No importa cuántas escalas, desvíos o turbulencias encontremos, siempre serás mi destino favorito.
          Te elijo como mi compañero/a de ruta, mi brújula cuando me pierda y mi hogar en cualquier parte del mundo.
          Prometo sostener tu mano en cada aterrizaje y mirar juntos el horizonte en cada despegue.
          Contigo, todos los caminos conducen al amor.
        </p>


        <div className="flex justify-center">
          <Heart className="h-12 w-12 text-nature-green" />
        </div>
      </div>
    </motion.div>
  )
}
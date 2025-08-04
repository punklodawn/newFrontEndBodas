'use client'
import { motion } from 'framer-motion'
import { Heart } from 'lucide-react'
import PhotoGallery from '@/components/PhotoGallery'
import OurStory from '@/components/OurStory'

export default function FlightSection() {
  return (
    <section
      id="flight"
      className="min-h-screen flex flex-col items-center justify-center relative py-20 px-4"
    >
      <div className="max-w-4xl w-full mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="inline-block bg-nature-sage text-nature-green px-3 py-1 rounded-full text-sm font-medium mb-4 border border-nature-cream">
            PASO 4
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4 nature-gradient">
            En Vuelo
          </h2>
          <p className="text-lg text-nature-green max-w-2xl mx-auto">
            Disfruta del viaje y de todos los momentos especiales que hemos
            preparado
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          <OurStory />
          <PhotoGallery />
        </div>
      </div>
    </section>
  )
}
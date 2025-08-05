'use client'
import { motion } from 'framer-motion'
import { useState } from 'react'
import Image from 'next/image'

// Reemplaza estas URLs con tus imágenes reales
const galleryImages = [
  'https://res.cloudinary.com/dgqhmzdoo/image/upload/v1742182954/WhatsApp_Image_2025-03-13_at_22.16.38_66982df8_p4ffux.jpg',
  'https://res.cloudinary.com/dgqhmzdoo/image/upload/v1742182954/WhatsApp_Image_2025-03-13_at_22.15.33_313ba5a7_bzxuud.jpg',
  'https://res.cloudinary.com/dgqhmzdoo/image/upload/v1742185330/20221010_160037_ngeund.jpg',
  'https://res.cloudinary.com/dgqhmzdoo/image/upload/v1742182954/WhatsApp_Image_2025-03-13_at_22.16.36_92b46dbc_scq6w1.jpg',
  'https://res.cloudinary.com/dgqhmzdoo/image/upload/v1754356548/1754354535970_mygrmh.jpg',
  'https://res.cloudinary.com/dgqhmzdoo/image/upload/v1754356548/1754354183966_t7nv4z.jpg'
  // Agrega más imágenes según necesites
]

export default function PhotoGallery() {
  const [selectedImage, setSelectedImage] = useState<number | null>(null)
  const [imageDescriptions] = useState([
  "Nuestro primer viaje juntos",
  "Celebrando nuestro aniversario",
  "Preparativos de la boda",
  "Momento especial en la playa",
  "Viaje en las alturas",
  "Viaje por las cataratas"

])

  const openLightbox = (index: number) => {
    setSelectedImage(index)
    document.body.style.overflow = 'hidden' // Deshabilita el scroll
    const player = document.querySelector('.music-player');
    if (player) {
      player.classList.add('hidden');
    }

  }

  const closeLightbox = () => {
    setSelectedImage(null)
    document.body.style.overflow = 'auto' // Habilita el scroll nuevamente
    const player = document.querySelector('.music-player');
    if (player) {
      player.classList.remove('hidden');
    }
  }

  const navigateImage = (direction: 'prev' | 'next') => {
    if (selectedImage === null) return
    
    if (direction === 'prev') {
      setSelectedImage(prev => 
        prev === 0 ? galleryImages.length - 1 : prev! - 1
      )
    } else {
      setSelectedImage(prev => 
        prev === galleryImages.length - 1 ? 0 : prev! + 1
      )
    }
  }

  return (
    <>
      <motion.div
        initial={{ opacity: 0, x: 30 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, delay: 0.5 }}
        viewport={{ once: true }}
        className="bg-white backdrop-blur-sm rounded-xl shadow-xl overflow-hidden border border-nature-sage"
      >
        <div className="bg-gradient-to-r from-nature-green to-nature-sage p-4 text-white">
          <h3 className="text-xl font-bold">NUESTRA HISTORIA EN FOTOS</h3>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-2 gap-4">
            {galleryImages.map((image, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.05 }}
                className="aspect-square overflow-hidden rounded-xl cursor-pointer border border-nature-sage relative"
                onClick={() => openLightbox(index)}
              >
                <Image
                  src={image}
                  alt={`Foto de la galería ${index + 1}`}
                  fill
                  className="object-cover hover:scale-110 transition-transform duration-300"
                  sizes="(max-width: 768px) 50vw, 25vw"
                />
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Lightbox */}
   {selectedImage !== null && (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4"
    onClick={closeLightbox}
  >
    {/* Botón de cerrar */}
    <button 
      onClick={(e) => {
        e.stopPropagation()
        closeLightbox()
      }}
      className="absolute top-6 right-6 text-white text-4xl z-50 hover:text-nature-sage transition-colors"
      aria-label="Cerrar visor"
    >
      &times;
    </button>

    {/* Navegación */}
    <button
      onClick={(e) => {
        e.stopPropagation()
        navigateImage('prev')
      }}
      className="absolute left-6 text-white text-4xl z-50 hover:text-nature-sage transition-colors p-2"
      aria-label="Imagen anterior"
    >
      &#10094;
    </button>

    <button
      onClick={(e) => {
        e.stopPropagation()
        navigateImage('next')
      }}
      className="absolute right-6 text-white text-4xl z-50 hover:text-nature-sage transition-colors p-2"
      aria-label="Siguiente imagen"
    >
      &#10095;
    </button>

    {/* Contenedor de la imagen */}
    <div 
      className="relative w-full max-w-6xl h-[85vh] mx-16"
      onClick={(e) => e.stopPropagation()}
    >
      <motion.div
        key={selectedImage}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.3 }}
        className="relative w-full h-full"
      >
        <Image
          src={galleryImages[selectedImage]}
          alt={`Foto ampliada ${selectedImage + 1}`}
          fill
          className="object-contain"
          priority
          quality={90}
        />
      </motion.div>
    </div>

    {/* Contador y descripción */}
    <div className="absolute bottom-6 left-0 right-0 flex justify-center items-center gap-4">
      <span className="bg-black/50 text-white px-3 py-1 rounded-full text-sm">
        {selectedImage + 1} / {galleryImages.length}
      </span>
      
      {/* Opcional: Descripción de la imagen */}
      {imageDescriptions[selectedImage] && (
        <span className="bg-black/50 text-white px-3 py-1 rounded-full text-sm max-w-md text-center">
          {imageDescriptions[selectedImage]}
        </span>
      )}
    </div>

    {/* Miniaturas (opcional) */}
    {/* <div className="absolute bottom-4 left-0 right-0 overflow-x-auto py-2 px-4 hidden md:flex justify-center gap-2">
      {galleryImages.map((img, idx) => (
        <button 
          key={idx} 
          onClick={(e) => {
            e.stopPropagation()
            setSelectedImage(idx)
          }}
          className={`w-16 h-16 rounded-md overflow-hidden border-2 transition-all ${selectedImage === idx ? 'border-nature-sage scale-110' : 'border-transparent'}`}
        >
          <Image 
            src={img} 
            width={64} 
            height={64} 
            className="object-cover w-full h-full" 
            alt="" 
          />
        </button>
      ))}
    </div> */}
  </motion.div>
)}
    </>
  )
}



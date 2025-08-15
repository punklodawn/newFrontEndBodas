'use client'
import { motion } from 'framer-motion'
import { useState } from 'react'
import Image from 'next/image'

const galleryImages = [
  'https://res.cloudinary.com/dgqhmzdoo/image/upload/v1754359891/IMG-20220529-WA0000_xoxtde.jpg',
  'https://res.cloudinary.com/dgqhmzdoo/image/upload/v1754359891/IMG-20221009-WA0035_sqfqh8.jpg',
  'https://res.cloudinary.com/dgqhmzdoo/image/upload/v1754359892/1754355344039_cikox8.jpg',
  'https://res.cloudinary.com/dgqhmzdoo/image/upload/v1754592566/1754412184724_r37zlk.jpg',
  'https://res.cloudinary.com/dgqhmzdoo/image/upload/v1754356548/1754354535970_mygrmh.jpg',
  'https://res.cloudinary.com/dgqhmzdoo/image/upload/v1754356548/1754354183966_t7nv4z.jpg',
  'https://res.cloudinary.com/dgqhmzdoo/image/upload/v1754592567/IMG-20220704-WA0047_rfkup8.jpg',
  'https://res.cloudinary.com/dgqhmzdoo/image/upload/v1754592567/1754412006004_jgpyfz.jpg',
  'https://res.cloudinary.com/dgqhmzdoo/image/upload/v1754592567/1754440492251_1_yzngn2.jpg',
  'https://res.cloudinary.com/dgqhmzdoo/image/upload/v1754592567/1754355177370_qegwzc.jpg',
  'https://res.cloudinary.com/dgqhmzdoo/image/upload/v1754592567/1754404648299_wkfbnz.jpg',
  'https://res.cloudinary.com/dgqhmzdoo/image/upload/v1754594727/1754593222370_2_nvgoyd.jpg'
]

const imageDescriptions = [
  "Nuestro primer viaje juntos, Salinas",
  "Un viaje Largooo pero valio la pena",
  "Celebrando nuestro aniversario",
  "Una escapada con Stand-Up",
  "Un viaje en las alturas",
  "Momento especial en Bote",
  "Linda, Salta la linda",
  "Aventuras sin parar",
  "Cueva, linda foto",
  "Nos Aguantamos el frio",
  "Norte argentino que bello",
  "Viaje a las cataratas, maravilla"
]

export default function PhotoGallery() {
  const [selectedImage, setSelectedImage] = useState<number | null>(null)
  const [currentSlide, setCurrentSlide] = useState(0)
  
  // Dividimos las imágenes en grupos de 4
  const groupedImages = []
  for (let i = 0; i < galleryImages.length; i += 4) {
    groupedImages.push(galleryImages.slice(i, i + 4))
  }

  const openLightbox = (index: number) => {
    // Calculamos el índice global sumando el offset del slide actual
    const globalIndex = currentSlide * 4 + index
    setSelectedImage(globalIndex)
    document.body.style.overflow = 'hidden'
    const player = document.querySelector('.music-player')
    if (player) player.classList.add('hidden')
  }

  const closeLightbox = () => {
    setSelectedImage(null)
    document.body.style.overflow = 'auto'
    const player = document.querySelector('.music-player')
    if (player) player.classList.remove('hidden')
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

  const nextSlide = () => {
    setCurrentSlide(prev => (prev === groupedImages.length - 1 ? 0 : prev + 1))
  }

  const prevSlide = () => {
    setCurrentSlide(prev => (prev === 0 ? groupedImages.length - 1 : prev - 1))
  }

  return (
    <>
      <motion.div
        initial={{ opacity: 0, x: 30 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, delay: 0.5 }}
        viewport={{ once: true }}
        className="bg-white backdrop-blur-sm rounded-xl shadow-xl overflow-hidden border border-nature-sage relative"
      >
        <div className="bg-gradient-to-r from-nature-green to-nature-sage p-4 text-white">
          <h3 className="text-xl font-bold">NUESTRA HISTORIA EN FOTOS</h3>
        </div>

        <div className="p-6 relative">
          {/* Botones de navegación del slider */}
          <button 
            onClick={prevSlide}
            className="absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-white/80 rounded-full p-2 shadow-md hover:bg-nature-sage hover:text-white transition-colors"
            aria-label="Slide anterior"
          >
            &#10094;
          </button>
          
          <button 
            onClick={nextSlide}
            className="absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-white/80 rounded-full p-2 shadow-md hover:bg-nature-sage hover:text-white transition-colors"
            aria-label="Slide siguiente"
          >
            &#10095;
          </button>

          {/* Contenedor del slider */}
          <div className="overflow-hidden">
            <motion.div
              animate={{
                x: `-${currentSlide * 100}%`
              }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="flex w-full"
            >
              {groupedImages.map((group, groupIndex) => (
                <div key={groupIndex} className="grid grid-cols-2 gap-4 min-w-full">
                  {group.map((image, index) => (
                    <motion.div
                      key={`${groupIndex}-${index}`}
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
                        alt={`Foto de la galería ${groupIndex * 4 + index + 1}`}
                        fill
                        className="object-cover hover:scale-110 transition-transform duration-300"
                        sizes="(max-width: 768px) 50vw, 25vw"
                      />
                    </motion.div>
                  ))}
                </div>
              ))}
            </motion.div>
          </div>

          {/* Indicadores de slide */}
          <div className="flex justify-center mt-4 gap-2">
            {groupedImages.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-3 h-3 rounded-full ${currentSlide === index ? 'bg-nature-sage' : 'bg-gray-300'}`}
                aria-label={`Ir al slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </motion.div>

      {/* Lightbox (se mantiene igual) */}
      {selectedImage !== null && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4"
          onClick={closeLightbox}
        >
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

          <div className="absolute bottom-6 left-0 right-0 flex justify-center items-center gap-4">
            <span className="bg-black/50 text-white px-3 py-1 rounded-full text-sm">
              {selectedImage + 1} / {galleryImages.length}
            </span>
            
            {imageDescriptions[selectedImage] && (
              <span className="bg-black/50 text-white px-3 py-1 rounded-full text-sm max-w-md text-center">
                {imageDescriptions[selectedImage]}
              </span>
            )}
          </div>
        </motion.div>
      )}
    </>
  )
}
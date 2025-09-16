import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"

const images = [
  "https://images.unsplash.com/photo-1519225421980-715cb0215aed?ixlib=rb-1.2.1&auto=format&fit=crop&w=2850&q=80",
  "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?ixlib=rb-1.2.1&auto=format&fit=crop&w=2850&q=80",
  "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?ixlib=rb-1.2.1&auto=format&fit=crop&w=2850&q=80",
  'https://res.cloudinary.com/dgqhmzdoo/image/upload/v1742763344/14074819238_6c00f7f002_o-1024x575_rvwrew.jpg'
]

export default function BackgroundSlider() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isVisible, setIsVisible] = useState(false)
  const [petals, setPetals] = useState([])

  useEffect(() => {
    setIsVisible(true)
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length)
    }, 6000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="h-screen relative flex items-center justify-center overflow-hidden">
      <AnimatePresence initial={false}>
        <motion.div
          key={currentImageIndex}
          className="absolute inset-0 bg-cover bg-center"
          initial={{ 
            opacity: 0,
            scale: 1,
            rotate: 0.5
          }}
          animate={{ 
            opacity: 1,
            scale: 1,
            rotate: 0
          }}
          exit={{ 
            opacity: 0,
            scale: 1,
            rotate: -0.5
          }}
          transition={{ 
            duration: 3,
            ease: "easeInOut"
          }}
          style={{
            backgroundImage: `url("${images[currentImageIndex]}")`,
            backgroundAttachment: "fixed",
          }}
        />
      </AnimatePresence>
      
      {/* Overlay con gradiente romántico */}
      <div className="absolute inset-0 bg-gradient-to-b from-olive-500/20 via-transparent to-olive-300/30" />
      <div className="absolute inset-0 bg-black bg-opacity-20" />
    
      
      <div
        className={`relative text-center text-white transition-all duration-1000 transform z-10 ${
          isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
        }`}
      >
        <motion.h3 
          className="text-2xl mb-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          ¡NOS CASAMOS!
        </motion.h3>
        <motion.h1 
          className="text-5xl md:text-7xl font-serif mb-6 bg-clip-text"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          Lilian & Miguel
        </motion.h1>
        <motion.p 
          className="text-xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
        >
          14 de Febrero, 2026
        </motion.p>
      
      </div>
    </div>
  )
}
import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"

const images = [
  "https://images.unsplash.com/photo-1519225421980-715cb0215aed?ixlib=rb-1.2.1&auto=format&fit=crop&w=2850&q=80",
  "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?ixlib=rb-1.2.1&auto=format&fit=crop&w=2850&q=80",
  "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?ixlib=rb-1.2.1&auto=format&fit=crop&w=2850&q=80",
  'https://res.cloudinary.com/dgqhmzdoo/image/upload/v1742763344/14074819238_6c00f7f002_o-1024x575_rvwrew.jpg'
  // Add more image URLs as needed
]

export default function BackgroundSlider() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length)
    }, 6000) // Change image every 5 seconds

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="h-screen relative flex items-center justify-center overflow-hidden">
      <AnimatePresence initial={false}>
        <motion.div
          key={currentImageIndex}
          className="absolute inset-0 bg-cover bg-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 3 }}
          style={{
            backgroundImage: `url("${images[currentImageIndex]}")`,
            backgroundAttachment: "fixed",
          }}
        />
      </AnimatePresence>
      <div className="absolute inset-0 bg-black bg-opacity-40" />
      <div
        className={`relative text-center text-white transition-all duration-1000 transform ${
          isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
        }`}
      >
        <h3 className="text-2xl mb-4 animate-fade-in">¡NOS CASAMOS!</h3>
        <h1 className="text-7xl font-serif mb-6 animate-fade-in delay-200">Lilian & Miguel</h1>
        <p className="text-xl animate-fade-in delay-400">14 de Febrero, 2026</p>
      </div>
    </div>
  )
}
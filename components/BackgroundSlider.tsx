import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
    Plane,
    Calendar,
    MapPin,
    Users,
    Gift,
    Clock,
    ChevronDown,
    Heart,
    Luggage,
    Utensils,
    Music,
    Home,
  } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import confetti from "canvas-confetti"
import PopUpTicket from "./popUpTicket"

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
  const [alreadyConfirmed, setAlreadyConfirmed] = useState(false);
  const [savedData, setSavedData] = useState<FormData | null>(null);
    const [showTicket, setShowTicket] = useState(false)

  useEffect(() => {
    setIsVisible(true)
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length)
    }, 5000) // Change image every 5 seconds

    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
      // Verificar localStorage al cargar el componente
      const savedData = localStorage.getItem('rsvpConfirmation');
      if (savedData) {
          const parsedData = JSON.parse(savedData);
          setSavedData(parsedData); // Guardar los datos en el estado
          setAlreadyConfirmed(true);
      }
    }, []);

      const handleOpenTicket = () => {
        setShowTicket(true)
        setTimeout(() => {
          const canvas = document.createElement("canvas")
          canvas.style.position = "fixed"
          canvas.style.inset = "0"
          canvas.style.width = "100vw"
          canvas.style.height = "100vh"
          canvas.style.zIndex = "999"
          canvas.style.pointerEvents = "none"
          document.body.appendChild(canvas)
    
          const myConfetti = confetti.create(canvas, {
            resize: true,
            useWorker: true,
          })
    
          myConfetti({
            particleCount: 100,
            spread: 160,
            colors: ["#f2f2f0", "#e5e6d8", "#c5d1b8", "#7d9d7f"],
            origin: { y: 0.6 },
          })
    
          setTimeout(() => {
            document.body.removeChild(canvas)
          }, 3000)
        }, 500)
      }

  return (
    
    <div className="relative min-h-screen bg-white text-nature-green overflow-x-hidden">
        
      {/* Boarding Pass Popup */}
      <AnimatePresence>
      {showTicket && (
          <PopUpTicket
            onClose={() => setShowTicket(false)}
          />
        )}
      </AnimatePresence>

      <AnimatePresence initial={false}>
        <motion.div
          key={currentImageIndex}
          className="absolute inset-0 bg-cover bg-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
          style={{
            backgroundImage: `url("${images[currentImageIndex]}")`,
            backgroundAttachment: "fixed",
          }}
        />
      </AnimatePresence>
          {/* Check-in Section */}
          <section id="check-in" className="min-h-screen flex flex-col items-center justify-center relative py-20 px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="absolute inset-0 pointer-events-none"
          >
            <div className="absolute top-0 left-0 w-full h-full bg-[url('/placeholder.svg?height=1080&width=1920')] bg-cover bg-center opacity-10"></div>
          </motion.div>
  
          <div className="max-w-4xl w-full mx-auto z-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="text-center mb-8"
            >
              <div className="inline-block bg-nature-sage text-nature-black px-3 py-1 rounded-full text-sm font-medium mb-4 border border-nature-cream">
               {alreadyConfirmed && (`CHECK-IN CERRADO`)}
               {!alreadyConfirmed && (`CHECK-IN ABIERTO`)} 
              </div>
              {/* <h1 className="text-4xl md:text-6xl bg-nature-sage nature-gradient-black px-3 py-1 rounded-full text-sm font-medium mb-4 rounded-full border border-nature-cream">Lilian & Miguel</h1>
              <p className="text-xl text-nature-black">Te invitan a embarcar en su viaje hacia el matrimonio</p>
               */}
              <h1 className="bg-nature-sage text-nature-black py-1 rounded-full text-4xl md:text-6xl font-medium mb-4 border border-nature-cream">LILIAN & MIGUEL</h1>
              <p className="bg-nature-sage rounded-full text-xl text-nature-black">Te invitan a embarcar en su viaje hacia el matrimonio</p>
            </motion.div>
  
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.6 }}
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
  
                <div className="flex flex-col md:flex-row justify-between gap-6">
                  <div>
                    <p className="text-sm text-nature-green mb-1">CEREMONIA</p>
                    <div className="flex items-center">
                      <MapPin className="h-5 w-5 text-nature-green mr-2" />
                      <p className="font-medium">Iglesia San Francisco</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-nature-green mb-1">RECEPCIÓN</p>
                    <div className="flex items-center">
                      <Utensils className="h-5 w-5 text-nature-green mr-2" />
                      <p className="font-medium">Hotel Majestic</p>
                    </div>
                  </div>
                </div>
              </div>
  
              <div className="border-t border-dashed border-nature-sage p-6 flex justify-between items-center">
                <div className="flex items-center">
                  <Heart className="h-6 w-6 text-nature-green mr-2" />
                  <p className="font-medium">¡No olvides confirmar tu asistencia!</p>
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
        </section>

    </div>

  )
}
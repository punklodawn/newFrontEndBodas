"use client"
import type React from "react"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion"
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
import PopUpTicket  from "@/components/popUpTicket"
import RSVPForm from "@/components/RSVPForm"
import BackgroundSlider from "@/components/BackgroundSlider"
import confetti from "canvas-confetti"

export default function WeddingFlightInvitation() {
  const [mounted, setMounted] = useState(false)
  const [currentSection, setCurrentSection] = useState(0)
  const [showTicket, setShowTicket] = useState(false)
  const [alreadyConfirmed, setAlreadyConfirmed] = useState(false);
  const [savedData, setSavedData] = useState<FormData | null>(null);


  const sections = ["check-in", "security", "boarding", "flight", "landing", "baggage"]

  const mainRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: mainRef,
    offset: ["start start", "end end"],
  })

  const planeY = useTransform(scrollYProgress, [0, 1], ["0%", "80%"])
  const planeRotate = useTransform(scrollYProgress, [0, 0.2, 0.4, 0.6, 0.8, 1], [0, 10, 0, -10, 0, 5])

  // Countdown timer
  const weddingDate = new Date("2025-06-15T16:00:00")
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  })


  useEffect(() => {
    // Verificar localStorage al cargar el componente
    const savedData = localStorage.getItem('rsvpConfirmation');
    if (savedData) {
        const parsedData = JSON.parse(savedData);
        setSavedData(parsedData); // Guardar los datos en el estado
        setAlreadyConfirmed(true);
    }
  }, []);

  useEffect(() => {
    setMounted(true)

    const calculateTimeLeft = () => {
      const difference = +weddingDate - +new Date()

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        })
      }
    }

    calculateTimeLeft()
    const timer = setInterval(calculateTimeLeft, 1000)

    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      if (!mainRef.current) return

      const scrollPosition = window.scrollY
      const windowHeight = window.innerHeight
      const fullHeight = mainRef.current.scrollHeight

      const sectionHeight = fullHeight / sections.length
      const currentSectionIndex = Math.min(Math.floor(scrollPosition / sectionHeight), sections.length - 1)

      setCurrentSection(currentSectionIndex)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [sections.length])

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

  if (!mounted) return null

  return (
    <div ref={mainRef} className="relative min-h-screen bg-white text-nature-green overflow-x-hidden">
      {/* Flying Plane Animation */}
      <motion.div
        className="fixed left-0 w-full z-50 pointer-events-none"
        style={{
          y: planeY,
          rotate: planeRotate,
          x: "10%",
        }}
      >
        <motion.div
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
          className="relative"
        >
          <Plane className="h-16 w-16 text-nature-green transform -rotate-45" />
          <motion.div
            className="absolute top-8 -left-20 w-20 h-4 bg-gradient-to-r from-transparent via-nature-sage to-transparent opacity-60"
            animate={{
              width: ["0%", "200%", "0%"],
              x: ["-100%", "100%", "-100%"],
            }}
            transition={{
              repeat: Number.POSITIVE_INFINITY,
              duration: 2,
              ease: "linear",
            }}
          />
        </motion.div>
      </motion.div>

      <BackgroundSlider/>

      {/* Navigation Indicator */}
      <div className="fixed right-4 top-1/2 transform -translate-y-1/2 z-40">
        <div className="flex flex-col items-center space-y-4">
          {sections.map((section, index) => (
            <a
              key={section}
              href={`#${section}`}
              className={cn(
                "w-3 h-3 rounded-full transition-all duration-300",
                currentSection === index ? "bg-nature-green scale-125" : "bg-nature-sage hover:bg-nature-cream",
              )}
              aria-label={`Go to ${section} section`}
            />
          ))}
        </div>
      </div>

      {/* Boarding Pass Popup */}
      <AnimatePresence>
      {showTicket && (
          <PopUpTicket
            onClose={() => setShowTicket(false)}
          />
        )}
      </AnimatePresence>
      
      {/* RSVP Form Section */}
      <section
        id="rsvp"
        className="min-h-screen flex flex-col items-center justify-center py-20 px-4 bg-gradient-to-b from-white to-nature-cream"
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
              PASO 1
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4 nature-gradient">Confirma tu Asistencia</h2>
            <p className="text-lg text-nature-green max-w-2xl mx-auto">
              Por favor completa tu check-in antes del 15 de mayo para asegurar tu asiento en nuestro vuelo hacia la
              felicidad
            </p>
          </motion.div>

            <RSVPForm/>
        </div>
      </section>

      {/* Security/Countdown Section */}
      <section
        id="security"
        className="min-h-screen flex flex-col items-center justify-center py-20 px-4 bg-gradient-to-b from-nature-cream to-white"
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
              PASO 2
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4 nature-gradient">Tiempo de Espera</h2>
            <p className="text-lg text-nature-green max-w-2xl mx-auto">
              Nuestro vuelo despegará pronto. Revisa el tiempo restante en nuestro tablero de salidas
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            viewport={{ once: true }}
            className="bg-nature-green text-white rounded-xl shadow-xl overflow-hidden mb-12 border border-nature-sage"
          >
            <div className="p-6 md:p-10">
              <div className="flex flex-col md:flex-row justify-between items-center mb-8">
                <div className="flex items-center mb-4 md:mb-0">
                  <Clock className="h-6 w-6 text-nature-cream mr-3" />
                  <h3 className="text-2xl font-bold">CUENTA REGRESIVA</h3>
                </div>
                <div className="flex items-center">
                  <p className="text-lg mr-3">VUELO:</p>
                  <p className="text-xl font-bold text-nature-cream">MJ-2025</p>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <CountdownItem value={timeLeft.days} label="DÍAS" />
                <CountdownItem value={timeLeft.hours} label="HORAS" />
                <CountdownItem value={timeLeft.minutes} label="MINUTOS" />
                <CountdownItem value={timeLeft.seconds} label="SEGUNDOS" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            viewport={{ once: true }}
            className="bg-white backdrop-blur-sm rounded-xl shadow-xl overflow-hidden border border-nature-sage"
          >
            <div className="bg-gradient-to-r from-nature-green to-nature-sage p-4 text-white">
              <h3 className="text-xl font-bold">INFORMACIÓN IMPORTANTE</h3>
            </div>

            <div className="p-6">
              <div className="grid md:grid-cols-2 gap-6">
                <InfoItem
                  icon={<Calendar className="h-10 w-10 text-nature-green" />}
                  title="Fecha y Hora"
                  description="15 de Junio, 2025 a las 16:00 horas. Te recomendamos llegar 30 minutos antes."
                />
                <InfoItem
                  icon={<MapPin className="h-10 w-10 text-nature-green" />}
                  title="Ubicación"
                  description="Ceremonia: Iglesia San Francisco, Calle Principal 123. Recepción: Hotel Majestic."
                />
                <InfoItem
                  icon={<Users className="h-10 w-10 text-nature-green" />}
                  title="Código de Vestimenta"
                  description="Formal. Los hombres en traje y las mujeres en vestido de cóctel."
                />
                <InfoItem
                  icon={<Gift className="h-10 w-10 text-nature-green" />}
                  title="Regalos"
                  description="Tu presencia es nuestro mejor regalo. Si deseas obsequiarnos algo, tenemos una lista de bodas disponible."
                />
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Boarding Section */}
      <section
        id="boarding"
        className="min-h-screen flex flex-col items-center justify-center py-20 px-4 bg-gradient-to-b from-white to-nature-cream"
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
              PASO 3
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4 nature-gradient">Embarque</h2>
            <p className="text-lg text-nature-green max-w-2xl mx-auto">
              Prepárate para abordar nuestro vuelo hacia la felicidad eterna
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            viewport={{ once: true }}
            className="bg-white backdrop-blur-sm rounded-xl shadow-xl overflow-hidden mb-12 border border-nature-sage"
          >
            <div className="bg-gradient-to-r from-nature-green to-nature-sage p-4 text-white">
              <h3 className="text-xl font-bold">ITINERARIO DEL VUELO</h3>
            </div>

            <div className="p-6">
              <div className="relative">
                <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-nature-sage"></div>

                <TimelineItem
                  time="16:00"
                  title="Despegue - Ceremonia"
                  description="Nuestra aventura comienza con una hermosa ceremonia en la Iglesia San Francisco."
                  icon={<Plane className="h-6 w-6 text-white" />}
                />

                <TimelineItem
                  time="18:00"
                  title="Altitud de Crucero - Cóctel"
                  description="Disfruta de un momento de relajación con bebidas y aperitivos mientras celebramos juntos."
                  icon={<Utensils className="h-6 w-6 text-white" />}
                />

                <TimelineItem
                  time="20:00"
                  title="Servicio a Bordo - Cena"
                  description="Deliciosa cena preparada especialmente para compartir este momento tan especial."
                  icon={<Utensils className="h-6 w-6 text-white" />}
                />

                <TimelineItem
                  time="22:00"
                  title="Entretenimiento - Baile"
                  description="¡A mover el cuerpo! La fiesta continúa con música y baile para todos."
                  icon={<Music className="h-6 w-6 text-white" />}
                  isLast={true}
                />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            viewport={{ once: true }}
            className="bg-white backdrop-blur-sm rounded-xl shadow-xl overflow-hidden border border-nature-sage"
          >
            <div className="bg-gradient-to-r from-nature-green to-nature-sage p-4 text-white">
              <h3 className="text-xl font-bold">MAPA DE RUTA</h3>
            </div>

            <div className="p-6">
              <div className="h-64 md:h-80 bg-nature-cream rounded-xl overflow-hidden relative border border-nature-sage">
                <div className="w-full h-full bg-[url('/placeholder.svg?height=600&width=1200')] bg-cover bg-center opacity-50"></div>

                <motion.div
                  className="absolute top-1/4 left-1/4 w-4 h-4 rounded-full bg-nature-green"
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [1, 0.8, 1],
                  }}
                  transition={{
                    repeat: Number.POSITIVE_INFINITY,
                    duration: 2,
                  }}
                />

                <motion.div
                  className="absolute bottom-1/3 right-1/4 w-4 h-4 rounded-full bg-nature-green"
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [1, 0.8, 1],
                  }}
                  transition={{
                    repeat: Number.POSITIVE_INFINITY,
                    duration: 2,
                    delay: 1,
                  }}
                />

                <motion.div
                  className="absolute top-1/4 left-1/4 bottom-1/3 right-1/4 border-2 border-dashed border-nature-green rounded-full pointer-events-none"
                  style={{
                    clipPath: "polygon(0 0, 100% 0, 100% 100%, 0% 100%)",
                  }}
                  animate={{
                    rotate: 360,
                  }}
                  transition={{
                    repeat: Number.POSITIVE_INFINITY,
                    duration: 20,
                    ease: "linear",
                  }}
                />

                <motion.div
                  className="absolute top-1/4 left-1/4 w-16 h-16 -ml-8 -mt-8"
                  animate={{
                    x: ["0%", "100%"],
                    y: ["0%", "100%"],
                  }}
                  transition={{
                    repeat: Number.POSITIVE_INFINITY,
                    duration: 10,
                    ease: "easeInOut",
                  }}
                >
                  <Plane className="h-8 w-8 text-nature-green transform -rotate-45" />
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Flight Section */}
      <section
        id="flight"
        className="min-h-screen flex flex-col items-center justify-center py-20 px-4 bg-gradient-to-b from-nature-cream to-white"
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
            <h2 className="text-3xl md:text-4xl font-bold mb-4 nature-gradient">En Vuelo</h2>
            <p className="text-lg text-nature-green max-w-2xl mx-auto">
              Disfruta del viaje y de todos los momentos especiales que hemos preparado
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
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

              <div className="p-6 flex flex-col h-full">
                <p className="text-nature-green mb-6">
                  Hace 5 años, nuestros caminos se cruzaron en un vuelo con destino a París. Lo que comenzó como una
                  conversación casual entre dos desconocidos, se convirtió en el inicio de nuestra historia de amor.
                </p>

                <p className="text-nature-green mb-6">
                  Desde entonces, hemos compartido innumerables aventuras, risas, y momentos inolvidables. Cada día
                  juntos ha sido un nuevo capítulo en nuestro viaje.
                </p>

                <p className="text-nature-green mb-6">
                  Hoy, queremos comenzar la aventura más importante de nuestras vidas, y no podríamos imaginar
                  emprenderla sin ti a nuestro lado.
                </p>

                <div className="mt-auto flex justify-center">
                  <Heart className="h-12 w-12 text-nature-green" />
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              viewport={{ once: true }}
              className="bg-white backdrop-blur-sm rounded-xl shadow-xl overflow-hidden border border-nature-sage"
            >
              <div className="bg-gradient-to-r from-nature-green to-nature-sage p-4 text-white">
                <h3 className="text-xl font-bold">GALERÍA DE FOTOS</h3>
              </div>

              <div className="p-6">
                <div className="grid grid-cols-2 gap-4">
                  {[1, 2, 3, 4].map((i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, scale: 0.9 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.6, delay: i * 0.1 }}
                      viewport={{ once: true }}
                      whileHover={{ scale: 1.05 }}
                      className="aspect-square overflow-hidden rounded-xl cursor-pointer border border-nature-sage"
                    >
                      <div
                        className={cn(
                          "w-full h-full bg-cover bg-center transition-transform duration-500 hover:scale-110",
                          `bg-[url('/placeholder.svg?height=400&width=400')]`,
                        )}
                      ></div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Landing Section */}
      <section
        id="landing"
        className="min-h-screen flex flex-col items-center justify-center py-20 px-4 bg-gradient-to-b from-white to-nature-cream"
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
              PASO 5
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4 nature-gradient">Aterrizaje</h2>
            <p className="text-lg text-nature-green max-w-2xl mx-auto">
              Llegamos a nuestro destino final: una vida juntos llena de amor y felicidad
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            viewport={{ once: true }}
            className="bg-white backdrop-blur-sm rounded-xl shadow-xl overflow-hidden mb-12 border border-nature-sage"
          >
            <div className="bg-gradient-to-r from-nature-green to-nature-sage p-4 text-white">
              <h3 className="text-xl font-bold">AGRADECIMIENTO ESPECIAL</h3>
            </div>

            <div className="p-6 text-center">
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
              >
                <Heart className="h-16 w-16 text-nature-green mx-auto mb-6" />
              </motion.div>

              <h4 className="text-2xl font-bold text-nature-green mb-4">¡Gracias por acompañarnos!</h4>

              <p className="text-lg text-nature-green max-w-2xl mx-auto mb-8">
                Tu presencia en este día tan especial significa mucho para nosotros. Gracias por ser parte de nuestra
                historia y por compartir con nosotros el inicio de esta nueva etapa.
              </p>

              <div className="flex justify-center">
                <Button
                  onClick={handleOpenTicket}
                  className="bg-gradient-to-r from-nature-green to-nature-sage hover:from-nature-sage hover:to-nature-cream text-white px-8"
                >
                  Ver mi Ticket de Nuevo
                </Button>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            viewport={{ once: true }}
            className="bg-white backdrop-blur-sm rounded-xl shadow-xl overflow-hidden border border-nature-sage"
          >
            <div className="bg-gradient-to-r from-nature-green to-nature-sage p-4 text-white">
              <h3 className="text-xl font-bold">CONTACTO</h3>
            </div>

            <div className="p-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="text-center p-4">
                  <h4 className="text-xl font-bold text-nature-green mb-2">María</h4>
                  <p className="text-nature-green">+123 456 7890</p>
                  <p className="text-nature-green">maria@email.com</p>
                </div>

                <div className="text-center p-4">
                  <h4 className="text-xl font-bold text-nature-green mb-2">Juan</h4>
                  <p className="text-nature-green">+123 456 7891</p>
                  <p className="text-nature-green">juan@email.com</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Baggage Section */}
      <section
        id="baggage"
        className="min-h-screen flex flex-col items-center justify-center py-20 px-4 bg-gradient-to-b from-nature-cream to-white"
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
              PASO 6
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4 nature-gradient">Recogida de Equipaje</h2>
            <p className="text-lg text-nature-green max-w-2xl mx-auto">
              Si deseas hacernos un regalo, aquí encontrarás algunas opciones
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            viewport={{ once: true }}
            className="bg-white backdrop-blur-sm rounded-xl shadow-xl overflow-hidden border border-nature-sage"
          >
            <div className="bg-gradient-to-r from-nature-green to-nature-sage p-4 text-white">
              <div className="flex items-center">
                <Gift className="h-6 w-6 mr-3" />
                <h3 className="text-xl font-bold">LISTA DE REGALOS</h3>
              </div>
            </div>

            <div className="p-6">
              <p className="text-nature-green mb-8 text-center">
                Tu presencia es nuestro mejor regalo, pero si deseas obsequiarnos algo, aquí hay algunas opciones:
              </p>

              <div className="grid md:grid-cols-3 gap-6">
                <GiftItem
                  icon={<Luggage className="h-10 w-10 text-nature-green" />}
                  title="Luna de Miel"
                  description="Ayúdanos a crear recuerdos inolvidables en nuestro viaje de bodas."
                />

                <GiftItem
                  icon={<Home className="h-10 w-10 text-nature-green" />}
                  title="Nuestro Hogar"
                  description="Contribuye a que nuestro nuevo hogar sea un lugar especial."
                />

                <GiftItem
                  icon={<Gift className="h-10 w-10 text-nature-green" />}
                  title="Regalo Libre"
                  description="Sorpréndenos con algo que creas que nos encantará."
                />
              </div>

              <div className="mt-8 p-4 bg-nature-cream rounded-lg border border-nature-sage">
                <p className="text-center text-nature-green">
                  <strong>Datos bancarios:</strong> ES12 3456 7890 1234 5678 9012
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Footer */}
        <footer className="w-full mt-20 text-center">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="flex flex-col items-center"
          >
            <div className="flex items-center justify-center mb-4">
              <Heart className="h-6 w-6 text-nature-green mr-2" />
              <h2 className="text-2xl font-bold nature-gradient">María & Juan</h2>
            </div>
            <p className="text-nature-green mb-2">15 de Junio, 2025</p>
            <p className="text-nature-green/80">¡Esperamos verte en nuestra boda!</p>
          </motion.div>
        </footer>
      </section>
    </div>
  )
}

function CountdownItem({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <div className="bg-nature-green rounded-lg p-4 w-full text-center mb-2 border border-nature-sage">
        <motion.span
          key={value}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl md:text-4xl font-bold text-nature-white"
        >
          {value.toString().padStart(2, "0")}
        </motion.span>
      </div>
      <span className="text-sm">{label}</span>
    </div>
  )
}

function InfoItem({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode
  title: string
  description: string
}) {
  return (
    <div className="flex">
      <div className="mr-4 mt-1">{icon}</div>
      <div>
        <h4 className="text-lg font-bold text-nature-green mb-1">{title}</h4>
        <p className="text-nature-green">{description}</p>
      </div>
    </div>
  )
}

function TimelineItem({
  time,
  title,
  description,
  icon,
  isLast = false,
}: {
  time: string
  title: string
  description: string
  icon: React.ReactNode
  isLast?: boolean
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
      className="flex mb-8"
    >
      <div className="relative">
        <div className="w-16 h-16 rounded-full bg-gradient-to-r from-nature-green to-nature-sage flex items-center justify-center">
          {icon}
        </div>
        {!isLast && (
          <div className="absolute top-16 left-1/2 transform -translate-x-1/2 h-8 w-0.5 bg-nature-sage"></div>
        )}
      </div>
      <div className="ml-6">
        <div className="flex items-baseline mb-1">
          <h4 className="text-xl font-bold text-nature-green mr-3">{title}</h4>
          <span className="text-nature-green font-medium">{time}</span>
        </div>
        <p className="text-nature-green">{description}</p>
      </div>
    </motion.div>
  )
}

function GiftItem({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode
  title: string
  description: string
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
      className="bg-nature-cream rounded-xl p-6 text-center border border-nature-sage"
    >
      <div className="flex justify-center mb-4">{icon}</div>
      <h4 className="text-lg font-bold text-nature-green mb-2">{title}</h4>
      <p className="text-nature-green text-sm">{description}</p>
    </motion.div>
  )
}


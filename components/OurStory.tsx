'use client'
import { motion, AnimatePresence } from 'framer-motion'
import { Heart } from 'lucide-react'
import { useState, useEffect, useRef  } from "react"

export default function OurStory() {
  const texts = [
    "Hoy prometo embarcarme contigo en el viaje más hermoso de todos: la vida juntos.",
    "No importa cuántas escalas, desvíos o turbulencias encontremos, siempre serás mi destino favorito.",
    "Te elijo como mi compañero/a de ruta, mi brújula cuando me pierda y mi hogar en cualquier parte del mundo.",
    "Prometo sostener tu mano en cada aterrizaje y mirar juntos el horizonte en cada despegue.",
    "Contigo, todos los caminos conducen al amor."
  ]

  const [displayLines, setDisplayLines] = useState([])
  const [currentText, setCurrentText] = useState('')
  const [currentTextIndex, setCurrentTextIndex] = useState(0)
  const [charIndex, setCharIndex] = useState(0)
  const [showFinalMessage, setShowFinalMessage] = useState(false)
  const [allLinesWritten, setAllLinesWritten] = useState(false)
  const timeoutRef = useRef(null)

  useEffect(() => {
    // Limpiar timeout al desmontar el componente
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  useEffect(() => {
    if (allLinesWritten) {
      // Esperar 2-3 segundos después de escribir todas las líneas
      timeoutRef.current = setTimeout(() => {
        setShowFinalMessage(true);
        
        // Después de mostrar el mensaje final, reiniciar en 3 segundos
        timeoutRef.current = setTimeout(() => {
          restartAnimation();
        }, 3000);
      }, 2500); // 2.5 segundos de pausa
      
      return;
    }

    if (currentTextIndex >= texts.length) {
      // Todas las líneas han sido escritas
      setAllLinesWritten(true);
      return;
    }

    const currentFullText = texts[currentTextIndex]
    
    if (charIndex < currentFullText.length) {
      // Escribir el siguiente carácter
      timeoutRef.current = setTimeout(() => {
        setCurrentText(currentFullText.substring(0, charIndex + 1))
        setCharIndex(charIndex + 1)
      }, 80)
    } else {
      // Guardar la línea completada y preparar para la siguiente
      timeoutRef.current = setTimeout(() => {
        setDisplayLines(prev => [...prev, currentFullText])
        setCurrentText('')
        setCharIndex(0)
        setCurrentTextIndex(prev => prev + 1)
      }, 1000) // Pausa antes de comenzar la siguiente línea
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [charIndex, currentTextIndex, texts, allLinesWritten])
  
  const restartAnimation = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
    setDisplayLines([])
    setCurrentText('')
    setCurrentTextIndex(0)
    setCharIndex(0)
    setShowFinalMessage(false)
    setAllLinesWritten(false)
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: -30 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.8, delay: 0.3 }}
      viewport={{ once: true }}
      className="bg-white backdrop-blur-sm rounded-xl shadow-xl overflow-hidden h-full border border-nature-sage w-full" // Eliminado max-w-4xl para que se adapte al grid
    >
      <div className="bg-gradient-to-r from-nature-green to-nature-sage p-4 md:p-5 text-white"> {/* Responsive padding */}
        <h3 className="text-lg md:text-xl font-bold">VOTOS MATRIMONIALES</h3> {/* Texto más pequeño en móviles */}
      </div>

      <div className="text-center py-6 md:py-8 relative overflow-hidden"> {/* Responsive padding */}
        <div className="w-full mx-auto px-2 md:px-4"> {/* Responsive padding, eliminado max-w */}
          {/* Contenedor principal de texto */}
          <div className="relative min-h-[400px] md:min-h-[420px] flex flex-col items-center justify-center space-y-3 md:space-y-4"> {/* Altura responsive */}
            
            {/* Efecto de fondo suave */}
            <div className="absolute inset-0 bg-gradient-to-b from-nature-green/5 to-transparent pointer-events-none rounded-lg" />
            
            {/* Líneas completas ya escritas */}
            <AnimatePresence>
              {displayLines.map((line, index) => (
                <motion.p
                  key={`${index}-${line.substring(0, 10)}`}
                  className="text-sm md:text-base text-nature-green font-light leading-relaxed italic text-center px-1 md:px-2" /* Texto más pequeño */
                  initial={{ opacity: 0, y: 8, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0 }}
                  // transition={{ 
                  //   duration: 0.4, 
                  //   ease: "easeOut"
                  // }}
                >
                  "{line}"
                </motion.p>
              ))}
            </AnimatePresence>
            
            {/* Línea que se está escribiendo actualmente */}
            <AnimatePresence>
              {currentText && (
                <motion.p 
                  className="text-sm md:text-base text-nature-green font-light leading-relaxed italic text-center px-1 md:px-2" /* Texto más pequeño */
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  "{currentText}"
                  {/* Cursor parpadeante */}
                  <motion.span
                    className="inline-block w-0.5 h-4 md:h-5 bg-nature-sage ml-1 align-middle" /* cursor más pequeño */
                    animate={{ opacity: [1, 0] }}
                    transition={{ duration: 0.8, repeat: Infinity }}
                  />
                </motion.p>
              )}
            </AnimatePresence>
            
            {/* Mensaje final cuando termina el ciclo */}
            <AnimatePresence>
              {showFinalMessage && (
                <motion.div
                  className="absolute inset-0 flex items-center justify-center bg-white/90 backdrop-blur-sm rounded-lg"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.6 }}
                >
                  <motion.p 
                    className="text-lg md:text-xl text-nature-green font-serif text-center px-4 font-medium" /* Tamaño ajustado */
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ 
                      duration: 0.6, 
                      type: "spring",
                      stiffness: 100
                    }}
                  >
                    ✨ Para siempre juntos ✨
                  </motion.p>
                </motion.div>
              )}
            </AnimatePresence>
            
            {/* Placeholder inicial */}
            {displayLines.length === 0 && !currentText && !showFinalMessage && !allLinesWritten && (
              <motion.p 
                className="text-sm md:text-base text-nature-sage/60 font-light leading-relaxed italic"
                initial={{ opacity: 0.5 }}
                animate={{ opacity: 0.7 }}
              >
                ""
                <motion.span
                  className="inline-block w-0.5 h-4 md:h-5 bg-nature-sage/60 ml-1 align-middle" /* cursor más pequeño */
                  animate={{ opacity: [1, 0] }}
                  transition={{ duration: 0.8, repeat: Infinity }}
                />
              </motion.p>
            )}
            
            {/* Estado de pausa después de escribir todas las líneas */}
            {allLinesWritten && !showFinalMessage && (
              <motion.div
                className="absolute inset-0 flex items-center justify-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <motion.div
                  animate={{ 
                    scale: [1, 1.05, 1],
                  }}
                  transition={{ 
                    duration: 1.5, 
                    repeat: Infinity,
                    repeatType: "reverse"
                  }}
                >
                </motion.div>
              </motion.div>
            )}
          </div>
        </div>

        {/* Corazón decorativo */}
        <div className="flex justify-center mt-4 md:mt-6 mb-3 md:mb-4"> {/* Margen responsive */}
          <motion.div
            animate={{ 
              scale: [1, 1.1, 1],
              rotate: [0, 5, -5, 0]
            }}
            transition={{ 
              duration: 2, 
              repeat: Infinity,
              repeatType: "reverse"
            }}
          >
            <Heart className="h-6 w-6 md:h-8 md:w-8 text-nature-green" /> {/* Corazón responsive */}
          </motion.div>
        </div>
      </div>
    </motion.div>
  )
}
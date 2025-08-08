import { motion } from "framer-motion";
import { Heart } from "lucide-react";
import { Button } from "./ui/button";
import { useState, useEffect  } from "react";
import PopUpTicket from "@/components/popUpTicket";
import { useRSVP } from "@/context/RSVPContext";

const LandingSection = () => {
   const [showTicket, setShowTicket] = useState(false);
   const { alreadyConfirmed, checkConfirmationStatus} = useRSVP();
   const [savedData, setSavedData] = useState<any>(null);

  // Verificar confirmación al montar y cuando cambie el estado
   useEffect(() => {
    // Verificar confirmación al montar
    checkConfirmationStatus();
    
    // Obtener datos guardados
    const savedDataString = localStorage.getItem("rsvpConfirmation");
    if (savedDataString) {
      try {
        const parsedData = JSON.parse(savedDataString);
        setSavedData(parsedData);
      } catch (e) {
        console.error("Error parsing saved data", e);
      }
    }

    // Escuchar cambios en localStorage
    const handleStorageChange = () => {
      checkConfirmationStatus();
      const updatedData = localStorage.getItem("rsvpConfirmation");
      if (updatedData) {
        setSavedData(JSON.parse(updatedData));
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [checkConfirmationStatus]);

  const handleOpenTicket = () => {
    setShowTicket(true);
  };

  const handleCloseTicket = () => {
    setShowTicket(false);
  };

  return (
    <section
      id="landing"
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
            PASO 5
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4 nature-gradient">
            Aterrizaje
          </h2>
          <p className="text-lg text-nature-green max-w-2xl mx-auto">
            Llegamos a nuestro destino final: una vida juntos llena de amor y
            felicidad
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

            <h4 className="text-2xl font-bold text-nature-green mb-4">
              ¡Gracias por acompañarnos!
            </h4>

            <p className="text-lg text-nature-green max-w-2xl mx-auto mb-8">
              Tu presencia en este día tan especial significa mucho para
              nosotros. Gracias por ser parte de nuestra historia y por
              compartir con nosotros el inicio de esta nueva etapa.
            </p>

            {alreadyConfirmed && (
                  <div className="flex justify-center">
                    <Button 
                      onClick={handleOpenTicket}
                      className="bg-gradient-to-r from-nature-green to-nature-sage hover:from-nature-sage hover:to-nature-cream text-white px-8"
                    >
                      Ver mi Ticket de Nuevo
                    </Button>
                  </div>
                )}
          </div>
        </motion.div>

        {/* <motion.div
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
                <h4 className="text-xl font-bold text-nature-green mb-2">
                  Lilian
                </h4>
                <p className="text-nature-green">+123 456 7890</p>
                <p className="text-nature-green">maria@email.com</p>
              </div>

              <div className="text-center p-4">
                <h4 className="text-xl font-bold text-nature-green mb-2">
                  Miguel
                </h4>
                <p className="text-nature-green">+123 456 7891</p>
                <p className="text-nature-green">juan@email.com</p>
              </div>
            </div>
          </div>
        </motion.div> */}
      </div>
            {showTicket && (
        <PopUpTicket onClose={handleCloseTicket} />
      )}
    </section>
  );
};

export default LandingSection;
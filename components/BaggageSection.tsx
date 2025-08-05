import { motion } from "framer-motion";
import { Gift, Luggage, Home, Heart } from "lucide-react";

const BaggageSection = () => {
  return (
    <section
      id="baggage"
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
            PASO 6
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4 nature-gradient">
            Recogida de Equipaje
          </h2>
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
              Tu presencia es nuestro mejor regalo, pero si deseas
              obsequiarnos algo, aquí hay algunas opciones:
            </p>

            <div className="grid md:grid-cols-3 gap-6">
              <GiftItem
                icon={<Luggage className="h-10 w-10 text-nature-green" />}
                title="Luna de Miel"
                description="Ayúdanos a crear recuerdos inolvidables en nuestro viaje de bodas."
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
      <Footer />
    </section>
  );
};

// Componente Footer separado para reutilización
const Footer = () => {
  return (
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
          <h2 className="text-2xl font-bold nature-gradient">
            Lilian & Miguel
          </h2>
        </div>
        <p className="text-nature-green mb-2">14 de Febrero, 2026</p>
        <p className="text-nature-green/80">
          ¡Esperamos verte en nuestra boda!
        </p>
      </motion.div>
    </footer>
  );
};


function GiftItem({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
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
  );
}

export default BaggageSection;
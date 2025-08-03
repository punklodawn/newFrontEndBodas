"use client";

import { motion } from "framer-motion";
import { MapPin, Plane, Utensils, Music } from "lucide-react";
import LocationSection from "@/components/LocationSection";

export default function BoardingSection() {
  return (
    <section
      id="boarding"
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
            PASO 3
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4 nature-gradient">
            Embarque
          </h2>
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
                time="19:00"
                title="Despegue - Ceremonia"
                description="Nuestra aventura comienza con una hermosa ceremonia en la Iglesia San Pedro."
                icon={<Plane className="h-6 w-6 text-white" />}
              />

              <TimelineItem
                time="20:00"
                title="Altitud de Crucero - Cóctel"
                description="Disfruta de un momento de relajación con bebidas y aperitivos mientras celebramos juntos."
                icon={<Utensils className="h-6 w-6 text-white" />}
              />

              <TimelineItem
                time="21:30"
                title="Servicio a Bordo - Cena"
                description="Deliciosa cena preparada especialmente para compartir este momento tan especial."
                icon={<Utensils className="h-6 w-6 text-white" />}
              />

              <TimelineItem
                time="22:30"
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
            <div className="h-48 sm:h-64 md:h-80 bg-nature-cream rounded-xl overflow-hidden relative border border-nature-sage">
              {/* Fondo del mapa */}
              <div className="absolute inset-0 bg-[url('/map-pattern.svg')] bg-cover bg-center opacity-20"></div>

              {/* Contenedor de la ruta para manejar mejor el responsive */}
              <div className="absolute inset-0 flex items-center justify-center">
                {/* Línea de ruta diagonal - ajustada para móvil */}
                <motion.div
                  className="absolute h-0.5 sm:h-1 origin-left"
                  style={{
                    width: "80%",
                    background:
                      "linear-gradient(90deg, rgba(125,157,127,0) 0%, rgba(125,157,127,1) 50%, rgba(125,157,127,0) 100%)",
                    transform: "rotate(11.5deg)",
                    left: "10%",
                    top: "30%",
                  }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                ></motion.div>

                {/* Punto de origen con animación */}
                <motion.div
                  className="absolute w-3 h-3 sm:w-4 sm:h-4 rounded-full bg-nature-green border border-white"
                  style={{
                    left: "10%",
                    top: "30%",
                    transform: "translate(-50%, -50%)",
                  }}
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [1, 0.8, 1],
                  }}
                  transition={{
                    repeat: Number.POSITIVE_INFINITY,
                    duration: 2,
                  }}
                >
                  <span className="absolute top-0 left-4 text-[10px] sm:text-xs text-nature-green whitespace-nowrap">
                    Origen
                  </span>
                </motion.div>

                <motion.a
                  href="https://maps.app.goo.gl/Ck6YZMVGHxomQJ4WA"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="absolute flex items-center justify-center w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-nature-green border-2 border-white cursor-pointer hover:bg-nature-sage transition-colors group"
                  style={{
                    right: "10%",
                    bottom: "30%",
                    transform: "translate(50%, 50%)",
                  }}
                  animate={{
                    scale: [1, 1.1, 1],
                  }}
                  transition={{
                    repeat: Number.POSITIVE_INFINITY,
                    duration: 2,
                    delay: 1,
                  }}
                >
                  <span className="absolute top-0 right-4 text-[10px] sm:text-xs text-nature-green whitespace-nowrap hover:underline">
                    Destino
                  </span>
                  <MapPin className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                  <span className="absolute -bottom-6 right-0 bg-white text-nature-green text-xs px-2 py-1 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity shadow-md">
                    Ver Destino
                  </span>
                </motion.a>
                {/* Avión animado - ajustado para móvil */}
                <motion.div
                  className="absolute w-10 h-10 sm:w-16 sm:h-16 z-10"
                  style={{
                    left: "10%",
                    top: "30%",
                    transform: "translate(-50%, -50%)",
                  }}
                  animate={{
                    x: ["0%", "750%"],
                    y: ["0%", "140%"],
                    rotate: [-45, 25],
                  }}
                  transition={{
                    repeat: Number.POSITIVE_INFINITY,
                    duration: 8,
                    ease: "linear",
                  }}
                >
                  <Plane className="w-5 h-5 sm:w-8 sm:h-8 text-nature-green" />
                  {/* Estela del avión */}
                  <motion.div
                    className="absolute left-full w-8 sm:w-14 h-0.5 bg-nature-green opacity-70"
                    animate={{
                      scaleX: [0, 1, 0],
                      opacity: [0, 0.7, 0],
                    }}
                    transition={{
                      repeat: Number.POSITIVE_INFINITY,
                      duration: 1,
                      ease: "easeOut",
                    }}
                  />
                </motion.div>
              </div>
            </div>
          </div>
        </motion.div>

        {/*Ubications*/}
        <LocationSection />
      </div>
    </section>
  );

  function TimelineItem({
    time,
    title,
    description,
    icon,
    isLast = false,
  }: {
    time: string;
    title: string;
    description: string;
    icon: React.ReactNode;
    isLast?: boolean;
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
            <h4 className="text-xl font-bold text-nature-green mr-3">
              {title}
            </h4>
            <span className="text-nature-green font-medium">{time}</span>
          </div>
          <p className="text-nature-green">{description}</p>
        </div>
      </motion.div>
    );
  }
}

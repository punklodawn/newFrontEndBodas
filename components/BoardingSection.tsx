"use client";

import { motion } from "framer-motion";
import {Plane, Music, ChefHat , Pizza,HeartPulse } from "lucide-react";
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
              <div className="absolute left-8 top-0 bottom-0 w-0 bg-nature-sage"></div>

              <TimelineItem
                time="20:00 hs"
                title="Despegue - Ceremonia"
                description="Ceremonia Religiosa"
                icon={<Plane className="h-6 w-6 text-white" />}
              />        
              <TimelineItem
                time="21:00 hs"
                title="Escala Gastronomica"
                description="Recepción - Cena"
                icon={<ChefHat className="h-6 w-6 text-white" />}
              />                 
              <TimelineItem
                time="23:00 hs"
                title="Turbulencia Romantica"
                description="Primer baile + Brindis"
                icon={<HeartPulse className="h-6 w-6 text-white" />}
              />   
              <TimelineItem
                time="02:00 hs"
                title="Carnaval en las alturas"
                description="Hora loca - La fiesta continúa con música y baile para todos."
                icon={<Music className="h-6 w-6 text-white" />}
              />              
              <TimelineItem
                time="05:00 hs"
                title="Zona libre de equipaje"
                description="Servicio a bordo - Cierre de fiesta"
                icon={<Pizza className="h-6 w-6 text-white" />}
                 isLast={true}
              />
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
          <div className="w-14 h-14 rounded-full bg-gradient-to-r from-nature-green to-nature-sage flex items-center justify-center">
            {icon}
          </div>
          {!isLast && (
            <div className="absolute top-18 left-1/2 transform -translate-x-1/2 h-10 w-0.5 bg-nature-sage"></div>
          )}
        </div>
        <div className="ml-6">
          <div className="flex items-baseline mb-1">
            <h4 className="text-xl font-bold text-nature-green mr-2">
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

"use client";
import type React from "react";

import { useState, useEffect, useRef } from "react";
import {
  motion,
  useScroll,
} from "framer-motion";
import {
  Gift,
  Heart,
  Luggage,
  Home,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import RSVPForm from "@/components/RSVPForm";
import BackgroundSlider from "@/components/BackgroundSlider";
import CheckinCard from "@/components/CheckinCard";
import { RSVPProvider } from "@/context/RSVPContext";
import CountdownSection from "@/components/CountdownSection";
import BoardingSection from "@/components/BoardingSection";
import FlyingPlaneAnimation from "@/components/FlyingPlaneAnimation";
import FlightSection from '@/components/FlightSection'


export default function WeddingFlightInvitation() {
  const [currentSection, setCurrentSection] = useState(0);

  const sections = [
    "check-in",
    "security",
    "boarding",
    "flight",
    "landing",
    "baggage",
  ];

  const mainRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: mainRef,
    offset: ["start start", "end end"],
  });

  useEffect(() => {
    const handleScroll = () => {
      if (!mainRef.current) return;

      const scrollPosition = window.scrollY;
      const fullHeight = mainRef.current.scrollHeight;

      const sectionHeight = fullHeight / sections.length;
      const currentSectionIndex = Math.min(
        Math.floor(scrollPosition / sectionHeight),
        sections.length - 1
      );

      setCurrentSection(currentSectionIndex);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [sections.length]);

  return (
    <div
      ref={mainRef}
      className="relative min-h-screen bg-white text-nature-green overflow-x-hidden"
    >
      {/* Flying Plane Animation */}
      <FlyingPlaneAnimation/>
      
      {/* Slider Background */}  
      <BackgroundSlider />

      {/* RSVP*/}
      <RSVPProvider>
        <section
          id="check-in"
          className="min-h-screen flex flex-col items-center justify-center relative py-20 px-4"
        >
          <CheckinCard />
        </section>

        {/* RSVP Form Section */}
        <section
          id="rsvp"
          className="min-h-screen flex flex-col items-center justify-center relative py-20 px-4"
        >
          <RSVPForm />
        </section>
      </RSVPProvider>

      {/* Security/Countdown Section */}
      <CountdownSection/>

      {/* Boarding Section */}
      <BoardingSection/>

      <FlightSection />
    

      {/* Landing Section */}
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

              <div className="flex justify-center">
                <Button className="bg-gradient-to-r from-nature-green to-nature-sage hover:from-nature-sage hover:to-nature-cream text-white px-8">
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
                  <h4 className="text-xl font-bold text-nature-green mb-2">
                    María
                  </h4>
                  <p className="text-nature-green">+123 456 7890</p>
                  <p className="text-nature-green">maria@email.com</p>
                </div>

                <div className="text-center p-4">
                  <h4 className="text-xl font-bold text-nature-green mb-2">
                    Juan
                  </h4>
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
                  <strong>Datos bancarios:</strong> ES12 3456 7890 1234 5678
                  9012
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
              <h2 className="text-2xl font-bold nature-gradient">
                María & Juan
              </h2>
            </div>
            <p className="text-nature-green mb-2">15 de Junio, 2025</p>
            <p className="text-nature-green/80">
              ¡Esperamos verte en nuestra boda!
            </p>
          </motion.div>
        </footer>
      </section>
    </div>
  );
}
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

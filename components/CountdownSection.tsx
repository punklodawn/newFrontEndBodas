"use client"

import { useState, useEffect } from "react"
import {
    motion,
} from "framer-motion";
  import {
    Calendar,
    MapPin,
    Users,
    Gift,
    Clock,
  } from "lucide-react";


export default function CountdownSection() {
      const [mounted, setMounted] = useState(false);

    // Countdown timer
    const weddingDate = new Date("2026-02-14T20:00:00");
    const [timeLeft, setTimeLeft] = useState({
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
    });
  
    useEffect(() => {
      setMounted(true);
  
      const calculateTimeLeft = () => {
        const difference = +weddingDate - +new Date();
  
        if (difference > 0) {
          setTimeLeft({
            days: Math.floor(difference / (1000 * 60 * 60 * 24)),
            hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
            minutes: Math.floor((difference / 1000 / 60) % 60),
            seconds: Math.floor((difference / 1000) % 60),
          });
        }
      };
  
      calculateTimeLeft();
      const timer = setInterval(calculateTimeLeft, 1000);
  
      return () => clearInterval(timer);
    }, []);

    if (!mounted) return null;

return (

<section
id="security"
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
      PASO 2
    </div>
    <h2 className="text-3xl md:text-4xl font-bold mb-4 nature-gradient">
      Tiempo de Espera
    </h2>
    <p className="text-lg text-nature-green max-w-2xl mx-auto">
      Nuestro vuelo despegará pronto. Revisa el tiempo restante en
      nuestro tablero de salidas
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
          <p className="text-xl font-bold text-nature-cream">LM-2026</p>
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
          description="14 de Febrero, 2026 a las 20:00 horas. Te recomendamos llegar 30 minutos antes."
        />
        <InfoItem
          icon={<MapPin className="h-10 w-10 text-nature-green" />}
          title="Ubicación"
          description="Ceremonia: EL TEMPLO CATÓLICO DEL PUEBLO DE LA ESPERANZA. Recepción: Golf Club - La Esperanza."
        />
        <InfoItem
          icon={<Users className="h-10 w-10 text-nature-green" />}
          title="Código de Vestimenta"
          description="HOMBRES: Pueden optar por prendas como trajes, camisas, pantalón de vestir o remeras formales.
          MUJERES: Pueden elegir entre vestidos, conjuntos de dos piezas, o pantalones elegantes. 
                        El objetivo es un estilo elegante y relajado."
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
  );
}
function InfoItem({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="flex">
      <div className="mr-4 mt-1">{icon}</div>
      <div>
        <h4 className="text-lg font-bold text-nature-green mb-1">{title}</h4>
        <p className="text-nature-green">{description}</p>
      </div>
    </div>
  );
}

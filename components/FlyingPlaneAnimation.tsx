"use client";
import type React from "react";
import { useState, useEffect, useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useAnimation
} from "framer-motion";
import { useTheme } from "next-themes";

export default function FlyingPlaneAnimation() {

  const { theme } = useTheme();
  const mainRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);
  const controls = useAnimation();

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);


  const { scrollYProgress } = useScroll({
    target: mainRef,
    offset: ["start start", "end end"],
  });
     const cloudOpacity1 = useTransform(
    scrollYProgress,
    [0, 0.3, 0.5],
    [1, 0.5, 0]
  );
  const cloudOpacity2 = useTransform(
    scrollYProgress,
    [0.3, 0.6, 0.8],
    [0, 1, 0]
  );
  const cloudOpacity3 = useTransform(
    scrollYProgress,
    [0.5, 0.8, 1],
    [0, 0.5, 1]
  );

  const cloudTranslateY1 = useTransform(
    scrollYProgress,
    [0, 0.5],
    ["0%", "100%"]
  );
  const cloudTranslateY2 = useTransform(
    scrollYProgress,
    [0.3, 0.8],
    ["-100%", "0%"]
  );
  const cloudTranslateY3 = useTransform(
    scrollYProgress,
    [0.5, 1],
    ["-200%", "0%"]
  );

  useEffect(() => {
  // Solución para el scroll en móvil
  const handleTouchMove = (e: TouchEvent) => {
    // Permite el scroll normal
  };

  window.addEventListener('touchmove', handleTouchMove, { passive: true });

  return () => {
    window.removeEventListener('touchmove', handleTouchMove);
  };
}, []);


  // Iniciar animación cuando el componente se monta
  useEffect(() => {
    controls.start({
      width: ["0%", "200%", "0%"],
      x: ["-100%", "100%", "-100%"],
      transition: {
        repeat: Number.POSITIVE_INFINITY,
        duration: isMobile ? 3 : 2, // Más lento en móviles
        ease: "linear",
      }
    });
  }, [controls, isMobile]);

  // Solución mejorada para el scroll en móvil
  useEffect(() => {
    // Prevenir el zoom en dispositivos táctiles pero permitir scroll
    const preventZoom = (e: TouchEvent) => {
      if (e.touches.length > 1) e.preventDefault();
    };
    
    document.addEventListener('touchmove', preventZoom, { passive: false });
    
    return () => {
      document.removeEventListener('touchmove', preventZoom);
    };
  }, []);

  const lightBgImage = "https://res.cloudinary.com/dgqhmzdoo/image/upload/v1742914891/WhatsApp_Image_2025-03-24_at_20.39.43_fa4bab69_gcmb1c.jpg";
  const darkBgImage = "https://res.cloudinary.com/dgqhmzdoo/image/upload/v1742914891/WhatsApp_Image_2025-03-24_at_20.39.43_fa4bab69_gcmb1c.jpg";

return (
<>
{/* Flying Plane Animation */}
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

      <motion.div
        className="fixed inset-1 z-1 pointer-events-none"
        style={{
        backgroundImage: `url('${theme === 'dark' ? darkBgImage : lightBgImage}')`,
          backgroundSize: "cover",
          backgroundPosition: "top",
          opacity: cloudOpacity1,
          transform: cloudTranslateY1,
        }}
      />
      <motion.div
        className="fixed inset-1 z-2 pointer-events-none"
        style={{
          backgroundImage: `url('${theme === 'dark' ? darkBgImage : lightBgImage}')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          opacity: cloudOpacity2,
          transform: cloudTranslateY2,
        }}
      />
      <motion.div
        className="fixed inset-1 z-3 pointer-events-none"
        style={{
          backgroundImage: `url('${theme === 'dark' ? darkBgImage : lightBgImage}')`,
          backgroundSize: "cover",
          backgroundPosition: "bottom",
          opacity: cloudOpacity3,
          transform: cloudTranslateY3,
        }}
      />

</>
)}
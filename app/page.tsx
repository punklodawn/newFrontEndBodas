"use client";
import type React from "react";

import { useState, useEffect, useRef } from "react";
import {useScroll} from "framer-motion";
import RSVPForm from "@/components/RSVPForm";
import BackgroundSlider from "@/components/BackgroundSlider";
import CheckinCard from "@/components/CheckinCard";
import { RSVPProvider } from "@/context/RSVPContext";
import CountdownSection from "@/components/CountdownSection";
import BoardingSection from "@/components/BoardingSection";
import FlyingPlaneAnimation from "@/components/FlyingPlaneAnimation";
import FlightSection from '@/components/FlightSection'
import LandingSection from "@/components/LandingSection";
import BaggageSection from "@/components/BaggageSection";


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
      <RSVPProvider>
        <LandingSection/>
      </RSVPProvider>

      {/* Baggage Section */}
      <BaggageSection/>
    </div>
  );
}
"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react"

interface NotificationPopupProps {
  message: string;
  type: "success" | "error";
  onClose: () => void;
}

const NotificationPopup: React.FC<NotificationPopupProps> = ({
  message,
  type,
  onClose,
}) => {

  const bgGradient =
  type === "success"
    ? "bg-gradient-to-r from-nature-green to-nature-sage"
    : "bg-gradient-to-r from-red-500 to-red-500"

const borderColor = type === "success" ? "border-nature-sage" : "border-red-500"
const iconBg = type === "success" ? "bg-nature-cream" : "bg-red-100"
const iconColor = type === "success" ? "text-nature-green" : "text-red-500"

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className={`fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4`}
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.8, y: 50, opacity: 0 }}
          animate={{ scale: 1, y: 0, opacity: 1 }}
          exit={{ scale: 0.8, y: 50, opacity: 0 }}
          transition={{ type: "spring", damping: 25 }}
          className={`bg-white rounded-xl overflow-hidden max-w-md w-full shadow-2xl border ${borderColor}`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className={`${bgGradient} p-4 text-white`}>
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-bold">{type === "success" ? "¡Éxito!" : "Error"}</h3>
            <button
            onClick={onClose}
            className="h-8 w-8 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors"
            >
            <X className="h-5 w-5" />
            </button>
            </div>
          </div>

          <div className="p-6">
            <div className="flex flex-col items-center space-y-6">
              <div className={`${iconBg} h-16 w-16 rounded-full flex items-center justify-center ${iconColor}`}>
                {type === "success" ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                )}
              </div>

              <p className="text-center text-nature-green text-lg">{message}</p>

              <button
                className={`w-full ${
                  type === "success"
                    ? "bg-gradient-to-r from-nature-green to-nature-sage hover:from-nature-sage hover:to-nature-cream"
                    : "bg-gradient-to-r from-red-500 to-red-400 hover:from-red-400 hover:to-red-300"
                } text-white py-3 px-6 rounded-lg transition-colors font-medium`}
                onClick={onClose}
              >
                Cerrar
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default NotificationPopup;
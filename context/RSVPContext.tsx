import React, { createContext, useState, useContext, useEffect } from "react";

interface RSVPContextType {
  alreadyConfirmed: boolean;
  setAlreadyConfirmed: (confirmed: boolean) => void;
  checkConfirmationStatus: () => boolean;
  triggerUpdate: () => void;
}

const RSVPContext = createContext<RSVPContextType | undefined>(undefined);

export const RSVPProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [alreadyConfirmed, setAlreadyConfirmed] = useState(false);
    const [updateFlag, setUpdateFlag] = useState(false);

  // Función para verificar el estado de confirmación
  const checkConfirmationStatus = () => {
    const savedData = localStorage.getItem("rsvpConfirmation");
    const isConfirmed = !!savedData;
    setAlreadyConfirmed(isConfirmed);
    return isConfirmed;
  };

  const triggerUpdate = () => {
    setUpdateFlag(prev => !prev);
  };

  // Verificar al cargar el componente
  useEffect(() => {
    checkConfirmationStatus();
  }, [updateFlag]);

  return (
    <RSVPContext.Provider value={{ 
      alreadyConfirmed, 
      setAlreadyConfirmed,
      checkConfirmationStatus,
      triggerUpdate
    }}>
      {children}
    </RSVPContext.Provider>
  );
};

export const useRSVP = () => {
  const context = useContext(RSVPContext);
  if (!context) {
    throw new Error("useRSVP debe usarse dentro de un RSVPProvider");
  }
  return context;
};
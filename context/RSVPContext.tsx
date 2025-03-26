import React, { createContext, useState, useContext } from "react";

interface RSVPContextType {
  alreadyConfirmed: boolean;
  setAlreadyConfirmed: (confirmed: boolean) => void;
}

const RSVPContext = createContext<RSVPContextType | undefined>(undefined);

export const RSVPProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [alreadyConfirmed, setAlreadyConfirmed] = useState(false);

  return (
    <RSVPContext.Provider value={{ alreadyConfirmed, setAlreadyConfirmed }}>
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
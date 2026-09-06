"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from "react";

interface CapaianProdiContextType {
  selectedProdiId: string | null;
  setSelectedProdiId: (id: string | null) => void;
}

const CapaianProdiContext = createContext<CapaianProdiContextType | undefined>(
  undefined
);

interface CapaianProdiProviderProps {
  children: ReactNode;
  initialProdiId?: string | null;
}

export const CapaianProdiProvider = ({
  children,
  initialProdiId = null,
}: CapaianProdiProviderProps) => {
  const [selectedProdiId, setSelectedProdiIdState] = useState<string | null>(
    initialProdiId
  );

  const setSelectedProdiId = useCallback((id: string | null) => {
    setSelectedProdiIdState(id);
  }, []);

  return (
    <CapaianProdiContext.Provider value={{ selectedProdiId, setSelectedProdiId }}>
      {children}
    </CapaianProdiContext.Provider>
  );
};

export const useCapaianProdi = (): CapaianProdiContextType => {
  const context = useContext(CapaianProdiContext);
  if (!context) {
    throw new Error("useCapaianProdi must be used within CapaianProdiProvider");
  }
  return context;
};

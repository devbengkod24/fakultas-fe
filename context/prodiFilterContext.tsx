"use client";

import {
  createContext,
  useContext,
  useState,
  useMemo,
  useCallback,
  type ReactNode,
} from "react";

export const PRODI_FILTER_GENERAL = "general";

interface ProdiFilterContextType {
  selectedProdiIds: string[];
  setSelectedProdiIds: (ids: string[]) => void;
  toggleProdiId: (id: string) => void;
  reset: () => void;
}

const ProdiFilterContext = createContext<ProdiFilterContextType | undefined>(
  undefined
);

interface ProdiFilterProviderProps {
  children: ReactNode;
  initialProdiIds?: string[];
}

export const ProdiFilterProvider = ({
  children,
  initialProdiIds = [],
}: ProdiFilterProviderProps) => {
  const [selectedProdiIds, setSelectedProdiIdsState] = useState<string[]>(
    initialProdiIds
  );

  const setSelectedProdiIds = useCallback((ids: string[]) => {
    setSelectedProdiIdsState(ids);
  }, []);

  const toggleProdiId = useCallback((id: string) => {
    setSelectedProdiIdsState((prev) => {
      if (id === PRODI_FILTER_GENERAL) return [];
      if (prev.includes(id)) {
        return prev.filter((item) => item !== id);
      } else {
        return [...prev, id];
      }
    });
  }, []);

  const reset = useCallback(() => {
    setSelectedProdiIdsState([]);
  }, []);

  const value = useMemo(
    () => ({
      selectedProdiIds,
      setSelectedProdiIds,
      toggleProdiId,
      reset,
    }),
    [selectedProdiIds, setSelectedProdiIds, toggleProdiId, reset]
  );

  return (
    <ProdiFilterContext.Provider value={value}>
      {children}
    </ProdiFilterContext.Provider>
  );
};

export const useProdiFilter = (): ProdiFilterContextType => {
  const context = useContext(ProdiFilterContext);
  if (!context) {
    throw new Error("useProdiFilter must be used within a ProdiFilterProvider");
  }
  return context;
};

export const isGeneralProdiFilter = (ids: string[] | null | undefined): boolean =>
  !ids || ids.length === 0;

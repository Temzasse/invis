import type { ReactNode } from "react";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

import { getCssText } from "./stitches.config";

export interface ClientStyleContextData {
  reset: () => void;
  sheet: string;
}

const ClientStyleContext = createContext<ClientStyleContextData>({
  reset: () => {},
  sheet: "",
});

export function useClientStyleSheet() {
  const clientStyle = useContext(ClientStyleContext);

  // Only executed on client
  useEffect(() => {
    // Reset cache to re-apply global styles
    clientStyle.reset();
  }, [clientStyle]);

  return clientStyle.sheet;
}

export function ClientStyleSheetProvider({ children }: { children: ReactNode }) {
  const [sheet, setSheet] = useState(getCssText());

  const reset = useCallback(() => {
    setSheet(getCssText());
  }, []);

  return (
    <ClientStyleContext.Provider value={{ reset, sheet }}>
      {children}
    </ClientStyleContext.Provider>
  );
}

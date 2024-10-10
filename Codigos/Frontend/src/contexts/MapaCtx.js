import React, { createContext, useState, useContext } from 'react';

const MapaCtx = createContext();

export function MapaProvider({ children }) {
  const [mapa, setMapa] = useState({
    origem: null,
    destino: null,
    modoViagem: "DRIVING",
  });
  return (
    <MapaCtx.Provider value={{mapa, setMapa}}>
      {children}
    </MapaCtx.Provider>
  );
}

export function useMapa() {
  const context = useContext(MapaCtx);
  return context;
}
import React, { createContext, useContext, useState } from 'react';

const AlertaCtx = createContext();

export function AlertaProvider({ children }) {
  const [conteudo, setConteudo] = useState({
    tipo: '',
    titulo: '',
    descricao: '',
    exibir: false
  })

  return (
    <AlertaCtx.Provider value={{ conteudo, setConteudo }}>
      {children}
    </AlertaCtx.Provider>
  );
}

export function useAlerta() {
  const context = useContext(AlertaCtx);
  return context;
}
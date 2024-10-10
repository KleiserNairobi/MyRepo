import React, { createContext, useState, useContext } from 'react';

const GeralCtx = createContext();

export function GeralProvider({ children }) {
  const [abrirMenu, setAbrirMenu] = useState(false);
  const [titulo, setTitulo] = useState('');
  const [subtitulo, setSubtitulo] = useState('');
  //const [icone, setIcone] = useState(null);
  const [id, setId] = useState(-1);
  const [auxId, setAuxId] = useState(-1);
  const [alterar, setAlterar] = useState(false);
  const [excluir, setExcluir] = useState(false);
  const [limpar, setLimpar] = useState(false);
  const [gravar, setGravar] = useState(false);
  const [carregar, setCarregar] = useState(true);
  const [qtde, setQtde] = useState(0);
  const [buscarDados, setBuscarDados] = useState(false);
  const [confirmaExcluir, setConfirmaExcluir] = useState(false);
  const [texto, setTexto] = useState('');
  const [estiloDeCampo, setEstiloDeCampo] = useState('standard');
  const [auxValor, setAuxValor] = useState('');
  const [filtro, setFiltro] = useState({
    dtInicial: null,
    dtFinal: null
  })


  //const [url, setUrl] = useState('');
  //const [objeto, setObjeto] = useState({});
  //url, setUrl, objeto, setObjeto}

  return (
    <GeralCtx.Provider
      value={
        {
          abrirMenu, setAbrirMenu, titulo, setTitulo,
          subtitulo, setSubtitulo, id, setId, auxId, setAuxId,
          alterar, setAlterar, excluir, setExcluir, limpar, setLimpar,
          gravar, setGravar, carregar, setCarregar, qtde, setQtde,
          buscarDados, setBuscarDados, confirmaExcluir, setConfirmaExcluir,
          texto, setTexto, estiloDeCampo, setEstiloDeCampo,          
          auxValor, setAuxValor, filtro, setFiltro
          //icone, setIcone,
        }
      }
    >
      {children}
    </GeralCtx.Provider>
  );
}

export function useGeral() {
  const context = useContext(GeralCtx);
  return context;
}
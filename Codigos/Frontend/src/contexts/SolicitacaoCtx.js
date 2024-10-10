import React, { createContext, useContext, useState } from 'react';

const SolicitacaoCtx = createContext();

export function SolicitacaoProvider({ children }) {
  
  const [tela, setTela] = useState(1);
  const [qtdeTelas, setQtdeTelas] = useState(7);
  const [dados, setDados] = useState({
    idEntrega: "",
    idAgendamento: "",
    data: "",
    cliente: "",
    tipoVeiculo: "",
    deslocamento: "",
    distancia: "", 
    valor: "",
    previsao: "",
    tipoAgendamento: "U",
    qtdeRepeticao: 1,
    dataExecucao: null,
    horaExecucao: "",
    idEntregadorPref: "",
    origCep: "",
    origLogradouro: "",
    origNumero: "",
    origComplemento: "",
    origReferencia: "",
    origBairro: "",
    origIdCidade: "",
    origCidade: "",
    origEstado: "",
    origContato: "",
    origTelefone: "",
    origTarefa: "",
    origAddFavorito: false,
    origNomeCliente: "",
    origTelefoneCliente: "",    
    destCep: "",
    destLogradouro: "",
    destNumero: "",
    destComplemento: "",
    destReferencia: "",
    destBairro: "",
    destIdCidade: "", 
    destCidade: "",
    destEstado: "",
    destContato: "",
    destTelefone: "",
    destTarefa: "",
    destAddFavorito: false,
    destNomeCliente: "", 
    destTelefoneCliente: ""
  });
  const [pgto, setPgto] = useState({
    idPagamento: "",
    idEntrega: "",
    idAgendamento: "",
    idTabPreco: "",
    idGateway: "",
    idRetornoGateway: "",
    idDesconto: "",
    tipoPgto: "",
    cupom: "",
    qtdeRepeticao: 1,
    vlrPercurso: "",
    vlrProduto: "",
    vlrDesconto: "",
    vlrTotal: "", 
    strPercurso: ""
  });
  const [cartao, setCartao] = useState({
    chkNome: "", 
    chkEmail: "",
    chkNrCartao: "",
    chkCodSeguranca: "",
    chkMes: "",
    chkAno: "",
    idMeioPagamento: "",
    idTipoPagamento: "",
  });

  function limpaObjDados() {
    setDados({
      idEntrega: "",
      idAgendamento: "",
      data: "",
      cliente: "",
      tipoVeiculo: "",
      deslocamento: "",
      distancia: "", 
      valor: "",
      previsao: "",
      tipoAgendamento: "U",
      qtdeRepeticao: 1,
      dataExecucao: null,
      horaExecucao: "",
      idEntregadorPref: "",
      origCep: "",
      origLogradouro: "",
      origNumero: "",
      origComplemento: "",
      origReferencia: "",
      origBairro: "",
      origIdCidade: "",
      origCidade: "",
      origEstado: "",
      origContato: "",
      origTelefone: "",
      origTarefa: "",
      origAddFavorito: false,
      origNomeCliente: "",
      origTelefoneCliente: "",
      destCep: "",
      destLogradouro: "",
      destNumero: "",
      destComplemento: "",
      destReferencia: "",
      destBairro: "",
      destIdCidade: "", 
      destCidade: "",
      destEstado: "",
      destContato: "",
      destTelefone: "",
      destTarefa: "",
      destAddFavorito: false, 
      destNomeCliente: "", 
      destTelefoneCliente: ""
    });
  }

  function limpaObjPgto() {
    setPgto({
      idPagamento: "",
      idEntrega: "",
      idAgendamento: "",
      idTabPreco: "",
      idGateway: "",
      idRetornoGateway: "",
      idDesconto: "",
      tipoPgto: "",
      cupom: "",
      qtdeRepeticao: 1,
      vlrPercurso: "",
      vlrProduto: "",
      vlrDesconto: "",
      vlrTotal: "", 
      strPercurso: ""  
    });
  }

  function limpaObjCartao() {
    setCartao({
      chkNome: "", 
      chkEmail: "",
      chkNrCartao: "",
      chkCodSeguranca: "",
      chkMes: "",
      chkAno: "",
      idMeioPagamento: "",
      idTipoPagamento: "",  
    });
  }

  return (
    <SolicitacaoCtx.Provider value={{ 
      tela, setTela, qtdeTelas, setQtdeTelas, dados, setDados, 
      pgto, setPgto, cartao, setCartao, limpaObjDados, limpaObjPgto, limpaObjCartao
    }}>
      {children}
    </SolicitacaoCtx.Provider>
  );
}

export function useSolicitacao() {
  const context = useContext(SolicitacaoCtx);
  return context;
}
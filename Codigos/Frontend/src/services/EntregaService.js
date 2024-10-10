import api from './apiBack';
import {format } from "date-fns";


export function obtem(url) {
  return api.get(url);
}

export function insere(url, objeto) {  
  var dataAtual = new Date();
  dataAtual = format(dataAtual , 'yyyy-MM-dd');
  
  let jsonData = {
    cliente: objeto.cliente,
    entregador: null,
    agendamento: null,
    tipoVeiculo: objeto.tipoVeiculo,
    data: `${dataAtual}`,
    deslocamento: objeto.deslocamento,
    distancia: objeto.distancia,
    previsao: objeto.previsao,
    statusSolicitacao: 'NI',
    listaEnderecos: [
      {
        "tipoEndereco": "O",
        "cep": objeto.origCep,
        "logradouro": objeto.origLogradouro,
        "numero": objeto.origNumero ? objeto.origNumero : "S/N",
        "complemento": objeto.origComplemento ? objeto.origComplemento : null,
        "bairro": objeto.origBairro,
        "referencia": objeto.origReferencia ? objeto.origReferencia : null,
        "municipio": {
          id: objeto.origIdCidade
        },
        "contato": objeto.origContato ? objeto.origContato : null,
        "telefone": objeto.origTelefone ? objeto.origTelefone: null,
        "tarefa": objeto.origTarefa ? objeto.origTarefa : null,
        "adicionarFavorito": objeto.origAddfavorito ? objeto.origAddfavorito : false
      },
      {
        "tipoEndereco": "D",
        "cep": objeto.destCep,
        "logradouro": objeto.destLogradouro,
        "numero": objeto.destNumero ? objeto.destNumero : "S/N",
        "complemento": objeto.destComplemento ? objeto.destComplemento : null,
        "bairro": objeto.destBairro,
        "referencia": objeto.destReferencia ? objeto.destReferencia : null,
        "municipio": {
          id: objeto.destIdCidade
        },
        "contato": objeto.destContato ? objeto.destContato : null,
        "telefone": objeto.destTelefone ? objeto.destTelefone: null,
        "tarefa": objeto.destTarefa ? objeto.destTarefa : null,
        "adicionarFavorito": objeto.destAddfavorito ? objeto.destAddfavorito : false
      }
    ]
  };

  return api.post(url, jsonData);
}

export function cancela(url, idEntrega) {
  let jsonData = {
    entrega: {id: idEntrega},
    status: 'CA'
  }  
  return api.post(url, jsonData);
}

export function registraObsPgto(url, tipoPgto) {
  if (tipoPgto === 'D') {
    let jsonData = {
      observacao: 'PAGAMENTO NÃO REALIZADO. ENTREGADOR NÃO DISPONÍVEL.'
    }
    return api.put(url, jsonData);
  }
  if (tipoPgto === 'CC') {
    let jsonData = {
      observacao: 'PAGAMENTO DEVOLVIDO. ENTREGADOR NÃO DISPONÍVEL.'
    }
    return api.put(url, jsonData);
  }  
}

export function insereStatusPgto(url, idPagamento, tipoPgto) {
  let jsonData = {
    pagamento: {id: idPagamento},    
  }  
  if (tipoPgto === 'D') {
    jsonData = {...jsonData, status: 'NRE'}
  }
  if (tipoPgto === 'CC') {
    jsonData = {...jsonData, status: 'DEV'}
  }

  return api.post(url, jsonData);
}

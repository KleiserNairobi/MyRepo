import api from './apiBack';
import {format } from "date-fns";


export function obtem(url) {
  return api.get(url);
}

export function insere(url, objeto) {  
  
  let jsonData = {
    "cliente": objeto.cliente,
    "entregador": objeto.idEntregadorPref,
    "tipoAgendamento": objeto.tipoAgendamento,
    "qtdeRepeticao": objeto.qtdeRepeticao,
    "dataExecucao": format(objeto.dataExecucao, 'yyyy-MM-dd'), 
    "horaExecucao": `${objeto.horaExecucao}:00`, 
    "tipoVeiculo": objeto.tipoVeiculo,
    "deslocamento": objeto.deslocamento,
    "distancia": objeto.distancia,
    "previsao": objeto.previsao,
    "ativo": true,
    "realizado": false,
    "listaEnderecos": [
      {
        "tipoEndereco": "O",
        "cep": objeto.origCep,
        "logradouro": objeto.origLogradouro,
        "numero": objeto.origNumero ? objeto.origNumero : "S/N",
        "complemento": objeto.origComplemento ? objeto.origComplemento : null,
        "bairro": objeto.origBairro,
        "referencia": objeto.origReferencia ? objeto.origReferencia : null,
        "municipio": {id: objeto.origIdCidade},
        "contato": objeto.origContato ? objeto.origContato : null,
        "telefone": objeto.origTelefone ? objeto.origTelefone: null,
        "tarefa": objeto.origTarefa ? objeto.origTarefa : null,
        "nomeCliente": null,
        "telefoneCliente": null,
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
        "municipio": {id: objeto.destIdCidade},
        "contato": objeto.destContato ? objeto.destContato : null,
        "telefone": objeto.destTelefone ? objeto.destTelefone: null,
        "tarefa": objeto.destTarefa ? objeto.destTarefa : null,
        "nomeCliente": null,
        "telefoneCliente": null,
        "adicionarFavorito": objeto.destAddfavorito ? objeto.destAddfavorito : false
      }
    ]
  };

  console.log(jsonData);
  
  return api.post(url, jsonData);
}



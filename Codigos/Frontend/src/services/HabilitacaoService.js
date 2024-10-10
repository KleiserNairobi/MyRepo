import api from './apiBack';
import {format, parseISO, addDays } from "date-fns";


export function obtem(url) {
  return api.get(url);
}

export function insere(url, objeto) {  
  let validade = format(addDays(objeto.validade, 1), 'yyyy-MM-dd');
  let dataEmissao = format(addDays(objeto.dataEmissao, 1), 'yyyy-MM-dd');
  let primeiraHabilitacao = objeto.primeiraHabilitacao;
  if (primeiraHabilitacao != null) {
    if (typeof primeiraHabilitacao === 'string') {
      primeiraHabilitacao = parseISO(objeto.primeiraHabilitacao);
    }
    primeiraHabilitacao = format(addDays(primeiraHabilitacao, 1), 'yyyy-MM-dd');
  }

  let jsonData = {
    "pessoa": { "id": objeto.pessoa.id } ,
    "registro": objeto.registro,
    "validade": `${validade}`,
    "categoria": objeto.categoria, 
    "localExpedicao": objeto.localExpedicao,
    "dataEmissao": `${dataEmissao}`, 
    "primeiraHabilitacao": primeiraHabilitacao ? `${primeiraHabilitacao}` : null,
  } 

  return api.post(url, jsonData);
}

export function altera(url, objeto) {  
  let validade = format(addDays(objeto.validade, 1), 'yyyy-MM-dd');
  let dataEmissao = format(addDays(objeto.dataEmissao, 1), 'yyyy-MM-dd');
  let primeiraHabilitacao = objeto.primeiraHabilitacao;
  if (primeiraHabilitacao != null) {
    if (typeof primeiraHabilitacao === 'string') {
      primeiraHabilitacao = parseISO(objeto.primeiraHabilitacao);
    }
    primeiraHabilitacao = format(addDays(primeiraHabilitacao, 1), 'yyyy-MM-dd');
  }

  let jsonData = {
    "pessoa": { "id": objeto.pessoa.id } ,
    "registro": objeto.registro,
    "validade": `${validade}`,
    "categoria": objeto.categoria, 
    "localExpedicao": objeto.localExpedicao,
    "dataEmissao": `${dataEmissao}`, 
    "primeiraHabilitacao": primeiraHabilitacao ? `${primeiraHabilitacao}` : null,
  } 

  return api.put(url, jsonData);
}

export function exclui(url) {        
  return api.delete(`${url}?acao=excluir`);
}

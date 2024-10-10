import api from './apiBack';
import {format } from "date-fns";


export function obtem(url) {
  return api.get(url);
}

export function insere(url, objeto) {  
  let emissao = format(objeto.emissao, 'yyyy-MM-dd');
  let primeiroVcto = format(objeto.primeiroVcto, 'yyyy-MM-dd'); 
  let valorTotal = parseInt(objeto.valorTotal.replace(/\D/g,'')) / 100;

  let jsonData = {
    "pessoa": {id: objeto.pessoa.id},
    "categoria": {id: objeto.categoria.id},
    "moeda": {id: objeto.moeda.id},
    "origem": objeto.origem, 
    "documento": objeto.documento, 
    "parcelas": objeto.parcelas, 
    "emissao": `${emissao}`, 
    "primeiroVcto": `${primeiroVcto}`, 
    "valorTotal": valorTotal, 
    "valorReceber": valorTotal, 
    "historico": objeto.historico, 
  } 
  
  return api.post(url, jsonData);
}

export function altera(url, objeto) {  
  let emissao = format(objeto.emissao, 'yyyy-MM-dd');
  let primeiroVcto = format(objeto.primeiroVcto, 'yyyy-MM-dd'); 
  let valorTotal = parseInt(objeto.valorTotal.replace(/\D/g,'')) / 100;

  let jsonData = {
    "pessoa": {id: objeto.pessoa.id},
    "categoria": {id: objeto.categoria.id},
    "moeda": {id: objeto.moeda.id},
    "origem": objeto.origem, 
    "documento": objeto.documento, 
    "parcelas": objeto.parcelas, 
    "emissao": `${emissao}`, 
    "primeiroVcto": `${primeiroVcto}`, 
    "valorTotal": valorTotal, 
    "valorReceber": valorTotal, 
    "historico": objeto.historico, 
  } 

  return api.put(url, jsonData);
}

export function exclui(url) {        
  return api.delete(`${url}?acao=excluir`);
}

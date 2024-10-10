import api from './apiBack';
import {format, addDays } from "date-fns";


export function obtem(url) {
  return api.get(url);
}

export function insere(url, objeto) {  
  let dataInicio = format(addDays(objeto.validadeInicio, 1), 'yyyy-MM-dd');
  let dataFim = format(addDays(objeto.validadeFim, 1), 'yyyy-MM-dd'); 
  let valor = parseInt(objeto.valor.replace(/\D/g,'')) / 100;
  let piso = parseInt(objeto.piso.replace(/\D/g,'')) / 100;

  let jsonData = {
    "codigo": objeto.codigo,
    "descricao": objeto.descricao,
    "valor": valor,
    "piso": piso,
    "validadeInicio": `${dataInicio}`, 
    "validadeFim": `${dataFim}`, 
  } 

  return api.post(url, jsonData);
}

export function altera(url, objeto) {  
  let dataInicio = format(addDays(objeto.validadeInicio, 1), 'yyyy-MM-dd');
  let dataFim = format(addDays(objeto.validadeFim, 1), 'yyyy-MM-dd'); 
  let valor = parseInt(objeto.valor.replace(/\D/g,'')) / 100;
  let piso = parseInt(objeto.piso.replace(/\D/g,'')) / 100;
  
  let jsonData = {
    "codigo": objeto.codigo,
    "descricao": objeto.descricao,
    "valor": valor,
    "piso": piso,
    "validadeInicio": `${dataInicio}`, 
    "validadeFim": `${dataFim}`, 
  } 

  return api.put(url, jsonData);
}

export function exclui(url) {        
  return api.delete(`${url}?acao=excluir`);
}

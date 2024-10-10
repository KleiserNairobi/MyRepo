import api from './apiBack';


export function obtem(url) {
  return api.get(url);
}

export function insere(url, objeto) {  
  let tarifaAdicional = parseInt(objeto.tarifaAdicional.replace(/\D/g,'')) / 100;
  let jsonData = {
    "tabelaPreco": { "id": parseInt(objeto.tabelaPreco.id) },    
    "horaInicio": `${objeto.horaInicio}:00`, 
    "horaFim": `${objeto.horaFim}:00`,     
    "tarifaAdicional": tarifaAdicional,
  } 
  return api.post(url, jsonData);
}

export function altera(url, objeto) {  
  let tarifaAdicional = parseInt(objeto.tarifaAdicional.replace(/\D/g,'')) / 100;
  let jsonData = {
    "tabelaPreco": { "id": parseInt(objeto.tabelaPreco.id) },    
    "horaInicio": `${objeto.horaInicio}:00`, 
    "horaFim": `${objeto.horaFim}:00`,     
    "tarifaAdicional": tarifaAdicional,
  } 
  return api.post(url, jsonData);
}

export function exclui(url) {        
  return api.delete(`${url}?acao=excluir`);
}

import api from './apiBack';

export function obtem(url) {
  return api.get(url);
}

export function insere(url, objeto) {  
  return api.post(url, objeto);
}

export function altera(url, objeto) {
  let percApp = parseInt(objeto.percentualAplicativo.replace(/\D/g,'')) / 100;
  let percEnt = parseInt(objeto.percentualEntregador.replace(/\D/g,'')) / 100;
  let distBike = parseFloat(objeto.distanciaBike.replace(/\D/g,'')) / 1000;
  let distMoto = parseFloat(objeto.distanciaMoto.replace(/\D/g,'')) / 1000;
  let distCarro = parseFloat(objeto.distanciaCarro.replace(/\D/g,'')) / 1000;
  
  let jsonData = {
    "percentualAplicativo": percApp,
    "percentualEntregador": percEnt,
    "distanciaBike": distBike,
    "distanciaMoto": distMoto,
    "distanciaCarro": distCarro,
    "distanciaCaminhao": 0,
  } 

  console.log(jsonData);
  return api.put(url, jsonData);
}

export function exclui(url) {        
  return api.delete(`${url}?acao=excluir`);
}
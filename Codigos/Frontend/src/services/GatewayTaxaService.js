import api from './apiBack';
import {format, addDays } from "date-fns";


export function obtem(url) {
  return api.get(url);
}

export function insere(url, objeto) {  
  let data = format(addDays(objeto.data, 1), 'yyyy-MM-dd');
  let debito = parseInt(objeto.debito.replace(/\D/g,'')) / 100;
  let creditoAvista = parseInt(objeto.creditoAvista.replace(/\D/g,'')) / 100;
  let creditoParcelado = parseInt(objeto.creditoParcelado.replace(/\D/g,'')) / 100;
  let creditoAntecipacao = parseInt(objeto.creditoAntecipacao.replace(/\D/g,'')) / 100;
  let boleto = parseInt(objeto.boleto.replace(/\D/g,'')) / 100;
  let taxaAdministrativa = parseInt(objeto.taxaAdministrativa.replace(/\D/g,'')) / 100;

  let jsonData = {
    "gateway": {"id": objeto.gateway.id },
    "data": `${data}`,
    "debito": debito,
    "creditoAvista": creditoAvista, 
    "creditoParcelado": creditoParcelado, 
    "creditoAntecipacao": creditoAntecipacao, 
    "boleto": boleto, 
    "taxaAdministrativa": taxaAdministrativa 
  } 

  return api.post(url, jsonData);
}

export function altera(url, objeto) {  
  let data = format(addDays(objeto.data, 1), 'yyyy-MM-dd');
  let debito = parseInt(objeto.debito.replace(/\D/g,'')) / 100;
  let creditoAvista = parseInt(objeto.creditoAvista.replace(/\D/g,'')) / 100;
  let creditoParcelado = parseInt(objeto.creditoParcelado.replace(/\D/g,'')) / 100;
  let creditoAntecipacao = parseInt(objeto.creditoAntecipacao.replace(/\D/g,'')) / 100;
  let boleto = parseInt(objeto.boleto.replace(/\D/g,'')) / 100;
  let taxaAdministrativa = parseInt(objeto.taxaAdministrativa.replace(/\D/g,'')) / 100;

  let jsonData = {
    "gateway": {"id": objeto.gateway.id },
    "data": `${data}`,
    "debito": debito,
    "creditoAvista": creditoAvista, 
    "creditoParcelado": creditoParcelado, 
    "creditoAntecipacao": creditoAntecipacao, 
    "boleto": boleto, 
    "taxaAdministrativa": taxaAdministrativa
  }

  return api.put(url, jsonData);
}

export function exclui(url) {        
  return api.delete(`${url}?acao=excluir`);
}

import api from './apiBack';


export function obtem(url) {
  return api.get(url);
}

export function insere(url, objeto) {   
  let saldoAnterior = parseInt(objeto.saldoAnterior.replace(/\D/g,'')) / 100;
  
  let jsonData = {
    "conta": {id: objeto.conta.id} , 
    "nome": objeto.nome,    
    "tipoContaCaixa": objeto.tipoContaCaixa, 
    "mes": `${objeto.mes}`,     
    "ano": `${objeto.ano}`,
    "saldoAnterior": saldoAnterior,
  } 

  return api.post(url, jsonData);
}

export function altera(url, objeto) {  
  let saldoAnterior = parseInt(objeto.saldoAnterior.replace(/\D/g,'')) / 100;
  
  let jsonData = {
    "conta": {id: objeto.conta.id} , 
    "nome": objeto.nome,    
    "tipoContaCaixa": objeto.tipoContaCaixa, 
    "mes": `${objeto.mes}`,     
    "ano": `${objeto.ano}`,
    "saldoAnterior": saldoAnterior,
  }

  return api.put(url, jsonData);
}

export function exclui(url) {        
  return api.delete(`${url}?acao=excluir`);
}

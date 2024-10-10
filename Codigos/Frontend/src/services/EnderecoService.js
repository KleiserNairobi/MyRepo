import api from './apiBack';

export function obtem(url) {
  return api.get(url);
}

export function insere(url, objeto) {  
  let jsonData = {
    "idPessoa": objeto.pessoa.id,
    "cep": objeto.cep,
    "logradouro": objeto.logradouro,
    "numero": objeto.numero ? objeto.numero : 's/n',
    "complemento": objeto.complemento ? objeto.complemento : 'nada consta',
    "bairro": objeto.bairro,
    "referencia": objeto.referencia ? objeto.referencia : null,
    "municipio": objeto.cidade,
    "estado": objeto.estado,
    "nomeCliente": objeto.nomeCliente ? objeto.nomeCliente : null,
    "telefoneCliente": objeto.telefoneCliente ? objeto.telefoneCliente : null,
  } 

  return api.post(url, jsonData);
}

export function altera(url, objeto) {    
  let jsonData = {
    "idPessoa": objeto.pessoa.id,
    "cep": objeto.cep,
    "logradouro": objeto.logradouro,
    "numero": objeto.numero ? objeto.numero : 's/n',
    "complemento": objeto.complemento ? objeto.complemento : 'nada consta',
    "bairro": objeto.bairro,
    "referencia": objeto.referencia ? objeto.referencia : null,
    "municipio": objeto.cidade,
    "estado": objeto.estado,
    "nomeCliente": objeto.nomeCliente ? objeto.nomeCliente : null,
    "telefoneCliente": objeto.telefoneCliente ? objeto.telefoneCliente : null,
  } 

  return api.put(url, jsonData);
}

export function exclui(url) {        
  return api.delete(`${url}?acao=excluir`);
}

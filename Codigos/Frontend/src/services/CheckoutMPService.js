import api from './apiBack';

export function obtem(url) {
  return api.get(url);
}

export function insere(url, objeto) {
  let jsonData = {
    "idPessoa": objeto.cliente,
    "idGateway": objeto.idGateway,
    "idPagamento": objeto.idPagamento,
    "numeroCartao": objeto.chkNrCartao.replace(/\D/g,''),
    "mesVencimento": parseInt(objeto.chkMes.replace(/\D/g,'')),
    "anoVencimento": parseInt(objeto.chkAno.replace(/\D/g,'')),
    "codigoSeguranca": parseInt(objeto.chkCodSeguranca.replace(/\D/g,'')),
    "nomeTitularCartao": objeto.chkNome,
    "valorProduto": objeto.vlrProduto ? parseFloat(objeto.vlrProduto.toFixed(2)) : 0,
    "valorEntrega":parseFloat(objeto.vlrPercurso.toFixed(2)),
    "parcelas": 1,
    "metodoPagamento": objeto.idMeioPagamento,    
  };
  return api.post(url, jsonData);
}

export function inseriStatusPgto(url, pgto, statusPgto) {
  let jsonData = {
    pagamento: {id: pgto},
    status: statusPgto,
  };
  return api.post(url, jsonData);
}

export function inseriStatusEntrega(url, entrega, statusEntrega) {
  let jsonData = {
    entrega: {id: entrega},
    status: statusEntrega,
  };
  return api.post(url, jsonData);
}






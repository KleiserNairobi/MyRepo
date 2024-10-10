import api from './apiBack';

export function obtem(url) {
  return api.get(url);
}

export function insere(url, objeto) { 
  var Percurso = null;
  var Produto  = null;

  if (objeto.qtdeRepeticao !== null && objeto.qtdeRepeticao !== "") {
    if (objeto.vlrPercurso) {
      Percurso = objeto.vlrPercurso * objeto.qtdeRepeticao;
    } else {
      Percurso = 0;
    }
    if (objeto.vlrProduto) {
      Produto = objeto.vlrProduto * objeto.qtdeRepeticao;
    } else {
      Produto = 0;
    }
  }

  let jsonData = {
    agendamento: objeto.idAgendamento ? objeto.idAgendamento : null,
    entrega: objeto.idEntrega ? objeto.idEntrega : null,
    tabelaPreco: objeto.idTabPreco,
    gateway: objeto.idGateway,
    idRetornoGateway: null,
    tipoPgto: objeto.tipoPgto,
    valorPercurso: Percurso,
    valorProduto: Produto,
    desconto: objeto.idDesconto ? objeto.idDesconto : null ,
    valorDesconto: objeto.vlrDesconto ? objeto.vlrDesconto : 0,
    statusPgto: "A",
    observacao: null
  };
  
  console.log(jsonData);
  return api.post(url, jsonData);
}





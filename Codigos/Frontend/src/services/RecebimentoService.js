import api from './apiBack';
import {format } from "date-fns";

export function obtem(url) {
  return api.get(url);
}

export function altera(url, objeto) {  
  var valor;
  var valorJuro;
  var taxaJuro;
  var valorMulta;
  var taxaMulta;
  var valorDesconto;
  var taxaDesconto;
  var valorRecebimento;

  if (typeof objeto.valor === 'number') {
    valor = objeto.valor / 100;
  } else if (typeof objeto.valor === 'string') {
    valor = parseFloat(objeto.valor.replace(/\D/g,'')) / 100;
  }

  if (typeof objeto.valorJuro === 'number') {
    valorJuro = objeto.valorJuro / 100;
  } else if (typeof objeto.valorJuro === 'string') {
    valorJuro = parseFloat(objeto.valorJuro.replace(/\D/g,'')) / 100;
  }

  if (typeof objeto.taxaJuro === 'number') {
    taxaJuro = objeto.taxaJuro / 100;
  } else if (typeof objeto.taxaJuro === 'string') {
    taxaJuro = parseFloat(objeto.taxaJuro.replace(/\D/g,'')) / 100;
  }  

  if (typeof objeto.valorMulta === 'number') {
    valorMulta = objeto.valorMulta / 100;
  } else if (typeof objeto.valorMulta === 'string') {
    valorMulta = parseFloat(objeto.valorMulta.replace(/\D/g,'')) / 100;
  }

  if (typeof objeto.taxaMulta === 'number') {
    taxaMulta = objeto.taxaMulta / 100;
  } else if (typeof objeto.taxaMulta === 'string') {
    taxaMulta = parseFloat(objeto.taxaMulta.replace(/\D/g,'')) / 100;
  }

  if (typeof objeto.valorDesconto === 'number') {
    valorDesconto = objeto.valorDesconto / 100;
  } else if (typeof objeto.valorDesconto === 'string') {
    valorDesconto = parseFloat(objeto.valorDesconto.replace(/\D/g,'')) / 100;
  }

  if (typeof objeto.taxaDesconto === 'number') {
    taxaDesconto = objeto.taxaDesconto / 100;
  } else if (typeof objeto.taxaDesconto === 'string') {
    taxaDesconto = parseFloat(objeto.taxaDesconto.replace(/\D/g,'')) / 100;
  }

  if (typeof objeto.valorRecebimento === 'number') {
    valorRecebimento = objeto.valorRecebimento / 100;
  } else if (typeof objeto.valorRecebimento === 'string') {
    valorRecebimento = parseFloat(objeto.valorRecebimento.replace(/\D/g,'')) / 100;
  }

  let dataEmissao = format(objeto.dataEmissao, 'yyyy-MM-dd');
  let dataVencimento = format(objeto.dataVencimento, 'yyyy-MM-dd'); 
  let dataRecebimento = format(objeto.dataRecebimento, 'yyyy-MM-dd');

  let jsonData = {
    "contaReceber": {"id": objeto.contaReceber.id}, 
    "id": objeto.id,
    "dataEmissao": `${dataEmissao}`,
    "dataVencimento": `${dataVencimento}`,
    "valor": valor,
    "taxaJuro": taxaJuro,
    "taxaMulta": taxaMulta,
    "taxaDesconto": taxaDesconto,
    "valorJuro": valorJuro,
    "valorMulta": valorMulta,
    "valorDesconto": valorDesconto,
    "dataRecebimento": `${dataRecebimento}`,
    "valorRecebimento": valorRecebimento
  } 

  return api.put(url, jsonData);
}


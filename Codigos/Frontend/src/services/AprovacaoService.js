import api from './apiBack';
import {format, parseISO, addDays } from "date-fns";

// ATENÇÃO! Não há inserção nem exclusão de aprovação

export function obtem(url) {
  return api.get(url);
}

export function altera(url, objeto) {  
  let jsonData = {
    "statusAprovacao": objeto.statusAprovacao
  }
  return api.put(url, jsonData);
}

export function garavaDadosPessoais(url, objeto) {
  let jsonDadosPessoais = {
    "tipo": objeto.tipoPessoa,
    "nome": objeto.nome,
    "telefone": objeto.telefone,
    "email": objeto.email,
    "cpfcnpj": objeto.cpfcnpj,
    "rg": objeto.identidade,
    "nascimento": objeto.nascimento, 
    "nomeFantasia": objeto.nomeFantasia,
    "ramoAtividade": objeto.ramoAtividade,
    "parceiro": false,
    "entregador": true,
    "cliente": false,
    "colaborador": false,
    "ativo": objeto.statusAprovacao === 'A' ? true : false,
    "online": false
  }
  return api.put(url, jsonDadosPessoais);
}

export function garavaEndereco(url, objeto, idPessoa) {
  let jsonEndereco = {
    "idPessoa": idPessoa,
    "cep": objeto.cep,
    "logradouro": objeto.logradouro,
    "numero": objeto.numero ? objeto.numero : 'S/N',
    "complemento": objeto.complemento ? objeto.complemento : 'NADA CONSTA',
    "bairro": objeto.bairro,    
    "municipio": objeto.cidade,
    "estado": objeto.estado,
    "referencia": objeto.referencia ? objeto.referencia : null,
    "proprio": true,
    "nomeCliente": objeto.nome,
    "telefoneCliente": objeto.telefone    
  }
  return api.put(url, jsonEndereco);
}

export function garavaVeiculo(url, objeto, idPessoa, idVeiculo) {
  let jsonVeiculo = {
    "pessoa": { "id": idPessoa },
    "tipo": objeto.tipoVeiculo,
    "modelo": objeto.modelo,
    "renavan": objeto.renavan,
    "placa": objeto.placa,
    "ativo": true
  }  
  if (idVeiculo === null || idVeiculo === '') {
    return api.post(url, jsonVeiculo);
  } else {
    return api.put(url + `/${idVeiculo}`, jsonVeiculo);
  }  
}

export function garavaHabilitacao(url, objeto, idPessoa, idHabilitacao) {
  let validade = format(addDays(objeto.validade, 1), 'yyyy-MM-dd');
  let dataEmissao = format(addDays(objeto.dataEmissao, 1), 'yyyy-MM-dd');
  let primeiraHabilitacao = objeto.primeiraCNH;
  
  if (primeiraHabilitacao != null) {
    if (typeof primeiraHabilitacao === 'string') {
      primeiraHabilitacao = parseISO(objeto.primeiraCNH);
    }
    primeiraHabilitacao = format(addDays(primeiraHabilitacao, 1), 'yyyy-MM-dd');
  }

  let jsonHabilitacao = {
    "pessoa": { "id": idPessoa },
    "registro": objeto.registro,
    "validade": `${validade}`,
    "categoria": objeto.categoria, 
    "localExpedicao": objeto.localExpedicao,
    "dataEmissao": `${dataEmissao}`, 
    "primeiraHabilitacao": primeiraHabilitacao ? `${primeiraHabilitacao}` : null,
  }

  if (idHabilitacao === null || idHabilitacao === '') {
    return api.post(url, jsonHabilitacao);
  } else {
    return api.put(url + `/${idHabilitacao}`, jsonHabilitacao);
  }
}
import api from './apiBack';
import {format, parseISO, addDays } from "date-fns";


export function obtem(url) {
  return api.get(url);
}

export function insere(url, objeto) { 
  let nascimento = objeto.nascimento;
  if (nascimento != null) {
    if (typeof nascimento === 'string') {
      nascimento = parseISO(objeto.nascimento);
    }
    nascimento = format(addDays(nascimento, 1), 'yyyy-MM-dd');
  } 

  let jsonData = {
    "tipo": "F",
    "nome": objeto.nome,
    "email": objeto.email,
    "telefone": objeto.telefone,
    "cpfCnpj": objeto.cpfCnpj ? objeto.cpfCnpj : null,
    "rg": objeto.rg ? objeto.rg : null,
    "nascimento": nascimento ? `${nascimento}` : null,
    "nomeFantasia": null,
    "ramoAtividade": null,
    "parceiro": false,
    "entregador": false,
    "cliente": false,
    "colaborador": true,
    "ativo": objeto.ativo,
  } 

  return api.post(url, jsonData);
}

export function altera(url, objeto) {   
  let nascimento = objeto.nascimento;
  if (nascimento != null) {
    if (typeof nascimento === 'string') {
      nascimento = parseISO(objeto.nascimento);
    }
    nascimento = format(addDays(nascimento, 1), 'yyyy-MM-dd');
  } 

  let jsonData = {
    "tipo": "F",
    "nome": objeto.nome,
    "email": objeto.email,
    "telefone": objeto.telefone,
    "cpfCnpj": objeto.cpfCnpj ? objeto.cpfCnpj : null,
    "rg": objeto.rg ? objeto.rg : null,
    "nascimento": nascimento ? `${nascimento}` : null,
    "nomeFantasia": null,
    "ramoAtividade": null,
    "parceiro": false,
    "entregador": false,
    "cliente": false,
    "colaborador": true,
    "ativo": objeto.ativo,  
  } 

  return api.put(url, jsonData);
}

export function exclui(url) {        
  return api.delete(`${url}?acao=excluir`);  
}

import api from './apiBack';
import {format, parseISO, addDays} from "date-fns";


export function obtem(url) {
  return api.get(url);
}

export function insere(url, objeto, tipoPessoa) { 
  let nascimento = objeto.nascimento;
  if (nascimento != null) {
    if (typeof nascimento === 'string') {
      nascimento = parseISO(objeto.nascimento);
    }
    nascimento = format(addDays(nascimento, 1), 'yyyy-MM-dd');
  } 

  let jsonData = {
    "tipo": `${tipoPessoa}`,
    "nome": objeto.nome,
    "email": objeto.email,
    "telefone": objeto.telefone,
    "cpfCnpj": objeto.cpfCnpj ? objeto.cpfCnpj : null,
    "rg": objeto.rg ? objeto.rg : null,
    "nascimento": nascimento ? `${nascimento}` : null,
    "nomeFantasia": objeto.nomeFantasia ? objeto.nomeFantasia : null,
    "ramoAtividade": objeto.ramoAtividade ? objeto.ramoAtividade : null,
    "parceiro": objeto.parceiro,
    "entregador": false,
    "cliente": true,
    "colaborador": false,
    "ativo": objeto.ativo,
  } 

  return api.post(url, jsonData);
}

export function altera(url, objeto, tipoPessoa) {    
  let nascimento = objeto.nascimento;
  if (nascimento != null) {
    if (typeof nascimento === 'string') {
      nascimento = parseISO(objeto.nascimento);
    }
    nascimento = format(addDays(nascimento, 1), 'yyyy-MM-dd');
  } 

  let jsonData = {
    "tipo": `${tipoPessoa}`,
    "nome": objeto.nome,
    "email": objeto.email,
    "telefone": objeto.telefone,
    "cpfCnpj": objeto.cpfCnpj ? objeto.cpfCnpj : null,
    "rg": objeto.rg ? objeto.rg : null,
    "nascimento": nascimento ? `${nascimento}` : null,
    "nomeFantasia": objeto.nomeFantasia ? objeto.nomeFantasia : null,
    "ramoAtividade": objeto.ramoAtividade ? objeto.ramoAtividade : null,
    "parceiro": objeto.parceiro,
    "entregador": false,
    "cliente": true,
    "colaborador": false,
    "ativo": objeto.ativo,
  } 

  return api.put(url, jsonData);
}

export function exclui(url) {        
  return api.delete(`${url}?acao=excluir`);  
}

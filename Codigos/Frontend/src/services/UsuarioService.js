import api from './apiBack';

const token = localStorage.getItem('chamai_token');

if (token != null) {
  api.defaults.headers.Authorization = `Bearer ${token}`;
}

export function obtemTodos(url) {
  return api.get(url);
}

export function obtemUnico(url, id) {
  return api.get(`${url}/${id}`);
}

export function obtemUnicoComFiltro(url) {
  return api.get(url);
}

export function insere(url, objeto) {
  let jsonData = {
    "pessoa": {
      "id": parseInt(objeto.pessoa)
    },
    "nome": objeto.nome,
    "email": objeto.email ? objeto.email : null,
    "telefone": objeto.telefone ? objeto.telefone : null,
    "senha": objeto.senha,
    "ativo": true
  }
  return api.post(url, jsonData);
}

export function altera(url, objeto) {
  return api.put(url, objeto);
}

export function exclui(url) {
  return api.delete(`${url}?acao=excluir`);
}

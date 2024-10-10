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

export function insere(url, objeto) {
    return api.post(url, objeto);
}

export function altera(url, objeto) {
    return api.put(url, objeto);
}

export function exclui(url) {        
    return api.delete(`${url}?acao=excluir`);
}



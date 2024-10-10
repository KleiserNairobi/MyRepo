import axios from 'axios';

var url = process.env.REACT_APP_URL_DEV;
//var url = window.location.protocol + "//" + window.location.host;

const token = localStorage.getItem('chamaih_token');

const apiBack = axios.create({
  baseURL: url,
  headers: {Accept: 'application/json'}
});

apiBack.defaults.headers.common['Content-Type'] = 'application/json';

if (token != null) {
  apiBack.defaults.headers.Authorization = `Bearer ${token}`;
}

export function obtem(url) {
  return apiBack.get(url);
}

export function insere(url, objeto) {
  return apiBack.post(url, objeto);
}

export function altera(url, objeto) {   
  return apiBack.put(url, objeto);
}

export function exclui(url) {        
  return apiBack.delete(`${url}?acao=excluir`);
}


export default apiBack;
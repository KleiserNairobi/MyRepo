import api from './apiBack';

export function altera(url) {
  return api.put(url);
}
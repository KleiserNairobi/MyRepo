import api from './apiBack';

export function obtem(url) {
  return api.get(url);
}

// export function insere(url, objeto) {  
//   let dataInicio = format(addDays(objeto.validadeInicio, 1), 'yyyy-MM-dd');
//   let dataFim = format(addDays(objeto.validadeFim, 1), 'yyyy-MM-dd'); 
//   let tarifaKm = parseInt(objeto.tarifaKm.replace(/\D/g,'')) / 1000;
//   let tarifaValor = parseInt(objeto.tarifaValor.replace(/\D/g,'')) / 100;
  
//   let jsonData = {
//     "tipoVeiculo": objeto.tipoVeiculo, 
//     "descricao": objeto.descricao,    
//     "validadeInicio": `${dataInicio}`, 
//     "validadeFim": `${dataFim}`,     
//     "tarifaKm": tarifaKm,
//     "tarifaValor": tarifaValor,
//     "padrao": objeto.padrao,
//     "ativo": objeto.ativo,
//   } 

//   return api.post(url, jsonData);
// }

// export function altera(url, objeto) {  
//   let dataInicio = format(addDays(objeto.validadeInicio, 1), 'yyyy-MM-dd');
//   let dataFim = format(addDays(objeto.validadeFim, 1), 'yyyy-MM-dd'); 
//   let tarifaKm = parseInt(objeto.tarifaKm.replace(/\D/g,'')) / 1000;
//   let tarifaValor = parseInt(objeto.tarifaValor.replace(/\D/g,'')) / 100;
  
//   let jsonData = {
//     "tipoVeiculo": objeto.tipoVeiculo, 
//     "descricao": objeto.descricao,    
//     "validadeInicio": `${dataInicio}`, 
//     "validadeFim": `${dataFim}`,     
//     "tarifaKm": tarifaKm,
//     "tarifaValor": tarifaValor,
//     "padrao": objeto.padrao,
//     "ativo": objeto.ativo,
//   } 

//   return api.put(url, jsonData);
// }

// export function exclui(url) {        
//   return api.delete(`${url}?acao=excluir`);
// }

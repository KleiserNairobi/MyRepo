import api from './apiBack';


export function calcularEntrega(url, objeto) {  
  let jsonData = {
    "cliente": objeto.cliente,
    "tipoVeiculo": objeto.tipoVeiculo,
    "deslocamento": objeto.deslocamento,
    "listaEnderecos": [
      {
        "tipoEndereco": "O",
        "logradouro": objeto.origLogradouro,
        "bairro": objeto.origBairro,
        "cidade": objeto.origCidade,
        "estado": objeto.origEstado
      },
      {
        "tipoEndereco": "D",
        "logradouro": objeto.destLogradouro,
        "bairro": objeto.destBairro,
        "cidade": objeto.destCidade,
        "estado": objeto.destEstado
      }
    ]    
  };

  return api.post(url, jsonData);
}




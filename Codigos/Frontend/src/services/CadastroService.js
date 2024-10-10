import axios from 'axios';

var url = process.env.REACT_APP_URL_DEV;
//var url = window.location.protocol + "//" + window.location.host;

const api = axios.create({
  baseURL: url,
  headers: {Accept: 'application/json'}
});

api.defaults.headers.common['Content-Type'] = 'application/json';

export function obtemUnico(url) {
  return api.get(url);
}

export function insere(url, objeto, tipoPessoa) {

  let jsonData = {
    "tipoPessoa": objeto.tipoPessoa,
    "nome": objeto.nome,
    "telefone": objeto.telefone,
    "email": objeto.email,
    "cpfCnpj": objeto.cpfcnpj ? objeto.cpfcnpj : null,
    "rg": objeto.identidade ? objeto.identidade : null,
    "nascimento": objeto.nascimento ? objeto.nascimento : null,
    "nomeFantasia": objeto.nomeFantasia ? objeto.nomeFantasia : null,
    "ramoAtividade": objeto.ramoAtividade ? objeto.ramoAtividade : null,
    "cliente": tipoPessoa === 'C',
    "entregador": tipoPessoa === 'E',
    "parceiro": tipoPessoa === 'P',        
    "cep": objeto.cep,
    "logradouro": objeto.logradouro,
    "numero": objeto.numero ? objeto.numero : 'S/N',
    "complemento": objeto.complemento ? objeto.complemento: 'NADA CONSTA',
    "bairro": objeto.bairro,
    "referencia": objeto.referencia ? objeto.referencia: 'NADA CONSTA',
    "municipio": objeto.cidade,
    "estado": objeto.estado,
    "senha": objeto.senha,
    "proprio": true,
    "latitude": null,
    "longitude": null,
  };

  console.log(tipoPessoa)
    
  return api.post(url, jsonData);
    
}

export function insereFotoPerfil(url, arquivoFotoPerfil) {  
  const fd = new FormData();
  fd.append('arquivo', arquivoFotoPerfil, arquivoFotoPerfil.name );
  fd.append('descricao', 'FOTO DO PERFIL');
  fd.append('tipoFoto', 'P');

  return api.post(url, fd);
}

export function insereFotoCRLV(url, arquivoFotoCRLV) {  
  const fd = new FormData();
  fd.append('arquivo', arquivoFotoCRLV, arquivoFotoCRLV.name );
  fd.append('descricao', 'FOTO DOCUMENTO VEÍCULO');
  fd.append('tipoFoto', 'CRLV');

  return api.post(url, fd);
}

export function insereFotoCNH(url, arquivoFotoCNH) {  
  const fd = new FormData();
  fd.append('arquivo', arquivoFotoCNH, arquivoFotoCNH.name );
  fd.append('descricao', 'FOTO CARTEIRA NACIONAL DE HABILITAÇÃO');
  fd.append('tipoFoto', 'CNH');

  return api.post(url, fd);
}

export function insereFotoCE(url, arquivoFotoCE) {  
  const fd = new FormData();
  fd.append('arquivo', arquivoFotoCE, arquivoFotoCE.name );
  fd.append('descricao', 'FOTO COMPROVNATE DE ENDEREÇO');
  fd.append('tipoFoto', 'CE');

  return api.post(url, fd);
}

export function insereFotoRG(url, arquivoFotoRG) {  
  const fd = new FormData();
  fd.append('arquivo', arquivoFotoRG, arquivoFotoRG.name );
  fd.append('descricao', 'FOTO IDENTIDADE');
  fd.append('tipoFoto', 'RG');

  return api.post(url, fd);
}


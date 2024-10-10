
import * as CryptoJS  from 'crypto-js';

export function decrypt(valor) {
  var encrypted = CryptoJS.enc.Base64.parse(valor);
  var key = CryptoJS.enc.Base64.parse("u/Gu5posvwDsXUnV5Zaq4g==");
  var iv = CryptoJS.enc.Base64.parse("5D9r9ZVzEYYgha93/aUK2w==");
  var teste = CryptoJS.enc.Utf8.stringify(CryptoJS.AES.decrypt(
  { ciphertext: encrypted },
  key,
  { mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7, iv: iv}));
  
  return teste;
}

export function isEmail(val) {
  let regEmail = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  if(!regEmail.test(val)){
    return false;
  } else {
    return true;
  }
}

export function limpaObjeto(obj) {
  for (const prop of Object.getOwnPropertyNames(obj)) {
    obj[prop] = '';
  }
}


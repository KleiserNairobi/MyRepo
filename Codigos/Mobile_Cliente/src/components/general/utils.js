
export function decrypt(value) {
  var CryptoJS = require("crypto-js");

  var encrypted = CryptoJS.enc.Base64.parse(value);
  var key = CryptoJS.enc.Base64.parse("u/Gu5posvwDsXUnV5Zaq4g==");
  var iv = CryptoJS.enc.Base64.parse("5D9r9ZVzEYYgha93/aUK2w==");
  var result = CryptoJS.enc.Utf8.stringify(CryptoJS.AES.decrypt(
    { ciphertext: encrypted },
    key,
    { mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7, iv: iv })
  );

  return result;
}

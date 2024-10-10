
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

export function setTimeoutLong(funcSetTimeout, timerLong) {
  var timer = setTimeout(() => {
    if (timerLong > 60000) {
      timerLong = timerLong - 60000;
      console.log(timerLong);
      setTimeoutLong(funcSetTimeout, timerLong);
    } else {
      funcSetTimeout();
      clearTimeout(timer);
    }
  }, 60000);

  return timer;
}
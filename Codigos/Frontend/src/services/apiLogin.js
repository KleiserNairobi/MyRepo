import axios from 'axios';
import base64 from 'base-64';

const webServiceUsername = 'app-chamai-web';
const webServicePassword = 'admin';
    
var url = process.env.REACT_APP_URL_DEV;
//var url = window.location.protocol + "//" + window.location.host;

let autorizacao = base64.encode(webServiceUsername + ':' + webServicePassword);

const apiLogin = axios.create({
  baseURL: url
});

apiLogin.defaults.headers.common['Content-Type'] = 'application/x-www-form-urlencoded';
apiLogin.defaults.headers.common['Authorization'] = 'Basic ' + autorizacao;

export default apiLogin;


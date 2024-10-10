import axios from 'axios';
import base64 from 'react-native-base64';

import { NotificationAlert } from '../components/general/alerts';

const api = (props) => {

    // Configuracoes padroes
    const webserviceUsername = 'app-chamai-mobile';
    const webservicePassword = 'admin';

    // Configurando conexao com webservice
    const conexao = axios.create({
        baseURL: 'https://chamai.com.br/',
        headers: {
            Accept: 'application/json',
        }
    });
    conexao.interceptors.request.use(
        config => {
            config.headers['Content-Type'] = 'application/json';

            if (props && props.token) {
                config.headers['Authorization'] = `Bearer ${props.token}`;
            }

            if (props && props.oauthToken === true) {
                config.headers['Content-Type'] = 'application/x-www-form-urlencoded';
                config.headers['Authorization'] = 'Basic ' + base64.encode(webserviceUsername + ':' + webservicePassword);
            }

            //console.log('Comunicando com o Webservice');

            return Promise.resolve(config);
        },
        error => {
            //console.log(error);
            return Promise.reject(error);
        }
    );
    conexao.interceptors.response.use(
        response => {
            //console.log('Recebendo resposta webservice');
            return response;
        },
        error => {
            // Verificando se existe problema de conexao
            if (
                error.request._hasError === true && 
                error.request._response.includes('connect')
            ) {
                NotificationAlert('Não foi possível conectar aos nossos servidores. '+
                'Verifique sua conexão com a Internet.','Sem conexão');
            }

            return Promise.reject(error);
        }
    );

    return conexao;
}

//const mapStateToProps = (state) => {
//    return {
//      configuracoes: state.configuracoes
//    }
//}
//export default connect(mapStateToProps)(api);

export default api;
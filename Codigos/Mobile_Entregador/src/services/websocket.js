
import { NotificationAlert } from '../components/general/alerts';
import { formatTextForUri } from '../components/general/converter';
import { setTimeoutLong } from '../components/general/utils';

const webSocket = (props) => {
  // Configuracoes padroes
  let url = 'wss://0pydy17fgf.execute-api.us-east-1.amazonaws.com/dev';
  let nomeUsuario = formatTextForUri(props.usuario.nome);
  let params = `?idUsuario=${props.usuario.id}&nomeUsuario=${nomeUsuario}&tipoPessoa=ENT`;
  let reconnect = (props.configuracoes.wSocketReconnect) ? props.configuracoes.wSocketReconnect : false;
  var timer = null;

  // Configurando conexao com WebSocket
  var ws = new WebSocket(url + params);
  ws.onopen = () => {
    console.log('Abrindo conexao com WebSocket');
    timer = setInterval(() => {
      //console.log('Enviando mensagem para manter conexao websocket');
      ws.send('');
    }, 60000);
  }
  ws.onerror = (error) => {
    NotificationAlert('Falha na conexão');
    ws.close();
    //if (reconnect === true) {
    //  if (timer) { clearInterval(timer); }
    //  NotificationAlert('Reconectando...');
    //  webSocket(props);
    //}
  }
  ws.onclose = () => {
    console.log('Fechando conexao com websocket');
    if (timer) { clearInterval(timer); }
  }

  return ws;
}

export default webSocket;
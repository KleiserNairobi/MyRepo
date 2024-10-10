import React from 'react';
import { connect } from 'react-redux';
import { View } from 'react-native';

import { GiftedChat } from 'react-native-gifted-chat';

const iconSupport = require('../../assets/images/customer-service-icon.png');

class ChatSupportPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      pessoa: props.pessoa ? props.pessoa : null,
      usuario: props.usuario ? props.usuario : null,
      token: props.configuracoes ? props.configuracoes.token : null,
      wSocket: props.configuracoes ? props.configuracoes.wSocket : null,
      screenWSocket: 'CHAT',
      messagesChat: [],
      countMessages: 0
    }
  }

  componentDidMount() {
    this.onRead();
  }

  onRead = () => {
    if (this.state.wSocket) {
      this.state.wSocket.onmessage = (e) => {
        console.log('Recebendo mensagem para o Chat');
        if (e.data) {
          let dataMessage = JSON.parse(e.data);
          if (dataMessage.message 
          && dataMessage.message.assunto 
          && dataMessage.message.assunto == 'CHAT' 
          && this.state.screenWSocket == 'CHAT') {
            let countMsgs = parseInt(this.state.countMessages) + 1;

            // Recebendo mensagens para o Chat
            let currentMessage = {
              _id: countMsgs,
              text: dataMessage.message.conteudo,
              createdAt: new Date(),
              user: {
                _id: 2,
                name: 'Suporte',
                avatar: iconSupport,
              },
            }

            // Atualizando mensagens de Chat
            this.setState({
              countMessages: countMsgs,
              messagesChat: GiftedChat.append(this.state.messagesChat, currentMessage)
            });
          }
        }
      }
    }
  }

  onSend = (messages = []) => {
    // Criando estrutura da mensagem de Chat
    let contentSend = JSON.stringify({
      "action":"onMessage",
      "sender":this.state.usuario.id,
      "receiver":"2",
      "message":{
        "assunto":"CHAT",
        "conteudo":messages[0].text
      }
    });

    if (this.state.wSocket) {
      // Enviando mensagem via WebSocket
      this.state.wSocket.send(contentSend);

      // Atualizando mensagens de Chat
      this.setState({
        countMessages: parseInt(this.state.countMessages) + 1,
        messagesChat: GiftedChat.append(this.state.messagesChat, messages)
      });
    }
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        <GiftedChat
          messages={this.state.messagesChat}
          onSend={messages => this.onSend(messages)}
          placeholder='Digite sua mensagem...'
          user={{
            _id: this.state.usuario.id,
          }}
        />
      </View>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    usuario: state.usuario,
    pessoa: state.pessoa,
    configuracoes: state.configuracoes
  }
}

export default connect(mapStateToProps)(ChatSupportPage);
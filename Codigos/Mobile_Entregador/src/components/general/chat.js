import React, { useState, useCallback, useEffect } from 'react';
import { Text } from 'react-native';
import { GiftedChat } from 'react-native-gifted-chat';

const iconSupport = require('../../assets/images/customer-service-icon.png');

export default Chat = (props) => {
    const [messages, setMessages] = useState([]);
    const ws = props.socket;
    let countMessages = 1;

    useEffect(() => {
      ws.onmessage = (e) => {
        console.log('Recebendo mensagem ');
        if (e.data) {
          let dataMessage = JSON.parse(e.data);
          if (dataMessage.message 
          && dataMessage.message.assunto 
          && dataMessage.message.assunto == 'chat') {
            countMessages++;
            let currentMessage = {
              _id: countMessages,
              text: dataMessage.message.conteudo,
              createdAt: new Date(),
              user: {
                _id: 1,
                name: 'Suporte',
                avatar: iconSupport,
              },
            }

            setMessages(previousMessages => GiftedChat.append(previousMessages, currentMessage));
          }
        }
      }
    }, []);
  
    const onSend = useCallback((messages = []) => {
      let contentSend = JSON.stringify({
        "action":"onMessage",
        "sender":props.pessoa.id,
        "receiver":"1",
        "message":{
          "assunto":"chat",
          "conteudo":messages[0].text
        }
      });
      ws.send(contentSend);

      setMessages(previousMessages => GiftedChat.append(previousMessages, messages));
    }, []);

    return (
      <GiftedChat
        messages={messages}
        onSend={messages => onSend(messages)}
        placeholder='Digite sua mensagem...'
        user={{
          _id: props.pessoa.id,
        }}
      />
    )
  }
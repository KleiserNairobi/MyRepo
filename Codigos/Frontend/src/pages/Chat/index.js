import React, { useState, useEffect } from 'react';
//import { useHistory } from 'react-router-dom';
import { 
  Grid, Typography
} from '@material-ui/core';
import { DonutLarge, MoreVert, Search } from '@material-ui/icons';
import ChatIcon from '@material-ui/icons/Chat';
//import PageCss from '../PagesCss';

import ListaChatItem from './ListaChatItem';
import Introducao from './Introducao';
import JanelaChat from './JanelaChat';


import styles from '../../layout/styles';
import './styleChat.css';

export default function Chat() {

  const estilo = styles();
  //const [listaChat, setListaChat] = useState([ 
  const [listaChat] = useState([ 
    {chatId: 1, titulo: 'Fulano de Tal', imagem: 'https://www.w3schools.com/howto/img_avatar2.png'},
    {chatId: 2, titulo: 'Fulano de Tal', imagem: 'https://www.w3schools.com/howto/img_avatar2.png'},
    {chatId: 3, titulo: 'Fulano de Tal', imagem: 'https://www.w3schools.com/howto/img_avatar2.png'},
    {chatId: 4, titulo: 'Fulano de Tal', imagem: 'https://www.w3schools.com/howto/img_avatar2.png'},
    {chatId: 5, titulo: 'Fulano de Tal', imagem: 'https://www.w3schools.com/howto/img_avatar2.png'},
  ]);
  const [chatAtivo, setChatAtivo] = useState({});
  //const [ user, setUser ] = useState({
  const [ user ] = useState({
    id: 123, 
    avatar: 'https://www.w3schools.com/howto/img_avatar2.png', 
    nome: 'Kleiser Nairobi'
  })

  //const css = PageCss();
  //const history = useHistory();

  useEffect(() => {
    //
  }, [])


  return (
    <div>
      <Grid container direction="row" justify="space-between" alignItems="center">
        <div>
          <div className={estilo.tituloPagina}>
            <Typography variant="h6">Chat</Typography>
          </div>
          <div className={estilo.subtituloPagina}>
            <Typography variant="caption">Suporte ao usuário</Typography>
          </div>
        </div>
        <div style={{ flex: 1 }} />
        {/** 
        <Button
          color="primary"
          variant="outlined"
          disableElevation
          //startIcon={}          
        >
          meu botão
        </Button>
        */}
      </Grid>

            
      <div className="container">
        <div className="barraMenu">
          <header className="cabecalho">
            <img className="cabecalho-avatar" src={user.avatar} alt="avatar" />
            <div className="cabecalho-buttons">
              <div className="cabecalho-buttons-icons">
                <DonutLarge style={{color: '#919191'}}/>
              </div>
              <div className="cabecalho-buttons-icons">
                <ChatIcon style={{color: '#919191'}}/>
              </div>
              <div className="cabecalho-buttons-icons">
                <MoreVert style={{color: '#919191'}}/>
              </div>
            </div>
          </header>

          <div className="pesquisa">
            <div className="pesquisa-input">
              <Search fontSize="small" style={{color: '#919191'}}/>
              <input type="search" placeholder="Procurar ou começar uma nova conversa"/>
            </div>
          </div>

          <div className="listaChat">
            {listaChat.map((item, key)=>(
              <ListaChatItem
                key={key}
                data={item}
                active={chatAtivo.chatId === listaChat[key].chatId}
                onClick={()=>setChatAtivo(listaChat[key])}
              />
            ))}
          </div>

        </div>
        <div className="conteudo">
          {chatAtivo.chatId !== undefined &&
            <JanelaChat
              usuario={user}
            />
          }
          {chatAtivo.chatId === undefined &&
            <Introducao/>
          }          
        </div>
      </div>
            

    </div>
  );
}


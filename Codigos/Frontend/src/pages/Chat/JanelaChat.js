import React, {useState, useEffect, useRef } from 'react';
import './JanelaChat.css';
import { Search, AttachFile, MoreVert, InsertEmoticon, Close, Send, Mic } from '@material-ui/icons';
import EmojiPicker from 'emoji-picker-react';
import ItemMensagem from './ItemMensagem';

export default function JanelaChat({usuario}) {

  let recognition = null;
  let SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (SpeechRecognition !== undefined) {
    recognition = new SpeechRecognition();
  }

  const corpo = useRef();
  const [exibeEmoji, setExibeEmoji] = useState(false);
  const [ escutar, setEscutar ] = useState(false);
  const [ mensagem, setMensagem ] = useState('');
  //const [ listaMensagem, setListaMensagem ] = useState([  
  const [ listaMensagem ] = useState([
    {autor: 123, mens: 'Uma mensagem qualquer'},
    {autor: 123, mens: 'Testando o envio de mensagem'},
    {autor: 321, mens: 'Uma mensagem'},  
  ]);

  function handleEmojiClick(ev, emojiObject) {
    setMensagem(mensagem + emojiObject.emoji);
  }

  function handleMicClick() {
    if (recognition !== null) {
      recognition.onstart = () => {
        setEscutar(true);
      }
      recognition.onend = () => {
        setEscutar(false);
      }
      recognition.onresult = (ev) => {
        setMensagem( ev.results[0][0].transcript )
      }
      recognition.start();
    }
  }

  function handleSendClick() {

  }

  useEffect(() => {
    if (corpo.current.scrollHeight > corpo.current.offsetHeight ) {
      corpo.current.scrollTop = corpo.current.scrollHeight - corpo.current.offsetHeight;
    }
  }, [listaMensagem])

  return (
    <div className="janelaChat">
      <div className="janelaChat-cabecalho">
        
        <div className="janelaChat-info">
          <img className="janelaChat-avatar" src="https://www.w3schools.com/howto/img_avatar2.png" alt="avatar" />
          <div className="janelaChat-nome" >Kleiser Nairobi</div>
        </div>

        <div className="janelaChat-botoes">
          <div className="janelaChat-botao">
            <Search style={{color: '#919191'}} />
          </div>
          <div className="janelaChat-botao">
            <AttachFile style={{color: '#919191'}} />
          </div>
          <div className="janelaChat-botao">
            <MoreVert style={{color: '#919191'}} />
          </div>          
        </div>

      </div>

      <div ref={corpo} className="janelaChat-corpo">
        {listaMensagem.map((item, key)=>(
          <ItemMensagem
            key={key}
            data={item}
            usuario={usuario}
          />
        ))}
      </div>

      <div className="janelaChat-emoji" style={{height: exibeEmoji ? '210px' : '0px'}} >
        <EmojiPicker
          disableSearchBar
          disableSkinTonePicker
          onEmojiClick={handleEmojiClick}
        />
      </div>


      <div className="janelaChat-rodape">

        <div className="janelaChat-esquerda">
          <div 
            className="janelaChat-botao" 
            onClick={()=>setExibeEmoji(false)}
            style={{width: exibeEmoji ? 40 : 0}}
          >
            <Close style={{color: '#919191'}} />
          </div>
          <div className="janelaChat-botao" onClick={()=>setExibeEmoji(true)} >
            <InsertEmoticon style={{color: exibeEmoji ? '#000' : '#919191'}} />
          </div>
        </div>

        <div className="janelaChat-centro">
          <input 
            className="janelaChat-input" 
            type="text" 
            placeholder="Digite uma mensagem..."
            value={mensagem}
            onChange={(ev)=>setMensagem(ev.target.value)}
          />
        </div>
        
        <div className="janelaChat-direita">
          {mensagem === '' && 
            <div className="janelaChat-botao" onClick={handleMicClick}>
              <Mic style={{color: escutar ? '#126ece' : '#919191'}} />
            </div>        
          }
          {mensagem !== '' && 
            <div className="janelaChat-botao" onClick={handleSendClick}>
              <Send style={{color: '#919191'}} />
            </div>
          }
        </div>

      </div>
    </div>
  )
}

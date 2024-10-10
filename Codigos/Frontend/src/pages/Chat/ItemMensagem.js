import React from 'react';
import './ItemMensagem.css';

export default function ItemMensagem({data, usuario}) {
  return (
    <div 
      className="mensagem-linha"
      style={{ justifyContent: usuario.id === data.autor ? 'flex-end' : 'flex-start' }}
    >
      <div 
        className="mensagem-item"
        style={{backgroundColor: usuario.id === data.autor ? '#dcf8c6' : '#fff'}}
      
      >
        <div className="mensagem-texto">{data.mens}</div>
        <div className="mensagem-data" >16:30</div>
      </div>      
    </div>
  )
}

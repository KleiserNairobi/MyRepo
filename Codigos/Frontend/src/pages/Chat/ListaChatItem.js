import React from 'react';
import './ListaChatItem.css';

export default function ListaChatItem({onClick, active, data}) {
  return (
    <div className={`listaChatItem ${active ? 'active' : ''}`} onClick={onClick} >
      <img className="listaChatItem-avatar" src={data.imagem} alt="avatar"/>
      <div className="listaChatItem-linhas">
        <div className="listaChatItem-linha">
          <div className="listaChatItem-nome">{data.titulo}</div>
          <div className="listaChatItem-data">09:00</div>
        </div>

        <div className="listaChatItem-linha">
          <div className="listaChatItem-ultimaMens">
            <p>Última mensagem enviada - Última mensagem enviada - Última mensagem enviada</p>
          </div>
        </div>

      </div>
    </div>
  )
}

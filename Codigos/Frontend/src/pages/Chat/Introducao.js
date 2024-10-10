import React from 'react';
import './Introducao.css';
import logo from '../../assets/images/chamai_L50.png';

export default function Introducao() {

  return (
    <div className="chatIntroducao">
      <img src={logo} alt="logomarca"/>
      <h1>Chamaíh Suporte ao Usuário</h1>
      <h2>Selecione um chat parar começar a conversar</h2>
    </div>
  )
  
}

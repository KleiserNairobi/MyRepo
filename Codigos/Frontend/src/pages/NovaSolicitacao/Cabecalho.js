import React from 'react';
import { Avatar, CardHeader } from '@material-ui/core';
import { AddLocation } from '@material-ui/icons';
import Styles from './Styles';

export default function Cabecalho() {
  const classes = Styles();

  return (
    <CardHeader
      avatar={<Avatar className={classes.avatar}><AddLocation /></Avatar>}
      title="Nova Solicitação"
      subheader="Para agendar ou solicitar uma entrega, informe o veículo desejado, 
      o endereço de retirada e entrega"
      className={classes.cartaoTitulo}
    />  
  )
}

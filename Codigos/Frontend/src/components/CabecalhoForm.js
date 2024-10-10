import React from 'react';
import { Button, Grid, Typography } from '@material-ui/core';
import { useHistory } from 'react-router-dom';
import { useGeral } from '../contexts/GeralCtx';
import styles from '../layout/styles';

export default function CabecalhoForm(props) {

  const estilo = styles();
  const history = useHistory();
  const { setId, setAlterar, setCarregar } = useGeral();

  function chamaLink(linkPagina) {
    if (props.tituloBotao === 'Adicionar') {
      setId(-1);
      setAlterar(false);
    }
    if (props.tituloBotao === 'Retornar') {
      setId(-1);
      setAlterar(false);
      setCarregar(true);
    }
    history.push(linkPagina);
  }

  return (
    <Grid container direction="row" justify="space-between" alignItems="center">
      <div>
        <div className={estilo.tituloPagina}>
          <Typography variant="h6">{props.titulo}</Typography>
        </div>
        <div className={estilo.subtituloPagina}>
          <Typography variant="caption">{props.subtitulo}</Typography>
        </div>
      </div>
      <div style={{ flex: 1 }} />
      {props.exibirBotao &&
        <Button
          color="primary"
          variant="outlined"
          disableElevation
          startIcon={props.icone}
          onClick={() => chamaLink(props.linkPagina)}
        >
          {props.tituloBotao}
        </Button> 
      } 
    </Grid>
  );
}
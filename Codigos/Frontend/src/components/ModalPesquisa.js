import React from 'react'
import {
  Dialog, DialogTitle, DialogContent, IconButton,
  Typography, Button, DialogActions, makeStyles, Grid
} from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import { useGeral } from '../contexts/GeralCtx';
import { useAlerta } from '../contexts/AlertaCtx';
import { TIPO_AVISO } from '../utils/global';

const useStyles = makeStyles(theme => ({
  titulo: {
    backgroundColor: '#38454C',
    '& .MuiTypography-h6': {
      color: '#FEC601'
    },
    '& .MuiTypography-caption': {
      color: '#FFFFFF',
      opacity: '0.9'
    },
    '& .MuiButtonBase-root': {
      color: '#FEC601'
    },
    '& .MuiIconButton-root': {
      color: '#FEC601'
    },
    '& .MuiSvgIcon-root': {
      color: '#FEC601'
    }
  },
  conteudo: {
    margin: 0,
    padding: 0
  },
  acao: {
    marginBottom: '20px',
    '& .MuiButtonBase-root': {
      color: '#38454C'
    }
  }
}))

export default function ModalPesquisa(props) {
  const { children, titulo, subtitulo, abrir, setAbrir } = props;
  const estilo = useStyles();
  const { qtde, setBuscarDados } = useGeral();
  const { setExibir, setConteudo } = useAlerta();

  return (
    <Dialog open={abrir} fullWidth={true} maxWidth="lg" >
      <DialogTitle className={estilo.titulo}>
        <div style={{ display: 'flex' }}>
          <Grid>
            <Typography variant="h6" component="div">{titulo}</Typography>
            <Typography variant="caption" component="div">{subtitulo}</Typography>
          </Grid>
          <div style={{ flex: 1 }} />
          <IconButton onClick={() => setAbrir(false)}><CloseIcon /></IconButton>
        </div>
      </DialogTitle>
      <DialogContent className={estilo.conteudo} >
        <div className={estilo.conteudo}>
          {children}
        </div>
      </DialogContent>
      <DialogActions className={estilo.acao}>
        <Button
          variant="contained"
          color="primary"
          disableElevation
          style={{ marginRight: '20px' }}
          onClick={() => {
            if (qtde > 1) {
              setConteudo({
                tipo: TIPO_AVISO,
                descricao: 'Selecione apenas um registro'
              });
              setExibir(true);
              setTimeout(() => { setExibir(false) }, 2500);
            } else {
              setBuscarDados(true);
              setAbrir(false);
            }
          }}
        >
          Confirmar
        </Button>
      </DialogActions>
    </Dialog>
  )
}

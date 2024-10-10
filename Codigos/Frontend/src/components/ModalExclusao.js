import React from 'react';
import {
  Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, makeStyles, Typography
} from '@material-ui/core';
import ContactSupportIcon from '@material-ui/icons/ContactSupport';
import { useGeral } from '../contexts/GeralCtx';

const useStyles = makeStyles(theme => ({
  dialogo: {
    padding: theme.spacing(2),
    position: 'absolute',
    top: theme.spacing(5)
  },
  cabecalho: {
    textAlign: 'center',
  },
  conteudo: {
    marginTop: '10px',
    marginBottom: '20px',
    textAlign: 'center',
  },
  acao: {
    justifyContent: 'center',
    marginBottom: '20px',
    '& .MuiButtonBase-root': {
      color: '#38454C'
    },
  },
  icone: {
    marginTop: 10,
    backgroundColor: '#38454C',
    color: theme.palette.primary.main,
    '&:hover': {
      backgroundColor: '#38454C',
      color: theme.palette.primary.main,
      cursor: 'default',
    },
    '& .MuiSvgIcon-root': {
      fontSize: '5rem',
    }
  },
}))

export default function ModalExclusao(props) {
  const { abrir, setAbrir, titulo, subtitulo } = props
  const { texto, setExcluir, setConfirmaExcluir } = useGeral();
  const estilo = useStyles();

  return (
    <Dialog open={abrir} fullWidth={true} maxWidth="xs" className={estilo.dialogo}>
      <DialogTitle className={estilo.cabecalho}>
        <IconButton disableRipple className={estilo.icone} >
          <ContactSupportIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent className={estilo.conteudo}>
        <Typography variant="h6" component="div">{titulo}</Typography>
        <Typography variant="caption" component="div">{subtitulo}</Typography>
        <Typography variant="caption" component="div" color="error">{texto}</Typography>
      </DialogContent>
      <DialogActions className={estilo.acao}>
        <Button
          variant="contained"
          disableElevation
          onClick={() => {
            setAbrir(false);
            setExcluir(false);
          }}
        > Não
        </Button>
        <Button
          variant="contained"
          color="primary"
          disableElevation
          onClick={() => {
            setAbrir(false);
            setExcluir(false);
            setConfirmaExcluir(true);
          }}
        > Sim
        </Button>
      </DialogActions>
    </Dialog>
  )
}

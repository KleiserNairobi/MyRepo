import React, {useState} from 'react';
import {
  Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogContentText, 
  DialogTitle, InputAdornment, Slide, TextField
} from '@material-ui/core';
import { Email } from '@material-ui/icons';
import * as service from '../../services/apiBack';
import { useAlerta } from '../../contexts/AlertaCtx';
import { TIPO_ERRO, TIPO_SUCESSO } from '../../utils/global';
import { isEmail } from '../../utils/funcoes';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function EsqueceuSenha(props) {
    
  const { abrir, setAbrir } = props
  const { setConteudo } = useAlerta();  
  const [email, setEmail] = useState('');
  const [progresso, setProgresso] = useState(false);

  function btnEnviar() {
    setProgresso(true);
    if (email !== null) {
      if (isEmail(email)) {
        service.obtem(`/emails/${email}/recuperar-senha`)
        .then(response => {
          setConteudo({
            tipo: TIPO_SUCESSO,
            descricao: 'Um e-mail foi enviado para o endereço ' + email + 
            ', contendo as instruções para recuperar sua senha. ' + 
            'Em caso de dúvidas, entre em contato com o nosso suporte.',
            exibir: true
          });  
          setAbrir(false);
          setEmail('');
          setProgresso(false);
        })
        .catch(error => {
          setProgresso(false);
          setConteudo({
            tipo: TIPO_ERRO,
            descricao: error.response.data.detalhe,
            exibir: true
          });          
        })  
      } else {
        setProgresso(false);
        setConteudo({
          tipo: TIPO_ERRO,
          descricao: 'Email inválido',
          exibir: true
        });
      }
    }
  }

  return (
    <div>
      <Dialog
        open={abrir}
        TransitionComponent={Transition}
        keepMounted
        onClose={()=>setAbrir(false)}     
      >
        <DialogTitle>Esqueceu a senha?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Envie o link de redefinição de senha para seu e-mail
          </DialogContentText>
          <div style={{marginTop: '15px', marginBottom: '15px'}}>
          <TextField
            autoFocus
            fullWidth
            type="email"
            label="E-Mail"
            placeholder="Digite seu e-mail"
            value={email}
            onChange={(ev)=>setEmail(ev.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start" style={{color:'#2F3D44'}}>
                  <Email />
                </InputAdornment>
              ),
            }}            
          />
          </div>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={btnEnviar} 
            style={{
              width: '150px',
              backgroundColor: '#FEC601', 
              color: '#2B373D'
            }}
          > 
            {
              progresso
              ? <CircularProgress style={{marginRight: 10, color: '#000'}} size={16}/> 
              : null
            }          
            Enviar link
          </Button>
          <Button 
            onClick={()=>setAbrir(false)} 
            style={{
              backgroundColor: '#FEC601', 
              color: '#2B373D', 
              marginRight: '10px'
            }}
          > Fechar
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}

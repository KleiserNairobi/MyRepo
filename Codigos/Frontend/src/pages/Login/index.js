import React, { useState } from 'react'
import { Link, useHistory } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers';
import InputMask from 'react-input-mask';
import {
  CssBaseline, Grid, Paper, InputAdornment, Button, createMuiTheme,
  MuiThemeProvider, Typography, Hidden, Switch, TextField, CircularProgress
} from '@material-ui/core';
import { Email, Phone, Lock, Facebook, Google } from '@material-ui/icons';
import { useGeral } from '../../contexts/GeralCtx';
import { useAlerta } from '../../contexts/AlertaCtx';
import { useAutenticacao } from '../../contexts/AutenticacaoCtx';
import * as service from '../../services/apiBack';
import { TIPO_ERRO, ID_FACEBOOK, ID_GOOGLE } from '../../utils/global';
import GoogleLogin from 'react-google-login';
import FacebookLogin from 'react-facebook-login/dist/facebook-login-render-props';
import EsqueceuSenha from './EsqueceuSenha';
import schema from './LoginSch';
import styles from './styles';
import logo from '../../assets/images/Chamai_250x114.png'
import {decrypt} from '../../utils/funcoes';


const theme = createMuiTheme({
  palette: {
    type: "light",
    primary: {
      light: '#FECC00', main: '#FECC00', dark: '#FBBB1B', contrastText: '#000'
    },
    secondary: {
      light: '#FECC00', main: '#FECC00', dark: '#FBBB1B', contrastText: '#000'
    },
  }
})

export default function Login() {

  const classes = styles();
  const history = useHistory();
  const { estiloDeCampo } = useGeral();
  const { setConteudo } = useAlerta();
  const { handleLogin, progresso, setProgresso } = useAutenticacao();
  const [chkEmail, setChkEmail] = useState(true);
  const [valor, setValor] = useState('');
  const [mascara, setMascara] = useState("(99)99999-9999");
  const [redefinirSenha, setRedefinirSenha] = useState(false);
  const valoresIniciais = { email: '', telefone: '', senha: '' };
  const { register, handleSubmit, errors, control, setValue } = useForm({
    mode: 'all',
    defaultValues: valoresIniciais,
    resolver: yupResolver(schema)
  });

  
  async function insereUsuario(nome, email) {
    let jsonData = {
      "nome": nome,
      "email": email
    }
    try {
      const resposta = await service.insere('/registros/cliente-ls', jsonData);
      if (resposta) {
        console.log('registro foi inserido')
        handleLogin(email, decrypt(resposta.data.senhaSocial));
      }
    } catch (erro) {
      setConteudo({
        tipo: TIPO_ERRO,
        descricao: erro.response.data.detalhe,
        exibir: true
      });
    }
  }

  function respostaFacebook(response) {
    console.log('chamada da api do Facebook')
    if (response.status !== "unknown") { 
      setProgresso(true);     
      localStorage.setItem('chamai_imagemLS', response.picture.data.url);
      async function getUsuario(email) {
        let url = `/registros/usuario/${email}?campos=email,senhaSocial`;
        try {
          const resposta = await service.obtem(url);
          if (resposta.data) {
            handleLogin(email, decrypt(resposta.data.senhaSocial));
          } else {
            insereUsuario(response.name, response.email);  
          }  
        } catch (erro) {
          setProgresso(false);
          setConteudo({
            tipo: TIPO_ERRO,
            descricao: erro.response.data.detalhe,
            exibir: true
          });
        }
      }
      getUsuario(response.email);
    }
  }

  function respostaGoogle(response) {
    console.log('chamada a api do Google')
    if (response.error !== "popup_closed_by_user") {
      setProgresso(true);
      localStorage.setItem('chamai_imagemLS', response.profileObj.imageUrl);      
      async function getUsuario(email) {
        let url = `/registros/usuario/${email}?campos=email,senhaSocial`;
        try {
          const resposta = await service.obtem(url);
          if (resposta.data) {
            handleLogin(email, decrypt(resposta.data.senhaSocial));            
          } else {
            insereUsuario(response.profileObj.name, response.profileObj.email); 
          }  
        } catch (erro) {
          setProgresso(false);
          setConteudo({
            tipo: TIPO_ERRO,
            descricao: erro.response.data.detalhe,
            exibir: true
          });
        }
      }
      getUsuario(response.profileObj.email);
    }
  }

  function chamaSubmit(data) {        
    if (!data.email && !data.telefone) {
      setConteudo({
        tipo: TIPO_ERRO,
        descricao: 'Informe um e-mail ou telefone!',
        exibir: true
      });
      return null
    }
    if (!data.senha) {
      setConteudo({
        tipo: TIPO_ERRO,
        descricao: 'Informe a senha!',
        exibir: true
      });
      return null
    }    
    if (data.email) {
      setProgresso(true);
      handleLogin(data.email, data.senha);
    }
    if (data.telefone) {
      setProgresso(true);
      handleLogin(data.telefone, data.senha);
    }
  }

  return (
    <MuiThemeProvider theme={theme}>
      <CssBaseline />
      <Grid container component="main" className={classes.root} >                
        <Grid item xs={false} sm={6} className={classes.boxImage} >
          {/*<img className={classes.boxImagemImg} src={login} alt="login" ></img>*/}
          <Hidden only="xs">
            <div className={classes.tituloBoxImagem}>
              <Typography className={classes.boxImagemTitulo} variant="h5" align="center" >Facilidade no pedido e agilidade na entrega!</Typography>
              <Typography className={classes.boxImagemTitulo} variant="h5" align="center" >Direto do conforto da sua casa.</Typography>
            </div>
          </Hidden >
        </Grid>
        <Grid item xs={12} sm={6} component={Paper} elevation={6} square>
          <div className={classes.paper}>
            <img className={classes.logomarca} src={logo} alt="logomarca" ></img>
            <form className={classes.form} onSubmit={handleSubmit(chamaSubmit)}  >
              
              <div className={classes.tituloEscolhaLogin}>
                <Grid container className={classes.tituloEscolhaLogin}>
                  <Typography variant="caption">Escolha entre informar </Typography>
                  <Grid item xs={12}></Grid>
                  <Grid item><Typography variant="caption"><strong>Telefone</strong></Typography></Grid>
                  <Grid item>
                    <Switch
                      checked={chkEmail}
                      onChange={() => {
                        setChkEmail(!chkEmail);
                        if (chkEmail) {
                          setValor('');
                          setValue('telefone', '');
                        } else {
                          setValue('email', '');
                        }
                      }}
                      color="primary"
                      name="chkEmail"
                      inputProps={{ 'aria-label': 'secondary checkbox' }}
                    />
                  </Grid>
                  <Grid item><Typography variant="caption"><strong>E-Mail</strong></Typography></Grid>
                </Grid>
              </div>

              {chkEmail ?
                <TextField
                  fullWidth
                  className={classes.textField}
                  inputRef={register}
                  variant={estiloDeCampo}
                  name="email"
                  type="email"
                  label="E-Mail"
                  placeholder="Digite seu e-mail"
                  error={!!errors.email}
                  helperText={errors.email ? errors.email.message : ''}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start" style={{color:'#2F3D44'}}>
                        <Email />
                      </InputAdornment>
                    ),
                  }}
                />
                :
                <Controller
                  name="telefone"
                  control={control}
                  render={({ onChange, onBlur, value }) => (
                    <InputMask
                      mask={mascara}
                      maskChar=" "
                      disabled={false}
                      value={valor}
                      onChange={(ev) => {
                        setValor(ev.target.value);
                        setValue("telefone", ev.target.value)
                        if (ev.target.value.replace(/([^\d])/g, "").length === 3) {
                          const novoValor = ev.target.value.replace(/([^\d])/g, "").substring(3, 2);
                          if (novoValor === '9') {
                            setMascara("(99)99999-9999");
                          } else {
                            setMascara("(99)9999-9999");
                          }
                        }
                      }}
                      className={classes.textField}
                    >
                      {(inputProps) =>
                        <TextField
                          {...inputProps}
                          fullWidth
                          type="text"
                          variant={estiloDeCampo}
                          label="Telefone"
                          error={!!errors.telefone}
                          helperText={errors.telefone ? errors.telefone.message : ''}
                          InputLabelProps={{ shrink: true }}
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start" style={{color:'#2F3D44'}}>
                                <Phone />
                              </InputAdornment>
                            ),
                          }}
                          placeholder="Digite seu telefone"
                        />
                      }
                    </InputMask>
                  )}
                />
              }
              
              <TextField
                fullWidth
                className={classes.textField}
                inputRef={register}
                variant={estiloDeCampo}
                name="senha"
                type="password"
                label="Senha"
                placeholder="Digite sua senha"
                error={!!errors.senha}
                helperText={errors.senha ? errors.senha.message : ''}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start" style={{color:'#2F3D44'}}>
                      <Lock />
                    </InputAdornment>
                  ),
                }}
              />

              <div className={classes.mt20}>
                <Typography variant="caption">
                  Esqueceu sua senha? &nbsp;
                  <Link                   
                    // component="button"
                    to="#"
                    variant="caption"
                    onClick={() => setRedefinirSenha(true)}
                  >
                    Clique aqui para alterar
                  </Link>
                </Typography>
              </div>

              <div className={classes.botoes}>
                <Button
                  style={{ width: '48%' }}
                  fullWidth
                  type="submit"
                  variant="contained"
                  color="primary"
                  disableElevation
                >
                  {progresso ? <CircularProgress style={{ marginRight: 10, color: '#000' }} size={16} /> : null}                  
                  Entrar Agora
                </Button>
                <Button
                  style={{ width: '48%' }}
                  fullWidth
                  variant="contained"
                  color="primary"
                  disableElevation
                  onClick={() => history.push('/cadastro')}
                >Cadastrar
                </Button>
              </div>
 
              <Typography variant="body2" className={classes.separador}>
                <span className={classes.textoSeparador}>ou entre com</span>
              </Typography>

              <br/><br/>
 
              <div className={classes.mediaSocial}>
                <FacebookLogin
                  appId={ID_FACEBOOK}
                  autoLoad={false}
                  language="pt_BR"
                  fields="name,email,picture"
                  callback={respostaFacebook}
                  render={renderProps => (
                    <Button
                      variant="contained"
                      disableRipple
                      disableElevation
                      className={classes.botoesMidiaSocial}
                      startIcon={<Facebook />}
                      onClick={renderProps.onClick}
                    > Facebook
                    </Button>
                  )}
                />
                <GoogleLogin
                  clientId={ID_GOOGLE}
                  autoLoad={false}
                  onSuccess={respostaGoogle}
                  onFailure={respostaGoogle}
                  render={renderProps => (
                    <Button
                      variant="contained"
                      disableRipple
                      disableElevation
                      className={classes.botoesMidiaSocial}
                      startIcon={<Google />}
                      onClick={renderProps.onClick}
                    > Google
                    </Button>
                  )}
                />
              </div>

            </form>
          </div>
        </Grid>
      </Grid>
      <EsqueceuSenha
        abrir={redefinirSenha}
        setAbrir={setRedefinirSenha}
      />
    </MuiThemeProvider>
  )
}

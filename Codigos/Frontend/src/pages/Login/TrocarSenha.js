import React, {useState} from 'react';
import {
  Button, CssBaseline, Grid, InputAdornment, TextField, Typography, createMuiTheme, MuiThemeProvider, CircularProgress
} from '@material-ui/core';
import { Beenhere, Email, Lock } from '@material-ui/icons';
import { useHistory } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers';
import { useAlerta } from '../../contexts/AlertaCtx';
import { TIPO_ERRO, TIPO_SUCESSO } from '../../utils/global';
import * as service from '../../services/apiBack';
import schema from './TrocarSenhaSch';
import logo from '../../assets/images/logo_213x100.png';
import styles from './styles';

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

export default function TrocarSenha() {
  const classes = styles();
  const history = useHistory();
  const { setConteudo } = useAlerta();
  const [progresso, setProgresso] = useState(false);
  const valoresIniciais = { codigo: '', email: '', senha: '', confirmeSenha: '' };
  const { register, errors, handleSubmit, reset } = useForm({
    mode: 'all',
    defaultValues: valoresIniciais,
    resolver: yupResolver(schema)
  });

  async function chamaSubmit(data) { 
    setProgresso(true);
    let jsonData = {
      "email": data.email,
      "codigo": data.codigo,
      "senha": data.senha
    }
    try {
      const resposta = await service.altera('/usuarios/trocar-senha', jsonData);
      if (resposta) {
        setProgresso(false);
        reset(valoresIniciais);
        setConteudo({
          tipo: TIPO_SUCESSO,
          descricao: "Senha alterada com sucesso!",
          exibir: true
        });
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

  return (
    <MuiThemeProvider theme={theme}>
      <div>
        <CssBaseline />
        <form onSubmit={handleSubmit(chamaSubmit)}>
          <Grid container direction="column">
            <Grid item xs={12} style={{ marginTop: '120px' }}>
              <div className={classes.trocaSenhaLogo}>
                <img src={logo} alt="logomarca"></img>
              </div>
            </Grid>
            <Grid item xs={12} style={{ marginTop: '70px' }}>
              <Grid
                container
                direction="row"
                justify="center"
                alignItems="center"
              >
                <Grid item xs={12} sm={6}>
                  <Grid
                    container
                    direction="column"
                    alignItems="flex-end"
                    style={{ paddingRight: '20px' }}
                  >
                    <Typography variant="h6">Redefinição de Senha</Typography>
                    <Typography variant="body2">a senha deve ser numérica *</Typography>
                    <Typography variant="body2">deve conter entre 4 e 6 caracteres *</Typography>
                    <Typography variant="body2">não deve conter informações pessoais *</Typography>
                  </Grid>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Grid
                    container
                    direction="column"
                    alignItems="flex-start"
                    style={{
                      borderLeft: '1px solid',
                      paddingLeft: '20px',
                      width: '400px'
                    }}
                  >
                    <Grid container direction="row" spacing={2}>
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          name="codigo"
                          label="Código"
                          inputRef={register}
                          placeholder="Digite o código de recuperação"
                          error={!!errors.codigo}
                          helperText={errors.codigo ? errors.codigo.message : ''}
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start" style={{ color: '#2F3D44' }}>
                                <Beenhere />                                
                              </InputAdornment>
                            ),
                          }}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          name="email"
                          type="email"
                          label="E-Mail"
                          inputRef={register}
                          placeholder="Digite seu e-mail"
                          error={!!errors.email}
                          helperText={errors.email ? errors.email.message : ''}
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start" style={{ color: '#2F3D44' }}>
                                <Email />
                              </InputAdornment>
                            ),
                          }}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          name="senha"
                          type="password"
                          label="Senha"
                          inputRef={register}
                          placeholder="Digite sua senha"
                          error={!!errors.senha}
                          helperText={errors.senha ? errors.senha.message : ''}
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start" style={{ color: '#2F3D44' }}>
                                <Lock />
                              </InputAdornment>
                            ),
                          }}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          name="confirmeSenha"
                          type="password"
                          label="Confirmar Senha"
                          inputRef={register}
                          placeholder="Digite sua senha"
                          error={!!errors.confirmeSenha}
                          helperText={errors.confirmeSenha ? errors.confirmeSenha.message : ''}
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start" style={{ color: '#2F3D44' }}>
                                <Lock />
                              </InputAdornment>
                            ),
                          }}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <Button
                          type="submit"
                          variant="contained"
                          color="primary"
                          disableElevation
                          style={{marginTop: '20px'}}
                        > 
                          {
                            progresso
                            ? <CircularProgress style={{marginRight: 10, color: '#000'}} size={16}/> 
                            : null
                          }
                          Salvar
                        </Button>
                        <Button
                          variant="contained"
                          color="primary"
                          disableElevation
                          onClick={()=> history.push('/login') }
                          style={{marginTop: '20px', marginLeft: '10px'}}
                        > Entrar Agora
                        </Button>                        
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </form>
      </div>
    </MuiThemeProvider>
  )
}

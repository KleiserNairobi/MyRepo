import React, {useState} from 'react';
import { Avatar, Button, Card, CardContent, CardHeader, CircularProgress, Divider, Grid, TextField } from '@material-ui/core';
import { VpnKey } from '@material-ui/icons';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers';
import CabecalhoForm from '../../components/CabecalhoForm';
import { useGeral } from '../../contexts/GeralCtx';
import { useAlerta } from '../../contexts/AlertaCtx';
import * as service from '../../services/SenhaService';
import { TIPO_ERRO, TIPO_SUCESSO } from '../../utils/global';
import schema from './SenhaSch';
import PageCss from '../PagesCss';


export default function Senha() {
  
  const css = PageCss();
  const { estiloDeCampo } = useGeral();
  const { setConteudo } = useAlerta();
  const [progresso, setProgresso] = useState(false);

  const valoresIniciais = {
    senhaAtual: '',
    novaSenha: '',
    confirmeSenha: '',
  }

  const { register, handleSubmit, errors, reset } = useForm({
    mode: 'all',
    defaultValues: valoresIniciais,
    resolver: yupResolver(schema)
  });

  async function submitForm(data) {
    let url = '/usuarios/trocar-senha-usuario-logado?';
    url += `senhaAtual=${data.senhaAtual}&senhaNova=${data.novaSenha}`;
    try {
      const resposta = await service.altera(url);      
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
    <div>
      <CabecalhoForm
        titulo="Senha"
        subtitulo="Alteração de senha"
        linkPagina="/senha-form"
        tituloBotao="Adicionar"
        exibirBotao={false}
      />
      <form onSubmit={handleSubmit(submitForm)}>
        <Card variant="outlined">
          <CardContent>
            <Card>
              <CardHeader
                avatar={<Avatar className={css.avatar}><VpnKey /></Avatar>}
                title="Senha"
                subheader="Informe os dados da nova senha"
                className={css.cartaoTitulo}
              />
              <CardContent>
                <Grid container direction="row" spacing={2}>
                  <Grid item xs={12} sm={4}>
                    <TextField
                      fullWidth
                      type="password"
                      name="senhaAtual"
                      label="Senha Atual"
                      variant={estiloDeCampo}
                      inputRef={register}
                      placeholder=""
                      InputLabelProps={{ shrink: true }}
                      error={!!errors.senhaAtual}
                      helperText={errors.senhaAtual ? errors.senhaAtual.message : ''}
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <TextField
                      fullWidth
                      type="password"
                      name="novaSenha"
                      label="Nova Senha"
                      variant={estiloDeCampo}
                      inputRef={register}
                      placeholder=""
                      InputLabelProps={{ shrink: true }}
                      error={!!errors.novaSenha}
                      helperText={errors.novaSenha ? errors.novaSenha.message : ''}
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <TextField
                      fullWidth
                      type="password"
                      name="confirmeSenha"
                      label="Confirme a Senha"
                      variant={estiloDeCampo}
                      inputRef={register}
                      placeholder=""
                      InputLabelProps={{ shrink: true }}
                      error={!!errors.confirmeSenha}
                      helperText={errors.confirmeSenha ? errors.confirmeSenha.message : ''}
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
            <div className={css.formBarraBotao}>
              <Divider />
            </div>
            <div style={{ display: 'flex' }}>
              <div style={{ flex: 1 }} />
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disableElevation
                className={css.formBotaoDeAcao}
              > 
                {
                  progresso
                  ? <CircularProgress style={{marginRight: 10, color: '#000'}} size={16}/> 
                  : null
                }
                Salvar
              </Button>
              <Button
                type="reset"
                variant="contained"
                color="primary"
                disableElevation
                onClick={() => reset(valoresIniciais)}
                className={css.formBotaoDeAcao}
              > Limpar
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  )
}

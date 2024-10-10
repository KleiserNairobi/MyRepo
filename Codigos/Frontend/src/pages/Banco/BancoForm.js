import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { 
  Avatar, Button, Card, CardContent, CardHeader, Divider, Grid, TextField 
} from '@material-ui/core';
import { ArrowBack, AccountBalance } from '@material-ui/icons';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers';
import CabecalhoForm from '../../components/CabecalhoForm';
import * as service from '../../services/apiBack';
import { useAlerta } from '../../contexts/AlertaCtx';
import { useGeral } from '../../contexts/GeralCtx';
import PageCss from '../PagesCss';
import schema from './BancoSch';
import { TIPO_ERRO, TIPO_SUCESSO } from '../../utils/global';


export default function BancoForm() {

  const css = PageCss();
  const history = useHistory();
  const valoresIniciais = { codigo: '', nome: '' };
  const { register, handleSubmit, errors, reset, setValue } = useForm({
    mode: 'all',
    defaultValues: valoresIniciais,
    resolver: yupResolver(schema)
  });
  const { setConteudo } = useAlerta();
  const { id, alterar, setAlterar, setCarregar, estiloDeCampo } = useGeral();

  useEffect(() => {
    if (alterar) {
      async function buscaDado() {
        try {
          const resposta = await service.obtem(`/bancos/${id}?campos=codigo,nome`);
          if (resposta.data) {
            setValue('codigo', resposta.data.codigo);
            setValue('nome', resposta.data.nome);
          }
        } catch (error) {
          setConteudo({
            tipo: TIPO_ERRO,
            descricao: error.response.data.detalhe,
            exibir: true
          });
        }
      }
      buscaDado();
    }
  }, [id, alterar, setConteudo, setValue])

  function submitForm(data, e) {
    if (alterar & id > 0) {
      async function alteraDado() {
        try {
          const resposta = await service.altera(`/bancos/${id}`, data);
          if (resposta) {
            setConteudo({
              tipo: TIPO_SUCESSO,
              descricao: 'Registro alterado com sucesso!',
              exibir: true
            });
          }
          setAlterar(false);
          setCarregar(true);
          history.push('/bancos');
        } catch (error) {
          setConteudo({
            tipo: TIPO_ERRO,
            descricao: error.response.data.detalhe,
            exibir: true
          });
        }
      }
      alteraDado();
    } else {
      async function insereDado() {
        try {
          const resposta = await service.insere('/bancos', data);
          if (resposta) {
            setConteudo({
              tipo: TIPO_SUCESSO,
              descricao: 'Registro inserido com sucesso!',
              exibir: true
            });
          }
          reset(valoresIniciais);
        } catch (error) {
          setConteudo({
            tipo: TIPO_ERRO,
            descricao: error.response.data.detalhe,
            exibir: true
          });
        }
      }
      insereDado();
    }
  }

  return (
    <div>
      <CabecalhoForm
        titulo="Banco"
        subtitulo="Adição de novo registro"
        linkPagina="/bancos"
        icone={<ArrowBack />}
        tituloBotao="Retornar"
      />

      <form onSubmit={handleSubmit(submitForm)}>
        <Card variant="outlined">
          <CardContent>
            <Card>
              <CardHeader
                avatar={<Avatar className={css.avatar}><AccountBalance /></Avatar>}
                title="Banco"
                subheader="Informe os dados do banco"
                className={css.cartaoTitulo}
              />
              <CardContent>
                <Grid container direction="row" spacing={2}>
                  <Grid item xs={12} sm={3}>
                    <TextField
                      fullWidth
                      type="text"
                      name="codigo"
                      label="Código"
                      variant={estiloDeCampo}
                      inputRef={register}
                      InputLabelProps={{ shrink: true }}
                      inputProps={{ style: { textTransform: "uppercase" } }}
                      error={!!errors.codigo}
                      helperText={errors.codigo ? errors.codigo.message : ''}
                    />
                  </Grid>
                  <Grid item xs={12} sm={9}>
                    <TextField
                      fullWidth
                      type="text"
                      name="nome"
                      label="Nome"
                      variant={estiloDeCampo}
                      inputRef={register}
                      InputLabelProps={{ shrink: true }}
                      inputProps={{ style: { textTransform: "uppercase" } }}
                      error={!!errors.nome}
                      helperText={errors.nome ? errors.nome.message : ''}
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
              > Salvar
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
  );
}


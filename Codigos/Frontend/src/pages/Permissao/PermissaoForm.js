import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { Avatar, Button, Card, CardContent, CardHeader, Divider, Grid, TextField } from '@material-ui/core';
import { ArrowBack, HowToReg } from '@material-ui/icons';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers';
import CabecalhoForm from '../../components/CabecalhoForm';
import * as service from '../../services/apiBack';
import { useAlerta } from '../../contexts/AlertaCtx';
import { useGeral } from '../../contexts/GeralCtx';
import PageCss from '../PagesCss';
import schema from './PermissaoSch';
import { TIPO_ERRO, TIPO_SUCESSO } from '../../utils/global';


export default function PermissaoForm() {

  const css = PageCss();
  const history = useHistory();
  const valoresIniciais = { nome: '' };
  const { setConteudo } = useAlerta();
  const { id, setId, alterar, setAlterar, setCarregar, estiloDeCampo } = useGeral();
  const { register, handleSubmit, errors, reset, setValue } = useForm({
    mode: 'all',
    defaultValues: valoresIniciais,
    resolver: yupResolver(schema)
  });

  useEffect(() => {
    if (alterar) {
      async function buscaDado() {
        try {
          const resposta = await service.obtem(`/permissoes/${id}?campos=nome`);
          if (resposta.data) {
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
          const resposta = await service.altera(`/permissoes/${id}`, data);
          if (resposta) {
            setConteudo({
              tipo: TIPO_SUCESSO,
              descricao: 'Registro alterado com sucesso!',
              exibir: true
            });
            setAlterar(false);
            setCarregar(true);
            history.push('/permissoes');
          }
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
          const resposta = await service.insere('/permissoes', data);
          if (resposta) {
            setConteudo({
              tipo: TIPO_SUCESSO,
              descricao: 'Registro inserido com sucesso!',
              exibir: true
            });
            setId(-1);
            setAlterar(false);
            reset(valoresIniciais);
          }
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
        titulo="Permissoes"
        subtitulo="Adição de novo registro"
        linkPagina="/permissoes"
        icone={<ArrowBack />}
        tituloBotao="Retornar"
      />
      <form onSubmit={handleSubmit(submitForm)}>
        <Card variant="outlined">
          <CardContent>
            <Card>
              <CardHeader
                avatar={<Avatar className={css.avatar}><HowToReg /></Avatar>}
                title="Permissão"
                subheader="Informe os dados da permissão"
                className={css.cartaoTitulo}
              />
              <CardContent>
                <Grid container direction="row" spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
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

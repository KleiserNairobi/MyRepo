import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { 
  Avatar, Button, Card, CardContent, CardHeader, Divider, Grid, TextField 
} from '@material-ui/core';
import { ArrowBack, LocalAtm } from '@material-ui/icons';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers';
import CabecalhoForm from '../../components/CabecalhoForm';
import * as service from '../../services/apiBack';
import { useAlerta } from '../../contexts/AlertaCtx';
import { useGeral } from '../../contexts/GeralCtx';
import PageCss from '../PagesCss';
import schema from './MoedaSch';
import { TIPO_ERRO, TIPO_SUCESSO } from '../../utils/global';


export default function MoedaForm() {

  const css = PageCss();
  const history = useHistory();
  const valoresIniciais = { descricao: '' };
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
          const resposta = await service.obtem(`/moedas/${id}?campos=descricao`);
          if (resposta.data) {
            setValue('descricao', resposta.data.descricao);
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
          const resposta = await service.altera(`/moedas/${id}`, data);
          if (resposta) {
            setConteudo({
              tipo: TIPO_SUCESSO,
              descricao: 'Registro alterado com sucesso!',
              exibir: true
            });
          }
          setAlterar(false);
          setCarregar(true);
          history.push('/moedas');
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
          const resposta = await service.insere('/moedas', data);
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
        titulo="Moeda"
        subtitulo="Adição de novo registro"
        linkPagina="/moedas"
        icone={<ArrowBack />}
        tituloBotao="Retornar"
      />

      <form onSubmit={handleSubmit(submitForm)}>
        <Card variant="outlined">
          <CardContent>
            <Card>
              <CardHeader
                avatar={<Avatar className={css.avatar}><LocalAtm /></Avatar>}
                title="Moeda"
                subheader="Informe os dados da moeda"
                className={css.cartaoTitulo}
              />
              <CardContent>
                <Grid container direction="row" spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      type="text"
                      name="descricao"
                      label="Descrição"
                      variant={estiloDeCampo}
                      inputRef={register}
                      placeholder="EX.: DINHEIRO"
                      InputLabelProps={{ shrink: true }}
                      inputProps={{ style: { textTransform: "uppercase" } }}
                      error={!!errors.descricao}
                      helperText={errors.descricao ? errors.descricao.message : ''}
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

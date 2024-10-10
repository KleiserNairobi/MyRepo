import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { 
  Avatar, Button, Card, CardContent, CardHeader, Divider, Grid, MenuItem, TextField 
} from '@material-ui/core';
import { ArrowBack, AccountTree } from '@material-ui/icons';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers';
import InputMask from 'react-input-mask';
import CabecalhoForm from '../../components/CabecalhoForm';
import * as service from '../../services/apiBack';
import { useAlerta } from '../../contexts/AlertaCtx';
import { useGeral } from '../../contexts/GeralCtx';
import PageCss from '../PagesCss';
import schema from './CategoriaSch';
import { TIPO_ERRO, TIPO_SUCESSO } from '../../utils/global';


export default function CategoriaForm() {

  const css = PageCss();
  const history = useHistory();
  const valoresIniciais = { tipoCategoria: 'R', codigo: '', descricao: '' };
  const { register, handleSubmit, errors, reset, setValue, control } = useForm({
    mode: 'all',
    defaultValues: valoresIniciais,
    resolver: yupResolver(schema)
  });
  const { setConteudo } = useAlerta();
  const { id, alterar, setAlterar, setCarregar, estiloDeCampo } = useGeral();
  const [codigo, setCodigo] = useState('');

  useEffect(() => {
    if (alterar) {
      async function buscaDado() {
        try {
          const resposta = await service.obtem(`/categorias/${id}?campos=-id`);
          if (resposta.data) {
            setValue('tipoCategoria', resposta.data.tipoCategoria);
            setValue('codigo', resposta.data.codigo);
            setValue('descricao', resposta.data.descricao);
            setCodigo(resposta.data.codigo);
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

  function submitForm(data) {
    if (alterar & id > 0) {
      async function alteraDado() {
        try {
          const resposta = await service.altera(`/categorias/${id}`, data);
          if (resposta) {
            setConteudo({
              tipo: TIPO_SUCESSO,
              descricao: 'Registro alterado com sucesso!',
              exibir: true
            });
          }
          setAlterar(false);
          setCarregar(true);
          history.push('/categorias');
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
          const resposta = await service.insere('/categorias', data);
          if (resposta) {
            setConteudo({
              tipo: TIPO_SUCESSO,
              descricao: 'Registro inserido com sucesso!',
              exibir: true
            });
          }
          setCodigo('');
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
        titulo="Categoria"
        subtitulo="Adição de novo registro"
        linkPagina="/categorias"
        icone={<ArrowBack />}
        tituloBotao="Retornar"
      />
      <form onSubmit={handleSubmit(submitForm)}>
        <Card variant="outlined">
          <CardContent>
            <Card>
              <CardHeader
                avatar={<Avatar className={css.avatar}><AccountTree /></Avatar>}
                title="Categoria"
                subheader="Informe os dados da categoria"
                className={css.cartaoTitulo}
              />
              <CardContent>
                <Grid container direction="row" spacing={2}>
                  
                  <Grid item xs={12} sm={4}>
                    <Controller
                      name="tipoCategoria"
                      control={control}
                      as={
                        <TextField
                          select
                          fullWidth
                          label="Tipo de Categoria"
                          variant={estiloDeCampo}
                          placeholder="EX.: RECEITA"
                          InputLabelProps={{ shrink: true }}
                          //SelectProps={{ native: true }}
                          error={!!errors.tipoCategoria}
                          helperText={errors.tipoCategoria ? errors.tipoCategoria.message : ''}
                        >
                          <MenuItem  key="R" value="R">RECEITA</MenuItem>
                          <MenuItem  key="D" value="D">DESPESA</MenuItem>
                          <MenuItem  key="A" value="A">AMBOS</MenuItem>
                        </TextField>
                      }
                    />
                  </Grid>
                  
                  <Grid item xs={12} sm={8}>
                    <Controller
                      name="codigo"
                      control={control}
                      render={({ onChange, onBlur, value }) => (
                        <InputMask
                          mask="99.999.999"
                          maskChar=" "
                          disabled={false}
                          value={codigo}
                          onChange={(ev) => {
                            setCodigo(ev.target.value);
                            setValue("codigo", ev.target.value)
                          }}
                        >
                        {(inputProps) =>
                          <TextField
                            {...inputProps}
                            fullWidth
                            type="text"
                            label="Código"
                            variant={estiloDeCampo}
                            placeholder="EX.: 99.999.999"
                            InputLabelProps={{ shrink: true }}
                            error={!!errors.codigo}
                            helperText={errors.codigo ? errors.codigo.message : ''}
                          />
                        }
                        </InputMask>
                      )}
                    />
                  </Grid>
                  
                  <Grid item xs={12} sm={12}>
                    <TextField
                      fullWidth
                      type="text"
                      name="descricao"
                      label="Descrição"
                      variant={estiloDeCampo}
                      inputRef={register}
                      placeholder="EX.: ALUGUEL DE IMÓVEL"
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
                onClick={() => { 
                  setCodigo('');
                  reset(valoresIniciais);
                }}
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

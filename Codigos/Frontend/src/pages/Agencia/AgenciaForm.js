import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { 
  Avatar, Button, Card, CardContent, CardHeader, Divider, Grid, IconButton, TextField 
} from '@material-ui/core';
import { ArrowBack, Domain, YoutubeSearchedFor } from '@material-ui/icons';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers';
import CabecalhoForm from '../../components/CabecalhoForm';
import * as service from '../../services/apiBack';
import { useAlerta } from '../../contexts/AlertaCtx';
import { useGeral } from '../../contexts/GeralCtx';
import PageCss from '../PagesCss';
import schema from './AgenciaSch';
import { TIPO_ERRO, TIPO_SUCESSO } from '../../utils/global';
import ModalPesquisa from '../../components/ModalPesquisa';
import MyTablePesquisa from '../../components/MyTablePesquisa';


export default function AgenciaForm() {

  const css = PageCss();
  const history = useHistory();
  const valoresIniciais = { banco: { id: null }, codigo: '', nome: '' };
  const { register, handleSubmit, errors, reset, setValue } = useForm({
    mode: 'all',
    defaultValues: valoresIniciais,
    resolver: yupResolver(schema)
  });
  const { setConteudo } = useAlerta();
  const {
    id, setId, auxId, setAuxId, alterar, setAlterar, setCarregar, 
    estiloDeCampo, buscarDados, setBuscarDados
  } = useGeral();
  const [nomeBanco, setNomeBanco] = useState('');
  const [abrirModal, setAbrirModal] = useState(false);
  const [dadosPesquisa, setDadosPesquisa] = useState();

  const colunasTabPesquisa = [
    { title: 'ID', field: 'id', width: 20 },
    { title: 'Código', field: 'codigo', width: 20 },
    { title: 'Nome', field: 'nome' },
  ]

  // Effect para buscar dados da Agência - relativo a alteração
  useEffect(() => {
    if (alterar) {
      async function buscaDado() {
        try {
          const resposta = await service.obtem(`/agencias/${id}?campos=-id`);
          if (resposta.data) {
            setValue('banco.id', resposta.data.banco.id);
            setValue('codigo', resposta.data.codigo);
            setValue('nome', resposta.data.nome);
            setNomeBanco(resposta.data.banco.nome)
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

  // Effect para buscar dados do banco - sem ter disparado onBlur
  useEffect(() => {
    if (buscarDados) {
      async function getUnico() {
        try {
          const { data } = await service.obtem(`/bancos/${auxId}?campos=nome`);
          if (data) {
            setValue('banco.id', auxId);
            setNomeBanco(data.nome);
            setAuxId(-1);
          }
        } catch (error) {
          setValue('banco.id', null);
          setNomeBanco('');
          setAuxId(-1);
          setConteudo({
            tipo: TIPO_ERRO,
            descricao: 'Ocorreu um erro ao buscar os dados do Banco',
            exibir: true
          });
        }
      }
      getUnico();
    }
    return () => {      
      setBuscarDados(false);
    }
  }, [auxId, setAuxId, setValue, buscarDados, setBuscarDados, setConteudo]);

  // Abre modal para escolha do banco
  function carregaDadosBanco() {
    setAbrirModal(true);
    service.obtem('/bancos?campos=id,codigo,nome')
    .then(response => {
      setDadosPesquisa(response.data);
    })
    .catch(erro => {
      setConteudo({
        tipo: TIPO_ERRO,
        descricao: erro.response.data.detalhe,
        exibir: true
      });
    })
  }

  // Busca dados do banco - quando ocorre onBlur
  async function onBlurBanco(ev) {
    if (ev.target.value === '') {
      setNomeBanco('');
    } else {
      const idBanco = ev.target.value;
      try {
        const { data } = await service.obtem(`/bancos/${idBanco}?campos=nome`);
        if (data) {
          setValue('banco.id', idBanco);
          setNomeBanco(data.nome);
        }
      } catch (error) {
        setNomeBanco('');
        setConteudo({
          tipo: TIPO_ERRO,
          descricao: error.response.data.detalhe,
          exibir: true
        });
      }
    }
  }

  function submitForm(data) {
    if (alterar & id > 0) {
      async function alteraDado() {
        try {
          const resposta = await service.altera(`/agencias/${id}`, data);
          if (resposta) {
            setConteudo({
              tipo: TIPO_SUCESSO,
              descricao: 'Registro alterado com sucesso!',
              exibir: true
            });
          }
          setAlterar(false);
          setCarregar(true);
          history.push('/agencias');
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
          const resposta = await service.insere('/agencias', data);
          if (resposta) {
            setConteudo({
              tipo: TIPO_SUCESSO,
              descricao: 'Registro inserido com sucesso!',
              exibir: true
            });
          }
          setId(-1);
          setAlterar(false);
          setNomeBanco('');
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
        titulo="Agência"
        subtitulo="Adição de novo registro"
        linkPagina="/agencias"
        icone={<ArrowBack />}
        tituloBotao="Retornar"
      />

      <form onSubmit={handleSubmit(submitForm)}>
        <Card variant="outlined">
          <CardContent>
            <Card>
              <CardHeader
                avatar={<Avatar className={css.avatar}><Domain /></Avatar>}
                title="Agência"
                subheader="Informe os dados da agência"
                className={css.cartaoTitulo}
              />
              <CardContent>
                <Grid container direction="row" spacing={2}>
                  
                  <Grid item xs={12} sm={3} >
                    <TextField
                      fullWidth
                      type="number"
                      name="banco.id"
                      label="Banco"
                      variant={estiloDeCampo}
                      inputRef={register}
                      placeholder="EX.: 1"
                      InputLabelProps={{ shrink: true }}
                      error={!!errors.banco}
                      helperText={errors.banco ? errors.banco.id.message : ''}
                      InputProps={{
                        onBlur: (ev) => onBlurBanco(ev),
                        endAdornment: 
                          <IconButton
                            size="small"
                            onClick={() => carregaDadosBanco()}
                          >
                            <YoutubeSearchedFor fontSize="small" />
                          </IconButton>
                      }}
                    />
                  </Grid>

                  <Grid item xs={12} sm={9} >
                    <TextField
                      fullWidth
                      type="text"
                      name="nomeBanco"
                      label="Nome do Banco"
                      variant={estiloDeCampo}
                      value={nomeBanco}
                      placeholder="EX.: BANCO DO BRASIL"
                      InputLabelProps={{ shrink: true }}
                      inputProps={{ style: { textTransform: "uppercase" } }}
                    />
                  </Grid>

                  <Grid item xs={12} sm={3} >
                    <TextField
                      fullWidth
                      type="text"
                      name="codigo"
                      label="Código"
                      variant={estiloDeCampo}
                      inputRef={register}
                      placeholder="EX.: 3585-4"
                      InputLabelProps={{ shrink: true }}
                      inputProps={{ style: { textTransform: "uppercase" } }}
                      error={!!errors.codigo}
                      helperText={errors.codigo ? errors.codigo.message : ''}
                    />
                  </Grid>

                  <Grid item xs={12} sm={9} >
                    <TextField
                      fullWidth
                      type="text"
                      name="nome"
                      label="Nome"
                      variant={estiloDeCampo}
                      inputRef={register}
                      placeholder="EX.: AG. CENTRAL"
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
                onClick={() => {
                  setNomeBanco('');
                  reset(valoresIniciais);
                }}
                className={css.formBotaoDeAcao}
              > Limpar
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>

      <ModalPesquisa
        abrir={abrirModal}
        setAbrir={setAbrirModal}
        titulo='Banco'
        subtitulo='Pesquisa de banco'
        className={css.root}
      >
        <MyTablePesquisa
          colunas={colunasTabPesquisa}
          dados={dadosPesquisa}
          selecionarLinhas={false}
          exportar={false}
          ocultarEditar={true}
          ocultarExcluir={true}
        />
      </ModalPesquisa>

    </div>
  );
}

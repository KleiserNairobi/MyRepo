import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { 
  Avatar, Button, Card, CardContent, CardHeader, Divider, Grid, TextField, IconButton 
} from '@material-ui/core';
import { ArrowBack, RecentActors, YoutubeSearchedFor } from '@material-ui/icons';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers';
import CabecalhoForm from '../../components/CabecalhoForm';
import ModalPesquisa from '../../components/ModalPesquisa';
import MyTablePesquisa from '../../components/MyTablePesquisa';
import * as service from '../../services/HabilitacaoService';
import { useAlerta } from '../../contexts/AlertaCtx';
import { useGeral } from '../../contexts/GeralCtx';
import PageCss from '../PagesCss';
import schema from './HabilitacaoSch';
import { TIPO_ERRO, TIPO_SUCESSO } from '../../utils/global';
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import format from "date-fns/format";
import ptBrLocale from "date-fns/locale/pt-BR";


class LocalizedUtils extends DateFnsUtils {
  getDatePickerHeaderText(date) {
    return format(date, "d MMM yyyy", { locale: this.locale });
  }
}

export default function HabilitacaoForm() {

  const css = PageCss();
  const history = useHistory();
  const { setConteudo } = useAlerta();
  const [abrirModalPessoa, setAbrirModalPessoa] = useState(false);
  const [nomePessoa, setNomePessoa] = useState('');
  const [dadosPesquisaPessoa, setDadosPesquisaPessoa] = useState();
  const { 
    id, auxId, setAuxId, alterar, setAlterar, setCarregar, estiloDeCampo, buscarDados, setBuscarDados
  } = useGeral();

  const valoresIniciais = { 
    pessoa: {id: null}, 
    registro: '',
    categoria: '',
    localExpedicao: '',
    validade: null,
    dataEmissao: null,
    primeiraHabilitacao: null
  };

  const { register, handleSubmit, errors, reset, setValue, control } = useForm({
    mode: 'all',
    defaultValues: valoresIniciais,
    resolver: yupResolver(schema)
  });

  const colunasTabPesqPessoa = [
    { title: 'ID', field: 'id', width: 20 },
    { title: 'Tipo', field: 'tipo', width: 20 },
    { title: 'Nome', field: 'nome', width: 150 },
    { title: 'E-Mail', field: 'email', width: 150 },
    { title: 'Telefone', field: 'telefone', width: 40 },
  ]

  // Abre modal para escolha da pessoa - membro
  function carregaDadosPessoa() {
    setAbrirModalPessoa(true);
    service.obtem('/pessoas?campos=id,tipo,nome,email,telefone')
    .then(response => {
      setDadosPesquisaPessoa(response.data);
    })
    .catch(erro => {
      setConteudo({
        tipo: TIPO_ERRO,
        descricao: erro.response.data.detalhe,
        exibir: true
      });
    })
  }

  // Busca dados da pessoa - quando ocorre onBlur
  async function onBlurPessoa(ev) {
    if (ev.target.value === '') {
      setNomePessoa('');
    } else {
      const codigo = ev.target.value;
      try {
        const { data } = await service.obtem(`/pessoas/${codigo}?campos=nome`);
        if (data) {
          setValue('pessoa.id', codigo);
          setNomePessoa(data.nome);
        }
      } catch (error) {
        setNomePessoa('');
        setConteudo({
          tipo: TIPO_ERRO,
          descricao: error.response.data.detalhe,
          exibir: true
        });
      }
    }
  }

  // Effect para buscar dados da pessoa - sem ter disparado onBlur
  useEffect(() => {
    if (buscarDados) {
      async function getUnico() {
        try {
          const { data } = await service.obtem(`/pessoas/${auxId}?campos=nome`);
          if (data) {
            setValue('pessoa.id', auxId);
            setNomePessoa(data.nome);
            setAuxId(-1);
          }
        } catch (error) {
          setValue('pessoa.id', null);
          setNomePessoa('');
          setAuxId(-1);
          setConteudo({
            tipo: TIPO_ERRO,
            descricao: 'Ocorreu um erro ao buscar os dados do membro',
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

  useEffect(() => {
    if (alterar) {
      async function buscaDado() {
        try {
          const resposta = await service.obtem(`/habilitacoes/${id}`);
          if (resposta.data) {
            setValue('pessoa.id', resposta.data.pessoa.id);
            setValue('registro', resposta.data.registro);
            setValue('categoria', resposta.data.categoria);
            setValue('localExpedicao', resposta.data.localExpedicao);
            setValue('validade', resposta.data.validade);
            setValue('dataEmissao', resposta.data.dataEmissao);
            setValue('primeiraHabilitacao', resposta.data.primeiraHabilitacao);
            setNomePessoa(resposta.data.pessoa.nome);
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
          const resposta = await service.altera(`/habilitacoes/${id}`, data);
          if (resposta) {
            setConteudo({
              tipo: TIPO_SUCESSO,
              descricao: 'Registro alterado com sucesso!',
              exibir: true
            });
          }
          setAlterar(false);
          setCarregar(true);
          history.push('/habilitacoes');
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
          const resposta = await service.insere('/habilitacoes', data);
          if (resposta) {
            setConteudo({
              tipo: TIPO_SUCESSO,
              descricao: 'Registro inserido com sucesso!',
              exibir: true
            });
          }
          reset(valoresIniciais);
          setNomePessoa('');
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
        titulo="Habilitação"
        subtitulo="Adição de novo registro"
        linkPagina="/habilitacoes"
        icone={<ArrowBack />}
        tituloBotao="Retornar"
      />

      <form onSubmit={handleSubmit( submitForm )}>
        <Card variant="outlined">
          <CardContent>
            <Card>
              <CardHeader
                avatar={<Avatar className={css.avatar}><RecentActors /></Avatar>}
                title="Habilitação"
                subheader="Informe os dados da habilitação"
                className={css.cartaoTitulo}
              />
              <CardContent>
                <Grid container direction="row" spacing={2}>

                  <Grid item xs={12} sm={2} >
                    <TextField
                      fullWidth
                      type="number"
                      name="pessoa.id"
                      label="Membro"
                      variant={estiloDeCampo}
                      inputRef={register}
                      placeholder="EX.: 1"
                      InputLabelProps={{ shrink: true }}
                      error={!!errors.pessoa}
                      helperText={errors.pessoa ? errors.pessoa.id.message : ''}
                      InputProps={{
                        onBlur: (ev) => onBlurPessoa(ev),
                        endAdornment: 
                          <IconButton
                            size="small"
                            onClick={() => carregaDadosPessoa()}
                          >
                            <YoutubeSearchedFor fontSize="small" />
                          </IconButton>
                      }}
                    />
                  </Grid>

                  <Grid item xs={12} sm={10} >
                    <TextField
                      fullWidth
                      type="text"
                      name="nomePessoa"
                      label="Nome do Membro"
                      variant={estiloDeCampo}
                      value={nomePessoa}
                      placeholder=""
                      InputLabelProps={{ shrink: true }}
                      inputProps={{ style: { textTransform: "uppercase" } }}
                    />
                  </Grid>

                  <Grid item xs={12} sm={3}>
                    <TextField
                      fullWidth
                      type="text"
                      name="registro"
                      label="Registro"
                      variant={estiloDeCampo}
                      inputRef={register}
                      placeholder=""
                      InputLabelProps={{ shrink: true }}
                      inputProps={{ style: { textTransform: "uppercase" } }}
                      error={!!errors.registro}
                      helperText={errors.registro ? errors.registro.message : ''}
                    />
                  </Grid>

                  <Grid item xs={12} sm={3}>
                    <TextField
                      fullWidth
                      type="text"
                      name="categoria"
                      label="Categoria"
                      variant={estiloDeCampo}
                      inputRef={register}
                      placeholder=""
                      InputLabelProps={{ shrink: true }}
                      inputProps={{ style: { textTransform: "uppercase" } }}
                      error={!!errors.categoria}
                      helperText={errors.categoria ? errors.categoria.message : ''}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      type="text"
                      name="localExpedicao"
                      label="Local de Expedição"
                      variant={estiloDeCampo}
                      inputRef={register}
                      placeholder=""
                      InputLabelProps={{ shrink: true }}
                      inputProps={{ style: { textTransform: "uppercase" } }}
                      error={!!errors.localExpedicao}
                      helperText={errors.localExpedicao ? errors.localExpedicao.message : ''}
                    />
                  </Grid>

                  <Grid item xs={12} sm={4}>
                    <MuiPickersUtilsProvider utils={LocalizedUtils} locale={ptBrLocale} >                  
                      <Controller
                        name="validade"
                        control={control}
                        as={                   
                          <KeyboardDatePicker
                            autoOk
                            fullWidth                            
                            name="validade"
                            label="Validade"
                            format="dd/MM/yyyy"                       
                            cancelLabel="Cancelar"                        
                            variant={estiloDeCampo}
                            placeholder="dd/mm/aaaa"
                            InputLabelProps={{ shrink: true }}
                            error={!!errors.validade}
                            helperText={errors.validade ? errors.validade.message : ''}
                          />
                        }                      
                      />
                    </MuiPickersUtilsProvider>
                  </Grid>

                  <Grid item xs={12} sm={4}>
                    <MuiPickersUtilsProvider utils={LocalizedUtils} locale={ptBrLocale} >                  
                      <Controller
                        name="dataEmissao"
                        control={control}
                        as={                   
                          <KeyboardDatePicker
                            autoOk
                            fullWidth                            
                            name="dataEmissao"
                            label="Data de Emissão"
                            format="dd/MM/yyyy"                       
                            cancelLabel="Cancelar"                        
                            variant={estiloDeCampo}
                            placeholder="dd/mm/aaaa"
                            InputLabelProps={{ shrink: true }}
                            error={!!errors.dataEmissao}
                            helperText={errors.dataEmissao ? errors.dataEmissao.message : ''}
                          />
                        }                      
                      />
                    </MuiPickersUtilsProvider>
                  </Grid>

                  <Grid item xs={12} sm={4}>
                    <MuiPickersUtilsProvider utils={LocalizedUtils} locale={ptBrLocale} >                  
                      <Controller
                        name="primeiraHabilitacao"
                        control={control}
                        as={                   
                          <KeyboardDatePicker
                            autoOk
                            fullWidth                            
                            name="primeiraHabilitacao"
                            label="Primeira Habilitação"
                            format="dd/MM/yyyy"                       
                            cancelLabel="Cancelar"                        
                            variant={estiloDeCampo}
                            placeholder="dd/mm/aaaa"
                            InputLabelProps={{ shrink: true }}
                            error={!!errors.primeiraHabilitacao}
                            helperText={errors.primeiraHabilitacao ? errors.primeiraHabilitacao.message : ''}
                          />
                        }                      
                      />
                    </MuiPickersUtilsProvider>
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
                  reset(valoresIniciais);
                  setNomePessoa('');               
                }}
                className={css.formBotaoDeAcao}
              > Limpar
              </Button>
            </div>
            
          </CardContent>
        </Card>
      </form>

      <ModalPesquisa
        abrir={abrirModalPessoa}
        setAbrir={setAbrirModalPessoa}
        titulo='Membro'
        subtitulo='Pesquisa de membro'
        className={css.root}
      >
        <MyTablePesquisa
          colunas={colunasTabPesqPessoa}
          dados={dadosPesquisaPessoa}
          selecionarLinhas={false}
          exportar={false}
          ocultarEditar={true}
          ocultarExcluir={true}
        />
      </ModalPesquisa>

    </div>
  );
}


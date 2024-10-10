import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { 
  Avatar, Button, Card, CardContent, CardHeader, Divider, Grid, IconButton, TextField 
} from '@material-ui/core';
import { ArrowBack, PostAdd, YoutubeSearchedFor } from '@material-ui/icons';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers';
import ReactInputMask from 'react-input-mask';
import CabecalhoForm from '../../components/CabecalhoForm';
import * as service from '../../services/TarifaAdicionalService';
import { useAlerta } from '../../contexts/AlertaCtx';
import { useGeral } from '../../contexts/GeralCtx';
import PageCss from '../PagesCss';
import schema from './TarifaAdicionalSch';
import { TIPO_ERRO, TIPO_SUCESSO } from '../../utils/global';
import ModalPesquisa from '../../components/ModalPesquisa';
import MyTablePesquisa from '../../components/MyTablePesquisa';
import MyTFMoneyNumberFormat from '../../components/MyTFMoneyNumberFormat';



export default function TarifaAdicionalForm() {

  const css = PageCss();
  const history = useHistory();
  const valoresIniciais = { tabelaPreco: {id: null}, horaInicio: '', horaFim: '', tarifaAdicional: '' };
  const { register, handleSubmit, errors, reset, setValue, control } = useForm({
    mode: 'all',
    defaultValues: valoresIniciais,
    resolver: yupResolver(schema)
  });
  const { setConteudo } = useAlerta();
  const { id, auxId, setAuxId, alterar, setAlterar, setCarregar, estiloDeCampo, buscarDados, setBuscarDados } = useGeral();
  const [descTabela, setDescTabela] = useState('');
  const [abrirModal, setAbrirModal] = useState(false);
  const [dadosPesquisa, setDadosPesquisa] = useState();
  const [horaInicio, setHoraInicio] = useState('');
  const [horaFim, setHoraFim] = useState('');
  const [tarifaAdicional, setTarifaAdicional] = useState('');

  const colunasTabPesquisa = [
    { title: 'ID', field: 'id', width: 10 },
    { title: 'Tipo Veículo', field: 'tipoVeiculo', width: 30 },
    { title: 'Descrição', field: 'descricao', width: 300 },
    { title: 'início Validade', field: 'validadeInicio', type: 'date', width: 60 },
    { title: 'Fim Validade', field: 'validadeFim', type: 'date', width: 60 },
  ]

  // Effect para buscar dados da tarifa adicional - relativo a alteração
  useEffect(() => {
    if (alterar) {
      async function buscaDado() {
        try {
          const resposta = await service.obtem(`/tabela-preco-itens/${id}?campos=tabelaPreco.id,tabelaPreco.descricao,horaInicio,horaFim,tarifaAdicional`);
          if (resposta.data) {
            setValue('tabelaPreco.id', resposta.data.tabelaPreco.id);
            setValue('horaInicio', resposta.data.horaInicio);
            setValue('horaFim', resposta.data.horaFim);
            setValue('tarifaAdicional', resposta.data.tarifaAdicional);
            setDescTabela(resposta.data.tabelaPreco.descricao);
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

  // Effect para buscar dados da tabela de preco - sem ter disparado onBlur
  useEffect(() => {
    if (buscarDados) {
      async function getUnico() {
        try {
          const { data } = await service.obtem(`/tabela-precos/${auxId}?campos=descricao`);
          if (data) {
            setValue('tabelaPreco.id', auxId);
            setDescTabela(data.descricao);
            setAuxId(-1);
          }
        } catch (error) {
          setValue('tabelaPreco.id', null);
          setDescTabela('');
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
  
  // Abre modal para escolha da tabela de preço
  function carregaDadosTabPreco() {    
    setAbrirModal(true);
    service.obtem('/tabela-precos?campos=id,tipoVeiculo,descricao,validadeInicio,validadeFim')
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

  // Busca dados da tabela de preço - quando ocorre onBlur
  async function onBlurTabPreco(ev) {
    if (ev.target.value === '') {
      setDescTabela('');
    } else {
      const idTabela = ev.target.value;
      try {
        const { data } = await service.obtem(`/tabela-precos/${idTabela}?campos=descricao`);
        if (data) {
          setValue('tabelaPreco.id', idTabela);
          setDescTabela(data.descricao);
        }
      } catch (error) {
        setDescTabela('');
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
          const resposta = await service.altera(`/tabela-preco-itens/${id}`, data);
          if (resposta) {
            setConteudo({
              tipo: TIPO_SUCESSO,
              descricao: 'Registro alterado com sucesso!',
              exibir: true
            });
          }
          setAlterar(false);
          setCarregar(true);
          history.push('/tarifas-adicionais');
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
          const resposta = await service.insere('/tabela-preco-itens', data);
          if (resposta) {
            setConteudo({
              tipo: TIPO_SUCESSO,
              descricao: 'Registro inserido com sucesso!',
              exibir: true
            });
          }
          reset(valoresIniciais);
          setDescTabela('');
          setHoraInicio('');
          setHoraFim('');
          setTarifaAdicional('');          
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
        titulo="Tarifa Adicional"
        subtitulo="Adição de novo registro"
        linkPagina="/tarifas-adicionais"
        icone={<ArrowBack />}
        tituloBotao="Retornar"
      />

      <form onSubmit={handleSubmit( submitForm )}>
        <Card variant="outlined">
          <CardContent>
            <Card>
              <CardHeader
                avatar={<Avatar className={css.avatar}><PostAdd /></Avatar>}
                title="Tarifa Adicional"
                subheader="Informe os dados da tarifa adicional"
                className={css.cartaoTitulo}
              />
              <CardContent>
                <Grid container direction="row" spacing={2}>
                  
                  <Grid item xs={12} sm={3}>
                    <TextField
                      fullWidth
                      type="number"
                      name="tabelaPreco.id"
                      label="Tabela de Preço"
                      variant={estiloDeCampo}
                      inputRef={register}
                      placeholder="EX.: 1"
                      InputLabelProps={{ shrink: true }}
                      error={!!errors.tabelaPreco}
                      helperText={errors.tabelaPreco ? errors.tabelaPreco.id.message : ''}
                      InputProps={{
                        onBlur: (ev) => onBlurTabPreco(ev),
                        endAdornment: 
                        <IconButton size="small" onClick={() => carregaDadosTabPreco()}>
                          <YoutubeSearchedFor fontSize="small" />
                        </IconButton>
                      }}
                    />
                  </Grid>
                  
                  <Grid item xs={12} sm={9}>
                    <TextField
                      fullWidth
                      type="text"
                      name="descTabela"
                      label="Descrição Tabela"
                      variant={estiloDeCampo}
                      value={descTabela}
                      placeholder="EX.: TAB. PADRÃO BIKE"
                      InputLabelProps={{ shrink: true }}
                      inputProps={{ style: { textTransform: "uppercase" } }}
                    />
                  </Grid>

                  <Grid item xs={12} sm={4}>
                    <Controller
                      name="horaInicio"
                      control={control}
                      render={({ onChange, onBlur, value }) => (
                        <ReactInputMask
                          mask="99:99"
                          maskChar=" "
                          disabled={false}
                          value={horaInicio}
                          onChange={(ev) => {
                            setHoraInicio(ev.target.value);
                            setValue("horaInicio", ev.target.value)
                          }}
                        >
                        {(inputProps) =>
                          <TextField
                            {...inputProps}
                            fullWidth
                            type="text"
                            label="Hora Inicial"
                            variant={estiloDeCampo}
                            placeholder="00:00"
                            InputLabelProps={{ shrink: true }}
                            error={!!errors.horaInicio}
                            helperText={errors.horaInicio ? errors.horaInicio.message : ''}
                          />
                        }
                        </ReactInputMask>
                      )}
                    />
                  </Grid>

                  <Grid item xs={12} sm={4}>
                    <Controller
                      name="horaFim"
                      control={control}
                      render={({ onChange, onBlur, value }) => (
                        <ReactInputMask
                          mask="99:99"
                          maskChar=" "
                          disabled={false}
                          value={horaFim}
                          onChange={(ev) => {
                            setHoraFim(ev.target.value);
                            setValue("horaFim", ev.target.value)
                          }}
                        >
                        {(inputProps) =>
                          <TextField
                            {...inputProps}
                            fullWidth
                            type="text"
                            label="Hora Final"
                            variant={estiloDeCampo}
                            placeholder="00:00"
                            InputLabelProps={{ shrink: true }}
                            error={!!errors.horaFim}
                            helperText={errors.horaFim ? errors.horaFim.message : ''}
                          />
                        }
                        </ReactInputMask>
                      )}
                    />
                  </Grid>

                  <Grid item xs={12} sm={4}>
                    <TextField
                      fullWidth
                      name="tarifaAdicional"
                      label="Tarifa Adicional"
                      variant={estiloDeCampo}
                      placeholder="R$ 0,00"
                      inputRef={register}
                      value={tarifaAdicional}
                      onChange={(ev)=>setTarifaAdicional(ev.target.value) }
                      InputLabelProps={{ shrink: true }}
                      InputProps={{inputComponent: MyTFMoneyNumberFormat } }
                      error={!!errors.tarifaAdicional}
                      helperText={errors.tarifaAdicional ? errors.tarifaAdicional.message : ''}
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
                  reset(valoresIniciais);
                  setDescTabela('');
                  setHoraInicio('');
                  setHoraFim('');
                  setTarifaAdicional('');
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
        titulo='Tabelas de Preços'
        subtitulo='Pesquisa tabelas de preços'
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


import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import {
  Avatar, Button, Card, CardContent, CardHeader, Divider, Grid, TextField, IconButton, MenuItem
} from '@material-ui/core';
import { ArrowBack, Inbox, YoutubeSearchedFor } from '@material-ui/icons';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers';
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import { format } from "date-fns";
import ptBrLocale from "date-fns/locale/pt-BR";
import CabecalhoForm from '../../components/CabecalhoForm';
import MyTFMoneyNumberFormat from '../../components/MyTFMoneyNumberFormat';
import * as service from '../../services/FluxoCaixaService';
import { useAlerta } from '../../contexts/AlertaCtx';
import { useGeral } from '../../contexts/GeralCtx';
import PageCss from '../PagesCss';
import schema from './FluxoCaixaSch';
import { TIPO_ERRO, TIPO_SUCESSO } from '../../utils/global';
import ModalPesquisa from '../../components/ModalPesquisa';
import MyTablePesquisa from '../../components/MyTablePesquisa';



class LocalizedUtils extends DateFnsUtils {
  getDatePickerHeaderText(date) {
    return format(date, "d MMM yyyy", { locale: this.locale });
  }
}

export default function FluxoCaixaForm() {

  const css = PageCss();
  const history = useHistory();
  const [nomeConta, setNomeConta] = useState('');
  const [saldoAnterior, setSaldoAnterior] = useState('');
  const [movimentoRecebimento, setMovimentoRecebimento] = useState('');
  const [movimentoPagamento, setMovimentoPagamento] = useState('');
  const [saldoAtual, setSaldoAtual] = useState('');
  const [saldoDisponivel, setSaldoDisponivel] = useState('');
  const [exibirValores] = useState(false);
  const [abrirModal, setAbrirModal] = useState(false);
  const [dadosPesquisa, setDadosPesquisa] = useState();
  const { setConteudo } = useAlerta();
  const {
    id, alterar, setAlterar, setCarregar, estiloDeCampo,
    buscarDados, setBuscarDados, auxId, setAuxId
  } = useGeral();

  const valoresIniciais = {
    conta: { id: null },
    nome: '',
    tipoContaCaixa: 'X',
    mes: null,
    ano: null,
    dataFechamento: null,
    saldoAnterior: null,
    movimentoRecebimento: null,
    movimentoPagamento: null,
    saldoAtual: null,
    saldoDisponivel: null,
  };

  const { register, handleSubmit, errors, reset, setValue, control } = useForm({
    mode: 'all',
    defaultValues: valoresIniciais,
    resolver: yupResolver(schema)
  });

  const colunasTabPesquisa = [
    { title: 'ID', field: 'id', width: 10 },
    { title: 'Membro', field: 'pessoa.nome', width: 100 },
    { title: 'Tipo Conta', field: 'tipoConta', width: 20 },
    { title: 'Agência', field: 'agencia.codigo', width: 20 },
    { title: 'Conta', field: 'codigo', width: 20 },
    { title: 'Ativo', field: 'ativo', width: 20, type: 'boolean' },
  ]

  // Abre modal para escolha da conta
  function carregaDadosConta() {
    setAbrirModal(true);
    service.obtem('/contas')
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

  // Busca dados da conta - quando ocorre onBlur
  async function onBlurConta(ev) {
    if (ev.target.value === '') {
      setNomeConta('');
    } else {
      const id = ev.target.value;
      try {
        const { data } = await service.obtem(`/contas/${id}?campos=agencia.codigo,codigo,tipoConta`);
        if (data) {
          setValue('conta.id', id);
          setNomeConta(`AGÊNCIA: ${data.agencia.codigo}, CONTA: ${data.codigo}, TIPO: ${data.tipoConta}`);
        }
      } catch (error) {
        setNomeConta('');
        setConteudo({
          tipo: TIPO_ERRO,
          descricao: error.response.data.detalhe,
          exibir: true
        });
      }
    }
  }

  // Effect para buscar dados da conta - sem ter disparado onBlur
  useEffect(() => {
    if (buscarDados) {
      async function getUnico() {
        try {
          const { data } = await service.obtem(`/contas/${auxId}?campos=agencia.codigo,codigo,tipoConta`);
          if (data) {
            setValue('conta.id', auxId);
            setNomeConta(`AGÊNCIA: ${data.agencia.codigo}, CONTA: ${data.codigo}, TIPO: ${data.tipoConta}`);
            setAuxId(-1);
          }
        } catch (error) {
          setValue('banco.id', null);
          setNomeConta('');
          setAuxId(-1);
          setConteudo({
            tipo: TIPO_ERRO,
            descricao: 'Ocorreu um erro ao buscar os dados da conta bancária',
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
          const resposta = await service.obtem(`/conta-caixas/${id}`);
          if (resposta.data) {
            setValue('conta.id', resposta.data.conta.id);
            setValue('nome', resposta.data.nome);
            setValue('tipoContaCaixa', resposta.data.tipoContaCaixa);
            setValue('mes', resposta.data.mes);
            setValue('ano', resposta.data.ano);
            setValue('dataFechamento', resposta.data.dataFechamento);
            setValue('saldoAnterior', resposta.data.saldoAnterior * 100);
            setValue('movimentoRecebimento', resposta.data.movimentoRecebimento);
            setValue('movimentoPagamento', resposta.data.movimentoPagamento);
            setValue('saldoAtual', resposta.data.saldoAtual);
            setValue('saldoDisponivel', resposta.data.saldoDisponivel);

            setSaldoAnterior(resposta.data.saldoAnterior * 100);
            setNomeConta(
              `AGÊNCIA: ${resposta.data.conta.agencia.codigo}, ` + 
              `CONTA: ${resposta.data.conta.codigo}, ` +
              `TIPO: ${resposta.data.conta.tipoConta}`
            );
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
          const resposta = await service.altera(`/conta-caixas/${id}`, data);
          if (resposta) {
            setConteudo({
              tipo: TIPO_SUCESSO,
              descricao: 'Registro alterado com sucesso!',
              exibir: true
            });
          }
          setAlterar(false);
          setCarregar(true);
          history.push('/fluxo-caixas');
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
          const resposta = await service.insere('/conta-caixas', data);
          if (resposta) {
            setConteudo({
              tipo: TIPO_SUCESSO,
              descricao: 'Registro inserido com sucesso!',
              exibir: true
            });
          }
          reset(valoresIniciais);
          setNomeConta('');
          setSaldoAnterior('');
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
        titulo="Fluxo de Caixa"
        subtitulo="Adição de novo registro"
        linkPagina="/fluxo-caixas"
        icone={<ArrowBack />}
        tituloBotao="Retornar"
      />

      <form onSubmit={handleSubmit( submitForm )}>
        <Card variant="outlined">
          <CardContent>
            <Card>
              <CardHeader
                avatar={<Avatar className={css.avatar}><Inbox /></Avatar>}
                title="Fluxo Caixa"
                subheader="Informe os dados do fluxo de caixa"
                className={css.cartaoTitulo}
              />
              <CardContent>
                <Grid container direction="row" spacing={2}>

                  <Grid item xs={12} sm={3} >
                    <TextField
                      fullWidth
                      type="number"
                      name="conta.id"
                      label="Conta"
                      variant={estiloDeCampo}
                      inputRef={register}
                      placeholder="EX.: 1"
                      InputLabelProps={{ shrink: true }}
                      error={!!errors.conta}
                      helperText={errors.conta ? errors.conta.id.message : ''}
                      InputProps={{
                        onBlur: (ev) => onBlurConta(ev),
                        endAdornment:
                          <IconButton
                            size="small"
                            onClick={() => carregaDadosConta()}
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
                      name="nomeConta"
                      label="Dados da Conta"
                      variant={estiloDeCampo}
                      value={nomeConta}
                      placeholder="EX.: AGÊNCIA: 5678-9, CONTA: 4871-2"
                      InputLabelProps={{ shrink: true }}
                      inputProps={{ style: { textTransform: "uppercase" } }}
                    />
                  </Grid>

                  <Grid item xs={12} sm={12}>
                    <TextField
                      fullWidth
                      type="text"
                      name="nome"
                      label="Nome"
                      variant={estiloDeCampo}
                      placeholder="EX.: CX INTERNO"
                      inputRef={register}
                      InputLabelProps={{ shrink: true }}
                      inputProps={{ style: { textTransform: "uppercase" } }}
                      error={!!errors.nome}
                      helperText={errors.nome ? errors.nome.message : ''}
                    />
                  </Grid>

                  <Grid item xs={12} sm={12} md={3}>
                    <Controller
                      name="tipoContaCaixa"
                      control={control}
                      as={
                        <TextField
                          select
                          fullWidth
                          label="Tipo de Conta"
                          variant={estiloDeCampo}
                          InputLabelProps={{ shrink: true }}
                          error={!!errors.tipoConta}
                          helperText={errors.tipoConta ? errors.tipoConta.message : ''}
                        >
                          <MenuItem key="X" value={'X'}>CAIXA INTERNO</MenuItem>
                          <MenuItem key="C" value={'C'}>CORRENTE</MenuItem>
                          <MenuItem key="P" value={'P'}>POUPANÇA</MenuItem>
                          <MenuItem key="I" value={'I'}>INVESTIMENTO</MenuItem>
                        </TextField>
                      }
                    />
                  </Grid>

                  <Grid item xs={12} sm={3} md={2}>
                    <TextField
                      fullWidth
                      type="number"
                      name="mes"
                      label="Mês"
                      variant={estiloDeCampo}
                      placeholder="10"
                      inputRef={register}
                      InputLabelProps={{ shrink: true }}
                      inputProps={{ style: { textTransform: "uppercase" } }}
                      error={!!errors.mes}
                      helperText={errors.mes ? errors.mes.message : ''}
                    />
                  </Grid>

                  <Grid item xs={12} sm={3} md={2}>
                    <TextField
                      fullWidth
                      type="number"
                      name="ano"
                      label="Ano"
                      variant={estiloDeCampo}
                      placeholder="2020"
                      inputRef={register}
                      InputLabelProps={{ shrink: true }}
                      inputProps={{ style: { textTransform: "uppercase" } }}
                      error={!!errors.ano}
                      helperText={errors.ano ? errors.ano.message : ''}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6} md={5} >
                    <TextField
                      fullWidth
                      name="saldoAnterior"
                      label="Saldo Inicial"
                      variant={estiloDeCampo}
                      placeholder="R$ 0,00"
                      inputRef={register}
                      value={saldoAnterior}
                      onChange={(ev) => setSaldoAnterior(ev.target.value)}
                      InputLabelProps={{ shrink: true }}
                      InputProps={{ inputComponent: MyTFMoneyNumberFormat }}
                      error={!!errors.saldoAnterior}
                      helperText={errors.saldoAnterior ? errors.saldoAnterior.message : ''}
                    />
                  </Grid>

                  {exibirValores ? 
                    <div>

                      <Grid item xs={12} sm={6} md={3} >
                        <MuiPickersUtilsProvider utils={LocalizedUtils} locale={ptBrLocale} >
                          <Controller
                            name="dataFechamento"
                            control={control}
                            as={
                              <KeyboardDatePicker
                                autoOk
                                fullWidth
                                disabled
                                name="dataFechamento"
                                label="Data de Fechamento"
                                format="dd/MM/yyyy"
                                cancelLabel="Cancelar"
                                variant={estiloDeCampo}
                                placeholder="dd/mm/aaaa"
                                InputLabelProps={{ shrink: true }}
                                error={!!errors.dataFechamento}
                                helperText={errors.dataFechamento ? errors.dataFechamento.message : ''}
                              />
                            }
                          />
                        </MuiPickersUtilsProvider>
                      </Grid>

                      <Grid item xs={12} sm={6} md={3} >
                        <TextField
                          fullWidth
                          disabled
                          name="movimentoRecebimento"
                          label="Recebimentos"
                          variant={estiloDeCampo}
                          placeholder="R$ 0,00"
                          inputRef={register}
                          value={movimentoRecebimento}
                          onChange={(ev) => setMovimentoRecebimento(ev.target.value)}
                          InputLabelProps={{ shrink: true }}
                          InputProps={{ inputComponent: MyTFMoneyNumberFormat }}
                          error={!!errors.movimentoRecebimento}
                          helperText={errors.movimentoRecebimento ? errors.movimentoRecebimento.message : ''}
                        />
                      </Grid>

                      <Grid item xs={12} sm={6} md={3} >
                        <TextField
                          fullWidth
                          disabled
                          name="movimentoPagamento"
                          label="Pagamentos"
                          variant={estiloDeCampo}
                          placeholder="R$ 0,00"
                          inputRef={register}
                          value={movimentoPagamento}
                          onChange={(ev) => setMovimentoPagamento(ev.target.value)}
                          InputLabelProps={{ shrink: true }}
                          InputProps={{ inputComponent: MyTFMoneyNumberFormat }}
                          error={!!errors.movimentoPagamento}
                          helperText={errors.movimentoPagamento ? errors.movimentoPagamento.message : ''}
                        />
                      </Grid>

                      <Grid item xs={12} sm={6} md={3} >
                        <TextField
                          fullWidth
                          disabled
                          name="saldoAtual"
                          label="Saldo Atual"
                          variant={estiloDeCampo}
                          placeholder="R$ 0,00"
                          inputRef={register}
                          value={saldoAtual}
                          onChange={(ev) => setSaldoAtual(ev.target.value)}
                          InputLabelProps={{ shrink: true }}
                          InputProps={{ inputComponent: MyTFMoneyNumberFormat }}
                          error={!!errors.saldoAtual}
                          helperText={errors.saldoAtual ? errors.saldoAtual.message : ''}
                        />
                      </Grid>

                      <Grid item xs={12} sm={6} md={3} >
                        <TextField
                          fullWidth
                          disabled
                          name="saldoDisponivel"
                          label="Saldo Disponível"
                          variant={estiloDeCampo}
                          placeholder="R$ 0,00"
                          inputRef={register}
                          value={saldoDisponivel}
                          onChange={(ev) => setSaldoDisponivel(ev.target.value)}
                          InputLabelProps={{ shrink: true }}
                          InputProps={{ inputComponent: MyTFMoneyNumberFormat }}
                          error={!!errors.saldoDisponivel}
                          helperText={errors.saldoDisponivel ? errors.saldoDisponivel.message : ''}
                        />
                      </Grid>

                    </div>
                  : null
                  }
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
                  setNomeConta('');
                  setSaldoAnterior('');                
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
        titulo='Conta Bancária'
        subtitulo='Pesquisa de conta bancária'
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


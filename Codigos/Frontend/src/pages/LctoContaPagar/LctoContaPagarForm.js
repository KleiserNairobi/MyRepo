import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { 
  Avatar, Button, Card, CardContent, CardHeader, Divider, Grid, IconButton, MenuItem, TextField 
} from '@material-ui/core';
import { ArrowBack, Unarchive, YoutubeSearchedFor, DeviceHub } from '@material-ui/icons';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers';
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import {format, parseISO} from "date-fns";
import ptBrLocale from "date-fns/locale/pt-BR";
import CabecalhoForm from '../../components/CabecalhoForm';
import ModalPesquisa from '../../components/ModalPesquisa';
import MyTablePesquisa from '../../components/MyTablePesquisa';
import MyTable from '../../components/MyTable';
import MyTFMoneyNumberFormat from '../../components/MyTFMoneyNumberFormat';
import * as service from '../../services/LctoContaPagarService';
import { useAlerta } from '../../contexts/AlertaCtx';
import { useGeral } from '../../contexts/GeralCtx';
import PageCss from '../PagesCss';
import schema from './LctoContaPagarSch';
import { TIPO_ERRO, TIPO_SUCESSO } from '../../utils/global';



class LocalizedUtils extends DateFnsUtils {
  getDatePickerHeaderText(date) {
    return format(date, "d MMM yyyy", { locale: this.locale });
  }
}

export default function LctoContaPagarForm() {

  const css = PageCss();
  const history = useHistory();
  const { setConteudo } = useAlerta();
  const [exibeParcelas, setExibeParcelas] = useState(false);
  const [dadosParcelas, setDadosParcelas] = useState([]);

  const [nomePessoa, setNomePessoa] = useState('');
  const [abrirModalPessoa, setAbrirModalPessoa] = useState(false);  
  const [dadosPesquisaPessoa, setDadosPesquisaPessoa] = useState();
  
  const [codigoCategoria, setCodigoCategoria] = useState('');  
  const [nomeCategoria, setNomeCategoria] = useState('');  
  const [abrirModalCategoria, setAbrirModalCategoria] = useState(false);  
  const [dadosPesquisaCategoria, setDadosPesquisaCategoria] = useState();

  const [nomeMoeda, setNomeMoeda] = useState('');
  const [abrirModalMoeda, setAbrirModalMoeda] = useState(false);  
  const [dadosPesquisaMoeda, setDadosPesquisaMoeda] = useState();

  const [valorTotal, setValorTotal] = useState('');
  const [valorPagar, setValorPagar] = useState('');

  const { 
    id, auxId, setAuxId, buscarDados, setBuscarDados, alterar, 
    setAlterar, setCarregar, estiloDeCampo, auxValor, setAuxValor
  } = useGeral();
  
  const valoresIniciais = { 
    pessoa: {id: null},
    categoria: {id: null},
    moeda: {id: null},
    origem: '',
    documento: '',
    parcelas: 1,
    emissao: null,
    primeiroVcto: null,
    valorTotal: null,
    valorPagar: null,
    historico: '',
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

  const colunasTabPesqCategoria = [
    { title: 'ID', field: 'id', width: 20 },
    { title: 'Tipo', field: 'tipoCategoria', width: 40 },
    { title: 'Código', field: 'codigo', width: 80 },
    { title: 'Descrição', field: 'descricao', width: 250 },
  ]

  const colunasTabPesqMoeda = [
    { title: 'ID', field: 'id', width: 20 },
    { title: 'Descrição', field: 'descricao' },
  ]

  const colunasTabelaParcelas = [    
    { title: 'ID', field: 'id', width: 20 },
    { title: 'Data Emissão', field: 'dataEmissao', type: 'date' },
    { title: 'Data Vencimento', field: 'dataVencimento', type: 'date' },
    { title: 'Valor Parcela', field: 'valor', type: 'currency', 
      currencySetting: {
        locale: 'pt-BR', currencyCode:'BRL', 
        minimumFractionDigits: 2, maximumFractionDigits: 2
      },
    },
    { title: 'Valor Juros', field: 'valorJuro', type: 'currency', 
      currencySetting: {
        locale: 'pt-BR', currencyCode:'BRL', 
        minimumFractionDigits: 2, maximumFractionDigits: 2
      },
    },
    { title: 'Valor Multa', field: 'valorMulta', type: 'currency', 
      currencySetting: {
        locale: 'pt-BR', currencyCode:'BRL', 
        minimumFractionDigits: 2, maximumFractionDigits: 2
      },
    },
    { title: 'Valor Desconto', field: 'valorDesconto', type: 'currency', 
      currencySetting: {
        locale: 'pt-BR', currencyCode:'BRL', 
        minimumFractionDigits: 2, maximumFractionDigits: 2
      },
    },
    { title: 'Data Pagamento', field: 'dataPagamento', type: 'date' },
    { title: 'Valor Pago', field: 'valorPagamento', type: 'currency', 
      currencySetting: {
        locale: 'pt-BR', currencyCode:'BRL', 
        minimumFractionDigits: 2, maximumFractionDigits: 2
      },
    },
  ]

  // Effect para carregamento dos pagamentos
  useEffect(() => {
    if (alterar) {
      async function buscaDado() {
        try {
          const resposta = await service.obtem(`/contas-pagar/${id}`);
          if (resposta.data) {
            setValue('pessoa.id', resposta.data.pessoa.id);
            setValue('categoria.id', resposta.data.categoria.id);
            setValue('moeda.id', resposta.data.moeda.id);
            setValue('origem', resposta.data.origem);
            setValue('documento', resposta.data.documento);
            setValue('parcelas', resposta.data.parcelas);
            setValue('emissao', parseISO(resposta.data.emissao, 'dd-MM-yyyy'));
            setValue('primeiroVcto', parseISO(resposta.data.primeiroVcto, 'dd-MM-yyyy'));
            setValue('valorTotal', resposta.data.valorTotal * 100);
            setValue('ValorPagar', resposta.data.ValorPagar * 100);
            setValue('historico', resposta.data.historico);

            setNomePessoa(resposta.data.pessoa.nome);
            setCodigoCategoria(resposta.data.categoria.codigo);
            setNomeCategoria(resposta.data.categoria.descricao);
            setNomeMoeda(resposta.data.moeda.descricao);
            setValorTotal(resposta.data.valorTotal * 100);
            setValorPagar(resposta.data.valorPagar * 100);

            // pega as parcelas da conta
            service.obtem(`/parcelas-conta-pagar/${id}`)
            .then(response => {
              var lista = response.data.map(function (item) {
                return {
                  id: item.id,
                  dataEmissao: parseISO(item.dataEmissao,'dd-MM-yyyy'),
                  dataVencimento: parseISO(item.dataVencimento, 'dd-MM-yyyy'),
                  valor: item.valor,
                  valorJuro: item.valorjuro,
                  valormulta: item.valorMulta,
                  valorDesconto: item.valorDesconto,
                  dataPagamento: item.dataPagamento,
                  valorPagamento: item.valorPagamento
                }
              })
              setDadosParcelas(lista);
            })
            .catch(error => {
              setConteudo({
                tipo: TIPO_ERRO,
                descricao: error.response.data.detalhe,
                exibir: true
              });
            })
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
      setExibeParcelas(true);
      setAlterar(false);
    }
  }, [id, alterar, setAlterar, setExibeParcelas, setConteudo, setValue])

  // Abre modal para escolha da pessoa - membro
  function carregaDadosPessoa() {
    setAbrirModalPessoa(true);
    setAuxValor('pessoa');
    service.obtem('/pessoas?campos=id,tipo,nome,email,telefone')
    .then(response => {
      setDadosPesquisaPessoa(response.data);
    })
    .catch(erro => {
      setAuxValor('');
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
    if (buscarDados && auxValor === "pessoa") {
      async function getUnico() {
        try {
          const { data } = await service.obtem(`/pessoas/${auxId}?campos=nome`);
          if (data) {
            setValue('pessoa.id', auxId);
            setNomePessoa(data.nome);
            setAuxId(-1);
            setAuxValor('');
          }
        } catch (error) {
          setValue('pessoa.id', null);
          setNomePessoa('');
          setAuxId(-1);
          setAuxValor('');
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
  }, [auxId, setAuxId, auxValor, setAuxValor, setValue, buscarDados, setBuscarDados, setConteudo]);

  // Abre modal para escolha da categoria
  function carregaDadosCategoria() {
    setAbrirModalCategoria(true);
    setAuxValor('categoria');
    service.obtem('/categorias')
    .then(response => {
      setDadosPesquisaCategoria(response.data);
    })
    .catch(erro => {
      setAuxValor('');
      setConteudo({
        tipo: TIPO_ERRO,
        descricao: erro.response.data.detalhe,
        exibir: true
      });
    })
  }

  // Busca dados da categoria - quando ocorre onBlur
  async function onBlurCategoria(ev) {
    if (ev.target.value === '') {
      setNomeCategoria('');
    } else {
      const codigo = ev.target.value;
      try {
        const { data } = await service.obtem(`/categorias/${codigo}?campos=codigo,descricao`);
        if (data) {
          setValue('categoria.id', codigo);
          setCodigoCategoria(data.codigo);
          setNomeCategoria(data.descricao);
        }
      } catch (error) {
        setCodigoCategoria('');
        setNomeCategoria('');
        setConteudo({
          tipo: TIPO_ERRO,
          descricao: error.response.data.detalhe,
          exibir: true
        });
      }
    }
  }

  // Effect para buscar dados da categoria - sem ter disparado onBlur
  useEffect(() => {
    if (buscarDados && auxValor === "categoria") {
      async function getUnico() {
        try {
          const { data } = await service.obtem(`/categorias/${auxId}?campos=codigo,descricao`);
          if (data) {
            setValue('categoria.id', auxId);
            setCodigoCategoria(data.codigo);
            setNomeCategoria(data.descricao);
            setAuxId(-1);
            setAuxValor('');
          }
        } catch (error) {
          setValue('categoria.id', null);
          setCodigoCategoria('');
          setNomeCategoria('');
          setAuxId(-1);
          setAuxValor('');
          setConteudo({
            tipo: TIPO_ERRO,
            descricao: 'Ocorreu um erro ao buscar os dados da categoria',
            exibir: true
          });
        }
      }
      getUnico();
    }
    return () => {      
      setBuscarDados(false);
    }
  }, [auxId, setAuxId, auxValor, setAuxValor, setValue, buscarDados, setBuscarDados, setConteudo]);

  // Abre modal para escolha da moeda
  function carregaDadosMoeda() {
    setAbrirModalMoeda(true);
    setAuxValor('moeda');
    service.obtem('/moedas')
    .then(response => {
      setDadosPesquisaMoeda(response.data);
    })
    .catch(erro => {
      setAuxValor('');
      setConteudo({
        tipo: TIPO_ERRO,
        descricao: erro.response.data.detalhe,
        exibir: true
      });
    })
  }

  // Busca dados da moeda - quando ocorre onBlur
  async function onBlurMoeda(ev) {
    if (ev.target.value === '') {
      setNomeMoeda('');
    } else {
      const codigo = ev.target.value;
      try {
        const { data } = await service.obtem(`/moedas/${codigo}?campos=descricao`);
        if (data) {
          setValue('moeda.id', codigo);
          setNomeMoeda(data.descricao);
        }
      } catch (error) {
        setNomeMoeda('');
        setConteudo({
          tipo: TIPO_ERRO,
          descricao: error.response.data.detalhe,
          exibir: true
        });
      }
    }
  }

  // Effect para buscar dados da moeda - sem ter disparado onBlur
  useEffect(() => {
    if (buscarDados && auxValor === "moeda") {
      async function getUnico() {
        try {
          const { data } = await service.obtem(`/moedas/${auxId}?campos=descricao`);
          if (data) {
            setValue('moeda.id', auxId);
            setNomeMoeda(data.descricao);
            setAuxId(-1);
            setAuxValor('');
          }
        } catch (error) {
          setValue('moeda.id', null);
          setNomeMoeda('');
          setAuxId(-1);
          setAuxValor('');
          setConteudo({
            tipo: TIPO_ERRO,
            descricao: 'Ocorreu um erro ao buscar os dados da moeda',
            exibir: true
          });
        }
      }
      getUnico();
    }
    return () => {      
      setBuscarDados(false);
    }
  }, [auxId, setAuxId, auxValor, setAuxValor, setValue, buscarDados, setBuscarDados, setConteudo]);


  function submitForm(data) {
    if (alterar & id > 0) {
      async function alteraDado() {
        try {
          const resposta = await service.altera(`/contas-pagar/${id}`, data);
          if (resposta) {
            setConteudo({
              tipo: TIPO_SUCESSO,
              descricao: 'Registro alterado com sucesso!',
              exibir: true
            });
          }
          setAlterar(false);
          setCarregar(true);
          history.push('/lctoContaPagar');
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
          const resposta = await service.insere('/contas-pagar', data);
          if (resposta) {
            setConteudo({
              tipo: TIPO_SUCESSO,
              descricao: 'Registro inserido com sucesso!',
              exibir: true
            });
          }
          reset(valoresIniciais);
          setNomePessoa('');
          setCodigoCategoria('');
          setNomeCategoria('');
          setNomeMoeda('');
          setValorTotal('');
          setValorPagar('');
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
        titulo="Conta a Pagar"
        subtitulo="Adição de nova conta a pagar"
        linkPagina="/lctoContaPagar"
        icone={<ArrowBack />}
        tituloBotao="Retornar"
      />
      <br/>
      <form onSubmit={handleSubmit(submitForm)}>
        <Card variant="outlined" style={{marginBottom: '80px'}}>
          <CardContent>
            <Card>
              <CardHeader
                avatar={<Avatar className={css.avatar}><Unarchive /></Avatar>}
                title="Conta a Pagar"
                subheader="Informe os dados da conta a pagar"
                className={css.cartaoTitulo}
              />
              <CardContent>
                <Grid container direction="row" spacing={2}>

                  <Grid item xs={12} sm={3} >
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

                  <Grid item xs={12} sm={9} >
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
                  
                  <Grid item xs={12} sm={3} >
                    <TextField
                      fullWidth
                      type="number"
                      name="categoria.id"
                      label="Categoria"
                      variant={estiloDeCampo}
                      inputRef={register}
                      placeholder="EX.: 1"
                      InputLabelProps={{ shrink: true }}
                      error={!!errors.categoria}
                      helperText={errors.categoria ? errors.categoria.id.message : ''}
                      InputProps={{
                        onBlur: (ev) => onBlurCategoria(ev),
                        endAdornment: 
                          <IconButton
                            size="small"
                            onClick={() => carregaDadosCategoria()}
                          >
                            <YoutubeSearchedFor fontSize="small" />
                          </IconButton>
                      }}
                    />
                  </Grid>

                  <Grid item xs={12} sm={3} >
                    <TextField
                      fullWidth
                      type="text"
                      name="codigoCategoria"
                      label="Código"
                      variant={estiloDeCampo}
                      value={codigoCategoria}
                      placeholder=""
                      InputLabelProps={{ shrink: true }}
                      inputProps={{ style: { textTransform: "uppercase" } }}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6} >
                    <TextField
                      fullWidth
                      type="text"
                      name="nomeCategoria"
                      label="Descrição Categoria"
                      variant={estiloDeCampo}
                      value={nomeCategoria}
                      placeholder=""
                      InputLabelProps={{ shrink: true }}
                      inputProps={{ style: { textTransform: "uppercase" } }}
                    />
                  </Grid>

                  <Grid item xs={12} sm={3} >
                    <TextField
                      fullWidth
                      type="number"
                      name="moeda.id"
                      label="Moeda"
                      variant={estiloDeCampo}
                      inputRef={register}
                      placeholder="EX.: 1"
                      InputLabelProps={{ shrink: true }}
                      error={!!errors.moeda}
                      helperText={errors.moeda ? errors.moeda.id.message : ''}
                      InputProps={{
                        onBlur: (ev) => onBlurMoeda(ev),
                        endAdornment: 
                          <IconButton
                            size="small"
                            onClick={() => carregaDadosMoeda()}
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
                      name="nomeMoeda"
                      label="Descrição Moeda"
                      variant={estiloDeCampo}
                      value={nomeMoeda}
                      placeholder=""
                      InputLabelProps={{ shrink: true }}
                      inputProps={{ style: { textTransform: "uppercase" } }}
                    />
                  </Grid>

                  <Grid item xs={12} sm={4} md={3} >
                    <Controller
                      name="origem"
                      control={control}
                      as={
                        <TextField
                          select
                          fullWidth
                          label="Origem"
                          variant={estiloDeCampo}
                          placeholder=""
                          InputLabelProps={{ shrink: true }}
                          error={!!errors.origem}
                          helperText={errors.origem ? errors.origem.message : ''}
                        >
                          <MenuItem  key="E" value="E">ENTREGA</MenuItem>
                          <MenuItem  key="NF" value="NF">NOTA FISCAL</MenuItem>
                          <MenuItem  key="B" value="B">BOLETO</MenuItem>
                          <MenuItem  key="R" value="R">RECIBO</MenuItem>
                        </TextField>
                      }                      
                    />
                  </Grid>

                  <Grid item xs={12} sm={6} md={7} >
                    <TextField
                      fullWidth
                      type="text"
                      name="documento"
                      label="Documento"
                      variant={estiloDeCampo}
                      inputRef={register}
                      InputLabelProps={{ shrink: true }}
                      inputProps={{ style: { textTransform: "uppercase" } }}
                      error={!!errors.documento}
                      helperText={errors.documento ? errors.documento.message : ''}
                    />
                  </Grid>

                  <Grid item xs={12} sm={2} md={2} >
                    <TextField
                      fullWidth
                      type="number"
                      name="parcelas"
                      label="Parcelas"
                      variant={estiloDeCampo}
                      inputRef={register}
                      InputLabelProps={{ shrink: true }}
                      inputProps={{ style: { textTransform: "uppercase" } }}
                      error={!!errors.parcelas}
                      helperText={errors.parcelas ? errors.parcelas.message : ''}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6} md={3} >
                    <MuiPickersUtilsProvider utils={LocalizedUtils} locale={ptBrLocale} >                  
                      <Controller
                        name="emissao"
                        control={control}
                        as={                   
                          <KeyboardDatePicker
                            autoOk
                            fullWidth                            
                            name="emissao"
                            label="Data Emissão"
                            format="dd/MM/yyyy"                       
                            cancelLabel="Cancelar"                        
                            variant={estiloDeCampo}
                            placeholder="dd/mm/aaaa"
                            InputLabelProps={{ shrink: true }}
                            error={!!errors.emissao}
                            helperText={errors.emissao ? errors.emissao.message : ''}
                          />
                        }                      
                      />
                    </MuiPickersUtilsProvider>
                  </Grid>

                  <Grid item xs={12} sm={6} md={3} >
                    <MuiPickersUtilsProvider utils={LocalizedUtils} locale={ptBrLocale} >                  
                      <Controller
                        name="primeiroVcto"
                        control={control}
                        as={                   
                          <KeyboardDatePicker
                            autoOk
                            fullWidth                            
                            name="primeiroVcto"
                            label="Primeiro Vencimento"
                            format="dd/MM/yyyy"                       
                            cancelLabel="Cancelar"                        
                            variant={estiloDeCampo}
                            placeholder="dd/mm/aaaa"
                            InputLabelProps={{ shrink: true }}
                            error={!!errors.primeiroVcto}
                            helperText={errors.primeiroVcto ? errors.primeiroVcto.message : ''}
                          />
                        }                      
                      />
                    </MuiPickersUtilsProvider>
                  </Grid>

                  <Grid item xs={12} sm={6} md={3} >
                    <TextField
                      fullWidth
                      name="valorTotal"
                      label="Valor Total"
                      variant={estiloDeCampo}
                      placeholder="R$ 0,00"
                      inputRef={register}
                      value={valorTotal}
                      onChange={(ev)=>setValorTotal(ev.target.value) }
                      InputLabelProps={{ shrink: true }}
                      InputProps={{inputComponent: MyTFMoneyNumberFormat } }
                      error={!!errors.valorTotal}
                      helperText={errors.valorTotal ? errors.valorTotal.message : ''}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6} md={3} >
                    <TextField
                      fullWidth
                      name="valorPagar"
                      label="Valor Pagar"
                      variant={estiloDeCampo}
                      placeholder="R$ 0,00"
                      inputRef={register}
                      value={valorPagar}
                      onChange={(ev)=>setValorPagar(ev.target.value) }
                      InputLabelProps={{ shrink: true }}
                      InputProps={{inputComponent: MyTFMoneyNumberFormat } }
                      disabled
                    />
                  </Grid>

                  <Grid item xs={12} sm={12}>
                    <TextField
                      fullWidth
                      type="text"
                      name="historico"
                      label="Histórico"
                      variant={estiloDeCampo}
                      inputRef={register}
                      placeholder=""
                      InputLabelProps={{ shrink: true }}
                      inputProps={{ style: { textTransform: "uppercase" } }}
                      error={!!errors.historico}
                      helperText={errors.historico ? errors.historico.message : ''}
                    />
                  </Grid>

                </Grid>

                <br/>

                {exibeParcelas ?
                  <Card>
                    <CardHeader
                      avatar={<Avatar className={css.avatar}><DeviceHub /></Avatar>}
                      title="Parcelas da Conta a Pagar"
                      subheader="Listagem das parcelas da conta a pagar"
                      className={css.cartaoTitulo}
                    />
                    <MyTable
                      colunas={colunasTabelaParcelas}
                      dados={dadosParcelas}
                      selecionarLinhas={false}
                      exportar={false}
                    />
                  </Card>
                : null
                }
                
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
                  setCodigoCategoria('');
                  setNomeCategoria('');
                  setNomeMoeda('');
                  setValorTotal('');
                  setValorPagar('');
                }}
                className={css.formBotaoDeAcao}
              > Limpar
              </Button>
            </div>
            
          </CardContent>
        </Card>
      </form>

      {/** Modal pesquisa de membro */}
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

      {/** Modal pesquisa de categoria */}
      <ModalPesquisa
        abrir={abrirModalCategoria}
        setAbrir={setAbrirModalCategoria}
        titulo='Categoria'
        subtitulo='Pesquisa de categoria'
        className={css.root}
      >
        <MyTablePesquisa
          colunas={colunasTabPesqCategoria}
          dados={dadosPesquisaCategoria}
          selecionarLinhas={false}
          exportar={false}
          ocultarEditar={true}
          ocultarExcluir={true}
        />
      </ModalPesquisa>

      {/** Modal pesquisa de moeda */}
      <ModalPesquisa
        abrir={abrirModalMoeda}
        setAbrir={setAbrirModalMoeda}
        titulo='Moeda'
        subtitulo='Pesquisa de moeda'
        className={css.root}
      >
        <MyTablePesquisa
          colunas={colunasTabPesqMoeda}
          dados={dadosPesquisaMoeda}
          selecionarLinhas={false}
          exportar={false}
          ocultarEditar={true}
          ocultarExcluir={true}
        />
      </ModalPesquisa>

    </div>
  );
}


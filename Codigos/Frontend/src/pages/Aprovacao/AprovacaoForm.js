import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import {
  Avatar, Button, Card, CardContent, CardHeader, CircularProgress, Divider, Grid, MenuItem, TextField
} from '@material-ui/core';
import { ArrowBack, AssignmentInd, DriveEta, HomeWork, ImageSearch, RecentActors } from '@material-ui/icons';
import { KeyboardDatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import InputMask from 'react-input-mask';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers';
import MaterialTable from 'material-table';
import DateFnsUtils from '@date-io/date-fns';
import { format } from "date-fns";
import ptBrLocale from "date-fns/locale/pt-BR";
import CabecalhoForm from '../../components/CabecalhoForm';
import { useAlerta } from '../../contexts/AlertaCtx';
import { useGeral } from '../../contexts/GeralCtx';
import * as service from '../../services/AprovacaoService';
import { TIPO_ERRO, TIPO_SUCESSO } from '../../utils/global';
import PageCss from '../PagesCss';
import schema from './AprovacaoSch';


class LocalizedUtils extends DateFnsUtils {
  getDatePickerHeaderText(date) {
    return format(date, "d MMM yyyy", { locale: this.locale });
  }
}

export default function AprovacaoForm() {

  const css = PageCss();
  const history = useHistory();
  const { setConteudo } = useAlerta();
  const { id, alterar, setAlterar, setCarregar, estiloDeCampo } = useGeral();
  const [mascara, setMascara] = useState("(99)99999-9999");
  const [mascCpf] = useState('999.999.999-99');
  const [mascCnpj] = useState('99.999.999/9999-99');
  const [telefone, setTelefone] = useState('');
  const [cep, setCep] = useState('');
  const [cnpj, setCnpj] = useState('');
  const [fotos, setFotos] = useState([]);
  const [tipoPessoa, setTipoPessoa] = useState('');
  const [idPessoa, setIdPessoa] = useState('');
  const [nomePessoa, setNomePessoa] = useState('');
  const [idEndereco, setIdEndereco] = useState('');
  const [idVeiculo, setIdVeiculo] = useState('');
  const [idHabilitacao, setIdHabilitacao] = useState('');
  const [progresso, setProgresso] = useState(false);

  const valoresIniciais = { 
    pessoa: { id: null, nome: '' }, 
    statusAprovacao: '',
    tipoPessoa: '',
    nome: '',
    telefone: '',
    email: '',
    cpfcnpj: '',
    identidade: '',
    nascimento: null, 
    nomeFantasia: '',
    ramoAtividade: '',    
    cep: '',
    logradouro: '',
    numero: '',
    complemento: '',
    referencia: '',
    bairro: '',
    cidade: '',
    estado: '',    
    tipoVeiculo: '',
    modelo: '',
    renavan: '',
    placa: '',
    registro: '',
    categoria: '',
    localExpedicao: '',
    primeiraCNH: null,
    dataEmissao: null,
    validade: null,
  };
  
  const { register, handleSubmit, reset, setValue, errors, control } = useForm({
    mode: 'all',
    defaultValues: valoresIniciais,
    resolver: yupResolver(schema)
  });

  const colunasTabFotos = [
    { title: 'ID', field: 'id', width: 20, cellStyle: { fontSize: 12 } },
    { title: 'Membro', field: 'pessoa.id', width: 20, hidden: true, cellStyle: { fontSize: 12 } },
    { title: 'Tipo Foto', field: 'tipoFoto', width: 50, cellStyle: { fontSize: 12 } },
    { title: 'Nome Arquivo', field: 'nomeArquivo', width: 50, hidden: true, cellStyle: { fontSize: 12 } },
    { title: 'Descrição', field: 'descricao', width: 80, cellStyle: { fontSize: 12 } },
    { title: 'Tipo Conteúdo', field: 'tipoConteudo', width: 40, hidden: true, cellStyle: { fontSize: 12 } },
    { title: 'Tamanho', field: 'tamanho', width: 40, hidden: true, cellStyle: { fontSize: 12 } },
    { title: 'Link', field: 'link', width: 1000, cellStyle: { fontSize: 12 } },
  ]

  function onBlurCep(ev) {
    const cep = ev.target.value?.replace(/\D/g, '');
    if (cep?.length !== 8) {
      return;
    }
    service.obtem(`enderecos/buscar-endereco-por-cep/?cep=${cep}`)
    .then(response => {
      setValue('logradouro', response.data.logradouro);
      setValue('complemento', response.data.complemento);
      setValue('bairro', response.data.bairro);
      setValue('cidade', response.data.cidade);
      setValue('estado', response.data.estado);
    })
    .catch(erro => {
      setConteudo({
        tipo: TIPO_ERRO,
        descricao: erro.response.data.detalhe,
        exibir: true
      });
    })
  }

  useEffect(() => {
    if (alterar) {      
      async function buscaDado() {
        try {
          let idPessoa = null;
          const resposta = await service.obtem(`/aprovacoes/${id}?campos=pessoa.id,pessoa.nome,statusAprovacao`);
          if (resposta.data) {
            idPessoa = resposta.data.pessoa.id;
            setValue('statusAprovacao', resposta.data.statusAprovacao);
            setIdPessoa(resposta.data.pessoa.id);
            setNomePessoa(resposta.data.pessoa.nome);

            // Buscar as fotos 
            service.obtem(`/fotos/pessoa/${idPessoa}`)
            .then(response => {
              setFotos(response.data);
            })
            .catch(error => {
              setConteudo({
                tipo: TIPO_ERRO,
                descricao: error.response.data.detalhe,
                exibir: true
              });
            })

            // Buscar os dados pessoais
            service.obtem(`/pessoas/${idPessoa}`)
            .then(response => {
              if (response.data) {
                setValue('tipoPessoa', response.data.tipo);
                setValue('nome', response.data.nome);
                setValue('telefone', response.data.telefone);
                setValue('email', response.data.email);
                setValue('cpfcnpj', response.data.cpfcnpj);
                setValue('identidade', response.data.rg);
                setValue('nascimento', response.data.nascimento);
                setValue('nomeFantasia', response.data.nomeFantasia);
                setValue('ramoAtividade', response.data.ramoAtividade);
                setTipoPessoa(response.data.tipo);
                setTelefone(response.data.telefone);
              }
            })
            .catch(error => {
              setConteudo({
                tipo: TIPO_ERRO,
                descricao: error.response.data.detalhe,
                exibir: true
              });
            });

            // Buscar o endereço
            service.obtem(`/enderecos/proprio/${idPessoa}`)
            .then(response => {
              if (response.data) {
                setValue('cep', response.data.cep);
                setValue('logradouro', response.data.logradouro);
                setValue('numero', response.data.numero);
                setValue('complemento', response.data.complemento);
                setValue('referencia', response.data.referencia);
                setValue('bairro', response.data.bairro);
                setValue('cidade', response.data.municipio.nome);
                setValue('estado', response.data.municipio.estado.sigla);
                setIdEndereco(response.data.id);
                setCep(response.data.cep);
              }
            })
            .catch(error => {
              setConteudo({
                tipo: TIPO_ERRO,
                descricao: error.response.data.detalhe,
                exibir: true
              });
            });
            
            // Buscar os dados do veículo
            service.obtem(`/veiculos/pessoa/${idPessoa}/ativo`)
            .then(response => {
              if (response.data) {
                setValue('tipoVeiculo', response.data.tipo);
                setValue('modelo', response.data.modelo);
                setValue('renavan', response.data.renavan);
                setValue('placa', response.data.placa);
                setIdVeiculo(response.data.id);
              }
            })
            .catch(error => {
              setConteudo({
                tipo: TIPO_ERRO,
                descricao: error.response.data.detalhe,
                exibir: true
              });
            });

            // Buscar os dados da habilitação
            service.obtem(`/habilitacoes/pessoa/${idPessoa}`)
            .then(response => {
              if (response.data) {
                setValue('registro', response.data.registro);
                setValue('categoria', response.data.categoria);
                setValue('localExpedicao', response.data.localExpedicao);
                setValue('primeiraCNH', response.data.primeiraHabilitacao ? response.data.primeiraHabilitacao : null);
                setValue('dataEmissao', response.data.dataEmissao ? response.data.dataEmissao : null);
                setValue('validade', response.data.validade ? response.data.validade : null);
                setIdHabilitacao(response.data.id);
              }        
            })
            .catch(error => {
              setConteudo({
                tipo: TIPO_ERRO,
                descricao: error.response.data.detalhe,
                exibir: true
              });
            });
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
      setProgresso(true);
      service.garavaDadosPessoais(`/pessoas/${idPessoa}`, data)
      .catch(erro => {
        setConteudo({
          tipo: TIPO_ERRO,
          descricao: erro.response.data.detalhe,
          exibir: true
        });
      })
      service.garavaEndereco(`/enderecos/${idEndereco}`, data, idPessoa)
      .catch(erro => {
        setConteudo({
          tipo: TIPO_ERRO,
          descricao: erro.response.data.detalhe,
          exibir: true
        });
      })
      service.garavaVeiculo('/veiculos', data, idPessoa, idVeiculo)
      .catch(erro => {
        setConteudo({
          tipo: TIPO_ERRO,
          descricao: erro.response.data.detalhe,
          exibir: true
        });
      })
      service.garavaHabilitacao('/habilitacoes', data, idPessoa, idHabilitacao)
      .catch(erro => {
        setConteudo({
          tipo: TIPO_ERRO,
          descricao: erro.response.data.detalhe,
          exibir: true
        });
      })
      async function alteraDado() {
        try {
          const resposta = await service.altera(`/aprovacoes/altera-status/${id}`, data);
          if (resposta) {
            setConteudo({
              tipo: TIPO_SUCESSO,
              descricao: 'Registro alterado com sucesso!',
              exibir: true
            });

            setAlterar(false);
            setCarregar(true);
            setProgresso(false);
            history.push('/aprovacoes');  
          }
        } catch (error) {
          setProgresso(false);
          setConteudo({
            tipo: TIPO_ERRO,
            descricao: error.response.data.detalhe,
            exibir: true
          });
        }
      }
      alteraDado();
    }
  }

  return (
    <div>
      <CabecalhoForm
        titulo="Aprovação"
        subtitulo="Adição e/ou Edição de registro"
        linkPagina="/aprovacoes"
        icone={<ArrowBack />}
        tituloBotao="Retornar"
        exibirBotao={true}
      />
      <form onSubmit={handleSubmit(submitForm)}>
        <Card variant="outlined">
          <CardContent>
            {/* Status da aprovação */}
            <Card>
              <CardHeader
                avatar={<Avatar className={css.avatar}><AssignmentInd /></Avatar>}
                title="Aprovação"
                subheader="Informe o status da aprovação"
                className={css.cartaoTitulo}
              />
              <CardContent>
                <Grid container direction="row" spacing={2}>
                  <Grid item xs={12} sm={2}>
                    <TextField
                      fullWidth
                      disabled
                      type="number"
                      name="pessoa.id"
                      label="Membro"
                      variant={estiloDeCampo}
                      placeholder="EX.: 1"
                      InputLabelProps={{ shrink: true }}
                      value={idPessoa}
                    />
                  </Grid>
                  <Grid item xs={12} sm={7}>
                    <TextField
                      fullWidth
                      disabled
                      type="text"
                      name="pessoa.nome"
                      label="Nome do Membro"
                      variant={estiloDeCampo}
                      InputLabelProps={{ shrink: true }}
                      inputProps={{ style: { textTransform: "uppercase" } }}
                      value={nomePessoa}
                    />
                  </Grid>                  
                  <Grid item xs={12} sm={3}>
                    <Controller
                      name="statusAprovacao"
                      control={control}
                      as={
                        <TextField
                          select
                          fullWidth
                          label="Status Aprovação"
                          variant={estiloDeCampo}
                          InputLabelProps={{ shrink: true }}
                          error={!!errors.statusAprovacao}
                          helperText={errors.statusAprovacao ? errors.statusAprovacao.message : ''}
                        >
                          <MenuItem key="P" value="P">PENDENTE</MenuItem>
                          <MenuItem key="E" value="E">EM ANÁLISE</MenuItem>
                          <MenuItem key="A" value="A">APROVADO</MenuItem>
                          <MenuItem key="R" value="R">REJEITADO</MenuItem>
                          <MenuItem key="S" value="S">SUSPENSO</MenuItem>                      
                        </TextField>
                      }
                    />
                  </Grid>                                  
                </Grid>
              </CardContent>
            </Card>

            <br />
            {/* Listagem das imagens a serem analisadas */}
            <Card>
              <CardHeader
                avatar={<Avatar className={css.avatar}><ImageSearch /></Avatar>}
                title="Imagens"
                subheader="Listagem das imagens a serem analisadas"
                className={css.cartaoTitulo}
              />
              <MaterialTable
                isLoading={false}
                columns={colunasTabFotos}
                data={fotos}
                options={{
                  padding: "dense",
                  showTitle: false,
                  filtering: false,
                  grouping: false,
                  columnsButton: false,
                  pageSize: 5,
                  searchFieldAlignment: "left",
                  searchFieldVariant: "standard",
                  actionsColumnIndex: -1,
                  loadingType: "linear",
                  showTextRowsSelected: false,
                  toolbarButtonAlignment: "left",
                  exportButton: false,
                  selection: false,
                  headerStyle: {
                    backgroundColor: '#44575F',
                    color: '#FFF',
                  },
                }}
                localization={{
                  body: {
                    emptyDataSourceMessage: 'Nenhum registro para exibir...'
                  },
                  toolbar: {
                    addRemoveColumns: 'Adiciona ou remove colunas',
                    searchTooltip: 'Pesquisar',
                    searchPlaceholder: 'Pesquisar',
                    nRowsSelected: '{0} linha(s) selecionada',
                    showColumnsTitle: 'Mostrar colunas',
                    showColumnsAriaLabel: 'Mostrar colunas',
                    exportTitle: 'Exportar',
                    exportAriaLabel: 'Exportar',
                    exportName: 'Exportar como CSV'
                  },
                  header: {
                    actions: 'Ações'
                  },
                  pagination: {
                    labelRowsSelect: 'linhas',
                    labelDisplayedRows: '{count} de {from}-{to}',
                    firstTooltip: 'Primeira página',
                    previousTooltip: 'Página anterior',
                    nextTooltip: 'Próxima página',
                    lastTooltip: 'Última página'
                  }
                }}
                actions={[
                  {
                    icon: 'link',
                    tooltip: 'Visualizar Imagem',
                    onClick: (event, rowData) => {
                      window.open(rowData.link, "_blank");
                    },
                  }
                ]}
              />
            </Card>

            <br />
            {/* Dados pessoais da pessoa */}
            <Card>
              <CardHeader
                avatar={<Avatar className={css.avatar}><AssignmentInd /></Avatar>}
                title="Pessoa"
                subheader="Informe seus dados pessoais"
                className={css.cartaoTitulo}
              />
              <CardContent>
                <Grid container direction="row" justify="flex-start" spacing={2}>
                  <Grid item xs={12} sm={3}>
                    <Controller
                      name="tipoPessoa"
                      control={control}
                      render={({ error, onChange, value }) => (
                        <TextField
                          select
                          fullWidth
                          label="Tipo de Pessoa"
                          variant={estiloDeCampo}
                          InputLabelProps={{ shrink: true }}
                          error={!!errors.tipoPessoa}
                          helperText={errors.tipoPessoa ? errors.tipoPessoa.message : ''}
                          value={tipoPessoa}
                          onChange={(e) => {
                            setTipoPessoa(e.target.value);
                          }}
                        >
                          <MenuItem key="F" value="F">FÍSICA</MenuItem>
                          <MenuItem key="J" value="J">JURÍDICA</MenuItem>
                        </TextField>
                      )}
                    />
                  </Grid>
                  <Grid item xs={12} md={9}>
                    <TextField
                      fullWidth
                      type="text"
                      name="nome"
                      label="Nome"
                      variant={estiloDeCampo}
                      inputRef={register}
                      placeholder=""
                      InputLabelProps={{ shrink: true }}
                      inputProps={{ style: { textTransform: "uppercase" } }}
                      error={!!errors.nome}
                      helperText={errors.nome ? errors.nome.message : ''}
                    />
                  </Grid>
                  <Grid item xs={12} md={3}>
                    <Controller
                      name="telefone"
                      control={control}
                      render={({ onChange, onBlur, value }) => (
                        <InputMask
                          mask={mascara}
                          maskChar=" "
                          disabled={false}
                          value={telefone}
                          onChange={(ev) => {
                            setValue("telefone", ev.target.value);
                            setTelefone(ev.target.value);
                            if (ev.target.value.replace(/([^\d])/g, "").length === 3) {
                              const novoValor = ev.target.value.replace(/([^\d])/g, "").substring(3, 2);
                              if (novoValor === '9') {
                                setMascara("(99)99999-9999");
                              } else {
                                setMascara("(99)9999-9999");
                              }
                            }
                          }}
                        >
                          {(inputProps) =>
                            <TextField
                              {...inputProps}
                              fullWidth
                              type="text"
                              label="Telefone"
                              variant={estiloDeCampo}
                              placeholder="(99)99999-9999"
                              InputLabelProps={{ shrink: true }}
                              error={!!errors.telefone}
                              helperText={errors.telefone ? errors.telefone.message : ''}
                            />
                          }
                        </InputMask>
                      )}
                    />
                  </Grid>
                  <Grid item xs={12} md={9}>
                    <TextField
                      fullWidth
                      type="email"
                      name="email"
                      label="E-Mail"
                      variant={estiloDeCampo}
                      inputRef={register}
                      placeholder="email@email.com.br"
                      InputLabelProps={{ shrink: true }}
                      inputProps={{ style: { textTransform: "lowercase" } }}
                      error={!!errors.email}
                      helperText={errors.email ? errors.email.message : ''}
                    />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Controller
                      name="cpfcnpj"
                      control={control}
                      render={({ onChange, onBlur, value }) => (
                        <InputMask
                          mask={tipoPessoa === 'F' ? mascCpf : mascCnpj}
                          maskChar=" "
                          disabled={false}
                          value={cnpj}
                          onChange={(ev) => {
                            setCnpj(ev.target.value);
                            setValue("cpfcnpj", ev.target.value)
                          }}
                        >
                          {(inputProps) =>
                            <TextField
                              {...inputProps}
                              fullWidth
                              type="text"
                              label="CPF ou CNPJ"
                              variant={estiloDeCampo}
                              placeholder={tipoPessoa === 'F' ? mascCpf : mascCnpj}
                              InputLabelProps={{ shrink: true }}
                            />
                          }
                        </InputMask>
                      )}
                    />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <TextField
                      fullWidth
                      type="text"
                      name="identidade"
                      label="Identidade"
                      variant={estiloDeCampo}
                      inputRef={register}
                      placeholder=""
                      InputLabelProps={{ shrink: true }}
                      inputProps={{ style: { textTransform: "uppercase" } }}
                    />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <MuiPickersUtilsProvider utils={LocalizedUtils} locale={ptBrLocale} >
                      <Controller
                        name="nascimento"
                        control={control}
                        as={
                          <KeyboardDatePicker
                            autoOk
                            fullWidth
                            name="nascimento"
                            label="Data Nascimento"
                            format="dd/MM/yyyy"
                            cancelLabel="Cancelar"
                            variant={estiloDeCampo}
                            placeholder="dd/mm/aaaa"
                            InputLabelProps={{ shrink: true }}
                            error={!!errors.nascimento}
                            helperText={errors.nascimento ? errors.nascimento.message : ''}
                          />
                        }
                      />
                    </MuiPickersUtilsProvider>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      type="text"
                      name="nomeFantasia"
                      label="Nome Fantasia"
                      variant={estiloDeCampo}
                      inputRef={register}
                      placeholder=""
                      InputLabelProps={{ shrink: true }}
                      inputProps={{ style: { textTransform: "uppercase" } }}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      type="text"
                      name="ramoAtividade"
                      label="Ramo de Atividade"
                      variant={estiloDeCampo}
                      inputRef={register}
                      placeholder=""
                      InputLabelProps={{ shrink: true }}
                      inputProps={{ style: { textTransform: "uppercase" } }}
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>

            <br />
            {/* Endereço da pessoa */}
            <Card>
              <CardHeader
                avatar={<Avatar className={css.avatar}><HomeWork /></Avatar>}
                title="Endereço"
                subheader="Informe seu endereço (residencial ou comercial)"
                className={css.cartaoTitulo}
              />
              <CardContent>
                <Grid container direction="row" justify="flex-start" spacing={2}>
                  <Grid item xs={12} md={2}>
                    <Controller
                      name="cep"
                      control={control}
                      render={({ onChange, onBlur, value }) => (
                        <InputMask
                          mask="99999-999"
                          maskChar=" "
                          disabled={false}
                          value={cep}
                          onChange={(ev) => {
                            onChange(ev.target.value);
                            setValue("cep", ev.target.value)
                          }}
                          onBlur={(ev) => onBlurCep(ev.target.value)}
                        >
                          {(inputProps) =>
                            <TextField
                              {...inputProps}
                              fullWidth
                              type="text"
                              label="CEP"
                              variant={estiloDeCampo}
                              placeholder="99999-999"
                              InputLabelProps={{ shrink: true }}
                              error={!!errors.cep}
                              helperText={errors.cep ? errors.cep.message : ''}
                            />
                          }
                        </InputMask>
                      )}
                    />
                  </Grid>

                  <Grid item xs={12} md={8}>
                    <TextField
                      fullWidth
                      type="text"
                      name="logradouro"
                      label="Logradouro"
                      variant={estiloDeCampo}
                      inputRef={register}
                      placeholder="rua, avenida, alameda, estrada..."
                      InputLabelProps={{ shrink: true }}
                      inputProps={{ style: { textTransform: "uppercase" } }}
                      error={!!errors.logradouro}
                      helperText={errors.logradouro ? errors.logradouro.message : ''}
                    />
                  </Grid>

                  <Grid item xs={12} md={2}>
                    <TextField
                      fullWidth
                      type="text"
                      name="numero"
                      label="Número"
                      variant={estiloDeCampo}
                      inputRef={register}
                      placeholder="nr. ou s/n"
                      InputLabelProps={{ shrink: true }}
                      inputProps={{ style: { textTransform: "uppercase" } }}
                      error={!!errors.numero}
                      helperText={errors.numero ? errors.numero.message : ''}

                    />
                  </Grid>

                  <Grid item xs={12} md={12}>
                    <TextField
                      fullWidth
                      type="text"
                      name="complemento"
                      label="Complemento"
                      variant={estiloDeCampo}
                      inputRef={register}
                      placeholder="apto, loja, qd, lt..."
                      InputLabelProps={{ shrink: true }}
                      inputProps={{ style: { textTransform: "uppercase" } }}
                      error={!!errors.complemento}
                      helperText={errors.complemento ? errors.complemento.message : ''}
                    />
                  </Grid>

                  <Grid item xs={12} md={12}>
                    <TextField
                      fullWidth
                      type="text"
                      name="referencia"
                      label="Referência"
                      variant={estiloDeCampo}
                      inputRef={register}
                      placeholder="próximo a..."
                      InputLabelProps={{ shrink: true }}
                      inputProps={{ style: { textTransform: "uppercase" } }}
                    />
                  </Grid>

                  <Grid item xs={12} md={5}>
                    <TextField
                      fullWidth
                      type="text"
                      name="bairro"
                      label="Bairro"
                      variant={estiloDeCampo}
                      inputRef={register}
                      placeholder=""
                      InputLabelProps={{ shrink: true }}
                      inputProps={{ style: { textTransform: "uppercase" } }}
                      error={!!errors.bairro}
                      helperText={errors.bairro ? errors.bairro.message : ''}
                    />
                  </Grid>

                  <Grid item xs={12} md={5}>
                    <TextField
                      fullWidth
                      type="text"
                      name="cidade"
                      label="Cidade"
                      variant={estiloDeCampo}
                      inputRef={register}
                      placeholder=""
                      InputLabelProps={{ shrink: true }}
                      inputProps={{ style: { textTransform: "uppercase" } }}
                      error={!!errors.cidade}
                      helperText={errors.cidade ? errors.cidade.message : ''}
                    />
                  </Grid>

                  <Grid item xs={12} md={2}>
                    <TextField
                      fullWidth
                      type="text"
                      name="estado"
                      label="Estado"
                      variant={estiloDeCampo}
                      inputRef={register}
                      placeholder=""
                      InputLabelProps={{ shrink: true }}
                      inputProps={{ style: { textTransform: "uppercase" } }}
                      error={!!errors.estado}
                      helperText={errors.estado ? errors.estado.message : ''}
                    />
                  </Grid>

                </Grid>
              </CardContent>
            </Card>

            <br />
            {/* Veículo da pessoa */}
            <Card>
              <CardHeader
                avatar={<Avatar className={css.avatar}><DriveEta /></Avatar>}
                title="Veículo"
                subheader="Informe os dados do veículo"
                className={css.cartaoTitulo}
              />
              <CardContent>
                <Grid container direction="row" spacing={2}>
                  <Grid item xs={12} sm={2}>
                    <Controller
                      name="tipoVeiculo"
                      control={control}
                      as={
                        <TextField
                          select
                          fullWidth
                          label="Tipo de Veículo"
                          variant={estiloDeCampo}
                          placeholder="EX.: BIKE"
                          InputLabelProps={{ shrink: true }}
                          error={!!errors.tipoVeiculo}
                          helperText={errors.tipoVeiculo ? errors.tipoVeiculo.message : ''}
                        >
                          <MenuItem key="B" value="B">BICICLETA</MenuItem>
                          <MenuItem key="M" value="M">MOTO</MenuItem>
                          <MenuItem key="C" value="C">CARRO</MenuItem>
                        </TextField>
                      }
                    />
                  </Grid>
                  <Grid item xs={12} sm={5}>
                    <TextField
                      fullWidth
                      type="text"
                      name="modelo"
                      label="Modelo"
                      variant={estiloDeCampo}
                      inputRef={register}
                      InputLabelProps={{ shrink: true }}
                      inputProps={{ style: { textTransform: "uppercase" } }}
                      error={!!errors.modelo}
                      helperText={errors.modelo ? errors.modelo.message : ''}
                    />
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <TextField
                      fullWidth
                      type="text"
                      name="renavan"
                      label="Renavan"
                      variant={estiloDeCampo}
                      inputRef={register}
                      InputLabelProps={{ shrink: true }}
                      inputProps={{ style: { textTransform: "uppercase" } }}
                      error={!!errors.renavan}
                      helperText={errors.renavan ? errors.renavan.message : ''}
                    />
                  </Grid>
                  <Grid item xs={12} sm={2}>
                    <TextField
                      fullWidth
                      type="text"
                      name="placa"
                      label="Placa"
                      variant={estiloDeCampo}
                      inputRef={register}
                      InputLabelProps={{ shrink: true }}
                      inputProps={{ style: { textTransform: "uppercase" } }}
                      error={!!errors.placa}
                      helperText={errors.placa ? errors.placa.message : ''}
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>

            <br />
            {/* Habilitação da pessoa */}
            <Card>
              <CardHeader
                avatar={<Avatar className={css.avatar}><RecentActors /></Avatar>}
                title="Habilitação"
                subheader="Informe os dados da habilitação"
                className={css.cartaoTitulo}
              />
              <CardContent>
                <Grid container direction="row" spacing={2}>
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
                        name="primeiraCNH"
                        control={control}
                        as={
                          <KeyboardDatePicker
                            autoOk
                            fullWidth
                            name="primeiraCNH"
                            label="Primeira Habilitação"
                            format="dd/MM/yyyy"
                            cancelLabel="Cancelar"
                            variant={estiloDeCampo}
                            placeholder="dd/mm/aaaa"
                            InputLabelProps={{ shrink: true }}
                            error={!!errors.primeiraCNH}
                            helperText={errors.primeiraCNH ? errors.primeiraCNH.message : ''}
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
                {progresso ? <CircularProgress style={{ marginRight: 10, color: '#000' }} size={16} /> : null}
                Salvar
              </Button>
              <Button
                type="reset"
                variant="contained"
                color="primary"
                disableElevation
                onClick={() => {reset(valoresIniciais);}}
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

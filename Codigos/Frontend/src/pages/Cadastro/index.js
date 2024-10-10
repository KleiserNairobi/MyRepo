import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import {
  Avatar, Card, CardContent, CardHeader, FormControlLabel, Grid, Button, TextField, IconButton,
  Radio, RadioGroup, Typography, ThemeProvider, CssBaseline, FormControl, CircularProgress, MenuItem 
} from '@material-ui/core';
import { AssignmentInd, AssignmentTurnedIn, Lock, HomeWork, ArrowBack, PhotoCamera } from '@material-ui/icons';
import { KeyboardDatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers';
import InputMask from 'react-input-mask';
import DateFnsUtils from '@date-io/date-fns';
import { format } from "date-fns";
import ptBrLocale from "date-fns/locale/pt-BR";

//import MyCircularProgress from '../../components/MyCircularProgress';

import schema from './CadastroSch';
import * as service from '../../services/CadastroService';
import { useGeral } from '../../contexts/GeralCtx';
import { useAlerta } from '../../contexts/AlertaCtx';
import { TIPO_ERRO, TIPO_SUCESSO } from '../../utils/global';
import theme from '../../themes/cadastro';
import PageCss from '../PagesCss';
import style from './styles';



export default function Cadastro() {

  const valoresIniciais = { 
    pessoa: { id: null, nome: '' }, 
    // statusAprovacao: '',
    tipoPessoa: 'F',
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
    senha: '',
    confirmeSenha: '',
    imagePerfil: '',
    imageCRLV: '',
    imageCNH: '',
    imageCE: ''
  };

  const css = PageCss();
  const estilo = style();
  const history = useHistory();
  const { estiloDeCampo } = useGeral();
  const { setConteudo } = useAlerta();
  
  const { handleSubmit, errors, setValue, control } = useForm({
    mode: 'all',
    defaultValues: valoresIniciais,
    resolver: yupResolver(schema)
  });
  const [objRadio, setObjRadio] = useState('C');
  const [mens1, setMens1] = useState(
    'Aquele que se cadastra como pessoa física ou jurídica e consome os serviços de entrega'
  );
  const [mens2, setMens2] = useState('');
  const [enviou, setEnviou] = useState(false);
  // const [valor, setValor] = useState('');
  const [mascara, setMascara] = useState("(99)99999-9999");
  const [mascCpf] = useState('999.999.999-99');
  const [mascCnpj] = useState('99.999.999/9999-99');  
  // const [cep, setCep] = useState('');
  // const [setCnpj] = useState('');
  const [tipoPessoa, setTipoPessoa] = useState('');

  const [arquivoPerfil, setArquivoPerfil] = useState(null);
  const [nomeArquivoPerfil, setNomeArquivoPerfil] = useState('');
  const [arquivoCRLV, setArquivoCRLV] = useState(null);
  const [nomeArquivoCRLV, setNomeArquivoCRLV] = useState('');
  const [arquivoCNH, setArquivoCNH] = useState(null);
  const [nomeArquivoCNH, setNomeArquivoCNH] = useState('');
  const [arquivoCE, setArquivoCE] = useState(null);
  const [nomeArquivoCE, setNomeArquivoCE] = useState('');


  class LocalizedUtils extends DateFnsUtils {
    getDatePickerHeaderText(date) {
      return format(date, "d MMM yyyy", { locale: this.locale });
    }
  }

  const handleChangeRadio = (event) => {
    setObjRadio(event.target.value);
    retornaMensagem(event.target.value);
  };

  function retornaMensagem(tipoPessoa) {
    console.log(tipoPessoa);
    if (tipoPessoa === 'C') {
      setMens1('Aquele que se cadastra como pessoa física ou jurídica e consome os serviços de entrega.');
      setMens2('');
    }
    if (tipoPessoa === 'E') {
      setMens1('Aquele que se cadastra como pessoa física ou jurídica e presta serviço de entregador.');
      setMens2('É necessário anexar foto do CRLV, da CNH e do comprovante de endereço.  ');
    }
    // if (tipoPessoa === 'jc') {
    //   setMens1('Aquele que se cadastra como pessoa jurídica e consome os serviços de entrega.');
    //   setMens2('');
    // }
    if (tipoPessoa === 'P') {
      setMens1('Aquele que se cadastra como pessoa física ou jurídica e consome os serviços de entrega na modalidade');
      setMens2('parceria, delegando a Chamaí as entregas do seu estabelecimento comercial.');
    }
  }
  
  function onBlurCep(ev) { 
    
    const cep = ev?.replace(/\D/g, '');
    if (cep?.length !== 8) {
      return;
    }

    // const cep = ev.target.value?.replace(/\D/g, '');
    // if (cep?.length !== 8) {
    //   return;
    // }

    service.obtemUnico(`enderecos/buscar-endereco-por-cep/?cep=${cep}`)
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
  
  function onChangeImagePerfil(ev) {   
    setArquivoPerfil(ev.target.files[0]); 
    setNomeArquivoPerfil(ev.target.files[0].name);
  }

  function onChangeImageCRLV(ev) {   
    setArquivoCRLV(ev.target.files[0]); 
    setNomeArquivoCRLV(ev.target.files[0].name);
  }

  function onChangeImageCNH(ev) {
    setArquivoCNH(ev.target.files[0]);
    setNomeArquivoCNH(ev.target.files[0].name);
  }

  function onChangeImageCE(ev) {
    setArquivoCE(ev.target.files[0]);
    setNomeArquivoCE(ev.target.files[0].name);
  }

  function validaArquivos() {
    var sucesso = true;
    var mensagem = [''];

    if (arquivoPerfil === null) {
      mensagem.push('Necessário inserir uma foto frontal - Selfie.');
      sucesso = false;
    }

    if (arquivoCRLV === null) {
      mensagem.push('Necessário inserir uma foto do CRLV - Certificado de Registro do Veículo.');
      sucesso = false;
    }    

    if (arquivoCNH === null) {
      mensagem.push('Necessário inserir uma foto da CNH - Carteira Nacional de Habilitação.');
      sucesso = false;
    }

    if (arquivoCE === null) {
      mensagem.push('Necessário inserir uma foto do comprovante de endereço.');
      sucesso = false;
    }

    if (!sucesso) {
      var mens = null;
      for (var i = 0; i < mensagem.length; i++) {
        mens += mensagem[i];
      }
      setConteudo({
        tipo: TIPO_ERRO,
        descricao: mens,
        exibir: true
      });
    }

    return sucesso;
  }


  async function submitForm(values) {
    if (objRadio === null) {
      setConteudo({
        tipo: TIPO_ERRO,
        descricao: 'Necessário informar o tipo de pessoa',
        exibir: true
      });
      return null;
    }

    if (objRadio === 'E') {
      if (! validaArquivos() ) {        
        return null;
      }
    }

    try {
      setEnviou(true);
      const { data } = await service.insere('/registros', values, objRadio);

      if (data) {
        try {
          service.insereFotoPerfil(`/registros/${data.id}/foto`, arquivoPerfil);
        } catch (erro) {
          setConteudo({
            tipo: TIPO_ERRO,
            descricao: 'Não foi possível inserir a imagem do Perfil - Selfie.' + erro,
            exibir: true
          });
        }

        try {
          console.log('enviando CRLV');
          service.insereFotoCRLV(`/registros/${data.id}/foto`, arquivoCRLV)
        } catch (erro) {
          setConteudo({
            tipo: TIPO_ERRO,
            descricao: 'Não foi possível inserir a imagem do documento do veículo.' + erro,
            exibir: true
          });
        }
        
        try {
          console.log('enviando CNH');
          service.insereFotoCNH(`/registros/${data.id}/foto`, arquivoCNH)
        } catch (erro) {
          setConteudo({
            tipo: TIPO_ERRO,
            descricao: 'Não foi possível inserir a imagem da carteira de habilitação.' + erro,
            exibir: true
          });
        }        

        try {
          console.log('enviando CE');
          service.insereFotoCE(`/registros/${data.id}/foto`, arquivoCE)
        } catch (erro) {
          setConteudo({
            tipo: TIPO_ERRO,
            descricao: 'Não foi possível inserir a imagem do comprovante de endereço.' + erro,
            exibir: true
          });
        }         
        
        setConteudo({
          tipo: TIPO_SUCESSO,
          descricao: 'Parabens! Seu cadastro foi concluído.',
          exibir: true
        });

        history.push('/login');
      }
    } catch (erro) {
      setEnviou(false);
      setConteudo({
        tipo: TIPO_ERRO,
        descricao: erro.response.data.detalhe,
        exibir: true
      });
    }    
  }  

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div className={estilo.root}>
        <div className={estilo.tituloPagina}>
          <Typography variant="h5" align="center">Olá, que bom ter você aqui!</Typography>
        </div>
        <div className={estilo.subtituloPagina}>
          <Typography variant="h5" align="center">Vamos iniciar agora o seu cadastro.</Typography>
        </div>

        <form onSubmit={handleSubmit( submitForm )} >
          <Card className={estilo.cartaoExterno} variant="outlined" >
            <CardContent>
              {/* Escolha das opções - Cliente, Entregador, Parceiro*/}
              <Grid container direction="row" justify="flex-start" spacing={2}>
                <Grid item xs={12} >
                  <Typography align="center"><strong>A conta que deseja criar é para qual tipo de pessoa?</strong></Typography>
                </Grid>
                <Grid item xs={12}>
                  <div className={estilo.cartaoTipoPessoa}>
                    <FormControl component="fieldset" className={estilo.linha} >
                      <RadioGroup aria-label="tipoPessoa" name="tipoPessoa" value={objRadio} onChange={handleChangeRadio} className={estilo.linha}>
                        <FormControlLabel value="C" control={<Radio />} label="Cliente" />
                        <FormControlLabel value="E" control={<Radio />} label="Entregador" />
                        {/* <FormControlLabel value="jc" control={<Radio />} label="Jurídica (Cliente)" /> */}
                        <FormControlLabel value="P" control={<Radio />} label="Parceiro" />
                      </RadioGroup>
                    </FormControl>
                    <div className={estilo.mensTipoPessoa}>
                      {mens1 ? <Typography variant="caption" align="center">{mens1}</Typography> : null}
                      {mens2 ? <Typography variant="caption" align="center">{mens2}</Typography> : null}
                    </div>
                  </div>
                </Grid>
              </Grid>

              <br/>
              {/* Dados pessoais */}
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
                        render={({ onChange, value }) => (
                          <TextField
                            select
                            fullWidth
                            label="Tipo de Pessoa"
                            variant={estiloDeCampo}
                            InputLabelProps={{ shrink: true }}
                            error={!!errors.tipoPessoa}
                            helperText={errors.tipoPessoa ? errors.tipoPessoa.message : ''}
                            value={value}
                            onChange={(e) => {
                              onChange(e.target.value);
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
                      <Controller
                        name="nome"
                        control={control}
                        render={({ value, onChange }) => (                      
                          <TextField
                            fullWidth
                            type="text"
                            label="Nome"
                            variant={estiloDeCampo}
                            placeholder=""
                            InputLabelProps={{ shrink: true }}
                            inputProps={{ style: { textTransform: "uppercase" } }}
                            error={!!errors.nome}
                            helperText={errors.nome ? errors.nome.message : ''}
                            value={value}
                            onChange={(ev)=> onChange(ev.target.value)}
                          />
                        )}
                      />
                    </Grid>                    
                    <Grid item xs={12} md={3}>
                      <Controller
                        name="telefone"
                        control={control}
                        render={({ onChange, value }) => (
                          <InputMask
                            mask={mascara}
                            maskChar=" "
                            disabled={false}
                            value={value}
                            onChange={(ev) => {
                              onChange(ev.target.value);
                              setValue("telefone", ev.target.value);                              
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
                      <Controller
                          name="email"
                          control={control}
                          render={({ value, onChange }) => (
                            <TextField
                              fullWidth
                              type="email"
                              label="E-Mail"
                              variant={estiloDeCampo}
                              placeholder="email@email.com.br"
                              InputLabelProps={{ shrink: true }}
                              inputProps={{ style: { textTransform: "lowercase" } }}
                              error={!!errors.email}
                              helperText={errors.email ? errors.email.message : ''}
                              value={value}
                              onChange={(ev)=> onChange(ev.target.value)}  
                            />
                          )}
                        />
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <Controller
                        name="cpfcnpj"
                        control={control}
                        render={({ onChange, value }) => (
                          <InputMask
                            mask={  
                              tipoPessoa === 'F' || tipoPessoa === null || tipoPessoa === ''
                              ? mascCpf 
                              : mascCnpj
                            }
                            maskChar=" "
                            disabled={false}
                            value={value}
                            onChange={(ev) => {
                              onChange(ev.target.value);
                              // setCnpj(ev.target.value);
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
                                placeholder={
                                  tipoPessoa === 'F' || tipoPessoa === null || tipoPessoa === ''
                                  ? mascCpf 
                                  : mascCnpj
                                }
                                InputLabelProps={{ shrink: true }}
                              />
                            }
                          </InputMask>
                        )}
                      />
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <Controller
                        name="identidade"
                        control={control}
                        render={({ onChange, value }) => (                      
                          <TextField
                            fullWidth
                            disabled = {tipoPessoa === 'J'}
                            type="text"
                            label="Identidade"
                            variant={estiloDeCampo}
                            placeholder=""
                            InputLabelProps={{ shrink: true }}
                            inputProps={{style: {textTransform: "uppercase" }}}
                            value={value}
                            onChange={(ev)=> onChange(ev.target.value)}  
                          />
                        )}
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
                              disabled = {tipoPessoa === 'J'}
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
                      <Controller
                        name="nomeFantasia"
                        control={control}
                        render={({ value, onChange }) => (                      
                          <TextField
                            fullWidth
                            type="text"
                            disabled={tipoPessoa === 'F' || tipoPessoa === null || tipoPessoa === ''}
                            label="Nome Fantasia"
                            variant={estiloDeCampo}
                            placeholder=""
                            InputLabelProps={{ shrink: true }}
                            inputProps={{style: {textTransform: "uppercase"}}}
                            value={value}
                            onChange={(ev)=> onChange(ev.target.value)}  
                          />
                        )}
                      />                            
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Controller
                        name="ramoAtividade"
                        control={control}
                        render={({ value, onChange }) => (
                          <TextField
                            fullWidth
                            type="text"
                            disabled={tipoPessoa === 'F' || tipoPessoa === null || tipoPessoa === ''}
                            label="Ramo de Atividade"
                            variant={estiloDeCampo}
                            placeholder=""
                            InputLabelProps={{ shrink: true }}
                            inputProps={{style: {textTransform: "uppercase"}}}
                            value={value}
                            onChange={(ev)=> onChange(ev.target.value)}  
                          />
                        )}
                      />                            
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>

              <br/>
              {/* endereço */}
              <Card>
                <CardHeader
                  avatar={<Avatar className={estilo.avatar}><HomeWork /></Avatar>}
                  title="Endereço"
                  subheader="Informe seu endereço (residencial ou comercial)"
                  className={estilo.cartaoTitulo}
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
                            value={value}
                            onChange={(ev) => {
                              onChange(ev.target.value)
                              // setCep(ev.target.value)
                              setValue("cep", ev.target.value)
                            }}
                            onBlur={(ev) => {
                              onBlurCep(ev.target.value)
                            }}
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
                      <Controller
                        name="logradouro"
                        control={control}
                        render={({ onChange, value }) => (
                          <TextField
                            fullWidth
                            type="text"
                            label="Logradouro"
                            variant={estiloDeCampo}
                            placeholder="rua, avenida, alameda, estrada..."
                            InputLabelProps={{shrink: true}}
                            inputProps={{style: {textTransform: "uppercase"}}}
                            error={!!errors.logradouro}
                            helperText={errors.logradouro ? errors.logradouro.message : ''} 
                            value={value}
                            onChange={(ev) => {onChange(ev.target.value)}}                           
                          />
                        )}
                      />
                    </Grid>
                    <Grid item xs={12} md={2}>
                      <Controller
                        name="numero"
                        control={control}
                        render={({ onChange, value }) => (                      
                          <TextField
                            fullWidth
                            type="text"
                            label="Número"
                            variant={estiloDeCampo}
                            placeholder="nr. ou s/n"
                            InputLabelProps={{ shrink: true }}
                            inputProps={{ style: { textTransform: "uppercase" } }}
                            value={value}
                            onChange={(ev) => {onChange(ev.target.value)}}                            
                          />
                        )}
                      />
                    </Grid>
                    <Grid item xs={12} md={12}>
                      <Controller
                        name="complemento"
                        control={control}
                        render={({ onChange, value }) => (                        
                          <TextField
                            fullWidth
                            type="text"
                            label="Complemento"
                            variant={estiloDeCampo}
                            placeholder="apto, loja, qd, lt..."
                            InputLabelProps={{ shrink: true }}
                            inputProps={{ style: { textTransform: "uppercase" } }}
                            value={value}
                            onChange={(ev) => {onChange(ev.target.value)}}
                          />
                        )}
                      />
                    </Grid>
                    <Grid item xs={12} md={12}>
                      <Controller
                        name="referencia"
                        control={control}
                        render={({ onChange, value }) => (                        
                          <TextField
                            fullWidth
                            type="text"
                            label="Referência"
                            variant={estiloDeCampo}
                            placeholder="próximo a..."
                            InputLabelProps={{shrink: true}}
                            inputProps={{ style: {textTransform: "uppercase"}}}
                            value={value}
                            onChange={(ev) => {onChange(ev.target.value)}}                            
                          />
                        )}
                      />
                    </Grid>
                    <Grid item xs={12} md={5}>
                      <Controller
                        name="bairro"
                        control={control}
                        render={({ onChange, value }) => (                        
                          <TextField
                            fullWidth
                            type="text"
                            label="Bairro"
                            variant={estiloDeCampo}
                            placeholder=""
                            InputLabelProps={{shrink: true}}
                            inputProps={{style: {textTransform: "uppercase"}}}
                            error={!!errors.bairro}
                            helperText={errors.bairro ? errors.bairro.message : ''}
                            value={value}
                            onChange={(ev) => {onChange(ev.target.value)}}                             
                          />
                        )}
                      />
                    </Grid>
                    <Grid item xs={12} md={5}>
                      <Controller
                        name="cidade"
                        control={control}
                        render={({ onChange, value }) => (
                          <TextField
                            fullWidth
                            type="text"
                            name="cidade"
                            label="Cidade"
                            variant={estiloDeCampo}
                            placeholder=""
                            InputLabelProps={{ shrink: true }}
                            inputProps={{ style: { textTransform: "uppercase" } }}
                            error={!!errors.cidade}
                            helperText={errors.cidade ? errors.cidade.message : ''}
                            value={value}
                            onChange={(ev) => { onChange(ev.target.value) }}
                          />
                        )}
                      />
                    </Grid>
                    <Grid item xs={12} md={2}>
                      <Controller
                        name="estado"
                        control={control}
                        render={({ onChange, value }) => (
                          <TextField
                            fullWidth
                            type="text"
                            label="Estado"
                            variant={estiloDeCampo}
                            placeholder=""
                            InputLabelProps={{ shrink: true }}
                            inputProps={{ style: { textTransform: "uppercase" } }}
                            error={!!errors.estado}
                            helperText={errors.estado ? errors.estado.message : ''}
                            value={value}
                            onChange={(ev) => { onChange(ev.target.value) }}
                          />
                        )}
                      />
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>

              {objRadio === 'E' ?
                <div>
                  <br/><br/>                  
                  <Card>
                    <CardHeader
                      avatar={<Avatar className={estilo.avatar}><AssignmentTurnedIn /></Avatar>}
                      title="Documentos"
                      subheader="Anexe foto dos documentos"
                      className={estilo.cartaoTitulo}
                    />
                    <CardContent>
                      <Grid container direction="row" justify="flex-start" spacing={2}>
                        <Grid item xs={1}>
                          <input accept=".png, .jpg, .jpeg" style={{display: 'none'}} id="btnImagePerfil" type="file" value='' onChange={(ev)=>onChangeImagePerfil(ev)} />
                          <label htmlFor="btnImagePerfil">
                            <IconButton color="text" aria-label="carrega imagem" component="span">
                              <PhotoCamera />
                            </IconButton>
                          </label>
                        </Grid>
                        {/** 
                        <Grid item xs={1}>
                          <MyCircularProgress value={progressoCRLV}/>
                        </Grid>
                        */}
                        <Grid item xs={11}>
                          <TextField 
                            fullWidth 
                            name="imagePerfil"  
                            label="Foto do Perfil - Selfie"
                            value={nomeArquivoPerfil}
                            variant={estiloDeCampo}
                            placeholder="Clique no ícone para carregar a imagem"
                            InputLabelProps={{ shrink: true }}
                          />                          
                        </Grid>

                        <Grid item xs={1}>
                          <input accept=".png, .jpg, .jpeg" style={{display: 'none'}} id="btnImageCRLV" type="file" value='' onChange={(ev)=>onChangeImageCRLV(ev)} />
                          <label htmlFor="btnImageCRLV">
                            <IconButton color="text" aria-label="carrega imagem" component="span">
                              <PhotoCamera />
                            </IconButton>
                          </label>
                        </Grid>
                        {/** 
                        <Grid item xs={1}>
                          <MyCircularProgress value={progressoCRLV}/>
                        </Grid>
                        */}
                        <Grid item xs={11}>
                          <TextField 
                            fullWidth 
                            name="imageCRLV"  
                            label="Foto do documento do veídulo (CRLV)"
                            value={nomeArquivoCRLV}
                            variant={estiloDeCampo}
                            placeholder="Clique no ícone para carregar a imagem"
                            InputLabelProps={{ shrink: true }}
                          />                          
                        </Grid>

                        <Grid item xs={1}>
                          <input accept=".png, .jpg, .jpeg" style={{display: 'none'}} id="btnImageCNH" type="file" value='' onChange={(ev)=>onChangeImageCNH(ev)} />
                          <label htmlFor="btnImageCNH">
                            <IconButton color="text" aria-label="carrega imagem" component="span">
                              <PhotoCamera />
                            </IconButton>
                          </label>
                        </Grid>
                        {/** 
                        <Grid item xs={1}>
                          <MyCircularProgress value={progressoCNH}/>
                        </Grid>
                        */}
                        <Grid item xs={11}>
                          <TextField 
                            fullWidth 
                            name="imageCNH"  
                            label="Foto da carteira de habilitação (CNH)"
                            value={nomeArquivoCNH}
                            variant={estiloDeCampo}
                            placeholder="Clique no ícone para carregar a imagem"
                            InputLabelProps={{ shrink: true }}
                          />                          
                        </Grid>

                        <Grid item xs={1}>
                          <input accept=".png, .jpg, .jpeg" style={{display: 'none'}} id="btnImageCE" type="file" value='' onChange={(ev)=>onChangeImageCE(ev)} />
                          <label htmlFor="btnImageCE">
                            <IconButton color="text" aria-label="carrega imagem" component="span">
                              <PhotoCamera />
                            </IconButton>
                          </label>
                        </Grid>
                        {/** 
                        <Grid item xs={1}>
                          <MyCircularProgress value={progressoCE}/>
                        </Grid>
                        */}
                        <Grid item xs={11}>
                          <TextField 
                            fullWidth 
                            name="imageCE"  
                            label="Foto do comprovante de endereço"
                            value={nomeArquivoCE}
                            variant={estiloDeCampo}
                            placeholder="Clique no ícone para carregar a imagem"
                            InputLabelProps={{ shrink: true }}
                          />                          
                        </Grid>



                      </Grid>
                    </CardContent>
                  </Card>                
                </div>
              :
                null
              }

              <br/>
              {/* senha */}
              <Card>
                <CardHeader
                  avatar={<Avatar className={estilo.avatar}><Lock /></Avatar>}
                  title="Senha"
                  subheader="Crie uma senha para acesso ao App"
                  className={estilo.cartaoTitulo}
                />
                <CardContent>
                  <Grid container direction="row" justify="flex-start" spacing={2}>
                    <Grid item xs={12} md={6}>
                      <Controller
                        name="senha"
                        control={control}
                        render={({ onChange, value }) => (
                          <TextField
                            fullWidth
                            type="password"
                            label="Senha"                            
                            variant={estiloDeCampo}
                            placeholder=""
                            InputLabelProps={{shrink: true}}
                            error={!!errors.senha}
                            helperText={errors.senha ? errors.senha.message : ''}
                            value={value}
                            onChange={(ev) => {onChange(ev.target.value)}}
                          />
                        )}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Controller
                        name="confirmeSenha"
                        control={control}
                        render={({onChange, value}) => (
                          <TextField
                            fullWidth
                            type="password"
                            label="Confirme a senha"
                            variant={estiloDeCampo}
                            placeholder=""
                            InputLabelProps={{shrink: true}}
                            error={!!errors.confirmeSenha}
                            helperText={errors.confirmeSenha ? errors.confirmeSenha.message : ''}
                            value={value}
                            onChange={(ev) => {onChange(ev.target.value)}}
                          />
                        )}
                      />
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>

              {/* botões */}
              <div className={estilo.botoesAcao} >
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  disableElevation
                >
                  {enviou ? <CircularProgress style={{ marginRight: 10 }} color="textPrimary" size={16} /> : null}
                  Gravar
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  disableElevation
                  startIcon={<ArrowBack />}
                  onClick={() => history.push('/login')}
                > Retornar
                </Button>
              </div>
            </CardContent>
          </Card>
        </form>
      </div>
    </ThemeProvider>
  )
}

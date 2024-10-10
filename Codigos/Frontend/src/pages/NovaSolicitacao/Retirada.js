import React, { useState, useEffect } from 'react';
import {
  Button, Card, CardActions, CardContent, Checkbox, Divider, FormControlLabel, Grid, 
  IconButton, MobileStepper, TextField, Tooltip, Typography
} from '@material-ui/core';
import {
  EmojiTransportation, Search, KeyboardArrowRight, KeyboardArrowLeft
} from '@material-ui/icons';
import InputMask from 'react-input-mask';
import { useTheme } from '@material-ui/core/styles';
import * as service from '../../services/EnderecoService';
import { useSolicitacao } from '../../contexts/SolicitacaoCtx';
import { useAlerta } from '../../contexts/AlertaCtx';
import { TIPO_ERRO } from '../../utils/global';
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers';
import { useGeral } from '../../contexts/GeralCtx';
import Cabecalho from './Cabecalho';
import ModalPesquisa from '../../components/ModalPesquisa';
import MyTablePesquisa from '../../components/MyTablePesquisa';
import schema from './RetiradaSch';
import Styles from './Styles';
import PageCss from '../PagesCss';


export default function Retirada() {

  const css = PageCss();
  const classes = Styles();
  const theme = useTheme();
  const { setConteudo } = useAlerta();
  const { dados, setDados, tela, setTela, qtdeTelas } = useSolicitacao();
  const [abrirModal, setAbrirModal] = useState(false);
  const [dadosPesquisa, setDadosPesquisa] = useState();
  const [mascara, setMascara] = useState("(99)99999-9999");

  const {
    auxId, setAuxId, estiloDeCampo, buscarDados, setBuscarDados
  } = useGeral();

  const valoresIniciais = {
    origCep: dados.origCep,
    origLogradouro: dados.origLogradouro,
    origNumero: dados.origNumero,
    origComplemento: dados.origComplemento,
    origReferencia: dados.origReferencia,
    origBairro: dados.origBairro,
    origCidade: dados.origCidade,
    origEstado: dados.origEstado,
    origAddFavorito: dados.origAddFavorito,
    origNomeCliente: dados.origNomeCliente,
    origTelefoneCliente: dados.origTelefoneCliente,
  };

  const { handleSubmit, control, errors, setValue } = useForm({
    mode: 'all',
    defaultValues: valoresIniciais,
    resolver: yupResolver(schema)
  });

  const colunasTabPesquisa = [
    { title: 'ID', field: 'id', width: 10 },
    { title: 'CEP', field: 'cep', width: 20 },
    { title: 'Logradouro', field: 'logradouro', width: 150 },
    { title: 'Nr.', field: 'numero', width: 20 },
    { title: 'Complemento', field: 'complemento', width: 200 },
    { title: 'Bairro', field: 'bairro', width: 200 },
  ]

  function anterior() {
    setTela(tela - 1);
  }

  // Busca dados do cep - quando ocorre onBlur
  function onBlurCep(ev) {
    const cep = ev.target.value?.replace(/\D/g, '');
    if (cep?.length !== 8) {
      return;
    }
    service.obtem(`enderecos/buscar-endereco-por-cep/?cep=${cep}`)
    .then(response => {
      setValue('origLogradouro', response.data.logradouro ? response.data.logradouro : '');
      setValue('origComplemento', response.data.complemento ? response.data.complemento : '');
      setValue('origBairro', response.data.bairro ? response.data.bairro : '');
      setValue('origCidade', response.data.cidade ? response.data.cidade : '');
      setValue('origEstado', response.data.estado ? response.data.estado : '');
      setDados({
        ...dados,
        origLogradouro: response.data.logradouro ? response.data.logradouro : '',
        origComplemento: response.data.complemento ? response.data.complemento : '',
        origBairro: response.data.bairro ? response.data.bairro : '',
        origIdCidade: response.data.cidadeId ? response.data.cidadeId : '',
        origCidade: response.data.cidade ? response.data.cidade : '',
        origEstado: response.data.estado ? response.data.estado : '',
      });
    })
    .catch(erro => {
      setConteudo({
        tipo: TIPO_ERRO,
        descricao: erro.response.data.detalhe,
        exibir: true
      });
    })
  }

  // Abre modal para escolha de endereço
  function chamaPesquisa() {
    setAbrirModal(true);
    service.obtem('/enderecos')
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

  // Effect para buscar dados do endereço - sem ter disparado onBlur
  useEffect(() => {
    if (buscarDados) {
      async function getUnico() {
        try {
          const { data } = await service.obtem(`/enderecos/${auxId}`);
          if (data) {
            setValue('origCep', data.cep ? data.cep : '');
            setValue('origLogradouro', data.logradouro ? data.logradouro : '');
            setValue('origNumero', data.numero ? data.numero : '');
            setValue('origComplemento', data.complemento ? data.complemento : '');
            setValue('origReferencia', data.referencia ? data.referencia : '');
            setValue('origBairro', data.bairro ? data.bairro : '');
            setValue('origCidade', data.municipio.nome ? data.municipio.nome : '');
            setValue('origEstado', data.municipio.estado.sigla ? data.municipio.estado.sigla : '');
            setDados({
              ...dados,
              origCep: data.cep ? data.cep : '',
              origLogradouro: data.logradouro ? data.logradouro : '',
              origNumero: data.numero ? data.numero : '',
              origComplemento: data.complemento ? data.complemento : '',
              origReferencia: data.referencia ? data.referencia : '',
              origBairro: data.bairro ? data.bairro : '',
              origIdCidade: data.municipio.id ? data.municipio.id : '',
              origCidade: data.municipio.nome ? data.municipio.nome : '',
              origEstado: data.municipio.estado.sigla ? data.municipio.estado.sigla : '',
            });
            setAuxId(-1);
          }
        } catch (error) {
          setAuxId(-1);
          setConteudo({
            tipo: TIPO_ERRO,
            descricao: 'Ocorreu um erro ao buscar os dados do endereço',
            exibir: true
          });
        }
      }
      getUnico();
    }
    return () => {
      setBuscarDados(false);
    }
  }, [auxId, setAuxId, setValue, buscarDados, setBuscarDados, setConteudo, dados, setDados]);

  function submitForm(data) {
    setTela(tela + 1);
  }

  return (
    <div>
      <form onSubmit={handleSubmit(submitForm)} >
        <Card >
          <Cabecalho/>
          <CardContent>
            <Grid container direction="row">
              <Grid item xs={12} >
                <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <div className={classes.tituloPagina}>
                      <EmojiTransportation style={{ color: '#FEC601', marginRight: '6px' }} />
                      <Typography variant="subtitle1">Local de Retirada</Typography>
                    </div>
                    <div className={classes.subtituloPagina}>
                      <Typography variant="body2">Informe os dados do local de retirada</Typography>
                    </div>
                  </div>
                  <div style={{ flex: 1 }} />
                  <div style={{ display: 'flex', flexDirection: 'row' }}>
                    <Tooltip title="Favoritos" placement="bottom" arrow>
                      <IconButton color="inherit" onClick={chamaPesquisa}  >
                        <Search />
                      </IconButton>
                    </Tooltip>
                    {/** 
                      <Tooltip title="Localização" placement="bottom" arrow>
                        <IconButton color="inherit" onClick={chamaLocalizacao}  >
                          <MyLocation />
                        </IconButton>
                      </Tooltip>
                    */}
                  </div>
                </div>
              </Grid>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={2} md={2}>
                  <Controller
                    name="origCep"
                    control={control}
                    render={({ onChange, onBlur, error }) => (
                      <InputMask
                        mask="99999-999"
                        maskChar=" "
                        disabled={false}
                        value={dados.origCep}
                        onChange={(ev) => {
                          setDados({ ...dados, origCep: ev.target.value });
                          setValue('origCep', ev.target.value);
                        }}
                        onBlur={(ev) => onBlurCep(ev)}
                      >
                        {(inputProps) =>
                          <TextField
                            {...inputProps}
                            fullWidth
                            type="text"
                            label="CEP"
                            name="origCep"
                            variant={estiloDeCampo}
                            placeholder="99999-999"
                            InputLabelProps={{ shrink: true }}
                            error={!!errors.origCep}
                            helperText={errors.origCep ? errors.origCep.message : ''}
                          />
                        }
                      </InputMask>
                    )}
                  />
                </Grid>
                <Grid item xs={12} sm={8} md={8}>
                  <Controller
                    name="origLogradouro"
                    control={control}
                    render={({ error }) => (
                      <TextField
                        fullWidth
                        type="text"
                        label="Logradouro"
                        variant={estiloDeCampo}
                        placeholder="rua, av..."
                        InputLabelProps={{ shrink: true }}
                        inputProps={{ style: { textTransform: "uppercase" } }}
                        value={dados.origLogradouro}
                        onChange={(e) => {
                          setDados({ ...dados, origLogradouro: e.target.value });
                          setValue('origLogradouro', e.target.value);
                        }}
                        error={!!errors.origLogradouro}
                        helperText={errors.origLogradouro ? errors.origLogradouro.message : ''}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12} sm={2} md={2}>
                  <Controller
                    name="origNumero"
                    control={control}
                    render={({ error }) => (
                      <TextField
                        fullWidth
                        type="text"
                        label="Número"
                        variant={estiloDeCampo}
                        placeholder="nr. ou s/n"
                        InputLabelProps={{ shrink: true }}
                        inputProps={{ style: { textTransform: "uppercase" } }}
                        value={dados.origNumero}
                        onChange={(e) => {
                          setValue('origNumero', e.target.value);
                          setDados({ ...dados, origNumero: e.target.value });
                        }}
                        error={!!errors.origNumero}
                        helperText={errors.origNumero ? errors.origNumero.message : ''}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={6}>
                  <Controller
                    name="origComplemento"
                    control={control}
                    render={({ error }) => (
                      <TextField
                        fullWidth
                        type="text"
                        label="Complemento"
                        variant={estiloDeCampo}
                        placeholder="qd, lt, apto..."
                        InputLabelProps={{ shrink: true }}
                        inputProps={{ style: { textTransform: "uppercase" } }}
                        value={dados.origComplemento}
                        onChange={(e) => {
                          setValue('origComplemento', e.target.value);
                          setDados({ ...dados, origComplemento: e.target.value });
                        }}
                        error={!!errors.origComplemento}
                        helperText={errors.origComplemento ? errors.origComplemento.message : ''}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={6}>
                  <Controller
                    name="origReferencia"
                    control={control}
                    render={({ error }) => (
                      <TextField
                        fullWidth
                        type="text"
                        label="Referência"
                        variant={estiloDeCampo}
                        placeholder="próx. a..."
                        InputLabelProps={{ shrink: true }}
                        inputProps={{ style: { textTransform: "uppercase" } }}
                        value={dados.origReferencia}
                        onChange={(e) => {
                          setValue('origReferencia', e.target.value);
                          setDados({ ...dados, origReferencia: e.target.value });
                        }}
                        error={!!errors.origReferencia}
                        helperText={errors.origReferencia ? errors.origReferencia.message : ''}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={5}>
                  <Controller
                    name="origBairro"
                    control={control}
                    render={({ error }) => (
                      <TextField
                        fullWidth
                        type="text"
                        label="Bairro"
                        variant={estiloDeCampo}
                        placeholder=""
                        InputLabelProps={{ shrink: true }}
                        inputProps={{ style: { textTransform: "uppercase" } }}
                        value={dados.origBairro}
                        onChange={(e) => {
                          setValue('origBairro', e.target.value);
                          setDados({ ...dados, origBairro: e.target.value });
                        }}
                        error={!!errors.origBairro}
                        helperText={errors.origBairro ? errors.origBairro.message : ''}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={5}>
                  <Controller
                    name="origCidade"
                    control={control}
                    render={({ error }) => (
                      <TextField
                        fullWidth
                        type="text"
                        label="Cidade"
                        variant={estiloDeCampo}
                        placeholder=""
                        InputLabelProps={{ shrink: true }}
                        inputProps={{ style: { textTransform: "uppercase" } }}
                        value={dados.origCidade}
                        onChange={(e) => {
                          setValue('origCidade', e.target.value);
                          setDados({ ...dados, origCidade: e.target.value });
                        }}
                        error={!!errors.origCidade}
                        helperText={errors.origCidade ? errors.origCidade.message : ''}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12} sm={2} md={2}>
                  <Controller
                    name="origEstado"
                    control={control}
                    render={({ error }) => (
                      <TextField
                        fullWidth
                        type="text"
                        label="Estado"
                        variant={estiloDeCampo}
                        placeholder=""
                        InputLabelProps={{ shrink: true }}
                        inputProps={{ style: { textTransform: "uppercase" } }}
                        value={dados.origEstado}
                        onChange={(e) => {
                          setValue('origEstado', e.target.value);
                          setDados({ ...dados, origEstado: e.target.value });
                        }}
                        error={!!errors.origEstado}
                        helperText={errors.origEstado ? errors.origEstado.message : ''}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12} sm={10} md={12}>
                  <Controller
                    name="origAddFavorito"
                    type="checkbox"
                    control={control}
                    as={
                      <FormControlLabel
                        label="Adicionar aos favoritos"
                        control={
                          <Checkbox
                            checked={dados.origAddFavorito}
                            onChange={(e) => {
                              setValue('origAddFavorito', e.target.checked);
                              setDados({ ...dados, origAddFavorito: e.target.checked });
                            }}
                          />
                        }
                      />
                    }
                  />
                </Grid>
                {dados.origAddFavorito &&
                  <div style={{ marginLeft: '10px', marginRight: '10px', width: '100%' }}>
                    <Grid container spacing={2} direction="row">
                      <Grid item xs={12} sm={9}>
                        <Controller
                          name="origNomeCliente"
                          control={control}
                          render={({ onChange, value }) => (
                            <TextField
                              fullWidth
                              type="text"
                              label="Nome Cliente"
                              variant={estiloDeCampo}
                              InputLabelProps={{ shrink: true }}
                              inputProps={{ style: { textTransform: "uppercase" } }}
                              value={value}
                              onChange={(ev) => { onChange(ev.target.value) }}
                            />
                          )}
                        />
                      </Grid>
                      <Grid item xs={12} sm={3}>
                        <Controller
                          name="origTelefoneCliente"
                          control={control}
                          render={() => (
                            <InputMask
                              mask={mascara}
                              maskChar=" "
                              disabled={false}
                              value={dados.origTelefoneCliente}
                              onChange={(ev) => {
                                setDados({...dados, origTelefoneCliente: ev.target.value});
                                setValue('origTelefoneCliente', ev.target.value);
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
                                  label="Telefone Cliente"
                                  variant={estiloDeCampo}
                                  placeholder="(99)99999-9999"
                                  InputLabelProps={{ shrink: true }}
                                />
                              }
                            </InputMask>
                          )}
                        />
                      </Grid>
                    </Grid>
                  </div>
                }
              </Grid>
            </Grid>
          </CardContent>
          <CardActions>
            <div style={{ width: '100%' }} >
              <Divider />
              <div className={classes.barraBotaoEmLinha}>
                <Button size="small" onClick={anterior}>
                  {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
                  Anterior
                </Button>
                <MobileStepper
                  steps={qtdeTelas}
                  position="static"
                  variant="text"
                  activeStep={tela - 1}
                  style={{ backgroundColor: '#FFF' }}
                />
                <Button size="small" type="submit" >
                  Próximo
                  {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
                </Button>
              </div>
            </div>
          </CardActions>
        </Card>
      </form>
      <ModalPesquisa
        abrir={abrirModal}
        setAbrir={setAbrirModal}
        titulo='Endereço'
        subtitulo='Pesquisa de endereço'
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
  )
}

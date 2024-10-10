import React, {useState, useEffect} from 'react';
import { 
  Button, Card, CardActions, CardContent, Checkbox, Divider, FormControlLabel, 
  Grid, IconButton, MobileStepper, TextField, Tooltip, Typography 
} from '@material-ui/core';
import { 
  EmojiTransportation, Search, KeyboardArrowRight, KeyboardArrowLeft 
} from '@material-ui/icons';
import InputMask from 'react-input-mask';
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers';
import { useTheme } from '@material-ui/core/styles';
import Cabecalho from './Cabecalho';
import * as service from '../../services/EnderecoService';
import { useAlerta } from '../../contexts/AlertaCtx';
import { TIPO_ERRO } from '../../utils/global';
import { useSolicitacao } from '../../contexts/SolicitacaoCtx';
import { useGeral } from '../../contexts/GeralCtx';
import ModalPesquisa from '../../components/ModalPesquisa';
import MyTablePesquisa from '../../components/MyTablePesquisa';

import schema from './EntregaSch';
import Styles from './Styles';
import PageCss from '../PagesCss';


export default function Entrega() {

  const css = PageCss();
  const classes = Styles();
  const theme = useTheme();
  const { setConteudo } = useAlerta();
  const [abrirModal, setAbrirModal] = useState(false);
  const [dadosPesquisa, setDadosPesquisa] = useState();
  const [mascara, setMascara] = useState("(99)99999-9999");
  const { dados, setDados, tela, setTela, qtdeTelas } = useSolicitacao();

  const { 
    auxId, setAuxId, estiloDeCampo, buscarDados, setBuscarDados 
  } = useGeral();

  const valoresIniciais = { 
    destCep: dados.destCep,
    destLogradouro: dados.destLogradouro,
    destNumero: dados.destNumero,
    destComplemento: dados.destComplemento,
    destReferencia: dados.destReferencia,
    destBairro: dados.destBairro,
    destCidade: dados.destCidade,
    destEstado: dados.destEstado,
    destAddFavorito: dados.destAddFavorito,
    destNomeCliente: dados.destNomeCliente,
    destTelefoneCliente: dados.destTelefoneCliente,
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
      setValue('destLogradouro', response.data.logradouro ? response.data.logradouro : '');
      setValue('destComplemento', response.data.complemento ? response.data.complemento : '');
      setValue('destBairro', response.data.bairro ? response.data.bairro : '');
      setValue('destCidade', response.data.cidade ? response.data.cidade : '');
      setValue('destEstado', response.data.estado ? response.data.estado : '');
      setDados({
        ...dados, 
        destLogradouro: response.data.logradouro ? response.data.logradouro : '',
        destComplemento: response.data.complemento ? response.data.complemento : '',
        destBairro: response.data.bairro ? response.data.bairro : '',
        destIdCidade: response.data.cidadeId ? response.data.cidadeId : '',
        destCidade: response.data.cidade ? response.data.cidade : '',
        destEstado: response.data.estado ? response.data.estado : '',
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
            setValue('destCep', data.cep ? data.cep : '');
            setValue('destLogradouro', data.logradouro ? data.logradouro : '');
            setValue('destNumero', data.numero ? data.numero : '');
            setValue('destComplemento', data.complemento ? data.complemento : '');
            setValue('destReferencia', data.referencia ? data.referencia : '');
            setValue('destBairro', data.bairro ? data.bairro : '');
            setValue('destCidade', data.municipio.nome ? data.municipio.nome : '');
            setValue('destEstado', data.municipio.estado.sigla ? data.municipio.estado.sigla : '');
            setDados({
              ...dados, 
              destCep: data.cep ? data.cep : '',
              destLogradouro: data.logradouro ? data.logradouro : '',
              destNumero: data.numero ? data.numero : '',
              destComplemento: data.complemento ? data.complemento : '',
              destReferencia: data.referencia ? data.referencia : '',
              destBairro: data.bairro ? data.bairro : '',
              destIdCidade: data.municipio.id ? data.municipio.id : '',
              destCidade: data.municipio.nome ? data.municipio.nome : '',
              destEstado: data.municipio.estado.sigla ? data.municipio.estado.sigla : '',
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
      <form onSubmit={handleSubmit( submitForm )} >
        <Card>
          <Cabecalho/>
          <CardContent>
            <Grid container direction="row">
              <Grid item xs={12}>
                <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <div className={classes.tituloPagina}>
                      <EmojiTransportation style={{ color: '#FEC601', marginRight: '6px' }} />
                      <Typography variant="subtitle1">Local de Entrega</Typography>
                    </div>
                    <div className={classes.subtituloPagina}>
                      <Typography variant="body2">Informe os dados do local de entrega</Typography>
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
                    name="destCep"
                    control={control}
                    render={({ onChange, onBlur, error }) => (
                      <InputMask
                        mask="99999-999"
                        maskChar=" "
                        disabled={false}
                        value={dados.destCep}
                        onChange={(e) => {
                          setDados({ ...dados, destCep: e.target.value });
                          setValue('destCep', e.target.value);
                        }}
                        onBlur={(e) => onBlurCep(e)}
                      >
                        {(inputProps) =>
                          <TextField
                            {...inputProps}
                            fullWidth
                            type="text"
                            label="CEP"
                            name="destCep"
                            variant={estiloDeCampo}
                            placeholder="99999-999"
                            InputLabelProps={{ shrink: true }}
                            error={!!errors.destCep}
                            helperText={errors.destCep ? errors.destCep.message : ''}
                          />
                        }
                      </InputMask>
                    )}
                  />
                </Grid>
                <Grid item xs={12} sm={8} md={8}>
                  <Controller
                    name="destLogradouro"
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
                        value={dados.destLogradouro}
                        onChange={(e) => {
                          setDados({ ...dados, destLogradouro: e.target.value });
                          setValue('destLogradouro', e.target.value);
                        }}
                        error={!!errors.destLogradouro}
                        helperText={errors.destLogradouro ? errors.destLogradouro.message : ''}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12} sm={2} md={2}>
                  <Controller
                    name="destNumero"
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
                        value={dados.destNumero}
                        onChange={(e) => {
                          setValue('destNumero', e.target.value);
                          setDados({ ...dados, destNumero: e.target.value });
                        }}
                        error={!!errors.destNumero}
                        helperText={errors.destNumero ? errors.destNumero.message : ''}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={6}>
                  <Controller
                    name="destComplemento"
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
                        value={dados.destComplemento}
                        onChange={(e) => {
                          setValue('destComplemento', e.target.value);
                          setDados({ ...dados, destComplemento: e.target.value });
                        }}
                        error={!!errors.destComplemento}
                        helperText={errors.destComplemento ? errors.destComplemento.message : ''}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={6}>
                  <Controller
                    name="destReferencia"
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
                        value={dados.destReferencia}
                        onChange={(e) => {
                          setValue('destReferencia', e.target.value);
                          setDados({ ...dados, destReferencia: e.target.value });
                        }}
                        error={!!errors.destReferencia}
                        helperText={errors.destReferencia ? errors.destReferencia.message : ''}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={5}>
                  <Controller
                    name="destBairro"
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
                        value={dados.destBairro}
                        onChange={(e) => {
                          setValue('destBairro', e.target.value);
                          setDados({ ...dados, destBairro: e.target.value });
                        }}
                        error={!!errors.destBairro}
                        helperText={errors.destBairro ? errors.destBairro.message : ''}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={5}>
                  <Controller
                    name="destCidade"
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
                        value={dados.destCidade}
                        onChange={(e) => {
                          setValue('destCidade', e.target.value);
                          setDados({ ...dados, destCidade: e.target.value });
                        }}
                        error={!!errors.destCidade}
                        helperText={errors.destCidade ? errors.destCidade.message : ''}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12} sm={2} md={2}>
                  <Controller
                    name="destEstado"
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
                        value={dados.destEstado}
                        onChange={(e) => {
                          setValue('destEstado', e.target.value);
                          setDados({ ...dados, destEstado: e.target.value });
                        }}
                        error={!!errors.destEstado}
                        helperText={errors.destEstado ? errors.destEstado.message : ''}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12} sm={10} md={12}>
                  <Controller
                    name="destAddFavorito"
                    type="checkbox"
                    control={control}
                    as={
                      <FormControlLabel
                        label="Adicionar aos favoritos"
                        control={
                          <Checkbox
                            checked={dados.destAddFavorito}
                            onChange={(e) => {
                              setValue('destAddFavorito', e.target.checked);
                              setDados({ ...dados, destAddFavorito: e.target.checked });
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
                          name="destNomeCliente"
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
                          name="destTelefoneCliente"
                          control={control}
                          render={() => (
                            <InputMask
                              mask={mascara}
                              maskChar=" "
                              disabled={false}
                              value={dados.destTelefoneCliente}
                              onChange={(ev) => {
                                setDados({...dados, destTelefoneCliente: ev.target.value});
                                setValue('destTelefoneCliente', ev.target.value);
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

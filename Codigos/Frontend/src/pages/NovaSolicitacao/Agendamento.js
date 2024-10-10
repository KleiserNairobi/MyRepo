import React, {useEffect, useState} from 'react';
import { Button, Card, CardActions, CardContent, CircularProgress, Divider, Grid, IconButton, MenuItem, MobileStepper, TextField, Typography } from '@material-ui/core';
import { KeyboardDatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import { Alarm, KeyboardArrowLeft, KeyboardArrowRight, TransferWithinAStation, YoutubeSearchedFor } from '@material-ui/icons';
import { useTheme } from '@material-ui/core/styles';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers';
import DateFnsUtils from '@date-io/date-fns';
import { format, differenceInMinutes } from "date-fns";
import ptBrLocale from "date-fns/locale/pt-BR";
import ReactInputMask from 'react-input-mask';
import * as service from '../../services/AgendamentoService';
import { useGeral } from '../../contexts/GeralCtx';
import { useAlerta } from '../../contexts/AlertaCtx';
import { useSolicitacao } from '../../contexts/SolicitacaoCtx';
import { TIPO_ERRO } from '../../utils/global';
import ModalPesquisa from '../../components/ModalPesquisa';
import MyTablePesquisa from '../../components/MyTablePesquisa';
import Cabecalho from './Cabecalho';
import schema from './AgendamentoSch';
import Styles from './Styles';
import PageCss from '../PagesCss';


class LocalizedUtils extends DateFnsUtils {
  getDatePickerHeaderText(date) {
    return format(date, "d MMM yyyy", { locale: this.locale });
  }
}

export default function Agendamento() {

  const css = PageCss();
  const classes = Styles();
  const theme = useTheme();
  const { auxId, setAuxId, estiloDeCampo, buscarDados, setBuscarDados } = useGeral();
  const { setConteudo } = useAlerta();
  const { tela, setTela, qtdeTelas, dados, setDados, pgto, setPgto } = useSolicitacao();
  const [abrirModal, setAbrirModal] = useState(false);
  const [dadosPesquisa, setDadosPesquisa] = useState();
  const [progresso, setProgresso] = useState(false);

  const valoresIniciais = { 
    tipoAgendamento: dados.tipoAgendamento,
    qtdeRepeticao: dados.qtdeRepeticao,
    dataExecucao: dados.dataExecucao,
    horaExecucao: dados.horaExecucao,    
    idEntregadorPref: dados.idEntregadorPref
  };

  const colunasTabPesquisa = [
    { title: 'ID', field: 'id', cellStyle: {width: '20px', fontSize: 13} },
    { title: 'Nome', field: 'nome', cellStyle: {width: '350px', fontSize: 13} },
    { title: 'E-Mail', field: 'email', cellStyle: {width: '350px', fontSize: 13} },
  ]

  const { handleSubmit, register, errors, control, setValue } = useForm({
    mode: 'all',
    defaultValues: valoresIniciais,
    resolver: yupResolver(schema)
  });

  function anterior() {
    setTela(tela - 1);
  }

  // Effect para buscar dados do entregador - sem ter disparado onBlur
  useEffect(() => {
    if (buscarDados) {
      async function getUnico() {
        try {
          const { data } = await service.obtem(`/pessoas/${auxId}?campos=nome`);
          if (data) {
            setValue('entregador', auxId);
            setValue('nomeEntregador', data.nome)
            setAuxId(-1);
            setDados({
              ...dados, 
              idEntregadorPref: auxId,
            });            
          }
        } catch (error) {
          setValue('entregador', null);
          setValue('nomeEntregador', null)
          setAuxId(-1);
          setConteudo({
            tipo: TIPO_ERRO,
            descricao: 'Ocorreu um erro ao buscar os dados do Entregador',
            exibir: true
          });
        }
      }
      getUnico();
    }
    return () => {      
      setBuscarDados(false);
    }
  }, [auxId, setAuxId, setValue, dados, setDados, buscarDados, setBuscarDados, setConteudo]);

  // Busca dados do entregador - quando ocorre onBlur
  function onBlurEntregador(ev) {
    const id = ev.target.value;    
    if (id === null || id === '') {
      return;
    }
    service.obtem(`pessoas/${id}`)
    .then(response => {
      if (response.data.entregador) {
        setValue('nomeEntregador', response.data.nome ? response.data.nome : '');
        setDados({...dados, idEntregadorPref: auxId});
      } else {
        setValue('entregador', '');
        setValue('nomeEntregador', '')
        setConteudo({
          tipo: TIPO_ERRO,
          descricao: 'O código informado não corresponde a um entregador.',
          exibir: true
        });  
      }
    })
    .catch(erro => {
      setValue('entregador', '');
      setValue('nomeEntregador', '')      
      setConteudo({
        tipo: TIPO_ERRO,
        descricao: erro.response.data.detalhe,
        exibir: true
      });
    })
  }

  // Abre modal para escolha do entregador
  function carregaDadosEntregador() {
    setAbrirModal(true);
    service.obtem('/pessoas/entregadores')
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

  function submitForm(data) {
    setProgresso(true);

    const dataAtual = format(new Date(), 'yyyy-MM-dd') ;    
    const dataExecucao = format(data.dataExecucao, 'yyyy-MM-dd');

    let horaAtual = new Date();
    horaAtual = `${horaAtual.getHours()}:${horaAtual.getMinutes()}:00`;
    const horaExecucao = `${data.horaExecucao}:00`;

    if (dataAtual > dataExecucao) {
      setProgresso(false);
      setConteudo({
        tipo: TIPO_ERRO,
        descricao: 'A Data de Execução tem que ser maior ou igual a data atual.',
        exibir: true
      });
      return
    }

    if (dataExecucao === dataAtual) {
      const dataHoraAtual = new Date(`${dataAtual} ${horaAtual}`);
      const dataHoraExecucao = new Date(`${dataExecucao} ${horaExecucao}`);
      const diferenca = differenceInMinutes(dataHoraExecucao, dataHoraAtual);

      if (diferenca < 30) {
        setProgresso(false);
        setConteudo({
          tipo: TIPO_ERRO,
          descricao: 'O intervalo entre a hora atual e hora de execução tem que ser superior a 30 minutos.',
          exibir: true
        });
        return
      }
    }

    service.insere('/agendamentos', dados)
    .then(response => {
      if (response.data) {
        const valor = pgto.vlrPercurso * dados.qtdeRepeticao; 
        setDados({...dados, idAgendamento: response.data.id, idEntrega: ""});
        setPgto({
          ...pgto, 
          idAgendamento: response.data.id, 
          idEntrega: "",
          qtdeRepeticao: dados.qtdeRepeticao,
          vlrTotal: valor
        });
        setProgresso(false);
        setTela(8);
      }
    })
    .catch(error => {
      setProgresso(false);
      setConteudo({
        tipo: TIPO_ERRO,
        descricao: error.response.data.detalhe,
        exibir: true
      });
    });
  }

  return (
    <div>
      <form onSubmit={handleSubmit( submitForm )} >
        <Card>
          <Cabecalho/>
          <CardContent>
            <Grid container direction="row">
              <Grid item xs={12} >
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <div className={classes.tituloPagina}>
                    <Alarm style={{ color: '#FEC601', marginRight: '6px' }} />
                    <Typography variant="subtitle1">Agendamento</Typography>
                  </div>
                  <div className={classes.subtituloPagina}>
                    <Typography variant="body2">Informe os dados do agendamento</Typography>
                  </div>
                </div>
              </Grid>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Controller
                    name="tipoAgendamento"
                    control={control}                    
                    render={({ error, onChange }) => (
                      <TextField
                        select
                        fullWidth
                        label="Tipo de Agendamento"
                        variant={estiloDeCampo}
                        InputLabelProps={{ shrink: true }}
                        error={!!errors.tipoAgendamento}
                        helperText={errors.tipoAgendamento ? errors.tipoAgendamento.message : ''}
                        value={dados.tipoAgendamento}
                        onChange={(e) => {
                          setDados({ ...dados, tipoAgendamento: e.target.value });
                          setValue('tipoAgendamento', e.target.value);
                          if (e.target.value === "U") {
                            setValue('qtdeRepeticao', 1);
                            setDados({ ...dados, qtdeRepeticao: 1 });
                          }
                        }}                        
                      >
                        <MenuItem key="U" value="U">ÚNICO</MenuItem>
                        <MenuItem key="D" value="D">DIÁRIO</MenuItem>
                        <MenuItem key="S" value="S">SEMANAL</MenuItem>
                        <MenuItem key="Q" value="Q">QUINZENAL</MenuItem>
                        <MenuItem key="M" value="M">MENSAL</MenuItem>
                      </TextField>
                    )}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Controller
                    name="qtdeRepeticao"
                    control={control}                    
                    render={({ error, onChange }) => (
                      <TextField
                        fullWidth
                        disabled={dados.tipoAgendamento === "U"}
                        type="number"
                        label="Qtde Repetição"
                        variant={estiloDeCampo}
                        placeholder="EX.: 1"
                        InputLabelProps={{ shrink: true }}
                        error={!!errors.qtdeRepeticao}
                        helperText={errors.qtdeRepeticao ? errors.qtdeRepeticao.message : ''}
                        value={dados.qtdeRepeticao}
                        onChange={(e) => {
                          setDados({ ...dados, qtdeRepeticao: e.target.value });
                          setValue('qtdeRepeticao', e.target.value);
                        }}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <MuiPickersUtilsProvider utils={LocalizedUtils} locale={ptBrLocale} >
                    <Controller
                      name="dataExecucao"
                      control={control}
                      render={({ error, onChange }) => (
                        <KeyboardDatePicker
                          autoOk
                          fullWidth
                          name="dataExecucao"
                          label="Data de Execução"
                          format="dd/MM/yyyy"
                          cancelLabel="Cancelar"
                          variant={estiloDeCampo}
                          placeholder="dd/mm/aaaa"
                          InputLabelProps={{ shrink: true }}
                          error={!!errors.dataExecucao}
                          helperText={errors.dataExecucao ? errors.dataExecucao.message : ''}
                          value={dados.dataExecucao}
                          onChange={(event, row) => {
                            setDados({ ...dados, dataExecucao: event });
                            setValue('dataExecucao', event);
                          }}
                        />
                      )}
                    />
                  </MuiPickersUtilsProvider>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Controller
                    name="horaExecucao"
                    control={control}
                    render={({ onChange, onBlur, value }) => (
                      <ReactInputMask
                        mask="99:99"
                        maskChar=" "
                        value={dados.horaExecucao}
                        onChange={(ev) => {
                          setDados({ ...dados, horaExecucao: ev.target.value });
                          setValue("horaExecucao", ev.target.value)
                        }}
                      >
                        {(inputProps) =>
                          <TextField
                            {...inputProps}
                            fullWidth
                            type="text"
                            label="Hora Execução"
                            variant={estiloDeCampo}
                            placeholder="00:00"
                            InputLabelProps={{ shrink: true }}
                            error={!!errors.horaExecucao}
                            helperText={errors.horaExecucao ? errors.horaExecucao.message : ''}
                          />
                        }
                      </ReactInputMask>
                    )}
                  />
                </Grid>
                <Grid item xs={12} style={{marginTop: '20px'}} >
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <div className={classes.tituloPagina}>
                      <TransferWithinAStation style={{ color: '#FEC601', marginRight: '6px' }} />
                      <Typography variant="subtitle1">Entregador</Typography>
                    </div>
                    <div className={classes.subtituloPagina} style={{marginBottom: '10px'}}>
                      <Typography variant="body2">Caso deseje, informe um entregador de sua preferência</Typography>
                    </div>
                  </div>
                </Grid>
                <Grid item xs={12} sm={3} >
                  <Controller
                    name="idEntregadorPref"
                    control={control}                    
                    render={({ error, onChange }) => (
                      <TextField
                        fullWidth
                        type="number"
                        label="Entregador"
                        variant={estiloDeCampo}
                        placeholder="EX.: 1"
                        InputLabelProps={{ shrink: true }}
                        error={!!errors.idEntregadorPref}
                        helperText={errors.idEntregadorPref ? errors.idEntregadorPref.message : ''}
                        InputProps={{
                          onBlur: (ev) => onBlurEntregador(ev),
                          endAdornment: 
                            <IconButton
                              size="small"
                              onClick={() => carregaDadosEntregador()}
                            >
                              <YoutubeSearchedFor fontSize="small" />
                            </IconButton>
                        }}
                        value={dados.idEntregadorPref}
                        onChange={(ev) => {
                          setDados({ ...dados, idEntregadorPref: ev.target.value });
                          setValue("idEntregadorPref", ev.target.value)
                        }}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12} sm={9} >
                  <TextField
                    fullWidth
                    disabled
                    type="text"
                    name="nomeEntregador"
                    label="Nome Entregador"
                    variant={estiloDeCampo}
                    inputRef={register}
                    placeholder="EX.: JOSÉ DE ASSIS"
                    InputLabelProps={{ shrink: true }}
                    inputProps={{ style: { textTransform: "uppercase" } }}
                  />
                </Grid>
              </Grid>
            </Grid>
            <div style={{ display: 'flex', width: '100%', marginTop: '20px', marginRight: '10px' }}>
              <div style={{ flex: 1 }} />
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disableElevation
                className={css.formBotaoDeAcao}
              > 
              {progresso ? <CircularProgress style={{ marginRight: 10, color: '#000' }} size={16} /> : null}
              Confirmar
              </Button>
            </div>
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
                <Button size="small" disabled >
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
        titulo='Entregadores'
        subtitulo='Pesquisa de entregador'
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

import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { 
  Avatar, Button, Card, CardContent, CardHeader, Divider, Grid, IconButton, TextField 
} from '@material-ui/core';
import { ArrowBack, AccountBalanceWallet, YoutubeSearchedFor } from '@material-ui/icons';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers';
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import format from "date-fns/format";
import ptBrLocale from "date-fns/locale/pt-BR";
import MyTFFloatNumberFormat2Digits from '../../components/MyTFFloatNumberFormat2Digits';
import CabecalhoForm from '../../components/CabecalhoForm';
import * as service from '../../services/GatewayTaxaService';
import { useAlerta } from '../../contexts/AlertaCtx';
import { useGeral } from '../../contexts/GeralCtx';
import PageCss from '../PagesCss';
import schema from './GatewayTaxaSch';
import { TIPO_ERRO, TIPO_SUCESSO } from '../../utils/global';
import ModalPesquisa from '../../components/ModalPesquisa';
import MyTablePesquisa from '../../components/MyTablePesquisa';




class LocalizedUtils extends DateFnsUtils {
  getDatePickerHeaderText(date) {
    return format(date, "d MMM yyyy", { locale: this.locale });
  }
}

export default function GatewayForm() {

  const css = PageCss();
  const history = useHistory();
  const { setConteudo } = useAlerta();
  const [nomeGateway, setNomeGateway] = useState('');
  const [debito, setDebito] = useState('');
  const [creditoAvista, setCreditoAvista] = useState('');
  const [creditoParcelado, setCreditoParcelado] = useState('');
  const [creditoAntecipacao, setCreditoAntecipacao] = useState('');
  const [boleto, setBoleto] = useState('');
  const [taxaAdministrativa, setTaxaAdministrativa] = useState('');
  const [abrirModal, setAbrirModal] = useState(false);
  const [dadosPesquisa, setDadosPesquisa] = useState();
  const { 
    id, auxId, setAuxId, alterar, buscarDados, setBuscarDados, 
    setAlterar, setCarregar, estiloDeCampo   
  } = useGeral();


  const valoresIniciais = {     
    gateway: {id: null},
    data: null,
    debito: '',
    creditoAvista: '',
    creditoParcelado: '',
    creditoAntecipacao: '',
    boleto: '',
    taxaAdministrativa: ''
  };

  const { register, handleSubmit, errors, reset, setValue, control } = useForm({
    mode: 'all',
    defaultValues: valoresIniciais,
    resolver: yupResolver(schema)
  });

  const colunasTabPesquisa = [
    { title: 'ID', field: 'id', width: 20 },
    { title: 'Tipo Gateway', field: 'tipoGateway', width: 60 },
    { title: 'Nome', field: 'nome', width: 250 },
    { title: 'Ativo', field: 'ativo', type: 'boolean', width: 20 },
  ]

  // Abre modal para escolha do gateway
  function carregaDadosGateway() {
    setAbrirModal(true);
    service.obtem('/gateways?campos=id,tipoGateway,nome,ativo')
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

  // Busca dados do gateway - quando ocorre onBlur
  async function onBlurGateway(ev) {
    if (ev.target.value === '') {
      setNomeGateway('');
    } else {
      const codigo = ev.target.value;
      try {
        const { data } = await service.obtem(`/gateways/${codigo}?campos=nome`);
        if (data) {
          setValue('gateway.id', codigo );
          setNomeGateway(data.nome);
        }
      } catch (error) {
        setNomeGateway('');
        setConteudo({
          tipo: TIPO_ERRO,
          descricao: error.response.data.detalhe,
          exibir: true
        });
      }
    }
  }

  // Effect para buscar dados do gateway - sem ter disparado onBlur
  useEffect(() => {
    if (buscarDados) {
      async function getUnico() {
        try {
          const { data } = await service.obtem(`/gateways/${auxId}?campos=nome`);
          if (data) {
            setValue('gateway.id', auxId);
            setNomeGateway(data.nome);
            setAuxId(-1);
          }
        } catch (error) {
          setValue('gateway.id', null);
          setNomeGateway('');
          setAuxId(-1);
          setConteudo({
            tipo: TIPO_ERRO,
            descricao: 'Ocorreu um erro ao buscar os dados do Gateway',
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

  // Effect relativo a alteração
  useEffect(() => {
    if (alterar) {
      async function buscaDado() {
        try {
          const resposta = await service.obtem(`/gateway-taxas/${id}?campos=-id`);
          if (resposta.data) {            
            setValue('gateway.id', resposta.data.gateway.id);
            setValue('data', resposta.data.data);
            setValue('debito', resposta.data.debito * 100);
            setValue('creditoAvista', resposta.data.creditoAvista * 100);
            setValue('creditoParcelado', resposta.data.creditoParcelado * 100);
            setValue('creditoAntecipacao', resposta.data.creditoAntecipacao * 100);
            setValue('boleto', resposta.data.boleto * 100);
            setValue('taxaAdministrativa', resposta.data.taxaAdministrativa * 100);
            setNomeGateway(resposta.data.gateway.nome);
            setDebito(resposta.data.debito * 100);
            setCreditoAvista(resposta.data.creditoAvista * 100);
            setCreditoParcelado(resposta.data.creditoParcelado * 100);
            setCreditoAntecipacao(resposta.data.creditoAntecipacao * 100);
            setBoleto(resposta.data.boleto * 100);
            setTaxaAdministrativa(resposta.data.taxaAdministrativa * 100);
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
          const resposta = await service.altera(`/gateway-taxas/${id}`, data);
          if (resposta) {
            setConteudo({
              tipo: TIPO_SUCESSO,
              descricao: 'Registro alterado com sucesso!',
              exibir: true
            });
            reset(valoresIniciais);
            setAlterar(false);
            setCarregar(true);
            history.push('/gateways-taxas');  
          }
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
          const resposta = await service.insere('/gateway-taxas', data);
          if (resposta) {
            setConteudo({
              tipo: TIPO_SUCESSO,
              descricao: 'Registro inserido com sucesso!',
              exibir: true
            });
          }
          reset(valoresIniciais);
          setNomeGateway('');
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
        titulo="Gateway Taxa"
        subtitulo="Adição de nova taxa de gateway"
        linkPagina="/gateways-taxas"
        icone={<ArrowBack />}
        tituloBotao="Retornar"
      />
      <br/>
      <form onSubmit={handleSubmit(submitForm)}>
        <Card variant="outlined">
          <CardContent>
            <Card>
              <CardHeader
                avatar={<Avatar className={css.avatar}><AccountBalanceWallet /></Avatar>}
                title="Gateway Taxa"
                subheader="Informe os dados das taxas do gateway"
                className={css.cartaoTitulo}
              />
              <CardContent>
                <Grid container direction="row" spacing={2}>
                  
                  <Grid item xs={12} sm={2} >
                    <TextField
                      fullWidth
                      type="number"
                      name="gateway.id"
                      label="Gateway"
                      variant={estiloDeCampo}
                      inputRef={register}
                      placeholder="EX.: 1"
                      InputLabelProps={{ shrink: true }}
                      error={!!errors.gateway}
                      helperText={errors.gateway ? errors.gateway.id.message : ''}
                      InputProps={{
                        onBlur: (ev) => onBlurGateway(ev),
                        endAdornment: 
                          <IconButton
                            size="small"
                            onClick={() => carregaDadosGateway()}
                          >
                            <YoutubeSearchedFor fontSize="small" />
                          </IconButton>
                      }}
                    />
                  </Grid>

                  <Grid item xs={12} sm={8} >
                    <TextField
                      fullWidth
                      type="text"
                      name="nomeGateway"
                      label="Nome do Gateway"
                      variant={estiloDeCampo}
                      value={nomeGateway}
                      placeholder="EX.: MERCADO PAGO"
                      InputLabelProps={{ shrink: true }}
                      inputProps={{ style: { textTransform: "uppercase" } }}
                    />
                  </Grid>

                  <Grid item xs={12} sm={2}>
                    <MuiPickersUtilsProvider utils={LocalizedUtils} locale={ptBrLocale} >                  
                      <Controller
                        name="data"
                        control={control}
                        as={                   
                          <KeyboardDatePicker
                            autoOk
                            fullWidth
                            name="data"
                            label="Data Cotação"
                            format="dd/MM/yyyy"                       
                            cancelLabel="Cancelar"                        
                            variant={estiloDeCampo}
                            placeholder="dd/mm/aaaa"
                            InputLabelProps={{ shrink: true }}
                            error={!!errors.data}
                            helperText={errors.data ? errors.data.message : ''}
                          />
                        }                      
                      />
                    </MuiPickersUtilsProvider>
                  </Grid>

                  <Grid item xs={12} sm={2}>
                    <TextField
                      fullWidth
                      name="debito"
                      label="Débito"
                      variant={estiloDeCampo}
                      placeholder="0,00"
                      inputRef={register}
                      value={debito}
                      onChange={(ev)=>setDebito(ev.target.value) }
                      InputLabelProps={{ shrink: true }}
                      InputProps={{inputComponent: MyTFFloatNumberFormat2Digits } }
                      error={!!errors.debito}
                      helperText={errors.debito ? errors.debito.message : ''}
                    />
                  </Grid>

                  <Grid item xs={12} sm={2}>
                    <TextField
                      fullWidth
                      name="creditoAvista"
                      label="Crédito Avista"
                      variant={estiloDeCampo}
                      placeholder="0,00"
                      inputRef={register}
                      value={creditoAvista}
                      onChange={(ev)=>setCreditoAvista(ev.target.value) }
                      InputLabelProps={{ shrink: true }}
                      InputProps={{inputComponent: MyTFFloatNumberFormat2Digits } }
                      error={!!errors.creditoAvista}
                      helperText={errors.creditoAvista ? errors.creditoAvista.message : ''}
                    />
                  </Grid>

                  <Grid item xs={12} sm={2}>
                    <TextField
                      fullWidth
                      name="creditoParcelado"
                      label="Crédito Parcelado"
                      variant={estiloDeCampo}
                      placeholder="0,00"
                      inputRef={register}
                      value={creditoParcelado}
                      onChange={(ev)=>setCreditoParcelado(ev.target.value) }
                      InputLabelProps={{ shrink: true }}
                      InputProps={{inputComponent: MyTFFloatNumberFormat2Digits } }
                      error={!!errors.creditoParcelado}
                      helperText={errors.creditoParcelado ? errors.creditoParcelado.message : ''}
                    />
                  </Grid>

                  <Grid item xs={12} sm={2}>
                    <TextField
                      fullWidth
                      name="creditoAntecipacao"
                      label="Crédito Antecipação"
                      variant={estiloDeCampo}
                      placeholder="0,00"
                      inputRef={register}
                      value={creditoAntecipacao}
                      onChange={(ev)=>setCreditoAntecipacao(ev.target.value) }
                      InputLabelProps={{ shrink: true }}
                      InputProps={{inputComponent: MyTFFloatNumberFormat2Digits } }
                      error={!!errors.creditoAntecipacao}
                      helperText={errors.creditoAntecipacao ? errors.creditoAntecipacao.message : ''}
                    />
                  </Grid>

                  <Grid item xs={12} sm={2}>
                    <TextField
                      fullWidth
                      name="boleto"
                      label="Boleto"
                      variant={estiloDeCampo}
                      placeholder="0,00"
                      inputRef={register}
                      value={boleto}
                      onChange={(ev)=>setBoleto(ev.target.value) }
                      InputLabelProps={{ shrink: true }}
                      InputProps={{inputComponent: MyTFFloatNumberFormat2Digits } }
                      error={!!errors.boleto}
                      helperText={errors.boleto ? errors.boleto.message : ''}
                    />
                  </Grid>

                  <Grid item xs={12} sm={2}>
                    <TextField
                      fullWidth
                      name="taxaAdministrativa"
                      label="Taxa Administrativa"
                      variant={estiloDeCampo}
                      placeholder="0,00"
                      inputRef={register}
                      value={taxaAdministrativa}
                      onChange={(ev)=>setTaxaAdministrativa(ev.target.value) }
                      InputLabelProps={{ shrink: true }}
                      InputProps={{inputComponent: MyTFFloatNumberFormat2Digits } }
                      error={!!errors.taxaAdministrativa}
                      helperText={errors.taxaAdministrativa ? errors.taxaAdministrativa.message : ''}
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
                  setNomeGateway('');
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
        titulo='Gateway'
        subtitulo='Pesquisa de gateway'
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


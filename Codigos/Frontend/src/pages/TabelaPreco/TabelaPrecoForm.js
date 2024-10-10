import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { 
  Avatar, Button, Card, CardContent, CardHeader, Checkbox, Divider, FormControlLabel, 
  FormGroup, Grid, MenuItem, TextField, Typography 
} from '@material-ui/core';
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers';
import { ArrowBack, AttachMoney } from '@material-ui/icons';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers';
import DateFnsUtils from '@date-io/date-fns';
import format from "date-fns/format";
import ptBrLocale from "date-fns/locale/pt-BR";
import CabecalhoForm from '../../components/CabecalhoForm';
import MyTFFloatNumberFormat3Digits from '../../components/MyTFFloatNumberFormat3Digits';
import MyTFMoneyNumberFormat from '../../components/MyTFMoneyNumberFormat';
import * as service from '../../services/TabelaPrecoService';
import { useAlerta } from '../../contexts/AlertaCtx';
import { useGeral } from '../../contexts/GeralCtx';
import PageCss from '../PagesCss';
import schema from './TabelaPrecoSch';
import { TIPO_ERRO, TIPO_SUCESSO } from '../../utils/global';


class LocalizedUtils extends DateFnsUtils {
  getDatePickerHeaderText(date) {
    return format(date, "d MMM yyyy", { locale: this.locale });
  }
}

export default function TabelaPrecoForm() {

  const css = PageCss();
  const history = useHistory();
  const { setConteudo } = useAlerta();
  const { id, alterar, setAlterar, setCarregar, estiloDeCampo } = useGeral();
  const [tarifaKm, setTarifaKm] = useState('');
  const [tarifaVlr, setTarifaVlr] = useState('');
  const [ativo, setAtivo] = useState(false);
  const [padrao, setPadrao] = useState(false);

  const valoresIniciais = { 
    tipoVeiculo: '', 
    descricao: '' ,
    validadeInicio: null,
    validadeFim: null,
    tarifaKm: '',
    tarifaValor: '',
    padrao: false,
    ativo: null,
  };
  const { register, handleSubmit, errors, reset, setValue, control } = useForm({
    mode: 'all',
    defaultValues: valoresIniciais,
    resolver: yupResolver(schema)
  });

  useEffect(() => {
    if (alterar) {
      async function buscaDado() {
        try {
          const resposta = await service.obtem(`/tabela-precos/${id}?campos=-pessoas,-tabelaPrecoItem`);
          if (resposta.data) {            
            setValue('ativo', resposta.data.ativo);
            setValue('padrao', resposta.data.padrao);
            setValue('descricao', resposta.data.descricao);
            setValue('tipoVeiculo', resposta.data.tipoVeiculo);
            setValue('tarifaKm', resposta.data.tarifaKm * 1000);
            setValue('tarifaValor', resposta.data.tarifaValor * 100);
            setValue('validadeInicio', resposta.data.validadeInicio);
            setValue('validadeFim', resposta.data.validadeFim);
            setAtivo(resposta.data.ativo);
            setPadrao(resposta.data.padrao);
            setTarifaKm(resposta.data.tarifaKm * 1000);
            setTarifaVlr(resposta.data.tarifaValor * 100);
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
          const resposta = await service.altera(`/tabela-precos/${id}`, data);
          if (resposta) {
            setConteudo({
              tipo: TIPO_SUCESSO,
              descricao: 'Registro alterado com sucesso!',
              exibir: true
            });
          }
          setAlterar(false);
          setCarregar(true);
          history.push('/tabela-precos');
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
          const resposta = await service.insere('/tabela-precos', data);
          if (resposta) {
            setConteudo({
              tipo: TIPO_SUCESSO,
              descricao: 'Registro inserido com sucesso!',
              exibir: true
            });
          }
          reset(valoresIniciais);
          setTarifaKm('');
          setTarifaVlr('');
          setAtivo(false);
          setPadrao(false);
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
        titulo="Tabela de Preço"
        subtitulo="Adição de novo registro"
        linkPagina="/tabela-precos"
        icone={<ArrowBack />}
        tituloBotao="Retornar"
      />

      <form onSubmit={handleSubmit( submitForm )}>
        <Card variant="outlined">
          <CardContent>
            <Card>
              <CardHeader
                avatar={<Avatar className={css.avatar}><AttachMoney /></Avatar>}
                title="Tabela de Preço"
                subheader="Informe os dados da tabela de preço"
                className={css.cartaoTitulo}
              />
              <CardContent>
                <Grid container direction="row" spacing={2}>

                  <Grid item xs={12} sm={3}>
                    <Controller
                      name="tipoVeiculo"
                      control={control}
                      as={
                        <TextField
                          select
                          fullWidth
                          label="Tipo de Veículo"
                          variant={estiloDeCampo}                          
                          InputLabelProps={{ shrink: true }}
                          error={!!errors.tipoVeiculo}
                          helperText={errors.tipoVeiculo ? errors.tipoVeiculo.message : ''}
                        >
                          <MenuItem value=''><strong>NENHUM</strong></MenuItem>
                          <MenuItem value={'B'}>BICICLETA</MenuItem>
                          <MenuItem value={'M'}>MOTO</MenuItem>
                          <MenuItem value={'C'}>CARRO</MenuItem>
                          <MenuItem value={'CM'}>CAMINHÃO</MenuItem>
                        </TextField>
                      }
                    />
                  </Grid>

                  <Grid item xs={12} sm={9}>
                    <TextField
                      fullWidth
                      type="text"
                      name="descricao"
                      label="Descrição"
                      variant={estiloDeCampo}
                      inputRef={register}
                      placeholder="EX.: TAB. PADRÃO VEÍCULO BIKE"
                      InputLabelProps={{ shrink: true }}
                      inputProps={{ style: { textTransform: "uppercase" } }}
                      error={!!errors.descricao}
                      helperText={errors.descricao ? errors.descricao.message : ''}
                    />
                  </Grid>
                  
                  <Grid item xs={12} sm={3}>
                    <MuiPickersUtilsProvider utils={LocalizedUtils} locale={ptBrLocale} >                  
                      <Controller
                        name="validadeInicio"
                        control={control}
                        as={                   
                          <KeyboardDatePicker
                            autoOk
                            fullWidth
                            name="validadeInicio"
                            label="Início da Validade"
                            format="dd/MM/yyyy"                       
                            cancelLabel="Cancelar"                        
                            variant={estiloDeCampo}
                            placeholder="dd/mm/aaaa"
                            InputLabelProps={{ shrink: true }}
                            error={!!errors.validadeInicio}
                            helperText={errors.validadeInicio ? errors.validadeInicio.message : ''}
                          />
                        }                      
                      />
                    </MuiPickersUtilsProvider>
                  </Grid>

                  <Grid item xs={12} sm={3}>
                    <MuiPickersUtilsProvider utils={LocalizedUtils} locale={ptBrLocale} >                  
                      <Controller
                        name="validadeFim"
                        control={control}
                        as={                   
                          <KeyboardDatePicker
                            autoOk
                            fullWidth                            
                            name="validadeFim"
                            label="Fim da Validade"
                            format="dd/MM/yyyy"                       
                            cancelLabel="Cancelar"                        
                            variant={estiloDeCampo}
                            placeholder="dd/mm/aaaa"
                            InputLabelProps={{ shrink: true }}
                            error={!!errors.validadeFim}
                            helperText={errors.validadeFim ? errors.validadeFim.message : ''}
                          />
                        }                      
                      />
                    </MuiPickersUtilsProvider>
                  </Grid>

                  <Grid item xs={12} sm={3}>                 
                    <TextField
                      fullWidth
                      name="tarifaKm"
                      label="KM Básico"
                      variant={estiloDeCampo}
                      placeholder="0,000"
                      inputRef={register}
                      value={tarifaKm}
                      onChange={(ev)=>setTarifaKm(ev.target.value) }
                      InputLabelProps={{ shrink: true }}
                      InputProps={{inputComponent: MyTFFloatNumberFormat3Digits } }
                      error={!!errors.tarifaKm}
                      helperText={errors.tarifaKm ? errors.tarifaKm.message : ''}
                    />
                  </Grid>

                  <Grid item xs={12} sm={3}>                 
                    <TextField
                      fullWidth
                      name="tarifaValor"
                      label="Valor KM Básico"
                      variant={estiloDeCampo}
                      placeholder="R$ 0,00"
                      inputRef={register}
                      value={tarifaVlr}
                      onChange={(ev)=>setTarifaVlr(ev.target.value) }
                      InputLabelProps={{ shrink: true }}
                      InputProps={{inputComponent: MyTFMoneyNumberFormat } }
                      error={!!errors.tarifaValor}
                      helperText={errors.tarifaValor ? errors.tarifaValor.message : ''}
                    />
                  </Grid>

                  <FormGroup style={{marginLeft: 8, marginTop: 20 }}>
                    <Grid container direction="row" alignItems="center" item xs={12} sm={12}>
                      <FormControlLabel
                        label="Ativo"
                        inputRef={register}
                        control={<Checkbox name="ativo" checked={ativo} onChange={(ev)=>setAtivo(ev.target.checked)}/>}
                      />
                      <Typography variant={"caption"}>
                        <i>Marcar esse item dirá ao sistema que a tabela pode ser usada nas solicitações dos clientes</i>
                      </Typography> 
                    </Grid>                    
                    <Grid container direction="row"  alignItems="center" item xs={12} sm={12}>
                      <FormControlLabel
                        label="Padrão"
                        inputRef={register}
                        control={<Checkbox name="padrao" checked={padrao} onChange={(ev)=>setPadrao(ev.target.checked)}/>}
                      />
                      <Typography variant={"caption"}>
                        <i>Marcar esse item fará com que a tabela se torne a opção padrão de preços nas solicitações dos clientes</i>
                      </Typography>
                    </Grid>
                  </FormGroup>	

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
                  setTarifaKm('');
                  setTarifaVlr('');
                  setAtivo(false);
                  setPadrao(false);
                }}
                className={css.formBotaoDeAcao}
              > Limpar
              </Button>
            </div>
            
          </CardContent>
        </Card>
      </form>
    </div>
  );
}


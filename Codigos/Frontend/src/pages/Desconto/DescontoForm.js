import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { 
  Avatar, Button, Card, CardContent, CardHeader, Divider, Grid, TextField 
} from '@material-ui/core';
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers';
import { ArrowBack, MoneyOff } from '@material-ui/icons';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers';
import DateFnsUtils from '@date-io/date-fns';
import format from "date-fns/format";
import ptBrLocale from "date-fns/locale/pt-BR";
import CabecalhoForm from '../../components/CabecalhoForm';
import MyTFMoneyNumberFormat from '../../components/MyTFMoneyNumberFormat';
import * as service from '../../services/DescontoService';
import { useAlerta } from '../../contexts/AlertaCtx';
import { useGeral } from '../../contexts/GeralCtx';
import PageCss from '../PagesCss';
import schema from './DescontoSch';
import { TIPO_ERRO, TIPO_SUCESSO } from '../../utils/global';


class LocalizedUtils extends DateFnsUtils {
  getDatePickerHeaderText(date) {
    return format(date, "d MMM yyyy", { locale: this.locale });
  }
}

export default function DescontoForm() {

  const css = PageCss();
  const history = useHistory();
  const { setConteudo } = useAlerta();
  const { id, alterar, setAlterar, setCarregar, estiloDeCampo } = useGeral();
  const [valor, setValor] = useState('');
  const [piso, setPiso] = useState('');

  const valoresIniciais = {
    codigo: '',
    descricao: '', 
    valor: null, 
    piso: null,
    validadeInicio: null, 
    validadeFim: null,
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
          const resposta = await service.obtem(`/descontos/${id}`);
          if (resposta.data) {
            setValue('codigo', resposta.data.codigo);
            setValue('descricao', resposta.data.descricao);
            setValue('valor', resposta.data.valor);
            setValue('piso', resposta.data.piso);
            setValue('validadeInicio', resposta.data.validadeInicio);
            setValue('validadeFim', resposta.data.validadeFim);
            setValor(resposta.data.valor * 100);
            setPiso(resposta.data.piso * 100)
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

  function submitForm(data, e) {
    if (alterar & id > 0) {
      async function alteraDado() {
        try {
          const resposta = await service.altera(`/descontos/${id}`, data);
          if (resposta) {
            setConteudo({
              tipo: TIPO_SUCESSO,
              descricao: 'Registro alterado com sucesso!',
              exibir: true
            });
          }
          setAlterar(false);
          setCarregar(true);
          history.push('/descontos');
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
          const resposta = await service.insere('/descontos', data);
          if (resposta) {
            setConteudo({
              tipo: TIPO_SUCESSO,
              descricao: 'Registro inserido com sucesso!',
              exibir: true
            });
          }
          reset(valoresIniciais);
          setValor('');
          setPiso('');
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
        titulo="Desconto"
        subtitulo="Adição de novo desconto"
        linkPagina="/descontos"
        icone={<ArrowBack />}
        tituloBotao="Retornar"
      />

      <form onSubmit={handleSubmit( submitForm )}>
        <Card variant="outlined">
          <CardContent>
            <Card>
              <CardHeader
                avatar={<Avatar className={css.avatar}><MoneyOff /></Avatar>}
                title="Desconto"
                subheader="Informe os dados do desconto"
                className={css.cartaoTitulo}
              />
              <CardContent>
                <Grid container direction="row" spacing={2}>

                  <Grid item xs={12} sm={3}>
                    <TextField
                      fullWidth
                      type="text"
                      name="codigo"
                      label="Código"
                      variant={estiloDeCampo}
                      inputRef={register}
                      placeholder="EX.: CP-NOV2020"
                      InputLabelProps={{ shrink: true }}
                      inputProps={{ style: { textTransform: "uppercase" } }}
                      error={!!errors.codigo}
                      helperText={errors.codigo ? errors.codigo.message : ''}
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
                      placeholder="EX.: PROMO NOV 2020"
                      InputLabelProps={{ shrink: true }}
                      inputProps={{ style: { textTransform: "uppercase" } }}
                      error={!!errors.descricao}
                      helperText={errors.descricao ? errors.descricao.message : ''}
                    />
                  </Grid>
 
                  <Grid item xs={12} sm={3}>                 
                    <TextField
                      fullWidth
                      name="valor"
                      label="Valor"
                      variant={estiloDeCampo}
                      placeholder="R$ 0,00"
                      inputRef={register}
                      value={valor}
                      onChange={(ev)=>setValor(ev.target.value) }
                      InputLabelProps={{ shrink: true }}
                      InputProps={{inputComponent: MyTFMoneyNumberFormat } }
                      error={!!errors.valor}
                      helperText={errors.valor ? errors.valor.message : ''}
                    />
                  </Grid>

                  <Grid item xs={12} sm={3}>                 
                    <TextField
                      fullWidth
                      name="piso"
                      label="Piso"
                      variant={estiloDeCampo}
                      placeholder="R$ 0,00"
                      inputRef={register}
                      value={piso}
                      onChange={(ev)=>setPiso(ev.target.value) }
                      InputLabelProps={{ shrink: true }}
                      InputProps={{inputComponent: MyTFMoneyNumberFormat } }
                      error={!!errors.piso}
                      helperText={errors.piso ? errors.piso.message : ''}
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
                  setValor('');
                  setPiso('');                
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


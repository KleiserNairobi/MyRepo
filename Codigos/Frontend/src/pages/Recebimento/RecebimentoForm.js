import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Avatar, Button, Card, CardContent, CardHeader, CircularProgress, Divider, Grid, TextField } from '@material-ui/core';
import { ArrowBack, GetApp } from '@material-ui/icons';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers';
import { KeyboardDatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import ptBrLocale from "date-fns/locale/pt-BR";
import { format,  parseISO } from "date-fns";
import { useGeral } from '../../contexts/GeralCtx';
import { useAlerta } from '../../contexts/AlertaCtx';
import * as service from '../../services/RecebimentoService';
import MyTFMoneyNumberFormat from '../../components/MyTFMoneyNumberFormat';
import MyTFFloatNumberFormat2Digits from '../../components/MyTFFloatNumberFormat2Digits';
import CabecalhoForm from '../../components/CabecalhoForm';
import { TIPO_ERRO, TIPO_SUCESSO } from '../../utils/global';
import schema from './RecebimentoSch';
import PageCss from '../PagesCss';


class LocalizedUtils extends DateFnsUtils {
  getDatePickerHeaderText(date) {
    return format(date, "d MMM yyyy", { locale: this.locale });
  }
}

export default function RecebimentoForm() {

  const css = PageCss();
  const history = useHistory();
  const [progresso, setProgresso] = useState(false);
  const { setConteudo } = useAlerta();
  const { id, auxId, alterar, setAlterar, setCarregar, estiloDeCampo } = useGeral();

  const valoresIniciais = {
    "contaReceber": {"id": '', "pessoa": {"id": '', "nome": ''}}, 
    "id": '',
    "dataEmissao": null,
    "dataVencimento": null,
    "valor": '',
    "valorJuro": '',
    "valorMulta": '',
    "valorDesconto": '',
    "taxaJuro": '',
    "taxaMulta": '',
    "taxaDesconto": '',
    "dataRecebimento": null,
    "valorRecebimento": ''
  }

  const { handleSubmit, setValue, reset, control, errors } = useForm({
    mode: 'all',
    defaultValues: valoresIniciais,
    resolver: yupResolver(schema)
  });

  useEffect(() => {
    if (alterar) {
      async function buscaDado() {
        try {
          const resposta = await service.obtem(`/parcelas-conta-receber/${id}/${auxId}`);
          if (resposta.data) {
            setValue('contaReceber.id', resposta.data.contaReceber.id);
            setValue('id', resposta.data.id);
            setValue('contaReceber.pessoa.id', resposta.data.contaReceber.pessoa.id);
            setValue('contaReceber.pessoa.nome', resposta.data.contaReceber.pessoa.nome);
            setValue('dataEmissao', parseISO(resposta.data.dataEmissao, 'dd-MM-yyyy'));
            setValue('dataVencimento', parseISO(resposta.data.dataVencimento, 'dd-MM-yyyy'));
            setValue('valor', resposta.data.valor * 100);
            setValue('taxaJuro', resposta.data.taxaJuro * 100);
            setValue('taxaMulta', resposta.data.taxaMulta * 100);
            setValue('taxaDesconto', resposta.data.taxaDesconto * 100);
            setValue('valorJuro', resposta.data.valorJuro * 100);
            setValue('valorMulta', resposta.data.valorMulta * 100);
            setValue('valorDesconto', resposta.data.valorDesconto * 100);
            setValue('dataRecebimento', parseISO(resposta.data.dataRecebimento, 'dd-MM-yyyy'));
            setValue('valorRecebimento', resposta.data.valorRecebimento * 100);
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
  }, [id, auxId, alterar, setConteudo, setValue])

  function submitForm(data) {
    if (alterar & id > 0) {
      async function alteraDado() {
        try {
          const resposta = await service.altera('/parcelas-conta-receber/efetuar-recebimento', data);
          if (resposta) {
            setConteudo({
              tipo: TIPO_SUCESSO,
              descricao: 'Conta baixada com sucesso!',
              exibir: true
            });
            setAlterar(false);
            setCarregar(true);
            setProgresso(false);
            history.push('/recebimentos');  
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
        titulo="Recebimento"
        subtitulo="Baixa de conta a receber"
        linkPagina="/recebimentos"
        icone={<ArrowBack />}
        tituloBotao="Retornar"
        exibirBotao={false}
      />
      <form onSubmit={handleSubmit(submitForm)}>
        <Card>
          <CardContent>
            <Card>
              <CardHeader
                avatar={<Avatar className={css.avatar}><GetApp /></Avatar>}
                title="Recebimento"
                subheader="Informe os dados para baixa da conta a receber"
                className={css.cartaoTitulo}
              />
              <CardContent>
                <Grid container direction="row" spacing={2}>
                  <Grid item xs={12} sm={2}>
                    <Controller
                      name="contaReceber.id"
                      control={control}
                      as={
                        <TextField
                          fullWidth
                          disabled
                          type="number"
                          label="Conta a Receber"
                          variant={estiloDeCampo}                      
                          placeholder="EX.: 1"
                          InputLabelProps={{ shrink: true }}
                          inputProps={{ style: { textTransform: "uppercase" } }}
                        />
                      }
                    />
                  </Grid>
                  <Grid item xs={12} sm={2}>
                    <Controller
                      name="id"
                      control={control}
                      as={                    
                        <TextField
                          fullWidth
                          disabled
                          type="number"
                          label="Parcela"
                          variant={estiloDeCampo}
                          placeholder="EX.: 1"
                          InputLabelProps={{ shrink: true }}
                          inputProps={{ style: { textTransform: "uppercase" } }}
                        />
                      }
                    />
                  </Grid>
                  <Grid item xs={12} sm={2}>
                    <Controller
                      name="contaReceber.pessoa.id"
                      control={control}
                      as={                    
                        <TextField
                          fullWidth
                          disabled
                          type="number"
                          label="Credor"
                          variant={estiloDeCampo}
                          placeholder="EX.: 1"
                          InputLabelProps={{ shrink: true }}
                          inputProps={{ style: { textTransform: "uppercase" } }}
                        />
                      }
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Controller
                      name="contaReceber.pessoa.nome"
                      control={control}
                      as={  
                        <TextField
                          fullWidth
                          disabled
                          type="text"
                          label="Nome Credor"
                          variant={estiloDeCampo}
                          placeholder="EX.: NOME credor"
                          InputLabelProps={{ shrink: true }}
                          inputProps={{ style: { textTransform: "uppercase" } }}
                        />
                      }
                    />
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
                            disabled
                            label="Data Emissão"
                            format="dd/MM/yyyy"
                            cancelLabel="Cancelar"
                            variant={estiloDeCampo}
                            placeholder="dd/mm/aaaa"
                            InputLabelProps={{ shrink: true }}
                          />
                        }
                      />
                    </MuiPickersUtilsProvider>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <MuiPickersUtilsProvider utils={LocalizedUtils} locale={ptBrLocale} >
                      <Controller
                        name="dataVencimento"
                        control={control}
                        as={
                          <KeyboardDatePicker
                            autoOk
                            fullWidth
                            disabled
                            label="Data Vencimento"
                            format="dd/MM/yyyy"
                            cancelLabel="Cancelar"
                            variant={estiloDeCampo}
                            placeholder="dd/mm/aaaa"
                            InputLabelProps={{ shrink: true }}
                          />
                        }
                      />
                    </MuiPickersUtilsProvider>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <Controller
                      name="valor"
                      control={control}
                      render={({ value, onChange }) => (  
                        <TextField
                          fullWidth
                          disabled
                          label="Valor"
                          variant={estiloDeCampo}
                          placeholder="R$ 0,00"
                          InputLabelProps={{ shrink: true }}
                          InputProps={{inputComponent: MyTFMoneyNumberFormat}}
                          value={value}
                          onChange={(ev)=> onChange(ev.target.value)}
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Controller
                      name="valorJuro"
                      control={control}
                      render={({ value, onChange }) => (
                        <TextField
                          fullWidth
                          label="Valor Juros"
                          variant={estiloDeCampo}
                          placeholder="R$ 0,00"
                          InputLabelProps={{ shrink: true }}
                          InputProps={{inputComponent: MyTFMoneyNumberFormat}}
                          value={value}
                          onChange={(ev)=> onChange(ev.target.value)}
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Controller
                      name="taxaJuro"
                      control={control}
                      render={({ value, onChange }) => (
                        <TextField
                          fullWidth
                          label="Taxa Juros"
                          variant={estiloDeCampo}
                          placeholder="0,00"
                          InputLabelProps={{ shrink: true }}
                          InputProps={{inputComponent: MyTFFloatNumberFormat2Digits}}
                          value={value}
                          onChange={(ev)=> onChange(ev.target.value)}
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Controller
                      name="valorMulta"
                      control={control}
                      render={({ value, onChange }) => (
                        <TextField
                          fullWidth
                          label="Valor Multa"
                          variant={estiloDeCampo}
                          placeholder="R$ 0,00"
                          InputLabelProps={{ shrink: true }}
                          InputProps={{inputComponent: MyTFMoneyNumberFormat}}
                          value={value}
                          onChange={(ev)=> onChange(ev.target.value)}
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Controller
                      name="taxaMulta"
                      control={control}
                      render={({ value, onChange }) => (
                        <TextField
                          fullWidth
                          label="Taxa Multa"
                          variant={estiloDeCampo}
                          placeholder="0,00"
                          InputLabelProps={{ shrink: true }}
                          InputProps={{inputComponent: MyTFFloatNumberFormat2Digits}}
                          value={value}
                          onChange={(ev)=> onChange(ev.target.value)}
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Controller
                      name="valorDesconto"
                      control={control}
                      render={({ value, onChange }) => (
                        <TextField
                          fullWidth
                          label="Valor Desconto"
                          variant={estiloDeCampo}
                          placeholder="R$ 0,00"
                          InputLabelProps={{ shrink: true }}
                          InputProps={{inputComponent: MyTFMoneyNumberFormat}}
                          value={value}
                          onChange={(ev)=> onChange(ev.target.value)}
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Controller
                      name="taxaDesconto"
                      control={control}
                      render={({ value, onChange }) => (
                        <TextField
                          fullWidth
                          label="Taxa Desconto"
                          variant={estiloDeCampo}
                          placeholder="0,00"
                          InputLabelProps={{ shrink: true }}
                          InputProps={{inputComponent: MyTFFloatNumberFormat2Digits}}
                          value={value}
                          onChange={(ev)=> onChange(ev.target.value)}
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <MuiPickersUtilsProvider utils={LocalizedUtils} locale={ptBrLocale} >
                      <Controller
                        name="dataRecebimento"
                        control={control}
                        as={
                          <KeyboardDatePicker
                            autoOk
                            fullWidth
                            label="Data Recebimento"
                            format="dd/MM/yyyy"
                            cancelLabel="Cancelar"
                            variant={estiloDeCampo}
                            placeholder="dd/mm/aaaa"
                            InputLabelProps={{ shrink: true }}
                            error={!!errors.dataPagamento}
                            helperText={errors.dataPagamento ? errors.dataPagamento.message : ''}
                          />
                        }
                      />
                    </MuiPickersUtilsProvider>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Controller
                      name="valorRecebimento"
                      control={control}
                      render={({ value, onChange }) => (
                        <TextField
                          fullWidth
                          label="Valor Recebimento"
                          variant={estiloDeCampo}
                          placeholder="R$ 0,00"
                          InputLabelProps={{ shrink: true }}
                          InputProps={{inputComponent: MyTFMoneyNumberFormat}}                     
                          error={!!errors.valorPagamento}
                          helperText={errors.valorPagamento ? errors.valorPagamento.message : ''}
                          value={value}
                          onChange={(ev)=> onChange(ev.target.value)}
                        />
                      )}
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

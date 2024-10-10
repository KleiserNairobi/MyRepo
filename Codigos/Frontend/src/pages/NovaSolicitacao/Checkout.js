import React, { useEffect, useState } from 'react';
import { Button, Card, CardActions, CardContent, Grid, TextField, Typography } from '@material-ui/core';
import { CreditCard } from '@material-ui/icons';
import Cards from 'react-credit-cards';
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers';
import { useAlerta } from '../../contexts/AlertaCtx';
import { useMapa } from '../../contexts/MapaCtx';
import { useSolicitacao } from '../../contexts/SolicitacaoCtx';
import { useGeral } from '../../contexts/GeralCtx';
import { limpaObjeto } from '../../utils/funcoes';
import * as service from '../../services/CheckoutMPService';
import { TIPO_ERRO } from '../../utils/global';
import Cabecalho from './Cabecalho';
import schema from './CheckoutSch';
import Styles from './Styles';
import PagesCss from '../PagesCss';
import 'react-credit-cards/es/styles-compiled.css';
// import NumberFormat from 'react-number-format';


export default function Checkout() {

  const classes = Styles();
  const css = PagesCss();
  const { estiloDeCampo } = useGeral();
  const { setConteudo } = useAlerta();
  const { setMapa } = useMapa();
  const { dados, pgto, cartao, setCartao, setTela } = useSolicitacao();
  const [nova, setNova] = useState(false);  
  const [cancelado, setCancelado] = useState(false);
  const [credencial, setCredencial] = useState(true);  

  const [numero, setNumero] = useState('');
  const [nome, setNome] = useState('');
  const [mes, setMes] = useState('');
  const [ano, setAno] = useState('');
  const [cvc, setCvc] = useState('')
  const [focused, setFocused] = useState('');

  const valoresIniciais = {
    numero: cartao.chkNrCartao,
    nome: cartao.chkNome,
    mes: cartao.chkMes,
    ano: cartao.chkAno,
    cvc: cartao.chkCodSeguranca,
    chkEmail: cartao.chkEmail,
  };

  const { handleSubmit, control, errors, reset } = useForm({
    mode: 'all',
    defaultValues: valoresIniciais,
    resolver: yupResolver(schema)
  });

  useEffect(() => {
    if (credencial) {
      window.Mercadopago.setPublishableKey('TEST-b1cb2d8c-5166-45be-bed1-865efbe208c6');
      window.Mercadopago.getIdentificationTypes();
      setCredencial(false);
    }
  }, [credencial, setCredencial])

  function onBlurCartao(ev) {
    var bin = ev.currentTarget.value.replace(/\D/g, '');
    if (bin.length >= 6) {
      window.Mercadopago.getPaymentMethod({
        "bin": bin.substring(0, 6),
      }, defineMetodoPgto);
    } 
  }

  function defineMetodoPgto(status, response) {
    if (status === 200) {
      setCartao({
        ...cartao,
        idMeioPagamento: response[0].id,
        idTipoPagamento: response[0].payment_type_id,
      })
    } else {
      setConteudo({
        tipo: TIPO_ERRO,
        descricao: "Método de pagamento não encontrado",
        exibir: true
      });
    }
  }

  function inseriStatusPgto(respostaGateway) {
    var statusPgto = null;

    if (respostaGateway.status === "rejected") {
      statusPgto = "N";
    } else {
      statusPgto = "A";
    }

    service.inseriStatusPgto(`/pagamentos-status`, pgto.idPagamento, statusPgto)
      .catch(error => {
        setConteudo({
          tipo: TIPO_ERRO,
          descricao: error.response.data.detalhe,
          exibir: true
        });
      });
  }

  function novaSolicitacao(){
    limpaObjeto(dados);
    limpaObjeto(pgto);
    limpaObjeto(cartao);
    setMapa({
      origem: null,
      destino: null,
      modoViagem: "DRIVING",
    });
    setNova(false);
    setCancelado(false);
    setTela(1);
  }

  function cancelar() {
    service.inseriStatusEntrega(`/entregas-status`, pgto.idEntrega, "CA")
    .then(response => {
      setNova(true);
      setCancelado(false);
      limpaObjeto(cartao);
      reset(valoresIniciais);
    })
    .catch(error => {
      setNova(false);
      setCancelado(false)
      setConteudo({
        tipo: TIPO_ERRO,
        descricao: error.response.data.detalhe,
        exibir: true
      });
    });    
  }

  function checkoutMP() {
    const objeto = {
      cliente: dados.cliente,
      idGateway: pgto.idGateway,
      chkNrCartao: cartao.chkNrCartao,
      chkMes: cartao.chkMes,
      chkAno: cartao.chkAno,
      chkCodSeguranca: cartao.chkCodSeguranca,
      chkNome: cartao.chkNome,
      vlrPercurso: pgto.qtdeRepeticao ? pgto.vlrPercurso * pgto.qtdeRepeticao : pgto.vlrPercurso,
      vlrProduto: pgto.qtdeRepeticao ? pgto.vlrProduto * pgto.qtdeRepeticao : pgto.vlrProduto,
      parcelas: 1,
      idMeioPagamento: cartao.idMeioPagamento,
      idPagamento: pgto.idPagamento,
    };

    service.insere(`/pagamentos/checkout`, objeto)
    .then(response => {
      inseriStatusPgto(response.data);
      if (response.data.status === "rejected") {
        setConteudo({
          tipo: TIPO_ERRO,
          descricao: "Não foi possível processar o pagamento." +
            "Descrição do problema: " +
            response.data.response,
          exibir: true
        });
        setNova(false);
        setCancelado(true);
      } else {
        setTela(10);
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

  function submitForm(data) {
    checkoutMP();
  }

  return (
    <div>
      <form onSubmit={handleSubmit(submitForm)} >
        <Card>
          <Cabecalho/>
          <CardContent>
            <Grid container direction="row">
              <Grid item xs={12} >
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <div className={classes.tituloPagina}>
                    <CreditCard style={{ color: '#FEC601', marginRight: '6px' }} />
                    <Typography variant="subtitle1">Checkout Cartão de Crédito</Typography>
                  </div>
                  <div className={classes.subtituloPagina}>
                    <Typography variant="body2">Informe os dados do cartão de crédito</Typography>
                  </div>
                </div>
              </Grid>
              {cancelado &&
                <div className={classes.mensagem}>
                  <Typography variant="subtitle2" style={{color: 'red'}}>
                    Não foi possível concretizar o pagamento.
                  </Typography>
                  <Typography variant="caption">
                    Você pode tentar proceder o pagamento utilizando outro cartão.
                  </Typography>
                  <Typography variant="caption">
                    Caso prefira, <b>cancele</b> a solicitação.
                  </Typography>
                </div>            
              }
              {nova &&
                <div className={classes.mensagem}>
                  <Typography variant="subtitle1"><b>Pronto, solicitação cancelada!</b></Typography>
                </div>
              }


              <Grid item xs={6}>
                <div style={{ marginTop: '10px' }}>
                  <Cards
                    number={numero}
                    name={nome}
                    expiry={`${mes}${ano}`}
                    cvc={cvc}
                    focused={focused}
                    locale={{valid: 'válido até'}}
                    placeholders={{name: 'SEU NOME AQUI'}}
                  />
                </div>
              </Grid>

              <Grid item xs={5}>
                <Grid container spacing={2} style={{ marginLeft: '25px' }} >
                  
                  <Grid item xs={12}>
                    <Controller
                      name="numero"
                      control={control}
                      render={ props => (
                        <TextField
                          fullWidth
                          type="text"
                          name="numero"
                          label="Número do Cartão"
                          variant={estiloDeCampo}
                          InputLabelProps={{ shrink: true }}
                          inputProps={{ style: { textTransform: "lowercase" } }}
                          value={props.value}
                          onChange={ev => { 
                            props.onChange(ev.target.value) 
                            setNumero(ev.target.value)
                            setCartao({...cartao, chkNrCartao: ev.target.value});
                          }}                           
                          onBlur={(ev) => onBlurCartao(ev)}
                          onFocus={(ev) => setFocused(ev.target.name)}
                          error={!!errors.numero}
                          helperText={errors.numero ? errors.numero.message : ''}
                        />
                      )}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <Controller
                      name="nome"
                      control={control}
                      render={ props => (
                        <TextField
                          fullWidth
                          type="text"
                          name="nome"
                          label="Nome no Cartão"
                          variant={estiloDeCampo}
                          InputLabelProps={{ shrink: true }}
                          inputProps={{ style: { textTransform: "uppercase" } }}
                          value={props.value}
                          onChange={ev => { 
                            props.onChange(ev.target.value) 
                            setNome(ev.target.value)
                            setCartao({...cartao, chkNome: ev.target.value});
                          }}                           
                          onFocus={(ev) => setFocused(ev.target.name)}
                          error={!!errors.nome}
                          helperText={errors.nome ? errors.nome.message : ''}
                        />
                      )}
                    />
                  </Grid>

                  <Grid item xs={4}>
                    <Controller
                      name="mes"
                      control={control}
                      render={ props => (
                        <TextField
                          fullWidth
                          type="number"
                          name="mes"
                          label="Mês"
                          variant={estiloDeCampo}
                          InputLabelProps={{ shrink: true }}
                          inputProps={{ style: { textTransform: "uppercase" } }}
                          value={props.value}
                          onChange={ev => { 
                            props.onChange(ev.target.value) 
                            setMes(ev.target.value)
                            setCartao({...cartao, chkMes: ev.target.value});
                          }}                           
                          onFocus={(ev) => setFocused(ev.target.name)}
                          error={!!errors.mes}
                          helperText={errors.mes ? errors.mes.message : ''}
                        />
                      )}
                    />
                  </Grid>

                  <Grid item xs={4}>
                    <Controller
                      name="ano"
                      control={control}
                      render={ props => (
                        <TextField
                          fullWidth
                          type="number"
                          name="ano"
                          label="Ano"
                          variant={estiloDeCampo}
                          InputLabelProps={{ shrink: true }}
                          inputProps={{ style: { textTransform: "uppercase" } }}
                          value={props.value}
                          onChange={ev => { 
                            props.onChange(ev.target.value) 
                            setAno(ev.target.value)
                            setCartao({...cartao, chkAno: ev.target.value});
                          }}                           
                          onFocus={(ev) => setFocused(ev.target.name)}
                          error={!!errors.ano}
                          helperText={errors.ano ? errors.ano.message : ''}
                        />
                      )}
                    />
                  </Grid>

                  <Grid item xs={4}>
                    <Controller
                      name="cvc"
                      control={control}
                      render={ props => (
                        <TextField
                          fullWidth
                          type="text"
                          name="cvc"
                          label="CVC"
                          variant={estiloDeCampo}
                          InputLabelProps={{ shrink: true }}
                          inputProps={{ style: { textTransform: "uppercase" } }}
                          value={props.value}
                          onChange={ev => { 
                            props.onChange(ev.target.value) 
                            setCvc(ev.target.value)
                            setCartao({...cartao, chkCodSeguranca: ev.target.value});
                          }}                           
                          onFocus={(ev) => setFocused(ev.target.name)}
                          error={!!errors.cvc}
                          helperText={errors.cvc ? errors.cvc.message : ''}
                        />
                      )}
                    />
                  </Grid>

                  <Grid item xs={12} >
                    <Controller
                      name="chkEmail"
                      control={control}
                      render={ props => (
                        <TextField
                          fullWidth
                          type="text"
                          name="chkEmail"
                          label="E-Mail"
                          variant={estiloDeCampo}
                          placeholder=""
                          InputLabelProps={{ shrink: true }}
                          inputProps={{ style: { textTransform: "lowercase" } }}
                          value={props.value}
                          onChange={(ev) => {
                            props.onChange(ev.target.value) 
                            setCartao({ ...cartao, chkEmail: ev.target.value });
                          }}
                          onFocus={(ev) => setFocused(ev.target.name)}
                          error={!!errors.chkEmail}
                          helperText={errors.chkEmail ? errors.chkEmail.message : ''}
                        />
                      )}
                    />
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </CardContent>
          <CardActions>
            <div style={{ display: 'flex', width: '100%', margin: '10px' }}>
              <div style={{ flex: 1 }} />
              { cancelado && 
                <Button
                variant="contained"
                color="primary"
                disableElevation
                className={css.formBotaoDeAcao}
                onClick={cancelar}
                > Cancelar
                </Button>
              }
              {nova && 
                <Button
                  variant="contained"
                  color="primary"
                  disableElevation
                  className={css.formBotaoDeAcao}
                  onClick={novaSolicitacao}
                > Nova Solicitação
                </Button>          
              }
              {(!nova) &&
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  disableElevation
                  className={css.formBotaoDeAcao}
                > Finalizar Pagamento
                </Button>
              }
            </div>
          </CardActions>
        </Card>
      </form>
    </div>
  )
}

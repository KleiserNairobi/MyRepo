import React, { useState, useEffect } from 'react';
import {
  Button, Card, CardActions, CardContent, Divider, FormControl, FormControlLabel, FormHelperText, Grid, IconButton,
  Radio, RadioGroup, TextField, Tooltip, Typography
} from '@material-ui/core';
import { Money, CreditCard, OfflinePin, LocalOffer } from '@material-ui/icons';
import { useForm, Controller } from "react-hook-form";
import Cabecalho from './Cabecalho';
import MyTFMoneyNumberFormat from '../../components/MyTFMoneyNumberFormat';
import { useSolicitacao } from '../../contexts/SolicitacaoCtx';
import { useAlerta } from '../../contexts/AlertaCtx';
import { useGeral } from '../../contexts/GeralCtx';
import * as service from '../../services/EntregaPagamentoService';
import { TIPO_ERRO } from '../../utils/global';
import PagesCss from '../PagesCss';
import Styles from './Styles';


export default function Pagamento() {

  const classes = Styles();
  const css = PagesCss();
  const { setConteudo } = useAlerta();
  const { pgto, setPgto, setTela, dados } = useSolicitacao();
  const { estiloDeCampo } = useGeral();
  const [exibirVlrProduto] = useState(false);
  const [gateways, setGateways] = useState([]);
  const [exibirGateway, setExibirGateway] = useState(false);
  const [carregarGateway, setCarregarGateway] = useState(true);

  const valoresIniciais = {
    idPagamento: pgto.idPagamento || null,
    idGateway: pgto.idGateway || null,
    idDesconto: pgto.idDesconto || null,
    tipoPgto: pgto.tipoPgto || '',
    cupom: pgto.cupom || '',
    vlrPercurso: pgto.vlrPercurso || 0,
    vlrProduto: pgto.vlrProduto || 0,
    vlrDesconto: pgto.vlrDesconto || 0,
    vlrTotal: pgto.vlrTotal || 0
  };

  const { handleSubmit, control, errors, setValue } = useForm({
    mode: 'all',
    defaultValues: valoresIniciais,
  });

  // Effect para buscar os gateways ativos
  useEffect(() => {
    if (carregarGateway) {
      async function getGatewaysAtivos() {
        try {
          const { data } = await service.obtem(`/gateways/ativos`);
          if (data) {
            setGateways(data);
          } else {
            setConteudo({
              tipo: TIPO_ERRO,
              descricao: "Não foi possível carregar os gateways ativos",
              exibir: true
            });
          }
        } catch (error) {
          setConteudo({
            tipo: TIPO_ERRO,
            descricao: "Não foi possível carregar os gateways ativos",
            exibir: true
          });
        }
      }
      getGatewaysAtivos();
      setCarregarGateway(false);
    }
  }, [carregarGateway, setCarregarGateway, setConteudo])

  async function aplicaDesconto() {
    try {
      let cupom = pgto.cupom.toUpperCase();
      let pessoa = localStorage.getItem('chamai_idPessoa');
      const { data } = await service.obtem(`/descontos/validar/${pessoa}/${cupom}`);
      if (data) {
        if (pgto.vlrPercurso >= data.piso) {
          if (dados.idEntrega !== null && dados.idEntrega !== "") {
            setPgto({
              ...pgto,
              idDesconto: data.id,
              vlrDesconto: data.valor,
              vlrTotal: (pgto.vlrPercurso - data.valor)
            });            
            setValue('idDesconto', data.id);
            setValue('vlrDesconto', data.valor);
            setValue('vlrTotal', (pgto.vlrPercurso - data.valor));  
          }
          if (dados.idAgendamento !== null && dados.idAgendamento !== "") {
            setPgto({
              ...pgto,
              idDesconto: data.id,
              vlrDesconto: data.valor,
              vlrTotal: ((pgto.vlrPercurso * dados.qtdeRepeticao) - data.valor)
            });            
            setValue('idDesconto', data.id);
            setValue('vlrDesconto', data.valor);
            setValue('vlrTotal', ((pgto.vlrPercurso * dados.qtdeRepeticao) - data.valor));  
          }
        } else {
          setConteudo({
            tipo: TIPO_ERRO,
            descricao: "O cupom " + cupom +
              " é válido para solicitação igual ou superior a " +
              data.piso.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }),
            exibir: true
          });
        }
      }
    } catch (error) {
      setValue('idDesconto', null);
      setConteudo({
        tipo: TIPO_ERRO,
        descricao: error.response.data.detalhe,
        exibir: true
      });
    }
  }

  async function submitForm() {

    if (pgto.tipoPgto === null || pgto.tipoPgto === "") {
      setConteudo({
        tipo: TIPO_ERRO,
        descricao: "Informe o tipo de pagamento desejado.",
        exibir: true
      });
    } else {
      // O registro do pgto deve ser realizado antes de  
      // localizar entregador e de comunicar com gateway
      try {
        // Caso seja um agendamento, o cálculo está sendo realizado no service
        const { data } = await service.insere(`/pagamentos`, pgto)
        if (data) {
          setPgto({ ...pgto, idPagamento: data.id })
        }
      } catch (error) {
        setConteudo({
          tipo: TIPO_ERRO,
          descricao: error.response.data.detalhe,
          exibir: true
        });
      }

      if (pgto.tipoPgto === "D") {
        // Direciona para a tela de conclusão
        setTela(10);
      }

      if (pgto.tipoPgto === "CC") {
        // Muda a tela para que usuário possa informar os dados do cartão
        setTela(9);
      }
    }
  }

  return (
    <div>
      <form onSubmit={handleSubmit(submitForm)} >
        <Card>
          <Cabecalho/>
          <CardContent>
            <Grid container direction="row" spacing={2}>
              <Grid item xs={12}>
                <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <div className={classes.tituloPagina}>
                      <OfflinePin style={{ color: '#FEC601', marginRight: '6px' }} />
                      <Typography variant="subtitle1">Pagamento</Typography>
                    </div>
                    <div className={classes.subtituloPagina}>
                      <Typography variant="body2">Informe o tipo de pagamento desejado</Typography>
                    </div>
                  </div>
                </div>
              </Grid>

              <Grid item xs={12} sm={5} style={{ backgroundColor: '#F8F8F9' }} >
                <Grid container direction="column" spacing={2}>

                  <Grid item xs={12}>
                    <div style={{ display: 'flex', flexDirection: 'column', backgroundColor: '#44575F', borderRadius: '4px' }}>
                      <div style={{ display: 'flex', flexDirection: 'row', paddingLeft: '10px', paddingTop: '5px', paddingRight: '10px', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ color: '#FEC601' }} >
                          <Typography variant="body2">Distância: </Typography>
                        </div>
                        <div style={{ color: '#fff', paddingLeft: '10px' }} >
                          <Typography variant="body2">{`${dados.distancia} Km`}</Typography>
                        </div>
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'row', paddingLeft: '10px', paddingRight: '10px', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ color: '#FEC601' }}>
                          <Typography variant="body2">Previsão: </Typography>
                        </div>
                        <div style={{ color: '#fff', paddingLeft: '10px' }}>
                          <Typography variant="body2">{dados.previsao} </Typography>
                        </div>
                      </div>

                      {(dados.idAgendamento !== null) && (dados.idAgendamento !== "")  &&
                        <div style={{ display: 'flex', flexDirection: 'row', paddingLeft: '10px', paddingRight: '10px', justifyContent: 'space-between', alignItems: 'center' }}>
                          <div style={{ color: '#FEC601' }}>
                            <Typography variant="body2">Repetições: </Typography>
                          </div>
                          <div style={{ color: '#fff', paddingLeft: '10px' }}>
                            <Typography variant="body2">{dados.qtdeRepeticao} </Typography>
                          </div>
                        </div>                    
                      }

                      <div style={{ display: 'flex', flexDirection: 'row', paddingLeft: '10px', paddingRight: '10px', paddingBottom: '5px', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ color: '#FEC601' }}>
                          <Typography variant="body2">Valor:</Typography>
                        </div>
                        <div style={{ color: '#fff', paddingLeft: '10px' }}>
                          <Typography variant="body2">{pgto.strPercurso}</Typography>
                        </div>
                      </div>
                    </div>
                  </Grid>

                  <Grid item xs={12}>
                    <Controller
                      name="cupom"
                      control={control}
                      render={({ error }) => (
                        <TextField
                          fullWidth
                          type="text"
                          label="Cupom de Desconto"
                          variant={estiloDeCampo}
                          InputLabelProps={{ shrink: true }}
                          inputProps={{ style: { textTransform: "uppercase" } }}
                          InputProps={{
                            endAdornment:
                              <Tooltip title="Aplica o Desconto" placement="right" arrow>
                                <IconButton
                                  size="small"
                                  onClick={() => aplicaDesconto()}
                                >
                                  <LocalOffer fontSize="small" />
                                </IconButton>
                              </Tooltip>
                          }}
                          value={pgto.cupom}
                          onChange={(e) => setPgto({ ...pgto, cupom: e.target.value })}
                        />
                      )}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <Controller
                      name="vlrDesconto"
                      control={control}
                      render={({ error }) => (
                        <TextField
                          disabled
                          fullWidth
                          name="valor"
                          label="Valor do Desconto"
                          variant={estiloDeCampo}
                          placeholder="R$ 0,00"
                          InputLabelProps={{ shrink: true }}
                          inputProps={{ style: { textTransform: "uppercase" } }}
                          InputProps={{ inputComponent: MyTFMoneyNumberFormat }}
                          value={pgto.vlrDesconto * 100}
                        />
                      )}
                    />
                  </Grid>

                  {exibirVlrProduto ?
                    <Grid item xs={12}>
                      <Controller
                        name="vlrProduto"
                        control={control}
                        render={({ error }) => (
                          <TextField
                            fullWidth
                            label="Valor de Produto"
                            variant={estiloDeCampo}
                            placeholder="R$ 0,00"
                            InputLabelProps={{ shrink: true }}
                            inputProps={{ style: { textTransform: "uppercase" } }}
                            InputProps={{ inputComponent: MyTFMoneyNumberFormat }}
                            value={pgto.vlrProduto}
                            onChange={(e) => {
                              setPgto({ ...pgto, vlrProduto: e.target.value });
                              setValue('vlrProduto', e.target.value);
                            }}
                          />
                        )}
                      />
                    </Grid>
                    :
                    null
                  }

                  <Grid item xs={12}>
                    <div style={{ display: 'flex', flexDirection: 'column', paddingLeft: '10px', paddingRight: '10px', backgroundColor: '#44575F', borderRadius: '4px' }}>
                      <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ color: '#FEC601' }}>
                          <Typography variant="subtitle1">Total:</Typography>
                        </div>
                        <div style={{ color: '#fff', paddingLeft: '10px' }}>
                          <Typography variant="body2">{pgto.vlrTotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</Typography>
                        </div>
                      </div>
                    </div>
                  </Grid>

                </Grid>
              </Grid>

              <Grid item xs={12} sm={7}>
                <Grid item xs={12}>
                  <div style={{ marginLeft: '20px' }}>
                    <Controller
                      name="tipoPgto"
                      control={control}
                      as={
                        <FormControl component="fieldset" required={true}  >
                          <RadioGroup
                            value={pgto.tipoPgto}
                            onChange={(e) => {
                              if (e.target.value === 'D') {
                                setExibirGateway(false);
                                setPgto({ ...pgto, tipoPgto: 'D', idGateway: null })
                              } else {
                                setExibirGateway(true);
                                setPgto({ ...pgto, tipoPgto: 'CC', idGateway: 1 })
                              }
                            }}>

                            {(dados.idEntrega !== null) && (dados.idEntrega !== "") &&
                              <div style={{ display: 'flex', alignItems: 'center', height: '16px' }}>
                                <Money style={{ marginRight: '10px' }} />
                                <FormControlLabel value="D" control={<Radio size="small" />} label="Dinheiro" className={css.labelRdbTipoPgto} />
                              </div>                                                                                
                            }
                            
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                              <CreditCard style={{ marginRight: '10px' }} />
                              <FormControlLabel value="CC" control={<Radio size="small" />} label="Cartão de Crédito" className={css.labelRdbTipoPgto} />
                            </div>
                          </RadioGroup>
                          <FormHelperText
                            style={{ color: 'red', display: 'flex', marginTop: '20px' }}
                          >{errors.tipoPgto ? errors.tipoPgto.message : ''}
                          </FormHelperText>
                        </FormControl>
                      }
                    />
                  </div>
                </Grid>

                {exibirGateway ?
                  <Grid item xs={12}>
                    <div style={{ marginLeft: '56px' }}>
                      <Typography variant="subtitle1">Você pode pagar com:</Typography>
                      <div style={{ marginTop: '3px', marginBottom: '5px' }}>
                        <Divider />
                      </div>
                      <Controller
                        name="idGateway"
                        control={control}
                        as={
                          <FormControl component="fieldset" required={true}  >
                            <RadioGroup
                              value={pgto.idGateway}
                              onChange={(e) => {
                                setPgto({ ...pgto, idGateway: parseInt(e.target.value) })
                                //setValue('idGateway', e.target.value)
                              }}>
                              {gateways.map((item) => (
                                <div style={{ display: 'flex', alignItems: 'center', height: '26px' }}>
                                  <FormControlLabel
                                    value={item.id}
                                    control={<Radio size="small" />}
                                    label={item.nome}
                                    className={css.labelRdbGateway}
                                  />
                                </div>
                              ))}
                            </RadioGroup>
                            <FormHelperText
                              style={{ color: 'red', display: 'flex', marginTop: '20px' }}
                            >{errors.idGateway ? errors.idGateway.message : ''}
                            </FormHelperText>
                          </FormControl>
                        }
                      />
                    </div>
                  </Grid>
                  :
                  null
                }
              </Grid>
            </Grid>
          </CardContent>
          <CardActions>
            <div style={{ display: 'flex', width: '100%', margin: '10px' }}>
              <div style={{ flex: 1 }} />
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disableElevation
                className={css.formBotaoDeAcao}
              > Pagar
              </Button>
            </div>
          </CardActions>
        </Card>
      </form>
    </div>
  )
}

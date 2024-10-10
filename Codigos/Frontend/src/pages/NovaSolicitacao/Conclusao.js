import React, {useState, useEffect} from 'react'
import { Button, Card, CardActions, CardContent, CardHeader, CircularProgress, Grid, Typography } from '@material-ui/core';
import { WhereToVoteOutlined, TransferWithinAStation } from '@material-ui/icons';
import Cabecalho from './Cabecalho';
import { useSolicitacao } from '../../contexts/SolicitacaoCtx';
import * as service from '../../services/EntregaService';
import { useAlerta } from '../../contexts/AlertaCtx';
import { useMapa } from '../../contexts/MapaCtx';
import { TIPO_ERRO } from '../../utils/global';
import PagesCss from '../PagesCss';


export default function Conclusao() {

  const css = PagesCss();
  const { setConteudo } = useAlerta();  
  const [processando, setProcessando] = useState(true);
  const [concluido, setConcluido] = useState(false);
  const [cancelado, setCancelado] = useState(false);
  const [semEntregador, setSemEntregador] = useState(false);
  const { dados, pgto, setTela, limpaObjDados, limpaObjPgto, limpaObjCartao } = useSolicitacao();
  const { setMapa } = useMapa();
  const [entregador, setEntregador] = useState({
    id: null,
    nome: '',
    telefone: '',
    veiculo: '',
    modelo: '',
    placa: '',
  });

  function novaTentativa() {
    setSemEntregador(false);
    setConcluido(false);
    setCancelado(false);
    setProcessando(true);
  }

  function cancelar() {
    service.cancela('/entregas-status', pgto.idEntrega)
    // .then(response => {
    //   console.log(response)
    // })
    .catch(error => {
      setConteudo({
        tipo: TIPO_ERRO,
        descricao: error.response.data.detalhe,
        exibir: true
      });
    });

    service.registraObsPgto(`/pagamentos/${pgto.idPagamento}/observacao`, pgto.tipoPgto)
    // .then(response => {
    //   console.log(response)
    // })
    .catch(error => {
      setConteudo({
        tipo: TIPO_ERRO,
        descricao: error.response.data.detalhe,
        exibir: true
      });
    });

    service.insereStatusPgto('/pagamentos-status', pgto.idPagamento, pgto.tipoPgto)
    // .then(response => {
    //   console.log(response)
    // })
    .catch(error => {
      setConteudo({
        tipo: TIPO_ERRO,
        descricao: error.response.data.detalhe,
        exibir: true
      });
    });

    setSemEntregador(false);
    setProcessando(false);
    setConcluido(false);
    setCancelado(true);
  }

  function novaSolicitacao(){
    limpaObjDados();
    limpaObjPgto();
    limpaObjCartao();
    setMapa({
      origem: null,
      destino: null,
      modoViagem: "DRIVING",
    });
    setTela(1);
  }

  useEffect(() => {
    if (pgto.idAgendamento !== null && pgto.idAgendamento !== "") { 
      if (processando) {
        setProcessando(false);
        setSemEntregador(false);
        setCancelado(false);
        setConcluido(true);
      }
    }

    if (pgto.idEntrega !== null && pgto.idEntrega !== "") { 
      if (processando) {
        async function getEntregador() {
          try {
            const { data } = await service.obtem(`/entregas/${pgto.idEntrega}/entregador`);
            if (data) {
              setEntregador({ 
                ...entregador,
                id: data.id,
                nome: data.nome,
                telefone: data.telefone,
                veiculo: data.veiculo,
                modelo: data.modelo,
                placa: data.placa
              })
              setProcessando(false);
              setSemEntregador(false);
              setCancelado(false);
              setConcluido(true);
            }
          } catch (error) {
            setConcluido(false);
            setProcessando(false);
            setCancelado(false);
            setSemEntregador(true);
            if (error.response.data.detalhe !== 
              ('Nenhum entregador disponível no momento' ||
              'Não existe entregadores disponíveis no momento')
            ) {
              setConteudo({
                tipo: TIPO_ERRO,
                descricao: error.response.data.detalhe,
                exibir: true
              });  
            }
          } 
        }      
        getEntregador()
      }  
    }

  }, [processando, pgto.idAgendamento, pgto.idEntrega, setConteudo, entregador, setEntregador])

  return (
    <div>
      <Card>
        <Cabecalho/>
        <CardContent>
          {processando &&
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
              <CircularProgress size={20} color="inherit" style={{ marginRight: '10px' }} />
              <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', margin: '10px' }}>
                <Typography variant="subtitle1">Aguarde, estamos processando sua solicitação.</Typography>
              </div>
            </div>
          }
          {concluido &&
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
              <Typography variant="subtitle1">Pronto, dados processados!</Typography>
            </div>
          }
          {cancelado &&
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
              <Typography variant="subtitle1">Pronto, solicitação cancelada!</Typography>
            </div>
          }
          {semEntregador &&            
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
              <Typography variant="subtitle2" style={{color: 'red'}}>
                No momento não temos entregadores disponíveis.
              </Typography>
              <Typography variant="caption">
                Em alguns instantes, faça uma <strong>nova tentativa</strong>
              </Typography>
              <Typography variant="caption">
              de localização de entregador, ou <b>cancele</b> a solicitação.
              </Typography>
            </div>
          }

          <div style={{margin: '30px 10px ' }}>   
            <Grid container direction="row" spacing={4} >

              {/** Coluna contendo resumo da entrega */}
              <Grid item xs={6}>
                <Grid container direction="column" spacing={2}>
                  <Card variant="outlined" style={{height: '250px'}}>
                    <CardHeader 
                      avatar={<WhereToVoteOutlined fontSize="large" />}
                      title="Resumo Solicitação" 
                    />
                    <CardContent>
                      <Grid container direction='row' >
                        {(dados.idEntrega !== null) && (dados.idEntrega !== "") && 
                          <Grid item xs={6}>
                            <Typography variant="body2">Entrega: </Typography>
                          </Grid>
                        }
                        {(dados.idEntrega !== null) && (dados.idEntrega !== "") &&
                          <Grid item xs={6}>
                            <Typography variant="body2">{dados.idEntrega}</Typography>
                          </Grid>
                        }                      
                        {(dados.idAgendamento !== null) && (dados.idAgendamento !== "") &&
                          <Grid item xs={6}>
                            <Typography variant="body2">Agendamento: </Typography>
                          </Grid>
                        }
                        {(dados.idAgendamento !== null) && (dados.idAgendamento !== "") &&
                          <Grid item xs={6}>
                            <Typography variant="body2">{dados.idAgendamento}</Typography>
                          </Grid>
                        } 

                        {(dados.idAgendamento !== null) && (dados.idAgendamento !== "") &&
                          <Grid item xs={6}>
                            <Typography variant="body2">Repetições: </Typography>
                          </Grid>
                        }
                        {(dados.idAgendamento !== null) && (dados.idAgendamento !== "") &&
                          <Grid item xs={6}>
                            <Typography variant="body2">{dados.qtdeRepeticao}</Typography>
                          </Grid>
                        }
                        <Grid item xs={6}>
                          <Typography variant="body2">Distância: </Typography>
                        </Grid>
                        <Grid item xs={6}>
                          <Typography variant="body2">{`${dados.distancia} Km`}</Typography>
                        </Grid>
                        <Grid item xs={6}>
                          <Typography variant="body2">Previsão: </Typography>
                        </Grid>
                        <Grid item xs={6}>
                          <Typography variant="body2">{dados.previsao} </Typography>
                        </Grid>
                        <Grid item xs={6}>
                          <Typography variant="body2">Valor Percurso:</Typography>
                        </Grid>
                        <Grid item xs={6}>
                          <Typography variant="body2">
                            {
                              (pgto.vlrPercurso === undefined || pgto.vlrPercurso === 0)
                              ? 'R$ 0,00'
                              : pgto.vlrPercurso.toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'})
                            }
                          </Typography>
                        </Grid>
                        <Grid item xs={6}>
                          <Typography variant="body2">Valor Produto:</Typography>
                        </Grid>
                        <Grid item xs={6}>
                          <Typography variant="body2">
                            {
                              (pgto.vlrProduto === undefined || pgto.vlrProduto === 0)
                              ? 'R$ 0,00' 
                              : pgto.vlrProduto.toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'})
                            }
                          </Typography>
                        </Grid>
                        <Grid item xs={6}>
                          <Typography variant="body2">Valor Desconto:</Typography>
                        </Grid>
                        <Grid item xs={6}>
                          <Typography variant="body2">
                            {
                              (pgto.vlrDesconto === undefined || pgto.vlrDesconto === null || pgto.vlrDesconto === "" || pgto.vlrDesconto === 0)
                              ? 'R$ 0,00' 
                              : pgto.vlrDesconto.toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'})
                            }
                          </Typography>
                        </Grid>
                        <Grid item xs={6}>
                          <Typography variant="body2">Valor Total:</Typography>
                        </Grid>
                        <Grid item xs={6}>
                          <Typography variant="body2">
                            {
                              (pgto.vlrTotal === undefined || pgto.vlrTotal === 0)
                              ? 'R$ 0,00' 
                              : pgto.vlrTotal.toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'})
                            }
                          </Typography>
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>

              {/** Coluna contendo resumo do entregador */}              
              {(dados.idEntrega !== null) && (dados.idEntrega !== "") &&
                <Grid item xs={6}>
                  <Grid container direction="column" spacing={2}>
                    <Card variant="outlined" style={{ height: '250px' }}>
                      <CardHeader
                        avatar={<TransferWithinAStation fontSize="large" />}
                        title="Entregador"
                      />
                      <CardContent>
                        <Grid container direction='row' >
                          <Grid item xs={4}>
                            <Typography variant="body2">Nome: </Typography>
                          </Grid>
                          <Grid item xs={8}>
                            <Typography variant="body2">{entregador.nome}</Typography>
                          </Grid>
                          <Grid item xs={4}>
                            <Typography variant="body2">Telefone: </Typography>
                          </Grid>
                          <Grid item xs={8}>
                            <Typography variant="body2">{entregador.telefone}</Typography>
                          </Grid>
                          <Grid item xs={4}>
                            <Typography variant="body2">Veículo: </Typography>
                          </Grid>
                          <Grid item xs={8}>
                            <Typography variant="body2">{entregador.veiculo}</Typography>
                          </Grid>
                          <Grid item xs={4}>
                            <Typography variant="body2">Modelo: </Typography>
                          </Grid>
                          <Grid item xs={8}>
                            <Typography variant="body2">{entregador.modelo}</Typography>
                          </Grid>
                          <Grid item xs={4}>
                            <Typography variant="body2">Placa: </Typography>
                          </Grid>
                          <Grid item xs={8}>
                            <Typography variant="body2">{entregador.placa}</Typography>
                          </Grid>
                        </Grid>
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>
              }              
            </Grid>
          </div>
        </CardContent>
        <CardActions>
          <div style={{ display: 'flex', width: '100%', margin: '10px' }}>
            <div style={{ flex: 1 }} />
            {semEntregador &&
              <div>
              <Button
                variant="contained"
                color="primary"
                disableElevation
                className={css.formBotaoDeAcao}
                onClick={novaTentativa}
              > Nova Tentativa
              </Button>
              <Button
                variant="contained"
                color="primary"
                disableElevation
                className={css.formBotaoDeAcao}
                onClick={cancelar}
              > Cancelar
              </Button>
              </div>
            }
            {(concluido || cancelado) && 
              <Button
                variant="contained"
                color="primary"
                disableElevation
                className={css.formBotaoDeAcao}
                onClick={novaSolicitacao}
              > Nova Solicitação
              </Button>          
            }
          </div>
        </CardActions>
      </Card>
    </div>
  )
}

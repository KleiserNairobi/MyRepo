import React from 'react';
import { Avatar, Button, Card, CardActions, CardContent, Divider, Grid, MobileStepper, Typography } from '@material-ui/core';
import { AddTask, KeyboardArrowLeft, KeyboardArrowRight } from '@material-ui/icons';
import Cabecalho from './Cabecalho';
import { useTheme } from '@material-ui/core/styles';
import * as service from '../../services/EntregaService';
import { useAlerta } from '../../contexts/AlertaCtx';
import { useSolicitacao } from '../../contexts/SolicitacaoCtx';
import { TIPO_ERRO } from '../../utils/global';
import PagesCss from '../PagesCss';
import Styles from './Styles';

export default function Confirmacao() {
  
  const classes = Styles();
  const css = PagesCss();
  const theme = useTheme();
  const { setConteudo } = useAlerta();
  const { dados, pgto, setPgto, setDados, tela, setTela, qtdeTelas } = useSolicitacao();
  
  const retiradaLinha1 = `${dados.origLogradouro}, ${dados.origNumero}, ${dados.origComplemento}`;
  const retiradaLinha2 = `${dados.origBairro}, ${dados.origCidade} - ${dados.origEstado}, ${dados.origCep}`;
  const retiradaLinha3 = `REFERÊNCIA: ${dados.origReferencia ? dados.origReferencia : "NADA CONSTA"}`;
  const retiradaLinha4 = `INSTRUÇÃO: ${dados.origTarefa ? dados.origTarefa : "NADA CONSTA"}`;
  const retiradaLinha5 = `CONTATO: ${dados.origContato ? dados.origContato : "NADA CONSTA"}, TELEFONE: ${dados.origTelefone ? dados.origTelefone : "NADA CONSTA"}`;

  const entregaLinha1 = `${dados.destLogradouro}, ${dados.destNumero}, ${dados.destComplemento}`;
  const entregaLinha2 = `${dados.destBairro}, ${dados.destCidade} - ${dados.destEstado}, ${dados.destCep}`;
  const entregaLinha3 = `REFERÊNCIA: ${dados.destReferencia ? dados.destReferencia : "NADA CONSTA"}`;
  const entregaLinha4 = `INSTRUÇÃO: ${dados.destTarefa ? dados.destTarefa : "NADA CONSTA"}`;
  const entregaLinha5 = `CONTATO: ${dados.destContato ? dados.destContato : "NADA CONSTA"}, TELEFONE: ${dados.destTelefone ? dados.destTelefone : "NADA CONSTA"}`;

  function anterior() {
    setTela(tela - 1);
  }

  function btnAgendar() {
    setTela(7);
  }

  async function btnEntregar() {
    try {
      const { data } = await service.insere(`/entregas`, dados);
      if (data) {
        setDados({...dados, idEntrega: data.id, idAgendamento: ""});
        setPgto({...pgto, idEntrega: data.id, idAgendamento: ""})
        setTela(8);
      }
    } catch (error) {
      setConteudo({
        tipo: TIPO_ERRO,
        descricao: error.response.data.detalhe,
        exibir: true
      });
    }    
  }

  return (    
    <div>
      <Card>
        <Cabecalho/>
        <CardContent>
          <Grid container direction="row" spacing={2}>
            <Grid item xs={12} >
              <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <div className={classes.tituloPagina}>
                    <AddTask style={{ color: '#FEC601', marginRight: '6px' }} />
                    <Typography variant="subtitle1">Confirmação</Typography>
                  </div>
                  <div className={classes.subtituloPagina}>
                    <Typography variant="body2">Confira os dados e decida por agendar ou entregar agora</Typography>
                  </div>
                </div>
              </div>
            </Grid>

            <Grid container direction="row" justify="flex-end" alignItems="center">
              <Grid item xs={3} sm={2} md={2} style={{backgroundColor: '#44575F', borderRadius: '6px', marginTop: 0, marginRight: '5px'}}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '4px'}}>
                  <div style={{ color: '#FEC601' }} >
                    <Typography variant="subtitle1">Distância</Typography>
                  </div>
                  <div style={{ color: '#fff' }} >
                    <Typography variant="body2">{dados.distancia ? dados.distancia : '00.000' }</Typography>
                  </div>
                </div>
              </Grid>

              <Grid item xs={4} sm={2} md={2} style={{backgroundColor: '#44575F', borderRadius: '6px', marginTop: 0, marginRight: '5px'}}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '4px'}}>
                  <div style={{ color: '#FEC601' }}>
                    <Typography variant="subtitle1">Previsão</Typography>
                  </div>
                  <div style={{ color: '#fff' }}>
                    <Typography variant="body2">{dados.previsao ? dados.previsao : '00:00:00'}</Typography>
                  </div>
                </div>
              </Grid>

              <Grid item xs={4} sm={3} md={3} style={{backgroundColor: '#44575F', borderRadius: '6px', marginTop: 0, marginRight: '2px'}}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '4px'}}>
                  <div style={{ color: '#FEC601' }}>
                    <Typography variant="subtitle1">Valor</Typography>
                  </div>
                  <div style={{ color: '#fff' }}>
                    <Typography variant="body2">{dados.valor ? dados.valor : 'R$ 0,00'}</Typography>
                  </div>
                </div>
              </Grid>
            </Grid>

            <Grid container direction="row" style={{marginTop: '20px'}}>

              <Grid item xs={2} sm={1}>
                <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                  <Avatar>A</Avatar>
                </div>
              </Grid>

              <Grid item xs={10} sm={11}>
                <div className={classes.tituloPagina}>
                  <Typography variant="body1">Retirada</Typography>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <Typography variant="caption" style={{ color: '#A9A9A9' }}>{retiradaLinha1.toUpperCase()}</Typography>
                  <Typography variant="caption" style={{ color: '#A9A9A9' }}>{retiradaLinha2.toUpperCase()}</Typography>
                  <Typography variant="caption" style={{ color: '#A9A9A9' }}>{retiradaLinha3.toUpperCase()}</Typography>
                  <Typography variant="caption" style={{ color: '#A9A9A9' }}>{retiradaLinha4.toUpperCase()}</Typography>
                  <Typography variant="caption" style={{ color: '#A9A9A9' }}>{retiradaLinha5.toUpperCase()}</Typography>
                </div>
                <div style={{ marginTop: '10px', marginBottom: '10px' }}>
                  <Divider />
                </div>
              </Grid>

              <Grid item xs={2} sm={1}>
                <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                  <Avatar>B</Avatar>
                </div>
              </Grid>

              <Grid item xs={10} sm={11}>
                <div className={classes.tituloPagina}>
                  <Typography variant="body1">Entrega</Typography>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <Typography variant="caption" style={{ color: '#A9A9A9' }}>{entregaLinha1.toUpperCase()}</Typography>
                  <Typography variant="caption" style={{ color: '#A9A9A9' }}>{entregaLinha2.toUpperCase()}</Typography>
                  <Typography variant="caption" style={{ color: '#A9A9A9' }}>{entregaLinha3.toUpperCase()}</Typography>
                  <Typography variant="caption" style={{ color: '#A9A9A9' }}>{entregaLinha4.toUpperCase()}</Typography>
                  <Typography variant="caption" style={{ color: '#A9A9A9' }}>{entregaLinha5.toUpperCase()}</Typography>
                </div>
              </Grid>

              <Grid item xs={12} sm={12}>
                <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-end', marginTop: '20px' }}>
                  <div style={{ flex: 1 }} />
                  <Button
                    variant="contained"
                    color="inherit"
                    disableElevation
                    className={css.formBotaoDeAcao}
                    onClick={btnAgendar}
                  > Agendar
                  </Button>
                  <Button
                    variant="contained"
                    color="primary"
                    disableElevation
                    className={css.formBotaoDeAcao}
                    onClick={btnEntregar}
                  > Entregar Agora
                  </Button>
                </div>
              </Grid>

            </Grid>
          </Grid>
        </CardContent>
        <CardActions>
          <div style={{ width: '100%' }} >
            <Divider />
            <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
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
    </div>
  )
}

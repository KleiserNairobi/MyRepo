import React, {useEffect, useState} from 'react';
import { Typography, Grid, Paper, Divider } from '@material-ui/core';
import { WhereToVote, Alarm } from '@material-ui/icons';
import { format } from "date-fns";
import * as service from '../../services/EstatisticaService';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';


//  import styles from '../Dashboard/styles';


export default function BoxEntrega(props) {
  // const estilo = styles();
  // const classes = styles();

  const [agenTotal, setAgenTotal] = useState(0);
  const [agenRealizado, setAgenRealizado] = useState(0);
  const [agenNaoRealizado, setAgenNaoRealizado] = useState(0);
  const [agenCancelado, setAgenCancelado] = useState(0);

  const [entregaTotal, setEntregaTotal] = useState(0);
  const [entregaNaoIniciada, setEntregaNaoIniciada] = useState(0);
  // const [entregaIniciada, setEntregaIniciada] = useState(0);
  const [entregaConcluida, setEntregaConcluida] = useState(0);
  const [entregaCancelada, setEntregaCancelada] = useState(0);

  const data = [
    { name: 'Group A', value: 400 },
    { name: 'Group B', value: 300 },
    { name: 'Group C', value: 300 },
    { name: 'Group D', value: 200 },
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  const RADIAN = Math.PI / 180;
  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);
  
    return (
      <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  useEffect(() => {
    if ((props.dataInicial === undefined || props.dataInicial === null) ||
        (props.dataFinal === undefined || props.dataFinal === null)) {

      var dtInicial = format(new Date(), 'yyyy-MM-dd');
      var dtFinal   = format(new Date(), 'yyyy-MM-dd');

      console.log('Igual undefined ' + dtInicial + '/' + dtFinal);
      
      service.obtem(`/estatisticas/agendamento?dataInicial=${dtInicial}&dataFinal=${dtFinal}`)
      .then(response => {
        setAgenTotal(response.data.total);
        setAgenRealizado(response.data.realizado);
        setAgenNaoRealizado(response.data.naoRealizado);
        setAgenCancelado(response.data.cancelado);
      }) 

      service.obtem(`/estatisticas/entrega?dataInicial=${dtInicial}&dataFinal=${dtFinal}`)
      .then(response => {
        setEntregaTotal(response.data.total);
        setEntregaNaoIniciada(response.data.naoIniciada);
        // setEntregaIniciada(response.data.iniciada);
        setEntregaConcluida(response.data.concluida);
        setEntregaCancelada(response.data.cancelada);
      }) 
    } else {
      
      console.log('Diferente de undefined ' + props.dataInicial + '/' + props.dataFinal);
      
      service.obtem(`/estatisticas/agendamento?dataInicial=${props.dataInicial}&dataFinal=${props.dataFinal}`)
      .then(response => {
        setAgenTotal(response.data.total);
        setAgenRealizado(response.data.realizado);
        setAgenNaoRealizado(response.data.naoRealizado);
        setAgenCancelado(response.data.cancelado);
      }) 
    }

    service.obtem(`/estatisticas/entrega?dataInicial=${props.dataInicial}&dataFinal=${props.dataFinal}`)
    .then(response => {
      setEntregaTotal(response.data.total);
      setEntregaNaoIniciada(response.data.naoIniciada);
      // setEntregaIniciada(response.data.iniciada);
      setEntregaConcluida(response.data.concluida);
      setEntregaCancelada(response.data.cancelada);
    })    
  }, [props.dataInicial, props.dataFinal]);



  return (
    <div style={{marginTop: '16px'}}>
      <Grid container direction="row" spacing={2}>

        <Grid item xs={12} md={6}>
          <Paper style={{padding: '10px'}}>
            <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
              <Alarm style={{ color: '#FEC601', margin: '10px' }} />
              <Typography variant="subtitle1" style={{ color: '#2F3D44' }}>AGENDAMENTOS</Typography>
            </div>

            <Divider />

            <Grid container direction="row" style={{ marginTop: '10px'}}>              
              <Grid item xs={12} md={8}>
                <Grid container direction="row"> 
                  <Grid item xs={12} md={6}>Total</Grid>
                  <Grid item xs={12} md={6}>{agenTotal}</Grid>
                  <Grid item xs={12} md={6}>Realizado</Grid>
                  <Grid item xs={12} md={6}>{agenRealizado}</Grid>
                  <Grid item xs={12} md={6}>Não Realizado</Grid>
                  <Grid item xs={12} md={6}>{agenNaoRealizado}</Grid>
                  <Grid item xs={12} md={6}>Cancelada</Grid>
                  <Grid item xs={12} md={6}>{agenCancelado}</Grid>
                </Grid>
              </Grid>
              <Grid item xs={12} md={4} >
                <Grid container direction="row">
                  <Grid item xs={12} md={4}>
                    <ResponsiveContainer width="100%" height="100%" >
                      <PieChart>
                        <Pie
                          data={data}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={renderCustomizedLabel}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>



                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Paper>
        </Grid>



        <Grid item xs={12} md={6}>
          <Paper style={{padding: '10px'}}>            
            <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
              <WhereToVote style={{ color: '#FEC601', margin: '10px' }} />
              <Typography variant="subtitle1" style={{ color: '#2F3D44' }}>SOLICITAÇÕES</Typography>
            </div>

            <Divider />

            <Grid container direction="row" style={{ marginTop: '10px'}}>              
              <Grid item xs={12} md={8}>
                <Grid container direction="row"> 
                  <Grid item xs={12} md={6}>Total</Grid>
                  <Grid item xs={12} md={6}>{entregaTotal}</Grid>
                  <Grid item xs={12} md={6}>Não iniciada</Grid>
                  <Grid item xs={12} md={6}>{entregaNaoIniciada}</Grid>
                  <Grid item xs={12} md={6}>Concluída</Grid>
                  <Grid item xs={12} md={6}>{entregaConcluida}</Grid>
                  <Grid item xs={12} md={6}>Cancelada</Grid>
                  <Grid item xs={12} md={6}>{entregaCancelada}</Grid>                                    
                </Grid>
              </Grid>
              <Grid item xs={12} md={4}>
                <Grid container direction="column">
                  <Grid item xs={12} md={4}>
                    md=4
                    reservado ao gráfico
                  </Grid>
                </Grid>
              </Grid>              
            </Grid>
          </Paper>
        </Grid>          
      </Grid>








      {/* <Typography className={estilo.tituloBoxCartoes}>Entregas</Typography>
      <hr className={estilo.hr1} />
      <br /> */}

      {/* <Grid container direction="row" justify="flex-start" alignItems="center" spacing={3} className={estilo.mb3}>
        <Grid item xs={12} sm={12} md={6} lg={3} xl={3}>
          <Card variant="outlined" >
            <CardHeader
              avatar={
                <Avatar className={estilo.corLaranja} >
                  <Schedule fontSize="large" />
                </Avatar>
              }
              title="Entregas Agendadas"
              // className={estilo.cartaoAmarelo}
            />
            <CardActionArea>
              <CardContent>
                <Typography variant="h4" align="center">100</Typography>
              </CardContent>
            </CardActionArea>
          </Card>
        </Grid>
        <Grid item xs={12} sm={12} md={6} lg={3} xl={3}>
          <Card variant="outlined" >
            <CardHeader
              avatar={
                <Avatar className={estilo.corVermelha}>
                  <HighlightOff fontSize="large" />
                </Avatar>
              }
              title="Entregas Canceladas"
              className={estilo.cartaoVermelho}
            />
            <CardActionArea>
              <CardContent>
                <Typography variant="h4" align="center">100</Typography>
              </CardContent>
            </CardActionArea>
          </Card>
        </Grid>
        <Grid item xs={12} sm={12} md={6} lg={3} xl={3}>
          <Card variant="outlined" >
            <CardHeader
              avatar={
                <Avatar className={estilo.corVerde}>
                  <CheckCircleOutline fontSize="large" />
                </Avatar>
              }
              title="Entregas Realizadas"
              className={estilo.cartaoVerde}
            />
            <CardActionArea>
              <CardContent>
                <Typography variant="h4" align="center">500</Typography>
              </CardContent>
            </CardActionArea>
          </Card>
        </Grid>
        <Grid item xs={12} sm={12} md={6} lg={3} xl={3}>
          <Card variant="outlined" >
            <CardHeader
              avatar={
                <Avatar className={estilo.corAzul}>
                  <ControlPoint fontSize="large" />
                </Avatar>
              }
              title="Total de Entregas"
              className={estilo.cartaoAzul}
            />
            <CardActionArea>
              <CardContent>
                <Typography variant="h4" align="center">500</Typography>
              </CardContent>
            </CardActionArea>
          </Card>
        </Grid>
      </Grid> */}
    </div>
  );
}

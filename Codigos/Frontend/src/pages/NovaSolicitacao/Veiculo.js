import React from 'react';
import {
  Button, Divider, FormControl, FormControlLabel, FormHelperText, Grid, MobileStepper, Radio, 
  RadioGroup, Typography, Card, CardContent, CardActions
} from '@material-ui/core';
import {
  Commute, DirectionsBike, TwoWheeler, TimeToLeave, KeyboardArrowLeft, KeyboardArrowRight
} from '@material-ui/icons';
import { useTheme } from '@material-ui/core/styles';
import { useSolicitacao } from '../../contexts/SolicitacaoCtx';
import { useAutenticacao } from '../../contexts/AutenticacaoCtx';
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers';
import Cabecalho from './Cabecalho';
import schema from './VeiculoSch';
import Styles from './Styles';


export default function Veiculo() {
  
  const classes = Styles();
  const theme = useTheme();
  const { dados, setDados, tela, setTela, qtdeTelas } = useSolicitacao();
  const { idMembro } = useAutenticacao();
  const valoresIniciais = { tipoVeiculo: dados.tipoVeiculo };

  const { handleSubmit, control, errors } = useForm({
    mode: 'all',
    defaultValues: valoresIniciais,
    resolver: yupResolver(schema)
  });

  function submitForm(data) {
    const idCliente = parseInt(idMembro);
    setDados({ ...dados, cliente: idCliente, deslocamento: 'OD' });
    setTela(tela + 1);
  }

  return (
    <div >
      <form onSubmit={handleSubmit(submitForm)} >
        <Card>          
          <Cabecalho/>
          <CardContent>
            <Grid container direction="row">
              <Grid item xs={12}>
                <div>
                  <div className={classes.tituloPagina}>
                    <Commute style={{ color: '#FEC601', marginRight: '6px' }} />
                    <Typography variant="subtitle1">Tipo de Veículo</Typography>
                  </div>
                  <div className={classes.subtituloPagina}>
                    <Typography variant="body2">Informe o tipo de veículo desejado</Typography>
                  </div>
                </div>
              </Grid>
              <Grid item xs={12}>
                <Controller
                  name="tipoVeiculo"
                  control={control}
                  as={
                    <FormControl component="fieldset" required={true} >
                      <RadioGroup value={dados.tipoVeiculo} onChange={(e) => setDados({ ...dados, tipoVeiculo: e.target.value })}>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                          <DirectionsBike style={{ marginRight: '10px' }} />
                          <FormControlLabel value="B" control={<Radio size="small" />} label="Bike" />
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                          <TwoWheeler style={{ marginRight: '10px' }} />
                          <FormControlLabel value="M" control={<Radio size="small" />} label="Moto" />
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                          <TimeToLeave style={{ marginRight: '10px' }} />
                          <FormControlLabel value="C" control={<Radio size="small" />} label="Carro" />
                        </div>
                      </RadioGroup>
                      <FormHelperText
                        style={{ color: 'red', display: 'flex', marginTop: '20px' }}
                      >{errors.tipoVeiculo ? errors.tipoVeiculo.message : ''}
                      </FormHelperText>
                    </FormControl>
                  }
                />
              </Grid>
            </Grid>
          </CardContent>
          <CardActions>
            <div style={{ width: '100%' }} >
              <Divider />
              <div className={classes.barraBotaoEmLinha}>
                <Button size="small" disabled>
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
                <Button size="small" type="submit" >
                  Próximo
                  {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
                </Button>
              </div>
            </div>
          </CardActions>
        </Card>
      </form>
    </div>
  )
}

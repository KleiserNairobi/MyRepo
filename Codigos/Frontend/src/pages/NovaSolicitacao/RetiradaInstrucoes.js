import React, { useState } from 'react';
import { Button, Card, CardActions, CardContent, Divider, Grid, MobileStepper, TextField, Typography } from '@material-ui/core';
import { AssignmentOutlined, KeyboardArrowLeft, KeyboardArrowRight } from '@material-ui/icons';
import InputMask from 'react-input-mask';
import { useForm, Controller } from "react-hook-form";
import { useTheme } from '@material-ui/core/styles';
import Cabecalho from './Cabecalho';
import { useSolicitacao } from '../../contexts/SolicitacaoCtx';
import { useGeral } from '../../contexts/GeralCtx';
import Styles from './Styles';


export default function RetiradaInstrucoes() {

  const classes = Styles();
  const theme = useTheme();
  const { estiloDeCampo } = useGeral();
  const { dados, setDados, tela, setTela, qtdeTelas } = useSolicitacao();
  const [mascara, setMascara] = useState("(99)99999-9999");
  
  const valoresIniciais = { 
    origContato: dados.origContato,
    origTelefone: dados.origTelefone,
    origTarefa: dados.origTarefa,
  };

  const { handleSubmit, control, errors, setValue } = useForm({
    mode: 'all',
    defaultValues: valoresIniciais
  });

  function anterior() {
    setTela(tela - 1);    
  }

  function submitForm(data) {
    setTela(tela + 1);
  }

  return (
    <div>
      <form onSubmit={handleSubmit( submitForm )} >
        <Card>
          <Cabecalho/>
          <CardContent>
            <Grid container direction="row">
              <Grid item xs={12}>
                <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <div className={classes.tituloPagina}>
                      <AssignmentOutlined style={{ color: '#FEC601', marginRight: '6px' }} />
                      <Typography variant="subtitle1">Instruções de Retirada</Typography>
                    </div>
                    <div className={classes.subtituloPagina}>
                      <Typography variant="body2">Informe as instruções de retirada</Typography>
                    </div>
                  </div>
                </div>
              </Grid>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={9} md={8}>
                  <Controller
                    name="origContato"
                    control={control}
                    render={({ error }) => (
                      <TextField
                        fullWidth
                        type="text"
                        label="Contato"
                        variant={estiloDeCampo}
                        placeholder="Com quem falar neste local?"
                        InputLabelProps={{ shrink: true }}
                        inputProps={{ style: { textTransform: "uppercase" } }}
                        value={dados.origContato}
                        onChange={(e) => {
                          setDados({ ...dados, origContato: e.target.value });
                          setValue('origContato', e.target.value);
                        }}
                        error={!!errors.origContato}
                        helperText={errors.origContato ? errors.origContato.message : ''}
                      />
                    )}
                  />
                </Grid>

                <Grid item xs={12} sm={3} md={4}>
                  <Controller
                    name="origTelefone"
                    control={control}
                    render={({ error }) => (
                      <InputMask
                        mask={mascara}
                        maskChar=" "
                        disabled={false}
                        value={dados.origTelefone}
                        onChange={(ev) => {
                          setDados({ ...dados, origTelefone: ev.target.value });
                          setValue('origTelefone', ev.target.value);
                          if (ev.target.value.replace(/([^\d])/g, "").length === 3) {
                            const novoValor = ev.target.value.replace(/([^\d])/g, "").substring(3, 2);
                            if (novoValor === '9') {
                              setMascara("(99)99999-9999");
                            } else {
                              setMascara("(99)9999-9999");
                            }
                          }
                        }}
                      >
                        {(inputProps) =>
                          <TextField
                            {...inputProps}
                            fullWidth
                            type="text"
                            label="Telefone"
                            variant={estiloDeCampo}
                            placeholder="(99)99999-9999"
                            InputLabelProps={{ shrink: true }}
                          />
                        }
                      </InputMask>
                    )}
                  />
                </Grid>

                <Grid item xs={12} sm={12} md={12}>
                  <Controller
                    name="origTarefa"
                    control={control}
                    render={({ error }) => (
                      <TextField
                        fullWidth
                        type="text"
                        multiline
                        rowsMax={2}
                        label="Instruções"
                        variant={estiloDeCampo}
                        placeholder="Ex: Pegar documento"
                        InputLabelProps={{ shrink: true }}
                        inputProps={{ style: { textTransform: "uppercase" } }}
                        value={dados.origTarefa}
                        onChange={(e) => {
                          setDados({ ...dados, origTarefa: e.target.value });
                          setValue('origTarefa', e.target.value);
                        }}
                        error={!!errors.origTarefa}
                        helperText={errors.origTarefa ? errors.origTarefa.message : ''}
                      />
                    )}
                  />
                </Grid>
              </Grid>
            </Grid>
          </CardContent>
          <CardActions>
            <div style={{ width: '100%' }} >
              <Divider />
              <div className={classes.barraBotaoEmLinha}>
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

import React, { useEffect, useState } from 'react';
import { 
  Avatar, Button, Card, CardContent, CardHeader, Divider, Grid, TextField, Typography 
} from '@material-ui/core';
import { MonetizationOn, PinDrop } from '@material-ui/icons';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers';
import MyTFFloatNumberFormat2Digits from '../../components/MyTFFloatNumberFormat2Digits';
import MyTFFloatNumberFormat3Digits from '../../components/MyTFFloatNumberFormat3Digits';
import * as service from '../../services/ParametroService';
import { useAlerta } from '../../contexts/AlertaCtx';
import { useGeral } from '../../contexts/GeralCtx';
import PageCss from '../PagesCss';
import styles from '../../layout/styles';
import schema from './ParametroSch';
import { TIPO_ERRO, TIPO_SUCESSO } from '../../utils/global';


export default function Parametro() {

  const css = PageCss();
  const estilo = styles();
  const { setConteudo } = useAlerta();
  const { id, carregar, setCarregar, estiloDeCampo } = useGeral();
  const [percApp, setPercApp] = useState('');
  const [percEnt, setPercEnt] = useState('');
  const [distBike, setDistBike] = useState('');
  const [distMoto, setDistMoto] = useState('');
  const [distCarro, setDistCarro] = useState('');
  
  
  const valoresIniciais = {
    percentualAplicativo: '', 
    percentualEntregador: '',
    distanciaBike: '',
    distanciaMoto: '',
    distanciaCarro: '',
  }

  const { register, handleSubmit, errors, reset, setValue } = useForm({
    mode: 'all',
    defaultValues: valoresIniciais,
    resolver: yupResolver(schema)
  });

  useEffect(() => {
    if (carregar) {
      async function buscaDado() {
        try {
          const {data} = await service.obtem("/parametros/1");
          if (data) {
            setValue('percentualAplicativo', data.percentualAplicativo * 100);
            setValue('percentualEntregador', data.percentualEntregador * 100);
            setValue('distanciaBike', data.distanciaBike * 1000);
            setValue('distanciaMoto', data.distanciaMoto * 1000);
            setValue('distanciaCarro', data.distanciaCarro * 1000);

            setPercApp(data.percentualAplicativo * 100);
            setPercEnt(data.percentualEntregador * 100);
            setDistBike(data.distanciaBike * 1000);
            setDistMoto(data.distanciaMoto * 1000);
            setDistCarro(data.distanciaCarro * 1000);
            setCarregar(false);
          }
        } catch (error) {
          setCarregar(false);
          setConteudo({
            tipo: TIPO_ERRO,
            descricao: error.response.data.detalhe,
            exibir: true
          });
        }
      }
      buscaDado();
    }
  }, [id, carregar, setCarregar, setConteudo, setValue])

  function submitForm(data) {
    async function grava() {
      try {
        const resposta = await service.altera(`/parametros/1`, data);
        if (resposta) {
          setConteudo({
            tipo: TIPO_SUCESSO,
            descricao: 'Registro alterado com sucesso!',
            exibir: true
          });
        }
        setCarregar(true);
      } catch (error) {
        setConteudo({
          tipo: TIPO_ERRO,
          descricao: error.response.data.detalhe,
          exibir: true
        });
      }
    }
    grava();
  }

  return (
    <div>
      <Grid container direction="row" justify="space-between" alignItems="center">
        <div>
          <div className={estilo.tituloPagina}>
            <Typography variant="h6">Parâmetros Gerais</Typography>
          </div>
          <div className={estilo.subtituloPagina}>
            <Typography variant="caption">Manutenção dos parâmetros</Typography>
          </div>
        </div>
        <div style={{ flex: 1 }} />
      </Grid>

      <form onSubmit={handleSubmit(submitForm)}>
        <Card variant="outlined">
          <CardContent>
            <Card>
              <CardHeader
                avatar={<Avatar className={css.avatar}><MonetizationOn /></Avatar>}
                title="Financeiro"
                subheader="Informe os percentuais do aplicativo e do entregador"
                className={css.cartaoTitulo}
              />
              <CardContent>
                <Grid container direction="row" spacing={2}>
                  <Grid item xs={12} sm={4}>
                    {/* <Controller
                      name="percentualAplicativo"
                      control={control}
                      render={({ error, onChange }) => (  */}
                        <TextField
                          fullWidth
                          name="percentualAplicativo"
                          label="Percentual Aplicativo"
                          variant={estiloDeCampo}
                          placeholder="0,00"
                          inputRef={register}
                          value={percApp}
                          onChange={(ev) => {
                            setPercApp(ev.target.value);
                            setValue('percentualAplicativo', ev.target.value);
                          }}
                          InputLabelProps={{ shrink: true }}
                          InputProps={{ inputComponent: MyTFFloatNumberFormat2Digits }}
                          error={!!errors.percentualAplicativo}
                          helperText={errors.percentualAplicativo ? errors.percentualAplicativo.message : ''}
                        />
                       {/* )}
                    />  */}
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    {/* <Controller
                      name="percentualEntregador"
                      control={control}
                      render={({ error, onChange }) => ( */}
                        <TextField
                          fullWidth
                          name="percentualEntregador"
                          label="Percentual Entregador"
                          variant={estiloDeCampo}
                          placeholder="0,00"
                          inputRef={register}
                          value={percEnt}
                          onChange={(ev) => {
                            setPercEnt(ev.target.value);
                            setValue('percentualEntregador', ev.target.value);
                          }}
                          InputLabelProps={{ shrink: true }}
                          InputProps={{ inputComponent: MyTFFloatNumberFormat2Digits }}
                          error={!!errors.percentualEntregador}
                          helperText={errors.percentualEntregador ? errors.percentualEntregador.message : ''}
                        />
                      {/* )}
                    /> */}
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
            <br/>
            <Card>
              <CardHeader
                avatar={<Avatar className={css.avatar}><PinDrop /></Avatar>}
                title="Localização"
                subheader="Informe a distância máxima para localização do entregador"
                className={css.cartaoTitulo}              
              />
              <CardContent>
                <Grid container direction="row" spacing={2}>
                      <Grid item xs={12} sm={4}>
                        {/* <Controller
                          name="distanciaBike"
                          control={control}
                          render={({ error, onChange }) => ( */}
                            <TextField
                              fullWidth
                              name="distanciaBike"
                              label="Distância máxima Bike"
                              variant={estiloDeCampo}
                              placeholder="0,000"
                              inputRef={register}
                              value={distBike}
                              onChange={(ev) => {
                                setDistBike(ev.target.value);
                                setValue('distanciaBike', ev.target.value);
                              }}
                              InputLabelProps={{ shrink: true }}
                              InputProps={{ inputComponent: MyTFFloatNumberFormat3Digits }}
                              error={!!errors.distanciaBike}
                              helperText={errors.distanciaBike ? errors.distanciaBike.message : ''}
                            />
                          {/* )}
                        /> */}
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        {/* <Controller
                          name="distanciaMoto"
                          control={control}
                          render={({ error, onChange }) => ( */}
                            <TextField
                              fullWidth
                              name="distanciaMoto"
                              label="Distância máxima Moto"
                              variant={estiloDeCampo}
                              placeholder="0,000"
                              inputRef={register}
                              value={distMoto}
                              onChange={(ev) => {
                                setDistMoto(ev.target.value);
                                setValue('distanciaMoto', ev.target.value);
                              }}
                              InputLabelProps={{ shrink: true }}
                              InputProps={{ inputComponent: MyTFFloatNumberFormat3Digits }}
                              error={!!errors.distanciaMoto}
                              helperText={errors.distanciaMoto ? errors.distanciaMoto.message : ''}
                            />
                          {/* )}
                        /> */}
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        {/* <Controller
                          name="distanciaCarro"
                          control={control}
                          render={({ error, onChange }) => ( */}
                            <TextField
                              fullWidth
                              name="distanciaCarro"
                              label="Distância máxima Carro"
                              variant={estiloDeCampo}
                              placeholder="0,000"
                              inputRef={register}
                              value={distCarro}
                              onChange={(ev) => {
                                setDistCarro(ev.target.value);
                                setValue('distanciaCarro', ev.target.value);
                              }}
                              InputLabelProps={{ shrink: true }}
                              InputProps={{ inputComponent: MyTFFloatNumberFormat3Digits }}
                              error={!!errors.distanciaCarro}
                              helperText={errors.distanciaCarro ? errors.distanciaCarro.message : ''}
                            />
                          {/* )}
                        /> */}
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
                onClick={() => reset(valoresIniciais)}
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


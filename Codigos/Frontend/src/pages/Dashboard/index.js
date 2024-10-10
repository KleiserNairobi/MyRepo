import React from 'react';
import { Button, Divider, Grid, Paper, Typography } from '@material-ui/core';
import { TransferWithinAStation } from '@material-ui/icons';
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers';
import DateFnsUtils from '@date-io/date-fns';
import { format } from "date-fns";
import ptBrLocale from "date-fns/locale/pt-BR";

// import style from '../../layout/styles';
import BoxEntrega from './BoxEntrega';
import BoxPagamento from './BoxPagamento';
import CabecalhoForm from '../../components/CabecalhoForm';
import { useGeral } from '../../contexts/GeralCtx';
import schema from './DashboardSch';
import PageCss from '../PagesCss';


class LocalizedUtils extends DateFnsUtils {
  getDatePickerHeaderText(date) {
    return format(date, "d MMM yyyy", { locale: this.locale });
  }
}

export default function Dashboard() {

  const css = PageCss();
  const { estiloDeCampo, filtro, setFiltro } = useGeral();
  // const [dataInicial, setDataInicial] = useState();
  // const [dataFinal, setDataFinal] = useState();
  // const [dataIni, setDataIni] = useState(null);
  // const [dataFin, setDataFin] = useState(null);

  const valoresIniciais = {
    dataInicial: filtro.dtInicial,
    dataFinal: filtro.dtFinal,
  };

  const { errors, control, handleSubmit, setValue } = useForm({
    mode: 'all',
    defaultValues: valoresIniciais,
    resolver: yupResolver(schema)
  });


  function submitForm(data) {

    console.log(data)

  }

  return (
    <div>
      <CabecalhoForm
        titulo="Dashboard"
        subtitulo="Oferece visualização rápida dos principais indicadores de desempenho"
        linkPagina="/dashboard"
        tituloBotao="Adicionar"
        exibirBotao={false}
      />

      <form onSubmit={handleSubmit(submitForm)}>
        <Paper style={{ padding: '10px' }}>
          <Grid container direction="row" spacing={2} >
            <Grid item xs={12} sm={4} md={3} lg={2}>
              <MuiPickersUtilsProvider utils={LocalizedUtils} locale={ptBrLocale} >
                <Controller
                  name="dataInicial"
                  control={control}
                  render={() => (
                    <KeyboardDatePicker
                      autoOk
                      fullWidth
                      //name="dataInicial"
                      label="Data Inicial"
                      format="dd/MM/yyyy"
                      cancelLabel="Cancelar"
                      variant={estiloDeCampo}
                      placeholder="dd/mm/aaaa"
                      InputLabelProps={{ shrink: true }}
                      error={!!errors.dataInicial}
                      helperText={errors.dataInicial ? errors.dataInicial.message : ''}
                      value={filtro.dtInicial}
                      onChange={(event) => {
                        setFiltro({ ...filtro, dtInicial: event });
                        setValue('dataInicial', event);
                      }}
                    />
                  )}
                />
              </MuiPickersUtilsProvider>
            </Grid>
            <Grid item xs={12} sm={4} md={3} lg={2}>
              <MuiPickersUtilsProvider utils={LocalizedUtils} locale={ptBrLocale} >
                <Controller
                  name="dataFinal"
                  control={control}
                  render={() => (
                    <KeyboardDatePicker
                      autoOk
                      fullWidth
                      //name="dataFinal"
                      label="Data Final"
                      format="dd/MM/yyyy"
                      cancelLabel="Cancelar"
                      variant={estiloDeCampo}
                      placeholder="dd/mm/aaaa"
                      InputLabelProps={{ shrink: true }}
                      error={!!errors.dataFinal}
                      helperText={errors.dataFinal ? errors.dataFinal.message : ''}
                      value={filtro.dtFinal}
                      onChange={(event) => {
                        setFiltro({ ...filtro, dtFinal: event });
                        setValue('dataFinal', event);
                      }}
                    />
                  )}
                />
              </MuiPickersUtilsProvider>
            </Grid>
            <Grid item xs={12} sm={4} md={3} lg={2}>
              <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-start', height: '100%' }}>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  disableElevation
                  className={css.formBotaoDeAcao}
                > Filtrar
                  </Button>
              </div>
              <div style={{ flex: 1 }} />
            </Grid>
          </Grid>
        </Paper>
      </form>



      <Grid container direction="row" spacing={2}>


        <Paper style={{ padding: '10px' }}>
          <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
            <TransferWithinAStation style={{ color: '#FEC601', margin: '10px' }} />
            <Typography variant="subtitle1" style={{ color: '#2F3D44' }}>ENTREGADORES</Typography>
          </div>
          <Divider />
          <Grid container direction="row" style={{ marginTop: '10px' }}>
            <Grid item xs={12} md={8}>
              <Grid container direction="row">
                <Grid item xs={12} md={6}>Total</Grid>
                <Grid item xs={12} md={6}>0</Grid>
                <Grid item xs={12} md={6}>Ativo</Grid>
                <Grid item xs={12} md={6}>0</Grid>
                <Grid item xs={12} md={6}>Inativo</Grid>
                <Grid item xs={12} md={6}>0</Grid>
              </Grid>
            </Grid>
          </Grid>
        </Paper>

        <Paper style={{ padding: '10px' }}>
          <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
            <TransferWithinAStation style={{ color: '#FEC601', margin: '10px' }} />
            <Typography variant="subtitle1" style={{ color: '#2F3D44' }}>ENTREGADORES</Typography>
          </div>
          <Divider />
          <Grid container direction="row" style={{ marginTop: '10px' }}>
            <Grid item xs={12} md={8}>
              <Grid container direction="row">
                <Grid item xs={12} md={6}>OnLine</Grid>
                <Grid item xs={12} md={6}>0</Grid>
                <Grid item xs={12} md={6}>OffLine</Grid>
                <Grid item xs={12} md={6}>0</Grid>
                <Grid item xs={12} md={6}>Disponível</Grid>
                <Grid item xs={12} md={6}>0</Grid>
                <Grid item xs={12} md={6}>Ocupado</Grid>
                <Grid item xs={12} md={6}>0</Grid>
              </Grid>
            </Grid>
          </Grid>
        </Paper>



        <Divider />

        <div style={{ backgrondColor: '#ccc', width: '100%' }}>
          <BoxEntrega />
          <BoxPagamento />
        </div>

      </Grid>

    </div>

  );
}

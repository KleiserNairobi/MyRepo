import React, {useState} from 'react';
import { Button, Card, CardActions, CardContent, Divider, Grid, MobileStepper, TextField, Typography } from '@material-ui/core';
import { AssignmentOutlined, KeyboardArrowLeft, KeyboardArrowRight } from '@material-ui/icons';
import InputMask from 'react-input-mask';
import { useForm, Controller } from "react-hook-form";
import Cabecalho from './Cabecalho';
import { useTheme } from '@material-ui/core/styles';
import { useAlerta } from '../../contexts/AlertaCtx';
import { useSolicitacao } from '../../contexts/SolicitacaoCtx';
import { useMapa } from '../../contexts/MapaCtx';
import { useGeral } from '../../contexts/GeralCtx';
import * as service from '../../services/EntregaCalcularService';
import { TIPO_ERRO } from '../../utils/global';
import Styles from './Styles';


export default function EntregaInstrucoes() {

  const classes = Styles();
  const theme = useTheme();
  const { estiloDeCampo } = useGeral();
  const { setConteudo } = useAlerta();
  const { setMapa } = useMapa();
  const { dados, setDados, tela, setTela, qtdeTelas, pgto, setPgto } = useSolicitacao();
  const [mascara, setMascara] = useState("(99)99999-9999");
  const valoresIniciais = { 
    destContato: dados.destContato,
    destTelefone: dados.destTelefone,
    destTarefa: dados.destTarefa,
  };
  const { handleSubmit, control, errors, setValue } = useForm({
    mode: 'all',
    defaultValues: valoresIniciais
  });

  function anterior() {
    setTela(tela - 1);
  }

  function defineDadosMapa() {
    var tipoViagem = null;
    if (dados.tipoVeiculo === "B") 
      tipoViagem = "BICYCLING";
    if (dados.tipoVeiculo === "C" || dados.tipoVeiculo === "M")
      tipoViagem = "DRIVING";
    setMapa({
      origem: `${dados.origLogradouro} ${dados.origNumero}, ${dados.origBairro}, ${dados.origCidade} - ${dados.origEstado}`,
      destino: `${dados.destLogradouro} ${dados.destNumero}, ${dados.destBairro}, ${dados.destCidade} - ${dados.destEstado}`,
      modoViagem: tipoViagem
    });      
  }

  function submitForm() {   
    service.calcularEntrega('entregas/calcular-entrega', dados)
    .then(response => {
      if (response.data) {
        setDados({
          ...dados, 
          distancia: response.data.distancia,
          valor: response.data.valorTotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }),
          previsao: response.data.previsao,
        });
        setPgto({
          ...pgto,
          idTabPreco: response.data.tabelaPreco,
          vlrPercurso: response.data.valorTotal,
          vlrProduto: 0,
          vlrTotal: response.data.valorTotal,
          strPercurso: response.data.valorTotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }),
        })
        defineDadosMapa();
      }
    })
    .catch(error => {
      setConteudo({
        tipo: TIPO_ERRO,
        descricao: error.response.data.detalhe,
        exibir: true
      });
    })

    setTela(tela + 1);
  }  

  return (
    <div>
      <form onSubmit={handleSubmit( submitForm )} >
        <Card>
          <Cabecalho/>
          <CardContent>
            <Grid container direction="row">
              <Grid item xs={12} >
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <div className={classes.tituloPagina}>
                    <AssignmentOutlined style={{ color: '#FEC601', marginRight: '6px' }} />
                    <Typography variant="subtitle1">Instruções de Entrega</Typography>
                  </div>
                  <div className={classes.subtituloPagina}>
                    <Typography variant="body2">Informe as instruções de entrega</Typography>
                  </div>
                </div>
              </Grid>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={9} md={8}>
                  <Controller
                    name="destContato"
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
                        value={dados.destContato}
                        onChange={(e) => {
                          setDados({ ...dados, destContato: e.target.value });
                          setValue('destContato', e.target.value);
                        }}
                        error={!!errors.destContato}
                        helperText={errors.destContato ? errors.destContato.message : ''}
                      />
                    )}
                  />
                </Grid>

                <Grid item xs={12} sm={3} md={4}>
                  <Controller
                    name="destTelefone"
                    control={control}
                    render={({ error }) => (
                      <InputMask
                        mask={mascara}
                        maskChar=" "
                        disabled={false}
                        value={dados.destTelefone}
                        onChange={(ev) => {
                          setDados({ ...dados, destTelefone: ev.target.value });
                          setValue('destTelefone', ev.target.value);
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
                    name="destTarefa"
                    control={control}
                    render={({ error }) => (
                      <TextField
                        fullWidth
                        type="text"
                        multiline
                        rowsMax={2}
                        label="Instruções"
                        variant={estiloDeCampo}
                        placeholder="Ex: Entregar documento"
                        InputLabelProps={{ shrink: true }}
                        inputProps={{ style: { textTransform: "uppercase" } }}
                        value={dados.destTarefa}
                        onChange={(e) => {
                          setDados({ ...dados, destTarefa: e.target.value });
                          setValue('destTarefa', e.target.value);
                        }}
                        error={!!errors.destTarefa}
                        helperText={errors.destTarefa ? errors.destTarefa.message : ''}
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

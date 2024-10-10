import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { 
  Avatar, Button, Card, CardContent, CardHeader, Checkbox, Divider, FormControlLabel, Grid, MenuItem, TextField, Typography 
} from '@material-ui/core';
import { ArrowBack, AccountBalanceWallet } from '@material-ui/icons';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers';
import CabecalhoForm from '../../components/CabecalhoForm';
import * as service from '../../services/apiBack';
import { useAlerta } from '../../contexts/AlertaCtx';
import { useGeral } from '../../contexts/GeralCtx';
import PageCss from '../PagesCss';
import schema from './GatewaySch';
import { TIPO_ERRO, TIPO_SUCESSO } from '../../utils/global';

export default function GatewayForm() {

  const css = PageCss();
  const history = useHistory();
  const { setConteudo } = useAlerta();
  const { id, alterar, setAlterar, setCarregar, estiloDeCampo } = useGeral();
  const [ativo, setAtivo] = useState(false);

  const valoresIniciais = {     
    tipoGateway: 'IG',
    nome: '',
    chave: '',
    token: '',
    ativo: false 
  };

  const { register, handleSubmit, errors, reset, setValue, control } = useForm({
    mode: 'all',
    defaultValues: valoresIniciais,
    resolver: yupResolver(schema)
  });

  useEffect(() => {
    if (alterar) {
      async function buscaDado() {
        try {
          const resposta = await service.obtem(`/gateways/${id}?campos=-id`);
          if (resposta.data) {            
            setValue('tipoGateway', resposta.data.tipoGateway);
            setValue('nome', resposta.data.nome);
            setValue('chave', resposta.data.chave);
            setValue('token', resposta.data.token);
            setValue('ativo', resposta.data.ativo);
            setAtivo(resposta.data.ativo);
          }
        } catch (error) {
          setConteudo({
            tipo: TIPO_ERRO,
            descricao: error.response.data.detalhe,
            exibir: true
          });
        }
      }
      buscaDado();
    }
  }, [id, alterar, setConteudo, setValue])

  function submitForm(data, e) {
    if (alterar & id > 0) {
      async function alteraDado() {
        try {
          const resposta = await service.altera(`/gateways/${id}`, data);
          if (resposta) {
            setConteudo({
              tipo: TIPO_SUCESSO,
              descricao: 'Registro alterado com sucesso!',
              exibir: true
            });
          }
          setAlterar(false);
          setCarregar(true);
          history.push('/gateways');
        } catch (error) {
          setConteudo({
            tipo: TIPO_ERRO,
            descricao: error.response.data.detalhe,
            exibir: true
          });
        }
      }
      alteraDado();
    } else {
      async function insereDado() {
        try {
          const resposta = await service.insere('/gateways', data);
          if (resposta) {
            setConteudo({
              tipo: TIPO_SUCESSO,
              descricao: 'Registro inserido com sucesso!',
              exibir: true
            });
          }
          reset(valoresIniciais);
          setAtivo(false);
        } catch (error) {
          setConteudo({
            tipo: TIPO_ERRO,
            descricao: error.response.data.detalhe,
            exibir: true
          });
        }
      }
      insereDado();
    }
  }

  return (
    <div>
      <CabecalhoForm
        titulo="Gateways"
        subtitulo="Adição de novo gateway"
        linkPagina="/gateways"
        icone={<ArrowBack />}
        tituloBotao="Retornar"
      />

      <form onSubmit={handleSubmit(submitForm)}>
        <Card variant="outlined">
          <CardContent>
            <Card>
              <CardHeader
                avatar={<Avatar className={css.avatar}><AccountBalanceWallet /></Avatar>}
                title="Gateway"
                subheader="Informe os dados do gateway"
                className={css.cartaoTitulo}
              />
              <CardContent>
                <Grid container direction="row" spacing={2}>
                  
                  <Grid item xs={12} md={2}>
                    <Controller
                      name="tipoGateway"
                      control={control}
                      as={
                        <TextField
                          select
                          fullWidth
                          label="Tipo de Gateway"
                          variant={estiloDeCampo}                          
                          InputLabelProps={{ shrink: true }}
                          error={!!errors.tipoGateway}
                          helperText={errors.tipoGateway ? errors.tipoGateway.message : ''}
                        >
                          <MenuItem value=''><strong>NENHUM</strong></MenuItem>
                          <MenuItem value={'IG'}>IG-IUGU</MenuItem>
                          <MenuItem value={'MP'}>MP-MERCADO PAGO</MenuItem>
                          <MenuItem value={'PM'}>PM-PAGAR.ME</MenuItem>
                          <MenuItem value={'PP'}>PP-PICPAY</MenuItem>
                          <MenuItem value={'PS'}>PS-PAGSEGURO</MenuItem>
                          <MenuItem value={'WC'}>WC-WIRECARD</MenuItem>
                        </TextField>
                      }
                    />
                  </Grid>

                  <Grid item xs={12} md={10}>
                    <TextField
                      fullWidth
                      type="text"
                      name="nome"
                      label="Nome"
                      variant={estiloDeCampo}
                      inputRef={register}
                      placeholder="EX.: IUGU SERVICOS NA INTERNET LTDA"
                      InputLabelProps={{ shrink: true }}
                      inputProps={{ style: { textTransform: "uppercase" } }}
                      error={!!errors.nome}
                      helperText={errors.nome ? errors.nome.message : ''}
                    />
                  </Grid>

                  <Grid item xs={12} md={12}>
                    <TextField
                      fullWidth
                      type="text"
                      name="chave"
                      label="Chave Pública"
                      variant={estiloDeCampo}
                      inputRef={register}
                      placeholder="EX.: 1DSsgJdB2AnWa..."
                      InputLabelProps={{ shrink: true }}
                      error={!!errors.chave}
                      helperText={errors.chave ? errors.chave.message : ''}
                    />
                  </Grid>

                  <Grid item xs={12} md={12}>
                    <TextField
                      fullWidth
                      type="text"
                      name="token"
                      label="Token de Acesso"
                      variant={estiloDeCampo}
                      inputRef={register}
                      placeholder="EX.: 1DSsgJdB2AnWa..."
                      InputLabelProps={{ shrink: true }}
                      error={!!errors.token}
                      helperText={errors.token ? errors.token.message : ''}
                    />
                  </Grid>

                  <Grid container direction="row" alignItems="center" item xs={12} sm={12}>
                    <FormControlLabel
                      label="Ativo"
                      inputRef={register}
                      control={<Checkbox name="ativo" checked={ativo} onChange={(ev)=>setAtivo(ev.target.checked)}/>}
                    />
                    <Typography variant={"caption"}><i>Marcar esse item fará com que o gateway apareça como opção de pagamento de cartão</i></Typography>
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
                onClick={() => { 
                  reset(valoresIniciais);
                  setAtivo(false);
                }}
                className={css.formBotaoDeAcao}
              > Limpar
              </Button>
            </div>
            
          </CardContent>
        </Card>
      </form>

    </div>
  )
}


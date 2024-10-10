import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { 
  Avatar, Button, Card, CardContent, CardHeader, Checkbox, Divider, 
  FormControlLabel, FormGroup, Grid, TextField, Typography 
} from '@material-ui/core';
import { ArrowBack, Group } from '@material-ui/icons';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers';
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers';
import InputMask from 'react-input-mask';
import DateFnsUtils from '@date-io/date-fns';
import format from "date-fns/format";
import ptBrLocale from "date-fns/locale/pt-BR";
import CabecalhoForm from '../../components/CabecalhoForm';
import * as service from '../../services/ColaboradorService';
import { useAlerta } from '../../contexts/AlertaCtx';
import { useGeral } from '../../contexts/GeralCtx';
import PageCss from '../PagesCss';
import schema from './ColaboradorSch';
import { TIPO_ERRO, TIPO_SUCESSO } from '../../utils/global';


class LocalizedUtils extends DateFnsUtils {
  getDatePickerHeaderText(date) {
    return format(date, "d MMM yyyy", { locale: this.locale });
  }
}

export default function ColaboradorForm() {

  const css = PageCss();
  const history = useHistory();
  const { setConteudo } = useAlerta();
  const { id, alterar, setAlterar, setCarregar, estiloDeCampo } = useGeral();
  const [mascara, setMascara] = useState("(99)99999-9999");
  const [telefone, setTelefone] = useState('');
  const [cpfCnpj, setCpfCnpj] = useState('');
  const [ativo, setAtivo] = useState(false);


  const valoresIniciais = { 
    nome: '',
    email: '',
    telefone: '',
    cpfCnpj: '',
    rg: '',
    nascimento: null,
    ativo: false,
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
          const resposta = await service.obtem(`/pessoas/${id}`);
          if (resposta.data) {
            setValue('nome', resposta.data.nome);
            setValue('email', resposta.data.email);
            setValue('telefone', resposta.data.telefone);
            setValue('cpfCnpj', resposta.data.cpfCnpj);
            setValue('rg', resposta.data.rg);
            setValue('nascimento', resposta.data.nascimento);
            setValue('ativo', resposta.data.ativo);

            setTelefone(resposta.data.telefone);
            setCpfCnpj(resposta.data.cpfCnpj);
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

  function submitForm(data) {
    if (alterar & id > 0) {
      async function alteraDado() {
        try {
          const resposta = await service.altera(`/pessoas/${id}`, data);
          if (resposta) {
            setConteudo({
              tipo: TIPO_SUCESSO,
              descricao: 'Registro alterado com sucesso!',
              exibir: true
            });
          }
          setAlterar(false);
          setCarregar(true);
          history.push('/colaboradores');
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
          const resposta = await service.insere('/pessoas', data);
          if (resposta) {
            setConteudo({
              tipo: TIPO_SUCESSO,
              descricao: 'Registro inserido com sucesso!',
              exibir: true
            });
          }
          reset(valoresIniciais);                  
          setTelefone('');
          setCpfCnpj('');
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
        titulo="Colaborador"
        subtitulo="Adição de novo registro"
        linkPagina="/colaboradores"
        icone={<ArrowBack />}
        tituloBotao="Retornar"
      />
      <br/>
      <form onSubmit={handleSubmit( submitForm )}>
        <Card variant="outlined">
          <CardContent>
            <Card>
              <CardHeader
                avatar={<Avatar className={css.avatar}><Group /></Avatar>}
                title="Colaborador"
                subheader="Informe os dados pessoais"
                className={css.cartaoTitulo}
              />
              <CardContent>
                <Grid container direction="row" spacing={2}>

                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      type="text"
                      name="nome"
                      label="Nome"
                      variant={estiloDeCampo}
                      inputRef={register}
                      placeholder=""
                      InputLabelProps={{ shrink: true }}
                      inputProps={{ style: { textTransform: "uppercase" } }}
                      error={!!errors.nome}
                      helperText={errors.nome ? errors.nome.message : ''}
                    />
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      type="email"
                      name="email"
                      label="E-Mail"
                      variant={estiloDeCampo}
                      inputRef={register}
                      placeholder="email@email.com.br"
                      InputLabelProps={{ shrink: true }}
                      inputProps={{ style: { textTransform: "lowercase" } }}
                      error={!!errors.email}
                      helperText={errors.email ? errors.email.message : ''}
                    />
                  </Grid>

                  <Grid item xs={12} md={3}>
                    <Controller
                      name="telefone"
                      control={control}                        
                      render={({ onChange, onBlur, value }) => (
                        <InputMask
                          mask={mascara}
                          maskChar=" "
                          disabled={false}
                          value={telefone}                           
                          onChange={(ev) => {
                            setTelefone(ev.target.value);
                            setValue("telefone", ev.target.value)
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
                              error={!!errors.telefone}
                              helperText={errors.telefone ? errors.telefone.message : ''}                                                             
                            />
                          }
                        </InputMask>
                      )}
                    />
                  </Grid>
                  
                  <Grid item xs={12} md={3}>
                    <Controller
                      name="cpfCnpj"
                      control={control}
                      render={({ onChange, onBlur, value }) => (
                        <InputMask
                          mask="999.999.999-99"
                          maskChar=" "
                          disabled={false}
                          value={cpfCnpj}
                          onChange={(ev) => {
                            setCpfCnpj(ev.target.value);
                            setValue("cpfCnpj", ev.target.value)
                          }}
                        >
                          {(inputProps) =>
                            <TextField
                              {...inputProps}
                              fullWidth
                              type="text"
                              label="CPF"
                              variant={estiloDeCampo}
                              placeholder="999.999.999-99"
                              InputLabelProps={{ shrink: true }}
                            />
                          }
                        </InputMask>
                      )}
                    />
                  </Grid>

                  <Grid item xs={12} md={3}>
                    <TextField
                      fullWidth
                      type="text"
                      name="rg"
                      label="Identidade"
                      variant={estiloDeCampo}
                      inputRef={register}
                      placeholder="9.999 SSP-GO"
                      InputLabelProps={{ shrink: true }}
                      inputProps={{ style: { textTransform: "uppercase" } }}
                      error={!!errors.rg}
                      helperText={errors.rg ? errors.rg.message : ''}
                    />
                  </Grid>

                  <Grid item xs={12} sm={3}>
                    <MuiPickersUtilsProvider utils={LocalizedUtils} locale={ptBrLocale} >                  
                      <Controller
                        name="nascimento"
                        control={control}
                        as={                   
                          <KeyboardDatePicker
                            autoOk
                            fullWidth
                            name="nascimento"
                            label="Nascimento"
                            format="dd/MM/yyyy"                       
                            cancelLabel="Cancelar"                        
                            variant={estiloDeCampo}
                            placeholder="dd/mm/aaaa"
                            InputLabelProps={{ shrink: true }}
                            error={!!errors.nascimento}
                            helperText={errors.nascimento ? errors.nascimento.message : ''}
                          />
                        }                      
                      />
                    </MuiPickersUtilsProvider>
                  </Grid>

                  <FormGroup style={{marginLeft: 8, marginTop: 20 }}>
                    <Grid container direction="row" alignItems="center" item xs={12} sm={12}>
                      <FormControlLabel
                        label="Ativo"
                        inputRef={register}
                        control={
                          <Checkbox 
                            name="ativo" 
                            checked={ativo} 
                            onChange={(ev)=>setAtivo(ev.target.checked)}
                          />
                        }
                      />
                      <Typography variant={"caption"}><i>Marcar esse item dará ao cliente a possibilidade de acessar o sistema e fazer uso dos recursos que lhe são permitidos.</i></Typography>
                    </Grid>
                  </FormGroup>
                   
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
                  setTelefone('');
                  setCpfCnpj('');
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
  );
}


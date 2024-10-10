import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { 
  Avatar, Button, Card, CardContent, CardHeader, Divider, Grid, IconButton, TextField 
} from '@material-ui/core';
import { ArrowBack, HomeWork, YoutubeSearchedFor } from '@material-ui/icons';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers';
import InputMask from 'react-input-mask';
import CabecalhoForm from '../../components/CabecalhoForm';
import * as service from '../../services/EnderecoService';
import { useAlerta } from '../../contexts/AlertaCtx';
import { useGeral } from '../../contexts/GeralCtx';
import PageCss from '../PagesCss';
import schema from './EnderecoSch';
import { TIPO_ERRO, TIPO_SUCESSO } from '../../utils/global';
import ModalPesquisa from '../../components/ModalPesquisa';
import MyTablePesquisa from '../../components/MyTablePesquisa';


export default function ClienteForm() {

  const css = PageCss();
  const history = useHistory();
  const { setConteudo } = useAlerta();
  const [mascara, setMascara] = useState("(99)99999-9999");
  const [telefoneCliente, setTelefoneCliente] = useState('');
  const [cep, setCep] = useState('');
  const [abrirModal, setAbrirModal] = useState(false);
  const [dadosPesquisa, setDadosPesquisa] = useState();
  const [nomePessoa, setNomePessoa] = useState('');
  const { 
    id, auxId, setAuxId, alterar, setAlterar, setCarregar, 
    estiloDeCampo, buscarDados, setBuscarDados 
  } = useGeral();

  //const [ativo, setAtivo] = useState(false);

  const valoresIniciais = {
    pessoa: {id: null},
    cep: '',
    logradouro: '',
    numero: '',
    complemento: '',
    referencia: '',
    bairro: '',
    cidade: '',
    estado: '',
    nomeCliente: '',
    telefoneCliente: '',
  };

  const { register, handleSubmit, errors, reset, setValue, control } = useForm({
    mode: 'all',
    defaultValues: valoresIniciais,
    resolver: yupResolver(schema)
  });

  const colunasTabPesquisa = [
    { title: 'ID', field: 'id', width: 20 },
    { title: 'Código', field: 'codigo', width: 20 },
    { title: 'Nome', field: 'nome' },
  ]

  // Busca dados do cep - quando ocorre onBlur
  function onBlurCep(ev) {    
    const cep = ev.target.value?.replace(/\D/g, '');
    if (cep?.length !== 8) {
      return;
    }
    service.obtem(`enderecos/buscar-endereco-por-cep/?cep=${cep}`)
    .then(response => {
      setValue('logradouro', response.data.logradouro);
      setValue('complemento', response.data.complemento);
      setValue('bairro', response.data.bairro);
      setValue('cidade', response.data.cidade);
      setValue('estado', response.data.estado);
    })
    .catch(erro => {
      setConteudo({
        tipo: TIPO_ERRO,
        descricao: erro.response.data.detalhe,
        exibir: true
      });
    })
  }      

  // Abre modal para escolha da pessoa
  function carregaDadosMembro() {
    setAbrirModal(true);
    service.obtem('/pessoas?campos=id,tipo,nome,email,telefone')
    .then(response => {
      setDadosPesquisa(response.data);
    })
    .catch(erro => {
      setConteudo({
        tipo: TIPO_ERRO,
        descricao: erro.response.data.detalhe,
        exibir: true
      });
    })
  }

  // Busca dados da pessoa - quando ocorre onBlur
  async function onBlurMembro(ev) {
    if (ev.target.value === '') {
      setNomePessoa('');
    } else {
      const codigo = ev.target.value;
      try {
        const { data } = await service.obtem(`/pessoas/${codigo}?campos=nome`);
        if (data) {
          setValue('pessoa.id', codigo);
          setNomePessoa(data.nome);
        }
      } catch (error) {
        setNomePessoa('');
        setConteudo({
          tipo: TIPO_ERRO,
          descricao: error.response.data.detalhe,
          exibir: true
        });
      }
    }
  }

  // Effect para buscar dados da pessoa - sem ter disparado onBlur
  useEffect(() => {
    if (buscarDados) {
      async function getUnico() {
        try {
          const { data } = await service.obtem(`/pessoas/${auxId}?campos=nome`);
          if (data) {
            setValue('pessoa.id', auxId);
            setNomePessoa(data.nome);
            setAuxId(-1);
          }
        } catch (error) {
          setValue('pessoa.id', null);
          setNomePessoa('');
          setAuxId(-1);
          setConteudo({
            tipo: TIPO_ERRO,
            descricao: 'Ocorreu um erro ao buscar os dados do membro',
            exibir: true
          });
        }
      }
      getUnico();
    }
    return () => {      
      setBuscarDados(false);
    }
  }, [auxId, setAuxId, setValue, buscarDados, setBuscarDados, setConteudo]);


  useEffect(() => {
    if (alterar) {
      async function buscaDado() {
        try {
          const resposta = await service.obtem(`/enderecos/${id}`);
          if (resposta.data) {
            setValue('pessoa.id', resposta.data.pessoa.id);
            setValue('cep', resposta.data.cep);
            setValue('logradouro', resposta.data.logradouro);
            setValue('numero', resposta.data.numero);
            setValue('complemento', resposta.data.complemento);
            setValue('referencia', resposta.data.referencia);
            setValue('bairro', resposta.data.bairro);
            setValue('cidade', resposta.data.municipio.nome);
            setValue('estado', resposta.data.municipio.estado.sigla);
            setValue('nomeCliente', resposta.data.nomeCliente);
            setValue('telefoneCliente', resposta.data.telefoneCliente);
            setNomePessoa(resposta.data.pessoa.nome);
            setCep(resposta.data.cep);
            setTelefoneCliente(resposta.data.telefoneCliente);
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
          const resposta = await service.altera(`/enderecos/${id}`, data);
          if (resposta) {
            setConteudo({
              tipo: TIPO_SUCESSO,
              descricao: 'Registro alterado com sucesso!',
              exibir: true
            });
          }
          setAlterar(false);
          setCarregar(true);
          history.push('/enderecos');
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
          const resposta = await service.insere('/enderecos', data);
          if (resposta) {
            setConteudo({
              tipo: TIPO_SUCESSO,
              descricao: 'Registro inserido com sucesso!',
              exibir: true
            });
          }
          reset(valoresIniciais);
          setNomePessoa('');
          setCep('');
          setTelefoneCliente('');
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
        titulo="Endereço"
        subtitulo="Adição de novo endereço"
        linkPagina="/enderecos"
        icone={<ArrowBack />}
        tituloBotao="Retornar"
      />
      <br/>
      <form onSubmit={handleSubmit( submitForm )}>
        <Card variant="outlined">
          <CardContent>
            <Card>
              <CardHeader
                avatar={<Avatar className={css.avatar}><HomeWork /></Avatar>}
                title="Endereço"
                subheader="Informe o endereço (residencial ou comercial)"
                className={css.cartaoTitulo}
              />
              <CardContent>
                <Grid container direction="row" justify="flex-start" spacing={2}>
                    
                  <Grid item xs={12} sm={2} >
                    <TextField
                      fullWidth
                      type="number"
                      name="pessoa.id"
                      label="Membro"
                      variant={estiloDeCampo}
                      inputRef={register}
                      placeholder="EX.: 1"
                      InputLabelProps={{ shrink: true }}
                      error={!!errors.pessoa}
                      helperText={errors.pessoa ? errors.pessoa.id.message : ''}
                      InputProps={{
                        onBlur: (ev) => onBlurMembro(ev),
                        endAdornment: 
                          <IconButton
                            size="small"
                            onClick={() => carregaDadosMembro()}
                          >
                            <YoutubeSearchedFor fontSize="small" />
                          </IconButton>
                      }}
                    />
                  </Grid>

                  <Grid item xs={12} sm={10} >
                    <TextField
                      fullWidth
                      type="text"
                      name="nomePessoa"
                      label="Nome do Membro"
                      variant={estiloDeCampo}
                      value={nomePessoa}
                      placeholder=""
                      InputLabelProps={{ shrink: true }}
                      inputProps={{ style: { textTransform: "uppercase" } }}
                    />
                  </Grid>

                  <Grid item xs={12} md={2}>
                    <Controller
                      name="cep"
                      control={control}
                      render={({ onChange, onBlur, value }) => (
                        <InputMask
                          mask="99999-999"
                          maskChar=" "
                          disabled={false}
                          value={cep}
                          onChange={(ev) => {
                            setCep(ev.target.value);
                            setValue("cep", ev.target.value)
                          }}
                          onBlur={(ev)=>onBlurCep(ev) }
                        >
                          {(inputProps) =>
                            <TextField
                              {...inputProps}
                              fullWidth
                              type="text"
                              label="CEP"
                              variant={estiloDeCampo}
                              placeholder="99999-999"
                              InputLabelProps={{ shrink: true }}
                              error={!!errors.cep}
                              helperText={errors.cep ? errors.cep.message : ''}
                            />
                          }
                        </InputMask>
                      )}
                    />
                  </Grid>

                  <Grid item xs={12} md={8}>
                    <TextField
                      fullWidth
                      type="text"
                      name="logradouro"
                      label="Logradouro"
                      variant={estiloDeCampo}
                      inputRef={register}
                      placeholder="rua, avenida..."
                      InputLabelProps={{ shrink: true }}
                      inputProps={{ style: { textTransform: "uppercase" } }}
                      error={!!errors.logradouro}
                      helperText={errors.logradouro ? errors.logradouro.message : ''}
                    />
                  </Grid>

                  <Grid item xs={12} md={2}>
                    <TextField
                      fullWidth
                      type="text"
                      name="numero"
                      label="Número"
                      variant={estiloDeCampo}
                      inputRef={register}
                      placeholder="nr. ou s/n"
                      InputLabelProps={{ shrink: true }}
                      inputProps={{ style: { textTransform: "uppercase" } }}
                      error={!!errors.numero}
                      helperText={errors.numero ? errors.numero.message : ''}
                    />
                  </Grid>

                  <Grid item xs={12} md={12}>
                    <TextField
                      fullWidth
                      type="text"
                      name="complemento"
                      label="Complemento"
                      variant={estiloDeCampo}
                      inputRef={register}
                      placeholder="apto, qd, lt..."
                      InputLabelProps={{ shrink: true }}
                      inputProps={{ style: { textTransform: "uppercase" } }}
                      error={!!errors.complemento}
                      helperText={errors.complemento ? errors.complemento.message : ''}
                    />
                  </Grid>

                  <Grid item xs={12} md={12}>
                    <TextField
                      fullWidth
                      type="text"
                      name="referencia"
                      label="Referência"
                      variant={estiloDeCampo}
                      inputRef={register}
                      placeholder="próximo a..."
                      InputLabelProps={{ shrink: true }}
                      inputProps={{ style: { textTransform: "uppercase" } }}
                    />
                  </Grid>

                  <Grid item xs={12} md={5}>
                    <TextField
                      fullWidth
                      type="text"
                      name="bairro"
                      label="Bairro"
                      variant={estiloDeCampo}
                      inputRef={register}
                      placeholder=""
                      InputLabelProps={{ shrink: true }}
                      inputProps={{ style: { textTransform: "uppercase" } }}
                      error={!!errors.bairro}
                      helperText={errors.bairro ? errors.bairro.message : ''}
                    />
                  </Grid>

                  <Grid item xs={12} md={5}>
                    <TextField
                      fullWidth
                      type="text"
                      name="cidade"
                      label="Cidade"
                      variant={estiloDeCampo}
                      inputRef={register}
                      placeholder=""
                      InputLabelProps={{ shrink: true }}
                      inputProps={{ style: { textTransform: "uppercase" } }}
                      error={!!errors.cidade}
                      helperText={errors.cidade ? errors.cidade.message : ''}
                    />
                  </Grid>

                  <Grid item xs={12} md={2}>
                    <TextField
                      fullWidth
                      type="text"
                      name="estado"
                      label="Estado"
                      variant={estiloDeCampo}
                      inputRef={register}
                      placeholder=""
                      InputLabelProps={{ shrink: true }}
                      inputProps={{ style: { textTransform: "uppercase" } }}
                      error={!!errors.estado}
                      helperText={errors.estado ? errors.estado.message : ''}
                    />
                  </Grid>

                  <Grid item xs={12} md={8}>
                    <TextField
                      fullWidth
                      type="text"
                      name="nomeCliente"
                      label="Nome do Cliente"
                      variant={estiloDeCampo}
                      inputRef={register}
                      placeholder=""
                      InputLabelProps={{ shrink: true }}
                      inputProps={{ style: { textTransform: "uppercase" } }}
                      error={!!errors.nomeCliente}
                      helperText={errors.nomeCliente ? errors.nomeCliente.message : ''}
                    />
                  </Grid>

                  <Grid item xs={12} md={4}>
                    <Controller
                      name="telefoneCliente"
                      control={control}
                      render={({ onChange, onBlur, value }) => (
                        <InputMask
                          mask={mascara}
                          maskChar=" "
                          disabled={false}
                          value={telefoneCliente}
                          onChange={(ev) => {
                            setTelefoneCliente(ev.target.value);
                            setValue("telefoneCliente", ev.target.value)
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
                              label="Telefone do Cliente"
                              variant={estiloDeCampo}
                              placeholder="(99)99999-9999"
                              InputLabelProps={{ shrink: true }}
                              error={!!errors.telefoneCliente}
                              helperText={errors.telefoneCliente ? errors.telefoneCliente.message : ''}
                            />
                          }
                        </InputMask>
                      )}
                    />
                  </Grid>

                </Grid>
              </CardContent>
            </Card>

            <br/>

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
                  setNomePessoa('');
                  setCep('');
                  setTelefoneCliente('');                
                }}
                className={css.formBotaoDeAcao}
              > Limpar
              </Button>
            </div>
            
          </CardContent>
        </Card>
      </form>

      <ModalPesquisa
        abrir={abrirModal}
        setAbrir={setAbrirModal}
        titulo='Membro'
        subtitulo='Pesquisa de membro'
        className={css.root}
      >
        <MyTablePesquisa
          colunas={colunasTabPesquisa}
          dados={dadosPesquisa}
          selecionarLinhas={false}
          exportar={false}
          ocultarEditar={true}
          ocultarExcluir={true}
        />
      </ModalPesquisa>

    </div>
  );
}


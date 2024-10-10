import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { 
  Avatar, Button, Card, CardContent, CardHeader, Checkbox, Divider, 
  FormControlLabel, Grid, IconButton, MenuItem, TextField, Typography 
} from '@material-ui/core';
import { ArrowBack, Payment, YoutubeSearchedFor } from '@material-ui/icons';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers';
import ModalPesquisa from '../../components/ModalPesquisa';
import MyTablePesquisa from '../../components/MyTablePesquisa';
import CabecalhoForm from '../../components/CabecalhoForm';
import * as service from '../../services/apiBack';
import { useAlerta } from '../../contexts/AlertaCtx';
import { useGeral } from '../../contexts/GeralCtx';
import PageCss from '../PagesCss';
import schema from './ContaSch';
import { TIPO_ERRO, TIPO_SUCESSO } from '../../utils/global';


export default function ContaForm() {

  const css = PageCss();
  const history = useHistory();
  const { setConteudo } = useAlerta();
  const [nomeAgencia, setNomeAgencia] = useState('');
  const [nomePessoa, setNomePessoa] = useState('');
  const [abrirModal, setAbrirModal] = useState(false);
  const [abrirModalPessoa, setAbrirModalPessoa] = useState(false);
  const [dadosPesquisa, setDadosPesquisa] = useState();
  const [dadosPesquisaPessoa, setDadosPesquisaPessoa] = useState();
  const [ativo, setAtivo] = useState(false);
  const { 
    id, auxId, setAuxId, alterar, auxValor, setAuxValor, setAlterar, 
    setCarregar, estiloDeCampo, buscarDados, setBuscarDados
  } = useGeral();

  const valoresIniciais = {     
    pessoa: { id: null },
    agencia: { id: null },
    tipoConta: 'C',
    codigo: '',
    ativo: false
  };

  const { register, handleSubmit, errors, reset, setValue, control } = useForm({
    mode: 'all',
    defaultValues: valoresIniciais,
    resolver: yupResolver(schema)
  });

  const colunasTabPesqPessoa = [
    { title: 'ID', field: 'id', width: 20 },
    { title: 'Tipo', field: 'tipo', width: 20 },
    { title: 'Nome', field: 'nome', width: 150 },
    { title: 'E-Mail', field: 'email', width: 150 },
    { title: 'Telefone', field: 'telefone', width: 40 },
  ]

  const colunasTabPesqAgencia = [
    { title: 'ID', field: 'id', width: 20 },
    { title: 'Banco', field: 'banco.id', width: 20 },
    { title: 'Código', field: 'codigo', width: 20 },
    { title: 'Nome', field: 'nome', width: 200 },
  ]

  // Abre modal para escolha da pessoa - membro
  function carregaDadosPessoa() {
    setAbrirModalPessoa(true);
    setAuxValor('pessoa');
    service.obtem('/pessoas?campos=id,tipo,nome,email,telefone')
    .then(response => {
      setDadosPesquisaPessoa(response.data);
    })
    .catch(erro => {
      setAuxValor('');
      setConteudo({
        tipo: TIPO_ERRO,
        descricao: erro.response.data.detalhe,
        exibir: true
      });
    })
  }

  // Busca dados da pessoa - quando ocorre onBlur
  async function onBlurPessoa(ev) {
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

  // Abre modal para escolha da agencia
  function carregaDadosAgencia() {
    setAbrirModal(true);
    setAuxValor('agencia');
    service.obtem('/agencias?campos=id,banco.id,codigo,nome')
    .then(response => {
      setDadosPesquisa(response.data);
    })
    .catch(erro => {
      setAuxValor('');
      setConteudo({
        tipo: TIPO_ERRO,
        descricao: erro.response.data.detalhe,
        exibir: true
      });
    })
  }

  // Busca dados da agência - quando ocorre onBlur
  async function onBlurAgencia(ev) {
    if (ev.target.value === '') {
      setNomeAgencia('');
    } else {
      const codigo = ev.target.value;
      try {
        const { data } = await service.obtem(`/agencias/${codigo}?campos=nome`);
        if (data) {
          setValue('agencia.id', codigo);
          setNomeAgencia(data.nome);
        }
      } catch (error) {
        setNomeAgencia('');
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
    if (buscarDados && auxValor === "pessoa") {
      async function getUnico() {
        try {
          const { data } = await service.obtem(`/pessoas/${auxId}?campos=nome`);
          if (data) {
            setValue('pessoa.id', auxId);
            setNomePessoa(data.nome);
            setAuxId(-1);
            setAuxValor('');
          }
        } catch (error) {
          setValue('pessoa.id', null);
          setNomePessoa('');
          setAuxId(-1);
          setAuxValor('');
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
  }, [auxId, setAuxId, auxValor, setAuxValor, setValue, buscarDados, setBuscarDados, setConteudo]);

  // Effect para buscar dados da agência - sem ter disparado onBlur
  useEffect(() => {
    if (buscarDados && auxValor === "agencia") {
      async function getUnico() {
        try {
          const { data } = await service.obtem(`/agencias/${auxId}?campos=nome`);
          if (data) {
            setValue('agencia.id', auxId);
            setNomeAgencia(data.nome);
            setAuxId(-1);
            setAuxValor('');
          }
        } catch (error) {
          setValue('agencia.id', null);
          setNomeAgencia('');
          setAuxId(-1);
          setAuxValor('');
          setConteudo({
            tipo: TIPO_ERRO,
            descricao: 'Ocorreu um erro ao buscar os dados da Agência',
            exibir: true
          });
        }
      }
      getUnico();
    }
    return () => {      
      setBuscarDados(false);
    }
  }, [auxId, setAuxId, auxValor, setAuxValor, setValue, buscarDados, setBuscarDados, setConteudo]);

  // Effect para buscar dados da conta - relativo a alteração
  useEffect(() => {
    if (alterar) {
      async function buscaDado() {
        try {
          const campos = "?campos=pessoa.id,pessoa.nome,agencia.id,agencia.nome,tipoConta,codigo,ativo";
          const resposta = await service.obtem(`/contas/${id}${campos}`);
          if (resposta.data) {
            setValue('pessoa.id', resposta.data.pessoa.id);
            setValue('agencia.id', resposta.data.agencia.id);
            setValue('tipoConta', resposta.data.tipoConta);
            setValue('codigo', resposta.data.codigo);
            setValue('ativo', resposta.data.ativo);
            setNomePessoa(resposta.data.pessoa.nome);
            setNomeAgencia(resposta.data.agencia.nome);
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
          const resposta = await service.altera(`/contas/${id}`, data);
          if (resposta) {
            setConteudo({
              tipo: TIPO_SUCESSO,
              descricao: 'Registro alterado com sucesso!',
              exibir: true
            });
          }
          setAlterar(false);
          setCarregar(true);
          history.push('/contas');
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
          const resposta = await service.insere('/contas', data);
          if (resposta) {
            setConteudo({
              tipo: TIPO_SUCESSO,
              descricao: 'Registro inserido com sucesso!',
              exibir: true
            });
          }
          reset(valoresIniciais);
          setNomePessoa('');
          setNomeAgencia('');
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
        titulo="Conta Bancária"
        subtitulo="Adição de novo registro"
        linkPagina="/contas"
        icone={<ArrowBack />}
        tituloBotao="Retornar"
      />
      <br/>
      <form onSubmit={handleSubmit( submitForm )}>
        <Card variant="outlined">
          <CardContent>
            <Card>
              <CardHeader
                avatar={<Avatar className={css.avatar}><Payment /></Avatar>}
                title="Conta Bancária"
                subheader="Informe os dados bancários"
                className={css.cartaoTitulo}
              />
              <CardContent>
                <Grid container direction="row" spacing={2}>

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
                        onBlur: (ev) => onBlurPessoa(ev),
                        endAdornment: 
                          <IconButton
                            size="small"
                            onClick={() => carregaDadosPessoa()}
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
 
                  <Grid item xs={12} sm={2} >
                    <TextField
                      fullWidth
                      type="number"
                      name="agencia.id"
                      label="Agência"
                      variant={estiloDeCampo}
                      inputRef={register}
                      placeholder="EX.: 1"
                      InputLabelProps={{ shrink: true }}
                      error={!!errors.agencia}
                      helperText={errors.agencia ? errors.agencia.id.message : ''}
                      InputProps={{
                        onBlur: (ev) => onBlurAgencia(ev),
                        endAdornment: 
                          <IconButton
                            size="small"
                            onClick={() => carregaDadosAgencia()}
                          >
                            <YoutubeSearchedFor fontSize="small" />
                          </IconButton>
                      }}
                    />
                  </Grid>

                  <Grid item xs={12} sm={4} >
                    <TextField
                      fullWidth
                      type="text"
                      name="nomeAgencia"
                      label="Nome da Agência"
                      variant={estiloDeCampo}
                      value={nomeAgencia}
                      placeholder="EX.: AG. CENTRAL"
                      InputLabelProps={{ shrink: true }}
                      inputProps={{ style: { textTransform: "uppercase" } }}
                    />
                  </Grid>

                  <Grid item xs={12} sm={3}>
                    <Controller
                      name="tipoConta"
                      control={control}
                      as={
                        <TextField
                          select
                          fullWidth
                          label="Tipo de Conta"
                          variant={estiloDeCampo}
                          placeholder="EX.: CORRENTE"
                          InputLabelProps={{ shrink: true }}
                          error={!!errors.tipoConta}
                          helperText={errors.tipoConta ? errors.tipoConta.message : ''}
                        >
                          <MenuItem  key="C" value="C">CORRENTE</MenuItem>
                          <MenuItem  key="P" value="P">POUPANÇA</MenuItem>
                        </TextField>
                      }
                    />
                  </Grid>

                  <Grid item xs={12} sm={3}>
                    <TextField
                      fullWidth
                      type="text"
                      name="codigo"
                      label="Código da Conta"
                      variant={estiloDeCampo}
                      inputRef={register}
                      placeholder="EX.: 49250-1"
                      InputLabelProps={{ shrink: true }}
                      inputProps={{ style: { textTransform: "uppercase" } }}
                      error={!!errors.codigo}
                      helperText={errors.codigo ? errors.codigo.message : ''}
                    />
                  </Grid>

                  <Grid container direction="row" alignItems="center" item xs={12} sm={12}>
                    <FormControlLabel
                      label="Ativo"
                      inputRef={register}
                      control={
                        <Checkbox name="ativo" checked={ativo} onChange={(ev)=>setAtivo(ev.target.checked)}/>
                      }
                    />
                    <Typography variant={"caption"}><i>Marcar esse item dirá ao sistema que essa é a conta a ser considerada nas transações financeiras</i></Typography>
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
                  setNomePessoa('');
                  setNomeAgencia('');
                  setAtivo(false);
                }}
                className={css.formBotaoDeAcao}
              > Limpar
              </Button>
            </div>
            
          </CardContent>
        </Card>
      </form>

      <ModalPesquisa
        abrir={abrirModalPessoa}
        setAbrir={setAbrirModalPessoa}
        titulo='Membro'
        subtitulo='Pesquisa de membro'
        className={css.root}
      >
        <MyTablePesquisa
          colunas={colunasTabPesqPessoa}
          dados={dadosPesquisaPessoa}
          selecionarLinhas={false}
          exportar={false}
          ocultarEditar={true}
          ocultarExcluir={true}
        />
      </ModalPesquisa>

      <ModalPesquisa
        abrir={abrirModal}
        setAbrir={setAbrirModal}
        titulo='Agência'
        subtitulo='Pesquisa de agência'
        className={css.root}
      >
        <MyTablePesquisa
          colunas={colunasTabPesqAgencia}
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


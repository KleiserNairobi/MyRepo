import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { 
  Avatar, Button, Card, CardContent, CardHeader, Checkbox, Divider, FormControlLabel, 
  Grid, IconButton, TextField, Typography 
} from '@material-ui/core';
import { ArrowBack, Person, YoutubeSearchedFor } from '@material-ui/icons';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers';
import CabecalhoForm from '../../components/CabecalhoForm';
import * as service from '../../services/apiBack';
import { useAlerta } from '../../contexts/AlertaCtx';
import { useGeral } from '../../contexts/GeralCtx';
import { TIPO_ERRO, TIPO_SUCESSO } from '../../utils/global';
import ModalPesquisa from '../../components/ModalPesquisa';
import MyTablePesquisa from '../../components/MyTablePesquisa';
import InputMask from 'react-input-mask';
import schema from './UsuarioSch';
import PageCss from '../PagesCss';


export default function UsuarioForm() {

  const css = PageCss();
  const history = useHistory();
  const { setConteudo } = useAlerta();
  const { 
    id, auxId, setAuxId, alterar, setAlterar, setCarregar, estiloDeCampo, buscarDados, setBuscarDados   
  } = useGeral();
  const [nomePessoa, setNomePessoa] = useState(localStorage.getItem('chamai_nomePessoa'));
  const [abrirModal, setAbrirModal] = useState(false);
  const [dadosPesquisa, setDadosPesquisa] = useState();
  const [telefone, setTelefone] = useState('');
  const [ativo, setAtivo] = useState(false);
  const [mascara, setMascara] = useState("(99)99999-9999");

  const valoresIniciais = {
    pessoa: { id: localStorage.getItem('chamai_idPessoa') },
    nome: '',
    email: '',
    telefone: '',
    ativo: false
  };

  const { register, handleSubmit, errors, control, reset, setValue } = useForm({
    mode: 'all',
    defaultValues: valoresIniciais,
    resolver: yupResolver(schema)
  });


  const colunasTabPesquisa = [
    { title: 'ID', field: 'id', width: 20 },
    { title: 'Tipo', field: 'tipo', width: 20 },
    { title: 'Nome', field: 'nome', width: 200 },
    { title: 'E-Mail', field: 'email', width: 200 },
    { title: 'Telefone', field: 'telefone', width: 50 }
  ]

  // Effect para buscar dados do usuário - relativo a alteração
  useEffect(() => {
    if (alterar) {
      async function buscaDado() {
        try {
          const filtro = "?campos=pessoa.id,pessoa.nome,nome,email,telefone,senha,ativo";
          const resposta = await service.obtem(`/usuarios/${id}${filtro}`);
          if (resposta.data) {
            setValue('pessoa.id', resposta.data.pessoa.id);
            setNomePessoa(resposta.data.pessoa.nome);
            setValue('nome', resposta.data.nome);
            setValue('email', resposta.data.email);
            setValue('telefone', resposta.data.telefone);
            setValue('senha', resposta.data.senha);
            setValue('ativo', resposta.data.ativo);
            setAtivo(resposta.data.ativo);
            setTelefone(resposta.data.telefone);
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

  // Effect para buscar dados do usuário - sem ter disparado onBlur
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
            descricao: 'Ocorreu um erro ao buscar os dados do Membro',
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

  // Abre modal para escolha da pessoa
  function carregaDadosPessoa() {
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
  async function onBlurPessoa(ev) {
    if (ev.target.value === '') {
      setNomePessoa('');
    } else {
      const idPessoa = ev.target.value;
      try {
        const { data } = await service.obtem(`/pessoas/${idPessoa}?campos=nome`);
        if (data) {
          setValue('pessoa.id', idPessoa);
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

  function submitForm(data) {
    if (alterar & id > 0) {
      async function alteraDado() {
        try {
          const resposta = await service.altera(`/usuarios/${id}`, data);
          if (resposta) {
            setConteudo({
              tipo: TIPO_SUCESSO,
              descricao: 'Registro alterado com sucesso!',
              exibir: true
            });
            setAlterar(false);
            setCarregar(true);
            history.push('/usuarios');
          }
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
          const resposta = await service.insere('/usuarios', data);
          if (resposta) {
            setConteudo({
              tipo: TIPO_SUCESSO,
              descricao: 'Registro inserido com sucesso!',
              exibir: true
            });
            setAtivo(false);
            setTelefone('');
            setNomePessoa('');
            reset(valoresIniciais);
          }
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
        titulo="Usuário"
        subtitulo="Adição de novo registro"
        linkPagina="/usuarios"
        icone={<ArrowBack />}
        tituloBotao="Retornar"
      />

      <form onSubmit={handleSubmit( submitForm )}>
        <Card variant="outlined">
          <CardContent>
            <Card>
              <CardHeader
                avatar={<Avatar className={css.avatar}><Person /></Avatar>}
                title="Usuário"
                subheader="Informe os dados do usuário"
                className={css.cartaoTitulo}
              />
              <CardContent>
                <Grid container direction="row" spacing={3}>

                  <Grid item xs={12} sm={3}>
                    <TextField
                      fullWidth
                      type="number"
                      name="pessoa.id"
                      label="Membro"
                      variant={estiloDeCampo}
                      inputRef={register}
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
                      InputLabelProps={{ shrink: true }}
                    />
                  </Grid>
                  
                  <Grid item xs={12} sm={9} >
                    <TextField
                      fullWidth
                      name="nomePessoa"
                      label="Nome do Membro"
                      variant={estiloDeCampo}
                      value={nomePessoa}
                      InputLabelProps={{ shrink: true }}
                      inputProps={{ style: { textTransform: "uppercase" } }}
                    />
                  </Grid>
                  
                  <Grid item xs={12} sm={5}>
                    <TextField
                      fullWidth
                      name="nome"
                      label="Nome do Usuário"
                      variant={estiloDeCampo}
                      inputRef={register}
                      error={!!errors.nome}
                      helperText={errors.nome ? errors.nome.message : ''}
                      InputLabelProps={{ shrink: true }}
                      inputProps={{ style: { textTransform: "uppercase" } }}
                    />
                  </Grid>
                  
                  <Grid item xs={12} sm={4}>
                    <TextField
                      fullWidth
                      name="email"
                      label="E-Mail"
                      variant={estiloDeCampo}
                      inputRef={register}
                      error={!!errors.email}
                      helperText={errors.email ? errors.email.message : ''}
                      InputLabelProps={{ shrink: true }}
                      inputProps={{ style: { textTransform: "lowercase" } }}
                    />
                  </Grid>
                  
                  <Grid item xs={12} sm={3}>
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
                              variant={estiloDeCampo}
                              label="Telefone"
                              error={!!errors.telefone}
                              helperText={errors.telefone ? errors.telefone.message : ''}
                              InputLabelProps={{ shrink: true }}
                            />
                          }
                        </InputMask>
                      )}
                    />
                  </Grid>
{/* 
                  <Grid item xs={12} sm={4}>
                    <TextField
                      fullWidth
                      type="password"
                      name="senha"
                      label="Senha"
                      variant={estiloDeCampo}
                      inputRef={register}
                      error={!!errors.senha}
                      helperText={errors.senha ? errors.senha.message : ''}
                      InputLabelProps={{ shrink: true }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <TextField
                      fullWidth
                      type="password"
                      name="confirmeSenha"
                      label="Confirme a Senha"
                      variant={estiloDeCampo}
                      error={!!errors.confirmeSenha}
                      helperText={errors.confirmeSenha ? errors.confirmeSenha.message : ''}
                      InputLabelProps={{ shrink: true }}
                    />
                  </Grid>
*/}
                  <Grid container direction="row" alignItems="center" item xs={12} sm={12}>
                    <FormControlLabel
                      label="Ativo"
                      inputRef={register}
                      control={
                        <Checkbox name="ativo" checked={ativo} onChange={(ev)=>setAtivo(ev.target.checked)}/>
                      }
                    />
                    <Typography variant={"caption"}><i>Marcar esse item dará ao usuário a possibilidade de acessar o sistema e fazer uso dos recursos que lhe são permitidos</i></Typography>
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
                  setAtivo(false);
                  setNomePessoa('');
                  setTelefone('');
                  reset(valoresIniciais);
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

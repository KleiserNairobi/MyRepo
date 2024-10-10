import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { 
  Avatar, Button, Card, CardContent, CardHeader, Checkbox, Divider, FormControlLabel, 
  FormGroup, Grid, MenuItem, TextField, Typography, IconButton 
} from '@material-ui/core';
import { ArrowBack, DriveEta, YoutubeSearchedFor } from '@material-ui/icons';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers';
import CabecalhoForm from '../../components/CabecalhoForm';
import ModalPesquisa from '../../components/ModalPesquisa';
import MyTablePesquisa from '../../components/MyTablePesquisa';
import * as service from '../../services/apiBack';
import { useAlerta } from '../../contexts/AlertaCtx';
import { useGeral } from '../../contexts/GeralCtx';
import PageCss from '../PagesCss';
import schema from './VeiculoSch';
import { TIPO_ERRO, TIPO_SUCESSO } from '../../utils/global';


export default function VeiculoForm() {

  const css = PageCss();
  const history = useHistory();
  const { setConteudo } = useAlerta();
  const [ativo, setAtivo] = useState(false);
  const [abrirModalPessoa, setAbrirModalPessoa] = useState(false);
  const [nomePessoa, setNomePessoa] = useState('');
  const [dadosPesquisaPessoa, setDadosPesquisaPessoa] = useState();
  const { 
    id, auxId, setAuxId, alterar, setAlterar, setCarregar, estiloDeCampo, buscarDados, setBuscarDados
  } = useGeral();

  const valoresIniciais = { 
    pessoa: {id: null}, 
    tipo: 'B',
    renavan: '',
    placa: '',
    modelo: '',
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

  // Abre modal para escolha da pessoa - membro
  function carregaDadosPessoa() {
    setAbrirModalPessoa(true);
    service.obtem('/pessoas?campos=id,tipo,nome,email,telefone')
    .then(response => {
      setDadosPesquisaPessoa(response.data);
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
          const resposta = await service.obtem(`/veiculos/${id}`);
          if (resposta.data) {
            setValue('pessoa.id', resposta.data.pessoa.id);
            setValue('tipo', resposta.data.tipo);
            setValue('renavan', resposta.data.renavan);
            setValue('placa', resposta.data.placa);
            setValue('modelo', resposta.data.modelo);
            setValue('ativo', resposta.data.ativo);
            setAtivo(resposta.data.ativo);
            setNomePessoa(resposta.data.pessoa.nome);
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
          const resposta = await service.altera(`/veiculos/${id}`, data);
          if (resposta) {
            setConteudo({
              tipo: TIPO_SUCESSO,
              descricao: 'Registro alterado com sucesso!',
              exibir: true
            });
          }
          setAlterar(false);
          setCarregar(true);
          history.push('/veiculos');
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
          const resposta = await service.insere('/veiculos', data);
          if (resposta) {
            setConteudo({
              tipo: TIPO_SUCESSO,
              descricao: 'Registro inserido com sucesso!',
              exibir: true
            });
          }
          reset(valoresIniciais);
          setNomePessoa('');
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
        titulo="Veículo"
        subtitulo="Adição de novo registro"
        linkPagina="/veiculos"
        icone={<ArrowBack />}
        tituloBotao="Retornar"
      />

      <form onSubmit={handleSubmit( submitForm )}>
        <Card variant="outlined">
          <CardContent>
            <Card>
              <CardHeader
                avatar={<Avatar className={css.avatar}><DriveEta /></Avatar>}
                title="Veículo"
                subheader="Informe os dados do veículo"
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

                  <Grid item xs={12} sm={2}>
                    <Controller
                      name="tipo"
                      control={control}
                      as={
                        <TextField
                          select
                          fullWidth
                          label="Tipo de Veículo"
                          variant={estiloDeCampo}
                          placeholder="EX.: BIKE"
                          InputLabelProps={{ shrink: true }}
                          error={!!errors.tipo}
                          helperText={errors.tipo ? errors.tipo.message : ''}
                        >
                          <MenuItem  key="B" value="B">BICICLETA</MenuItem>
                          <MenuItem  key="M" value="M">MOTO</MenuItem>
                          <MenuItem  key="C" value="C">CARRO</MenuItem>
                        </TextField>
                      }                      
                    />
                  </Grid>

                  <Grid item xs={12} sm={5}>
                    <TextField
                      fullWidth
                      type="text"
                      name="modelo"
                      label="Modelo"
                      variant={estiloDeCampo}
                      inputRef={register}
                      InputLabelProps={{ shrink: true }}
                      inputProps={{ style: { textTransform: "uppercase" } }}
                      error={!!errors.modelo}
                      helperText={errors.modelo ? errors.modelo.message : ''}
                    />
                  </Grid>

                  <Grid item xs={12} sm={3}>
                    <TextField
                      fullWidth
                      type="text"
                      name="renavan"
                      label="Renavan"
                      variant={estiloDeCampo}
                      inputRef={register}
                      InputLabelProps={{ shrink: true }}
                      inputProps={{ style: { textTransform: "uppercase" } }}
                      error={!!errors.renavan}
                      helperText={errors.renavan ? errors.renavan.message : ''}
                    />
                  </Grid>

                  <Grid item xs={12} sm={2}>
                    <TextField
                      fullWidth
                      type="text"
                      name="placa"
                      label="Placa"
                      variant={estiloDeCampo}
                      inputRef={register}
                      InputLabelProps={{ shrink: true }}
                      inputProps={{ style: { textTransform: "uppercase" } }}
                      error={!!errors.placa}
                      helperText={errors.placa ? errors.placa.message : ''}
                    />
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
                      <Typography variant={"caption"}><i>Marcar esse item define que este é o veículo que está sendo usado pelo entregador.</i></Typography>
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
                  setNomePessoa('');
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

    </div>
  );
}


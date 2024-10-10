import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Card } from '@material-ui/core';
import * as service from '../../services/apiBack';
import CabecalhoForm from '../../components/CabecalhoForm';
import MyTable from '../../components/MyTable';
import { useGeral } from '../../contexts/GeralCtx';
import { useAlerta } from '../../contexts/AlertaCtx';
import { TIPO_ERRO, TIPO_SUCESSO } from '../../utils/global';
import PagesCss from '../PagesCss';
import ModalExclusao from '../../components/ModalExclusao';

export default function Endereco() {

  const css = PagesCss();
  const history = useHistory();
  const { setConteudo } = useAlerta();
  const [carregando, setCarregando] = useState(false);
  const [dados, setDados] = useState([]);
  const [abrirModalExclusao, setAbrirModalExclusao] = useState(false);
  const {
    id, setId, alterar, excluir, texto, setTexto,
    confirmaExcluir, setConfirmaExcluir, carregar, setCarregar
  } = useGeral();

  const colunasTabela = [
    { title: 'ID', field: 'id', cellStyle: {width: '20px', fontSize: 13} },
    { title: 'Membro', field: 'pessoa.nome', cellStyle: {width: '240px', fontSize: 13} },
    { title: 'CEP', field: 'cep', cellStyle: {width: '120px', fontSize: 13} },
    { title: 'Logradouro', field: 'logradouro', cellStyle: {width: '240px', fontSize: 13} },
    { title: 'Número', field: 'numero', cellStyle: {width: '20px', fontSize: 13} },
    { title: 'Complemento', field: 'complemento', cellStyle: {width: '140px', fontSize: 13} },
    { title: 'Bairro', field: 'bairro', width: 3000, cellStyle: {fontSize: 13} }
  ];

  // Effect para carregar o modal de exclusão
  useEffect(() => {
    if (excluir && id > 0) {
      async function buscaDado() {
        const resposta = await service.obtem(`/enderecos/${id}?campos=logradouro,numero`);
        if (resposta.data) {
          setTexto(`REG.: ${id} - ${resposta.data.logradouro}, ${resposta.data.numero}`);
        }
        setAbrirModalExclusao(true);
      }
      buscaDado();
    }
  }, [id, excluir, setTexto])

  // Effect para exclusão do registro selecionado
  useEffect(() => {
    if (confirmaExcluir && id > 0) {
      setCarregando(true);
      async function excluiRegistro() {
        try {
          const resposta = await service.exclui(`/enderecos/${id}`);
          if (resposta.status === 204) {
            setConteudo({
              tipo: TIPO_SUCESSO,
              descricao: 'Registro excluído com sucesso!',
              exibir: true
            });
            setId(-1);
            setConfirmaExcluir(false);
            setCarregar(true);
          }
        } catch (erro) {
          setConteudo({
            tipo: TIPO_ERRO,
            descricao: erro.response.data.detalhe,
            exibir: true
          });
          setCarregar(false);
          setCarregando(false);
          setConfirmaExcluir(false);
        }
      }
      excluiRegistro();
    }
  }, [id, setId, confirmaExcluir, setConfirmaExcluir, setConteudo, setCarregar])

  // Effect para carregar a tela de cadastro
  useEffect(() => {
    if (alterar) {
      history.push('/enderecos-form');
    }
  }, [alterar, history])

  // Effect para carregamento dos enderecos
  useEffect(() => {
    if (carregar) {
      setCarregando(true);
      service.obtem(`/enderecos`)
        .then(response => {
          const lista = response.data;
          setDados(lista);
          setCarregando(false);
        })
        .catch(error => {
          setConteudo({
            tipo: TIPO_ERRO,
            descricao: error.response.data.detalhe,
            exibir: true
          });
        })
      setCarregar(false);
    }
  }, [id, carregar, setCarregar, setConteudo])

  return (
    <div>
      <CabecalhoForm
        titulo="Endereços"
        subtitulo="Listagem de todos dos endereços"
        linkPagina="/enderecos-form"
        tituloBotao="Adicionar"
        exibirBotao={true}
      />
      <br />
      <Card className={css.root}>
        <MyTable
          colunas={colunasTabela}
          dados={dados}
          carregando={carregando}
          selecionarLinhas={false}
          exportar={true}
          titulo="Endereços"
        />
      </Card>      
      <ModalExclusao
        abrir={abrirModalExclusao}
        setAbrir={setAbrirModalExclusao}
        registro={texto}
        titulo="Tem certeza que quer excluir este registro?"
        subtitulo="Você não poderá desfazer esta operação."
      />
    </div>
  );
  
}

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

export default function Usuario() {

  const css = PagesCss();
  const history = useHistory();
  const { setConteudo } = useAlerta();
  const {
    id, setId, alterar, excluir, texto, setTexto,
    confirmaExcluir, setConfirmaExcluir, carregar, setCarregar
  } = useGeral();
  const [carregando, setCarregando] = useState(false);
  const [dados, setDados] = useState([]);
  const [abrirModalExclusao, setAbrirModalExclusao] = useState(false);

  const colunasTabela = [
    { title: 'ID', field: 'id', cellStyle: {width: '20px', fontSize: 13} },
    { title: 'Membro', field: 'pessoa', cellStyle: {width: '290px', fontSize: 13} },
    { title: 'Usuário', field: 'nome', cellStyle: {width: '290px', fontSize: 13} },
    { title: 'E-Mail', field: 'email', cellStyle: {width: '210px', fontSize: 13} },
    { title: 'Telefone', field: 'telefone', width: 3000, cellStyle: {fontSize: 13} }
  ];

  
  useEffect(() => {
    if (excluir && id > 0) {
      async function buscaDado() {
        const resposta = await service.obtem(`/usuarios/${id}?campos=nome`);
        if (resposta.data) {
          setTexto(`REG.: ${id} - ${resposta.data.nome}`);
        }
        setAbrirModalExclusao(true);
      }
      buscaDado();
    }
  }, [id, excluir, setTexto])

  useEffect(() => {
    if (confirmaExcluir && id > 0) {
      setCarregando(true);
      async function excluiRegistro() {
        try {
          const resposta = await service.exclui(`/usuarios/${id}`);
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

  useEffect(() => {
    if (alterar) {
      history.push('/usuarios-form');
    }
  }, [alterar, history])

  useEffect(() => {
    if (carregar) {
      setCarregando(true);
      service.obtem('/usuarios/?campos=id,pessoa.nome,nome,email,telefone,ativo')
        .then(response => {
          var lista = response.data.map(function (item) {
            return {
              id: item.id,
              pessoa: item.pessoa.nome,
              nome: item.nome,
              email: item.email,
              telefone: item.telefone,
              ativo: item.ativo
            }
          });
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
        titulo="Usuários"
        subtitulo="Listagem de todas os usuários"
        linkPagina="/usuarios-form"
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
          titulo="Usuários" 
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

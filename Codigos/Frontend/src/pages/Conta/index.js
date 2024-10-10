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

export default function Conta() {

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
    { title: 'Membro', field: 'pessoa.nome', cellStyle: {width: '300px', fontSize: 13} },
    { title: 'Banco', field: 'agencia.banco.nome', cellStyle: {width: '300px', fontSize: 13} },    
    { title: 'Tipo Conta', field: 'tipoConta', cellStyle: {width: '160px', fontSize: 13} },
    { title: 'Agência', field: 'agencia.codigo', cellStyle: {width: '50px', fontSize: 13} },
    { title: 'Conta', field: 'codigo', cellStyle: {width: '50px', fontSize: 13} },
    { title: 'Ativo', field: 'ativo', type: 'boolean', width: 3000 },
  ];

  // Effect para carregar o modal de exclusão
  useEffect(() => {
    if (excluir && id > 0) {
      async function buscaDado() {
        const resposta = await service.obtem(`/contas/${id}?campos=codigo`);
        if (resposta.data) {
          setTexto(`REG.: ${id} - ${resposta.data.codigo}`);
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
          const resposta = await service.exclui(`/contas/${id}`);
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
      history.push('/contas-form');
    }
  }, [alterar, history])

  // Effect para carregamento das contas
  useEffect(() => {
    if (carregar) {
      setCarregando(true);
      service.obtem('/contas')
      .then(response => {
        var lista = response.data.map(function (item) {
          let tipo = null;
          switch (item.tipoConta) {
            case "C":
              tipo = "CORRENTE";
              break;
            case "P":
              tipo = "POUPANÇA";
              break;
            default:
              tipo = "";
          }
          return {
            'id': item.id,
            'pessoa.nome': item.pessoa.nome,
            'agencia.banco.nome': item.agencia.banco.nome,
            'tipoConta': tipo,
            'agencia.codigo': item.agencia.codigo,
            'codigo': item.codigo,
            'ativo': item.ativo
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
        titulo="Contas Bancárias"
        subtitulo="Listagem de todas as contas bancárias"
        linkPagina="/contas-form"
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
          titulo="Contas Bancárias"
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

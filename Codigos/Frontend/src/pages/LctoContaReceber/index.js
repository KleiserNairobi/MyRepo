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

export default function LctoContaReceber() {

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
    { title: 'ID', field: 'id', cellStyle: {width: '10px', fontSize: 13} },
    //{ title: 'Categoria', field: 'categoria.id' },
    //{ title: 'Moeda', field: 'moeda.id' },
    //{ title: 'Origem', field: 'origem' },
    { title: 'Doc', field: 'documento', cellStyle: {width: '20px', fontSize: 13} },
    { title: 'Parcelas', field: 'parcelas', cellStyle: {width: '20px', fontSize: 13} },    
    { title: 'Credor', field: 'pessoa.nome', cellStyle: {width: '300px', fontSize: 13} },
    { title: 'Emissão', field: 'emissao', type: 'date', cellStyle: {width: '50px', fontSize: 13} },
    { title: '1º Vcto', field: 'primeiroVcto', type: 'date', cellStyle: {width: '50px', fontSize: 13} },
    { title: 'Vlr. Total', field: 'valorTotal', type: 'currency', cellStyle: {width: '100px', fontSize: 13},
      currencySetting: {
        locale: 'pt-BR', currencyCode:'BRL', 
        minimumFractionDigits: 2, maximumFractionDigits: 2
      }
    },
    { title: 'Vlr. Receber', field: 'valorReceber', type: 'currency', cellStyle: {width: '100px', fontSize: 13},
      currencySetting: {
        locale: 'pt-BR', currencyCode:'BRL', 
        minimumFractionDigits: 2, maximumFractionDigits: 2
      }
    },
    //{ title: 'Histórico', field: 'nome' },
  ];

  // Effect para carregar o modal de excluão
  useEffect(() => {
    if (excluir && id > 0) {
      async function buscaDado() {
        const resposta = await service.obtem(`/contas-receber/${id}?campos=origem,documento`);
        if (resposta.data) {
          setTexto(`REG.: ${id}, ORIGEM: ${resposta.data.origem}, DOCUMENTO: ${resposta.data.documento}`);
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
          const resposta = await service.exclui(`/contas-receber/${id}`);
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
      history.push('/lctoContaReceber-form');
    }
  }, [alterar, history])

  // Effect para carregamento dos recebimentos
  useEffect(() => {
    if (carregar) {
      setCarregando(true);
      service.obtem('/contas-receber')
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
        titulo="Contas a Receber"
        subtitulo="Listagem de todas contas a receber lançadas"
        linkPagina="/lctoContaReceber-form"
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
          titulo="Lançamento de Contas a Receber"
          apelido="LctoCtaReceber"        
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

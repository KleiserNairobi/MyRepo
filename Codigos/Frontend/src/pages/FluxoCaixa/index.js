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

export default function FluxoCaixa() {

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
    { title: 'ID', field: 'id', width: 10 },
    { title: 'Conta', field: 'conta.id', width: 20 },
    { title: 'Nome', field: 'nome', width: 200 },
    { title: 'Tipo', field: 'tipoContaCaixa', width: 20 },
    { title: 'Mês', field: 'mes', width: 20, type: 'number' },
    { title: 'Ano', field: 'ano', width: 20, type: 'number' },
    { title: 'Fechamento', field: 'dataFechamento', width: 50, type: 'date' },
    { title: 'Saldo Inicial', field: 'saldoAnterior', width: 60, type: 'currency', 
      currencySetting: {
        locale: 'pt-BR', currencyCode:'BRL', 
        minimumFractionDigits: 2, maximumFractionDigits: 2
      },
    },
    { title: 'Entradas', field: 'movimentoRecebimento', width: 60, type: 'currency', 
      currencySetting: {
        locale: 'pt-BR', currencyCode:'BRL', 
        minimumFractionDigits: 2, maximumFractionDigits: 2
      },
    },
    { title: 'Saídas', field: 'movimentoPagamento', width: 60, type: 'currency', 
      currencySetting: {
        locale: 'pt-BR', currencyCode:'BRL', 
        minimumFractionDigits: 2, maximumFractionDigits: 2
      },
    },
    { title: 'Saldo Atual', field: 'saldoAtual', width: 60, type: 'currency', 
      currencySetting: {
        locale: 'pt-BR', currencyCode:'BRL', 
        minimumFractionDigits: 2, maximumFractionDigits: 2
      },
    },
    { title: 'Saldo a Transportar', field: 'saldoDisponivel', width: 60, type: 'currency', 
      currencySetting: {
        locale: 'pt-BR', currencyCode:'BRL', 
        minimumFractionDigits: 2, maximumFractionDigits: 2
      },
    },
  ];

  // Effect para carregar o modal de excluão
  useEffect(() => {
    if (excluir && id > 0) {
      async function buscaDado() {
        const resposta = await service.obtem(`/conta-caixas/${id}?campos=conta,nome`);
        if (resposta.data) {
          setTexto(`REG.: ${id} - ${resposta.data.nome}`);
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
          const resposta = await service.exclui(`/conta-caixas/${id}`);
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
      history.push('/fluxo-caixas-form');
    }
  }, [alterar, history])

  // Effect para carregamento dos fluxo de caixas
  useEffect(() => {
    if (carregar) {
      setCarregando(true);
      service.obtem('/conta-caixas')
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
        titulo="Fluxo de Caixa"
        subtitulo="Listagem de todos os fluxos de caixa"
        linkPagina="/fluxo-caixas-form"
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
          titulo="Fluxo de Caixa"
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

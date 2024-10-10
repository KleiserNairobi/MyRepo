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

export default function TarifaAdicional() {

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
    { title: 'Tabela', field: 'tabelaPreco.id', cellStyle: {width: '20px', fontSize: 13} },
    { title: 'Desc. Tabela', field: 'tabelaPreco.descricao', cellStyle: {width: '500px', fontSize: 13} },
    { title: 'Hora Inicial', field: 'horaInicio', type: 'time', cellStyle: {width: '40px', fontSize: 13} },
    { title: 'Hora Final', field: 'horaFim', type: 'time', cellStyle: {width: '40px', fontSize: 13} },
    { title: 'Tarifa Adicional', field: 'tarifaAdicional', type: 'currency', cellStyle: {width: '40px', fontSize: 13},
      currencySetting: {
        locale: 'pt-BR', 
        currencyCode:'BRL', 
        minimumFractionDigits:2, 
        maximumFractionDigits:2
      }
    },
  ];

  // Effect para carregar o modal de excluão
  useEffect(() => {
    if (excluir && id > 0) {
      async function buscaDado() {
        const resposta = await service.obtem(`/tabela-preco-itens/${id}?campos=tabelaPreco,horaInicio,horaFim`);
        if (resposta.data) {
          setTexto(`REG.: ${id} - TABELA: ${resposta.data.tabelaPreco} HORÁRIO: ${resposta.data.horaInicio} AS ${resposta.data.horaFim}`);
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
          const resposta = await service.exclui(`/tabela-preco-itens/${id}`);
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
      history.push('/tarifas-adicionais-form');
    }
  }, [alterar, history])

  // Effect para carregamento dos adicionais de tabelas de preço
  useEffect(() => {
    if (carregar) {
      setCarregando(true);
      service.obtem('/tabela-preco-itens')
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
        titulo="Tarifas Adicionais"
        subtitulo="Listagem de todas as tarifas adicionais"
        linkPagina="/tarifas-adicionais-form"
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
          titulo="Tarifas Adicionais" 
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


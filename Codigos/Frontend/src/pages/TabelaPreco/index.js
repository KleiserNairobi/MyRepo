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

export default function TabelaPreco() {

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
    { title: 'Tp. Veículo', field: 'tipoVeiculo', cellStyle: {width: '30px', fontSize: 13} },
    { title: 'Descrição', field: 'descricao', cellStyle: {width: '450px', fontSize: 13} },
    { title: 'Início Validade', field: 'validadeInicio', type: 'date', cellStyle: {width: '50px', fontSize: 13} },
    { title: 'Fim Validade', field: 'validadeFim', type: 'date', cellStyle: {width: '50px', fontSize: 13} },
    { title: 'KM Básico', field: 'tarifaKm', type: 'numeric', cellStyle: {width: '60px', fontSize: 13} },
    { title: 'Valor Básico', field: 'tarifaValor', type: 'currency', cellStyle: {width: '60px', fontSize: 13},      
      currencySetting: {
        locale: 'pt-BR', 
        currencyCode:'BRL', 
        minimumFractionDigits:2, 
        maximumFractionDigits:2
      } 
    },
    { title: 'Ativo', field: 'ativo', type: 'boolean', cellStyle: {width: '50px', fontSize: 13} },
  ];

  // Effect para carregar o modal de excluão
  useEffect(() => {
    if (excluir && id > 0) {
      async function buscaDado() {
        const resposta = await service.obtem(`/tabela-precos/${id}?campos=descricao`);
        if (resposta.data) {
          setTexto(`REG.: ${id} - ${resposta.data.descricao}`);
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
          const resposta = await service.exclui(`/tabela-precos/${id}`);
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
      history.push('/tabela-precos-form');
    }
  }, [alterar, history])

  // Effect para carregamento das tabelas de preço
  useEffect(() => {
    if (carregar) {
      setCarregando(true);
      service.obtem('/tabela-precos')
      .then(response => {
        var lista = response.data.map(function (item) {
          let tipo = null;
          switch (item.tipoVeiculo) {
            case "B":
              tipo = "BIKE";
              break;
            case "M":
              tipo = "MOTO";
              break;
            case "C":
              tipo = "CARRO";
              break;
            case "CM":
              tipo = "CAMINHÃO";
              break;
            default:
              tipo = "";
          }
          return {
            'id': item.id,
            'tipoVeiculo': tipo,
            'descricao': item.descricao,
            'validadeInicio': item.validadeInicio,
            'validadeFim': item.validadeFim,
            'tarifaKm': item.tarifaKm,
            'tarifaValor': item.tarifaValor,
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
        titulo="Tabela de Preços"
        subtitulo="Listagem de todas as tabelas de preços"
        linkPagina="/tabela-precos-form"
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
          titulo="Tabelas de Preços" 
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

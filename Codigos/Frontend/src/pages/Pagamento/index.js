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

export default function Pagamento() {

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
    { title: 'Conta', field: 'contaPagar.id', cellStyle: {width: '20px', fontSize: 13} },
    { title: 'Parcela', field: 'id', cellStyle: {width: '20px', fontSize: 13} },
    { title: 'Documento', field: 'contaPagar.documento', cellStyle: {width: '30px', fontSize: 13} },
    { title: 'Fornecedor', field: 'contaPagar.pessoa.nome', cellStyle: {width: '300px', fontSize: 13} },
    { title: 'Emissão', field: 'dataEmissao', type: 'date', cellStyle: {width: '50px', fontSize: 13} },
    { title: 'Vencimento', field: 'dataVencimento', type: 'date', cellStyle: {width: '50px', fontSize: 13} },
    { title: 'Vlr. Total', field: 'valor', type: 'currency', cellStyle: {width: '130px', fontSize: 13},
      currencySetting: {
        locale: 'pt-BR', currencyCode:'BRL', 
        minimumFractionDigits: 2, maximumFractionDigits: 2
      } 
    },
    { title: 'Vlr. Pago', field: 'valorPagamento', type: 'currency', cellStyle: {width: '130px', fontSize: 13},
      currencySetting: {
        locale: 'pt-BR', currencyCode:'BRL', 
        minimumFractionDigits: 2, maximumFractionDigits: 2
      }      
    },
    { title: 'Pagamento', field: 'dataPagamento', type: 'date', width: '3000', cellStyle: {fontSize: 13} },

  ];

  // Effect para carregar o modal de excluão
  useEffect(() => {
    if (excluir && id > 0) {
      async function buscaDado() {
        const resposta = await service.obtem(`/contas-pagar/${id}?campos=origem,documento`);
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
          const resposta = await service.exclui(`/contas-pagar/${id}`);
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
      history.push('/pagamentos-form');
    }
  }, [alterar, history])

  // Effect para carregamento dos pagamentos
  useEffect(() => {
    if (carregar) {
      setCarregando(true);
      service.obtem('/parcelas-conta-pagar')
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
        titulo="Pagamentos"
        subtitulo="Listagem de contas a pagar"
        linkPagina="/pagamentos"
        tituloBotao="Adicionar"
        exibirBotao={false}
      />
      <br />
      <Card className={css.root}>
        <MyTable
          colunas={colunasTabela}
          dados={dados}
          carregando={carregando}
          selecionarLinhas={false}
          exportar={true}
          titulo="Contas a Pagar"
          apelido="CtaPagar" 
          desabilitarEditar={false}
          desabilitarExcluir={true}
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

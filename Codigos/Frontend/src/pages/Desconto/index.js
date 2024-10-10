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


export default function Desconto() {

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
    { title: 'Código', field: 'codigo', cellStyle: {width: '150px', fontSize: 13} },
    { title: 'Descricao', field: 'descricao', cellStyle: {width: '600px', fontSize: 13} },
    { title: 'Valor', field: 'valor', type: 'currency', cellStyle: {width: '100px', fontSize: 13},
      currencySetting: {
        locale: 'pt-BR', 
        currencyCode:'BRL', 
        minimumFractionDigits:2, 
        maximumFractionDigits:2
      }
    },
    { title: 'Piso', field: 'piso', type: 'currency', cellStyle: {width: '100px', fontSize: 13},
      currencySetting: {
        locale: 'pt-BR', 
        currencyCode:'BRL', 
        minimumFractionDigits:2, 
        maximumFractionDigits:2
      }
    },    
    { title: 'Início Validade', field: 'validadeInicio', type: 'date', dateSetting: { locale: "pt-BR" }, cellStyle: {width: '350px', fontSize: 13}},
    { title: 'Fim Validade', field: 'validadeFim', type: 'date', dateSetting: { locale: "pt-BR"}, cellStyle: {width: '350px', fontSize: 13} }
  ];
  

  // Effect para carregar o modal de excluão
  useEffect(() => {
    if (excluir && id > 0) {
      async function buscaDado() {
        const resposta = await service.obtem(`/descontos/${id}?campos=descricao`);
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
          const resposta = await service.exclui(`/descontos/${id}`);
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
      history.push('/descontos-form');
    }
  }, [alterar, history])

  // Effect para carregamento dos descontos
  useEffect(() => {
    if (carregar) {
      setCarregando(true);
      service.obtem('/descontos')
      .then(response => {        
        var lista = response.data.map(function (item) {          
          return {
            id: item.id,
            codigo: item.codigo,
            descricao: item.descricao,
            valor: item.valor,
            piso: item.piso,
            validadeInicio: item.validadeInicio,
            validadeFim: item.validadeFim
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
  }, [carregar, setCarregar, setConteudo])


  return (
    <div>
      <CabecalhoForm
        titulo="Descontos"
        subtitulo="Listagem de todos os descontos"
        linkPagina="/descontos-form"
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
          titulo="Descontos"
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

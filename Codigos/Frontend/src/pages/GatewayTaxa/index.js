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

export default function Gateway() {

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
    { title: 'ID', field: 'id', cellStyle: {width: '10px', fontSize: 13} },
    { title: 'Gateway', field: 'gateway.tipoGateway', cellStyle: {width: '20px', fontSize: 13} },
    { title: 'Data', field: 'data', type: 'date', cellStyle: {width: '40px', fontSize: 13} },
    { title: 'Débito', field: 'debito', type: 'numeric', cellStyle: {width: '60px', fontSize: 13} },
    { title: 'Crédito a Vista', field: 'creditoAvista', type: 'numeric', cellStyle: {width: '60px', fontSize: 13} },
    { title: 'Crédito Parcelado', field: 'creditoParcelado', type: 'numeric', cellStyle: {width: '60px', fontSize: 13} },
    { title: 'Crédito Antecipação', field: 'creditoAntecipacao', type: 'numeric', cellStyle: {width: '60px', fontSize: 13} },
    { title: 'Boleto', field: 'boleto', type: 'numeric', cellStyle: {width: '60px', fontSize: 13} },
    { title: 'Taxa Adm', field: 'taxaAdministrativa', type: 'numeric', width: 1000, cellStyle: {fontSize: 13} },
];

  // Effect para carregar o modal de excluão
  useEffect(() => {
    if (excluir && id > 0) {
      async function buscaDado() {
        const resposta = await service.obtem(`/gateway-taxas/${id}?campos=gateway.id,data`);
        if (resposta.data) {
          setTexto(`REG.: ${id}, TAXAS DO GATEWAY ${resposta.data.gateway.id}`);
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
          const resposta = await service.exclui(`/gateway-taxas/${id}`);
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
      history.push('/gateways-taxas-form');
    }
  }, [alterar, history])

  // Effect para carregamento dos gateways
  useEffect(() => {
    if (carregar) {
      setCarregando(true);
      service.obtem('/gateway-taxas')
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
        titulo="Gateways-Taxas"
        subtitulo="Listagem de todas as taxas dos gateways"
        linkPagina="/gateways-taxas-form"
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
          titulo="Taxas dos Gateways"
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

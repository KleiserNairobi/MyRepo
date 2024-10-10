import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Card, Grid, Typography } from '@material-ui/core';
import * as service from '../../services/apiBack';
import MaterialTable from 'material-table';
import { useGeral } from '../../contexts/GeralCtx';
import { useAlerta } from '../../contexts/AlertaCtx';
import { TIPO_ERRO, TIPO_SUCESSO } from '../../utils/global';
import PagesCss from '../PagesCss';
import ModalExclusao from '../../components/ModalExclusao';

export default function Banco() {

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
    { title: 'Data', field: 'dataExecucao', type: 'date', cellStyle: {width: '40px', fontSize: 13} },
    { title: 'Hora', field: 'horaExecucao', type: 'time', cellStyle: {width: '40px', fontSize: 13} },
    { title: 'Cliente', field: 'cliente.nome', cellStyle: {width: '350px', fontSize: 13} },
    { title: 'Veículo', field: 'tipoVeiculo', cellStyle: {width: '30px', fontSize: 13} },
    { title: 'Distância', field: 'distancia', cellStyle: {width: '60px', fontSize: 13} },
    { title: 'Previsão', field: 'previsao', type: 'time', cellStyle: {width: '60px', fontSize: 13} },
    { title: 'Ativo', field: 'ativo', type: 'boolean', cellStyle: {width: '60px', fontSize: 13} },
    { title: 'Realizado', field: 'realizado', type: 'boolean', width: 1000 },
  ];

  // Effect para carregar o modal de excluão
  useEffect(() => {
    if (excluir && id > 0) {
      async function buscaDado() {
        const resposta = await service.obtem(`/agendamentos/${id}?campos=codigo,nome`);
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
          const resposta = await service.exclui(`/agendamentos/${id}`);
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
      history.push('/agendamentos-form');
    }
  }, [alterar, history])

  // Effect para carregamento dos agendamentos
  useEffect(() => {
    if (carregar) {
      setCarregando(true);
      service.obtem('/agendamentos')
      .then(response => {
        var lista = response.data.map(function (item) {
          let tipo = null;
          switch (item.tipoVeiculo) {
            case "B": tipo = "BIKE"; break;
            case "M": tipo = "MOTO"; break;
            case "C": tipo = "CARRO"; break;
            case "CM": tipo = "CAMINHÃO"; break;
            default: tipo = "";
          }
          return {
            'id': item.id,
            'dataExecucao': item.dataExecucao,
            'horaExecucao': item.horaExecucao,
            'cliente.nome': item.cliente.nome,
            'tipoVeiculo': tipo,
            'distancia': item.distancia,
            'previsao': item.previsao,
            'ativo': item.ativo,
            'realizado': item.realizado
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

      <Grid container direction="row" justify="space-between" alignItems="center">
        <div>
          <div className={css.tituloPagina}>
            <Typography variant="h6">Agendamentos</Typography>
          </div>
          <div className={css.subtituloPagina}>
            <Typography variant="caption">Listagem de todos os agendamentos</Typography>
          </div>
        </div>
        <div style={{ flex: 1 }} />
        {/** 
        <Button
          color="primary"
          variant="outlined"
          disableElevation
          startIcon={props.icone}
          onClick={() => chamaLink(props.linkPagina)}
        >
          {props.tituloBotao}
        </Button>
        */}
      </Grid>

      <br />

      <Card className={css.root}>
        <MaterialTable
          isLoading={carregando}
          title="Agendamentos"
          columns={colunasTabela}
          data={dados}
          options={{
            padding: "dense",
            showTitle: false,
            filtering: false,
            grouping: false,
            columnsButton: false,
            pageSize: 10,
            searchFieldAlignment: "left",
            searchFieldVariant: "standard",
            actionsColumnIndex: -1,
            loadingType: "linear",
            showTextRowsSelected: false,
            toolbarButtonAlignment: "left",
            exportButton: true,
            exportAllData: true,
            selection: false,
            headerStyle: {
              backgroundColor: '#44575F',
              color: '#FFF',
            },
          }}    
          localization={{
            body: {
              emptyDataSourceMessage: 'Nenhum registro para exibir...'
            },
            toolbar: {
              addRemoveColumns: 'Adiciona ou remove colunas',
              searchTooltip: 'Pesquisar',
              searchPlaceholder: 'Pesquisar',
              nRowsSelected: '{0} linha(s) selecionada',
              showColumnsTitle: 'Mostrar colunas',
              showColumnsAriaLabel: 'Mostrar colunas',
              exportTitle: 'Exportar',
              exportAriaLabel: 'Exportar',
              exportName: 'Exportar',
              exportPDFName: 'Exportar como PDF',
              exportCSVName: 'Exportar como CSV'
            },
            header: {
              actions: 'Ações'
            },
            pagination: {
              labelRowsSelect: 'linhas',
              labelDisplayedRows: '{count} de {from}-{to}',
              firstTooltip: 'Primeira página',
              previousTooltip: 'Página anterior',
              nextTooltip: 'Próxima página',
              lastTooltip: 'Última página'
            }
          }}
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

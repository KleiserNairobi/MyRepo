import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Card, Grid, Typography } from '@material-ui/core';
import * as service from '../../services/apiBack';
import { useGeral } from '../../contexts/GeralCtx';
import { useAlerta } from '../../contexts/AlertaCtx';
import { TIPO_ERRO } from '../../utils/global';
import PagesCss from '../PagesCss';
import MaterialTable from 'material-table';

export default function Aprovacao() {
  
  const css = PagesCss();
  const history = useHistory();
  const { setConteudo } = useAlerta();
  const [dados, setDados] = useState([]);
  const [carregando, setCarregando] = useState(false);

  const {
    id, setId, carregar, setCarregar, alterar, setAlterar
  } = useGeral();

  const colunasTabela = [
    { title: 'ID', field: 'id', cellStyle: {width: '20px', fontSize: 13} },
    { title: 'Membro', field: 'pessoa.nome', cellStyle: {width: '1000px', fontSize: 13} },
    { title: 'Parceiro', field: 'pessoa.parceiro', type: 'boolean', cellStyle: {width: '50px', fontSize: 13} },
    { title: 'Entregador', field: 'pessoa.entregador', type: 'boolean', cellStyle: {width: '50px', fontSize: 13} },
    { title: 'Data', field: 'data', type: 'date', cellStyle: {width: '40px', fontSize: 13} },
    { title: 'Hora', field: 'hora', cellStyle: {width: '40px', fontSize: 13} },
    { title: 'Status', field: 'statusAprovacao', type: 'time', width: 60,
      cellStyle: (ev, rowData) => {
        if (rowData.statusAprovacao === "EM ANÁLISE") {
          return {color: "blue"}
        }
        if (rowData.statusAprovacao === "APROVADO") {
          return {color: "green"}
        }
        if (rowData.statusAprovacao === "REJEITADO") {
          return {color: "red"}
        }
        if (rowData.statusAprovacao === "SUSPENSO") {
          return {color: "orange"}
        }
        if (rowData.statusAprovacao === "PENDENTE") {
          return {color: "black"}
        }
      }
    },
  ];


  // Effect para carregar a tela de cadastro
  useEffect(() => {
    if (alterar) {
      history.push('/aprovacoes-form');
    }
  }, [alterar, history])

  // Effect para carregamento das aprovacoes
  useEffect(() => {
    if (carregar) {
      setCarregando(true);
      service.obtem('/aprovacoes')      
      .then(response => {
        var lista = response.data.map(function (item) {
          let status = null;
          switch (item.statusAprovacao) {
            case "E":
              status = "EM ANÁLISE";
              break;
            case "A":
              status = "APROVADO";
              break;
            case "R":
              status = "REJEITADO";
              break;
            case "S":
              status = "SUSPENSO";
              break;
            case "P":
              status = "PENDENTE";
              break;
            default:
              status = "";
          }
          return {
            'id': item.id,
            'pessoa.nome': item.pessoa.nome,
            'pessoa.parceiro': item.pessoa.parceiro,
            'pessoa.entregador': item.pessoa.entregador,
            'data': item.data,
            'hora': item.hora,
            'statusAprovacao': status
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
            <Typography variant="h6">Aprovações</Typography>
          </div>
          <div className={css.subtituloPagina}>
            <Typography variant="caption">Listagem de todas as aprovações</Typography>
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
            exportButton: false,
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
              exportName: 'Exportar como CSV'
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
          actions={[
            {
              icon: 'edit',
              tooltip: 'Altera',
              onClick: (event, rowData) => {
                setId(rowData.id);
                setAlterar(true);
              },
            },
            {
              icon: 'delete',
              tooltip: 'Exclui',
              disabled: true,
              onClick: (event, rowData) => {
                console.log('botão delete acionado');
              },              
            }
          ]}
        />
      </Card>
    </div>
  )
}

import React, { useEffect, useState } from 'react';
import { Card, Grid, Typography } from '@material-ui/core';
import * as service from '../../services/apiBack';
import MaterialTable from 'material-table';
import { useGeral } from '../../contexts/GeralCtx';
import { useAlerta } from '../../contexts/AlertaCtx';
import { TIPO_ERRO } from '../../utils/global';
import PagesCss from '../PagesCss';


export default function Avaliacao() {

  const css = PagesCss();
  const { setConteudo } = useAlerta();
  const { id, carregar, setCarregar } = useGeral();
  const [carregando, setCarregando] = useState(false);
  const [dados, setDados] = useState([]);

  const colunasTabela = [
    { title: 'ID', field: 'id', cellStyle: {width: '10px', fontSize: 13} },
    { title: 'Data', field: 'data', type: 'date', cellStyle: {width: '20px', fontSize: 13} },
    { title: 'Entrega', field: 'entrega.id', cellStyle: {width: '20px', fontSize: 13} },
    { title: 'Cliente', field: 'pessoa.nome', cellStyle: {width: '220px', fontSize: 13} },
    // { title: 'Cliente', field: 'pessoa.cliente', type: 'boolean', cellStyle: {width: '20px', fontSize: 13} },
    // { title: 'Entregador', field: 'pessoa.entregador', type: 'boolean', cellStyle: {width: '20px', fontSize: 13} },
    { title: 'Avaliação', field: 'classificacao', cellStyle: {width: '10px', fontSize: 13} },
    { title: 'Comentário', field: 'comentario', width: 3000, cellStyle: {fontSize: 13} },
  ];

  // Effect para carregamento das avaliacoes
  useEffect(() => {
    if (carregar) {
      setCarregando(true);
      service.obtem('/entrega-avaliacoes')
        .then(response => {
          console.log(response)
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
      <Grid container direction="row" justify="space-between" alignItems="center">
        <div>
          <div className={css.tituloPagina}>
            <Typography variant="h6">Avaliações</Typography>
          </div>
          <div className={css.subtituloPagina}>
            <Typography variant="caption">Listagem de todas as avaliações</Typography>
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
          title="Aprovações"
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
    </div>
  );
  
}

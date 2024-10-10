import React from 'react'
import MaterialTable from 'material-table';
import { useGeral } from '../contexts/GeralCtx';

export default function MyTable(props, event) {
  const { setId, setAuxId, setAuxValor, setAlterar, setExcluir } = useGeral();

  return (

    <MaterialTable
      isLoading={props.carregando}
      title={props.titulo}
      columns={props.colunas}
      data={props.dados}

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
        exportButton: props.exportar,
        exportAllData: true,
        selection: props.selecionarLinhas,
        headerStyle: {
          backgroundColor: '#44575F',
          color: '#FFF',
        },
      }}
  
      actions={[
        {
          icon: 'edit',
          tooltip: 'Altera',
          hidden: props.ocultarEditar,
          disabled: props.desabilitarEditar,
          onClick: (event, rowData) => {

            if (props.apelido === 'LctoCtaPagar') {
              setId(rowData.id);
            }
            if (props.apelido === 'LctoCtaReceber') {
              setId(rowData.id);
            }            
            if (props.apelido === 'CtaPagar') {
              setId(rowData.contaPagar.id);
              setAuxId(rowData.id);
            }
            if (props.apelido === 'CtaReceber') {
              setId(rowData.contaReceber.id);
              setAuxId(rowData.id);
            }             
            
            // if (typeof rowData.id === 'number') {
            //   if (props.title === 'ContaReceber') {
            //     setId(rowData.receber.id)
            //   } else if (props.title === 'ContaPagar') {                                
            //     setId(rowData.pagar.id)
            //   } else {
            //     setId(rowData.id);
            //   }
            // } else {
            //   if (props.title === 'ContaReceber') {
            //     setAuxValor(rowData.receber.id)
            //   } else if (props.title === 'ContaPagar') {                                
            //     setAuxValor(rowData.pagar.id)
            //   } else {
            //     setAuxValor(rowData.id);
            //   }
            // }

            setAlterar(true);
          },
        },
        {
          icon: 'delete',
          tooltip: 'Exclui',
          hidden: props.ocultarExcluir,
          disabled: props.desabilitarExcluir,
          onClick: (event, rowData) => {
            if (typeof rowData.id === 'number') {
              if (props.title === 'ContaReceber') {
                setId(rowData.receber.id)
              } else if (props.title === 'ContaPagar') {
                setId(rowData.pagar.id)
              } else {
                setId(rowData.id);
              }
            } else {
              if (props.title === 'ContaReceber') {
                setAuxValor(rowData.receber.id)
              } else if (props.title === 'ContaPagar') {
                setAuxValor(rowData.pagar.id)
              } else {
                setAuxValor(rowData.id);
              }
            }            
            setExcluir(true);
          },
        }
      ]}
    
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
  );
}


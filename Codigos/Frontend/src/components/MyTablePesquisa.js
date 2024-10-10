import React from 'react'
import MaterialTable from 'material-table';
import { useGeral } from '../contexts/GeralCtx';

export default function MyTable(props, event) {
  const { setAuxId, setQtde } = useGeral();
  //const [selectedRow, setSelectedRow] = useState(null);

  return (
    <MaterialTable
      isLoading={false}
      title={props.titulo}
      columns={props.colunas}
      data={props.dados}
      options={{
        padding: "dense",
        showTitle: false,
        pageSize: 10,
        searchFieldAlignment: "left",
        searchFieldVariant: "standard",
        actionsColumnIndex: -1,
        loadingType: "linear",
        showSelectAllCheckbox: false,
        showTextRowsSelected: false,
        toolbarButtonAlignment: "left",
        exportButton: props.exportar,
        selection: true,
        headerStyle: {
          backgroundColor: '#38454C',
          color: '#FFF'
        },
        //rowStyle: rowData => ({
        //    backgroundColor: (selectedRow === rowData.tableData.id) ? '#EEE' : '#FFF'
        //})                
      }}
      //onRowClick={(
      //    (evt, selectedRow) => { 
      //        const idSelecionado = selectedRow.tableData.id;
      //        setSelectedRow(idSelecionado);            
      //    }
      //)}
      onSelectionChange={(rowData) => {
        setQtde(rowData.length);
        if (rowData.length > 0) {
          setAuxId(rowData[0].id);
        }
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
    />
  );
}

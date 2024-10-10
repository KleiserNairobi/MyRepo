import React, { useEffect, useState } from 'react';
// import { useHistory } from 'react-router-dom';
import { Card } from '@material-ui/core';
import * as service from '../../services/apiBack'
import CabecalhoForm from '../../components/CabecalhoForm';
import ModalExclusao from '../../components/ModalExclusao';
import { useAlerta } from '../../contexts/AlertaCtx';
import { useGeral } from '../../contexts/GeralCtx';
import MyTable from '../../components/MyTable';
import PagesCss from '../PagesCss';


export default function Movimentacao() {

  const css = PagesCss();
  // const history = useHistory();
  const { setConteudo } = useAlerta();
  const [dados, setDados] = useState([]);
  const [carregando, setCarregando] = useState(false);
  const [abrirModalExclusao, setAbrirModalExclusao] = useState(false);

  const { id, texto, carregar, setCarregar } = useGeral();
  // const { id, texto, confirmaExcluir, setConfirmaExcluir, carregar, setCarregar } = useGeral();

  const colunasTabela = [
    { title: 'ID', field: 'id', cellStyle: {width: '20px'}},
    { title: 'pessoa_id', field: 'pessoa_id', cellStyle: {width: '600px'}},
    { title: 'documento', field: 'documento', width: '60px'},
    { title: 'operacao', field: 'operacao', width: '50px'},
    { title: 'data', field: 'data', width: '50PX'},
    { title: 'hora', field: 'hora', width: '50px'},
    { title: 'valor', field: 'valor', width: '50px'},
    { title: 'quitado', field: 'quitado', width: '20px'},
    { title: 'historico', field: 'historico', cellStyle: {width: '300px'}}
  ];


  // Effect para carregamento dos bancos
  useEffect(() => {
    if (carregar) {
      setCarregando(true);
      service.obtem('/bancos')
        .then(response => {
          const lista = response.data;
          setDados(lista);
          setCarregando(false);
        })
        .catch(error => {
          // setConteudo({
          //   tipo: TIPO_ERRO,
          //   descricao: error.response.data.detalhe,
          //   exibir: true
          // });
        })
      setCarregar(false);
    }
  }, [id, carregar, setCarregar, setConteudo])

  return (
    <div>
      <CabecalhoForm
        titulo="Movimentação Financeira"
        subtitulo="Movimentação financeira do entregador"
        linkPagina="/bancos-form"
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
          titulo="Bancos"
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
  )
}

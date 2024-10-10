import React from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import { useAutenticacao } from '../contexts/AutenticacaoCtx';

// import de páginas públicas
import Login from './Login';
import TrocarSenha from './Login/TrocarSenha';
import Cadastro from './Cadastro';

// import de páginas privadas
import Banco from './Banco';
import BancoForm from './Banco/BancoForm';
import Agencia from './Agencia';
import AgenciaForm from './Agencia/AgenciaForm';
import Endereco from './Endereco';
import EnderecoForm from './Endereco/EnderecoForm';
import Usuario from './Usuario';
import UsuarioForm from './Usuario/UsuarioForm';
import Dashboard from './Dashboard';
import Avaliacao from './Avaliacao';
import Agendamento from './Agendamento';
import Solicitacao from './Solicitacao';
import Gateway from './Gateway';
import GatewayForm from './Gateway/GatewayForm';
import GatewayTaxa from './GatewayTaxa';
import GatewayTaxaForm from './GatewayTaxa/GatewayTaxaForm';
import TabelaPreco from './TabelaPreco';
import TabelaPrecoForm from './TabelaPreco/TabelaPrecoForm';
import TarifaAdicional from './TarifaAdicional';
import TarifaAdicionalForm from './TarifaAdicional/TarifaAdicionalForm';
import Desconto from './Desconto';
import DescontoForm from './Desconto/DescontoForm';
import Parametro from './Parametro';
import Permissao from './Permissao';
import PermissaoForm from './Permissao/PermissaoForm';
import Moeda from './Moeda';
import MoedaForm from './Moeda/MoedaForm';
import Categoria from './Categoria';
import CategoriaForm from './Categoria/CategoriaForm';
import Cliente from './Cliente';
import ClienteForm from './Cliente/ClienteForm';
import Colaborador from './Colaborador';
import ColaboradorForm from './Colaborador/ColaboradorForm';
import Entregador from './Entregador';
import EntregadorForm from './Entregador/EntregadorForm';
import Parceiro from './Parceiro';
import ParceiroForm from './Parceiro/ParceiroForm';
import Conta from './Conta';
import ContaForm from './Conta/ContaForm';
import Veiculo from './Veiculo';
import VeiculoForm from './Veiculo/VeiculoForm';
import Habilitacao from './Habilitacao';
import HabilitacaoForm from './Habilitacao/HabilitacaoForm';
import LctoContaPagar from './LctoContaPagar';
import LctoContaPagarForm from './LctoContaPagar/LctoContaPagarForm';
import LctoContaReceber from './LctoContaReceber';
import LctoContaReceberForm from './LctoContaReceber/LctoContaReceberForm';
import Pagamento from './Pagamento';
import PagamentoForm from './Pagamento/PagamentoForm';
import Recebimento from './Recebimento';
import RecebimentoForm from './Recebimento/RecebimentoForm';
import Chat from './Chat';
import FluxoCaixa from './FluxoCaixa';
import FluxoCaixaForm from './FluxoCaixa/FluxoCaixaForm';
import MovCaixa from './MovCaixa';
import NovaSolicitacao from './NovaSolicitacao';
import Aprovacao from './Aprovacao';
import AprovacaoForm from './Aprovacao/AprovacaoForm';
import Mapa from './Mapa';
import Senha from './Senha'
import Movimentacao from './Movimentacao'

function Rotas() {  
  function PrivateRoute({ component: Component, ...rest }) {
    const { carregando, autenticado } = useAutenticacao();

    // Esse if é necessário em caso de refresh de página
    if (carregando) {
      return <h1>Carregando...</h1>;
    }

    return (
      <Route
        {...rest}
        render={props => (
          autenticado ? (
            <Component {...props} />
          ) : (
            <Redirect to={{ pathname: '/login', state: { from: props.location } }} />
          )
        )} 
      />
    )
  }

  return (
    
    <Switch>
      <PrivateRoute exact path="/" component={Dashboard} />
      <Route path="/login" component={Login} />
      <Route path="/trocar-senha" component={TrocarSenha} />
      <Route path="/cadastro" component={Cadastro} />
      <Route path="/dashboard" component={Dashboard} />


      <PrivateRoute path="/senha" component={Senha} />  
      <PrivateRoute path="/mapa" component={Mapa} /> 
      <PrivateRoute path="/movimentacao" component={Movimentacao} /> 
      <PrivateRoute path="/agencias" component={Agencia} />
      <PrivateRoute path="/agencias-form" component={AgenciaForm} />
      <PrivateRoute path="/bancos" component={Banco} />
      <PrivateRoute path="/bancos-form" component={BancoForm} />
      <PrivateRoute path="/enderecos" component={Endereco} />
      <PrivateRoute path="/enderecos-form" component={EnderecoForm} />
      <PrivateRoute path="/usuarios" component={Usuario} />
      <PrivateRoute path="/usuarios-form" component={UsuarioForm} />
      <PrivateRoute path="/agendamentos" component={Agendamento} />
      <PrivateRoute path="/avaliacoes" component={Avaliacao} />
      <PrivateRoute path="/solicitacoes" component={Solicitacao} />
      <PrivateRoute path="/gateways" component={Gateway} />
      <PrivateRoute path="/gateways-form" component={GatewayForm} />
      <PrivateRoute path="/gateways-taxas" component={GatewayTaxa} />
      <PrivateRoute path="/gateways-taxas-form" component={GatewayTaxaForm} />
      <PrivateRoute path="/tabela-precos" component={TabelaPreco} />
      <PrivateRoute path="/tabela-precos-form" component={TabelaPrecoForm} />
      <PrivateRoute path="/tarifas-adicionais" component={TarifaAdicional} />
      <PrivateRoute path="/tarifas-adicionais-form" component={TarifaAdicionalForm} /> 
      <PrivateRoute path="/descontos" component={Desconto} />
      <PrivateRoute path="/descontos-form" component={DescontoForm} />                  
      <PrivateRoute path="/parametros" component={Parametro} />      
      <PrivateRoute path="/permissoes" component={Permissao} />
      <PrivateRoute path="/permissoes-form" component={PermissaoForm} />
      <PrivateRoute path="/moedas" component={Moeda} />
      <PrivateRoute path="/moedas-form" component={MoedaForm} />
      <PrivateRoute path="/categorias" component={Categoria} />
      <PrivateRoute path="/categorias-form" component={CategoriaForm} />
      <PrivateRoute path="/clientes" component={Cliente} />
      <PrivateRoute path="/clientes-form" component={ClienteForm} />
      <PrivateRoute path="/colaboradores" component={Colaborador} />
      <PrivateRoute path="/colaboradores-form" component={ColaboradorForm} />
      <PrivateRoute path="/entregadores" component={Entregador} />
      <PrivateRoute path="/entregadores-form" component={EntregadorForm} />
      <PrivateRoute path="/parceiros" component={Parceiro} />
      <PrivateRoute path="/parceiros-form" component={ParceiroForm} />
      <PrivateRoute path="/contas" component={Conta} />
      <PrivateRoute path="/contas-form" component={ContaForm} />
      <PrivateRoute path="/veiculos" component={Veiculo} />
      <PrivateRoute path="/veiculos-form" component={VeiculoForm} />
      <PrivateRoute path="/habilitacoes" component={Habilitacao} />
      <PrivateRoute path="/habilitacoes-form" component={HabilitacaoForm} />
      <PrivateRoute path="/lctoContaPagar" component={LctoContaPagar} />
      <PrivateRoute path="/lctoContaPagar-form" component={LctoContaPagarForm} />
      <PrivateRoute path="/lctoContaReceber" component={LctoContaReceber} />
      <PrivateRoute path="/lctoContaReceber-form" component={LctoContaReceberForm} />      
      <PrivateRoute path="/pagamentos" component={Pagamento} />
      <PrivateRoute path="/pagamentos-form" component={PagamentoForm} />      
      <PrivateRoute path="/recebimentos" component={Recebimento} />
      <PrivateRoute path="/recebimentos-form" component={RecebimentoForm} />
      <PrivateRoute path="/chat" component={Chat} />
      <PrivateRoute path="/fluxo-caixas" component={FluxoCaixa} />
      <PrivateRoute path="/fluxo-caixas-form" component={FluxoCaixaForm} />
      <PrivateRoute path="/mov-caixas" component={MovCaixa} />
      <PrivateRoute path="/nova-solicitacao" component={NovaSolicitacao} />
      <PrivateRoute path="/aprovacoes" component={Aprovacao} />
      <PrivateRoute path="/aprovacoes-form" component={AprovacaoForm} />

    </Switch>
  );
}

export default Rotas
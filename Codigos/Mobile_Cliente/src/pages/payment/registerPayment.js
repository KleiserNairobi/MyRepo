import React from 'react';
import { connect } from 'react-redux';
import { View, KeyboardAvoidingView, Text, TouchableOpacity } from 'react-native';
import { Icon } from 'native-base';

import Styles from '../../assets/scss/styles';
import { NotificationAlert } from '../../components/general/alerts';
import {
  deliveryRegisterAction,
  deliveryInitialStateAction,
  statusPaymentAction
} from '../../store/slices/deliverySlice';
import ListErrors from '../../components/general/listErrors';
import API from '../../services/api';

const typeIconDefault = "MaterialCommunityIcons";

class RegisterPaymentPage extends React.Component {
  state = {
    ...this.props,
    token: this.props.configuracoes.token,
    pessoa: this.props.usuario.pessoa,
    entrega: this.props.entrega,
    entregador: this.props.entregador,
    pagamentoId: this.props.entrega.pagamentoId ? this.props.entrega.pagamentoId : null,
    agendamento: (this.props.entrega && this.props.entrega.agendamento) ? this.props.entrega.agendamento : null,
    showBtnRefresh: false,
    title: '',
    text: '',
    titleLoading: 'AGUARDE...',
    textLoading: 'Estamos iniciando o processo de pagamento',
    titleSuccess: 'PAGAMENTO REGISTRADO',
    textSuccess: 'Seu pagamento foi registrado com sucesso',
    titleError: 'ERRO',
    textError: ''
  }

  componentDidMount() {
    this.registerPayment();
  }

  btnReturn = () => {
    this.props.navigation.navigate('InsertDeliveryExtraData');
  }

  btnRefresh = () => {
    this.registerPayment();
  }

  btnCancel = () => {
    // Alterando status da entrega para CANCELADA
    let registerData = {
      entrega: { id: this.state.entrega.id },
      status: 'CA'
    }
    API({ token: this.state.token })
      .post(`entregas-status`, registerData)
      .then(res => {
        if (res && res.data) {
          this.setState({
            title: 'AGUARDE...',
            text: 'Cancelando a sua solicitação de entrega'
          }, async () => {
            // Apagando dados da entrega da Store
            await this.props.deliveryInitialStateAction();

            this.props.navigation.push('Solicitation');
          });
        }
      })
      .catch(error => {
        if (error && error.response && error.response.data) {
          NotificationAlert(ListErrors(error.response.data));
        } else {
          NotificationAlert('Não foi possível cancelar a entrega');
        }
      });
  }

  registerPayment = () => {
    // Dados para registro no Webservice
    let registerData = {
      agendamento: (this.state.agendamento && this.state.agendamento.id) ? this.state.agendamento.id : null,
      entrega: (this.state.entrega && this.state.entrega.id) ? this.state.entrega.id : null,
      tabelaPreco: this.state.entrega.tabelaPrecoId,
      valorPercurso: this.state.entrega.valorPercurso,
      valorProduto: this.state.entrega.valorProduto ? this.state.entrega.valorProduto : 0,
      desconto: this.state.entrega.descontoId ? this.state.entrega.descontoId : null,
      valorDesconto: this.state.entrega.valorDesconto ? this.state.entrega.valorDesconto : 0,
      observacao: null,
      gateway: null,
      gatewayIdPagamento: null,
      gatewayIdDevolucao: null,
    }
    // Proxima tela
    let nextScreen = '';

    // Verificando o tipo de pagamento
    switch (this.state.entrega.tipoPagamento) {
      case 'D':
        registerData = {
          ...registerData,
          tipoPgto: 'D'
        }
        // Informando a proxima tela
        if (this.state.agendamento && this.state.agendamento.id) {
          // Tela de conclusao de agendamento
          nextScreen = 'FinalizedSchedule';
        } else {
          // Pagamento de Entrega Imediata
          nextScreen = 'FindDeliveryman';
        }
        break;

      case 'CC':
        registerData = {
          ...registerData,
          tipoPgto: 'CC'
        }
        // Informando a proxima tela
        nextScreen = 'ChooseCardGateway';
        break;

      case 'CD':
        registerData = {
          ...registerData,
          tipoPgto: 'CD'
        }
        // Informando a proxima tela
        nextScreen = 'ChooseCardGateway';
        break;
    }

    // Registrando pagamento
    API({ token: this.state.token })
      .post('pagamentos', registerData)
      .then(res => {
        if (res && res.data) {
          this.setState({
            pagamentoId: res.data.id,
            showBtnRefresh: false
          }, async () => {
            // Registra ID do Pagamento na Store
            await this.props.statusPaymentAction({
              statusPagamento: 'I',
              pagamentoId: this.state.pagamentoId
            });

            if (this.state.entrega.tipoPagamento == 'D') {
              // Registra alteracao de Status do Pagamento na Store
              await this.props.statusPaymentAction({
                statusPagamento: 'A',
                pagamentoId: this.state.pagamentoId
              });
            }

            // Redirecionando para proxima pagina de acordo com o tipo de pagamento
            this.props.navigation.push(nextScreen);
          });
        } else {
          this.setState({
            title: this.state.titleError,
            text: 'Não foi possível finalizar o processo de pagamento da entrega. Tente novamente.',
            pagamentoId: null,
            showBtnRefresh: true
          });
        }
      })
      .catch(error => {
        if (error && error.response && error.response.data) {
          NotificationAlert(ListErrors(error.response.data));
        } else {
          NotificationAlert('Não foi possível iniciar o processo de pagamento na entrega', 'Erro');
        }
      });
  }

  render() {
    return (
      <KeyboardAvoidingView behavior="height" style={[Styles.body, Styles.whiteBg]}>
        <View style={Styles.contentContainer}>
          {(this.state.pagamentoId) ? (
            <View>
              <View style={[Styles.container, Styles.textBox]}>
                <Icon
                  type={typeIconDefault}
                  name='currency-usd'
                  style={[Styles.iconButton, { fontSize: 60 }]} />
                <Text style={[
                  Styles.fontBoxDefault,
                  Styles.font16
                ]}>Pagamento registrado com sucesso</Text>
              </View>
              <View style={Styles.containerButtonBottom}>
                <TouchableOpacity
                  style={[Styles.largeBlockButton, Styles.m10]}
                  onPress={this.btnNext}>
                  <Text style={Styles.textButton}>PRÓXIMA</Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
              <View>
                <View style={[Styles.container, Styles.textBox]}>
                  <Icon
                    type={typeIconDefault}
                    name='currency-usd'
                    style={[Styles.iconButton, { fontSize: 60 }]} />
                  <Text style={[Styles.fontBoxDefault, Styles.font16]}>{this.state.title}</Text>
                  <Text style={Styles.fontBoxDefault, { textAlign: 'center' }}>{this.state.text}</Text>
                </View>
                {(this.state.showBtnRefresh === true) ? (
                  <View style={Styles.container}>
                    <TouchableOpacity
                      style={[Styles.largeBlockButton, Styles.m10]}
                      onPress={this.btnRefresh}>
                      <Text style={Styles.textButton}>TENTAR NOVAMENTE</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[Styles.largeBlockButton, Styles.m10]}
                      onPress={this.btnCancel}>
                      <Text style={Styles.textButton}>CANCELAR ENTREGA</Text>
                    </TouchableOpacity>
                  </View>
                ) : null}
              </View>
            )}
        </View>
      </KeyboardAvoidingView >
    )
  }
}

const mapStateToProps = (state) => {
  return {
    usuario: state.usuario,
    configuracoes: state.configuracoes,
    entrega: state.entrega,
    entregador: state.entregador
  }
}

const mapDispatchToProps = {
  deliveryRegisterAction,
  deliveryInitialStateAction,
  statusPaymentAction
}

export default connect(mapStateToProps, mapDispatchToProps)(RegisterPaymentPage);
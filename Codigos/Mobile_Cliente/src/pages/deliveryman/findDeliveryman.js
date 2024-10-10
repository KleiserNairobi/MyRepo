import React from 'react';
import { connect } from 'react-redux';
import { 
  View, 
  KeyboardAvoidingView, 
  Text, 
  TouchableOpacity,
  BackHandler
} from 'react-native';
import { Icon } from 'native-base';

import Styles from '../../assets/scss/styles';
import { NotificationAlert } from '../../components/general/alerts';
import { 
  deliveryInitialStateAction,
  statusPaymentAction
} from '../../store/slices/deliverySlice';
import { 
  deliverymanRegisterAction,
  deliverymanVehicleAction
} from '../../store/slices/deliverymanSlice';
import ListErrors from '../../components/general/listErrors';
import { formatNumber } from '../../components/general/converter';
import API from '../../services/api';

const typeIconDefault = "MaterialCommunityIcons";

class FindDeliverymanPage extends React.Component {
  state = {
    ...this.props,
    token: this.props.configuracoes.token,
    pessoa: this.props.usuario.pessoa,
    entrega: this.props.entrega,
    entregador: null,
    showBtnRepeat: false,
    showBtnCancel: false,
    showBtnTelaInicial: false,
    title: '',
    text: '',
    titleLoading: 'AGUARDE...',
    textLoading: 'Estamos buscando um entregador',
    titleSuccess: 'ENTREGADOR ENCONTRADO',
    textSuccess: 'Localizamos um entregador para sua solicitação',
    titleError: 'ERRO',
    textError: ''
  }

  componentDidMount() {
    this.setState({
      title: this.state.titleLoading,
      text: this.state.textLoading
    });

    // Adicionando evento para o botão voltar do celular
    BackHandler.addEventListener('hardwareBackPress', () => {
      this.btnReturn();
      return true;
    });

    // Busca o entregador
    this.getDeliveryman();
  }

  btnReturn = () => {
    this.props.navigation.push('Solicitation');
  }

  btnNext = () => {
    if (this.state.entregador) {
      // Redirecionamento para tela de finalização da solicitação de entrega
      this.props.navigation.navigate('FinalizedSolicitation');
    } else {
      NotificationAlert('Não foi possível obter os dados do entregador','Erro');
    }
  }

  btnRepeat = () => {
    this.setState({
      showBtnRepeat: false,
      showBtnCancel: false,
      title: this.state.titleLoading,
      text: this.state.textLoading
    });

    this.getDeliveryman();
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
            text: 'Cancelando a sua solicitação de entrega',
            showBtnRepeat: false
          }, () => {
            let registerData2 = null;
            let statusPayment = null;

            // Verificando o tipo de pagamento
            if (this.state.entrega.tipoPagamento == 'D') {
              // Observacao no pagamento
              registerData2 = {
                observacao: 'PAGAMENTO NÃO REALIZADO. ENTREGADOR NÃO DISPONÍVEL'
              }
              // Status do pagamento
              statusPayment = 'NRE'; // NÃO REALIZADO
            } else {
              // Observacao no pagamento
              registerData2 = {
                observacao: 'PAGAMENTO DEVOLVIDO. ENTREGADOR NÃO DISPONÍVEL'
              }
              // Status do pagamento
              statusPayment = 'DEV'; // DEVOLVIDO
            }

            API({ token: this.state.token })
              .put(`pagamentos/${this.state.entrega.pagamentoId}/observacao`, registerData2)
              .then(res2 => {
                if (res2 && (res2.status == 200 || res2.status == 204)) {
                  // Alterando status
                  API({ token: this.state.token })
                    .post('pagamentos-status', {
                      pagamento: { id: this.state.entrega.pagamentoId },
                      status: statusPayment
                    })
                    .then(res3 => {
                      if (res3 && res3.data) {
                        this.setState({
                          title: 'CANCELADA',
                          text: 'Sua solicitação de entrega foi cancelada',
                          showBtnCancel: false,
                          showBtnTelaInicial: true
                        }, () => {
                          // Apagando dados da entrega da Store
                          this.props.deliveryInitialStateAction();
                        });
                      } else {
                        NotificationAlert('Não foi possível alterar a situação do pagamento', 'Erro');
                      }
                    })
                    .catch(error => { 
                      if (error && error.response && error.response.data) {
                        NotificationAlert(ListErrors(error.response.data));
                      } else {
                        NotificationAlert('Ocorreu um erro durante a alteração do pagamento');
                      }
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
          });
        } else {
          NotificationAlert('Não foi processar o cancelamento da entrega');
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

  getDeliveryman = () => {
    API({ token: this.state.token })
      .get(`entregas/${this.state.entrega.id}/entregador`)
      .then(res => {
        if (res && res.data) {
          this.setState({
            entregador: res.data,
            title: this.state.titleSuccess,
            text: this.state.textSuccess
          }, async () => {
            await this.props.deliverymanRegisterAction({
              id: this.state.entregador.id,
              nome: this.state.entregador.nome,
              email: this.state.entregador.email,
              telefone: this.state.entregador.telefone,
            });

            await this.props.deliverymanVehicleAction({
              veiculo: {
                nome: this.state.entregador.veiculo,
                modelo: this.state.entregador.modelo,
                placa: this.state.entregador.placa,
              }
            });

            this.btnNext();
          });
        } else {
          this.setState({
            showBtnRepeat: true,
            showBtnCancel: true,
            title: this.state.titleError,
            text: 'No momento não temos entregadores disponíveis. Selecione tentar novamente ou cancelar.'
          });
        }
      })
      .catch(error => {
        if (error && error.response && error.response.data) {
          this.setState({
            showBtnRepeat: true,
            showBtnCancel: true,
            title: this.state.titleError,
            text: ListErrors(error.response.data)
          });
        } else {
          this.setState({
            showBtnRepeat: true,
            showBtnCancel: true,
            title: this.state.titleError,
            text: 'Não foi possível encontrar um entregador'
          });
        }
      });
  }

  render() {
    return (
      <KeyboardAvoidingView behavior="height" style={[Styles.body, Styles.whiteBg]}>
        <View style={Styles.contentContainer}>
          <View>
            <View style={[Styles.container, Styles.textBox]}>
              <Icon
                type={typeIconDefault}
                name='truck-delivery'
                style={[Styles.iconButton, { fontSize: 60 }]} />
              <Text style={[Styles.fontBoxDefault, Styles.font16]}>{this.state.title}</Text>
              <Text style={Styles.fontBoxDefault, { textAlign: 'center' }}>{this.state.text}</Text>
            </View>
            <View style={Styles.container}>
            {(this.state.showBtnRepeat === true) ? ( 
              <TouchableOpacity
                style={[Styles.largeBlockButton, Styles.m10]}
                onPress={this.btnRepeat}>
                <Text style={Styles.textButton}>TENTAR NOVAMENTE</Text>
              </TouchableOpacity>
              ) : null}
            {(this.state.showBtnCancel === true) ? (
              <TouchableOpacity
                style={[Styles.largeBlockButton, Styles.m10]}
                onPress={this.btnCancel}>
                <Text style={Styles.textButton}>CANCELAR ENTREGA</Text>
              </TouchableOpacity>
              ) : null}
            {(this.state.showBtnTelaInicial === true) ? (
              <TouchableOpacity
                style={[Styles.largeBlockButton, Styles.m10]}
                onPress={this.btnReturn}>
                <Text style={Styles.textButton}>TELA INICIAL</Text>
              </TouchableOpacity>
            ) : null}
            </View>
          </View>
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
  deliveryInitialStateAction,
  deliverymanRegisterAction,
  deliverymanVehicleAction,
  statusPaymentAction
}

export default connect(mapStateToProps, mapDispatchToProps)(FindDeliverymanPage);
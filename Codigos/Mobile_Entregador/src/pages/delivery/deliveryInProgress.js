import React from 'react';
import { connect } from 'react-redux';
import {
  View,
  KeyboardAvoidingView,
  Text,
  TouchableOpacity
} from 'react-native';

import Styles from '../../assets/scss/styles';
import { NotificationAlert } from '../../components/general/alerts';
import {
  formatNumber,
  formatTimetablesCurrent
} from '../../components/general/converter';
import ListErrors from '../../components/general/listErrors';
import API from '../../services/api';

const typeIconDefault = "MaterialCommunityIcons";

class DeliveryInProgressPage extends React.Component {
  state = {
    token: this.props.configuracoes.token,
    usuario: this.props.usuario,
    pessoa: this.props.pessoa,
    id: (this.props.route && this.props.route.params) ? this.props.route.params.id : null,
    status: 'EDR',
    entrega: (this.props.entrega) ? this.props.entrega : null,
    entregaAPI: null,
    enderecoRetiradaAPI: null,
    enderecoEntregaAPI: null
  }

  componentDidMount() {
    if (this.state.id) {
      // Consulta detalhes da entrega
      this.getDetails();
    } else {
      NotificationAlert('Não foi possível identificar a entrega.');
      this.btnReturn();
    }
  }

  btnReturn = () => {
    this.props.navigation.navigate('Solicitation');
  }

  btnConfirmReceipt = () => {
    // Definindo hora de saida da entrega
    this.setState({
      entregaAPI: {
        ...this.state.entregaAPI,
        horaSaida: formatTimetablesCurrent()
      }
    }, () => {
      // Registrando hora de saída da entrega
      API({ token: this.state.token })
        .put(`entregas/${this.state.id}/registrar-hora-saida`, { 
          idEntrega: this.state.id 
        })
        .then(res => {
          if (res && (res.status == 204 || res.status == 200)) {
            // Alterando status da entrega para INICIADA
            let registerData1 = {
              entrega: { id: this.state.entregaAPI.id },
              status: 'I'
            }
            API({ token: this.state.token })
              .post(`entregas-status`, registerData1)
              .then(res1 => {
                if (res1 && res1.data) {
                  this.setState({
                    status: res1.data.status
                  });
                }
              })
              .catch(error => {
                if (error.response && error.response.data) {
                  NotificationAlert(ListErrors(error.response.data));
                } else if (error.response) {
                  NotificationAlert('Erro ao alterar a situação da entrega. Código: ' + error.response.status);
                } else {
                  NotificationAlert('Erro ao alterar a situação da entrega.');
                }
              });
          } else {
            NotificationAlert('Não foi possível atualizar os dados da entrega');
          }
        })
        .catch(error => {
          if (error.response && error.response.data) {
            NotificationAlert(ListErrors(error.response.data));
          } else if (error.response) {
            NotificationAlert('Erro ao atualizar os dados da entrega. Código: ' + error.response.status);
          } else {
            NotificationAlert('Erro ao atualizar os dados da entrega.');
          }
        });
    });
  }

  btnConclusion = () => {
    // Definindo hora de chegada da entrega
    this.setState({
      entregaAPI: {
        ...this.state.entregaAPI,
        horaChegada: formatTimetablesCurrent()
      }
    }, () => {
      // Registrando hora de chegada da entrega
      API({ token: this.state.token })
        .put(`entregas/${this.state.id}/registrar-hora-chegada`, { 
          idEntrega: this.state.id 
        })
        .then(res => {
          if (res && (res.status == 204 || res.status == 200)) {
            // Alterando status da entrega para CONCLUIDA
            let registerData1 = {
              entrega: { id: this.state.entregaAPI.id },
              status: 'CO'
            }
            API({ token: this.state.token })
              .post(`entregas-status`, registerData1)
              .then(res1 => {
                if (res1 && res1.data) {
                  this.setState({
                    status: res1.data.status
                  }, async () => {
                    // Redireciona para tela de finalização da entrega
                    this.props.navigation.navigate('DeliveryFinalized');
                  });
                }
              })
              .catch(error => {
                if (error.response && error.response.data) {
                  NotificationAlert(ListErrors(error.response.data));
                } else {
                  NotificationAlert('Erro ao alterar a situação da entrega. Código: ' + error.response.status);
                }
              });
          } else {
            NotificationAlert('Não foi possível atualizar os dados da entrega');
          }
        })
        .catch(error => {
          if (error.response && error.response.data) {
            NotificationAlert(ListErrors(error.response.data));
          } else {
            NotificationAlert('Erro ao atualizar os dados da entrega. Código: ' + error.response.status);
          }
        });
    });
  }

  getDetails = () => {
    API({ token: this.state.token }).get(`entregas/${this.state.id}`)
      .then(res => {
        if (res && res.data) {
          this.setState({
            entregaAPI: res.data
          }, () => {
            // Consultando enderecos da entrega
            API({ token: this.state.token })
              .get(`entrega-enderecos/entrega/${this.state.id}`)
              .then(res1 => {
                if (res1 && res1.data) {
                  // Identificando os enderecos
                  res1.data.map((currentAddress) => {
                    if (currentAddress.tipoEndereco == 'O') {
                      this.setState({
                        enderecoRetiradaAPI: currentAddress
                      });
                    } else if (currentAddress.tipoEndereco == 'D') {
                      this.setState({
                        enderecoEntregaAPI: currentAddress
                      });
                    }
                  });
                }
              })
              .catch(error => {
                if (error.response && error.response.data) {
                  NotificationAlert(ListErrors(error.response.data));
                } else if (error.response) {
                  NotificationAlert('Erro ao obter os detalhes dos endereços. '+
                    'Código: ' + error.response.status);
                } else {
                  NotificationAlert('Erro ao obter os detalhes dos endereços.');
                }
              });
          });
        } else {
          NotificationAlert('Não foi possível obter os dados da entrega');
        }
      })
      .catch(error => {
        if (error.response && error.response.data) {
          NotificationAlert(ListErrors(error.response.data));
        } else if (error.response) {
          NotificationAlert('Erro ao obter os detalhes da entrega. Código: ' + error.response.status);
        } else {
          NotificationAlert('Erro ao obter os detalhes da entrega.');
        }
      });
  }

  render() {
    let tipoPagamento = '';
    if (this.state.entrega && this.state.entrega.tipoPagamento) {
      switch (this.state.entrega.tipoPagamento) {
        case 'D': tipoPagamento = 'Dinheiro'; break;
        case 'CC': tipoPagamento = 'Cartão de Crédito'; break;
        case 'CD': tipoPagamento = 'Cartão de Débito'; break;
      }
    }

    return (
      <KeyboardAvoidingView style={[Styles.body, Styles.whiteBg]}>
        <View style={Styles.contentContainer}>
          {(!this.state.entrega) ? (
            <Text style={{ margin: 15 }}></Text>
          ) : (
              <View style={Styles.justifyTopContainer}>
                <View style={[Styles.horizontalContainer, { width: '100%', flex: 0 }]}>
                  <Text style={[Styles.textSmallBox, Styles.fontBold, { paddingBottom: 0, width: '40%' }]}>Solicitante: </Text>
                  <Text style={[Styles.textSmallBox, { width: '60%' }]}>{this.state.entrega.solicitante}</Text>
                </View>
                {(this.state.status == 'EDR') ? (
                  <View>
                    <View style={[Styles.horizontalContainer, { width: '100%', flex: 0 }]}>
                      <Text style={[Styles.textSmallBox, Styles.fontBold, { paddingBottom: 0, width: '40%' }]}>Endereço de Retirada: </Text>
                      <Text style={[Styles.textSmallBox, { width: '60%' }]}>{this.state.entrega.enderecoRetirada}</Text>
                    </View>
                    <View style={[Styles.horizontalContainer, { width: '100%', flex: 0 }]}>
                      <Text style={[Styles.textSmallBox, Styles.fontBold, { paddingBottom: 0, width: '40%' }]}>Contato na Retirada: </Text>
                      <Text style={[Styles.textSmallBox, { width: '60%' }]}>{(this.state.enderecoRetiradaAPI) ? this.state.enderecoRetiradaAPI.contato : ''}</Text>
                    </View>
                    <View style={[Styles.horizontalContainer, { width: '100%', flex: 0 }]}>
                      <Text style={[Styles.textSmallBox, Styles.fontBold, { paddingBottom: 0, width: '40%' }]}>Observações: </Text>
                      <Text style={[Styles.textSmallBox, { width: '60%' }]}>{(this.state.enderecoRetiradaAPI) ? this.state.enderecoRetiradaAPI.tarefa : ''}</Text>
                    </View>
                  </View>
                ) : null}
                {(this.state.status == 'I') ? (
                  <View>
                    <View style={[Styles.horizontalContainer, { width: '100%', flex: 0 }]}>
                      <Text style={[Styles.textSmallBox, Styles.fontBold, { paddingBottom: 0, width: '40%' }]}>Endereço de Entrega: </Text>
                      <Text style={[Styles.textSmallBox, { width: '60%' }]}>{this.state.entrega.enderecoEntrega}</Text>
                    </View>
                    <View style={[Styles.horizontalContainer, { width: '100%', flex: 0 }]}>
                      <Text style={[Styles.textSmallBox, Styles.fontBold, { paddingBottom: 0, width: '40%' }]}>Contato na Entrega: </Text>
                      <Text style={[Styles.textSmallBox, { width: '60%' }]}>{(this.state.enderecoEntregaAPI) ? this.state.enderecoEntregaAPI.contato : ''}</Text>
                    </View>
                    <View style={[Styles.horizontalContainer, { width: '100%', flex: 0 }]}>
                      <Text style={[Styles.textSmallBox, Styles.fontBold, { paddingBottom: 0, width: '40%' }]}>Observações: </Text>
                      <Text style={[Styles.textSmallBox, { width: '60%' }]}>{(this.state.enderecoEntregaAPI) ? this.state.enderecoEntregaAPI.tarefa : ''}</Text>
                    </View>
                  </View>
                ) : null}
                <View style={[Styles.horizontalContainer, { width: '100%', flex: 0 }]}>
                  <Text style={[Styles.textSmallBox, Styles.fontBold, { paddingBottom: 0, width: '40%' }]}>Tipo de Pagamento: </Text>
                  <Text style={[Styles.textSmallBox, { width: '60%' }]}>{tipoPagamento}</Text>
                </View>
                <View style={[Styles.horizontalContainer, { width: '100%', flex: 0 }]}>
                  <Text style={[Styles.textSmallBox, Styles.fontBold, { paddingBottom: 0, width: '40%' }]}>Valor da Entrega: </Text>
                  <Text style={[Styles.textSmallBox, { width: '60%' }]}>R$ {formatNumber(this.state.entrega.valorEntrega)}</Text>
                </View>
                {(this.state.status == 'EDR') ? (
                  <View style={Styles.containerButtonBottom}>
                    <TouchableOpacity
                      style={Styles.largeBlockButton}
                      onPress={() => this.btnConfirmReceipt()}>
                      <Text style={Styles.textButton}>RECEBI A ENCOMENDA</Text>
                    </TouchableOpacity>
                  </View>
                ) : null}
                {(this.state.status == 'I') ? (
                  <View style={Styles.containerButtonBottom}>
                    <TouchableOpacity
                      style={Styles.largeBlockButton}
                      onPress={() => this.btnConclusion()}>
                      <Text style={Styles.textButton}>ENTREGUEI NO DESTINO</Text>
                    </TouchableOpacity>
                  </View>
                ) : null}
              </View>
            )}
        </View>
      </KeyboardAvoidingView>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    pessoa: state.pessoa,
    usuario: state.usuario,
    configuracoes: state.configuracoes,
    entrega: state.entrega
  }
}

export default connect(mapStateToProps)(DeliveryInProgressPage);

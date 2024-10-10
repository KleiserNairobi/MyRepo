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
  formatDate,
  statusCodeForName
} from '../../components/general/converter';
import ListErrors from '../../components/general/listErrors';

import API from '../../services/api';

const typeIconDefault = "MaterialCommunityIcons";

class ScheduleDetailsPage extends React.Component {
  state = {
    token: this.props.configuracoes.token,
    usuario: this.props.usuario,
    pessoa: this.props.pessoa,
    id: (this.props.route && this.props.route.params) ? this.props.route.params.id : null,
    agendamento: null,
    enderecoRetirada: null,
    enderecoEntrega: null,
    status: null
  }

  componentDidMount() {
    if (this.state.id) {
      this.getDetails();
    } else {
      NotificationAlert('Não foi possível identificar o agendamento.');
    }
  }

  btnCancel = () => {
    API({ token: this.state.token })
      .put(`agendamentos/${this.state.id}/cancelar?tipo=U`)
      .then(res => {
        if (res.status == 200 || res.status == 204) {
          this.getDetails();
        } else {
          NotificationAlert('Não foi possível cancelar o agendamento');
        }
      })
      .catch(error => {
        if (error && error.response && error.response.data) {
          NotificationAlert(ListErrors(error.response.data));
        } else {
          NotificationAlert('Não foi possível cancelar o agendamento');
        }
      });
  }

  getEnderecos = () => {
    API({ token: this.state.token })
      .get(`agendamento-enderecos/${this.state.id}`)
      .then(res1 => {
        if (res1 && res1.data && res1.data.length) {
          // Identificando os enderecos
          res1.data.map((currentAddress) => {
            if (currentAddress.tipoEndereco == 'O') {
              this.setState({
                enderecoRetirada: currentAddress
              });
            } else if (currentAddress.tipoEndereco == 'D') {
              this.setState({
                enderecoEntrega: currentAddress
              });
            }
          });
        } else {
          NotificationAlert('Não foi possível obter os endereços do agendamento');
        }
      })
      .catch(error => {
        NotificationAlert('Não foi possível obter os endereços do agendamento');
      });
  }

  getDetails = () => {
    API({ token: this.state.token })
      .get(`agendamentos/${this.state.id}`)
      .then(res => {
        if (res && res.data) {
          this.setState({
            agendamento: res.data
          }, () => {
            this.getEnderecos();
          });
        } else {
          NotificationAlert('Não foi possível obter os dados do agendamento');
        }
      })
      .catch(error => {
        if (error && error.response && error.response.data) {
          this.setState({ errorMessage: error.response.data.detalhe });
        } else if (error && error.response) {
          NotificationAlert('Erro ao obter os detalhes do agendamento. Código: ' + error.response.status);
        } else {
          NotificationAlert('Erro ao obter os detalhes do agendamento.');
        }
      });
  }

  render() {
    // Montagem dos Endereços
    let enderecoRetirada = '';
    if (this.state.enderecoRetirada) {
      enderecoRetirada = this.state.enderecoRetirada.logradouro; 
      if (this.state.enderecoRetirada.numero) {
        enderecoRetirada +=  ', ' + this.state.enderecoRetirada.numero;
      }
      if (this.state.enderecoRetirada.complemento) {
        enderecoRetirada +=  ', ' + this.state.enderecoRetirada.complemento;
      }
      if (this.state.enderecoRetirada.bairro) {
        enderecoRetirada +=  ', ' + this.state.enderecoRetirada.bairro;
      }
    }
    let enderecoEntrega = '';
    if (this.state.enderecoEntrega) {
      enderecoEntrega = this.state.enderecoEntrega.logradouro; 
      if (this.state.enderecoEntrega.numero) {
        enderecoEntrega +=  ', ' + this.state.enderecoEntrega.numero;
      }
      if (this.state.enderecoEntrega.complemento) {
        enderecoEntrega +=  ', ' + this.state.enderecoEntrega.complemento;
      }
      if (this.state.enderecoEntrega.bairro) {
        enderecoEntrega +=  ', ' + this.state.enderecoEntrega.bairro;
      }
    }

    return (
      <KeyboardAvoidingView style={[Styles.body, Styles.whiteBg]}>
        <View style={Styles.contentContainer}>
          {(this.state.agendamento) ? (
            <View style={[Styles.justifyTopContainer, { marginBottom: 15 }]}>
              <View style={Styles.detailsItemContainer}>
                <Text style={Styles.detailsItemDescriptionContainer}>Data</Text>
                <Text style={Styles.detailsItemValueContainer}>
                  {formatDate(this.state.agendamento.dataExecucao)}
                </Text>
              </View>
              <View style={Styles.detailsItemContainer}>
                <Text style={Styles.detailsItemDescriptionContainer}>Horário da Retirada</Text>
                <Text style={Styles.detailsItemValueContainer}>
                  {this.state.agendamento.horaExecucao ? this.state.agendamento.horaExecucao : '-'}
                </Text>
              </View>
              <View style={Styles.detailsItemContainer}>
                <Text style={Styles.detailsItemDescriptionContainer}>Distância</Text>
                <Text style={Styles.detailsItemValueContainer}>
                  {this.state.agendamento.distancia} km
                </Text>
              </View>
              <View style={Styles.detailsItemContainer}>
                <Text style={Styles.detailsItemDescriptionContainer}>Previsão para percurso</Text>
                <Text style={Styles.detailsItemValueContainer}>
                  {this.state.agendamento.previsao}
                </Text>
              </View>
              <View style={Styles.detailsItemContainer}>
                <Text style={Styles.detailsItemDescriptionContainer}>Entregador</Text>
                <Text style={Styles.detailsItemValueContainer}>
                  {this.state.agendamento.entregador ? this.state.agendamento.entregador.nome : ''}
                </Text>
              </View>
              <View style={Styles.detailsItemContainer}>
                <Text style={Styles.detailsItemDescriptionContainer}>Veículo</Text>
                <Text style={Styles.detailsItemValueContainer}>
                  {this.state.agendamento.tipoVeiculo ? statusCodeForName('VEICULO', this.state.agendamento.tipoVeiculo) : ''}
                </Text>
              </View>

              <View style={Styles.p15}>
                <Text style={Styles.fontBold}>ENDEREÇOS</Text>
              </View>
              <View style={Styles.detailsItemContainer}>
                <Text style={Styles.detailsItemDescriptionContainer}>Retirada</Text>
                <Text style={Styles.detailsItemValueContainer}>
                  {enderecoRetirada}
                </Text>
              </View>
              <View style={Styles.detailsItemContainer}>
                <Text style={Styles.detailsItemDescriptionContainer}>Entrega</Text>
                <Text style={Styles.detailsItemValueContainer}>
                  {enderecoEntrega}
                </Text>
              </View>
            </View>
          ) : null}
        </View>
      </KeyboardAvoidingView>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    usuario: state.usuario,
    pessoa: state.pessoa,
    configuracoes: state.configuracoes
  }
}

export default connect(mapStateToProps)(ScheduleDetailsPage);

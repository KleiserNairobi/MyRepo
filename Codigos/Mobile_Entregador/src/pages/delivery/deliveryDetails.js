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

class DeliveryDetailsPage extends React.Component {
  state = {
    token: this.props.configuracoes.token,
    usuario: this.props.usuario,
    pessoa: this.props.pessoa,
    id: (this.props.route && this.props.route.params) ? this.props.route.params.id : null,
    entrega: null,
    enderecoRetirada: null,
    enderecoEntrega: null,
    status: null
  }

  componentDidMount() {
    if (this.state.id) {
      this.getDetails();
    } else {
      NotificationAlert('Não foi possível identificar a entrega.');
    }
  }

  btnReturn = () => {
    this.props.navigation.navigate('Deliveries');
  }

  getStatusEntrega = () => {
    API({ token: this.state.token })
    .get(`entregas-status/${this.state.id}/ultimo-status`)
    .then(res1 => {
      if (res1 && res1.data) {
        this.setState({
          status: res1.data.status
        });
      } else {
        NotificationAlert('Não foi possível obter a situação da entrega');
      }
    })
    .catch(error => {
      NotificationAlert('Não foi possível obter a situação da entrega');
    });
  }

  getEnderecosEntrega = () => {
    API({ token: this.state.token })
      .get(`entrega-enderecos/entrega/${this.state.id}`)
      .then(res1 => {
        if (res1 && res1.data) {
          // Identificando os enderecos
          res1.data.map((currentAddress) => {
            if (currentAddress.tipoEndereco == 'O') {
              // Montagem do Endereço
              let endereco = '';
              if (currentAddress) {
                endereco = currentAddress.logradouro; 
                if (currentAddress.numero) {
                  endereco +=  ', ' + currentAddress.numero;
                }
                if (currentAddress.complemento) {
                  endereco +=  ', ' + currentAddress.complemento;
                }
                if (currentAddress.bairro) {
                  endereco +=  ', ' + currentAddress.bairro;
                }
              }

              this.setState({
                enderecoRetirada: endereco
              });
            } else if (currentAddress.tipoEndereco == 'D') {
              // Montagem do Endereço
              let endereco = '';
              if (currentAddress) {
                endereco = currentAddress.logradouro; 
                if (currentAddress.numero) {
                  endereco +=  ', ' + currentAddress.numero;
                }
                if (currentAddress.complemento) {
                  endereco +=  ', ' + currentAddress.complemento;
                }
                if (currentAddress.bairro) {
                  endereco +=  ', ' + currentAddress.bairro;
                }
              }

              this.setState({
                enderecoEntrega: endereco
              });
            }
          });
        } else {
          NotificationAlert('Não foi possível obter a situação da entrega');
        }
      })
      .catch(error => {
        NotificationAlert('Não foi possível obter a situação da entrega');
      });
  }

  getDetails = () => {
    API({ token: this.state.token })
      .get(`entregas/${this.state.id}`)
      .then(res => {
        if (res && res.data) {
          this.setState({
            entrega: res.data
          }, () => {
            this.getStatusEntrega();
            this.getEnderecosEntrega();
          });
        } else {
          NotificationAlert('Não foi possível obter os dados da solicitação de entrega');
        }
      })
      .catch(error => {
        if (error && error.response && error.response.data) {
          this.setState({ errorMessage: error.response.data.detalhe });
        } else if (error && error.response) {
          NotificationAlert('Erro ao obter os detalhes da entrega. Código: ' + error.response.status);
        } else {
          NotificationAlert('Erro ao obter os detalhes da entrega.');
        }
      });
  }

  render() {
    return (
      <KeyboardAvoidingView style={[Styles.body, Styles.whiteBg]}>
        <View style={Styles.contentContainer}>
          {(this.state.entrega) ? (
            <View style={[Styles.justifyTopContainer, { marginBottom: 15 }]}>
              <View style={Styles.detailsItemContainer}>
                <Text style={Styles.detailsItemDescriptionContainer}>Situação</Text>
                <Text style={Styles.detailsItemValueContainer}>
                  {statusCodeForName('ENTREGA', this.state.status)}
                </Text>
              </View>
              <View style={Styles.detailsItemContainer}>
                <Text style={Styles.detailsItemDescriptionContainer}>Data</Text>
                <Text style={Styles.detailsItemValueContainer}>
                  {formatDate(this.state.entrega.data)}
                </Text>
              </View>
              <View style={Styles.detailsItemContainer}>
                <Text style={Styles.detailsItemDescriptionContainer}>Distância</Text>
                <Text style={Styles.detailsItemValueContainer}>
                  {this.state.entrega.distancia} km
                </Text>
              </View>
              <View style={Styles.detailsItemContainer}>
                <Text style={Styles.detailsItemDescriptionContainer}>Previsão para percurso</Text>
                <Text style={Styles.detailsItemValueContainer}>
                  {this.state.entrega.previsao}
                </Text>
              </View>
              <View style={Styles.detailsItemContainer}>
                <Text style={Styles.detailsItemDescriptionContainer}>Veículo</Text>
                <Text style={Styles.detailsItemValueContainer}>
                  {this.state.entrega.tipoVeiculo ? statusCodeForName('VEICULO', this.state.entrega.tipoVeiculo) : ''}
                </Text>
              </View>
              <View style={Styles.detailsItemContainer}>
                <Text style={Styles.detailsItemDescriptionContainer}>Horário da Retirada</Text>
                <Text style={Styles.detailsItemValueContainer}>
                  {this.state.entrega.horaSaida ? this.state.entrega.horaSaida : '-'}
                </Text>
              </View>
              <View style={Styles.detailsItemContainer}>
                <Text style={Styles.detailsItemDescriptionContainer}>Horário da Entrega</Text>
                <Text style={Styles.detailsItemValueContainer}>
                  {this.state.entrega.horaChegada ? this.state.entrega.horaChegada : '-'}
                </Text>
              </View>

              <View style={Styles.p15}>
                <Text style={Styles.fontBold}>ENDEREÇOS</Text>
              </View>
              <View style={Styles.detailsItemContainer}>
                <Text style={Styles.detailsItemDescriptionContainer}>Retirada</Text>
                <Text style={Styles.detailsItemValueContainer}>
                  {this.state.enderecoRetirada}
                </Text>
              </View>
              <View style={Styles.detailsItemContainer}>
                <Text style={Styles.detailsItemDescriptionContainer}>Entrega</Text>
                <Text style={Styles.detailsItemValueContainer}>
                  {this.state.enderecoEntrega}
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
    pessoa: state.pessoa,
    usuario: state.usuario,
    configuracoes: state.configuracoes,
    entrega: state.entrega
  }
}

export default connect(mapStateToProps)(DeliveryDetailsPage);

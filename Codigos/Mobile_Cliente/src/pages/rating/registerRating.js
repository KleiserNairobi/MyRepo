import React from 'react';
import { connect } from 'react-redux';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity
} from 'react-native';
import { Icon, Item } from 'native-base';
import { AirbnbRating } from 'react-native-ratings';

import Styles from '../../assets/scss/styles';
import { NotificationAlert } from '../../components/general/alerts';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import ListErrors from '../../components/general/listErrors';
import API from '../../services/api';
import {
  formatDate,
  formatDateCurrent,
  statusCodeForName
} from '../../components/general/converter';

const typeIconDefault = "MaterialCommunityIcons";

class RegisterRatingPage extends React.Component {
  state = {
    ...this.props,
    token: this.props.configuracoes.token,
    pessoa: this.props.usuario.pessoa,
    id: (this.props.route && this.props.route.params) ? this.props.route.params.id : null,
    entrega: null,
    entregador: null,
    classificacao: 0,
    comentario: null
  }

  componentDidMount() {
    if (this.state.id) {
      this.getDetails();
    } else {
      NotificationAlert('Não foi possível identificar a entrega.');
    }
  }

  btnReturn = () => {
    this.props.navigation.push('Solicitation');
  }

  btnRating = () => {
    // Dados para registro no Webservice
    let registerData = {
      classificacao: this.state.classificacao,
      comentario: this.state.comentario,
      data: formatDateCurrent('database'),
      entrega: {
        id: this.state.entrega.id
      },
      pessoa: {
        id: this.state.pessoa.id
      }
    }

    // Registrando pagamento
    API({ token: this.state.token })
      .post('entrega-avaliacoes', registerData)
      .then(res => {
        if (res && res.data) {
          this.btnReturn();
        } else {
          NotificationAlert('Não foi possível registrar sua avaliação');
        }
      })
      .catch(error => {
        if (error && error.response && error.response.data) {
          NotificationAlert(ListErrors(error.response.data));
        } else {
          NotificationAlert('Não foi possível registrar sua avaliação', 'Erro');
        }
      });
  }

  getDetails = () => {
    API({ token: this.state.token })
      .get(`entregas/${this.state.id}`)
      .then(res => {
        if (res && res.data) {
          this.setState({
            entrega: res.data,
            entregador: (res.data.entregador) ? res.data.entregador : null
          });
        } else {
          NotificationAlert('Não foi possível obter os dados da entrega');
        }
      })
      .catch(error => {
        if (error && error.response && error.response.data) {
          NotificationAlert(ListErrors(error.response.data));
        } else if (error && error.response) {
          NotificationAlert('Erro ao obter os detalhes da entrega. Código: ' + error.response.status);
        } else {
          NotificationAlert('Erro ao obter os detalhes da entrega.');
        }
      });
  }

  validateInput = (input, valueInput) => {
    switch (input) {
      case 'classificacao':
        this.setState({
          classificacao: valueInput
        });
        break;
      case 'comentario':
        this.setState({
          comentario: valueInput
        });
        break;
    }
  }

  render() {
    return (
      <KeyboardAwareScrollView behavior="height" style={[Styles.body, Styles.whiteBg]}>
        {(this.state.entrega) ? (
          <View style={Styles.contentContainer}>
            <View style={[Styles.contentContainer, { width: '100%' }]}>
              <View style={[Styles.grayBg, { width: '100%', height: 50, justifyContent: 'center' }]}>
                <Text style={Styles.headerTitle}>Sua encomenda foi entregue</Text>
              </View>
              {(this.state.entregador) ? (
                <View style={Styles.detailsItemContainer}>
                  <Text style={Styles.detailsItemDescriptionContainer}>Entregador: </Text>
                  <Text style={Styles.detailsItemValueContainer}>{this.state.entregador.nome}</Text>
                </View>
              ) : null}
              <View style={Styles.detailsItemContainer}>
                <Text style={Styles.detailsItemDescriptionContainer}>Veículo: </Text>
                <Text style={Styles.detailsItemValueContainer}>{statusCodeForName('VEICULO', this.state.entrega.tipoVeiculo)}</Text>
              </View>
              <View style={Styles.detailsItemContainer}>
                <Text style={Styles.detailsItemDescriptionContainer}>Data: </Text>
                <Text style={Styles.detailsItemValueContainer}>{formatDate(this.state.entrega.data)}</Text>
              </View>
              <View style={Styles.detailsItemContainer}>
                <Text style={Styles.detailsItemDescriptionContainer}>Hora de Chegada: </Text>
                <Text style={Styles.detailsItemValueContainer}>{this.state.entrega.horaChegada}</Text>
              </View>
              <View style={[Styles.horizontalContainer, { width: '100%', flex: 0, marginTop: 5 }]}>
                <Text style={Styles.headerTitle}>Avalie a entrega:</Text>
              </View>
              <View>
                <AirbnbRating
                  ratingCount={5}
                  defaultRating={this.state.classificacao}
                  imageSize={40}
                  showRating={false}
                  onFinishRating={(value) => this.validateInput('classificacao', value)}
                  style={{ padding: 10 }} />
              </View>
              <View style={[Styles.horizontalContainer, { width: '100%', flex: 0, marginTop: 5 }]}>
                <Text style={Styles.headerTitle}>Deixe um comentário:</Text>
              </View>
              <View style={Styles.formContainer}>
                <Item>
                  <TextInput
                      ref="comentario"
                      maxLength={60}
                      style={Styles.inputText}
                      value={this.state.comentario}
                      onChangeText={valueInput => this.validateInput('comentario', valueInput)} />
                </Item>
              </View>
            </View>
            <View style={[Styles.container, { flex: 0, width: '100%' }]}>
              <TouchableOpacity
                style={Styles.largeBlockButton}
                onPress={this.btnRating}>
                <Text style={Styles.textButton}>Confirmar</Text>
              </TouchableOpacity>
            </View>
            <View style={[Styles.horizontalContainer, { flex: 0, width: '100%' }]}>
              <TouchableOpacity
                style={Styles.largeBlockButton}
                onPress={this.btnReturn}>
                <Text style={Styles.textButton}>Voltar</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : null}
      </KeyboardAwareScrollView>
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

const mapDispatchToProps = null;

export default connect(mapStateToProps, mapDispatchToProps)(RegisterRatingPage);
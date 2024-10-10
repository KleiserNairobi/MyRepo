import React from 'react';
import { connect } from 'react-redux';
import {
  View,
  KeyboardAvoidingView,
  Text,
  FlatList,
  TouchableOpacity
} from 'react-native';
import { Icon } from 'native-base';

import Styles from '../../assets/scss/styles';
import { NotificationAlert } from '../../components/general/alerts';
import { gatewayPaymentAction } from '../../store/slices/deliverySlice';

import API from '../../services/api';

const typeIconDefault = "MaterialCommunityIcons";

class ChooseCardGatewayPage extends React.Component {
  state = {
    ...this.props,
    token: this.props.configuracoes.token,
    list: [],
    gateway: null,
    errorMessage: null
  }

  componentDidMount() {
    this.getGateways();
  }

  btnReturn = () => {
    this.props.navigation.navigate('InsertDeliveryExtraData');
  }

  btnNext = async () => {
    await this.props.gatewayPaymentAction({
      gatewayPagamento: this.state.gateway
    });

    this.props.navigation.push('InsertCardData');
  }

  getGateways = () => {
    API({ token: this.state.token })
      .get(`gateways/ativos`)
      .then(res => {
        if (res.data && res.data.length) {
          this.setState({ 
            list: res.data 
          }, () => {
            if (this.state.list && this.state.list.length == 1) {
              this.setState({
                gateway: this.state.list[0]
              }, () => {
                this.btnNext();
              });
            }
          });
        } else {
          NotificationAlert('Nenhum Gateway de Pagamento foi encontrado');
        }
      })
      .catch(error => {
        if (error && error.response.data) {
          this.setState({ errorMessage: error.response.data.detalhe });
        } else {
          NotificationAlert('Erro ao obter lista de Gateways.');
        }
      });
  }

  validateInput = (input, valueInput) => {
    switch (input) {
      case 'gateway': this.setState({ gateway: valueInput }); break;
    }
  }

  renderItemList = ({ item }) => {
    return (
      <TouchableOpacity
        style={[Styles.grayLightBorder, Styles.p10, { borderWidth: 1 }]}
        onPress={() => this.validateInput('gateway', item)}>
        <View style={Styles.horizontalContainer}>
          <Text style={[Styles.textSmallBox, Styles.fontBold, { paddingBottom: 0 }]}>{item.nome}</Text>
          {this.state.gateway && this.state.gateway.id == item.id ? (
            <Icon
              type={typeIconDefault}
              name='check-circle-outline'
              style={Styles.iconButton} />
          ) : (
            <Icon
              type={typeIconDefault}
              name='checkbox-blank-circle-outline'
              style={Styles.iconButton} />
          )}
        </View>
      </TouchableOpacity>
    )
  }

  render() {
    return (
      <KeyboardAvoidingView behavior="height" style={[Styles.body, Styles.whiteBg]}>
        <View style={{ flex: 3 }}>
          {this.state.errorMessage != null ? (
            <Text style={Styles.textBox}>{this.state.errorMessage}</Text>
          ) : (
            <View style={{ width: '100%', height: '100%' }}>
              <Text style={Styles.textBox}>Escolha um dos Gateway de Pagamento:</Text>
              <FlatList
                data={this.state.list}
                renderItem={this.renderItemList}
                keyExtractor={(item) => item.id.toString()}
                style={{ flex: 1 }} />
            </View>
          )}
        </View>
        <View style={Styles.containerButtonBottom}>
          <TouchableOpacity
            style={[Styles.largeBlockButton, Styles.m10]}
            onPress={this.btnNext}>
            <Text style={Styles.textButton}>Realizar Pagamento</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    usuario: state.usuario,
    configuracoes: state.configuracoes,
    entrega: state.entrega,
  }
}

const mapDispatchToProps = { gatewayPaymentAction }

export default connect(mapStateToProps, mapDispatchToProps)(ChooseCardGatewayPage);
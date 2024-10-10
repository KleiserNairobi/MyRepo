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
import { scheduleRegisterAction } from '../../store/slices/deliverySlice';
import API from '../../services/api';

const typeIconDefault = "MaterialCommunityIcons";

class ScheduleDeliverymanPage extends React.Component {
  state = {
    token: this.props.configuracoes.token,
    pessoa: this.props.pessoa,
    entrega: this.props.entrega,
    list: [],
    deliveryman: null,
    errorMessage: null
  }

  componentDidMount() {
    this.getFavorites();
  }

  btnNext = async () => {
    if (this.state.deliveryman) {
      let registerData = {
        ...this.state.entrega.agendamento,
        entregador: {
          id: this.state.deliveryman.id,
          nome: this.state.deliveryman.nome
        }
      }

      // Registrando agendamento na Store
      await this.props.scheduleRegisterAction({
        agendamento: registerData
      });

      // Redirecionando para registrar agendamento
      this.props.navigation.navigate('RegisterSchedule');
    }
  }

  getFavorites = () => {
    API({ token: this.state.token })
      .get(`/pessoas/entregadores`)
      .then(res => {
        if (res && res.data && res.data.length) {
          this.setState({ list: res.data });
        } else {
          NotificationAlert('Nenhum entregador foi encontrado');
        }
      })
      .catch(error => {
        if (error && error.response && error.response.data) {
          this.setState({ errorMessage: error.response.data.detalhe });
        } else {
          NotificationAlert('Erro ao obter lista de entregadores.');
        }
      });
  }

  validateInput = (input, valueInput) => {
    switch (input) {
      case 'favorite':
        this.setState({ deliveryman: valueInput });
        break;
    }
  }

  renderItemList = ({ item }) => {
    var colorItem = null;
    var iconNameItem = null;
    if (this.state.deliveryman && this.state.deliveryman.id == item.id) {
        colorItem =  Styles.yellowColor;
        iconNameItem = 'checkbox-marked-circle';
    } else {
        colorItem =  Styles.grayColor;
        iconNameItem = 'checkbox-blank-circle-outline';
    }

    return (
      <TouchableOpacity
        style={[Styles.grayLightBorder, Styles.p10, { borderWidth: 1 }]}
        onPress={() => this.validateInput('favorite', item)}>
        <View style={Styles.horizontalContainer}>
          <View style={[{ flex: 1, marginLeft: 10 }]}>
            <Text style={[Styles.textSmallBox, Styles.fontBold, { paddingBottom: 0 }]}>{item.nome}</Text>
          </View>
          <Icon
            type={typeIconDefault}
            name={iconNameItem}
            style={colorItem} />
        </View>
      </TouchableOpacity>
    )
  }

  render() {
    return (
      <KeyboardAvoidingView style={[Styles.body, Styles.whiteBg]}>
        <View style={{ flex: 3 }}>
          {this.state.errorMessage != null ? (
            <Text style={Styles.textBox}>{this.state.errorMessage}</Text>
          ) : (
              <FlatList
                data={this.state.list}
                renderItem={this.renderItemList}
                keyExtractor={(item) => item.id.toString()}
                style={{ flex: 1 }} />
            )}
        </View>
        <View style={Styles.bottomContainerForButton}>
          <TouchableOpacity
            style={Styles.largeBlockButton}
            onPress={this.btnNext}>
            <Text style={Styles.textButton}>PRÓXIMA</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    )
  }

}

const mapStateToProps = (state) => {
  return {
    entrega: state.entrega,
    pessoa: state.pessoa,
    configuracoes: state.configuracoes
  }
}

const mapDispatchToProps = { scheduleRegisterAction }

export default connect(mapStateToProps, mapDispatchToProps)(ScheduleDeliverymanPage);
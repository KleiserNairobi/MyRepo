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
import { formatDate } from '../../components/general/converter';

import API from '../../services/api';

const typeIconDefault = "MaterialCommunityIcons";

class DeliveriesPage extends React.Component {
  state = {
    token: this.props.configuracoes.token,
    pessoa: this.props.pessoa,
    list: [],
    errorMessage: 'Consultando entregas. Aguarde...'
  }

  componentDidMount() {
    this.getDeliveries();
  }

  btnDetails = (idDelivery) => {
    this.props.navigation.navigate('DeliveryDetails', {
      id: idDelivery
    });
  }

  getDeliveries = () => {
    API({ token: this.state.token })
      .get(`entregas/entregador/${this.state.pessoa.id}`)
      .then(res => {
        if (res && res.data && res.data.length) {
          this.setState({ list: res.data });
        } else {
          NotificationAlert('Nenhuma solicitação de entrega foi encontrada');
        }
      })
      .catch(error => {
        if (error && error.response && error.response.data) {
          this.setState({ errorMessage: error.response.data.detalhe });
        } else if (error && error.response) {
          NotificationAlert('Erro ao obter lista das solicitações de '+
            'entregas. Código: ' + error.response.status);
        } else {
          NotificationAlert('Erro ao obter lista das solicitações de entregas.');
        }
      });
  }

  renderItemList = ({ item }) => {
    return (
      <View style={[
        Styles.horizontalContainer,
        Styles.grayLightBorder,
        { width: '100%', paddingHorizontal: 5, borderBottomWidth: 1 }
      ]}>
        <Text style={{ width: '25%', textAlign: 'center' }}>{formatDate(item.data)}</Text>
        <Text style={{ width: '25%', textAlign: 'center' }}>{item.horaSaida ? item.horaSaida : '-'}</Text>
        <Text style={{ width: '25%', textAlign: 'center'}}>{item.horaChegada ? item.horaChegada : '-'}</Text>
        <View style={[Styles.horizontalContainer, Styles.mInternalBox, { width: '25%' }]}>
          <TouchableOpacity
            onPress={() => this.btnDetails(item.id)}>
            <Icon
              type={typeIconDefault}
              name="magnify-plus-outline" 
              style={{ fontSize: 35 }} />
          </TouchableOpacity>
        </View>
      </View>
    )
  }

  render() {
    return (
      <KeyboardAvoidingView style={[Styles.body, Styles.whiteBg]}>
        <View style={Styles.container}>
          {(this.state.list && this.state.list.length < 1) ? (
            <Text style={{ margin: 15 }}>{this.state.errorMessage}</Text>
          ) : (
              <View>
                <View style={[
                  Styles.horizontalContainer,
                  Styles.grayLightBorder,
                  Styles.grayBg,
                  Styles.font16, 
                  Styles.grayColor,
                  { flex: 0, width: '100%', borderBottomWidth: 2 }
                ]}>
                  <Text style={{ width: '25%', textAlign: 'center'}}>Data</Text>
                  <Text style={{ width: '25%', textAlign: 'center'}}>H. Saída</Text>
                  <Text style={{ width: '25%', textAlign: 'center'}}>H. Chegada</Text>
                  <Text style={{ width: '25%', textAlign: 'center'}}>Detalhes</Text>
                </View>
                <FlatList
                  data={this.state.list}
                  renderItem={this.renderItemList}
                  keyExtractor={(item) => item.id.toString()}
                  style={{ flex: 1 }} />
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
    configuracoes: state.configuracoes
  }
}

export default connect(mapStateToProps)(DeliveriesPage);
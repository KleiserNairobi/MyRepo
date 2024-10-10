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

class SchedulesPage extends React.Component {
  state = {
    token: this.props.configuracoes.token,
    pessoa: this.props.pessoa,
    list: [],
    errorMessage: 'Consultando agendamentos. Aguarde...'
  }

  componentDidMount() {
    this.getSchedules();
  }

  btnDetails = (idSchedule) => {
    this.props.navigation.navigate('ScheduleDetails', {
      id: idSchedule
    });
  }

  getSchedules = () => {
    API({ token: this.state.token })
      .get(`agendamentos`)
      .then(res => {
        if (res && res.data && res.data.length) {
          this.setState({ list: res.data });
        } else {
          this.setState({ errorMessage: 'Nenhum agendamento foi encontrado' });
        }
      })
      .catch(error => {
        if (error.response && error.response.data) {
          this.setState({ errorMessage: error.response.data.detalhe });
        } else if (error.response) {
          NotificationAlert('Erro ao obter lista dos agendamentos. '+
            'Código: ' + error.response.status);
        } else {
          NotificationAlert('Erro ao obter lista dos agendamentos.');
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
        <Text style={{ width: '33%', textAlign: 'center' }}>{formatDate(item.dataExecucao)}</Text>
        <Text style={{ width: '33%', textAlign: 'center' }}>{item.horaExecucao ? item.horaExecucao : '-'}</Text>
        <View style={[Styles.horizontalContainer, Styles.mInternalBox, { width: '34%' }]}>
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
                  <Text style={{ width: '33%', textAlign: 'center' }}>Data</Text>
                  <Text style={{ width: '33%', textAlign: 'center' }}>Hora</Text>
                  <Text style={{ width: '34%', textAlign: 'center' }}>Detalhes</Text>
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

export default connect(mapStateToProps)(SchedulesPage);
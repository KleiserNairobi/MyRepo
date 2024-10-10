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
import {
  formatNumber,
  formatDate,
  formatTimetablesCurrent,
  statusCodeForName
} from '../../components/general/converter';

import API from '../../services/api';

const typeIconDefault = "MaterialCommunityIcons";

class FinancialTransactionsPage extends React.Component {
  state = {
    token: this.props.configuracoes.token,
    pessoa: this.props.pessoa,
    list: [],
    errorMessage: 'Consultando movimentações. Aguarde...'
  }

  componentDidMount() {
    this.getTransactions();
  }

  getTransactions = () => {
    API({ token: this.state.token })
      .get(`pessoa-movimentacao`)
      .then(res => {
        if (res && res.data && res.data.length) {
          this.setState({ list: res.data });
        } else {
          NotificationAlert('Nenhuma movimentação financeira foi encontrada');
        }
      })
      .catch(error => {
        if (error.response && error.response.data) {
          this.setState({ errorMessage: error.response.data.detalhe });
        } else if (error.response) {
          NotificationAlert('Erro ao obter lista das movimentações financeiras. ' +
            'Código: ' + error.response.status);
        } else {
          NotificationAlert('Erro ao obter lista das movimentações financeiras.');
        }
      });
  }

  renderItemList = ({ item }) => {
    let colorFont = (item.operacao == 'C') ? 'green' : 'red';

    return (
      <View style={[
        Styles.horizontalContainer,
        Styles.grayLightBorder,
        { width: '100%', paddingHorizontal: 5, borderBottomWidth: 1 }
      ]}>
        <Text style={{ width: '25%', textAlign: 'center' }}>{formatDate(item.data)}</Text>
        <Text style={{ width: '25%', textAlign: 'center' }}>{formatTimetablesCurrent(item.hora)}</Text>
        <Text style={{ width: '25%', textAlign: 'center' }}>
          {item.operacao ? statusCodeForName('OPERACAO_FINANCEIRA', item.operacao) : '-'}
        </Text>
        <Text style={{ width: '25%', textAlign: 'right', paddingRight: 10, color: colorFont }}>
          {item.valor ? formatNumber(item.valor) : '-'}
        </Text>
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
                  <Text style={{ width: '25%', textAlign: 'center' }}>Data</Text>
                  <Text style={{ width: '25%', textAlign: 'center' }}>Hora</Text>
                  <Text style={{ width: '25%', textAlign: 'center' }}>Operação</Text>
                  <Text style={{ width: '25%', textAlign: 'center' }}>Valor R$</Text>
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

export default connect(mapStateToProps)(FinancialTransactionsPage);
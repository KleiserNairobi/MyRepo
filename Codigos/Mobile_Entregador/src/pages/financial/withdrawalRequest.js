import React from 'react';
import { connect } from 'react-redux';
import {
  View,
  KeyboardAvoidingView,
  Text,
  FlatList,
  TouchableOpacity
} from 'react-native';
import { Item } from 'native-base';
import ValidationComponent from 'react-native-form-validator';

import Styles from '../../assets/scss/styles';
import { NotificationAlert } from '../../components/general/alerts';
import {
  formatNumber,
  formatDate,
  formatTimetablesCurrent,
  formatCurrency,
  statusCodeForName
} from '../../components/general/converter';
import { TextInputMask } from 'react-native-masked-text';

import API from '../../services/api';

const typeIconDefault = "MaterialCommunityIcons";

class WithdrawalRequestPage extends ValidationComponent {
  state = {
    token: this.props.configuracoes.token,
    pessoa: this.props.pessoa,
    list: [],
    saldo: 0.00,
    valor: 0,
    errorMessage: 'Consultando dados. Aguarde...'
  }

  componentDidMount() {
    this.loadData();
  }

  loadData = async () => {
    await this.getBalance();
    await this.getWithdrawalRequests();
  }

  btnRequest = () => {
    this.validate({
      valor: { required: true }
    });

    if (this.isFormValid()) {
      let registerData = {
        valor: this.state.valor
      }

      API({ token: this.state.token })
        .post(`solicitacoes-saques/pessoa/${this.state.pessoa.id}`, registerData)
        .then(res => {
          if (res && res.data) {
            let newList = this.state.list;
            newList.push(res.data);

            this.setState({ list: newList });
          } else {
            NotificationAlert('Não foi possível registrar a solicitação de saque');
          }
        })
        .catch(error => {
          if (error && error.response && error.response.data && error.response.data.detalhe) {
            NotificationAlert(error.response.data.detalhe);
          } else if (error && error.response) {
            NotificationAlert('Erro ao registrar a solicitação de saque. ' +
              'Código: ' + error.response.status);
          } else {
            NotificationAlert('Erro ao registrar a solicitação de saque.');
          }
        });
    } else {
      NotificationAlert(this.getErrorMessages());
    }
  }

  getBalance = async () => {
    await API({ token: this.state.token })
      .get(`conta-caixas/pessoa/${this.state.pessoa.id}`)
      .then(res => {
        if (res && res.data) {
          this.setState({ 
            saldo: res.data.saldoDisponivel 
          });
        }
      })
      .catch(error => {
        if (error && error.response && error.response.data && error.response.data.detalhe) {
          NotificationAlert(error.response.data.detalhe);
        } else if (error && error.response) {
          NotificationAlert('Erro ao obter o saldo disponível para saque. ' +
            'Código: ' + error.response.status);
        } else {
          NotificationAlert('Erro ao obter o saldo disponível para saque.');
        }
      });
  }

  getWithdrawalRequests = async () => {
    await API({ token: this.state.token })
      .get(`solicitacoes-saques/pessoa/${this.state.pessoa.id}`)
      .then(res => {
        if (res && res.data && res.data.length > 0) {
          this.setState({ list: res.data });
        } else {
          this.setState({ 
            errorMessage: 'Nenhuma solicitação de saque foi encontrada' 
          });
        }
      })
      .catch(error => {
        if (error && error.response && error.response.data && error.response.data.detalhe) {
          this.setState({ errorMessage: error.response.data.detalhe });
        } else if (error && error.response) {
          this.setState({ 
            errorMessage: 'Erro ao obter lista das solicitações de saques. ' +
            'Código: ' + error.response.status
          });
        } else {
          this.setState({ 
            errorMessage: 'Erro ao obter lista das solicitações de saques.'
          });
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
        <Text style={{ width: '33%', textAlign: 'center' }}>{formatDate(item.data)}</Text>
        <Text style={{ width: '33%', textAlign: 'center' }}>{formatTimetablesCurrent(item.hora)}</Text>
        <Text style={{ width: '33%', textAlign: 'right', paddingRight: 10, color: colorFont }}>
          {item.valor ? formatNumber(item.valor) : '-'}
        </Text>
      </View>
    )
  }

  render() {
    return (
      <KeyboardAvoidingView style={[Styles.body, Styles.whiteBg]}>
        <View style={Styles.contentContainer}>
          <View style={[Styles.yellowBg, { 
              width: '90%',
              height: 60, 
              margin: 15, 
              borderRadius: 10
            }]}>
              <View style={Styles.horizontalContainer}>
                <View>
                  <Text style={[
                    Styles.fontBold, 
                    { fontSize:18 }
                  ]}>Saldo disponível</Text>
                </View>
                <View>
                  <Text style={[
                    Styles.fontBold, 
                    { fontSize:18 }
                  ]}>R$ {formatNumber(this.state.saldo)}</Text>
                </View>
              </View>
          </View>
          <View style={[Styles.formContainer, { height: 60 }]}>
            <View style={[Styles.horizontalContainer, { width:'70%', justifyContent: 'flex-start' }]}>
              <Item>
                <TextInputMask
                  ref="valor"
                  type={'money'}
                  style={[Styles.inputText, Styles.font24]}
                  value={this.state.valor}
                  onChangeText={valueInput => this.setState({'valor': valueInput})} />
              </Item>
              <View>
                <TouchableOpacity
                  style={Styles.smallLineButton}
                  onPress={this.btnRequest}>
                  <View style={Styles.horizontalContainer}>
                    <Text style={Styles.textButton}>Solicitar</Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          </View>
          <View style={Styles.container}>
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
              <Text style={{ width: '25%', textAlign: 'center' }}>Valor R$</Text>
            </View>
            {(this.state.list && this.state.list.length > 0) ? (
              <FlatList
                data={this.state.list}
                renderItem={this.renderItemList}
                keyExtractor={(item) => item.id.toString()}
                style={{ flex: 1 }} />
            ) : (
              <View style={Styles.container}>
                <Text>{this.state.errorMessage}</Text>
              </View>
            )}
          </View>
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

export default connect(mapStateToProps)(WithdrawalRequestPage);
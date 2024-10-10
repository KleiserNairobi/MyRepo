import React from 'react';
import { connect } from 'react-redux';
import {
  View,
  KeyboardAvoidingView,
  Text,
  Image,
  TextInput,
  TouchableOpacity
} from 'react-native';
import { Item } from 'native-base';

import Styles from '../../assets/scss/styles';
import { NotificationAlert } from '../../components/general/alerts';
import { TextInputMask } from 'react-native-masked-text';
import ValidationComponent from 'react-native-form-validator';
import { 
  deliveryInitialStateAction,
  paymentCardAction, 
  statusPaymentAction 
} from '../../store/slices/deliverySlice';
import { formatNumber, removeMask } from '../../components/general/converter';
import ListErrors from '../../components/general/listErrors';

import API from '../../services/api';

const typeIconDefault = "MaterialCommunityIcons";

class InsertCardDataPage extends ValidationComponent {
  constructor(props) {
    super(props);
    this.errors = [];
    this.deviceLocale = "ptBR";
    this.state = {
      title: 'AGUARDE...',
      text: 'Estamos consultando as bandeiras de cartões disponíveis',
      token: this.props.configuracoes.token,
      pessoa: this.props.usuario.pessoa,
      entrega: this.props.entrega,
      agendamento: (this.props.entrega && this.props.entrega.agendamento) ? this.props.entrega.agendamento : null,
      showBtnCancel: false,
      tokenAccessGateway: (this.props.entrega.gatewayPagamento) ? this.props.entrega.gatewayPagamento.token : null,
      cardholderName: '',
      cardholderEmail: '',
      cardholderDocument: '',
      cardNumber: '',
      cardSecurityCode: '',
      cardExpirationMonth: '',
      cardExpirationYear: '',
      installments: 1,
      paymentMethods: [],
      paymentMethod: null
    }
  }

  componentDidMount() {
    if (this.state.tokenAccessGateway) {
      this.getPaymentMethods();
    } else {
      this.btnReturn();
    }
  }

  btnReturn = () => {
    this.props.navigation.navigate('ChooseCardGateway');
  }

  btnNext = () => {
    this.validate({
      metodoPagamento: { required: true },
      cardNumber: { required: true },
      cardExpirationMonth: { required: true, minlength: 2, maxlength: 2 },
      cardExpirationYear: { required: true, minlength: 4, maxlength: 4 },
      cardSecurityCode: { required: true, minlength: 3, maxlength: 3 },
      cardholderName: { required: true },
      //cardholderEmail: { email: true, required: true },
      //cardholderDocument: { required: true },
    });

    if (this.isFormValid()) {
      // Calculando valor total do percurso
      let totalPercurso = parseFloat(this.state.entrega.valorPercurso) - parseFloat(this.state.entrega.valorDesconto);

      // Dados para registro no Webservice
      let registerData = {
        idPessoa: this.state.pessoa.id,
        idGateway: this.state.entrega.gatewayPagamento.id,
        idPagamento: this.state.entrega.pagamentoId,
        numeroCartao: removeMask(this.state.cardNumber),
        mesVencimento: parseInt(this.state.cardExpirationMonth, 10),
        anoVencimento: parseInt(this.state.cardExpirationYear, 10),
        codigoSeguranca: this.state.cardSecurityCode,
        nomeTitularCartao: this.state.cardholderName,
        //emailTitularCartao: this.state.cardholderEmail,
        //cpfTitularCartao: this.state.cardholderDocument,
        valorProduto: this.state.entrega.valorProduto,
        valorEntrega: totalPercurso,
        parcelas: 1,
        metodoPagamento: this.state.paymentMethod
      };

      // Processando pagamento com cartao
      API({ token: this.state.token })
        .post('pagamentos/checkout', registerData)
        .then(async res => {
          if (res.data && res.data.status == 'approved') {
            // Registrando os dados do cartão na Store
            await this.props.paymentCardAction({
              cartao: res.data
            });

            // Registra a alteração de status do pagamento para AUTORIZADO
            await this.registerStatusPayment('A');

            // Redirecionamento
            if (this.state.agendamento && this.state.agendamento.id) {
              // Apagando dados da entrega na Store, antes do redirecionamento
              await this.props.deliveryInitialStateAction();

              // Para tela de conclusao de agendamento
              this.props.navigation.push('FinalizedSchedule');
            } else {
              // Para buscar o entregador
              this.props.navigation.push('FindDeliveryman');
            }
          } else {
            this.setState({
              showBtnCancel: true
            });

            // Registra a alteração de status do pagamento para NEGADO
            this.registerStatusPayment('N');

            NotificationAlert(
              'Pagamento não aprovado. Informe outro cartão '+
              'ou escolha cancelar a solicitação de entrega.', 'Erro');
          }
        })
        .catch(error => {
          if (error && error.response && error.response.data) {
            NotificationAlert(ListErrors(error.response.data));
          } else {
            NotificationAlert(
              'Ocorreu um erro durante o registro do pagamento em '+
              'nosso sistema. Entre em contato com nosso suporte '+
              'para obter mais detalhes.', 'Erro');
          }
        });
    } else {
      NotificationAlert(this.getErrorMessages());
    }
  }

  btnCancel = () => {
    if (this.state.agendamento && this.state.agendamento.id) {
      // Cancelando agendamentos
      API({ token: this.state.token })
        .put(`agendamentos/${this.state.agendamento.id}/cancela?tipo=T`)
        .then(res => {
          if (res && res.data) {
            this.setState({
              title: 'AGUARDE...',
              text: 'Cancelando agendamento'
            }, async () => {
              // Apagando dados da entrega da Store
              await this.props.deliveryInitialStateAction();

              this.props.navigation.push('Solicitation');
            });
          }
        })
        .catch(error => {
          if (error && error.response && error.response.data) {
            NotificationAlert(ListErrors(error.response.data));
          } else {
            NotificationAlert('Não foi possível cancelar o agendamento');
          }
        });

    } else if (this.state.entrega && this.state.entrega.id) {
      // Alterando status da entrega para CANCELADA
      let registerData = {
        entrega: { id: this.state.entrega.id },
        status: 'CA'
      }
      API({ token: this.state.token })
        .post(`entregas-status`, registerData)
        .then(res => {
          if (res && res.data) {
            this.setState({
              title: 'AGUARDE...',
              text: 'Cancelando a sua solicitação de entrega'
            }, async () => {
              // Apagando dados da entrega da Store
              await this.props.deliveryInitialStateAction();

              this.props.navigation.push('Solicitation');
            });
          }
        })
        .catch(error => {
          if (error && error.response && error.response.data) {
            NotificationAlert(ListErrors(error.response.data));
          } else {
            NotificationAlert('Não foi possível cancelar a entrega');
          }
        });
    }
  }

  registerStatusPayment = async (statusPayment) => {
    let idPayment = this.state.entrega.pagamentoId;

    await API({ token: this.state.token })
      .post('pagamentos-status', {
        pagamento: { 
          id: idPayment 
        },
        status: statusPayment
      })
      .then(res => {
        if (res && res.data) {
          // Registra alteracao de Status do Pagamento na Store
          this.props.statusPaymentAction({
            statusPagamento: statusPayment,
            pagamentoId: idPayment
          });
        } else {
          NotificationAlert('Não foi possível alterar a situação do pagamento', 'Erro');
        }
      })
      .catch(error => { 
        if (error && error.response) {
          NotificationAlert(ListErrors(error.response.data));
        } else {
          NotificationAlert('Ocorreu um erro durante o processo');
        }
      });
  }

  getPaymentMethods = () => {
    var listPaymentMethods = [];

    API({ token: this.state.tokenAccessGateway })
      .get('https://api.mercadopago.com/v1/payment_methods/')
      .then(res => {
        res.data.map((paymentMethodCurrent) => {
          if (paymentMethodCurrent.payment_type_id == 'credit_card'
            && paymentMethodCurrent.status == 'active') {
            listPaymentMethods.push({
              "id": paymentMethodCurrent.id,
              "name": paymentMethodCurrent.name,
              "secure_thumbnail": paymentMethodCurrent.secure_thumbnail,
              "thumbnail": paymentMethodCurrent.thumbnail
            });
          }
        });
        this.setState({ paymentMethods: listPaymentMethods });
      })
      .catch(error => {
        NotificationAlert('Não foi possível obter as bandeiras de cartões', 'Erro');
      });
  }

  validateInput = (input, valueInput) => {
    switch (input) {
      case 'paymentMethod': this.setState({ paymentMethod: valueInput }); break;
      case 'cardholderName': this.setState({ cardholderName: valueInput }); break;
      case 'cardholderEmail': this.setState({ cardholderEmail: valueInput }); break;
      case 'cardholderDocument': this.setState({ cardholderDocument: valueInput }); break;
      case 'cardNumber': this.setState({ cardNumber: valueInput }); break;
      case 'cardExpirationMonth': this.setState({ cardExpirationMonth: valueInput }); break;
      case 'cardExpirationYear': this.setState({ cardExpirationYear: valueInput }); break;
      case 'cardSecurityCode': this.setState({ cardSecurityCode: valueInput }); break;
    }
  }

  render() {
    let editableInput = false;
    let issuerInput = 'visa-or-mastercard';
    if (this.state.paymentMethod != null) {
      editableInput = true;
      if (this.state.paymentMethod == 'amex') {
        issuerInput = 'amex';
      }
    }

    return (
      <KeyboardAvoidingView behavior="height" style={[Styles.body, Styles.whiteBg]}>
        <View style={Styles.contentContainer}>
          {(!this.state.paymentMethods) ? (
            <View style={[Styles.container, Styles.textBox]}>
              <Icon
                type={typeIconDefault}
                name='card-search-outline'
                style={[Styles.iconButton, { fontSize: 60 }]} />
              <Text style={[Styles.fontBoxDefault, Styles.font16]}>{this.state.title}</Text>
              <Text style={Styles.fontBoxDefault, { textAlign: 'center' }}>{this.state.text}</Text>
            </View>
          ) : (
              <View style={Styles.formContainer}>
                <View>
                  <Text>SELECIONE A BANDEIRA DO CARTÃO</Text>
                </View>
                <View style={Styles.horizontalContainer}>
                  {this.state.paymentMethods.map((item, key) => {
                    let styleBox = {}
                    if (this.state.paymentMethod != null
                      && this.state.paymentMethod == item.id) {
                      styleBox = [Styles.yellowLightBg];
                    }
                    return (
                      <TouchableOpacity
                        key={key}
                        style={styleBox}
                        onPress={() => this.validateInput('paymentMethod', item.id)}>
                        <Image
                          style={{ ...Styles.imageBrand, width: 49, height: 17 }}
                          source={{ uri: item.secure_thumbnail }} />
                      </TouchableOpacity>)
                  })}
                </View>
                <View>
                  <Item>
                    <TextInputMask
                      ref="cardNumber"
                      type={'credit-card'}
                      options={{
                        obfuscated: false,
                        issuer: issuerInput
                      }}
                      placeholder="NÚMERO DO CARTÃO"
                      placeholderLabel="NÚMERO DO CARTÃO"
                      placeholderTextColor="#575757"
                      style={Styles.inputText}
                      value={this.state.cardNumber}
                      editable={editableInput}
                      onChangeText={valueInput => this.validateInput('cardNumber', valueInput)} />
                  </Item>
                  <View style={Styles.horizontalContainer}>
                    <Text style={[Styles.inputText, { width: '33%' }]}>VALIDADE </Text>
                    <Item style={[Styles.horizontalContainer, { width: '66%' }]}>
                      <TextInputMask
                        ref="cardExpirationMonth"
                        type={'only-numbers'}
                        placeholder="MM"
                        placeholderLabel="MM"
                        placeholderTextColor="#575757"
                        maxLength={2}
                        style={[Styles.inputText, { width: '50%' }]}
                        value={this.state.cardExpirationMonth}
                        onChangeText={valueInput => this.validateInput('cardExpirationMonth', valueInput)} />
                      <TextInputMask
                        ref="cardExpirationYear"
                        type={'only-numbers'}
                        placeholder="AAAA"
                        placeholderLabel="AAAA"
                        placeholderTextColor="#575757"
                        maxLength={4}
                        style={[Styles.inputText, { width: '50%' }]}
                        value={this.state.cardExpirationYear}
                        onChangeText={valueInput => this.validateInput('cardExpirationYear', valueInput)} />
                    </Item>
                  </View>
                  <Item>
                    <TextInputMask
                      ref="cardSecurityCode"
                      type={'only-numbers'}
                      placeholder="CÓDIGO DE SEGURANÇA"
                      placeholderLabel="CÓDIGO DE SEGURANÇA"
                      placeholderTextColor="#575757"
                      maxLength={3}
                      style={Styles.inputText}
                      value={this.state.cardSecurityCode}
                      onChangeText={valueInput => this.validateInput('cardSecurityCode', valueInput)} />
                  </Item>
                  <Item>
                    <TextInput
                      ref="cardholderName"
                      placeholder="TITULAR DO CARTÃO"
                      placeholderLabel="TITULAR DO CARTÃO"
                      placeholderTextColor="#575757"
                      maxLength={60}
                      style={Styles.inputText}
                      value={this.state.cardholderName}
                      onChangeText={valueInput => this.validateInput('cardholderName', valueInput)} />
                  </Item>
                  <Item>
                    <TextInput
                      ref="cardholderEmail"
                      placeholder="E-MAIL DO TITULAR"
                      placeholderLabel="E-MAIL DO TITULAR"
                      placeholderTextColor="#575757"
                      autoCapitalize="none"
                      style={Styles.inputText}
                      value={this.state.email}
                      onChangeText={valueInput => this.validateInput('cardholderEmail', valueInput)} />
                  </Item>
                  <Item>
                    <TextInputMask
                      ref="cardholderDocument"
                      type={'cpf'}
                      placeholder="CPF DO TITULAR"
                      placeholderLabel="CPF DO TITULAR"
                      placeholderTextColor="#575757"
                      maxLength={14}
                      style={Styles.inputText}
                      value={this.state.cardholderDocument}
                      onChangeText={valueInput => this.validateInput('cardholderDocument', valueInput)} />
                  </Item>
                </View>
              </View>
            )}
        </View>
        <View style={Styles.container}>
          <TouchableOpacity
            style={[Styles.largeBlockButton, Styles.m10]}
            onPress={this.btnNext}>
            <Text style={Styles.textButton}>Realizar Pagamento</Text>
          </TouchableOpacity>
          {(this.state.showBtnCancel === true) ? (
            <TouchableOpacity
              style={[Styles.largeBlockButton, Styles.m10]}
              onPress={this.btnCancel}>
              <Text style={Styles.textButton}>CANCELAR ENTREGA</Text>
            </TouchableOpacity>
          ) : null}
        </View>
      </KeyboardAvoidingView >
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

const mapDispatchToProps = { 
  deliveryInitialStateAction,
  paymentCardAction,
  statusPaymentAction
}

export default connect(mapStateToProps, mapDispatchToProps)(InsertCardDataPage);
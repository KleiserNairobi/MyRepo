import React from 'react';
import { connect } from 'react-redux';
import {
  View,
  KeyboardAvoidingView,
  Text,
  TextInput,
  TouchableOpacity,
  BackHandler
} from 'react-native';
import { Item, Icon } from 'native-base';

import Styles from '../../assets/scss/styles';
import { NotificationAlert } from '../../components/general/alerts';
import { TextInputMask } from 'react-native-masked-text';
import {
  deliveryDiscountAction,
  deliveryProductsValuesAction,
  deliveryPaymentTypeAction,
  deliveryRouteValueAction,
  deliveryTotalValueAction
} from '../../store/slices/deliverySlice';
import { formatNumber } from '../../components/general/converter';
import ListErrors from '../../components/general/listErrors';

import API from '../../services/api';

const typeIconDefault = "MaterialCommunityIcons";

class InsertDeliveryExtraDataPage extends React.Component {
  state = {
    token: this.props.configuracoes.token,
    pessoa: this.props.usuario.pessoa,
    entrega: this.props.entrega,
    agendamento: this.props.entrega.agendamento ? this.props.entrega.agendamento : null,
    codigoDesconto: null,
    valorPercurso: this.props.entrega.valorPercurso,
    descontoId: this.props.entrega.descontoId ? this.props.entrega.descontoId : null,
    valorDesconto: this.props.entrega.valorDesconto ? this.props.entrega.valorDesconto : 0,
    valorProduto: this.props.entrega.valorProduto ? this.props.entrega.valorProduto : 0,
    total: this.props.entrega.total,
    tipoPagamento: this.props.entrega.tipoPagamento ? this.props.entrega.tipoPagamento : null,
    inputValorProduto: null,
    showBtnFormaPagamentoDinheiro: true,
    showBtnFormaPagamentoCartao: true
  }

  componentDidMount() {
    // Verificando se o pagamento eh de um agendamento
    if (this.state.agendamento && this.state.agendamento.id) {
      this.setState({
        showBtnFormaPagamentoDinheiro: false
      });
    }

    // Adicionando evento para o botão voltar do celular
    BackHandler.addEventListener('hardwareBackPress', () => {
      this.props.navigation.push('Solicitation');
      return true;
    });
  }

  btnNext = async () => {
    // Calculando valor da entrega/agendamento
    await this.calculateTotal();

    // Redirecionamento
    this.props.navigation.push('RegisterPayment');
  }

  calculateTotal = async () => {
    // Retirando máscara do Valor do(s) Produto(s)
    let atualValorProduto = 0;
    if (this.state.inputValorProduto) {
      atualValorProduto = this.state.inputValorProduto.getRawValue();
    }

    // Registrando o valor total do(s) produto(s)
    await this.props.deliveryProductsValuesAction({
      valorProduto: atualValorProduto
    });

    // Calculando total da entrega
    let totalEntrega = parseFloat(this.state.valorPercurso);
    if (parseFloat(atualValorProduto)) {
      totalEntrega = parseFloat(totalEntrega) + parseFloat(atualValorProduto);
    }

    // Verificando se o pagamento eh de um agendamento
    if (this.state.agendamento && this.state.agendamento.id) {
      // Aplicando desconto no agendamento, caso o usuario tenha informado cupom de desconto
      totalEntrega = (totalEntrega * parseInt(this.state.agendamento.qtdeRepeticao)) - parseFloat(this.state.valorDesconto);

      // Registrando o novo valor do percurso do agendamento na Store
      await this.props.deliveryRouteValueAction({
        valorPercurso: (parseFloat(this.state.valorPercurso) * parseInt(this.state.agendamento.qtdeRepeticao))
      });

    } else if (this.state.valorDesconto) {
      // Aplicando desconto na entrega, caso o usuario tenha informado cupom de desconto
      totalEntrega = totalEntrega - parseFloat(this.state.valorDesconto);
    }

    // Organizando casas decimais do total da Entrega
    totalEntrega = formatNumber(totalEntrega, 2, ".", "");

    // Registrando novo valor total da entrega na Store
    await this.props.deliveryTotalValueAction({
      total: totalEntrega
    });

    // Armazenando dados
    this.setState({
      valorProduto: atualValorProduto,
      total: totalEntrega
    });
  }

  validateInput = (input, valueInput) => {
    switch (input) {
      case 'codigoDesconto':
        this.setState({ codigoDesconto: valueInput });
        break;
      case 'valorProduto':
        this.setState({ valorProduto: valueInput });
        break;
      case 'tipoPagamento':
        this.setState({
          tipoPagamento: valueInput
        }, () => {
          this.props.deliveryPaymentTypeAction({
            tipoPagamento: this.state.tipoPagamento
          });
        });
        break;
    }
  }

  findVoucher = async () => {
    if (this.state.codigoDesconto) {
      await API({ token: this.state.token })
        .get(`descontos/validar/${this.state.pessoa.id}/${this.state.codigoDesconto}`)
        .then(res => {
          if (res.data) {
            let pisoDesconto = res.data.piso;
            if (this.state.valorPercurso >= pisoDesconto) {
              this.setState({
                descontoId: res.data.id,
                valorDesconto: res.data.valor
              }, () => {
                // Registrando desconto
                this.props.deliveryDiscountAction({
                  descontoId: this.state.descontoId,
                  valorDesconto: this.state.valorDesconto
                });
              });
            } else {
              NotificationAlert('Não foi possível aplicar o desconto. ' +
                'Valor mínimo deve ser R$ ' + formatNumber(pisoDesconto));
            }
          } else {
            NotificationAlert('Código de desconto não encontrado');
          }
        })
        .catch(error => {
          if (error.response && error.response.data) {
            NotificationAlert(ListErrors(error.response.data));
          } else {
            NotificationAlert('Ocorreu um erro ao consultar o cupom de desconto');
          }
        });
    } else {
      NotificationAlert('Informe um código de desconto');
    }
  }

  render() {
    return (
      <KeyboardAvoidingView behavior="height" style={[Styles.body, Styles.whiteBg]}>
        <View style={[Styles.p10, { alignItems: 'flex-start' }]}>
          {(this.state.descontoId > 0) ? (
            <View style={{ width: '100%', marginTop: 10 }}>
              <View>
                <Text>Desconto aplicado: </Text>
                <Text style={[Styles.font20, { textAlign: 'left' }]}>R$ {formatNumber(this.state.valorDesconto)}</Text>
              </View>
            </View>
          ) : (
              <View style={{ width: '100%', marginTop: 10 }}>
                <View>
                  <Text>Informe o código de desconto, caso possua:</Text>
                </View>
                <Item>
                  <View style={{ width: '60%' }}>
                    <TextInput
                      ref="codigoDesconto"
                      placeholder="CÓDIGO DE DESCONTO"
                      placeholderLabel="CÓDIGO DE DESCONTO"
                      placeholderTextColor="#575757"
                      maxLength={10}
                      style={Styles.inputText}
                      value={this.state.codigoDesconto}
                      onChangeText={valueInput => this.validateInput('codigoDesconto', valueInput)} />
                  </View>
                  <View style={{ width: '40%' }}>
                    <TouchableOpacity
                      style={[Styles.smallLineButton, Styles.m10]}
                      onPress={this.findVoucher}>
                      <Text style={Styles.textButton}>Aplicar</Text>
                    </TouchableOpacity>
                  </View>
                </Item>
              </View>
            )}

          {(this.state.pessoa && this.state.pessoa.parceiro == true) ? (
            <View style={{ width: '100%', marginTop: 10 }}>
              <View>
                <Text>Informe o valor total do(s) produto(s) desta entrega:</Text>
              </View>
              <Item>
                <TextInputMask
                  ref={(ref) => this.state.inputValorProduto = ref}
                  type={'money'}
                  placeholder="VALOR PRODUTO"
                  placeholderLabel="VALOR PRODUTO"
                  placeholderTextColor="#575757"
                  style={Styles.inputText}
                  value={this.state.valorProduto}
                  onChangeText={valueInput => this.validateInput('valorProduto', valueInput)} />
              </Item>
            </View>
          ) : null}

          {(this.state.total > 0) ? (
            <View style={{ width: '100%', marginTop: 10 }}>
              <View>
                <Text>Total à pagar: </Text>
                <Text style={[Styles.font20, { textAlign: 'left' }]}>R$ {formatNumber(this.state.total)}</Text>
              </View>
            </View>
          ) : null}
        </View>

        <View style={[Styles.container, Styles.p10, { alignItems: 'flex-start' }]}>
          <View style={{ marginBottom: 10 }}>
            <Text>Informe a forma de pagamento:</Text>
          </View>
          <View style={[Styles.horizontalContainer, { width: '100%' }]}>
            {(this.state.showBtnFormaPagamentoDinheiro === true) ? (
              <TouchableOpacity
                style={{ width: '50%', alignItems: 'center' }}
                onPress={() => this.validateInput('tipoPagamento', 'D')}>
                {(this.state.tipoPagamento && this.state.tipoPagamento == 'D') ? (
                  <Icon
                    type="FontAwesome"
                    name='money'
                    style={[Styles.iconButton, Styles.yellowColor, { fontSize: 60 }]} />
                ) : (
                    <Icon
                      type="FontAwesome"
                      name='money'
                      style={[Styles.iconButton, { fontSize: 60 }]} />
                  )}
                <Text style={Styles.font16}>Dinheiro</Text>
              </TouchableOpacity>
            ) : null}
            {(this.state.showBtnFormaPagamentoCartao === true) ? (
              <TouchableOpacity
                style={{ width: '50%', alignItems: 'center' }}
                onPress={() => this.validateInput('tipoPagamento', 'CC')}>
                {(this.state.tipoPagamento && this.state.tipoPagamento == 'CC') ? (
                  <Icon
                    type={typeIconDefault}
                    name='credit-card'
                    style={[Styles.iconButton, Styles.yellowColor, { fontSize: 60 }]} />
                ) : (
                    <Icon
                      type={typeIconDefault}
                      name='credit-card'
                      style={[Styles.iconButton, { fontSize: 60 }]} />
                  )}
                <Text style={Styles.font16}>Cartão de Crédito</Text>
              </TouchableOpacity>
            ) : null}
          </View>
        </View>
        <View style={Styles.containerButtonBottom}>
          <TouchableOpacity
            style={[Styles.largeBlockButton, Styles.m10]}
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
    usuario: state.usuario,
    configuracoes: state.configuracoes,
    entrega: state.entrega,
  }
}

const mapDispatchToProps = {
  deliveryDiscountAction,
  deliveryProductsValuesAction,
  deliveryPaymentTypeAction,
  deliveryRouteValueAction,
  deliveryTotalValueAction
}

export default connect(mapStateToProps, mapDispatchToProps)(InsertDeliveryExtraDataPage);
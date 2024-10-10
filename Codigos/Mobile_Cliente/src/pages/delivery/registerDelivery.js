import React from 'react';
import { connect } from 'react-redux';
import { View, KeyboardAvoidingView, Text, TouchableOpacity } from 'react-native';
import { Container, Icon } from 'native-base';

import Styles from '../../assets/scss/styles';
import { NotificationAlert } from '../../components/general/alerts';
import { deliveryRegisterAction } from '../../store/slices/deliverySlice';
import { formatDateCurrent } from '../../components/general/converter';
import ListErrors from '../../components/general/listErrors';
import API from '../../services/api';

const typeIconDefault = "MaterialCommunityIcons";

class RegisterDeliveryPage extends React.Component {
  state = {
    ...this.props,
    token: this.props.configuracoes.token,
    title: '',
    text: '',
    titleLoading: 'AGUARDE...',
    textLoading: 'Estamos registrando sua entrega',
    titleSuccess: 'ENTREGA REGISTRADA',
    textSuccess: 'Sua entrega foi registrado com sucesso, continue para a realização do pagamento',
    titleError: 'ERRO',
    textError: '',
  }

  componentDidMount() {
    this.setState({
      title: this.state.titleLoading,
      text: this.state.textLoading
    });

    // Registrando entrega no Webservice
    if (!this.state.entrega.id) {
      this.registerDelivery();
      // Adicionando funcionalidade para se o usuario retorna para essa tela, 
      // redirecionar ele para tela de solicitacao
      this.props.navigation.addListener('focus', () => {
        // Verificando se a entrega possui ID
        if (this.state.entrega && this.state.entrega.id) {
          this.props.navigation.push('Solicitation');
        }
        return true;
      });
    } else {
      // Adicionando mensagem informando que a entrega já foi registrada
      this.setState({
        title: this.state.titleSuccess,
        text: this.state.textSuccess
      }, () => {
        // Redireciona para a tela de informações extras
        this.btnNext();
      });
    }
  }

  btnNext = () => {
    this.props.navigation.push('InsertDeliveryExtraData');
  }

  registerDelivery = () => {
    // Obtendo data atual
    let dateNow = formatDateCurrent('database');

    // Dados para registro no Webservice
    let registerData = {
      cliente: this.state.usuario.pessoa.id,
      entregador: null,
      agendamento: null,
      tipoVeiculo: this.state.entrega.tipoVeiculo,
      data: dateNow,
      deslocamento: this.state.entrega.deslocamento,
      distancia: this.state.entrega.distancia,
      previsao: this.state.entrega.previsao,
      statusEntrega: 'NI',
      listaEnderecos: [
        {
          "tipoEndereco": "O",
          "cep": this.state.entrega.origem.cep,
          "logradouro": this.state.entrega.origem.logradouro,
          "numero": this.state.entrega.origem.numero,
          "complemento": this.state.entrega.origem.complemento,
          "bairro": this.state.entrega.origem.bairro,
          "referencia": this.state.entrega.origem.referencia,
          "municipio": {
            id: this.state.entrega.origem.cidadeId
          },
          "contato": this.state.entrega.origem.contato,
          "telefone": this.state.entrega.origem.telefone,
          "tarefa": this.state.entrega.origem.tarefa,
          "adicionarFavorito": this.state.entrega.origem.favorito
        },
        {
          "tipoEndereco": "D",
          "cep": this.state.entrega.destino.cep,
          "logradouro": this.state.entrega.destino.logradouro,
          "numero": this.state.entrega.destino.numero,
          "complemento": this.state.entrega.destino.complemento,
          "bairro": this.state.entrega.destino.bairro,
          "referencia": this.state.entrega.destino.referencia,
          "municipio": {
            id: this.state.entrega.destino.cidadeId
          },
          "contato": this.state.entrega.destino.contato,
          "telefone": this.state.entrega.destino.telefone,
          "tarefa": this.state.entrega.destino.tarefa,
          "adicionarFavorito": this.state.entrega.destino.favorito
        }
      ]
    };

    API({ token: this.state.token })
      .post('entregas', registerData)
      .then(async res => {
        if (res && res.data) {
          // Registrando dados na Store
          await this.props.deliveryRegisterAction(res.data);

          this.setState({
            title: this.state.titleSuccess,
            text: this.state.textSuccess,
            entrega: {
              ...this.state.entrega,
              id: res.data.id
            }
          }, () => {
            // Redirecionando automaticamente para proxima tela
            this.btnNext();
          });
        } else {
          NotificationAlert('Não foi possível registrar seus dados. Tente novamente.');
        }
      })
      .catch(error => {
        this.setState({
          title: this.state.titleError,
          text: 'Não foi possível registrar a entrega'
        });
        if (error && error.response && error.response.data) {
          NotificationAlert(ListErrors(error.response.data));
        }
      });
  }

  render() {
    return (
      <KeyboardAvoidingView behavior="height" style={[Styles.body, Styles.whiteBg]}>
        <View style={Styles.contentContainer}>
          <View style={[Styles.container, Styles.textBox]}>
            <Icon
              type={typeIconDefault}
              name='map-clock-outline'
              style={[Styles.iconButton, { fontSize: 60 }]} />
            <Text style={[Styles.fontBoxDefault, Styles.font16]}>{this.state.title}</Text>
            <Text style={Styles.fontBoxDefault, { textAlign: 'center' }}>{this.state.text}</Text>
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

const mapDispatchToProps = { deliveryRegisterAction }

export default connect(mapStateToProps, mapDispatchToProps)(RegisterDeliveryPage);
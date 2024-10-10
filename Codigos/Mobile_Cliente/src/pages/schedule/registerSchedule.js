import React from 'react';
import { connect } from 'react-redux';
import { View, KeyboardAvoidingView, Text, TouchableOpacity } from 'react-native';
import { Container, Icon } from 'native-base';

import Styles from '../../assets/scss/styles';
import { NotificationAlert } from '../../components/general/alerts';
import { formatDateCurrent } from '../../components/general/converter';
import {
  scheduleRegisterAction
} from '../../store/slices/deliverySlice';
import ListErrors from '../../components/general/listErrors';
import API from '../../services/api';

const typeIconDefault = "MaterialCommunityIcons";

class RegisterSchedulePage extends React.Component {
  state = {
    ...this.props,
    agendamento: {
      id: (this.props.entrega.agendamento && this.props.entrega.agendamento.id) ? this.props.entrega.agendamento.id : null,
      cliente: this.props.usuario.pessoa.id,
      entregador: (this.props.entrega.agendamento && this.props.entrega.agendamento.entregador) ? this.props.entrega.agendamento.entregador : null,
      tipoAgendamento: this.props.entrega.agendamento.tipoAgendamento,
      dataExecucao: this.props.entrega.agendamento.dataExecucao,
      horaExecucao: this.props.entrega.agendamento.horaExecucao,
      qtdeRepeticao: this.props.entrega.agendamento.qtdeRepeticao,
      tipoVeiculo: this.props.entrega.tipoVeiculo,
      tipoPagamento: null,
      deslocamento: this.props.entrega.deslocamento,
      distancia: this.props.entrega.distancia,
      previsao: this.props.entrega.previsao,
      valorKm: null,
      valorProduto: null,
      descontoId: null,
      valorDesconto: null,
      total: null,
      realizado: false,
      ativo: true
    },
    token: this.props.configuracoes.token,
    entrega: this.props.entrega,
    title: '',
    text: '',
    titleLoading: 'AGUARDE...',
    textLoading: 'Estamos registrando seu agendamento',
    titleSuccess: 'PARABÉNS',
    textSuccess: 'Seu agendamento foi registrado com sucesso',
    titleError: 'ERRO',
    textError: '',
  }

  componentDidMount() {
    this.setState({
      title: this.state.titleLoading,
      text: this.state.textLoading
    });

    // Registrando agendamento no Webservice
    if (this.state.agendamento && this.state.agendamento.id < 1) {
      this.registerSchedule();
      // Adicionando funcionalidade para se o usuario retorna para essa tela, 
      // redirecionar ele para tela de solicitacao
      this.props.navigation.addListener('focus', () => {
        // Verificando se a entrega possui ID
        if (this.state.agendamento 
          && this.state.agendamento.id) {
          this.props.navigation.push('Solicitation');
        }
        return true;
      });
    } else {
      // Adicionando mensagem informando que o agendamento já foi registrado
      this.setState({
        title: this.state.titleSuccess,
        text: this.state.textSuccess
      }, () => {
        // Redireciona para a tela de informações extras para pagamento
        this.btnNext();
      });
    }
  }

  btnNext = () => {
    if (this.state.agendamento && this.state.agendamento.id) {
      this.props.navigation.navigate('InsertDeliveryExtraData');
    } else {
      NotificationAlert('Não é possível avançar, pois não foi registrado o agendamento.');
    }
  }

  registerSchedule = () => {
    // Dados para registro no Webservice
    let registerData = {
      cliente: this.state.agendamento.cliente,
      entregador: (this.state.agendamento.entregador) ? this.state.agendamento.entregador.id : null,
      tipoAgendamento: this.state.agendamento.tipoAgendamento,
      tipoVeiculo: this.state.agendamento.tipoVeiculo,
      deslocamento: this.state.agendamento.deslocamento,
      distancia: this.state.agendamento.distancia,
      previsao: this.state.agendamento.previsao,
      dataExecucao: this.state.agendamento.dataExecucao,
      horaExecucao: this.state.agendamento.horaExecucao + ':00',
      qtdeRepeticao: this.state.agendamento.qtdeRepeticao,
      realizado: this.state.agendamento.realizado,
      ativo: true,
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
      .post('agendamentos', registerData)
      .then(res => {
        if (res && res.data) {
          this.setState({
            title: this.state.titleSuccess,
            text: this.state.textSuccess,
            agendamento: res.data
          }, async () => {
            // Registrando agendamento na Store
            await this.props.scheduleRegisterAction({
              agendamento: this.state.agendamento
            });

            // Redirecionando para pagamento
            this.btnNext();
          });
        } else {
          NotificationAlert('Não foi possível registrar o agendamento. Tente novamente.');
        }
      })
      .catch(error => {
        this.setState({
          title: this.state.titleError,
          text: 'Não foi possível registrar o agendamento'
        });
      });
  }

  render() {
    return (
      <KeyboardAvoidingView style={Styles.body}>
        <Container>
          <View style={Styles.contentContainer}>
            <View style={[Styles.container, Styles.textBox]}>
              <Icon
                type={typeIconDefault}
                name='map-clock-outline' 
                style={[Styles.iconButton, { fontSize: 60 }]} />
              <Text style={[Styles.fontBoxDefault, Styles.font16]}>{this.state.title}</Text>
              <Text style={Styles.fontBoxDefault}>{this.state.text}</Text>
            </View>
          </View>
          <View style={Styles.containerButtonBottom}>
            <TouchableOpacity
              style={[Styles.largeBlockButton, Styles.m10]}
              onPress={this.btnNext}>
              <Text style={Styles.textButton}>PRÓXIMA</Text>
            </TouchableOpacity>
          </View>
        </Container>
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

const mapDispatchToProps = { scheduleRegisterAction }

export default connect(mapStateToProps, mapDispatchToProps)(RegisterSchedulePage);
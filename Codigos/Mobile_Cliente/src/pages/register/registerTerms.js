import React from 'react';
import { connect } from 'react-redux';
import { View, TouchableOpacity, KeyboardAvoidingView } from 'react-native';
import { Item, Textarea, CheckBox, Body, Text } from 'native-base';

import Styles from '../../assets/scss/styles';
import { NotificationAlert } from '../../components/general/alerts';
import Brand from '../../components/general/brand';
import ListErrors from '../../components/general/listErrors';
import API from '../../services/api';

class RegisterTermsPage extends React.Component {
  state = {
    usuario: this.props.usuario,
    pessoa: this.props.pessoa,
    endereco: this.props.endereco,
    termo: this.props.termo,
    aceitaTermo: false,
  }

  btnReturn = () => {
    if (this.state.pessoa && this.state.pessoa.tipo == 'J') {
      this.props.navigation.navigate('RegisterMarketSegment');
    } else {
      this.props.navigation.navigate('RegisterPassword');
    }
  }

  btnNext = () => {
    if (this.state.aceitaTermo === true) {

      // Dados para registro no Webservice
      let endPoint = 'registros/cliente-pf';
      let registerData = {
        nome: this.state.pessoa.nome,
        email: this.state.pessoa.email,
        telefone: this.state.pessoa.telefone,
        cpfCnpj: this.state.pessoa.cpfCnpj ? this.state.pessoa.cpfCnpj : null,
        cep: this.state.endereco.cep,
        logradouro: this.state.endereco.logradouro,
        numero: this.state.endereco.numero ? this.state.endereco.numero : 's/n',
        complemento: this.state.endereco.complemento ? this.state.endereco.complemento : 'nada consta',
        bairro: this.state.endereco.bairro,
        referencia: this.state.endereco.referencia ? this.state.endereco.referencia : null,
        municipio: this.state.endereco.cidade,
        estado: this.state.endereco.estado,
        senha: this.state.usuario.senha,
        latitude: null,
        longitude: null,
        parceiro: false,
        entregador: false
      };
      if (this.state.pessoa && this.state.pessoa.tipo == 'J') {
        endPoint = 'registros/cliente-pj';
        registerData = {
          ...registerData,
          nomeFantasia: this.state.pessoa.nomeFantasia ? this.state.pessoa.nomeFantasia : null,
          ramoAtividade: this.state.pessoa.ramoAtividade ? this.state.pessoa.ramoAtividade : null
        }
      }

      API().post(endPoint, registerData)
        .then(res => {
          if (res.data) {
            this.props.navigation.navigate('RegisterFinished');
          } else {
            NotificationAlert('Não foi possível registrar seus dados. Tente novamente.');
          }
        })
        .catch(error => {
          if (error.response && error.response.data) {
            NotificationAlert(ListErrors(error.response.data));
          } else {
            NotificationAlert('Erro ao registrar seus dados.');
          }
        });

    } else {
      NotificationAlert('É necessário aceitar o termo');
    }
  }

  validateInput = (input, valueInput) => {
    switch (input) {
      case 'aceitaTermo':
        if (this.state.aceitaTermo === true) {
          this.setState({ aceitaTermo: false });
        } else {
          this.setState({ aceitaTermo: true });
        }
        break;
    }
  }

  render() {
    return (
      <KeyboardAvoidingView style={Styles.body}>
        <Brand />
        <View style={Styles.contentContainer}>
          <View style={Styles.textBox}>
            <Text style={Styles.fontBoxDefault}>PARA ENCERRAR, VOCÊ PRECISA ESTAR DE ACORDO COM </Text>
            <Text style={Styles.fontBoxDefault}>OS NOSSOS TERMOS DE USO E POLÍTICA DE PRIVACIDADE</Text>
          </View>
          <View style={Styles.formContainer}>
            <Item>
              <Textarea style={Styles.textarea} rowSpan={7}>{this.state.termo}</Textarea>
            </Item>
            <Item style={[Styles.p10, { paddingHorizontal: 0, borderBottomWidth: 0 }]}>
              <CheckBox
                ref="aceitaTermo"
                color="black"
                checked={this.state.aceitaTermo}
                style={Styles.checkbox}
                onPress={valueInput => this.validateInput('aceitaTermo', valueInput)} />
              <TouchableOpacity
                onPress={valueInput => this.validateInput('aceitaTermo', !this.state.aceitaTermo)}>
                <Text style={[{ marginLeft: 15 }]}>Li e aceito os termos de condiçōes de uso</Text>
              </TouchableOpacity>
            </Item>
          </View>
          <TouchableOpacity
            style={Styles.largeButton}
            onPress={this.btnNext}>
            <Text style={Styles.textButton}>CONFIRMAR</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={Styles.smallButton}
            onPress={this.btnReturn}>
            <Text style={Styles.textButton}>VOLTAR</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    usuario: state.usuario,
    pessoa: state.pessoa,
    endereco: state.endereco,
    termo: state.configuracoes.termo,
    token: state.configuracoes.token
  }
}

export default connect(mapStateToProps)(RegisterTermsPage);
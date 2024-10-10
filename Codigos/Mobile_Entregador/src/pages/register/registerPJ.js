import React from 'react';
import { connect } from 'react-redux';
import { View, TouchableOpacity, KeyboardAvoidingView, Text, TextInput } from 'react-native';
import { StyleProvider, Item, Icon } from 'native-base';
import getTheme from '../../native-base-theme/components';
import material from '../../native-base-theme/variables/material';
import ValidationComponent from 'react-native-form-validator';

import Styles from '../../assets/scss/styles';
import { NotificationAlert } from '../../components/general/alerts';
import { TextInputMask } from 'react-native-masked-text';
import Brand from '../../components/general/brand';
import { personRegisterAction } from '../../store/slices/personSlice';

const typeIconDefault = "MaterialCommunityIcons";

class RegisterPjPage extends ValidationComponent {
  constructor(props) {
    super(props);
    this.errors = [];
    this.deviceLocale = "ptBR";
    this.state = {
      error: false,
      nome: props.pessoa.nome ? props.pessoa.nome : '',
      telefone: props.pessoa.telefone ? props.pessoa.telefone : '',
      email: props.pessoa.email ? props.pessoa.email : '',
      pessoa: props.pessoa
    }
  }

  btnReturn = () => {
    this.props.navigation.navigate('Register');
  }

  btnNext = () => {
    this.validate({
      nome: { minlength: 3, maxlength: 60, required: true },
      telefone: { minlength: 10, maxlength: 14, required: true },
      email: { email: true, required: true }
    });

    if (this.isFormValid()) {
      this.props.updatePerson({ 
        ...this.state.pessoa,
        nome: this.state.nome, 
        telefone: this.state.telefone, 
        email: this.state.email 
      });
      this.props.navigation.navigate('RegisterAddress');
    } else {
      NotificationAlert(this.getErrorMessages());
    }
  }

  validateInput = (input, valueInput) => {
    switch (input) {
      case 'nome': this.setState({ nome: valueInput }); break;
      case 'telefone': this.setState({ telefone: valueInput }); break;
      case 'email': this.setState({ email: valueInput }); break;
    }
  }

  render() {
    return (
      <StyleProvider style={getTheme(material)}>
        <KeyboardAvoidingView style={Styles.body}>
          <Brand />
          <View style={Styles.contentContainer}>
            <View style={Styles.textBox}>
              <Text style={Styles.fontBoxDefault}>PARA CONTINUAR, VOCÊ PRECISA FORNECER </Text>
              <Text style={Styles.fontBoxDefault}>ALGUMAS INFORMAÇŌES:</Text>
            </View>
            <View style={Styles.formContainer}>
              <Item>
                <Icon
                  type={typeIconDefault}
                  name="account-outline"
                  style={[Styles.font30, Styles.whiteColor]} />
                <TextInput
                  ref="nome"
                  placeholder="SUA RAZĀO SOCIAL"
                  placeholderLabel="SUA RAZĀO SOCIAL"
                  placeholderTextColor="#575757"
                  maxLength={60}
                  style={Styles.inputText}
                  value={this.state.nome}
                  onChangeText={valueInput => this.validateInput('nome', valueInput)} />
              </Item>
              <Item>
                <Icon
                  type={typeIconDefault}
                  name="phone-outline" 
                  style={[Styles.font30, Styles.whiteColor]} />
                <TextInputMask
                  ref="telefone"
                  type={'cel-phone'}
                  options={{
                    maskType: 'BRL',
                    withDDD: true,
                    dddMask: '(99)'
                  }}
                  placeholder="Nº DO SEU CELULAR"
                  placeholderLabel="Nº DO SEU CELULAR"
                  placeholderTextColor="#575757"
                  style={Styles.inputText}
                  value={this.state.telefone}
                  onChangeText={valueInput => this.validateInput('telefone', valueInput)} />
              </Item>
              <Item>
                <Icon
                  type={typeIconDefault}
                  name="email-outline" 
                  style={[Styles.font30, Styles.whiteColor]} />
                <TextInput
                  ref="email"
                  placeholder="SEU E-MAIL"
                  placeholderLabel="SEU E-MAIL"
                  placeholderTextColor="#575757"
                  autoCapitalize="none"
                  style={Styles.inputText}
                  value={this.state.email}
                  onChangeText={valueInput => this.validateInput('email', valueInput)} />
              </Item>
            </View>
            <TouchableOpacity
              style={Styles.largeButton}
              onPress={this.btnNext}>
              <Text style={Styles.textButton}>CONTINUAR</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={Styles.smallButton}
              onPress={this.btnReturn}>
              <Text style={Styles.textButton}>VOLTAR</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </StyleProvider>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    pessoa: state.pessoa
  }
}

const mapDispatchToProps = dispatch => {
  return {
    updatePerson: person => dispatch(personRegisterAction(person))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(RegisterPjPage);
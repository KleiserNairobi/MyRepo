import React from 'react';
import { connect } from 'react-redux';
import { View, TouchableOpacity, KeyboardAvoidingView, Text, TextInput } from 'react-native';
import { StyleProvider, Item } from 'native-base';
import getTheme from '../../native-base-theme/components';
import material from '../../native-base-theme/variables/material';
import ValidationComponent from 'react-native-form-validator';

import Styles from '../../assets/scss/styles';
import { NotificationAlert } from '../../components/general/alerts';
import Brand from '../../components/general/brand';
import { userPasswordRegisterAction } from '../../store/slices/userSlice';

class RegisterPasswordPage extends ValidationComponent {
  constructor(props) {
    super(props);
    this.errors = [];
    this.deviceLocale = "ptBR";
    this.state = {
      error: false,
      senha: props.senha ? props.senha : '',
      repeteSenha: '',
      pessoa: props.pessoa ? props.pessoa : null
    }
  }

  btnReturn = () => {
    this.props.navigation.navigate('RegisterAddress');
  }

  btnNext = () => {
    this.validate({
      senha: {  required: true, minlength: 6, maxlength: 6 },
      repeteSenha: { required: true, minlength: 6, maxlength: 6 },
    });

    if (this.state.senha !== this.state.repeteSenha) {
      NotificationAlert('As senhas informadas são diferentes');
    } else if (this.isFormValid()) {
      this.props.updateUserPassword({ senha: this.state.senha });
      if (this.state.pessoa && this.state.pessoa.tipo == 'J') {
        this.props.navigation.navigate('RegisterMarketSegment');
      } else {
        this.props.navigation.navigate('RegisterTerms');
      }
    } else {
      NotificationAlert(this.getErrorMessages());
    }
  }

  validateInput = (input, valueInput) => {
    switch (input) {
      case 'senha': this.setState({ senha: valueInput }); break;
      case 'repeteSenha': this.setState({ repeteSenha: valueInput }); break;
    }
  }

  render() {
    return (
      <StyleProvider style={getTheme(material)}>
        <KeyboardAvoidingView style={Styles.body}>
          <Brand />
          <View style={Styles.contentContainer}>
            <View style={Styles.textBox}>
              <Text style={Styles.fontBoxDefault}>CRIE UMA SENHA PARA O ACESSO AO APP.</Text>
              <Text style={Styles.fontBoxDefault}>NÃO USE NÚMEROS SEQUENCIAIS OU </Text>
              <Text style={Styles.fontBoxDefault}>DATAS DE ANIVERSÁRIO.</Text>
            </View>
            <View style={Styles.formContainer}>
              <Item>
                <TextInput
                  ref="senha"
                  secureTextEntry={true}
                  placeholder="SENHA"
                  placeholderLabel="SENHA"
                  placeholderTextColor="#575757"
                  keyboardType="numeric"
                  maxLength={6}
                  style={Styles.inputText}
                  value={this.state.senha}
                  onChangeText={valueInput => this.validateInput('senha', valueInput)} />
              </Item>
              <Item>
                <TextInput
                  ref="repeteSenha"
                  secureTextEntry={true}
                  placeholder="CONFIRME SUA SENHA"
                  placeholderLabel="CONFIRME SUA SENHA"
                  placeholderTextColor="#575757"
                  keyboardType="numeric"
                  maxLength={6}
                  style={Styles.inputText}
                  value={this.state.repeteSenha}
                  onChangeText={valueInput => this.validateInput('repeteSenha', valueInput)} />
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
    senha: state.usuario.senha,
    repeteSenha: state.usuario.senha,
    pessoa: state.pessoa
  }
}

const mapDispatchToProps = dispatch => {
  return {
    updateUserPassword: password => dispatch(userPasswordRegisterAction(password))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(RegisterPasswordPage);
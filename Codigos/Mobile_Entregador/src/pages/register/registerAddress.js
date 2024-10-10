import React from 'react';
import { connect } from 'react-redux';
import { View, TouchableOpacity, Text, TextInput } from 'react-native';
import { StyleProvider, Item } from 'native-base';
import getTheme from '../../native-base-theme/components';
import material from '../../native-base-theme/variables/material';
import ValidationComponent from 'react-native-form-validator';

import Styles from '../../assets/scss/styles';
import { NotificationAlert } from '../../components/general/alerts';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { TextInputMask } from 'react-native-masked-text';
import Brand from '../../components/general/brand';
import { formatCEP } from '../../components/general/converter';
import { addressRegisterAction } from '../../store/slices/addressSlice';
import API from '../../services/api';

class RegisterAddressPage extends ValidationComponent {
  constructor(props) {
    super(props);
    this.errors = [];
    this.deviceLocale = "ptBR";
    this.state = {
      error: false,
      token: props.configuracoes.token,
      cep: props.cep ? props.cep : '',
      logradouro: props.logradouro ? props.logradouro : '',
      numero: props.numero ? props.numero : '',
      complemento: props.complemento ? props.complemento : '',
      bairro: props.bairro ? props.bairro : '',
      referencia: props.referencia ? props.referencia : '',
      cidade: props.cidade ? props.cidade : '',
      cidadeId: props.cidadeId ? props.cidadeId : '',
      estado: props.estado ? props.estado : '',
      pessoa: props.pessoa ? props.pessoa : null
    }
  }

  btnReturn = () => {
    if (this.state.pessoa && this.state.pessoa.tipo == 'J') {
      this.props.navigation.navigate('RegisterPJ');
    } else {
      this.props.navigation.navigate('RegisterPF');
    }
  }

  btnNext = () => {
    this.validate({
      cep: { required: true, minlength: 8, maxLength: 9 },
      logradouro: { required: true },
      bairro: { required: true },
      cidade: { required: true },
      estado: { required: true, maxlength: 2 }
    });

    if (this.isFormValid()) {
      this.props.addressRegisterAction({ ...this.state });
      this.props.navigation.navigate('RegisterPassword');
    } else {
      NotificationAlert(this.getErrorMessages());
    }
  }

  buscaCep = (cep) => {
    API().get(`enderecos/buscar-endereco-por-cep/?cep=${cep}`)
      .then(res => {
        if (res.data) {
          this.setState({
            cep: res.data.cep ? formatCEP(res.data.cep, 'mask') : '',
            logradouro: res.data.logradouro ? res.data.logradouro : '',
            bairro: res.data.bairro ? res.data.bairro : '',
            cidade: res.data.cidade ? res.data.cidade : '',
            cidadeId: res.data.cidadeId ? res.data.cidadeId : '',
            estado: res.data.estado ? res.data.estado : '',
          });
        } else {
          NotificationAlert('Não foi possível obter a localização pelo CEP');
        }
      })
      .catch(error => {
        NotificationAlert('Erro ao obter localização pelo CEP. Código: ' + error.response.status);
      });
  }

  validateInput = (input, valueInput) => {
    switch (input) {
      case 'cep':
        this.setState({ cep: valueInput });
        if (valueInput.length == 9) {
          this.buscaCep(valueInput);
        }
        break;
      case 'logradouro': this.setState({ logradouro: valueInput }); break;
      case 'numero': this.setState({ numero: valueInput }); break;
      case 'complemento': this.setState({ complemento: valueInput }); break;
      case 'bairro': this.setState({ bairro: valueInput }); break;
      case 'referencia': this.setState({ referencia: valueInput }); break;
      case 'cidade': this.setState({ cidade: valueInput }); break;
      case 'estado': this.setState({ estado: valueInput }); break;
    }
  }

  render() {
    return (
      <StyleProvider style={getTheme(material)}>
        <KeyboardAwareScrollView style={Styles.body}>
          <Brand />
          <View style={Styles.contentContainer}>
            <View style={Styles.textBox}>
              <Text style={Styles.fontBoxDefault}>INFORME AGORA O SEU ENDEREÇO</Text>
            </View>
            <View style={Styles.formContainer}>
              <Item>
                <TextInputMask
                  ref="cep"
                  type={'zip-code'}
                  placeholder="CEP"
                  placeholderLabel="CEP"
                  placeholderTextColor="#575757"
                  style={Styles.inputText}
                  value={this.state.cep}
                  onChangeText={valueInput => this.validateInput('cep', valueInput)} />
              </Item>
              <Item>
                <TextInput
                  ref="logradouro"
                  placeholder="LOGRADOURO"
                  placeholderLabel="LOGRADOURO"
                  placeholderTextColor="#575757"
                  maxLength={60}
                  style={Styles.inputText}
                  value={this.state.logradouro}
                  onChangeText={valueInput => this.validateInput('logradouro', valueInput)} />
              </Item>
              <Item>
                <TextInput
                  ref="numero"
                  placeholder="NÚMERO"
                  placeholderLabel="NÚMERO"
                  placeholderTextColor="#575757"
                  maxLength={10}
                  style={Styles.inputText}
                  value={this.state.numero}
                  onChangeText={valueInput => this.validateInput('numero', valueInput)} />
              </Item>
              <Item>
                <TextInput
                  ref="complemento"
                  placeholder="COMPLEMENTO"
                  placeholderLabel="COMPLEMENTO"
                  placeholderTextColor="#575757"
                  maxLength={60}
                  style={Styles.inputText}
                  value={this.state.complemento}
                  onChangeText={valueInput => this.validateInput('complemento', valueInput)} />
              </Item>
              <Item>
                <TextInput
                  ref="bairro"
                  placeholder="BAIRRO"
                  placeholderLabel="BAIRRO"
                  placeholderTextColor="#575757"
                  maxLength={60}
                  style={Styles.inputText}
                  value={this.state.bairro}
                  onChangeText={valueInput => this.validateInput('bairro', valueInput)} />
              </Item>
              <Item>
                <TextInput
                  ref="referencia"
                  placeholder="REFERÊNCIA"
                  placeholderLabel="REFERÊNCIA"
                  placeholderTextColor="#575757"
                  maxLength={60}
                  style={Styles.inputText}
                  value={this.state.referencia}
                  onChangeText={valueInput => this.validateInput('referencia', valueInput)} />
              </Item>
              <Item>
                <TextInput
                  ref="cidade"
                  placeholder="CIDADE"
                  placeholderLabel="CIDADE"
                  placeholderTextColor="#575757"
                  maxLength={60}
                  style={Styles.inputText}
                  value={this.state.cidade}
                  onChangeText={valueInput => this.validateInput('cidade', valueInput)} />
              </Item>
              <Item>
                <TextInput
                  ref="estado"
                  placeholder="ESTADO"
                  placeholderLabel="ESTADO"
                  placeholderTextColor="#575757"
                  maxLength={2}
                  style={Styles.inputText}
                  value={this.state.estado}
                  onChangeText={valueInput => this.validateInput('estado', valueInput)} />
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
        </KeyboardAwareScrollView>
      </StyleProvider>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    cep: state.endereco.cep,
    logradouro: state.endereco.logradouro,
    numero: state.endereco.numero,
    complemento: state.endereco.complemento,
    bairro: state.endereco.bairro,
    referencia: state.endereco.referencia,
    cidade: state.endereco.cidade,
    cidadeId: state.endereco.cidadeId,
    estado: state.endereco.estado,
    pessoa: state.pessoa,
    configuracoes: state.configuracoes
  }
}

const mapDispatchToProps = { addressRegisterAction }

export default connect(mapStateToProps, mapDispatchToProps)(RegisterAddressPage);
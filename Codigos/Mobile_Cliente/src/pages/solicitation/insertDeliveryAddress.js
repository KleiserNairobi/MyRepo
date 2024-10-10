import React from 'react';
import { connect } from 'react-redux';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { Item, CheckBox } from 'native-base';
import ValidationComponent from 'react-native-form-validator';

import Styles from '../../assets/scss/styles';
import { NotificationAlert } from '../../components/general/alerts';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { TextInputMask } from 'react-native-masked-text';
import { deliveryAddressAction } from '../../store/slices/deliverySlice';
import { formatCEP } from '../../components/general/converter';
import API from '../../services/api';
import ListErrors from '../../components/general/listErrors';

const typeIconDefault = "MaterialCommunityIcons";

class InsertDeliveryAddressPage extends ValidationComponent {
  constructor(props) {
    super(props);
    this.errors = [];
    this.deviceLocale = "ptBR";
    this.state = {
      error: false,
      token: props.configuracoes.token,
      pessoa: props.pessoa,
      cep: props.entrega.destino ? props.entrega.destino.cep : '',
      logradouro: props.entrega.destino ? props.entrega.destino.logradouro : '',
      numero: props.entrega.destino ? props.entrega.destino.numero : '',
      complemento: props.entrega.destino ? props.entrega.destino.complemento : '',
      bairro: props.entrega.destino ? props.entrega.destino.bairro : '',
      referencia: props.entrega.destino ? props.entrega.destino.referencia : '',
      cidade: props.entrega.destino ? props.entrega.destino.cidade : '',
      cidadeId: props.entrega.destino ? props.entrega.destino.cidadeId : '',
      estado: props.entrega.destino ? props.entrega.destino.estado : '',
      nomeCliente: props.entrega.destino ? props.entrega.destino.nomeCliente : '',
      telefoneCliente: props.entrega.destino ? props.entrega.destino.telefoneCliente : '',
      favorito: (props.entrega.destino && props.entrega.destino.favorito === true) ? props.entrega.destino.favorito : false,
    }
  }

  btnNext = async () => {
    this.validate({
      cep: { required: true },
      logradouro: { required: true },
      bairro: { required: true },
      cidade: { required: true },
      estado: { required: true, maxlength: 2 }
    });

    if (this.isFormValid()) {
      // Verificando se existe o ID da cidade/municipio
      if (!this.state.cidadeId) {
        await this.findAddressByCep(this.state.cep);
      }

      // Registrando dados na Store
      await this.props.deliveryAddressAction({
        destino: {
          cep: formatCEP(this.state.cep, 'mask'),
          logradouro: this.state.logradouro,
          numero: this.state.numero ? this.state.numero : 's/n',
          complemento: this.state.complemento ? this.state.complemento : null,
          bairro: this.state.bairro,
          referencia: this.state.referencia ? this.state.referencia : null,
          cidade: this.state.cidade,
          cidadeId: this.state.cidadeId,
          estado: this.state.estado,
          nomeCliente: this.state.nomeCliente ? this.state.nomeCliente : null,
          telefoneCliente: this.state.telefoneCliente ? this.state.telefoneCliente : null,
          favorito: this.state.favorito
        }
      });

      this.props.navigation.navigate('InstructionsDeliveryAddress');
    } else {
      NotificationAlert(this.getErrorMessages());
    }
  }

  findAddressByCep = async (cep) => {
    // Busca endereços pelo CEP. Necessário AWAIT devido verificação 
    // do ID da Cidade no método btnNext
    await API().get(`enderecos/buscar-endereco-por-cep/?cep=${cep}`)
      .then(res => {
        if (res && res.data) {
          this.setState({
            cep: res.data.cep,
            logradouro: res.data.logradouro,
            complemento: res.data.complemento,
            bairro: res.data.bairro,
            cidade: res.data.cidade,
            cidadeId: res.data.cidadeId,
            estado: res.data.estado,
          });
        } else {
          NotificationAlert('Não foi possível obter a localização pelo CEP');
        }
      })
      .catch(error => {
        if (error && error.response && error.response.data) {
          NotificationAlert(ListErrors(error.response.data));
        } else if (error && error.response) {
          NotificationAlert('Erro ao obter localização pelo CEP. Código: ' + error.response.status);
        } else {
          NotificationAlert('Erro ao obter localização pelo CEP.');
        }
      });
  }

  validateInput = (input, valueInput) => {
    switch (input) {
      case 'cep':
        this.setState({ cep: valueInput });
        if (valueInput.length == 9) {
          this.findAddressByCep(valueInput);
        }
        break;
      case 'logradouro': this.setState({ logradouro: valueInput }); break;
      case 'numero': this.setState({ numero: valueInput }); break;
      case 'complemento': this.setState({ complemento: valueInput }); break;
      case 'bairro': this.setState({ bairro: valueInput }); break;
      case 'referencia': this.setState({ referencia: valueInput }); break;
      case 'cidade': this.setState({ cidade: valueInput }); break;
      case 'estado': this.setState({ estado: valueInput }); break;
      case 'nomeCliente': this.setState({ nomeCliente: valueInput }); break;
      case 'telefoneCliente': this.setState({ telefoneCliente: valueInput }); break;
      case 'favorito':
        if (this.state.favorito === true) {
          this.setState({ favorito: false });
        } else {
          this.setState({ favorito: true });
        }
        break;
    }
  }

  render() {
    return (
      <KeyboardAwareScrollView style={[Styles.body, Styles.whiteBg]}>
        <View style={Styles.contentContainer}>
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
            {(this.state.pessoa && this.state.pessoa.parceiro === true) ? (
              <View>
                <Item>
                  <TextInput
                    ref="nomeCliente"
                    placeholder="NOME DO CLIENTE"
                    placeholderLabel="NOME DO CLIENTE"
                    placeholderTextColor="#575757"
                    maxLength={45}
                    style={Styles.inputText}
                    value={this.state.nomeCliente}
                    onChangeText={valueInput => this.validateInput('nomeCliente', valueInput)} />
                </Item>
                <Item>
                  <TextInputMask
                    ref="telefoneCliente"
                    type={'cel-phone'}
                    options={{
                      maskType: 'BRL',
                      withDDD: true,
                      dddMask: '(99)'
                    }}
                    placeholder="TELEFONE DO CLIENTE"
                    placeholderLabel="TELEFONE DO CLIENTE"
                    placeholderTextColor="#575757"
                    style={Styles.inputText}
                    value={this.state.telefoneCliente}
                    onChangeText={valueInput => this.validateInput('telefoneCliente', valueInput)} />
                </Item>
              </View>
            ) : null}
            <View style={[Styles.horizontalContainer, { justifyContent: 'flex-start' }]}>
              <CheckBox
                color="black"
                checked={this.state.favorito}
                onPress={() => this.validateInput('favorito', !this.state.favorito)} />
              <TouchableOpacity
                onPress={() => this.validateInput('favorito', !this.state.favorito)}>
                <Text style={[Styles.font16, Styles.fontUppercase, { marginLeft: 15 }]}>Adicionar aos favoritos</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
        <View style={[Styles.container, Styles.mInternalBox]}>
          <TouchableOpacity
            style={[Styles.largeBlockButton, Styles.m10]}
            onPress={this.btnNext}>
            <Text style={Styles.textButton}>PRÓXIMO</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAwareScrollView>
    )
  }

}

const mapStateToProps = (state) => {
  return {
    entrega: state.entrega,
    pessoa: state.pessoa,
    configuracoes: state.configuracoes
  }
}

const mapDispatchToProps = { deliveryAddressAction }

export default connect(mapStateToProps, mapDispatchToProps)(InsertDeliveryAddressPage);
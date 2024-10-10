import React from 'react';
import { connect } from 'react-redux';
import { View, TouchableOpacity, TextInput, KeyboardAvoidingView } from 'react-native';
import { Item, Textarea, Text } from 'native-base';
import ValidationComponent from 'react-native-form-validator';

import Styles from '../../assets/scss/styles';
import { TextInputMask } from 'react-native-masked-text';
import { instructionsPickupAddressAction } from '../../store/slices/deliverySlice';

class InstructionsPickupAddressPage extends ValidationComponent {
  constructor(props) {
    super(props);
    this.errors = [];
    this.deviceLocale = "ptBR";
    this.state = {
      error: false,
      contato: props.entrega.origem ? props.entrega.origem.contato : null,
      telefone: props.entrega.origem ? props.entrega.origem.telefone : null,
      tarefa: props.entrega.origem ? props.entrega.origem.tarefa : '',
      maxCaracteres: 256
    }
  }

  btnNext = () => {
    this.props.instructionsPickupAddressAction({
      contato: this.state.contato ? this.state.contato : null,
      telefone: this.state.telefone ? this.state.telefone : null,
      tarefa: this.state.tarefa ? this.state.tarefa : null
    });
    this.props.navigation.navigate('ChooseDeliveryAddress');
  }

  validateInput = (input, valueInput) => {
    switch (input) {
      case 'contato': this.setState({ contato: valueInput }); break;
      case 'telefone': this.setState({ telefone: valueInput }); break;
      case 'tarefa': this.setState({ tarefa: valueInput }); break;
    }
  }

  render() {
    return (
      <KeyboardAvoidingView behavior="height" style={[Styles.body, Styles.whiteBg]}>
        <View style={Styles.contentContainer}>
          <View style={Styles.formContainer}>
            <Item>
              <TextInput
                ref="contato"
                placeholder="CONTATO"
                placeholderLabel="CONTATO"
                placeholderTextColor="#575757"
                maxLength={45}
                style={Styles.inputText}
                value={this.state.contato}
                onChangeText={valueInput => this.validateInput('contato', valueInput)} />
            </Item>
            <Item>
              <TextInputMask
                ref="telefone"
                type={'cel-phone'}
                options={{
                  maskType: 'BRL',
                  withDDD: true,
                  dddMask: '(99)'
                }}
                placeholder="TELEFONE"
                placeholderLabel="TELEFONE"
                placeholderTextColor="#575757"
                style={Styles.inputText}
                value={this.state.telefone}
                onChangeText={valueInput => this.validateInput('telefone', valueInput)} />
            </Item>
            <View style={{ marginTop: 15 }}>
              <Textarea
                style={Styles.textarea}
                placeholder="INSTRUÇŌES NA RETIRADA"
                placeholderLabel="INSTRUÇŌES NA RETIRADA"
                rowSpan={5}
                onChangeText={valueInput => this.validateInput('tarefa', valueInput)}>
                {this.state.tarefa}
              </Textarea>
            </View>
            <Text>Caracteres restantes: {(this.state.tarefa) ? this.state.maxCaracteres - this.state.tarefa.length : this.state.maxCaracteres}</Text>
          </View>
          <View style={Styles.containerButtonBottom}>
            <TouchableOpacity
              style={[Styles.largeBlockButton, Styles.m10]}
              onPress={this.btnNext}>
              <Text style={[Styles.textButton]}>PRÓXIMO</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    entrega: state.entrega
  }
}

const mapDispatchToProps = { instructionsPickupAddressAction }

export default connect(mapStateToProps, mapDispatchToProps)(InstructionsPickupAddressPage);
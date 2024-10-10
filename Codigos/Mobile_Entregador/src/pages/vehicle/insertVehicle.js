import React from 'react';
import { connect } from 'react-redux';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { Item, Button, Icon } from 'native-base';
import ValidationComponent from 'react-native-form-validator';

import Styles from '../../assets/scss/styles';
import { NotificationAlert } from '../../components/general/alerts';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { vehicleRegisterAction } from '../../store/slices/vehicleSlice';
import API from '../../services/api';
import ListErrors from '../../components/general/listErrors';

const typeIconDefault = "MaterialCommunityIcons";

class InsertVehiclePage extends ValidationComponent {
  constructor(props) {
    super(props);
    this.errors = [];
    this.deviceLocale = "ptBR";
    this.state = {
      error: false,
      token: props.configuracoes.token,
      pessoa: props.pessoa,
      descricao: null,
      modelo: null,
      placa: null,
      renavan: null,
      tipoVeiculo: null
    }
  }

  btnNext = () => {
    this.validate({
      modelo: { required: true },
      placa: { required: true },
      renavan: { required: true },
    });

    if (this.isFormValid() && this.state.tipoVeiculo) {
      this.registerVehicle();
    } else if (!this.state.tipoVeiculo) {
      NotificationAlert('Selecione o tipo do veículo');
    } else {
      NotificationAlert(this.getErrorMessages());
    }
  }

  registerVehicle = () => {
    let registerData = {
      id: null,
      pessoa: {
        id: this.state.pessoa.id
      },
      modelo: this.state.modelo,
      placa: this.state.placa,
      renavan: this.state.renavan,
      tipo: this.state.tipoVeiculo,
      ativo: true
    }

    API({ token: this.state.token })
      .post('veiculos', registerData)
      .then(async res => {
        if (res && res.data) { 
          await this.props.vehicleRegisterAction(res.data); 
          this.props.navigation.navigate('Solicitation');
        } else {
          NotificationAlert('Não foi possível registrar seus dados. Tente novamente.');
        }
      })
      .catch(error => {
        if (error && error.response && error.response.data) {
          NotificationAlert(ListErrors(error.response.data));
        } else {
          NotificationAlert('Erro ao registrar seus dados.');
        }
      });
  }

  validateInput = (input, valueInput) => {
    switch (input) {
      case 'tipoVeiculo': this.setState({ tipoVeiculo: valueInput }); break;
      case 'modelo': this.setState({ modelo: valueInput }); break;
      case 'placa': this.setState({ placa: valueInput }); break;
      case 'renavan': this.setState({ renavan: valueInput }); break;
    }
  }

  render() {
    return (
      <KeyboardAwareScrollView style={[Styles.body, Styles.whiteBg]}>
        <View style={Styles.contentContainer}>
          <View style={[Styles.textSmallBox, Styles.grayBg, { width:'100%' }]}>
            <Text style={[Styles.font16, Styles.grayColor]}>Tipo de Veículo</Text>
          </View>

          <View style={[Styles.barVehicles, { width:'100%' }]}>
            <Button
              onPress={() => this.validateInput('tipoVeiculo', 'B')}
              style={Styles.barVehiclesButtom} transparent>
              <Icon
                type={typeIconDefault}
                name='bike'
                style={this.state.tipoVeiculo == 'B'
                  ? Styles.barVehiclesIconSelected
                  : Styles.barVehiclesIcon} />
              <Text style={this.state.tipoVeiculo == 'B'
                ? Styles.barVehiclesTextSelected
                : Styles.barVehiclesText}>Bike</Text>
            </Button>
            <Button
              onPress={() => this.validateInput('tipoVeiculo', 'M')}
              style={Styles.barVehiclesButtom} transparent>
              <Icon
                type={typeIconDefault}
                name='motorbike'
                style={this.state.tipoVeiculo == 'M'
                  ? Styles.barVehiclesIconSelected
                  : Styles.barVehiclesIcon} />
              <Text style={this.state.tipoVeiculo == 'M'
                ? Styles.barVehiclesTextSelected
                : Styles.barVehiclesText}>Moto</Text>
            </Button>
            <Button
              onPress={() => this.validateInput('tipoVeiculo', 'C')}
              style={Styles.barVehiclesButtom} transparent>
              <Icon
                type={typeIconDefault}
                name='car'
                style={this.state.tipoVeiculo == 'C'
                  ? Styles.barVehiclesIconSelected
                  : Styles.barVehiclesIcon} />
              <Text style={this.state.tipoVeiculo == 'C'
                ? Styles.barVehiclesTextSelected
                : Styles.barVehiclesText}>Carro</Text>
            </Button>
          </View>

          <View style={Styles.formContainer}>
            <Item>
              <TextInput
                ref="modelo"
                placeholder="MODELO"
                placeholderLabel="MODELO"
                placeholderTextColor="#575757"
                maxLength={50}
                style={Styles.inputText}
                value={this.state.modelo}
                onChangeText={valueInput => this.validateInput('modelo', valueInput)} />
            </Item>
            <Item>
              <TextInput
                ref="placa"
                placeholder="PLACA"
                placeholderLabel="PLACA"
                placeholderTextColor="#575757"
                maxLength={8}
                style={Styles.inputText}
                value={this.state.placa}
                onChangeText={valueInput => this.validateInput('placa', valueInput)} />
            </Item>
            <Item>
              <TextInput
                ref="renavan"
                placeholder="RENAVAN"
                placeholderLabel="RENAVAN"
                placeholderTextColor="#575757"
                maxLength={11}
                style={Styles.inputText}
                value={this.state.renavan}
                onChangeText={valueInput => this.validateInput('renavan', valueInput)} />
            </Item>
          </View>
        </View>
        <View style={Styles.containerButtonBottom}>
          <TouchableOpacity
            style={Styles.largeBlockButton}
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
    configuracoes: state.configuracoes,
    veiculo: state.veiculo
  }
}

const mapDispatchToProps = { vehicleRegisterAction }

export default connect(mapStateToProps, mapDispatchToProps)(InsertVehiclePage);
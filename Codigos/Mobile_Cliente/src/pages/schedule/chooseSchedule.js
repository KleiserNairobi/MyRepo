import React from 'react';
import { connect } from 'react-redux';
import {
  View,
  KeyboardAvoidingView,
  Text,
  TextInput,
  TouchableOpacity
} from 'react-native';
import { Item, Icon, DatePicker, Picker } from 'native-base';
import ValidationComponent from 'react-native-form-validator';

import Styles from '../../assets/scss/styles';
import { NotificationAlert } from '../../components/general/alerts';
import { formatDateCurrent, formatDate } from '../../components/general/converter';
import { TextInputMask } from 'react-native-masked-text';
import { scheduleRegisterAction } from '../../store/slices/deliverySlice';

const typeIconDefault = "MaterialCommunityIcons";

class ChooseSchedulePage extends ValidationComponent {
  constructor(props) {
    super(props);
    this.errors = [];
    this.deviceLocale = "ptBR";
    this.state = {
      token: props.configuracoes.token,
      usuario: props.usuario,
      pessoa: props.usuario.pessoa,
      entrega: props.entrega,
      tipoAgendamento: null,
      qtdeRepeticao: null,
      dataExecucao: null,
      horaExecucao: null,
      especificarEntregador: false,
      showQtdeRepeticao: false
    }
  }

  btnNext = async () => {
    this.validate({
      tipoAgendamento: { required: true },
      dataExecucao: { required: true },
      horaExecucao: { required: true }
    });

    if (this.isFormValid()) {
      let registerData = {
        tipoAgendamento: this.state.tipoAgendamento,
        qtdeRepeticao: (this.state.qtdeRepeticao > 1) ? this.state.qtdeRepeticao : 1,
        dataExecucao: formatDate(this.state.dataExecucao, 'database'),
        horaExecucao: this.state.horaExecucao,
      }

      // Registrando agendamento na Store
      await this.props.scheduleRegisterAction({
        agendamento: registerData
      });

      // Redireciona
      if (this.state.especificarEntregador === true) {
        // Redireciona para listagem de entregadores
        this.props.navigation.navigate('ScheduleDeliveryman');
      } else {
        // Redireciona para registrar o agendamento
        this.props.navigation.navigate('RegisterSchedule');
      }
    } else {
      NotificationAlert(this.getErrorMessages());
    }
  }

  validateInput = (input, valueInput) => {
    switch (input) {
      case 'tipoAgendamento': 
        this.setState({ 
          tipoAgendamento: valueInput 
        }, () => {
          if (valueInput != 'U') {
            this.setState({ showQtdeRepeticao: true });
          } else if (this.state.showQtdeRepeticao !== false) {
            this.setState({ showQtdeRepeticao: false });
          }
        });
        break;
      case 'qtdeRepeticao': 
        this.setState({ qtdeRepeticao: valueInput });
        break;
      case 'dataExecucao': 
        this.setState({ dataExecucao: valueInput });
        break;
      case 'horaExecucao': 
        this.setState({ horaExecucao: valueInput });
        break;
      case 'especificarEntregador':
        this.setState({
          especificarEntregador: valueInput
        }, () => {
          // Redireciona
          this.btnNext();
        })
        break;
    }
  }

  render() {
    return (
      <KeyboardAvoidingView style={[Styles.body, Styles.whiteBg]}>
        <View style={Styles.contentContainer}>
          <View style={Styles.formContainer}>
            <Item>
              <Picker
                mode="dropdown"
                iosIcon={<Icon name="arrow-down" />}
                selectedValue={this.state.tipoAgendamento}
                onValueChange={valueInput => this.validateInput('tipoAgendamento',valueInput)}
              >
                <Picker.Item label="TIPO DE AGENDAMENTO" value="" />
                <Picker.Item label="Único" value="U" />
                <Picker.Item label="Diário" value="D" />
                <Picker.Item label="Semanal" value="S" />
                <Picker.Item label="Quinzenal" value="Q" />
                <Picker.Item label="Mensal" value="M" />
              </Picker>
            </Item>
            {(this.state.showQtdeRepeticao === true) ? (
              <Item>
                <TextInputMask
                  ref="repeticoes"
                  type={'only-numbers'}
                  placeholder="QUANTIDADE DE REPETIÇÕES"
                  placeholderLabel="QUANTIDADE DE REPETIÇÕES"
                  placeholderTextColor="#575757"
                  maxLength={2}
                  style={Styles.inputText}
                  value={this.state.qtdeRepeticao}
                  onChangeText={valueInput => this.validateInput('qtdeRepeticao', valueInput)} />
              </Item>
            ) : null}
            <Item>
              <DatePicker
                modalTransparent={false}
                animationType={"fade"}
                androidMode={"spinner"}
                placeHolderText="DATA DA EXECUÇÃO"
                onDateChange={valueInput => this.validateInput('dataExecucao', valueInput)}
                disabled={false}
                />
            </Item>
            <Item>
              <TextInputMask
                ref="horaExecucao"
                type={'datetime'}
                options={{ format: 'HH:mm' }}
                placeholder="HORA DA EXECUÇÃO"
                placeholderLabel="HORA DA EXECUÇÃO"
                placeholderTextColor="#575757"
                style={Styles.inputText}
                value={this.state.horaExecucao}
                onChangeText={valueInput => this.validateInput('horaExecucao', valueInput)} />
            </Item>
          </View>
        </View>
        <View style={[Styles.container, Styles.mInternalBox]}>
          <TouchableOpacity
            style={[Styles.largeBlockButton, Styles.m10]}
            onPress={() => this.validateInput('especificarEntregador', true)}>
            <Text style={Styles.textButton}>Especificar um entregador</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[Styles.largeBlockButton, Styles.m10]}
            onPress={() => this.validateInput('especificarEntregador', false)}>
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
    entrega: state.entrega
  }
}

const mapDispatchToProps = { scheduleRegisterAction }

export default connect(mapStateToProps, mapDispatchToProps)(ChooseSchedulePage);
import React from 'react';
import { connect } from 'react-redux';
import { View, KeyboardAvoidingView, Text, TouchableOpacity } from 'react-native';
import { Icon } from 'native-base';

import Styles from '../../assets/scss/styles';
import { deliveryInitialStateAction } from '../../store/slices/deliverySlice';
import { 
  formatDateCurrent, 
  formatTimetablesCurrent 
} from '../../components/general/converter';

const typeIconDefault = "MaterialCommunityIcons";

class FinalizedSchedulePage extends React.Component {
  state = {
    ...this.props,
    token: this.props.configuracoes.token,
    pessoa: this.props.usuario.pessoa,
    entrega: this.props.entrega,
    agendamento: this.props.entrega.agendamento
  }

  btnNext = async () => {
    // Apagando dados da entrega no App
    await this.props.deliveryInitialStateAction();

    this.props.navigation.push('Solicitation');
  }

  render() {
    return (
      <KeyboardAvoidingView behavior="height" style={[Styles.body, Styles.whiteBg]}>
        <View style={[Styles.container, { width:'100%' }]}>
          <Icon
            type={typeIconDefault}
            name='flag-checkered'
            style={[Styles.iconButton, { fontSize: 60 }]} />
          <Text 
            style={[Styles.fontBoxDefault,Styles.font16]}>Agendamento registrado com sucesso</Text>
          <Text 
            style={[Styles.fontBoxDefault,Styles.font16]}>{formatDateCurrent()} - {formatTimetablesCurrent()}</Text>
        </View>
        <View style={Styles.containerButtonBottom}>
          <TouchableOpacity
            style={[Styles.largeBlockButton, Styles.m10]}
            onPress={this.btnNext}>
            <Text style={Styles.textButton}>TELA INICIAL</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView >
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

const mapDispatchToProps = { deliveryInitialStateAction }

export default connect(mapStateToProps, mapDispatchToProps)(FinalizedSchedulePage);
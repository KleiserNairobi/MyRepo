import React from 'react';
import { connect } from 'react-redux';
import { View, KeyboardAvoidingView, Text, TouchableOpacity } from 'react-native';
import { Icon } from 'native-base';

import Styles from '../../assets/scss/styles';
import { deliveryInitialStateAction } from '../../store/slices/deliverySlice';
import { deliverymanInitialStateAction } from '../../store/slices/deliverymanSlice';
import { 
  formatDateCurrent, 
  formatTimetablesCurrent 
} from '../../components/general/converter';

const typeIconDefault = "MaterialCommunityIcons";

class FinalizedSolicitationPage extends React.Component {
  state = {
    ...this.props,
    token: this.props.configuracoes.token,
    pessoa: this.props.usuario.pessoa,
    entrega: this.props.entrega,
    entregador: this.props.entregador
  }

  btnNext = async () => {
    // Apagando dados da entrega no App
    await this.props.deliveryInitialStateAction();
    // Apagando dados do entregador no App
    await this.props.deliverymanInitialStateAction();

    this.props.navigation.push('Solicitation');
  }

  render() {
    return (
      <KeyboardAvoidingView behavior="height" style={[Styles.body, Styles.whiteBg]}>
        <View style={Styles.contentContainer}>
          <View style={[Styles.brandContainer, { width:'100%' }]}>
            <Icon
              type={typeIconDefault}
              name='flag-checkered'
              style={[Styles.iconButton, { fontSize: 60 }]} />
            <Text 
              style={[Styles.fontBoxDefault,Styles.font16]}>Solicitação concluída com sucesso</Text>
            <Text 
              style={[Styles.fontBoxDefault,Styles.font16]}>{formatDateCurrent()} - {formatTimetablesCurrent()}</Text>
          </View>
          <View style={{ width: '100%' }}>
            <View style={Styles.textBox}>
              <Text style={[Styles.fontUppercase, Styles.fontBold]}>Entregador</Text>
            </View>
            <View style={[Styles.detailsItemContainer, { paddingHorizontal: 20 }]}>
              <Text 
                style={Styles.detailsItemDescriptionContainer}>Nome</Text>
              <Text 
                style={Styles.detailsItemValueContainer}>{this.state.entregador.nome}</Text>
            </View>
            <View style={[Styles.detailsItemContainer, { paddingHorizontal: 20 }]}>
              <Text 
                style={Styles.detailsItemDescriptionContainer}>Telefone</Text>
              <Text 
                style={Styles.detailsItemValueContainer}>{this.state.entregador.telefone}</Text>
            </View>
          </View>
          {(this.state.entregador.veiculo) ? (
            <View style={{ width: '100%' }}>
              <View style={Styles.textBox}>
                <Text style={[Styles.fontUppercase, Styles.fontBold]}>Veículo</Text>
              </View>
              <View style={[Styles.detailsItemContainer, { paddingHorizontal: 20 }]}>
                <Text 
                  style={Styles.detailsItemDescriptionContainer}>Tipo</Text>
                <Text 
                  style={Styles.detailsItemValueContainer}>{this.state.entregador.veiculo.nome}</Text>
              </View>
              <View style={[Styles.detailsItemContainer, { paddingHorizontal: 20 }]}>
                <Text 
                  style={Styles.detailsItemDescriptionContainer}>Modelo</Text>
                <Text 
                  style={Styles.detailsItemValueContainer}>{this.state.entregador.veiculo.modelo}</Text>
              </View>
              <View style={[Styles.detailsItemContainer, { paddingHorizontal: 20 }]}>
                <Text 
                  style={Styles.detailsItemDescriptionContainer}>Placa</Text>
                <Text 
                  style={Styles.detailsItemValueContainer}>{this.state.entregador.veiculo.placa}</Text>
              </View>
            </View>
          ) : null}
          <View style={Styles.containerButtonBottom}>
            <TouchableOpacity
              style={[Styles.largeBlockButton, Styles.m10]}
              onPress={this.btnNext}>
              <Text style={Styles.textButton}>TELA INICIAL</Text>
            </TouchableOpacity>
          </View>
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
    entregador: state.entregador
  }
}

const mapDispatchToProps = {
  deliveryInitialStateAction,
  deliverymanInitialStateAction
}

export default connect(mapStateToProps, mapDispatchToProps)(FinalizedSolicitationPage);
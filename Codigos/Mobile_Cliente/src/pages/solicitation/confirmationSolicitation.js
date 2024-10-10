import React from 'react';
import { connect } from 'react-redux';
import { View, KeyboardAvoidingView, Text, TouchableOpacity } from 'react-native';

import Styles from '../../assets/scss/styles';

const typeIconDefault = "MaterialCommunityIcons";

class ConfirmationSolicitationPage extends React.Component {
  state = {
    token: this.props.configuracoes.token,
    pessoa: this.props.pessoa,
    entrega: this.props.entrega
  }

  btnNext = async () => {
    this.props.navigation.navigate('Solicitation', {
      confirmedAddresses: true
    });
  }

  render() {
    return (
      <KeyboardAvoidingView behavior="height" style={[Styles.body, Styles.whiteBg]}>
        <View style={[Styles.contentContainer]}>
          <View style={[Styles.horizontalContainer, { padding: 30 }]}>
            <View style={[{ flex: 1, marginLeft: 10 }]}>
              <Text style={[Styles.textSmallBox, Styles.fontBold, { paddingBottom: 0 }]}>Local de retirada:</Text>
              <Text style={[Styles.textSmallBox]}>
                {this.state.entrega.origem.logradouro}, {this.state.entrega.origem.numero}, {this.state.entrega.origem.complemento}, {this.state.entrega.origem.bairro}
              </Text>
              <Text style={[Styles.textSmallBox]}>
                {this.state.entrega.origem.cidade} - {this.state.entrega.origem.estado}
              </Text>
              <Text style={[Styles.textSmallBox]}>
                {this.state.entrega.origem.contato} - {this.state.entrega.origem.telefone}
              </Text>
              <Text style={[Styles.textSmallBox]}>
                {this.state.entrega.origem.tarefa}
              </Text>
            </View>
          </View>
          <View style={[Styles.horizontalContainer, { marginTop: 10, padding: 30, borderTopWidth: 2 }, Styles.grayLightBorder]}>
            <View style={[{ flex: 1, marginLeft: 10 }]}>
              <Text style={[Styles.textSmallBox, Styles.fontBold, { paddingBottom: 0 }]}>Local de entrega:</Text>
              <Text style={[Styles.textSmallBox]}>
                {this.state.entrega.destino.logradouro}, {this.state.entrega.destino.numero}, {this.state.entrega.destino.complemento}, {this.state.entrega.destino.bairro}
              </Text>
              <Text style={[Styles.textSmallBox]}>
                {this.state.entrega.destino.cidade} - {this.state.entrega.destino.estado}
              </Text>
              <Text style={[Styles.textSmallBox]}>
                {this.state.entrega.destino.contato} - {this.state.entrega.destino.telefone}
              </Text>
              <Text style={[Styles.textSmallBox]}>
                {this.state.entrega.destino.tarefa}
              </Text>
            </View>
          </View>
          <View style={[Styles.containerButtonBottom]}>
            <TouchableOpacity
              style={[Styles.largeBlockButton, Styles.m10]}
              onPress={this.btnNext}>
              <Text style={[Styles.textButton]}>CONFIRMAR</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
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

export default connect(mapStateToProps)(ConfirmationSolicitationPage);
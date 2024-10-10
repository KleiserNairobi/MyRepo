import React from 'react';
import { connect } from 'react-redux';
import { 
  View, 
  KeyboardAvoidingView, 
  Text, 
  TouchableOpacity,
  BackHandler
} from 'react-native';
import { Icon } from 'native-base';

import Styles from '../../assets/scss/styles';
import { deliveryInitialStateAction } from '../../store/slices/deliverySlice';

const typeIconDefault = "MaterialCommunityIcons";

class DeliveryFinalizedPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      token: this.props.configuracoes.token,
      pessoa: this.props.usuario.pessoa,
      entrega: this.props.entrega
    }

    // Adicionando evento para o botão voltar do celular
    BackHandler.addEventListener('hardwareBackPress', () => {
      this.btnNext();
    });

    // Adicionando evento para o botão voltar da tela
    this.props.navigation.addListener('beforeRemove', (e) => {
      this.btnNext();
    });
  }

  btnNext = async () => {
    // Apagando dados da entrega no App
    await this.props.deliveryInitialStateAction();

    this.props.navigation.navigate('Solicitation');
  }

  render() {
    return (
      <KeyboardAvoidingView behavior="height" style={[Styles.body, Styles.whiteBg]}>
        <View style={Styles.contentContainer}>
          <View style={[Styles.container, Styles.textBox]}>
            <Icon
              type={typeIconDefault}
              name='flag-checkered'
              style={[Styles.iconButton, { fontSize: 60 }]} />
            <Text style={[
              Styles.fontBoxDefault,
              Styles.font16
            ]}>Entrega concluída com sucesso</Text>
          </View>
          <View style={Styles.containerButtonBottom}>
            <TouchableOpacity
              style={[Styles.largeBlockButton, Styles.m10]}
              onPress={this.btnNext}>
              <Text style={Styles.textButton}>VOLTAR PARA PAINEL</Text>
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
    entrega: state.entrega
  }
}

const mapDispatchToProps = { deliveryInitialStateAction }

export default connect(mapStateToProps, mapDispatchToProps)(DeliveryFinalizedPage);
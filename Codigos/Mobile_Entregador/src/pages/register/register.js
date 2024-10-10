import React from 'react';
import { connect } from 'react-redux';
import { View, TouchableOpacity, Text } from 'react-native';
import { StyleProvider } from 'native-base';
import getTheme from '../../native-base-theme/components';
import material from '../../native-base-theme/variables/material';

import Styles from '../../assets/scss/styles';
import Brand from '../../components/general/brand';
import { personTypeRegisterAction } from '../../store/slices/personSlice';

class RegisterPage extends React.Component {

  btnReturn = () => {
    this.props.navigation.navigate('Login');
  }

  btnRegisterPF = () => {
    this.props.personTypeRegisterAction({ tipo: 'F' });
    this.props.navigation.navigate('RegisterPF');
  }

  btnRegisterPJ = () => {
    this.props.personTypeRegisterAction({ tipo: 'J' });
    this.props.navigation.navigate('RegisterPJ');
  }

  render() {
    return (
      <StyleProvider style={getTheme(material)}>
        <View style={Styles.body}>
          <Brand />
          <View style={Styles.contentContainer}>
            <View style={Styles.textBox}>
              <Text style={Styles.fontBoxDefault}>OLÁ, QUE BOM TER VOCÊ AQUI!</Text>
              <Text style={Styles.fontBoxDefault}>VAMOS INICIAR AGORA O SEU CADASTRO.</Text>
            </View>
            <View style={Styles.textBox}>
              <Text style={Styles.fontBoxDefault}>A CONTA QUE DESEJA CRIAR É PARA? </Text>
            </View>
            <TouchableOpacity
              style={Styles.largeButton}
              onPress={this.btnRegisterPF}>
              <Text style={Styles.textButton}>PESSOA FÍSICA</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={Styles.largeButton}
              onPress={this.btnRegisterPJ}>
              <Text style={Styles.textButton}>PESSOA JURÍDICA</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={Styles.smallButton}
              onPress={this.btnReturn}>
              <Text style={Styles.textButton}>VOLTAR</Text>
            </TouchableOpacity>
          </View>
        </View>
      </StyleProvider>
    )
  }
}

const mapDispatchToProps = { personTypeRegisterAction }

export default connect(null, mapDispatchToProps)(RegisterPage);
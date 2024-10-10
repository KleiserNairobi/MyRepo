import React from 'react';
import {
  View,
  TouchableOpacity,
  Image,
  Text,
  ImageBackground
} from 'react-native';

import Styles from '../../assets/scss/styles';

const sourceLogo = require('../../assets/images/chamai_L320.png');
const sourceBackground = require('../../assets/images/Congratulacao_320L.png');

class RegisterFinishedPage extends React.Component {

  btnNext = () => {
    this.props.navigation.navigate('Login');
  }

  render() {
    return (
      <View style={Styles.body}>
        <ImageBackground source={sourceBackground} style={{ flex: 1 }} imageStyle={{ width:'100%', height: '50%', resizeMode: 'stretch', top: undefined }}>
          <View style={Styles.brandContainer}>
            <Image
              style={Styles.brandSmall}
              source={sourceLogo} />
          </View>
          <View style={Styles.contentContainer}>
            <View style={Styles.textBox}>
              <Text style={[Styles.fontBoxDefault, Styles.font16]}>PARABÉNS!</Text>
              <Text style={Styles.fontBoxDefault}>SEU CADASTRO FOI CONCLUÍDO</Text>
            </View>
            <TouchableOpacity
              style={Styles.largeButton}
              onPress={this.btnNext}>
              <Text style={Styles.textButton}>ACESSAR CONTA</Text>
            </TouchableOpacity>
          </View>
        </ImageBackground>
      </View>
    )
  }
}

export default RegisterFinishedPage;
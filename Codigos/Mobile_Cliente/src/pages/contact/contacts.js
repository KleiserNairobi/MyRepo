import React from 'react';
import { connect } from 'react-redux';
import {
  View,
  KeyboardAvoidingView,
  Text,
  TouchableOpacity
} from 'react-native';

import Styles from '../../assets/scss/styles';
import { NotificationAlert } from '../../components/general/alerts';

const typeIconDefault = "MaterialCommunityIcons";

class ContactsPage extends React.Component {

  render() {
    return (
      <KeyboardAvoidingView style={[Styles.body, Styles.whiteBg]}>
        <View style={Styles.contentContainer}>
          <View style={Styles.textBox}>
            <Text style={Styles.font20}>Nossos canais de atendimento</Text>
          </View>
          <View style={Styles.textBox}>
            <Text style={[Styles.fontUppercase, Styles.fontBold]}>Chat</Text>
          </View>
          <View style={Styles.container}>
            <TouchableOpacity
              onPress={() => {
                this.props.navigation.navigate('ChatSupport');
              }}
              style={Styles.largeBlockButton}>
              <Text style={Styles.textButton}>Suporte / SAC</Text>
            </TouchableOpacity>
          </View>
          <View style={Styles.textBox}>
            <Text style={[Styles.fontUppercase, Styles.fontBold]}>Telefones</Text>
          </View>
          <View style={Styles.container}>
            <View style={Styles.detailsItemContainer}>
              <Text style={Styles.detailsItemDescriptionContainer}>Suporte / SAC</Text>
              <Text style={Styles.detailsItemValueContainer}>(00) 0000-0000</Text>
            </View>
            <View style={Styles.detailsItemContainer}>
              <Text style={Styles.detailsItemDescriptionContainer}>Financeiro</Text>
              <Text style={Styles.detailsItemValueContainer}>(00) 0000-0000</Text>
            </View>
            <View style={Styles.detailsItemContainer}>
              <Text style={Styles.detailsItemDescriptionContainer}>Ouvidoria</Text>
              <Text style={Styles.detailsItemValueContainer}>(00) 0000-0000</Text>
            </View>
          </View>
          <View style={Styles.textBox}>
            <Text style={[Styles.fontUppercase, Styles.fontBold]}>Endereço</Text>
          </View>
          <View style={Styles.container}>
            <Text></Text>
          </View>
        </View>
      </KeyboardAvoidingView>
    )
  }

}

const mapStateToProps = (state) => {
  return {
    pessoa: state.pessoa,
    configuracoes: state.configuracoes
  }
}

export default connect(mapStateToProps)(ContactsPage);
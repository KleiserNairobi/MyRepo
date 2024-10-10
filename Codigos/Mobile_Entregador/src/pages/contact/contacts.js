import React from 'react';
import { connect } from 'react-redux';
import {
  View,
  KeyboardAvoidingView,
  Text,
  TouchableOpacity
} from 'react-native';
import { Container } from 'native-base';

import Styles from '../../assets/scss/styles';
import { NotificationAlert } from '../../components/general/alerts';

const typeIconDefault = "MaterialCommunityIcons";

class ContactsPage extends React.Component {

  render() {
    return (
      <KeyboardAvoidingView style={Styles.body}>
        <Container>
          <Text>Fale conosco</Text>
        </Container>
      </KeyboardAvoidingView>
    )
  }

}

export default ContactsPage;
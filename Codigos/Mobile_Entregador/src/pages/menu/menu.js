import React from 'react';
import {
  View,
  KeyboardAvoidingView,
  Text,
  TouchableOpacity,
  FlatList
} from 'react-native';

import Styles from '../../assets/scss/styles';
import Brand from '../../components/general/brand';

const typeIconDefault = "MaterialCommunityIcons";

class MenuPage extends React.Component {
  state = {
    selectedItem: null
  }

  dataMenu = [
    { id: '1', title: 'Conta', link: 'Account' },
    { id: '2', title: 'Histórico de Entregas', link: 'Deliveries' },
    { id: '3', title: 'Movimentações Financeiras', link: 'FinancialTransactions' },
    { id: '4', title: 'Solicitação de Saque', link: 'WithdrawalRequest' },
    { id: '5', title: 'Fale conosco', link: 'Contacts' }
  ];

  redirectItemMenu = (item) => {
    if (item.link) {
      this.props.navigation.navigate(item.link);
    }
  }

  renderItemMenu = ({ item }) => {
    return (
      <View style={[Styles.whiteBorder, { borderTopWidth: 1 }]}>
        <TouchableOpacity
          style={[
            Styles.container, 
            Styles.p15,
            { alignItems: 'flex-start' }
          ]}
          onPress={() => this.redirectItemMenu(item)}>
          <Text style={[Styles.textButton, Styles.font20]}>{item.title}</Text>
        </TouchableOpacity>
      </View>
    )
  }

  render() {
    return (
      <KeyboardAvoidingView style={Styles.body}>
        <View style={Styles.contentContainer}>
          <Brand />
          <FlatList
            data={this.dataMenu}
            renderItem={this.renderItemMenu}
            keyExtractor={(item) => item.id} 
            style={{ marginTop: 15 }} />
        </View>
      </KeyboardAvoidingView>
    )
  }
}

export default MenuPage;
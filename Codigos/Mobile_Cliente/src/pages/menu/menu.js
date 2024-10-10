import React from 'react';
import { connect } from 'react-redux';
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
  constructor(props) {
    super(props); 
    this.state = {
      token: this.props.configuracoes.token,
      pessoa: this.props.pessoa,
      dataMenu: [
        { id: '1', title: 'Agendamentos', link: 'Schedules' },
        { id: '2', title: 'Histórico de Solicitaçōes', link: 'Deliveries' },
        { id: '3', title: 'Movimentações Financeiras', link: 'FinancialTransactions' },
        { id: '4', title: 'Fale conosco', link: 'Contacts' }
      ]
    };
  }

  redirectItemMenu = (item) => {
    if (item.link) {
      this.props.navigation.navigate(item.link);
    }
  }

  renderItemMenu = ({ item }) => {
    let showItem = true;

    // Verifica se o usuario tem permissao de visualizar o item do menu
    if (item.link == 'FinancialTransactions' && this.state.pessoa.parceiro === false) {
      showItem = false;
    }

    return (showItem === true) ? (
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
      ) : (
        <View></View>
      );
  }

  render() {
    return (
      <KeyboardAvoidingView style={Styles.body}>
        <View style={Styles.contentContainer}>
          <Brand />
          <FlatList
            data={this.state.dataMenu}
            renderItem={this.renderItemMenu}
            keyExtractor={(item) => item.id} 
            style={{ marginTop: 15 }} />
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

export default connect(mapStateToProps)(MenuPage);

import React from 'react';
import { connect } from 'react-redux';
import {
  View,
  KeyboardAvoidingView,
  Text,
  FlatList,
  TouchableOpacity
} from 'react-native';
import { Icon } from 'native-base';

import Styles from '../../assets/scss/styles';
import { NotificationAlert } from '../../components/general/alerts';
import { pickupAddressAction } from '../../store/slices/deliverySlice';
import API from '../../services/api';

const typeIconDefault = "MaterialCommunityIcons";

class ListFavoritePickupAddressPage extends React.Component {
  state = {
    token: this.props.configuracoes.token,
    pessoa: this.props.pessoa,
    list: [],
    address: null,
    errorMessage: null
  }

  componentDidMount() {
    this.getFavorites();
  }

  btnNext = async () => {
    if (this.state.address) {
      await this.props.pickupAddressAction({
        origem: {
          cep: this.state.address.cep,
          logradouro: this.state.address.logradouro,
          numero: this.state.address.numero,
          complemento: this.state.address.complemento,
          bairro: this.state.address.bairro,
          referencia: this.state.address.referencia,
          cidade: this.state.address.municipio.nome,
          estado: this.state.address.municipio.estado.sigla,
          favorito: false
        }
      });
    }

    this.props.navigation.navigate('InsertPickupAddress');
  }

  getFavorites = () => {
    API({ token: this.state.token })
      .get(`pessoas/enderecos/cobertura-municipio/${this.state.pessoa.id}`)
      .then(res => {
        if (res.data && res.data.length) {
          this.setState({ list: res.data });
        } else {
          NotificationAlert('Nenhum endereço favorito foi encontrado');
        }
      })
      .catch(error => {
        if (error && error.response && error.response.data) {
          this.setState({ errorMessage: error.response.data.detalhe });
        } else {
          NotificationAlert('Erro ao obter lista de endereços favoritos.');
        }
      });
  }

  validateInput = (input, valueInput) => {
    switch (input) {
      case 'favorite':
        this.setState({ address: valueInput });
        break;
    }
  }

  renderItemList = ({ item }) => {
    var colorItem = (this.state.address && this.state.address.id == item.id) ? Styles.yellowColor : Styles.grayColor;

    return (
      <TouchableOpacity
        style={[Styles.grayLightBorder, Styles.p10, { borderWidth: 1 }]}
        onPress={() => this.validateInput('favorite', item)}>
        <View style={Styles.horizontalContainer}>
          <View style={[{ flex: 1, marginLeft: 10 }]}>
            <Text style={[Styles.textSmallBox, Styles.fontBold, { paddingBottom: 0 }]}>{item.logradouro}, {item.numero}</Text>
            <Text style={[Styles.textSmallBox]}>{item.bairro}, {item.municipio.nome} - {item.municipio.estado.sigla}</Text>
          </View>
          <Icon
            type={typeIconDefault}
            name="map-marker"
            style={colorItem} />
        </View>
      </TouchableOpacity>
    )
  }

  render() {
    return (
      <KeyboardAvoidingView style={[Styles.body, Styles.whiteBg]}>
        <View style={{ flex: 3 }}>
          {this.state.errorMessage != null ? (
            <Text style={Styles.textBox}>{this.state.errorMessage}</Text>
          ) : (
              <FlatList
                data={this.state.list}
                renderItem={this.renderItemList}
                keyExtractor={(item) => item.id.toString()}
                style={{ flex: 1 }} />
            )}
        </View>
        <View style={[Styles.container, Styles.mInternalBox]}>
          <TouchableOpacity
            style={Styles.largeBlockButton}
            onPress={this.btnNext}>
            <Text style={Styles.textButton}>PRÓXIMO</Text>
          </TouchableOpacity>
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

const mapDispatchToProps = { pickupAddressAction }

export default connect(mapStateToProps, mapDispatchToProps)(ListFavoritePickupAddressPage);
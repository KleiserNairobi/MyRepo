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
import { statusCodeForName } from '../../components/general/converter';
import { vehicleRegisterAction } from '../../store/slices/vehicleSlice';
import API from '../../services/api';

const typeIconDefault = "MaterialCommunityIcons";

class ListFavoriteVehiclePage extends React.Component {
  state = {
    token: this.props.configuracoes.token,
    pessoa: this.props.pessoa,
    lista: [],
    veiculo: (this.props.veiculo) ? this.props.veiculo : null,
    errorMessage: null
  }

  componentDidMount() {
    this.getFavorites();
  }

  btnNext = async () => {
    await this.props.vehicleRegisterAction({
      id: this.state.veiculo.id,
      tipo: this.state.veiculo.tipo,
      descricao: 'Veículo do Entregador',
      modelo: this.state.veiculo.modelo,
      placa: this.state.veiculo.placa,
      renavan: this.state.veiculo.renavan,
      pessoa: this.state.pessoa.id,
      ativo: this.state.veiculo.ativo
    });

    this.props.navigation.navigate('Solicitation');
  }

  getFavorites = () => {
    API({ token: this.state.token })
      .get(`veiculos/pessoa/${this.state.pessoa.id}`)
      .then(res => {
        if (res && res.data && res.data.length) {
          this.setState({ lista: res.data });
        } else {
          NotificationAlert('Nenhum veículo favorito foi encontrado');
        }
      })
      .catch(error => {
        if (error && error.response && error.response.data) {
          this.setState({ errorMessage: error.response.data.detalhe });
        } else if (error && error.response) {
          NotificationAlert('Erro ao obter lista de veículos. Código: ' + error.response.status);
        } else {
          NotificationAlert('Erro ao obter lista de veículos.');
        }
      });
  }

  validateInput = (input, valueInput) => {
    switch (input) {
      case 'veiculo':
        this.setState({ veiculo: valueInput });
        break;
    }
  }

  renderItemList = ({ item }) => {
    var colorItem = Styles.grayColor;
    if (this.state.veiculo && this.state.veiculo.id == item.id) {
      colorItem = Styles.yellowColor;
    }
    var nameIconItem = (item.tipo) ? statusCodeForName('ICONE_VEICULO', item.tipo) : 'circle';

    return (
      <TouchableOpacity
        style={[Styles.grayLightBorder, Styles.p10, { borderWidth: 1 }]}
        onPress={() => this.validateInput('veiculo', item)}>
        <View style={Styles.horizontalContainer}>
          <View style={[{ flex: 1, marginLeft: 10 }]}>
            <Text style={[
              Styles.textSmallBox, 
              Styles.font16, 
              Styles.fontBold, 
              { paddingBottom: 0 }
            ]}>Placa: {item.placa}</Text>
            <Text style={[
              Styles.textSmallBox, 
              { paddingBottom: 0 }
            ]}>Modelo: {item.modelo}</Text>
            <Text style={[
              Styles.textSmallBox
            ]}>Renavan: {item.renavan}</Text>
          </View>
          <Icon
            type={typeIconDefault}
            name={nameIconItem}
            style={[colorItem, { fontSize: 40 }]} />
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
                data={this.state.lista}
                renderItem={this.renderItemList}
                keyExtractor={(item) => item.id.toString()}
                style={{ flex: 1 }} />
            )}
        </View>
        <View style={Styles.containerButtonBottom}>
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
    veiculo: state.veiculo,
    pessoa: state.pessoa,
    configuracoes: state.configuracoes
  }
}

const mapDispatchToProps = { vehicleRegisterAction }

export default connect(mapStateToProps, mapDispatchToProps)(ListFavoriteVehiclePage);
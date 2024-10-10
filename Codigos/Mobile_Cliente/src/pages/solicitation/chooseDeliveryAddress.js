import React from 'react';
import { connect } from 'react-redux';
import {
  View,
  KeyboardAvoidingView,
  Text,
  TouchableOpacity
} from 'react-native';
import {
  Container,
  Content,
  Icon,
} from 'native-base';

import Styles from '../../assets/scss/styles';
import { NotificationAlert } from '../../components/general/alerts';
import { deliveryAddressAction } from '../../store/slices/deliverySlice';

const typeIconDefault = "MaterialCommunityIcons";

class ChooseDeliveryAddressPage extends React.Component {

  btnInsert = () => {
    // Limpando dados que estejam preenchidos anteriormente
    this.props.deliveryAddressAction({
      destino: null
    });

    this.props.navigation.push('InsertDeliveryAddress');
  }

  btnFavorite = () => {
    this.props.navigation.push('ListFavoriteDeliveryAddress');
  }

  btnGPS = () => {
    this.props.navigation.push('GPSDeliveryAddress');
  }

  render() {
    return (
      <KeyboardAvoidingView style={Styles.body}>
        <Container>
          <Content>
            <View style={[Styles.container, { padding: 50 }]}>
              <Icon
                type={typeIconDefault}
                name='map-marker-plus'
                style={[Styles.font30, Styles.yellowColor, { fontSize: 70 }]} />
              <View style={Styles.p10}>
                <Text style={[
                  Styles.font14,
                  Styles.fontUppercase,
                  Styles.fontBold,
                  Styles.grayColor]}>Como deseja definir o </Text>
                <Text style={[
                  Styles.font14,
                  Styles.fontUppercase,
                  Styles.fontBold,
                  Styles.grayColor]}>endereço de entrega?</Text>
              </View>
            </View>
            <View style={[Styles.container, Styles.mInternalBox]}>
              <TouchableOpacity
                style={[Styles.largeBlockButton, Styles.m10]}
                onPress={this.btnInsert}>
                <Text style={Styles.textButton}>Inserir um novo endereço</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[Styles.largeBlockButton, Styles.m10]}
                onPress={this.btnFavorite}>
                <Text style={Styles.textButton}>Selecionar endereço nos favoritos</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[Styles.largeBlockButton, Styles.m10]}
                onPress={this.btnGPS}>
                <Text style={Styles.textButton}>Usar sua localização atual</Text>
              </TouchableOpacity>
            </View>
          </Content>
        </Container>
      </KeyboardAvoidingView>
    )
  }
}

const mapDispatchToProps = { deliveryAddressAction }

export default connect(null, mapDispatchToProps)(ChooseDeliveryAddressPage);
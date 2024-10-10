import React from 'react';
import { connect } from 'react-redux';
import {
  View,
  KeyboardAvoidingView,
  Text,
  TouchableOpacity,
  PermissionsAndroid
} from 'react-native';
import { Icon } from 'native-base';
import Geolocation from 'react-native-geolocation-service';

import Styles from '../../assets/scss/styles';
import { NotificationAlert } from '../../components/general/alerts';
import { deliveryAddressAction } from '../../store/slices/deliverySlice';
import API from '../../services/api';

const typeIconDefault = "MaterialCommunityIcons";

class GPSDeliveryAddressPage extends React.Component {
  state = {
    token: this.props.configuracoes.token,
    pessoa: this.props.pessoa,
    locationPermission: false,
    latitude: null,
    longitude: null,
    address: null
  }

  componentDidMount() {
    this.getGeolocation();
  }

  btnNext = () => {
    this.props.deliveryAddressAction({
      destino: {
        cep: this.state.address.cep,
        logradouro: this.state.address.logradouro,
        numero: this.state.address.numero,
        complemento: this.state.address.complemento,
        bairro: this.state.address.bairro,
        referencia: this.state.address.referencia,
        cidade: this.state.address.cidade,
        estado: this.state.address.estado,
        favorito: true
      }
    });
    this.props.navigation.navigate('InsertDeliveryAddress');
  }

  verifyLocationPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        this.setState({ locationPermission: true });
      } else {
        this.setState({ locationPermission: false });
      }
    } catch (err) {
      console.warn(err);
    }
  }

  getAddressByGPS = () => {
    API({ token: this.state.token })
      .get(`google-maps/geocoding/?latitude=${this.state.latitude}&longitude=${this.state.longitude}`)
      .then(res => {
        if (res.data) {
          let addressLocated = null;

          if (res.data.results) {
            let addressResults = res.data.results[0];
            let addressComponents = addressResults.addressComponents;
            addressLocated = {
              cep: addressComponents[6] ? addressComponents[6].longName : '',
              logradouro: addressComponents[1] ? addressComponents[1].longName : '',
              numero: addressComponents[0] ? addressComponents[0].longName : '',
              bairro: addressComponents[2] ? addressComponents[2].longName : '',
              cidade: addressComponents[3] ? addressComponents[3].longName : '',
              estado: addressComponents[4] ? addressComponents[4].shortName : '',
              formatado: addressResults.formattedAddress ? addressResults.formattedAddress : ''
            }
          } else {
            addressLocated = {
              cep: res.data.cep ? res.data.cep : '',
              logradouro: res.data.logradouro ? res.data.logradouro : '',
              numero: res.data.numero ? res.data.numero : '',
              bairro: res.data.bairro ? res.data.bairro : '',
              cidade: res.data.cidade ? res.data.cidade : '',
              estado: res.data.estado ? res.data.estado : '',
              formatado: res.data.enderecoFormatado ? res.data.enderecoFormatado : ''
            }
          }

          if (addressLocated) {
            this.setState({ address: addressLocated });
          } else {
            throw new Exception('Não foi possível obter os dados corretos do endereço.');
          }
        } else {
          NotificationAlert('Nenhum endereço encontrado');
        }
      })
      .catch(error => {
        if (error.response) {
          NotificationAlert('Erro ao obter lista de endereços favoritos. Código: ' + error.response.status);
        } else {
          NotificationAlert('Erro ao obter lista de endereços favoritos.');
        }
      });
  }

  getGeolocation = async () => {
    await this.verifyLocationPermission();
    if (this.state.locationPermission === false) {
      NotificationAlert('Habilite o acesso ao GPS do seu dispositivo', 'Erro de Permissão');
    } else {
      Geolocation.getCurrentPosition(
        (position) => {
          if (position.coords) {
            this.setState({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude
            });

            this.getAddressByGPS();
          } else {
            NotificationAlert('Problema com o seu GPS', 'Verifique GPS');
          }
        },
        (error) => {
          NotificationAlert('Não foi possível identificar a sua localização', 'Verifique GPS');
        },
        { enableHighAccuracy: true, timeout: 1500, maximumAge: 10000 }
      );
    }
  }

  render() {
    return (
      <KeyboardAvoidingView style={[Styles.body, Styles.whiteBg]}>
        <View style={[Styles.contentContainer, { padding: 50 }]}>
          <Icon
            type={typeIconDefault}
            name='map-marker-plus'
            style={[Styles.font30, Styles.yellowColor, { fontSize: 70 }]} />

          {this.state.address != null ? (
            <View style={[Styles.horizontalContainer]}>
              <View style={[{ flex: 1, marginLeft: 10 }]}>
                <Text style={[Styles.textSmallBox, Styles.fontBold, { paddingBottom: 0 }]}>Endereço localizado:</Text>
                <Text style={[Styles.textSmallBox]}>{this.state.address.formatado}</Text>
              </View>
            </View>
          ) : (
              <View style={Styles.p20}>
                <Text style={[
                  Styles.font14,
                  Styles.fontUppercase,
                  Styles.fontBold,
                  Styles.grayColor]}>Buscando sua localização...</Text>
              </View>
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

const mapDispatchToProps = { deliveryAddressAction }

export default connect(mapStateToProps, mapDispatchToProps)(GPSDeliveryAddressPage);
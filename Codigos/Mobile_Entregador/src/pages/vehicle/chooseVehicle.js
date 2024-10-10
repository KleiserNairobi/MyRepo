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
import { vehicleRegisterAction } from '../../store/slices/vehicleSlice';

const typeIconDefault = "MaterialCommunityIcons";

class ChooseVehiclePage extends React.Component {

  btnInsert = () => {
    this.props.navigation.push('InsertVehicle');
  }

  btnFavorite = () => {
    this.props.navigation.push('ListFavoriteVehicle');
  }

  render() {
    return (
      <KeyboardAvoidingView style={Styles.body}>
        <Container>
          <Content>
            <View style={[Styles.container, { padding: 50 }]}>
              <Icon
                type={typeIconDefault}
                name='car'
                style={[Styles.font30, Styles.yellowColor, { fontSize: 70 }]} />
              <View style={[Styles.p10, { alignItems:'center' }]}>
                <Text style={[
                  Styles.font14,
                  Styles.fontUppercase,
                  Styles.fontBold,
                  Styles.grayColor]}>Como deseja definir o </Text>
                <Text style={[
                  Styles.font14,
                  Styles.fontUppercase,
                  Styles.fontBold,
                  Styles.grayColor]}>seu veículo?</Text>
              </View>
            </View>
            <View style={[Styles.container, Styles.mInternalBox]}>
              <TouchableOpacity
                style={[Styles.largeBlockButton, Styles.m10]}
                onPress={this.btnInsert}>
                <Text style={Styles.textButton}>Inserir um novo</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[Styles.largeBlockButton, Styles.m10]}
                onPress={this.btnFavorite}>
                <Text style={Styles.textButton}>Selecionar nos favoritos</Text>
              </TouchableOpacity>
            </View>
          </Content>
        </Container>
      </KeyboardAvoidingView>
    )
  }
}

const mapDispatchToProps = { vehicleRegisterAction }

export default connect(null, mapDispatchToProps)(ChooseVehiclePage);
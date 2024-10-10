import React from 'react';
import { connect } from 'react-redux';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity
} from 'react-native';
import { 
  Item, 
  ListItem, 
  CheckBox,
} from 'native-base';

import Styles from '../../assets/scss/styles';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Brand from '../../components/general/brand';
import { personMarketSegmentAction } from '../../store/slices/personSlice';

class RegisterMarketSegmentPage extends React.Component {
  state = {
    ramoAtividade: this.props.ramoAtividade,
    outroRamoAtividade: '',
  }

  btnReturn = () => {
    this.props.navigation.navigate('RegisterPassword');
  }

  btnNext = async () => {
    if (this.state.ramoAtividade 
      && this.state.ramoAtividade.length > 1
      && this.state.ramoAtividade.length <= 45) {

        if (this.state.ramoAtividade == 'Outro') {
          await this.props.updateMarketSegment({ ramoAtividade: this.state.outroRamoAtividade });
        } else {
          await this.props.updateMarketSegment({ ramoAtividade: this.state.ramoAtividade });
        }
    }

    this.props.navigation.navigate('RegisterDocuments');
  }

  validateInput = (input, valueInput) => {
    switch (input) {
      case 'ramoAtividade':
        this.setState({ ramoAtividade: valueInput });
        break;
      case 'outroRamoAtividade':
        this.setState({ outroRamoAtividade: valueInput });
        break;
    }
  }

  render() {
    return (
      <KeyboardAwareScrollView style={Styles.body}>
        <Brand />
        <View style={Styles.contentContainer}>
          <View style={Styles.textBox}>
            <Text style={Styles.fontBoxDefault}>SUA EMPRESA PERTENCE A </Text>
            <Text style={Styles.fontBoxDefault}>QUAL SEGMENTO DE MERCADO?</Text>
          </View>
          <View style={[Styles.formContainer]}>
            <ListItem style={{ paddingTop: 5, paddingBottom: 5 }}>
              <CheckBox
                color="black"
                checked={(this.state.ramoAtividade == 'Pizzaria') ? true : false}
                onPress={() => this.validateInput('ramoAtividade', 'Pizzaria')} />
              <Text style={[Styles.font20, Styles.grayColor, { marginLeft: 10 }]}>Pizzaria</Text>
            </ListItem>
            <ListItem style={{ paddingTop: 5, paddingBottom: 5 }}>
              <CheckBox
                color="black"
                checked={(this.state.ramoAtividade == 'Restaurante') ? true : false}
                onPress={() => this.validateInput('ramoAtividade', 'Restaurante')} />
              <Text style={[Styles.font20, Styles.grayColor, { marginLeft: 10 }]}>Restaurante</Text>
            </ListItem>
            <ListItem style={{ paddingTop: 5, paddingBottom: 5 }}>
              <CheckBox
                color="black"
                checked={(this.state.ramoAtividade == 'Farmárcia') ? true : false}
                onPress={() => this.validateInput('ramoAtividade', 'Farmárcia')} />
              <Text style={[Styles.font20, Styles.grayColor, { marginLeft: 10 }]}>Farmácia</Text>
            </ListItem>
            <ListItem style={{ paddingTop: 5, paddingBottom: 5 }}>
              <CheckBox
                color="black"
                checked={(this.state.ramoAtividade == 'Escritório') ? true : false}
                onPress={() => this.validateInput('ramoAtividade', 'Escritório')} />
              <Text style={[Styles.font20, Styles.grayColor, { marginLeft: 10 }]}>Escritório</Text>
            </ListItem>
            <ListItem style={{ paddingTop: 5, paddingBottom: 5 }}>
              <CheckBox
                color="black"
                checked={(this.state.ramoAtividade == 'E-commerce') ? true : false}
                onPress={() => this.validateInput('ramoAtividade', 'E-commerce')} />
              <Text style={[Styles.font20, Styles.grayColor, { marginLeft: 10 }]}>E-commerce</Text>
            </ListItem>
            <ListItem style={{ paddingTop: 5, paddingBottom: 5 }}>
              <CheckBox
                color="black"
                checked={(this.state.ramoAtividade == 'Outro') ? true : false}
                onPress={() => this.validateInput('ramoAtividade', 'Outro')} />
              <Text style={[Styles.font20, Styles.grayColor, { marginLeft: 10 }]}>Outro</Text>
            </ListItem>
            {
              (this.state.ramoAtividade == 'Outro') ? (
                <Item>
                  <TextInput
                    ref="outroRamoAtividade"
                    placeholder="DIGITE O OUTRO SEGMENTO"
                    placeholderLabel="DIGITE O OUTRO SEGMENTO"
                    placeholderTextColor="#575757"
                    maxLength={45}
                    style={Styles.inputText}
                    value={this.state.outroRamoAtividade}
                    onChangeText={valueInput => this.validateInput('outroRamoAtividade', valueInput)} />
                </Item>
              ) : null
            }
          </View>
          <TouchableOpacity
            style={Styles.largeButton}
            onPress={this.btnNext}>
            <Text style={Styles.textButton}>CONTINUAR</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={Styles.smallButton}
            onPress={this.btnReturn}>
            <Text style={Styles.textButton}>VOLTAR</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAwareScrollView>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    ramoAtividade: state.pessoa.ramoAtividade,
  }
}

const mapDispatchToProps = dispatch => {
  return {
    updateMarketSegment: segment => dispatch(personMarketSegmentAction(segment))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(RegisterMarketSegmentPage);
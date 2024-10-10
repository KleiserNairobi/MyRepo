import React from 'react';
import { connect } from 'react-redux';
import {
  View,
  Modal,
  KeyboardAvoidingView,
  Text,
  FlatList,
  TouchableOpacity
} from 'react-native';
import { StyleProvider, Icon } from 'native-base';
import getTheme from '../../native-base-theme/components';
import material from '../../native-base-theme/variables/material';
import ValidationComponent from 'react-native-form-validator';
import { RNCamera } from 'react-native-camera';

import Styles from '../../assets/scss/styles';
import { NotificationAlert } from '../../components/general/alerts';
import Brand from '../../components/general/brand';
import { 
  CNHAction, 
  CRLVAction, 
  enderecoAction 
} from '../../store/slices/photosSlice';
import CameraModal from '../../components/general/cameraModal';

const typeIconDefault = "MaterialCommunityIcons";

class RegisterDocumentsPage extends ValidationComponent {
  constructor(props) {
    super(props);
    this.errors = [];
    this.deviceLocale = "ptBR";
    this.state = {
      error: false,
      pessoa: props.pessoa ? props.pessoa : null,
      documentoVeiculo: null,
      documentoHabilitacao: null,
      documentoEndereco: null,
      list: [
        {
          id: 1,
          descricao: 'Documento de Habilitação',
          ref: 'documentoHabilitacao'
        },
        {
          id: 2,
          descricao: 'Documento do Veículo',
          ref: 'documentoVeiculo'          
        },
        {
          id: 3,
          descricao: 'Comprovante de Endereço',
          ref: 'documentoEndereco'
        },
      ],
      cameraDocumentSelected: '',
      cameraModalOpened: false,
    }
  }

  btnReturn = () => {
    if (this.state.pessoa && this.state.pessoa.tipo == 'J') {
      this.props.navigation.navigate('RegisterMarketSegment');
    } else {
      this.props.navigation.navigate('RegisterPassword');
    }
  }

  btnNext = async () => {
    if (this.state.documentoHabilitacao) {
      await this.props.CNHAction({
        caminhoArquivo: this.state.documentoHabilitacao.uri,
        conteudoArquivo: this.state.documentoHabilitacao.base64
      });
    } else {
      this.setState({
        error: true
      }, () => {
        NotificationAlert('Informe a foto do Documento de Habilitação');
      });
    }

    if (this.state.documentoVeiculo) {
      await this.props.CRLVAction({
        caminhoArquivo: this.state.documentoVeiculo.uri,
        conteudoArquivo: this.state.documentoVeiculo.base64
      });
    } else {
      this.setState({
        error: true
      }, () => {
        NotificationAlert('Informe a foto do Documento do Veículo');
      });
    }

    if (this.state.documentoEndereco) {
      await this.props.enderecoAction({
        caminhoArquivo: this.state.documentoEndereco.uri,
        conteudoArquivo: this.state.documentoEndereco.base64
      });
    } else {
      this.setState({
        error: true
      }, () => {
        NotificationAlert('Informe a foto do Comprovante de Endereço');
      });
    }

    if (this.state.error === false) {
      this.props.navigation.navigate('RegisterTerms');
    }
  }

  btnCapturePhoto = (photoData) => {
    switch(this.state.cameraDocumentSelected) {
      case 'documentoHabilitacao':
        this.setState({ documentoHabilitacao: photoData });
        break;
      case 'documentoVeiculo':
        this.setState({ documentoVeiculo: photoData });
        break;
      case 'documentoEndereco':
        this.setState({ documentoEndereco: photoData });
        break;
    }
  }

  btnDeletePhoto = () => {
    switch(this.state.cameraDocumentSelected) {
      case 'documentoHabilitacao':
        this.setState({ documentoHabilitacao: '' });
        break;
      case 'documentoVeiculo':
        this.setState({ documentoVeiculo: '' });
        break;
      case 'documentoEnderecoo':
        this.setState({ documentoEndereco: '' });
        break;
    }
  }

  btnRegisterPhoto = () => { 
    if (this.state.cameraDocumentSelected) {
      switch(this.state.cameraDocumentSelected) {
        case 'documentoHabilitacao':
          if (!this.state.documentoHabilitacao) {
            NotificationAlert('Não foi possível armazenar o documento de habilitação');
          }
          break;
        case 'documentoVeiculo':
          if (!this.state.documentoVeiculo) {
            NotificationAlert('Não foi possível armazenar o documento do veículo');
          }
          break;
        case 'documentoEndereco':
          if (!this.state.documentoEndereco) {
            NotificationAlert('Não foi possível armazenar o comprovante de endereço');
          }
          break;
      }

      // Fechando Modal da Camera
      this.btnCameraModalClose();
    }
  }

  btnCameraModalClose = () => this.setState({
    cameraModalOpened: !this.state.cameraModalOpened,
    cameraDocumentSelected: ''
  });

  validateInput = (input, valueInput) => {
    switch (input) {
      case 'documentoHabilitacao':
        this.setState({ documentoHabilitacao: valueInput });
        break;
      case 'documentoVeiculo':
        this.setState({ documentoVeiculo: valueInput });
        break;
      case 'documentoEndereco':
        this.setState({ documentoEndereco: valueInput });
        break;
      case 'cameraModalOpened':
        this.state.list.map((documentCurrent) => {
          if (documentCurrent.ref == valueInput) {
            this.setState({ 
              cameraDocumentSelected: documentCurrent.ref 
            }, () => { 
              this.setState({ cameraModalOpened: !this.state.cameraModalOpened });
            });
          }
        });
        break;
    }
  }

  renderItemList = ({ item }) => {
    let iconCurrent = (this.state[item.ref]) ? 'check' : 'camera';

    return (
      <TouchableOpacity
        style={[Styles.whiteBorder, Styles.p10, { borderBottomWidth: 1 }]}
        onPress={() => this.validateInput('cameraModalOpened', item.ref)}>
        <View style={[Styles.horizontalContainer, { justifyContent: 'space-between' }]}>
          <Text style={[Styles.textSmallBox, Styles.fontBold, Styles.fontUppercase]}>{item.descricao}</Text>
          <Icon
            type={typeIconDefault}
            name={iconCurrent}
            style={[Styles.font30, Styles.whiteColor]} />
        </View>
      </TouchableOpacity>
    )
  }

  render() {
    return (
      <StyleProvider style={getTheme(material)}>
        <KeyboardAvoidingView style={Styles.body}>
          <Brand />
          <View style={Styles.contentContainer}>
            <View style={Styles.textBox}>
              <Text style={Styles.fontBoxDefault}>ADICIONE IMAGENS DOS SEUS DOCUMENTOS</Text>
            </View>
            <CameraModal 
              isVisible={this.state.cameraModalOpened}
              onChangePhoto={this.btnCapturePhoto}
              onDeletePhoto={this.btnDeletePhoto}
              onRegisterPhoto={this.btnRegisterPhoto}
              onCloseCamera={this.btnCameraModalClose}
              />
            <View style={[Styles.container, { flex: 0, width: '80%', height: '50%' }]}>
              <FlatList
                data={this.state.list}
                renderItem={this.renderItemList}
                keyExtractor={(item) => item.id.toString()}
                style={{ width: '100%' }} />
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
        </KeyboardAvoidingView>
      </StyleProvider>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    senha: state.usuario.senha,
    repeteSenha: state.usuario.senha,
    pessoa: state.pessoa
  }
}

const mapDispatchToProps = { CNHAction, CRLVAction, enderecoAction }

export default connect(mapStateToProps, mapDispatchToProps)(RegisterDocumentsPage);
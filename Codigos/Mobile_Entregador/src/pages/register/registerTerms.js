import React from 'react';
import { connect } from 'react-redux';
import { 
  View, 
  TouchableOpacity, 
  KeyboardAvoidingView, 
  Platform 
} from 'react-native';
import { Item, Textarea, CheckBox, Text } from 'native-base';

import Styles from '../../assets/scss/styles';
import { NotificationAlert } from '../../components/general/alerts';
import Brand from '../../components/general/brand';
import ListErrors from '../../components/general/listErrors';
import API from '../../services/api';
import { 
  CNHLinkAction,
  CRLVLinkAction,
  enderecoLinkAction
} from '../../store/slices/photosSlice';

class RegisterTermsPage extends React.Component {
  state = {
    usuario: this.props.usuario,
    pessoa: this.props.pessoa,
    endereco: this.props.endereco,
    fotos: this.props.fotos,
    termo: this.props.termo,
    aceitaTermo: false,
  }

  btnReturn = () => {
    this.props.navigation.navigate('RegisterDocuments');
  }

  btnNext = () => {
    if (this.state.aceitaTermo === true) {

      // Dados para registro no Webservice
      let registerData = {
        tipoPessoa: 'F',
        nome: this.state.pessoa.nome,
        email: this.state.pessoa.email,
        telefone: this.state.pessoa.telefone,
        cpfCnpj: this.state.pessoa.cpfCnpj ? this.state.pessoa.cpfCnpj : null,
        rg: this.state.pessoa.rg ? this.state.pessoa.rg : null,
        nascimento: this.state.pessoa.nascimento ? this.state.pessoa.nascimento : null,
        nomeFantasia: this.state.pessoa.nomeFantasia ? this.state.pessoa.nomeFantasia : null,
        ramoAtividade: this.state.pessoa.ramoAtividade ? this.state.pessoa.ramoAtividade : null,
        cliente: false,
        entregador: true,
        parceiro: false,
        cep: this.state.endereco.cep,
        logradouro: this.state.endereco.logradouro,
        numero: this.state.endereco.numero ? this.state.endereco.numero : 's/n',
        complemento: this.state.endereco.complemento ? this.state.endereco.complemento : 'nada consta',
        bairro: this.state.endereco.bairro,
        referencia: this.state.endereco.referencia ? this.state.endereco.referencia : null,
        municipio: this.state.endereco.cidade,
        estado: this.state.endereco.estado,
        latitude: null,
        longitude: null,
        proprio: true,
        senha: this.state.usuario.senha,
      };
      if (this.state.pessoa && this.state.pessoa.tipo == 'J') {
        registerData = {
          ...registerData,
          tipoPessoa: 'J'
        }
      }

      API().post(`registros`, registerData)
        .then(res => {
          if (res && res.data) {
            this.registerPhotos(res.data.id);
          } else {
            NotificationAlert('Não foi possível registrar seus dados. Tente novamente.');
          }
        })
        .catch(error => {
          if (error && error.response && error.response.data) {
            NotificationAlert(ListErrors(error.response.data));
          } else {
            NotificationAlert('Erro ao registrar seus dados.');
          }
        });

    } else {
      NotificationAlert('É necessário aceitar o termo');
    }
  }

  registerPhotos = async (idPessoa) => {
    let countErrors = 0;
    let registerPhotoData = null;

    // CNH
    if (this.state.fotos.CNH) {
      registerPhotoData = new FormData();
      registerPhotoData.append('arquivo', {
        uri:  Platform.OS === "android" ? this.state.fotos.CNH.caminhoArquivo : this.state.fotos.CNH.caminhoArquivo.replace("file://", ""), 
        name: `docsmobile${Date.now()}.jpg`,
        type: 'image/jpeg'
      });
      registerPhotoData.append('contentType','image/jpeg');
      registerPhotoData.append('descricao', this.state.fotos.CNH.descricao);
      registerPhotoData.append('tipoFoto', this.state.fotos.CNH.tipoFoto);

      await API()
        .post(`/registros/${idPessoa}/foto`, registerPhotoData)
        .then(res => {
          if (res && res.data) {
            this.props.CNHLinkAction({
              link: res.data.link
            });
          }
        })
        .catch(error => {
          countErrors++;
        });
    }

    // CRLV
    if (this.state.fotos.CRLV) {
      registerPhotoData = new FormData();
      registerPhotoData.append('arquivo', {
        uri:  Platform.OS === "android" ? this.state.fotos.CRLV.caminhoArquivo : this.state.fotos.CRLV.caminhoArquivo.replace("file://", ""), 
        name: `docsmobile${Date.now()}.jpg`,
        type: 'image/jpeg'
      });
      registerPhotoData.append('contentType','image/jpeg');
      registerPhotoData.append('descricao', this.state.fotos.CRLV.descricao);
      registerPhotoData.append('tipoFoto', this.state.fotos.CRLV.tipoFoto);

      await API()
        .post(`/registros/${idPessoa}/foto`, registerPhotoData)
        .then(res => {
          if (res && res.data) {
            this.props.CRLVLinkAction({
              link: res.data.link
            });
          }
        })
        .catch(error => {
          countErrors++;
        });
    }

    // Endereco
    if (this.state.fotos.endereco) {
      registerPhotoData = new FormData();
      registerPhotoData.append('arquivo', {
        uri:  Platform.OS === "android" ? this.state.fotos.endereco.caminhoArquivo : this.state.fotos.endereco.caminhoArquivo.replace("file://", ""), 
        name: `docsmobile${Date.now()}.jpg`,
        type: 'image/jpeg'
      });
      registerPhotoData.append('contentType','image/jpeg');
      registerPhotoData.append('descricao', this.state.fotos.endereco.descricao);
      registerPhotoData.append('tipoFoto', this.state.fotos.endereco.tipoFoto);

      await API()
        .post(`/registros/${idPessoa}/foto`, registerPhotoData)
        .then(res => {
          if (res && res.data) {
            this.props.enderecoLinkAction({
              link: res.data.link
            });
          }
        })
        .catch(error => {
          countErrors++;
        });
    }

    if (countErrors > 0) {
      NotificationAlert('Não foi possível enviar todas imagens informadas.'+
        'Entre em contato com nossa central de atendimento ao cliente.');
    }

    this.props.navigation.navigate('RegisterFinished');
  }

  validateInput = (input, valueInput) => {
    switch (input) {
      case 'aceitaTermo':
        if (this.state.aceitaTermo === true) {
          this.setState({ aceitaTermo: false });
        } else {
          this.setState({ aceitaTermo: true });
        }
        break;
    }
  }

  render() {
    return (
      <KeyboardAvoidingView style={Styles.body}>
        <Brand />
        <View style={Styles.contentContainer}>
          <View style={Styles.textBox}>
            <Text style={Styles.fontBoxDefault}>PARA ENCERRAR, VOCÊ PRECISA ESTAR DE ACORDO COM </Text>
            <Text style={Styles.fontBoxDefault}>OS NOSSOS TERMOS DE USO E POLÍTICA DE PRIVACIDADE</Text>
          </View>
          <View style={Styles.formContainer}>
            <Item>
              <Textarea style={Styles.textarea} rowSpan={7}>{this.state.termo}</Textarea>
            </Item>
            <Item style={[Styles.p10, { paddingHorizontal: 0, borderBottomWidth: 0 }]}>
              <CheckBox
                ref="aceitaTermo"
                color="black"
                checked={this.state.aceitaTermo}
                style={Styles.checkbox}
                onPress={valueInput => this.validateInput('aceitaTermo', valueInput)} />
              <TouchableOpacity
                onPress={valueInput => this.validateInput('aceitaTermo', !this.state.aceitaTermo)}>
                <Text style={[{ marginLeft: 15 }]}>Li e aceito os termos de condiçōes de uso</Text>
              </TouchableOpacity>
            </Item>
          </View>
          <TouchableOpacity
            style={Styles.largeButton}
            onPress={this.btnNext}>
            <Text style={Styles.textButton}>CONFIRMAR</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={Styles.smallButton}
            onPress={this.btnReturn}>
            <Text style={Styles.textButton}>VOLTAR</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    usuario: state.usuario,
    pessoa: state.pessoa,
    endereco: state.endereco,
    fotos: state.fotos,
    termo: state.configuracoes.termo,
    token: state.configuracoes.token
  }
}

const mapDispatchToProps = {
  CNHLinkAction,
  CRLVLinkAction,
  enderecoLinkAction
}

export default connect(mapStateToProps, mapDispatchToProps)(RegisterTermsPage);
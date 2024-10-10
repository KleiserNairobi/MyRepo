import React from 'react';
import { connect } from 'react-redux';
import {
  View,
  KeyboardAvoidingView,
  Text,
  Image,
  TouchableOpacity,
  BackHandler
} from 'react-native';
import { Icon } from 'native-base';

import Styles from '../../assets/scss/styles';
import { NotificationAlert, ConfirmAlert } from '../../components/general/alerts';
import { logoutAction } from '../../store/slices/userSlice';
import { personInitialStateAction } from '../../store/slices/personSlice';
import { deliveryInitialStateAction } from '../../store/slices/deliverySlice';
import {
  configInitialStateAction,
  webSocketReconnectAction
} from '../../store/slices/configSlice';
import {
  perfilAction,
  perfilLinkAction
} from '../../store/slices/photosSlice';
import API from '../../services/api';
import CameraModal from '../../components/general/cameraModal';

const typeIconDefault = "MaterialCommunityIcons";

class AccountPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      pessoa: props.pessoa ? props.pessoa : null,
      usuario: props.usuario ? props.usuario : null,
      token: props.configuracoes ? props.configuracoes.token : null,
      wSocket: props.configuracoes ? props.configuracoes.wSocket : null,
      foto: (props.fotos && props.fotos.perfil) ? props.fotos.perfil.linkWebservice : null,
      cameraPhoto: null,
      cameraModalOpened: false,
    }
  }

  componentDidMount() {
    this.verifyToken;
  }

  verifyToken = () => {
    if (!this.state.token) {
      BackHandler.exitApp();
    }
  }

  btnEditPerfil = () => {
    this.props.navigation.navigate('EditPerfil');
  }

  btnChangePassword = () => {
    ConfirmAlert((confirm) => {
      if (confirm) {
        API({ token: this.state.token })
          .get(`emails/${this.state.usuario.email}/recuperar-senha`)
          .then(res => {
            if (res.status == 200 || res.status == 204) {
              NotificationAlert('Instruções foram enviadas para seu e-mail', 'Sucesso');
            } else {
              NotificationAlert('Não foi possível solicitar uma nova senha');
            }
          })
          .catch(error => {
            if (error && error.response && error.response.data) {
              NotificationAlert(ListErrors(error.response.data));
            } else {
              NotificationAlert('Não foi possível solicitar uma nova senha');
            }
          });
      }
    }, 'Deseja realmente alterar a senha?', 'Alterar senha');
  }

  btnSair = async () => {
    // Fechando conexao com Socket
    if (this.state.wSocket) {
      // Desconectando do WebSocket
      await this.state.wSocket.close();
    }

    // Removendo dados do usuario logado na store
    await this.props.logout();

    // Removendo token do State
    this.setState({ token: null });

    // Redirecionando para tela de login
    this.props.navigation.push('Login');
  }

  btnCapturePhoto = (photoData) => this.setState({ 
    cameraPhoto: photoData 
  });

  btnDeletePhoto = () => this.setState({
    foto: (this.props.fotos && this.props.fotos.perfil) ? this.props.fotos.perfil.linkWebservice : null,
  });

  btnRegisterPhoto = async () => {
    let registerPhotoData = null;

    // Foto de Perfil
    if (this.state.cameraPhoto) {
      registerPhotoData = new FormData();
      registerPhotoData.append('arquivo', {
        uri: Platform.OS === "android" ? this.state.cameraPhoto.uri : this.state.cameraPhoto.uri.replace("file://", ""),
        name: `docsmobile${Date.now()}.jpg`,
        type: 'image/jpeg'
      });
      registerPhotoData.append('contentType', 'image/jpeg');
      registerPhotoData.append('descricao', 'FOTO DO PERFIL');
      registerPhotoData.append('tipoFoto', 'P');

      await API()
        .post(`/registros/${this.state.pessoa.id}/foto`, registerPhotoData)
        .then(res => {
          if (res && res.data) {
            this.setState({
              foto: res.data.link,
              cameraModalOpened: false
            }, async () => {
              await this.props.uploadPhotoPerfil({
                caminhoArquivo: this.state.cameraPhoto.uri,
                conteudoArquivo: this.state.cameraPhoto.base64
              });

              this.props.uploadLinkPhotoPerfil({
                link: res.data.link
              });
            });
          }
        })
        .catch(error => {
          NotificationAlert('Não foi possível enviar a imagem informada.');
        });
    }
  }

  btnCameraModalClose = () => this.setState({
    cameraModalOpened: false
  });

  render() {
    return (
      <KeyboardAvoidingView style={Styles.body}>
        <View style={[Styles.container, { marginTop: '15%' }]}>
          {(this.state.foto) ? (
            <TouchableOpacity
              onPress={() => this.setState({ cameraModalOpened: true })}>
              <Image
                style={{ width: 110, height: 110, borderRadius: 55 }}
                source={{ uri: this.state.foto }} />
              <Icon
                type={typeIconDefault}
                name="camera"
                style={[
                  Styles.blackColor,
                  { fontSize: 25, textAlign: 'center' }
                ]} />
            </TouchableOpacity>
          ) : (
              <TouchableOpacity
                onPress={() => this.setState({ cameraModalOpened: true })}>
                <Icon
                  type={typeIconDefault}
                  name="account-circle"
                  style={[Styles.blackColor, { fontSize: 100 }]} />
                <Icon
                  type={typeIconDefault}
                  name="camera"
                  style={[
                    Styles.blackColor,
                    { fontSize: 25, textAlign: 'center' }
                  ]} />
              </TouchableOpacity>
            )}
        </View>
        <CameraModal 
          isVisible={this.state.cameraModalOpened}
          onChangePhoto={this.btnCapturePhoto}
          onDeletePhoto={this.btnDeletePhoto}
          onRegisterPhoto={this.btnRegisterPhoto}
          onCloseCamera={this.btnCameraModalClose}
        />
        <View style={[Styles.contentContainer, { marginTop: 15 }]}>
          <Text
            style={[
              Styles.textBox,
              Styles.fontBold,
              Styles.font20
            ]}>{this.state.pessoa.nome}</Text>
          <Text style={Styles.font16}>{this.state.pessoa.email}</Text>
          <Text style={Styles.font16}>{this.state.pessoa.telefone}</Text>
          <View style={Styles.container}>
            <TouchableOpacity
              style={Styles.defaultButton}
              onPress={this.btnEditPerfil}>
              <Text style={Styles.textButton}>Editar Perfil</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={Styles.defaultButton}
              onPress={this.btnChangePassword}>
              <Text style={Styles.textButton}>Alterar senha</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={Styles.defaultButton}
              onPress={this.btnSair}>
              <Text style={Styles.textButton}>Sair</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    usuario: state.usuario,
    pessoa: state.pessoa,
    configuracoes: state.configuracoes,
    fotos: state.fotos,
  }
}

const mapDispatchToProps = dispatch => {
  return {
    logout: () => {
      dispatch(configInitialStateAction());
      dispatch(personInitialStateAction());
      dispatch(logoutAction());
      dispatch(deliveryInitialStateAction());
    },
    updateWebSocketReconnect: reconnect => {
      dispatch(webSocketReconnectAction(reconnect));
    },
    uploadPhotoPerfil: photo => {
      dispatch(perfilAction(photo));
    },
    uploadLinkPhotoPerfil: link => {
      dispatch(perfilLinkAction(link));
    },
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(AccountPage);
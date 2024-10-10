import React from 'react';
import { connect } from 'react-redux';
import {
  View,
  Modal,
  KeyboardAvoidingView,
  Text,
  Image,
  TouchableOpacity,
  BackHandler
} from 'react-native';
import { Icon } from 'native-base';
import { RNCamera } from 'react-native-camera';

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

const typeIconDefault = "MaterialCommunityIcons";
const PendingView = () => (
  <View
    style={[Styles.blackBg, {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center'
    }]}
  >
    <Text>Carregando...</Text>
  </View>
);

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
            NotificationAlert('Instruções foram enviadas para seu e-mail','Sucesso');
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
    }, 'Deseja realmente alterar a senha?','Alterar senha');
  }

  btnSair = async () => {
    // Fechando conexao com Socket
    if (this.state.wSocket) {
      // Desconectando do WebSocket
      await this.state.wSocket.close();
    }

    // Removendo dados do usuário logado na Store
    await this.props.logout();

    // Removendo token do State
    this.setState({ token: null });

    // Redirecionando para tela de login
    this.props.navigation.push('Login');
  }

  registerPhoto = async () => {
    let registerPhotoData = null;

    // Foto de Perfil
    if (this.state.cameraPhoto) {
      registerPhotoData = new FormData();
      registerPhotoData.append('arquivo', {
        uri:  Platform.OS === "android" ? this.state.cameraPhoto.uri : this.state.cameraPhoto.uri.replace("file://", ""), 
        name: `docsmobile${Date.now()}.jpg`,
        type: 'image/jpeg'
      });
      registerPhotoData.append('contentType','image/jpeg');
      registerPhotoData.append('descricao', 'FOTO DO PERFIL');
      registerPhotoData.append('tipoFoto', 'P');

      await API()
        .post(`/registros/cliente-pf/${this.state.pessoa.id}/foto`, registerPhotoData)
        .then(res => {
          if (res && res.data) {
            this.setState({
              foto: res.data.link
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

  takePicture = async function (camera) {
    const options = {
      quality: 0.5,
      base64: true,
      forceUpOrientation: true,
      fixOrientation: true,
      width: 480,
      height: 640
    };
    const photoData = await camera.takePictureAsync(options);

    if (photoData.base64) {
      this.setState({
        cameraPhoto: photoData,
        cameraModalOpened: false
      }, () => {
        this.registerPhoto();
      });
    } else {
      NotificationAlert('Ocorreu um erro durante a captura da imagem');
    }
  };

  cameraModalClose = () => this.setState({
    cameraModalOpened: false
  });

  renderModalCamera = () => {
    return (
      <Modal
        visible={this.state.cameraModalOpened}
        transparent={true}
        animationType="slide"
        onRequestClose={this.cameraModalClose}
      >
        <View style={[Styles.container, Styles.yellowBg]}>
          <View style={[
            Styles.contentContainer,
            {
              width: '100%',
              backgroundColor: 'black'
            }
          ]}>
            <RNCamera
              style={{
                flex: 1,
                justifyContent: 'flex-end',
                alignItems: 'center',
              }}
              type={RNCamera.Constants.Type.back}
              autoFocus={RNCamera.Constants.AutoFocus.on}
              flashMode={RNCamera.Constants.FlashMode.off}
              captureAudio={false}
              androidCameraPermissionOptions={{
                title: 'Permissão para usar a câmera',
                message: 'Nós precisamos da sua permissão para acessar a câmera',
                buttonPositive: 'Permitir',
                buttonNegative: 'Negar',
              }}
            >
              {({ camera, status }) => {
                if (status !== 'READY') return <PendingView />;
                return (
                  <View style={{ flex: 0, flexDirection: 'row', justifyContent: 'center' }}>
                    <TouchableOpacity
                      style={[Styles.yellowBg, {
                        flex: 0,
                        borderRadius: 50,
                        borderColor: '#ffffff',
                        borderWidth: 2,
                        padding: 30,
                        alignSelf: 'center',
                        margin: 25
                      }]}
                      onPress={() => this.takePicture(camera)} >
                      <Icon
                        type={typeIconDefault}
                        name="camera"
                        style={[Styles.font30, Styles.blackColor]} />
                    </TouchableOpacity>
                  </View>
                );
              }}
            </RNCamera>
          </View>
          <View style={[Styles.horizontalContainer, { flex: 0, width: '100%' }]}>
            <TouchableOpacity
              style={Styles.smallButton}
              onPress={this.cameraModalClose}>
              <Text style={Styles.textButton}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  }

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
        {this.renderModalCamera()}
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
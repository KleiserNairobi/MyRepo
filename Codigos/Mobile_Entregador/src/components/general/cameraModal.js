import React, { useState } from "react";
import {
  View,
  Modal,
  Text,
  ImageBackground,
  TouchableOpacity
} from "react-native";
import { Icon } from 'native-base';
import { RNCamera } from "react-native-camera";

import Styles from '../../assets/scss/styles';
import { NotificationAlert } from './alerts';

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

const CameraModal = ({
  isVisible,
  onChangePhoto,
  onDeletePhoto,
  onRegisterPhoto,
  onCloseCamera
}) => {
  const [showBtnSave, setShowBtnSave] = useState(false);
  const [showBtnDelete, setShowBtnDelete] = useState(false);
  const [imageUri, setImageUri] = useState(null);

  const clearScreen = () => {
    setShowBtnSave(false);
    setShowBtnDelete(false);
    setImageUri(null);
  }

  const takePicture = async (camera) => {
    try {
      const options = {
        quality: 0.5,
        base64: true,
        forceUpOrientation: true,
        fixOrientation: true,
        width: 480,
        height: 640
      };
      const pData = await camera.takePictureAsync(options);

      if (pData.base64) {
        setShowBtnSave(true);
        setShowBtnDelete(true);
        setImageUri(pData.uri);
        onChangePhoto(pData);
      } else {
        NotificationAlert('Ocorreu um erro durante a captura da imagem');
      }

    } catch (error) {
      NotificationAlert('Não foi possível capturar a imagem');
    }
  };

  const registerPicture = () => {
    clearScreen();
    onRegisterPhoto();
  }

  const deletePicture = () => {
    clearScreen();
    onDeletePhoto();
  }

  const closeModal = () => {
    clearScreen();
    onCloseCamera();
  }

  return (
    <Modal
      visible={isVisible}
      transparent={true}
      animationType="slide"
    >
      <View style={[Styles.container, Styles.yellowBg]}>
        <View style={[
          Styles.contentContainer,
          {
            width: '100%',
            backgroundColor: 'black'
          }
        ]}>
        {(imageUri) ? (
          <ImageBackground 
            style={{ width: '100%', height: '100%', flex: 1 }}
            source={{ uri: imageUri }}
            />
        ) : (
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
              if (status !== 'READY') {
                return <PendingView />;
              } else {
                return (
                  <View style={{ flex: 0, flexDirection: 'row', justifyContent: 'center' }}>
                    <TouchableOpacity
                      style={[Styles.yellowBg, {
                        flex: 0,
                        borderRadius: 50,
                        borderColor: '#ffffff',
                        borderWidth: 2,
                        padding: 25,
                        alignSelf: 'center',
                        margin: 20
                      }]}
                      onPress={() => takePicture(camera)} >
                      <Icon
                        type={typeIconDefault}
                        name="camera"
                        style={[Styles.font30, Styles.blackColor]} />
                    </TouchableOpacity>
                  </View>
                );
              }
            }}
          </RNCamera>
        )}
        </View>
        <View style={[Styles.horizontalContainer, { flex: 0, width: '100%', marginTop: -35 }]}>
          {(showBtnSave === true) ? (
            <TouchableOpacity
              style={[{
                flex: 0,
                borderRadius: 50,
                borderColor: '#ffffff',
                borderWidth: 2,
                padding: 20,
                alignSelf: 'center',
                margin: 15,
                backgroundColor: 'green'
              }]}
              onPress={registerPicture}>
              <Icon
                type={typeIconDefault}
                name="check"
                style={[Styles.font30, Styles.whiteColor]} />
            </TouchableOpacity>
          ) : null}
          {(showBtnDelete === true) ? (
            <TouchableOpacity
              style={[{
                flex: 0,
                borderRadius: 50,
                borderColor: '#ffffff',
                borderWidth: 2,
                padding: 20,
                alignSelf: 'center',
                margin: 15,
                backgroundColor: 'red'
              }]}
              onPress={deletePicture}>
              <Icon
                type={typeIconDefault}
                name="delete"
                style={[Styles.font30, Styles.whiteColor]} />
            </TouchableOpacity>
          ) : null}
        </View>
        <View style={[Styles.horizontalContainer, { flex: 0, width: '100%' }]}>
          <TouchableOpacity
            style={Styles.smallButton}
            onPress={closeModal}>
            <Text style={Styles.textButton}>Fechar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

export default CameraModal;
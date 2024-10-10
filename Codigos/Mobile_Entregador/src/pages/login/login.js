import React from 'react';
import { connect } from 'react-redux';
import {
  View,
  KeyboardAvoidingView,
  TouchableOpacity,
  Text,
  TextInput,
  Switch,
  BackHandler
} from 'react-native';
import { StyleProvider, Item, Icon } from 'native-base';
import getTheme from '../../native-base-theme/components';
import material from '../../native-base-theme/variables/material';
import ValidationComponent from 'react-native-form-validator';
import { TextInputMask } from 'react-native-masked-text';
import { URLSearchParams } from 'whatwg-url';
import { Buffer } from 'buffer';

global.Buffer = Buffer;
global.URLSearchParams = URLSearchParams;

import Styles from '../../assets/scss/styles';
import { NotificationAlert } from '../../components/general/alerts';
import Brand from '../../components/general/brand';
import { formatText } from '../../components/general/converter';
import { loginAction } from '../../store/slices/userSlice';
import { personRegisterAction } from '../../store/slices/personSlice';
import { tokenRegisterAction } from '../../store/slices/configSlice';
import { perfilLinkAction } from '../../store/slices/photosSlice';
import API from '../../services/api';
import ListErrors from '../../components/general/listErrors';
import { decrypt } from '../../components/general/utils';
import OAuthManager from 'react-native-social-login';
import { 
  GoogleSignin, 
  statusCodes
} from '@react-native-community/google-signin';
import SplashScreen from 'react-native-splash-screen'

const typeIconDefault = "MaterialCommunityIcons";
const jwtDecode = require('jwt-decode');
const socialLoginManager = new OAuthManager('chamaih');

class LoginPage extends ValidationComponent {
  constructor(props) {
    super(props);
    this.errors = [];
    this.deviceLocale = "ptBR";
    this.state = {
      error: false,
      tipoLogin: false, // false = Email, true = Telefone
      email: '',
      telefone: '',
      senha: '',
      senhaSocial: null,
      hidePassword: true,
      configuracoes: props.configuracoes,
    }

    // Redireciona caso ja exista o token do usuario
    if (props.configuracoes.token) {
      this.props.navigation.navigate('InternalApp');
    }
  }

  componentDidMount() {
    // Escondendo SplashScreen
    SplashScreen.hide();

    // Adicionando evento para o botão voltar do celular
    BackHandler.addEventListener('hardwareBackPress', () => {
      BackHandler.exitApp();
      return true;
    });

    socialLoginManager.configure({
      facebook: {
        client_id: '736922393845876',
        client_secret: '8817442073475efdd4145bda3bbe94fa'
      },
    });

    GoogleSignin.configure({
      androidClientId: '606096019057-9pa0gafbk5hg6fvts8qttalignraci8l.apps.googleusercontent.com',
    });
  }

  logar = () => {
    let login = this.state.tipoLogin === true ? this.state.telefone : formatText(this.state.email, 'lowercase');

    let formData = new URLSearchParams();
    formData.append('client', 'app-chamai-mobile');
    formData.append('username', login);
    formData.append('password', this.state.senha);
    formData.append('grant_type', 'password');

    try {
      API({ oauthToken: true }).post(`oauth/token`, formData)
        .then(res => {
          if (res.data) {
            if (res.data.access_token) {
              // Iniciando variaveis
              let idUser = 0;

              // Data atual
              let currentDay = new Date().getDate();
              let currentMonth = new Date().getMonth() + 1;
              let currentYear = new Date().getFullYear();

              // Decodificando JSON Web Token (JWT)
              let tokenData = jwtDecode(res.data.access_token);
              if (tokenData) {
                idUser = tokenData.id;
              }

              // Armazenando o token
              this.props.updateToken({
                token: res.data.access_token,
                dataToken: currentYear + '-' + currentMonth + '-' + currentDay,
                dataExpiracaoToken: res.data.expires_in
              });

              // Consultando dados do usuario
              API({ token: res.data.access_token })
                .get(`usuarios/${idUser}`)
                .then(res2 => {
                  if (res2 && res2.data) {
                    try {
                      // Validando situação do usuário
                      let erro = '';
                      if (res2.data.pessoa && res2.data.pessoa.ativo === false) {
                        erro = 'Cadastro Desativado';
                      } else if (res2.data.pessoa && res2.data.pessoa.entregador === false) {
                        erro = 'Cadastro não habilitado para Entregador';
                      }

                      // Consultando foto da pessoa
                      API({ token: res.data.access_token })
                        .get(`fotos/pessoa/${res2.data.pessoa.id}/tipo?tipoFoto=P`)
                        .then(res3 => {
                          if (res3 && res3.data) {
                            this.props.updatePhotoPerfil({
                              link: res3.data.link
                            });
                          }
                        });

                      if (erro.length) {
                        this.props.updateToken({
                          token: null,
                          dataToken: null,
                          dataExpiracaoToken: null
                        });
                        NotificationAlert(erro);
                      } else {
                        // Armazenando dados do usuário
                        this.props.onLogin({ ...res2.data });
                        this.props.navigation.push('InternalApp');
                      }
                    } catch (err) {
                      NotificationAlert('Erro ao acessa tela interna do APP');
                    }
                  }
                })
                .catch(error => {
                  NotificationAlert('Não foi possível buscar suas informaçōes');
                });
            } else {
              NotificationAlert('Token de acesso não recebido corretamente');
            }
          } else {
            NotificationAlert('Não foi possível efetuar a sua autenticação');
          }
        })
        .catch(error => {
          NotificationAlert('Não foi possível autenticar. Verifique os dados informados');
        });
    } catch (err) {
      NotificationAlert('Ocorreu um erro no aplicativo');
    }
  }

  logarFacebook = async () => {
    try {
      socialLoginManager.authorize('facebook')
        .then(resp => {
          if (resp.authorized === true) {
            let accessTokenFacebook = resp.response.credentials.accessToken;
            fetch(`https://graph.facebook.com/me?access_token=${accessTokenFacebook}&fields=id,name,email,picture.height(500)`)
              .then(response => response.json())
              .then(data => {
                if (data.name && data.email) {
                  // Verificando se o usuario ja esta cadastrado no sistema
                  API().get(`registros/usuario/${data.email}?campos=email,senhaSocial`)
                    .then(res => {
                      if (res.data) {
                        this.setState({
                          email: res.data.email,
                          senha: decrypt(res.data.senhaSocial)
                        }, () => {
                          this.logar();
                        });
                      } else {
                        let registerData = {
                          nome: data.name,
                          email: data.email
                        }
                        // Insere o novo usuario
                        API().post('registros/cliente-ls', registerData)
                          .then(res => {
                            if (res.data) {
                              this.setState({
                                email: res.data.email,
                                senha: decrypt(res.data.senhaSocial)
                              }, () => {
                                this.logar();
                              });
                            } else {
                              NotificationAlert('Não foi possível registrar seus dados. Tente novamente.');
                            }
                          })
                          .catch(error => {
                            NotificationAlert(ListErrors(error.response.data));
                          });
                      }
                    })
                    .catch(error => {
                      NotificationAlert('Não foi possível autenticar no aplicativo');
                    });
                } else {
                  NotificationAlert('Não foi possível obter os seus dados no Facebook');
                }
              })
              .catch(error => {
                NotificationAlert('Não foi possível verificar seus dados no Facebook');
              });
          } else {
            NotificationAlert('Não foi possível acessar o Facebook');
          }
        })
        .catch(err => {
          NotificationAlert('Não foi possível verificar seus dados no Facebook');
        });
    } catch ({ message }) {
      NotificationAlert('Erro: ' + message);
    }
  }

  logarGoogle = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      let data = userInfo.user;

      if (data.name && data.email) {
        // Verificando se o usuario ja esta cadastrado no sistema
        API().get(`registros/usuario/${data.email}?campos=email,senhaSocial`)
          .then(res => {
            if (res.data) {
              this.setState({
                email: res.data.email,
                senha: decrypt(res.data.senhaSocial)
              }, () => {
                this.logar();
              });
            } else {
              let registerData = {
                nome: data.name,
                email: data.email
              }
              // Insere o novo usuario
              API().post('registros/cliente-ls', registerData)
                .then(res => {
                  if (res.data) {
                    this.setState({
                      email: res.data.email,
                      senha: decrypt(res.data.senhaSocial)
                    }, () => {
                      this.logar();
                    });
                  } else {
                    NotificationAlert('Não foi possível registrar seus dados. Tente novamente.');
                  }
                })
                .catch(error => {
                  if (error.response && error.response.data) {
                    NotificationAlert(ListErrors(error.response.data));
                  } else {
                    NotificationAlert('Não foi possível registrar seus dados. Tente novamente');
                  }
                });
            }
          })
          .catch(error => {
            if (error.response && error.response.data) {
              NotificationAlert(ListErrors(error.response.data));
            } else {
              NotificationAlert('Não foi possível autenticar no aplicativo');
            }
          });
      } else {
        NotificationAlert('Não foi possível obter seus dados no Google');
      }
    } catch (error) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        // user cancelled the login flow
        NotificationAlert('Acesso cancelado pelo usuário');
      } else if (error.code === statusCodes.IN_PROGRESS) {
        // operation (e.g. sign in) is in progress already
        NotificationAlert('Operação já está em andamento');
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        // play services not available or outdated
        NotificationAlert('Serviço Play não disponível ou desatualizado. Atualize seu celular');
      } else {
        NotificationAlert('Ocorreu um erro durante o processo de autenticação');
      }
    }
  }

  btnShowHidePassword = () => {
    this.setState({ hidePassword: !this.state.hidePassword });
  }

  btnLogin = () => {
    if (this.state.tipoLogin === true) {
      this.validate({
        telefone: { required: true },
        senha: { required: true, minlength: 6, maxlength: 6 },
      });
    } else {
      this.validate({
        email: { required: true },
        senha: { required: true, minlength: 6, maxlength: 6 },
      });
    }

    if (this.isFormValid()) {
      this.logar();
    } else {
      NotificationAlert(this.getErrorMessages());
    }
  }

  btnRegister = () => {
    this.props.navigation.navigate('Register');
  }

  btnForgotPassword = () => {
    this.validate({ email: { required: true } });

    if (this.isFormValid()) {
      API({ token: this.state.token })
        .get(`emails/${this.state.email}/recuperar-senha`)
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
    } else {
      NotificationAlert(this.getErrorMessages());
    }
  }

  validateInput = (input, valueInput) => {
    switch (input) {
      case 'tipoLogin':
        if (this.state.tipoLogin === true) {
          this.setState({ tipoLogin: false });
        } else {
          this.setState({ tipoLogin: true });
        }
        break;
      case 'email': 
        valueInput = valueInput.trim();
        this.setState({ email: valueInput }); 
        break;
      case 'telefone': 
        valueInput = valueInput.trim();
        this.setState({ telefone: valueInput }); 
        break;
      case 'senha': this.setState({ senha: valueInput }); break;
    }
  }

  render() {
    return (
      <StyleProvider style={getTheme(material)}>
        <KeyboardAvoidingView style={Styles.body}>
          <Brand />
          <View style={Styles.contentContainer}>
            <View style={[Styles.formContainer, { width: '90%', flex: 1}]}>
              <View style={Styles.horizontalContainer}>
                <Text style={Styles.font16}>E-MAIL</Text>
                <Switch
                  trackColor={{ true: '#000000', false: '#000000' }}
                  thumbColor={"#f4f3f4"}
                  ios_backgroundColor="#3e3e3e"
                  onValueChange={valueInput => this.validateInput('tipoLogin', valueInput)}
                  value={this.state.tipoLogin}
                />
                <Text style={Styles.font16}>TELEFONE</Text>
              </View>
              {this.state.tipoLogin === true ? (
                <Item>
                  <Icon
                    type={typeIconDefault}
                    name="phone-outline"
                    style={[Styles.font30, Styles.whiteColor]} />
                  <TextInputMask
                    ref="telefone"
                    type={'cel-phone'}
                    options={{
                      maskType: 'BRL',
                      withDDD: true,
                      dddMask: '(99)'
                    }}
                    placeholder="TELEFONE"
                    placeholderLabel="TELEFONE"
                    placeholderTextColor="#575757"
                    style={Styles.inputText}
                    value={this.state.telefone}
                    onChangeText={valueInput => this.validateInput('telefone', valueInput)} />
                </Item>
              ) : (
                  <Item>
                    <Icon
                      type={typeIconDefault}
                      name="email-outline"
                      style={[Styles.font30, Styles.whiteColor]} />
                    <TextInput
                      ref="email"
                      placeholder="E-MAIL"
                      placeholderLabel="E-MAIL"
                      placeholderTextColor="#575757"
                      autoCapitalize="none"
                      style={Styles.inputText}
                      value={this.state.email}
                      onChangeText={valueInput => this.validateInput('email', valueInput)} />
                  </Item>
                )}
              <Item>
                <Icon
                  type={typeIconDefault}
                  name="lock-outline"
                  style={[Styles.font30, Styles.whiteColor]} />
                <TextInput
                  ref="senha"
                  secureTextEntry={this.state.hidePassword}
                  placeholder="SENHA"
                  placeholderLabel="SENHA"
                  placeholderTextColor="#575757"
                  keyboardType="numeric"
                  maxLength={6}
                  style={[Styles.inputText, { width: '80%' }]}
                  value={this.state.senha}
                  onChangeText={valueInput => this.validateInput('senha', valueInput)} />
                <Icon
                  type={typeIconDefault}
                  name={this.state.hidePassword == false ? "eye-outline" : "eye-off-outline"}
                  style={[Styles.font30, Styles.whiteColor]}
                  onPress={this.btnShowHidePassword} />
              </Item>
              <View style={[Styles.horizontalContainer, { width: '100%', minHeight: 30 }]}>
                <TouchableOpacity 
                  onPress={this.btnForgotPassword}
                  style={[Styles.font14, { width: '50%' }]}>
                  <Text 
                  textBreakStrategy={'simple'}
                  style={[
                    Styles.linkDefault, 
                    { borderWidth: 0, textAlign: 'center' }
                  ]}>ESQUECI MINHA SENHA</Text>
                </TouchableOpacity>
              </View>
              <View style={Styles.horizontalContainer}>
                <TouchableOpacity
                  style={Styles.defaultButton}
                  onPress={this.btnLogin}>
                  <Text style={Styles.textButton}>Login</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={Styles.defaultButton}
                  onPress={this.btnRegister}>
                  <Text style={Styles.textButton}>Cadastrar</Text>
                  <Text style={Styles.textButton}>Agora</Text>
                </TouchableOpacity>
              </View>
              <View style={Styles.horizontalContainer}>
                <Text style={Styles.fontBold}>OU ENTRE COM</Text>
              </View>
              <View style={[Styles.horizontalContainer, { justifyContent: 'center' }]}>
                <TouchableOpacity 
                  style={[Styles.smallButton, Styles.facebookStyle]}
                  onPress={this.logarFacebook}>
                  <Text style={[Styles.fontBold, Styles.whiteColor]}>facebook</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[Styles.smallButton, Styles.googleStyle]}
                  onPress={this.logarGoogle}>
                  <Text style={[Styles.fontBold, Styles.whiteColor]}>Google</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </KeyboardAvoidingView>
      </StyleProvider>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    usuario: state.usuario,
    configuracoes: state.configuracoes
  }
}

const mapDispatchToProps = dispatch => {
  return {
    updateToken: token => dispatch(tokenRegisterAction(token)),
    onLogin: user => {
      dispatch(loginAction(user));
      if (user.pessoa) {
        dispatch(personRegisterAction(user.pessoa));
      }
    },
    updatePhotoPerfil: link => dispatch(perfilLinkAction(link))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(LoginPage);

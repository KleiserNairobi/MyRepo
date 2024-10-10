import React from 'react';
import { connect } from 'react-redux';
import {
  View,
  Modal,
  KeyboardAvoidingView,
  Text,
  FlatList,
  TouchableOpacity,
  PermissionsAndroid
} from 'react-native';
import { Button, Icon } from 'native-base';

import Styles from '../../assets/scss/styles';
import { NotificationAlert } from '../../components/general/alerts';
import {
  webSocketRegisterAction,
  webSocketReconnectAction,
  sendCurrentLocationAction
} from '../../store/slices/configSlice';
import { onlineStatusRegisterAction } from '../../store/slices/personSlice';
import { deliveryRegisterAction } from '../../store/slices/deliverySlice';
import { vehicleActiveAction } from '../../store/slices/vehicleSlice';
import API from '../../services/api';
import WEBSOCKET from '../../services/websocket';
import ListErrors from '../../components/general/listErrors';
import { formatNumber, statusCodeForName } from '../../components/general/converter';
import Geolocation from 'react-native-geolocation-service';

const typeIconDefault = "MaterialCommunityIcons";

class SolicitationPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      token: props.configuracoes.token,
      usuario: props.usuario,
      pessoa: props.pessoa,
      permissaoLocalizacao: false,
      latitude: null,
      longitude: null,
      showBtnRegisterLocation: false,
      veiculo: (props.veiculo) ? props.veiculo : null,
      wSocket: (props.configuracoes.wSocket) ? props.configuracoes.wSocket : null,
      screenWSocket: 'NOTIFICATION',
      entregas: [],
      timers: [],
      deliveryModalOpened: false,
      entregaSelecionada: null,
      justifyModalOpened: false,
      justificativaInformada: null
    }

    // Definindo botao para chat
    props.navigation.setOptions({
      headerRight: () => (
        <Button
          onPress={() => {
            props.navigation.navigate('ChatSupport');
          }}
          transparent>
          <Icon
            type="MaterialCommunityIcons"
            name='comment-text-outline'
            style={[Styles.font24, Styles.blackColor]} />
        </Button>
      ),
    });

    // Recarregando dados ao retornar (focar) na tela atual
    props.navigation.addListener('focus', this.loadData);
  }

  loadData = () => {
    // Atualizando dados
    if (this.props.veiculo
      && this.props.veiculo.placa != this.state.veiculo.placa) {
      this.setState({
        veiculo: this.props.veiculo
      });
    }

    // Iniciando WebSocket
    this.loadWebSocket();

    // Reenviando localização do entregador
    if (this.state.pessoa.online === true) {
      this.getGeolocation();
    }
  }

  loadWebSocket = async () => {
    let wSocketIniciado = null;

    if (!this.state.wSocket && this.state.usuario && this.state.usuario.id > 0) {
      // Iniciando conexao
      wSocketIniciado = await WEBSOCKET({ ...this.props });

      this.setState({
        wSocket: wSocketIniciado
      }, async () => {
        // Registrando conexao na Store
        await this.props.webSocketRegisterAction({
          wSocket: wSocketIniciado
        });
      });
    }

    if (this.state.wSocket) {
      // Iniciando a leitura de notificacoes das entregas
      this.state.wSocket.onmessage = (e) => {
        if (e.data) {
          let dataMessage = JSON.parse(e.data);
          if (dataMessage.message && dataMessage.message.assunto) {
            switch (dataMessage.message.assunto) {
              case 'NOTIFICATION':
                console.log('Notificacao para entrega');
                if (this.state.pessoa.online === true) {
                  let indexNewMessage = 0;
                  let newMessage = dataMessage.message;
                  newMessage.countdown = 30;
                  this.setState({
                    entregas: [
                      newMessage,
                      ...this.state.entregas
                    ]
                  }, () => {
                    // Iniciando cronometro regressivo
                    indexNewMessage = (parseInt(this.state.entregas.length) - 1);
                    this.state.timers[indexNewMessage] = setInterval(() => {
                      if (this.state.entregas[indexNewMessage] &&
                        this.state.entregas[indexNewMessage].countdown > 0) {
                        let novaEntrega = this.state.entregas[indexNewMessage];
                        novaEntrega.countdown = parseInt(this.state.entregas[indexNewMessage].countdown) - 1;
                        this.state.entregas[indexNewMessage] = novaEntrega;
                        this.setState({
                          entregas: this.state.entregas
                        });
                      } else {
                        console.log('Finalizou cronometro');
                        // Finalizando cronometro
                        clearInterval(this.state.timers[indexNewMessage]);
                        if (this.state.entregas[indexNewMessage]) {
                          // Respondendo WebService que o entregador ultrapassou o tempo de resposta
                          this.btnConfirmDelivery(this.state.entregas[indexNewMessage].idEntrega, false, 'Expirou tempo de resposta');
                        }
                      }
                    }, 1000);
                  });
                } else {
                  this.btnConfirmDelivery(dataMessage.message.idEntrega, false, 'Não disponível');
                }
                break;
            }
          }

          // Configurando conexao para reconectar caso a conexao seja encerrada
          this.props.webSocketReconnectAction({
            wSocketReconnect: true
          });
        }
      }
    }
  }

  getGeolocation = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
      );

      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        // Converte para PERMITIDO, caso o estado estiver como NÃO PERMITIDO
        if (this.state.permissaoLocalizacao === false) {
          this.setState({ permissaoLocalizacao: true });
        }
      } else {
        // Converte para NÃO PERMITIDO, caso o estado estiver como PERMITIDO
        if (this.state.permissaoLocalizacao === true) {
          this.setState({ permissaoLocalizacao: false });
        }
      }

      if (this.state.permissaoLocalizacao === false) {
        NotificationAlert('Habilite o acesso ao GPS do seu dispositivo', 'Erro de Permissão');
      } else {
        Geolocation.getCurrentPosition(
          (position) => {
            if (position.coords) {
              this.setState({
                latitude: position.coords.latitude,
                longitude: position.coords.longitude
              }, async () => {
                await this.registerCurrentLocation();
              });
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
    } catch (err) {
      console.warn(err);
    }
  }

  registerCurrentLocation = async () => {
    // Montando dados que serao registrados no webservice
    let registerData = {
      pessoa: {
        id: this.state.pessoa.id
      },
      latitude: this.state.latitude,
      longitude: this.state.longitude,
    }

    // Registrando localizacao do entregador no webservice
    await API({ token: this.state.token })
      .post(`localizacoes/entregador/`, registerData)
      .then(res => {
        if (res.data && res.data.id > 0) {
          // Verifica se deve continuar enviando automaticamente a localização
          if (this.props.configuracoes.enviarLocalizacaoAtual === true) {
            setTimeout(() => this.getGeolocation(), 30000);
          }

          // Esconde botão de registrar localização
          if (this.state.showBtnRegisterLocation === true) {
            this.setState({
              showBtnRegisterLocation: false
            });
          }
        } else {
          this.setState({
            showBtnRegisterLocation: true
          }, () => {
            NotificationAlert('Sua localização não foi registrada no Sistema');
          });
        }
      })
      .catch(error => {
        this.setState({
          showBtnRegisterLocation: true
        }, () => {
          NotificationAlert('Erro ao enviar sua localização');
        });
      });
  }

  registerVehicleActive = async () => {
    if (this.state.veiculo) {
      let active = true;
      await API({ token: this.state.token })
        .put(`veiculos/${this.state.veiculo.id}/${active}`)
        .then(async res => {
          if (res && res.status == 204) {
            await this.props.vehicleActiveAction({
              ativo: true
            });
          }
        })
        .catch(error => {
          if (error.response && error.response.data) {
            NotificationAlert(ListErrors(error.response.data));
          } else {
            NotificationAlert('Erro ao registrar veículo ativo');
          }
        });
    } else {
      NotificationAlert('Informe um veículo');
    }
  }

  btnChangeVehicle = () => {
    this.props.navigation.navigate('ChooseVehicle');
  }

  btnRegisterLocation = () => {
    this.getGeolocation();
  }

  btnOnline = async () => {
    if (!this.state.veiculo || !this.state.veiculo.tipo) {
      NotificationAlert('Informe seu veículo');
    } else if (!this.state.latitude || !this.state.longitude) {
      // Busca a localização do usuário
      this.getGeolocation();

      // Habilita botão para registrar localização, 
      // caso após 2 segundos a latitude e longitude não tenha sido identificada
      setTimeout(() => {
        if (!this.state.latitude || !this.state.longitude) {
          this.setState({
            showBtnRegisterLocation: true
          }, () => {
            NotificationAlert('Localização não identificada. Clique no botão Registrar Localização.');
          });
        } else {
          // Chama novamente a função, para colocar o status de Online para TRUE
          this.btnOnline();
        }
      }, 2000);
    } else {
      // Determinando a nova situacao do Online da Pessoa
      let statusOnline = !this.state.pessoa.online;
      if (statusOnline === false) {
        // Determinando a paralisação do Script que envia localizacao do dispositivo
        await this.props.sendCurrentLocationAction({
          enviarLocalizacaoAtual: false
        });
      } else {
        // Registrando o veículo ativo pelo entregador
        await this.registerVehicleActive();
      }

      // Registrando entregador com o status de Online      
      API({ token: this.state.token })
        .put(`pessoas/${this.state.pessoa.id}/${statusOnline}`)
        .then(res => {
          if (res && res.status == 204) {
            this.setState({
              pessoa: {
                ...this.state.pessoa,
                online: statusOnline
              },
              showBtnRegisterLocation: false
            }, () => {
              // Registrando status online na Store
              this.props.onlineStatusRegisterAction({
                online: statusOnline
              });
            });
          } else {
            NotificationAlert('Não foi possível concluir a operação');
          }
        })
        .catch(error => {
          if (error && error.response && error.response.data) {
            NotificationAlert(ListErrors(error.response.data));
          } else {
            NotificationAlert('Erro ao alterar a situação de disponível');
          }
        });
    }
  }

  btnConfirmDelivery = async (idDelivery, accept, justify = '') => {
    if (this.state.wSocket) {
      try {
        let contentSend = JSON.stringify({
          "action": "onMessage",
          "sender": this.state.usuario.id,
          "receiver": "1",
          "message": {
            "assunto": "NOTIFICATION_REPLY",
            "sender": this.state.usuario.id,
            "receiver": "1",
            "idEntrega": idDelivery,
            "resposta": accept,
            "justificativa": justify
          }
        });
        await this.state.wSocket.send(contentSend);

        if (accept === true) {
          // Armazena na Store
          await this.props.deliveryRegisterAction({
            ...this.state.entregaSelecionada
          });

          // Finalizando timers
          this.state.timers.map((currentTimer) => {
            clearInterval(currentTimer);
          });

          // Negando as outras entregas
          this.state.entregas.map((currentDelivery, indexDelivery) => {
            if (currentDelivery.id != idDelivery) {
              this.state.entregas.splice(indexDelivery, 1);
            }
          });

          // Atualizando lista de entregas
          this.setState({
            entregas: this.state.entregas
          }, async () => {
            // Fechando Modals
            if (this.state.deliveryModalOpened) {
              // Finaliza justifyModal
              await this.justifyModalClose();

              // Finaliza deliveryModal
              await this.deliveryModalClose();
            }
            // Redireciona para tela de retirada da encomenda
            this.props.navigation.navigate('DeliveryInProgress', {
              id: idDelivery
            });
          });
        } else if (this.state.entregaSelecionada) {
          // Finaliza justifyModal
          await this.justifyModalClose();

          // Finaliza deliveryModal
          await this.deliveryModalClose();

          // Verificando o indice da entregas selecionada
          let indexEntrega = this.state.entregaSelecionada.indexEntrega;

          // Removendo entrega da lista do entregador
          this.state.entregas.splice(indexEntrega, 1);
        } else {
          this.state.entregas.map((currentDelivery, indexDelivery) => {
            if (currentDelivery.idEntrega == idDelivery) {
              // Removendo entrega da lista do entregador
              this.state.entregas.splice(indexDelivery, 1);
            }
          });
          // Recarregando state das entregas para recarregar componentes relacionados
          this.setState({
            entregas: this.state.entregas
          })
        }
      } catch (err) {
        NotificationAlert('Erro durante a resposta da solicitação. Tente novamente.');
      }
    } else {
      NotificationAlert('Sem comunicação com o Servidor');
    }
  }

  btnDeliveryDetails = (idDelivery) => {
    this.state.entregas.map((entregaAtual, indexAtual) => {
      if (entregaAtual.idEntrega == idDelivery) {
        this.setState({
          entregaSelecionada: {
            indexEntrega: indexAtual,
            idEntrega: entregaAtual.idEntrega,
            solicitante: entregaAtual.solicitante,
            enderecoRetirada: entregaAtual.retirada,
            enderecoEntrega: entregaAtual.entrega,
            distancia: entregaAtual.distancia,
            tipoPagamento: entregaAtual.tipoPagamento,
            valorEntrega: entregaAtual.vlrEntrega
          }
        }, () => {
          // Verificando status da entrega
          API({ token: this.state.token })
            .get(`entregas-status/${idDelivery}/ultimo-status`)
            .then(res1 => {
              if (res1 && res1.data && res1.data.status != 'NI') {
                // Redireciona o entregador para tela de entrega em andamento
                this.props.navigation.navigate('DeliveryInProgress', {
                  id: idDelivery
                });
              } else {
                // Abre Modal para visualização de detalhes da entrega
                this.setState({
                  deliveryModalOpened: true
                });
              }
            })
            .catch(error => {
              NotificationAlert('Não foi possível visualizar dados da entrega');
            });
        });
      }
    });
  }

  deliveryModalClose = () => this.setState({
    deliveryModalOpened: false
  });

  justifyModalClose = () => this.setState({
    justifyModalOpened: false
  });

  renderModalJustify = () => {
    return (
      <Modal
        visible={this.state.justifyModalOpened}
        transparent={true}
        animationType="slide"
        onRequestClose={this.justifyModalClose}
      >
        <View style={[Styles.container, Styles.whiteBg, { width: '100%' }]}>
          <View style={[Styles.justifyTopContainer, { width: '100%' }]}>
            <View style={[Styles.yellowBg, { width: '100%', height: 50, justifyContent: 'center' }]}>
              <Text style={Styles.headerTitle}>Justificativa</Text>
            </View>
            <View style={[Styles.textBox, { marginBottom: 10 }]}>
              <Text>Selecione o motivo que levou você a negar a entrega</Text>
            </View>
            <View style={Styles.justifyTopContainer}>
              <TouchableOpacity
                style={[Styles.largeBlockButton, { marginTop: 15 }]}
                onPress={() => this.btnConfirmDelivery(this.state.entregaSelecionada.idEntrega, false, 'Sem dinheiro disponível')}>
                <View style={[{ marginLeft: 10 }]}>
                  <Text style={[Styles.textSmallBox]}>Sem dinheiro disponível</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                style={[Styles.largeBlockButton, { marginTop: 15 }]}
                onPress={() => this.btnConfirmDelivery(this.state.entregaSelecionada.idEntrega, false, 'Muito distante')}>
                <View style={[{ marginLeft: 10 }]}>
                  <Text style={[Styles.textSmallBox]}>Muito distante</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                style={[Styles.largeBlockButton, { marginTop: 15 }]}
                onPress={() => this.btnConfirmDelivery(this.state.entregaSelecionada.idEntrega, false, 'Entrega em local perigoso')}>
                <View style={[{ marginLeft: 10 }]}>
                  <Text style={[Styles.textSmallBox]}>Entrega em local perigoso</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    );
  }

  renderModalDelivery = () => {
    let tipoPagamento = '';
    if (this.state.entregaSelecionada && this.state.entregaSelecionada.tipoPagamento) {
      tipoPagamento = statusCodeForName('TIPO_PAGAMENTO', this.state.entregaSelecionada.tipoPagamento);
    }

    return (
      <Modal
        visible={this.state.deliveryModalOpened}
        transparent={true}
        animationType="slide"
        onRequestClose={this.deliveryModalClose}
      >
        {(this.state.entregaSelecionada) ? (
          <View style={[Styles.container, Styles.whiteBg, { width: '100%' }]}>
            <View style={[Styles.justifyTopContainer, { width: '100%' }]}>
              <View style={[Styles.yellowBg, { width: '100%', height: 50, justifyContent: 'center' }]}>
                <Text style={Styles.headerTitle}>Detalhes da Entrega</Text>
              </View>
              <View style={[Styles.horizontalContainer, { width: '100%', flex: 0 }]}>
                <Text style={[Styles.textSmallBox, Styles.fontBold, { paddingBottom: 0, width: '40%' }]}>Solicitante: </Text>
                <Text style={[Styles.textSmallBox, { width: '60%' }]}>{this.state.entregaSelecionada.solicitante}</Text>
              </View>
              <View style={[Styles.horizontalContainer, { width: '100%', flex: 0 }]}>
                <Text style={[Styles.textSmallBox, Styles.fontBold, { paddingBottom: 0, width: '40%' }]}>Endereço de Retirada: </Text>
                <Text style={[Styles.textSmallBox, { width: '60%' }]}>{this.state.entregaSelecionada.enderecoRetirada}</Text>
              </View>
              <View style={[Styles.horizontalContainer, { width: '100%', flex: 0 }]}>
                <Text style={[Styles.textSmallBox, Styles.fontBold, { paddingBottom: 0, width: '40%' }]}>Endereço de Entrega: </Text>
                <Text style={[Styles.textSmallBox, { width: '60%' }]}>{this.state.entregaSelecionada.enderecoEntrega}</Text>
              </View>
              <View style={[Styles.horizontalContainer, { width: '100%', flex: 0 }]}>
                <Text style={[Styles.textSmallBox, Styles.fontBold, { paddingBottom: 0, width: '40%' }]}>Distância: </Text>
                <Text style={[Styles.textSmallBox, { width: '60%' }]}>{this.state.entregaSelecionada.distancia} km</Text>
              </View>
              <View style={[Styles.horizontalContainer, { width: '100%', flex: 0 }]}>
                <Text style={[Styles.textSmallBox, Styles.fontBold, { paddingBottom: 0, width: '40%' }]}>Tipo de Pagamento: </Text>
                <Text style={[Styles.textSmallBox, { width: '60%' }]}>{tipoPagamento}</Text>
              </View>
              <View style={[Styles.horizontalContainer, { width: '100%', flex: 0 }]}>
                <Text style={[Styles.textSmallBox, Styles.fontBold, { paddingBottom: 0, width: '40%' }]}>Valor da Entrega: </Text>
                <Text style={[Styles.textSmallBox, { width: '60%' }]}>R$ {formatNumber(this.state.entregaSelecionada.valorEntrega)}</Text>
              </View>
              <View style={Styles.horizontalContainer}>
                <TouchableOpacity
                  style={Styles.smallLineButton}
                  onPress={() => this.btnConfirmDelivery(this.state.entregaSelecionada.idEntrega, true)}>
                  <Text style={Styles.textButton}>ACEITAR</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={Styles.smallLineButton}
                  onPress={() => this.setState({ justifyModalOpened: true })}>
                  <Text style={Styles.textButton}>NEGAR</Text>
                </TouchableOpacity>
              </View>
            </View>
            <View style={[Styles.horizontalContainer, { flex: 0, width: '100%' }]}>
              <TouchableOpacity
                style={Styles.largeBlockButton}
                onPress={this.deliveryModalClose}>
                <Text style={Styles.textButton}>Cancelar</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : null}
      </Modal>
    );
  }

  renderItemList = ({ item }) => {
    return (
      <View style={[Styles.grayLightBorder, { borderWidth: 1, padding: 5 }]}>
        <TouchableOpacity
          onPress={() => this.btnDeliveryDetails(item.idEntrega)}>
          <View style={Styles.horizontalContainer}>
            <View style={{ width: '50%' }}>
              <Text>{item.solicitante}</Text>
            </View>
            <View style={{ width: '28%', alignItems: 'center' }}>
              <Text>Responder em</Text>
              <Text style={[Styles.font24, Styles.fontBold]}>{(item.countdown) ? item.countdown : 0} s</Text>
            </View>
            <View style={{ width: '22%', alignItems: 'center' }}>
              <Icon
                type={typeIconDefault}
                name="magnify-plus-outline"
                style={{ fontSize: 35 }} />
            </View>
          </View>
        </TouchableOpacity>
      </View>
    )
  }

  render() {
    return (
      <KeyboardAvoidingView behavior="height" style={[Styles.body, Styles.whiteBg]}>
        <View style={Styles.container}>
          <View style={Styles.barVehicles}>
            <View style={Styles.horizontalContainer}>
              <View style={{ width: '15%', alignItems: 'center' }}>
                {this.state.veiculo && this.state.veiculo.tipo ? (
                  <Icon
                    type={typeIconDefault}
                    name={statusCodeForName('ICONE_VEICULO', this.state.veiculo.tipo)}
                    style={[Styles.barVehiclesIcon, { fontSize: 60 }]} />
                ) : null}
              </View>
              <View style={{ width: '45%' }}>
                <Text style={[Styles.font16, Styles.fontBold, Styles.grayColor, { marginBottom: 5 }]}>Veículo</Text>
                <Text style={Styles.grayColor}>Placa: {
                  this.state.veiculo && this.state.veiculo.placa ? this.state.veiculo.placa : 'Não informada'}</Text>
                <Text style={Styles.grayColor}>Modelo: {
                  this.state.veiculo && this.state.veiculo.modelo ? this.state.veiculo.modelo : 'Não informado'}</Text>
              </View>
              <View style={{ width: '35%', alignItems: 'center' }}>
                <TouchableOpacity
                  style={[
                    Styles.smallLineButton,
                    Styles.grayLightBg,
                    Styles.grayBorder
                  ]}
                  onPress={this.btnChangeVehicle}>
                    <Text style={Styles.textButton}>{
                      this.state.veiculo && this.state.veiculo.placa ? 'Alterar' : 'Informar'
                    }</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          <View style={[Styles.container, { width: '100%' }]}>
            <TouchableOpacity
              style={Styles.largeBlockButton}
              onPress={this.btnOnline}>
              {(this.state.pessoa && this.state.pessoa.online === true) ? (
                <View style={Styles.horizontalContainer}>
                  <Text style={Styles.textButton}>Disponível</Text>
                  <Icon
                    type={typeIconDefault}
                    name="checkbox-marked-circle"
                    style={[Styles.font30, { color: 'green' }]} />
                </View>
              ) : (
                  <View style={Styles.horizontalContainer}>
                    <Text style={Styles.textButton}>Disponível</Text>
                    <Icon
                      type={typeIconDefault}
                      name="checkbox-blank-circle"
                      style={[Styles.font30, { color: 'red' }]} />
                  </View>
                )}
            </TouchableOpacity>
            {(this.state.showBtnRegisterLocation === true) ? (
              <TouchableOpacity
                style={Styles.largeBlockButton}
                onPress={this.btnRegisterLocation}>
                <View style={Styles.horizontalContainer}>
                  <Text style={Styles.textButton}>Registrar Localização</Text>
                </View>
              </TouchableOpacity>
            ) : null}
          </View>

          <View style={[
            Styles.contentContainer,
            Styles.m10,
            { width: '100%' }
          ]}>
            <View style={[
              Styles.p10,
              Styles.yellowBg,
              { width: '95%', borderTopRightRadius: 10, borderTopLeftRadius: 10 }
            ]}>
              <Text style={[Styles.textButton, { textAlign: 'center' }]}>NOVAS ENTREGAS</Text>
            </View>
            <FlatList
              data={this.state.entregas}
              renderItem={this.renderItemList}
              keyExtractor={(item) => item.idEntrega.toString()}
              style={[{ flex: 1, width: '95%', borderWidth: 1 }, Styles.yellowBorder]} />
          </View>
          {this.renderModalDelivery()}
          {this.renderModalJustify()}
        </View>
      </KeyboardAvoidingView>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    usuario: state.usuario,
    pessoa: state.pessoa,
    veiculo: state.veiculo,
    configuracoes: state.configuracoes,
    entrega: state.entrega,
    notificacoes: state.notificacoes
  }
}

const mapDispatchToProps = {
  onlineStatusRegisterAction,
  deliveryRegisterAction,
  webSocketRegisterAction,
  webSocketReconnectAction,
  sendCurrentLocationAction,
  vehicleActiveAction
};

export default connect(mapStateToProps, mapDispatchToProps)(SolicitationPage);
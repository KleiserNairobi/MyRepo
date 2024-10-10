import React from 'react';
import { connect } from 'react-redux';
import {
  View,
  KeyboardAvoidingView,
  Text,
  Animated,
  TouchableOpacity,
  BackHandler
} from 'react-native';
import {
  Container,
  Content,
  Button,
  Icon
} from 'native-base';

import Styles from '../../assets/scss/styles';
import { NotificationAlert } from '../../components/general/alerts';
import {
  deliveryInitialStateAction,
  vehicleDeliveryAction,
  afterDeliveryCalcAction,
  pickupAddressAction,
  deliveryAddressAction,
  deliveryAddressesOkAction
} from '../../store/slices/deliverySlice';
import { deliveryAddressInitialStateAction } from '../../store/slices/deliveryAddressSlice';
import { webSocketRegisterAction } from '../../store/slices/configSlice';
import { formatNumber } from '../../components/general/converter';
import API from '../../services/api';
import WEBSOCKET from '../../services/websocket';
import MakeMap from '../../components/general/makeMap';
import ListErrors from '../../components/general/listErrors';

const typeIconDefault = "MaterialCommunityIcons";
const sourceImageGrayMap = require('../../assets/images/maps-gray.png');

class SolicitationPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      token: props.configuracoes.token,
      pessoa: props.pessoa,
      usuario: props.usuario,
      entrega: props.entrega,
      wSocket: props.configuracoes.wSocket,
      veiculo: null,
      deslocamento: props.entrega.deslocamento ? props.entrega.deslocamento : 'OD',
      distancia: 0,
      previsao: '00:00',
      valor: 0,
      enderecosConfirmados: props.entrega.enderecosConfirmados ? props.entrega.enderecosConfirmados : false,
      origem: props.entrega.origem,
      enderecoRetirada: 'Endereço do local de retirada',
      destino: props.entrega.destino,
      enderecoEntrega: 'Endereço do local de entrega',
      tabelaPrecoId: null
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

    // Adicionando botão para limpar dados preenchidos na tela
    this.props.navigation.setOptions({
      headerLeft: () => (
        <Button
          onPress={() => {
            // Resetando valores do State
            this.setState({
              entrega: null,
              veiculo: null,
              deslocamento: null,
              distancia: 0,
              previsao: '00:00',
              valor: 0,
              enderecosConfirmados: false,
              origem: null,
              enderecoRetirada: 'Endereço do local de retirada',
              desino: null,
              enderecoEntrega: 'Endereço do local de entrega'
            });
            // Apagando dados da Stores (Entrega e Endereços)
            this.props.deliveryInitialStateAction();
            this.props.deliveryAddressInitialStateAction();
          }}
          transparent>
          <Icon
            type="MaterialCommunityIcons"
            name='plus'
            style={[Styles.font24, Styles.blackColor]} />
        </Button>
      )
    });

    // Recarregando dados ao retornar (focar) na tela atual
    this.props.navigation.addListener('focus', this.loadData);
  }

  loadData = () => {
    // Carregando dados
    this.setState({
      veiculo: (this.props.entrega && this.props.entrega.tipoVeiculo) ? this.props.entrega.tipoVeiculo : this.state.veiculo, // B=Bike, M=Moto, C=Carro
      origem: (this.props.entrega && this.props.entrega.origem) ? this.props.entrega.origem : null,
      enderecoRetirada: (this.props.entrega && this.props.entrega.origem) ?
        this.props.entrega.origem.logradouro + ', ' +
        this.props.entrega.origem.numero + ', ' +
        this.props.entrega.origem.bairro : this.state.enderecoRetirada,
      destino: (this.props.entrega && this.props.entrega.destino) ? this.props.entrega.destino : null,
      enderecoEntrega: (this.props.entrega && this.props.entrega.destino) ?
        this.props.entrega.destino.logradouro + ', ' +
        this.props.entrega.destino.numero + ', ' +
        this.props.entrega.destino.bairro : this.state.enderecoEntrega
    }, async () => {
      // Verificando se existe o parametro de confirmacao de preenchimento dos enderecos
      if (this.props.route && this.props.route.params) {
        if (this.props.route.params.confirmedAddresses 
          && this.props.entrega 
          && this.props.entrega.origem 
          && this.props.entrega.destino) {
          // Carregando dados de distancia e previsao de duracao
          await this.calculateDelivery();

          // Recarregando EnderecosConfirmados para gerar novamente mapa
          this.setState({ 
            enderecosConfirmados: true
          }, () => {
            this.props.deliveryAddressesOkAction({
              enderecosConfirmados: this.state.enderecosConfirmados
            });
          });
        }
      } else if (this.props.entrega && this.props.entrega.id > 0) {
        // Carregando dados de distancia e previsao de duracao
        await this.calculateDelivery();
      }

      // Abrindo WebSocket
      this.loadWebSocket();
    });
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

        if (this.state.wSocket) {
          // Iniciando a leitura de notificacoes das entregas completadas
          this.state.wSocket.onmessage = (e) => {
            if (e.data) {
              let dataMessage = JSON.parse(e.data);
              if (dataMessage.message && dataMessage.message.assunto) {
                switch (dataMessage.message.assunto) {
                  case 'DELIVERY_COMPLETED':
                    let newMessage = dataMessage.message;
                    let idDelivery = (newMessage.idEntrega) ? newMessage.idEntrega : null;

                    if (idDelivery) {
                      this.props.navigation.navigate('RegisterRating', {
                        id: idDelivery
                      });
                    }
                    break;
                }
              }
            }
          }
        }
      });
    }
  }

  btnPickupAddress = () => {
    if (this.state.veiculo) {
      this.props.navigation.push('ChoosePickupAddress');
    } else {
      NotificationAlert('Primeiro escolha um veículo', 'Instruçōes');
    }
  }

  btnDeliveryAddress = () => {
    if (this.state.origem) {
      this.props.navigation.push('ChooseDeliveryAddress');
    } else {
      NotificationAlert('Primeiro defina o local de retirada', 'Instruçōes');
    }
  }

  btnSchedule = () => {
    if (this.state.enderecosConfirmados === true && this.state.distancia > 0) {
      this.props.navigation.push('ChooseSchedule');
    } else {
      NotificationAlert('Necessário o preenchimento dos dados da entrega','Instruções');
    }
  }

  btnDeliveryNow = () => {
    if (this.state.enderecosConfirmados === true && this.state.distancia > 0) {
      this.props.navigation.push('RegisterDelivery');
    } else {
      NotificationAlert('Necessário o preenchimento dos dados da entrega','Instruções');
    }
  }

  calculateDelivery = async () => {
    let jsonData = {
      "cliente": this.state.pessoa.id,
      "tipoVeiculo": this.state.veiculo,
      "deslocamento": this.state.deslocamento,
      "listaEnderecos": [
        {
          "tipoEndereco": "O",
          "cep": this.state.origem.cep,
          "logradouro": this.state.origem.logradouro,
          "numero": this.state.origem.numero,
          "bairro": this.state.origem.bairro,
          "cidade": this.state.origem.cidade,
          "estado": this.state.origem.estado
        },
        {
          "tipoEndereco": "D",
          "cep": this.state.destino.cep,
          "logradouro": this.state.destino.logradouro,
          "numero": this.state.destino.numero,
          "bairro": this.state.destino.bairro,
          "cidade": this.state.destino.cidade,
          "estado": this.state.destino.estado
        }
      ]
    }

    // Calcula a distancia e previsao de duracao
    await API({ token: this.state.token })
      .post(`entregas/calcular-entrega`, jsonData)
      .then(res => {
        if (res.data) {
          let results = res.data;

          this.setState({
            deslocamento: results.deslocamento ? results.deslocamento : 'OD',
            distancia: results.distancia ? results.distancia : 0,
            previsao: results.previsao ? results.previsao.toString() : '00:00:00',
            valor: results.valorTotal ? results.valorTotal : 0,
            tabelaPrecoId: results.tabelaPreco ? results.tabelaPreco : 0
          }, () => {
            this.props.afterDeliveryCalcAction({
              deslocamento: this.state.deslocamento,
              distancia: this.state.distancia,
              previsao: this.state.previsao,
              valorPercurso: this.state.valor,
              total: this.state.valor,
              tabelaPrecoId: this.state.tabelaPrecoId
            });
          });

          if (results.listaEnderecos.length > 0) {
            for (let i = 0; i < results.listaEnderecos.length; i++) {
              if (results.listaEnderecos[i] && results.listaEnderecos[i].tipoEndereco == "O") {
                this.setState({
                  origem: {
                    ...this.state.origem,
                    latitude: results.listaEnderecos[i].lat,
                    longitude: results.listaEnderecos[i].lng
                  }
                }, () => {
                  this.props.pickupAddressAction({ origem: this.state.origem });
                });
              }
              if (results.listaEnderecos[i] && results.listaEnderecos[i].tipoEndereco == "D") {
                this.setState({
                  destino: {
                    ...this.state.destino,
                    latitude: results.listaEnderecos[i].lat,
                    longitude: results.listaEnderecos[i].lng,
                  }
                }, () => {
                  this.props.deliveryAddressAction({ destino: this.state.destino });
                });
              }
            }
          }
        } else {
          NotificationAlert('Não foi possível calcular a distância do trajeto','Erro');
        }
      })
      .catch(error => {
        if (error && error.response && error.response.data) {
          NotificationAlert(ListErrors(error.response.data));
        }
      });
  }

  validateInput = (input, valueInput) => {
    switch (input) {
      case 'veiculo':
        this.setState({
          veiculo: valueInput
        }, () => {
          this.props.vehicleDeliveryAction({ tipoVeiculo: this.state.veiculo });
          if (this.state.enderecosConfirmados === true) {
            this.calculateDelivery();
          }
        });
        break;
    }
  }

  render() {
    return (
      <KeyboardAvoidingView behavior="height" style={[Styles.body, Styles.whiteBg]}>
        <Container>
          <Content>
            <View style={[Styles.textSmallBox, Styles.grayBg]}>
              <Text style={[Styles.font16, Styles.grayColor]}>Veículo desejado</Text>
            </View>

            <View style={Styles.barVehicles}>
              <Button
                onPress={() => this.validateInput('veiculo', 'B')}
                style={Styles.barVehiclesButtom} transparent>
                <Icon
                  type={typeIconDefault}
                  name='bike'
                  style={this.state.veiculo == 'B'
                    ? Styles.barVehiclesIconSelected
                    : Styles.barVehiclesIcon} />
                <Text style={this.state.veiculo == 'B'
                  ? Styles.barVehiclesTextSelected
                  : Styles.barVehiclesText}>Bike</Text>
              </Button>
              <Button
                onPress={() => this.validateInput('veiculo', 'M')}
                style={Styles.barVehiclesButtom} transparent>
                <Icon
                  type={typeIconDefault}
                  name='motorbike'
                  style={this.state.veiculo == 'M'
                    ? Styles.barVehiclesIconSelected
                    : Styles.barVehiclesIcon} />
                <Text style={this.state.veiculo == 'M'
                  ? Styles.barVehiclesTextSelected
                  : Styles.barVehiclesText}>Moto</Text>
              </Button>
              <Button
                onPress={() => this.validateInput('veiculo', 'C')}
                style={Styles.barVehiclesButtom} transparent>
                <Icon
                  type={typeIconDefault}
                  name='car'
                  style={this.state.veiculo == 'C'
                    ? Styles.barVehiclesIconSelected
                    : Styles.barVehiclesIcon} />
                <Text style={this.state.veiculo == 'C'
                  ? Styles.barVehiclesTextSelected
                  : Styles.barVehiclesText}>Carro</Text>
              </Button>
            </View>

            <View style={[Styles.horizontalContainer, Styles.mInternalBox, Styles.yellowLightBg]}>
              <View>
                <Text style={Styles.font12}>Distância: {formatNumber(this.state.distancia)} Km</Text>
              </View>
              <View>
                <Text style={Styles.font12}>Previsão: {this.state.previsao.substr(0, 5) } min</Text>
              </View>
              <View style={[Styles.textBox, Styles.yellowBg, { marginRight: -18 }]}>
                <Text style={Styles.font20}>R$ {formatNumber(this.state.valor)}</Text>
              </View>
            </View>

            <View style={[Styles.horizontalContainer, Styles.mInternalBox]}>
              <View>
                <Icon
                  type={typeIconDefault}
                  name='map-marker'
                  style={[Styles.iconButton, Styles.yellowDarkColor]} />
              </View>
              <View style={[Styles.container, { alignItems: 'flex-start', paddingLeft: 15 }]}>
                <Text style={[
                  Styles.font14,
                  Styles.fontBold,
                  Styles.grayColor
                ]}>{(this.props.entrega.origem) ? 'Local de retirada' : 'Definir local de retirada'}</Text>
                <Text style={[
                  Styles.font12,
                  Styles.grayColor
                ]}>{this.state.enderecoRetirada}</Text>
              </View>
              <View>
                <Button
                  style={Styles.yellowBg}
                  onPress={this.btnPickupAddress}>
                  <Icon
                    type={typeIconDefault}
                    name='plus-circle'
                    style={Styles.font24} />
                </Button>
              </View>
            </View>

            <View style={[Styles.horizontalContainer, Styles.mInternalBox]}>
              <View>
                <Icon
                  type={typeIconDefault}
                  name='map-marker-multiple'
                  style={[Styles.iconButton, Styles.yellowDarkColor]} />
              </View>
              <View style={[Styles.container, { alignItems: 'flex-start', paddingLeft: 15 }]}>
                <Text style={[
                  Styles.font14,
                  Styles.fontBold,
                  Styles.grayColor
                ]}>{(this.props.entrega.destino) ? 'Local de entrega' : 'Definir local de entrega'}</Text>
                <Text style={[
                  Styles.font12,
                  Styles.grayColor
                ]}>{this.state.enderecoEntrega}</Text>
              </View>
              <View>
                <Button
                  style={Styles.yellowBg}
                  onPress={this.btnDeliveryAddress}>
                  <Icon
                    type={typeIconDefault}
                    name='plus-circle'
                    style={Styles.font24} />
                </Button>
              </View>
            </View>

            <View style={Styles.mapaContainer}>
              {
                this.state.enderecosConfirmados === true
                  ? <MakeMap
                    origin={this.state.origem}
                    destination={this.state.destino} />
                  : <Animated.Image
                      style={[Styles.mapaContainer, { width: '100%', marginLeft: 0 }]}
                      source={sourceImageGrayMap} />
              }
            </View>

            <View style={[Styles.container, Styles.mInternalBox]}>
              <TouchableOpacity
                style={Styles.largeBlockButton}
                onPress={this.btnSchedule}>
                <Text style={Styles.textButton}>Agendar</Text>
                <Text style={Styles.font14}>- tempo superior a 30 min</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={Styles.largeBlockButton}
                onPress={this.btnDeliveryNow}>
                <Text style={Styles.textButton}>Entregar Agora</Text>
              </TouchableOpacity>
            </View>
          </Content>
        </Container>
      </KeyboardAvoidingView>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    usuario: state.usuario,
    pessoa: state.pessoa,
    configuracoes: state.configuracoes,
    entrega: state.entrega,
  }
}

const mapDispatchToProps = {
  deliveryInitialStateAction,
  deliveryAddressInitialStateAction,
  vehicleDeliveryAction,
  afterDeliveryCalcAction,
  pickupAddressAction,
  deliveryAddressAction,
  deliveryAddressesOkAction,
  webSocketRegisterAction
}

export default connect(mapStateToProps, mapDispatchToProps)(SolicitationPage);
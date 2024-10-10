import React from 'react';
import { connect } from 'react-redux';
import { 
  View, 
  Text, 
  TextInput, 
  Switch, 
  TouchableOpacity 
} from 'react-native';
import { Item } from 'native-base';
import ValidationComponent from 'react-native-form-validator';

import Styles from '../../assets/scss/styles';
import { NotificationAlert } from '../../components/general/alerts';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { TextInputMask } from 'react-native-masked-text';
import { loginAction } from '../../store/slices/userSlice';
import { personRegisterAction } from '../../store/slices/personSlice';
import { addressRegisterAction } from '../../store/slices/addressSlice';
import { bankDataRegisterAction } from '../../store/slices/bankDataSlice';
import { formatCEP } from '../../components/general/converter';
import API from '../../services/api';
import ListErrors from '../../components/general/listErrors';

const typeIconDefault = "MaterialCommunityIcons";

class EditPerfilPage extends ValidationComponent {
  constructor(props) {
    super(props);
    this.errors = [];
    this.deviceLocale = "ptBR";
    this.state = {
      error: false,
      token: props.configuracoes.token,
      usuario: props.usuario,
      alteradoUsuario: false,
      pessoa: props.pessoa,
      alteradaPessoa: false,
      endereco: props.endereco,
      alteradoEndereco: false,
      dadosBancarios: props.dadosBancarios,
      alteradoDadosBancarios: false,
      fotos: props.fotos,
      alteradasFotos: false,
      listaDeProblemas: []
    }
  }

  componentDidMount() {
    // Consultando endereço do usuário
    this.findAddress();
    // Consultando dados bancários do usuário
    this.findBankData();
  }

  btnNext = async () => {
    // Verificando se os dados do Usuario foram alterados
    if (this.state.alteradoUsuario === true) {
      await this.registerUserData();
    }

    // Verificando se os dados da Pessoa foram alterados
    if (this.state.alteradaPessoa === true) {
      await this.registerPersonData(); 
    }

    // Verificando se os dados do Endereco foram alterados
    if (this.state.alteradoEndereco === true) {
      await this.registerAddressData();
    }

    // Verificando se os dados bancarios foram alterados
    if (this.state.alteradoDadosBancarios === true) {
      await this.registerBankData();
    }

    // Verificando se as fotos dos documentos foram alterados
    if (this.state.alteradasFotos === true) {
      //await this.registerFotos();
    }

    if (this.state.error === true || this.state.listaDeProblemas.length > 0) {
      let errors = { listaDeProblemas: this.state.listaDeProblemas }
      NotificationAlert(ListErrors(errors));
      this.setState({ listaDeProblemas: [] });
    } else {
      NotificationAlert('Dados atualizados com sucesso');
    }
  }

  findAddressByCep = (cep) => {
    API()
      .get(`enderecos/buscar-endereco-por-cep/?cep=${cep}`)
      .then(res => {
        if (res && res.data) {
          this.setState({
            endereco: {
              ...this.state.endereco,
              cep: res.data.cep ? formatCEP(res.data.cep, 'mask') : '',
              logradouro: res.data.logradouro ? res.data.logradouro : '',
              complemento: res.data.complemento ? res.data.complemento : '',
              bairro: res.data.bairro ? res.data.bairro : '',
              cidade: res.data.cidade ? res.data.cidade : '',
              cidadeId: res.data.cidadeId ? res.data.cidadeId : '',
              estado: res.data.estado ? res.data.estado : '',
            }
          });
        } else {
          NotificationAlert('Não foi possível obter a localização pelo CEP');
        }
      })
      .catch(error => {
        if (error && error.response) {
          NotificationAlert('Erro ao obter localização pelo CEP. Código: ' + error.response.status);
        } else {
          NotificationAlert('Erro ao obter localização pelo CEP.');
        }
      });
  }

  findAddress = () => {
    API({ token: this.state.token })
      .get(`pessoas/enderecos/${this.state.pessoa.id}`)
      .then(res => {
        if (res && res.data && res.data.length) {
          res.data.map((currentAddress) => {
            if (currentAddress.proprio === true) {
              this.setState({
                endereco: {
                  id: currentAddress.id,
                  cep: currentAddress.cep,
                  logradouro: currentAddress.logradouro,
                  numero: currentAddress.numero,
                  complemento: currentAddress.complemento,
                  bairro: currentAddress.bairro,
                  referencia: (currentAddress.referencia) ? currentAddress.referencia : '',
                  cidade: (currentAddress.municipio) ? currentAddress.municipio.nome : '',
                  cidadeId: (currentAddress.municipio) ? currentAddress.municipio.id : '',
                  estado: (currentAddress.municipio) ? currentAddress.municipio.estado.sigla : '',
                  proprio: true
                }
              });
            }
          });
        } else {
          NotificationAlert('Não foi possível obter dados do endereço');
        }
      })
      .catch(error => {
        console.log(error);
      });
  }

  findBankData = () => {
    API({ token: this.state.token })
      .get(`contas/ativo/${this.state.pessoa.id}`)
      .then(res => {
        if (res && res.data) {
          this.setState({
            dadosBancarios: res.data 
          });
        }
      })
      .catch(error => {
        console.log(error);
      });
  }

  findBank = async () => {
    await API({ token: this.state.token })
      .get(`bancos/${this.state.dadosBancarios.agencia.banco.codigo}`)
      .then(res => {
        if (res && res.data) {
          this.setState({
            dadosBancarios: {
              ...this.state.dadosBancarios,
              agencia: {
                ...this.state.dadosBancarios.agencia,
                banco: res.data
              }
            }
          });
        }
      })
      .catch(error => {
        console.log(error);
      });
  }

  findAgency = async () => {
    await API({ token: this.state.token })
      .get(`agencias/codigo-agencia/${this.state.dadosBancarios.agencia.codigo}`)
      .then(res => {
        if (res && res.data) {
          this.setState({
            dadosBancarios: {
              ...this.state.dadosBancarios,
              agencia: res.data 
            }
          });
        }
      })
      .catch(error => {
        console.log(error);
      });
  }

  registerAgency = async () => {
    await this.findBank();

    let registerData = {
      banco: {
        ...this.state.dadosBancarios.agencia.banco
      },
      codigo: this.state.dadosBancarios.agencia.codigo,
      nome: this.state.dadosBancarios.agencia.nome
    }

    await API({ token: this.state.token })
      .post(`agencias`, registerData)
      .then(res => {
        if (res && res.data) {
          this.setState({
            dadosBancarios: {
              ...this.state.dadosBancarios,
              agencia: res.data 
            }
          });
        }
      })
      .catch(error => {
        this.setState({ error: true });
        if (error && error.response && error.response.data) {
          this.state.listaDeProblemas.push({ erro: error.response.data.detalhe});
        } else {
          this.state.listaDeProblemas.push('Não foi possível registrar a agencia bancária');
        }
      });
  }

  registerUserData = () => {
    // Dados para registro no Webservice
    let registerData = {
      ...this.state.usuario,
      pessoa: { id: this.state.pessoa.id }
    }

    // Registrando dados basicos do usuario
    API({ token: this.state.token })
      .put(`usuarios/${this.state.usuario.id}`, registerData)
      .then(res => {
        if (res && (res.status == 204 || res.status == 200)) {
          this.props.loginAction({
            ...this.state.usuario
          });
        } else {
          this.setState({ error: true });
        }
      })
      .catch(error => {
        this.setState({ error: true });
        if (error && error.response && error.response.data) {
          this.state.listaDeProblemas.push({ erro: error.response.data.detalhe});
        } else {
          this.state.listaDeProblemas.push('Não foi possível atualizar seus dados de usuário');
        }
      });
  }

  registerPersonData = () => {
    // Dados para registro no Webservice
    let registerData = {
      ...this.state.pessoa
    }

    // Registrando dados basicos da pessoa
    API({ token: this.state.token })
      .put(`pessoas/${this.state.pessoa.id}`, registerData)
      .then(res => {
        if (res && (res.status == 204 || res.status == 200)) {
          this.props.personRegisterAction({
            ...this.state.pessoa
          });
        } else {
          this.setState({ error: true });
        }
      })
      .catch(error => {
        this.setState({ error: true });
        if (error && error.response && error.response.data) {
          this.state.listaDeProblemas.push({ erro: error.response.data.detalhe});
        } else {
          this.state.listaDeProblemas.push('Não foi possível atualizar seus dados pessoais');
        }
      });
  }

  registerAddressData = () => {
    // Dados para registro no Webservice
    let registerData = {
      ...this.state.endereco,
      idPessoa: this.state.pessoa.id,
      municipio: this.state.endereco.cidade,
      nomeCliente: this.state.usuario.nome,
      telefoneCliente: this.state.usuario.telefone
    }

    API({ token: this.state.token })
      .put(`enderecos/${this.state.endereco.id}`, registerData)
      .then(res => {
        if (res && (res.status == 204 || res.status == 200)) {
          // Registrando o endereço do usuário na Store
          this.props.addressRegisterAction(registerData);
        } else {
          this.setState({ error: true });
        }
      })
      .catch(error => {
        this.setState({ error: true });
        if (error && error.response && error.response.data) {
          this.state.listaDeProblemas.push({ erro: error.response.data.detalhe});
        } else {
          this.state.listaDeProblemas.push('Não foi possível atualizar seu endereço');
        }
      });
  }

  registerBankData = async () => {
    // Verifica se a agencia foi encontrada
    if (!this.state.dadosBancarios.agencia.id) {
      // Registra a agencia
      await this.registerAgency();
    }

    // Dados para registro no Webservice
    let registerData = {
      pessoa: { id: this.state.pessoa.id },
      tipoConta: (this.state.dadosBancarios.tipoConta) ? this.state.dadosBancarios.tipoConta : 'C',
      agencia: { id: this.state.dadosBancarios.agencia.id },
      codigo: this.state.dadosBancarios.codigo,
      ativo: true
    }

    // Verifica se existe ID dos dados bancarios
    if (!this.state.dadosBancarios.id) {
      await API({ token: this.state.token })
        .post(`contas`, registerData)
        .then(res => {
          if (res && (res.status == 204 || res.status == 200)) {
            // Registrando dados bancários na Store
            this.props.bankDataRegisterAction(this.state.dadosBancarios);
          } else {
            this.setState({ error: true });
          }
        })
        .catch(error => {
          this.setState({ error: true });
          if (error && error.response && error.response.data) {
            this.state.listaDeProblemas.push({ erro: error.response.data.detalhe});
          } else {
            this.state.listaDeProblemas.push('Não foi possível atualizar seus dados bancários');
          }
        });
    } else {
      await API({ token: this.state.token })
        .put(`contas/${this.state.dadosBancarios.id}`, registerData)
        .then(res => {
          if (res && (res.status == 204 || res.status == 200)) {
            // Registrando dados bancários na Store
            this.props.bankDataRegisterAction(this.state.dadosBancarios);
          } else {
            this.setState({ error: true });
          }
        })
        .catch(error => {
          this.setState({ error: true });
          if (error && error.response && error.response.data) {
            this.state.listaDeProblemas.push({ erro: error.response.data.detalhe});
          } else {
            this.state.listaDeProblemas.push('Não foi possível atualizar seus dados bancários');
          }
        });
    }
  }

  validateInput = (input, valueInput) => {
    switch (input) {
      case 'nome': 
        this.setState({ 
          usuario: {
            ...this.state.usuario,
            nome: valueInput
          },
          alteradoUsuario: true
        }); 
        break;
      case 'cpfCnpj': 
        this.setState({ 
          pessoa: {
            ...this.state.pessoa,
            cpfCnpj: valueInput
          },
          alteradaPessoa: true 
        }); 
        break;
      case 'telefone':
        this.setState({ 
          usuario: {
            ...this.state.usuario,
            telefone: valueInput
          },
          alteradoUsuario: true
        });
        break;
      case 'email':
        this.setState({ 
          usuario: {
            ...this.state.usuario,
            email: valueInput
          },
          alteradoUsuario: true
        });
        break;
      case 'cep':
        this.setState({ 
          endereco: {
            ...this.state.endereco,
            cep: valueInput
          },
          alteradoEndereco: true 
        });
        if (valueInput.length == 9) {
          this.findAddressByCep(valueInput);
        }
        break;
      case 'logradouro': 
        this.setState({ 
          endereco: {
            ...this.state.endereco,
            logradouro: valueInput
          },
          alteradoEndereco: true 
        });
        break;
      case 'numero': 
        this.setState({ 
          endereco: {
            ...this.state.endereco,
            numero: valueInput
          },
          alteradoEndereco: true
        });
        break;
      case 'complemento': 
        this.setState({ 
          endereco: {
            ...this.state.endereco,
            complemento: valueInput
          },
          alteradoEndereco: true 
        });
        break;
      case 'bairro': 
        this.setState({ 
          endereco: {
            ...this.state.endereco,
            bairro: valueInput 
          },
          alteradoEndereco: true
        });
        break;
      case 'referencia': 
        this.setState({ 
          endereco: {
            ...this.state.endereco,
            referencia: valueInput 
          },
          alteradoEndereco: true
        });
        break;
      case 'cidade': 
        this.setState({ 
          endereco: {
            ...this.state.endereco,
            cidade: valueInput 
          },
          alteradoEndereco: true
        });
        break;
      case 'estado': 
        this.setState({ 
          endereco: {
            ...this.state.endereco,
            estado: valueInput 
          },
          alteradoEndereco: true
        });
        break;
      case 'tipoConta':
        this.setState({ 
          dadosBancarios: {
            ...this.state.dadosBancarios,
            tipoConta: (valueInput === true) ? 'P' : 'C'
          },
          alteradoDadosBancarios: true
        });
        break;
      case 'banco': 
        this.setState({ 
          dadosBancarios: {
            ...this.state.dadosBancarios,
            agencia: {
              ...this.state.dadosBancarios.agencia,
              banco: {
                ...this.state.dadosBancarios.agencia.banco,
                codigo: valueInput
              }
            }
          },
          alteradoDadosBancarios: true
        });
        break;
      case 'agencia': 
        this.setState({ 
          dadosBancarios: {
            ...this.state.dadosBancarios,
            agencia: {
              ...this.state.dadosBancarios.agencia,
              codigo: valueInput
            }
          },
          alteradoDadosBancarios: true
        }, () => {
          if (valueInput.length >= 3) {
            this.findAgency();
          }
        });
        break;
      case 'agenciaNome': 
        this.setState({ 
          dadosBancarios: {
            ...this.state.dadosBancarios,
            agencia: {
              ...this.state.dadosBancarios.agencia,
              nome: valueInput
            }
          },
          alteradoDadosBancarios: true
        });
        break;
      case 'codigo': 
        this.setState({ 
          dadosBancarios: {
            ...this.state.dadosBancarios,
            codigo: valueInput
          },
          alteradoDadosBancarios: true
        });
        break;
    }
  }

  render() {
    return (
      <KeyboardAwareScrollView style={[Styles.body, Styles.whiteBg]}>
        <View style={Styles.contentContainer}>
          <View style={[
                Styles.horizontalContainer,
                Styles.grayLightBorder,
                Styles.grayBg,
                Styles.font16, 
                Styles.grayColor,
                { flex: 0, width: '100%', borderBottomWidth: 2 }
              ]}>
            <Text style={[Styles.fontUppercase, Styles.fontBold]}>DADOS BÁSICOS</Text>
          </View>
          <View style={Styles.formContainer}>
            <Text style={[Styles.font16, Styles.fontBold]}>Nome</Text>
            <Item>
              <TextInput
                ref="nome"
                placeholderTextColor="#575757"
                style={Styles.inputText}
                value={this.state.usuario.nome}
                onChangeText={valueInput => this.validateInput('nome', valueInput)} />
            </Item>
            <Text style={[Styles.font16, Styles.fontBold]}>Telefone</Text>
            <Item>
              <TextInputMask
                ref="telefone"
                type={'cel-phone'}
                options={{
                  maskType: 'BRL',
                  withDDD: true,
                  dddMask: '(99)'
                }}
                placeholderTextColor="#575757"
                style={Styles.inputText}
                value={this.state.usuario.telefone}
                onChangeText={valueInput => this.validateInput('telefone', valueInput)} />
            </Item>
            <Text style={[Styles.font16, Styles.fontBold]}>E-mail</Text>
            <Item>
              <TextInput
                ref="email"
                placeholderTextColor="#575757"
                autoCapitalize="none"
                style={Styles.inputText}
                value={this.state.usuario.email}
                onChangeText={valueInput => this.validateInput('email', valueInput)} />
            </Item>
            {(this.state.pessoa && this.state.pessoa.tipo == 'J') ? (
              <View>
                <Text style={[Styles.font16, Styles.fontBold]}>CNPJ</Text>
                <Item>
                  <TextInputMask
                    ref="cpfCnpj"
                    type={'cnpj'}
                    placeholderTextColor="#575757"
                    style={Styles.inputText}
                    value={this.state.pessoa.cpfCnpj}
                    onChangeText={valueInput => this.validateInput('cpfCnpj', valueInput)} />
                </Item>
              </View>
            ) : (
              <View>
                <Text style={[Styles.font16, Styles.fontBold]}>CPF</Text>
                <Item>
                  <TextInputMask
                    ref="cpfCnpj"
                    type={'cpf'}
                    placeholderTextColor="#575757"
                    style={Styles.inputText}
                    value={this.state.pessoa.cpfCnpj}
                    onChangeText={valueInput => this.validateInput('cpfCnpj', valueInput)} />
                </Item>
              </View>
            )}
          </View>
          <View style={[
                Styles.horizontalContainer,
                Styles.grayLightBorder,
                Styles.grayBg,
                Styles.font16, 
                Styles.grayColor,
                { flex: 0, width: '100%', borderBottomWidth: 2 }
              ]}>
            <Text style={[Styles.fontUppercase, Styles.fontBold]}>ENDEREÇO</Text>
          </View>
          <View style={Styles.formContainer}>
            <Text style={[Styles.font16, Styles.fontBold]}>CEP</Text>
            <Item>
              <TextInputMask
                ref="cep"
                type={'zip-code'}
                placeholderTextColor="#575757"
                style={Styles.inputText}
                value={this.state.endereco.cep}
                onChangeText={valueInput => this.validateInput('cep', valueInput)} />
            </Item>
            <Text style={[Styles.font16, Styles.fontBold]}>Logradouro</Text>
            <Item>
              <TextInput
                ref="logradouro"
                placeholderTextColor="#575757"
                maxLength={60}
                style={Styles.inputText}
                value={this.state.endereco.logradouro}
                onChangeText={valueInput => this.validateInput('logradouro', valueInput)} />
            </Item>
            <Text style={[Styles.font16, Styles.fontBold]}>Número</Text>
            <Item>
              <TextInput
                ref="numero"
                placeholderTextColor="#575757"
                maxLength={10}
                style={Styles.inputText}
                value={this.state.endereco.numero}
                onChangeText={valueInput => this.validateInput('numero', valueInput)} />
            </Item>
            <Text style={[Styles.font16, Styles.fontBold]}>Complemento</Text>
            <Item>
              <TextInput
                ref="complemento"
                placeholderTextColor="#575757"
                maxLength={60}
                style={Styles.inputText}
                value={this.state.endereco.complemento}
                onChangeText={valueInput => this.validateInput('complemento', valueInput)} />
            </Item>
            <Text style={[Styles.font16, Styles.fontBold]}>Bairro</Text>
            <Item>
              <TextInput
                ref="bairro"
                placeholderTextColor="#575757"
                maxLength={60}
                style={Styles.inputText}
                value={this.state.endereco.bairro}
                onChangeText={valueInput => this.validateInput('bairro', valueInput)} />
            </Item>
            <Text style={[Styles.font16, Styles.fontBold]}>Referência</Text>
            <Item>
              <TextInput
                ref="referencia"
                placeholderTextColor="#575757"
                maxLength={60}
                style={Styles.inputText}
                value={this.state.endereco.referencia}
                onChangeText={valueInput => this.validateInput('referencia', valueInput)} />
            </Item>
            <Text style={[Styles.font16, Styles.fontBold]}>Cidade</Text>
            <Item>
              <TextInput
                ref="cidade"
                placeholderTextColor="#575757"
                maxLength={60}
                style={Styles.inputText}
                value={this.state.endereco.cidade}
                onChangeText={valueInput => this.validateInput('cidade', valueInput)} />
            </Item>
            <Text style={[Styles.font16, Styles.fontBold]}>Estado</Text>
            <Item>
              <TextInput
                ref="estado"
                placeholderTextColor="#575757"
                maxLength={2}
                style={Styles.inputText}
                value={this.state.endereco.estado}
                onChangeText={valueInput => this.validateInput('estado', valueInput)} />
            </Item>
          </View>
          <View style={[
                Styles.horizontalContainer,
                Styles.grayLightBorder,
                Styles.grayBg,
                Styles.font16, 
                Styles.grayColor,
                { flex: 0, width: '100%', borderBottomWidth: 2 }
              ]}>
            <Text style={[Styles.fontUppercase, Styles.fontBold]}>DADOS BANCÁRIOS</Text>
          </View>
          <View style={Styles.formContainer}>
            <View style={Styles.horizontalContainer}>
              <Text style={Styles.font16}>C. CORRENTE</Text>
              <Switch
                trackColor={{ true: '#000000', false: '#000000' }}
                thumbColor={"#f4f3f4"}
                ios_backgroundColor="#3e3e3e"
                onValueChange={valueInput => this.validateInput('tipoConta', valueInput)}
                value={this.state.dadosBancarios.tipoConta == 'P'}
              />
              <Text style={Styles.font16}>C. POUPANÇA</Text>
            </View>
            <Text style={[Styles.font16, Styles.fontBold]}>Código do Banco</Text>
            <Item>
              <TextInput
                ref="banco"
                placeholderTextColor="#575757"
                maxLength={3}
                style={Styles.inputText}
                value={this.state.dadosBancarios.agencia.banco.codigo}
                onChangeText={valueInput => this.validateInput('banco', valueInput)} />
            </Item>
            <Text style={[Styles.font16, Styles.fontBold]}>Agência</Text>
            <Item>
              <TextInput
                ref="agencia"
                placeholderTextColor="#575757"
                maxLength={10}
                style={Styles.inputText}
                value={this.state.dadosBancarios.agencia.codigo}
                onChangeText={valueInput => this.validateInput('agencia', valueInput)} />
            </Item>
            <Text style={[Styles.font16, Styles.fontBold]}>Nome da Agência</Text>
            <Item>
              <TextInput
                ref="agenciaNome"
                placeholderTextColor="#575757"
                maxLength={40}
                style={Styles.inputText}
                value={this.state.dadosBancarios.agencia.nome}
                onChangeText={valueInput => this.validateInput('agenciaNome', valueInput)} />
            </Item>
            <Text style={[Styles.font16, Styles.fontBold]}>Conta</Text>
            <Item>
              <TextInput
                ref="codigo"
                placeholderTextColor="#575757"
                maxLength={10}
                style={Styles.inputText}
                value={this.state.dadosBancarios.codigo}
                onChangeText={valueInput => this.validateInput('codigo', valueInput)} />
            </Item>
          </View>
        </View>
        <View style={[Styles.container, Styles.mInternalBox]}>
          <TouchableOpacity
            style={[Styles.largeBlockButton, Styles.m10]}
            onPress={this.btnNext}>
            <Text style={Styles.textButton}>ATUALIZAR</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAwareScrollView>
    )
  }

}

const mapStateToProps = (state) => {
  return {
    usuario: state.usuario,
    pessoa: state.pessoa,
    configuracoes: state.configuracoes,
    endereco: state.endereco,
    dadosBancarios: state.dadosBancarios,
    fotos: state.fotos
  }
}

const mapDispatchToProps = { 
  loginAction, 
  personRegisterAction,
  addressRegisterAction, 
  bankDataRegisterAction 
}

export default connect(mapStateToProps, mapDispatchToProps)(EditPerfilPage);
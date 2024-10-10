import React, { useEffect, useContext, useState, createContext } from 'react';
import { useHistory } from 'react-router-dom';
import apiLogin from '../services/apiLogin';
import apiBack from '../services/apiBack';
import { useAlerta } from '../contexts/AlertaCtx';

const AutenticacaoCtx = createContext();

export function AutenticacaoProvider({ children }) {

  const history = useHistory();
  const { setConteudo } = useAlerta();
  const [autenticado, setAutenticado] = useState(false);
  const [carregando, setCarregando] = useState(true);
  const [progresso, setProgresso] = useState(false);
  const [idUsuario, setIdUsuario] = useState();
  const [nomeUsuario, setNomeUsuario] = useState('');
  const [avatarUsuario, setAvatarUsuario] = useState('');
  const [idMembro, setIdMembro] = useState();
  const [nomeMembro, setNomeMembro] = useState('');
  const [tipoMembro] = useState([]);
  const [token, setToken] = useState('');

  useEffect(() => {
    // if (token || localStorage.getItem('chamaih_token')) {

    if (token) {
      setAutenticado(true);
    } else {
      setAutenticado(false);
    }
    setCarregando(false);
  }, [token]);

  function getDadosAutenticacao(response) {
    setIdUsuario(response.data.id);
    setNomeUsuario(response.data.nome);     
    setToken(response.data.access_token);
    // localStorage.setItem('chamaih_token', response.data.access_token);
  }

  async function getPessoa(response) {
    apiBack.defaults.headers.Authorization = `Bearer ${response.data.access_token}`;
    await apiBack.get(`/usuarios/${response.data.id}`)
    .then(resposta => {
      setIdMembro(resposta.data.pessoa.id);
      setNomeMembro(resposta.data.pessoa.nome);      
      tipoMembro.length = 0;
      if (resposta.data.pessoa.entregador) {
        tipoMembro.push('ENT');
      };
      if (resposta.data.pessoa.parceiro) {
        tipoMembro.push('PAR');
      }; 
      if (resposta.data.pessoa.cliente) {
        tipoMembro.push('CLI');
      }; 
      if (resposta.data.pessoa.colaborador) {
        tipoMembro.push('COL');        
      };

      apiBack.get(`/fotos/pessoa/${resposta.data.pessoa.id}/tipo?tipoFoto=P`)
      .then(resposta => {
        if (resposta.data) {
          setAvatarUsuario(resposta.data.link);
        }            
      }); 
    });

    setProgresso(false);
    setAutenticado(true);
    setConteudo({
      tipo: 'success',
      descricao: 'Usuário autenticado com sucesso!',
      exibir: true
    });

    history.push('/dashboard');
  }

  async function handleLogin(usuario, senha) {
    let formData = new URLSearchParams();
    formData.append('client', 'app-chamai-web');
    formData.append('username', usuario);
    formData.append('password', senha);
    formData.append('grant_type', 'password');

    try {
      await apiLogin.post('/oauth/token', formData)
      .then(function (response) {
        getDadosAutenticacao(response);
        getPessoa(response);
      })
      .catch(function (error) {
        setAutenticado(false);
        if (error.toString().includes('Network Error')) {
          setProgresso(false);
          setConteudo({
            tipo: 'error',
            titulo: 'Sem Conexão',
            descricao: 'Não foi possível conectar aos nossos servidores. ' +
              'Verifique sua conexão com a Internet.',
            exibir: true
          });
        } else {
          const { error_descripion } = error.response.data;
          if (error.response.data.error === 'invalid_grant') {
            setProgresso(false);
            setConteudo({
              tipo: 'error',
              titulo: 'Autenticação',
              descricao: 'Usuário ou senha inválidos',
              exibir: true
            });
          } else {
            setProgresso(false);
            setConteudo({
              tipo: 'error',
              titulo: 'Erro',
              descricao: error_descripion,
              exibir: true
            });
          }
        }
      });
    } catch (error) {
      setProgresso(false);
      setConteudo({
        tipo: 'error',
        titulo: 'Erro',
        descricao: error.toString(),
        exibir: true
      });
    }
  }

  function handleLogout() {
    setIdUsuario('');
    setNomeUsuario(''); 
    setAvatarUsuario('');
    setToken('');    
    setIdMembro('');
    setNomeMembro(''); 
    setProgresso(false);
    setAutenticado(false);
    tipoMembro.length = 0;
    apiBack.defaults.headers.Authorization = undefined;
    // localStorage.clear();
    history.push('/login');
  }

  return (
    <AutenticacaoCtx.Provider
      value={{ 
        carregando, autenticado, setAutenticado, handleLogin, handleLogout, 
        progresso, setProgresso, idUsuario, nomeUsuario, avatarUsuario,  
        idMembro, nomeMembro, tipoMembro, token  
      }}
    >
      {children}
    </AutenticacaoCtx.Provider>
  );
}

export function useAutenticacao() {
  const context = useContext(AutenticacaoCtx);
  return context;
}
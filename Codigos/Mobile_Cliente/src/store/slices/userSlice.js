import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  id: null,
  nome: null,
  login: null,
  email: null,
  telefone: null,
  senha: null, 
  senhaSocial: null,
  dataInclusao: null,
  dataAlteracao: null,
  ativo: false,
  pessoa: null,
  permissoes: null
}

const userSlice = createSlice({
  name: 'usuario',
  initialState,
  reducers: {
    loginAction: (state, action) => ({
      ...state,
      id: action.payload.id,
      nome: action.payload.nome,
      email: action.payload.email,
      telefone: action.payload.telefone,
      senha: action.payload.senha,
      senhaSocial: action.payload.senhaSocial,
      ativo: action.payload.ativo,
      pessoa: action.payload.pessoa,
      permissoes: action.payload.permissoes
    }),
    logoutAction: (state) => (
      initialState
    ),
    userRegisterAction: (state, action) => ({
      ...state,
      nome: action.payload.nome,
      login: action.payload.login,
      senha: action.payload.senha,
      dataInclusao: action.payload.dataInclusao,
      dataAlteracao: action.payload.dataAlteracao,
      ativo: action.payload.ativo,
      pessoa: action.payload.pessoa
    }),
    userPasswordRegisterAction: (state, action) => ({
      ...state,
      senha: action.payload.senha
    })
  }
});

export const {
  loginAction,
  logoutAction,
  userRegisterAction,
  userPasswordRegisterAction
} = userSlice.actions;
export const userSelector = state => state.usuario;
export default userSlice.reducer;

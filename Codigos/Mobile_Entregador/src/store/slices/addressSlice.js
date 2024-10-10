import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  id: null,
  cep: null,
  logradouro: null,
  numero: null,
  complemento: null,
  bairro: null,
  referencia: null,
  cidade: null,
  cidadeId: null,
  estado: null,
  latitude: null,
  longitude: null,
  ativo: true,
  proprio: false
}

const addressSlice = createSlice({
  name: 'endereco',
  initialState: initialState,
  reducers: {
    addressInitialStateAction: () => (
      initialState
    ),
    addressRegisterAction: (state, action) => ({
      ...state,
      cep: action.payload.cep,
      logradouro: action.payload.logradouro,
      numero: action.payload.numero ? action.payload.numero : 's/n',
      complemento: action.payload.complemento ? action.payload.complemento : 'nada consta',
      bairro: action.payload.bairro,
      referencia: action.payload.referencia ? action.payload.referencia : null,
      cidade: action.payload.cidade,
      cidadeId: action.payload.cidadeId,
      estado: action.payload.estado,
      proprio: (action.payload.proprio === true) ? true : false
    }),
  }
});

export const { 
  addressInitialStateAction,
  addressRegisterAction
} = addressSlice.actions;
export const addressSelector = state => state.endereco;
export default addressSlice.reducer;

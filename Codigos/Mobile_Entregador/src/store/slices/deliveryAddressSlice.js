import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  id: null,
  entrega: null,
  tipoEndereco: null,
  cep: null,
  logradouro: null,
  numero: null,
  complemento: null,
  bairro: null,
  referencia: null,
  municipio: null,
  contato: null,
  telefone: null,
  tarefa: null,
  adicionarFavorito: false
}

const deliveryAddressSlice = createSlice({
  name: 'entregaEndereco',
  initialState: initialState,
  reducers: {
    deliveryAddressInitialStateAction: () => (
      initialState
    ),
    deliveryAddressRegisterAction: (state, action) => ({
      ...state,
      id: action.payload.id,
      entrega: action.payload.entrega,
      tipoEndereco: action.payload.tipoEndereco,
      cep: action.payload.cep,
      logradouro: action.payload.logradouro,
      numero: action.payload.numero ? action.payload.numero : 's/n',
      complemento: action.payload.complemento ? action.payload.complemento : 'nada consta',
      bairro: action.payload.bairro,
      referencia: action.payload.referencia ? action.payload.referencia : null,
      municipio: action.payload.municipio,
      contato: action.payload.contato,
      telefone: action.payload.telefone,
      tarefa: action.payload.tarefa,
      adicionarFavorito: action.payload.adicionarFavorito
    })
  }
});

export const { 
  deliveryAddressInitialStateAction,
  deliveryAddressRegisterAction
} = deliveryAddressSlice.actions;
export const deliveryAddressSelector = state => state.entregaEndereco;
export default deliveryAddressSlice.reducer;

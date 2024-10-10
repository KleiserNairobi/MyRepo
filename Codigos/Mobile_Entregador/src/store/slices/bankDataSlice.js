import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  id: null,
  pessoa: null,
  tipoConta: null,
  agencia: {
    id: null,
    banco: {
      id: null,
      codigo: null,
      nome: null
    },
    codigo: null,
    nome: null
  },
  codigo: null,
  ativo: true
}

const bankDataSlice = createSlice({
  name: 'dadosBancarios',
  initialState: initialState,
  reducers: {
    bankDataInitialStateAction: () => (
      initialState
    ),
    bankDataRegisterAction: (state, action) => ({
      ...state,
      id: action.payload.id,
      pessoa: action.payload.pessoa,
      tipoConta: action.payload.tipoConta,
      agencia: action.payload.agencia,
      codigo: action.payload.codigo,
      ativo: (action.payload.ativo === false) ? false : true
    }),
  }
});

export const { 
  bankDataInitialStateAction,
  bankDataRegisterAction
} = bankDataSlice.actions;
export const bankDataSelector = state => state.dadosBancarios;
export default bankDataSlice.reducer;

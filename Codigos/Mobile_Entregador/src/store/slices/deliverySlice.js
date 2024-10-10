import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  id: null,
  solicitante: null,
  data: null,
  enderecoRetirada: null,
  enderecoEntrega: null,
  distancia: null,
  tipoPagamento: null,
  valorEntrega: 0
}

const deliverySlice = createSlice({
  name: 'entrega',
  initialState: initialState,
  reducers: {
    deliveryInitialStateAction: () => (
      initialState
    ),
    deliveryRegisterAction: (state, action) => ({
      ...state,
      id: action.payload.id,
      solicitante: action.payload.solicitante,
      data: action.payload.data,
      enderecoRetirada: action.payload.enderecoRetirada,
      enderecoEntrega: action.payload.enderecoEntrega,
      distancia: action.payload.distancia,
      tipoPagamento: action.payload.tipoPagamento,
      valorEntrega: action.payload.valorEntrega
    }),
  }
});

export const {
  deliveryInitialStateAction,
  deliveryRegisterAction
} = deliverySlice.actions;
export const deliverySelector = state => state.entrega;
export default deliverySlice.reducer;

import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  id: null,
  tipo: null, // B, M, C, CM
  descricao: null,
  modelo: null,
  placa: null,
  renavan: null,
  pessoa: null,
  ativo: null
}

const vehicleSlice = createSlice({
  name: 'veiculo',
  initialState,
  reducers: {
    vehicleInitialStateAction: (state) => (
      initialState
    ),
    vehicleRegisterAction: (state, action) => ({
      ...state,
      id: action.payload.id,
      tipo: action.payload.tipo,
      descricao: action.payload.descricao,
      modelo: action.payload.modelo,
      placa: action.payload.placa,
      renavan: action.payload.renavan,
      pessoa: action.payload.pessoa,
      ativo: action.payload.ativo
    }),
    vehicleActiveAction: (state, action) => ({
      ...state,
      ativo: action.payload.ativo
    })
  }
});

export const {
  vehicleInitialStateAction,
  vehicleRegisterAction,
  vehicleActiveAction
} = vehicleSlice.actions;
export const vehicleSelector = state => state.veiculo;
export default vehicleSlice.reducer;

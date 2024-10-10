import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  token: null,
  dataToken: null,
  dataExpiracaoToken: null,
  termo: 'Aqui ficará o termo',
  wSocket: null,
  wSocketReconnect: true,
}

const configSlice = createSlice({
  name: 'configuracoes',
  initialState,
  reducers: {
    configInitialStateAction: () => (
      initialState
    ),
    tokenRegisterAction: (state, action) => ({
      ...state,
      token: action.payload.token,
      dataToken: action.payload.dataToken,
      dataExpiracaoToken: action.payload.dataExpiracaoToken
    }),
    termRegisterAction: (state, action) => ({
      ...state,
      termo: action.payload.termo
    }),
    webSocketRegisterAction: (state, action) => ({
      ...state,
      wSocket: action.payload.wSocket
    }),
    webSocketReconnectAction: (state, action) => ({
      ...state,
      wSocketReconnect: action.payload.wSocketReconnect
    }),
  }
});

export const {
  configInitialStateAction,
  tokenRegisterAction,
  termRegisterAction,
  webSocketRegisterAction,
  webSocketReconnectAction,
} = configSlice.actions;
export const configSelector = state => state.configuracoes;
export default configSlice.reducer;

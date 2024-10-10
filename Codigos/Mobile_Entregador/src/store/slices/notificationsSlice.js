import { createSlice } from '@reduxjs/toolkit';

const initialState = {
	qtdNovasChatSuporte: 0,
	notificacoesChatSuporte: [],
	qtdNovasEntregas: 0,
	notificacoesEntregas: [],
	qtdNovasChatCliente: 0,
	notificacoesChatCliente: []
}

const notificationsSlice = createSlice({
  name: 'notificacoes',
  initialState,
  reducers: {
    notificationsInitialStateAction: () => (
      initialState
    ),
    newQuantityChatSupportAction: (state, action) => ({
      ...state,
      qtdNovasChatSuporte: action.payload.quantidade
    }),
    chatSupportNotificationsAction: (state, action) => ({
      ...state,
      notificacoesChatSuporte: action.payload.notificacoes
    }),
    newQuantityDeliveriesAction: (state, action) => ({
      ...state,
      qtdNovasEntregas: action.payload.quantidade
    }),
    deliveriesNotificationsAction: (state, action) => ({
      ...state,
      notificacoesEntregas: action.payload.notificacoes
    }),
    newQuantityChatClientAction: (state, action) => ({
      ...state,
      qtdNovasChatCliente: action.payload.quantidade
    }),
    chatClientNotificationsAction: (state, action) => ({
      ...state,
      notificacoesChatCliente: action.payload.notificacoes
    })
  }
});

export const {
  notificationsInitialStateAction,
  newQuantityChatSupportAction,
  chatSupportNotificationsAction,
  newQuantityDeliveriesAction,
  deliveriesNotificationsAction,
  newQuantityChatClientAction,
  chatClientNotificationsAction
} = notificationsSlice.actions;
export const notificationsSelector = state => state.notificacoes;
export default notificationsSlice.reducer;

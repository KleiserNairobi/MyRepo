import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  id: null,
  cliente: null,
  data: null,
  tipoVeiculo: null,
  origem: null,
  destino: null,
  enderecosConfirmados: false,
  distancia: null,
  deslocamento: null,
  horaChegada: null,
  horaSaida: null,
  previsao: null,
  entregador: null,
  statusSolicitacao: null,
  tabelaPrecoId: null,
  tipoPagamento: null,
  descontoId: null,
  statusPagamento: null,
  pagamentoId: null,
  gatewayPagamento: null,
  cartao: null,
  valorPercurso: 0,
  valorProduto: 0,
  valorDesconto: 0,
  total: 0,
  agendamento: null,
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
      cliente: action.payload.cliente,
      data: action.payload.data,
      tipoVeiculo: action.payload.tipoVeiculo,
      distancia: action.payload.distancia,
      deslocamento: action.payload.deslocamento,
      horaChegada: action.payload.horaChegada,
      horaSaida: action.payload.horaSaida,
      previsao: action.payload.previsao,
      entregador: action.payload.entregador,
      statusSolicitacao: action.payload.statusSolicitacao,
      agendamento: action.payload.agendamento,
    }),
    clientDeliveryAction: (state, action) => ({
      ...state,
      cliente: action.payload.cliente,
    }),
    vehicleDeliveryAction: (state, action) => ({
      ...state,
      tipoVeiculo: action.payload.tipoVeiculo
    }),
    pickupAddressAction: (state, action) => ({
      ...state,
      origem: action.payload.origem
    }),
    instructionsPickupAddressAction: (state, action) => ({
      ...state,
      origem: {
        ...state.origem,
        contato: action.payload.contato,
        telefone: action.payload.telefone,
        tarefa: action.payload.tarefa
      }
    }),
    deliveryAddressAction: (state, action) => ({
      ...state,
      destino: action.payload.destino
    }),
    instructionsDeliveryAddressAction: (state, action) => ({
      ...state,
      destino: {
        ...state.destino,
        contato: action.payload.contato,
        telefone: action.payload.telefone,
        tarefa: action.payload.tarefa
      }
    }),
    deliveryAddressesOkAction: (state, action) => ({
      ...state,
      enderecosConfirmados: action.payload.enderecosConfirmados
    }),
    afterDeliveryCalcAction: (state, action) => ({
      ...state,
      deslocamento: action.payload.deslocamento,
      distancia: action.payload.distancia,
      previsao: action.payload.previsao,
      valorPercurso: action.payload.valorPercurso,
      total: action.payload.total,
      tabelaPrecoId: action.payload.tabelaPrecoId
    }),
    displacementAction: (state, action) => ({
      ...state,
      deslocamento: action.payload.deslocamento
    }),
    distanceAndPrevisionAction: (state, action) => ({
      ...state,
      distancia: action.payload.distancia,
      previsao: action.payload.previsao
    }),
    deliveryRouteValueAction: (state, action) => ({
      ...state,
      valorPercurso: action.payload.valorPercurso,
    }),
    deliveryTotalValueAction: (state, action) => ({
      ...state,
      total: action.payload.total
    }),
    deliveryPaymentTypeAction: (state, action) => ({
      ...state,
      tipoPagamento: action.payload.tipoPagamento
    }),
    deliveryDiscountAction: (state, action) => ({
      ...state,
      descontoId: action.payload.descontoId,
      valorDesconto: action.payload.valorDesconto
    }),
    deliveryPriceTableAction: (state, action) => ({
      ...state,
      tabelaPrecoId: action.payload.tabelaPrecoId
    }),
    deliveryProductsValuesAction: (state, action) => ({
      ...state,
      valorProduto: action.payload.valorProduto
    }),
    statusPaymentAction: (state, action) => ({
      ...state,
      statusPagamento: action.payload.statusPagamento,
      pagamentoId: action.payload.pagamentoId
    }),
    gatewayPaymentAction: (state, action) => ({
      ...state,
      gatewayPagamento: action.payload.gatewayPagamento
    }),
    paymentCardAction: (state, action) => ({
      ...state,
      cartao: action.payload.cartao
    }),
    scheduleRegisterAction: (state, action) => ({
      ...state,
      agendamento: action.payload.agendamento
    }),
    deliverymanAction: (state, action) => ({
      ...state,
      entregador: action.payload.entregador
    })
  }
});

export const {
  deliveryInitialStateAction,
  deliveryRegisterAction,
  clientDeliveryAction,
  vehicleDeliveryAction,
  pickupAddressAction,
  instructionsPickupAddressAction,
  deliveryAddressAction,
  instructionsDeliveryAddressAction,
  deliveryAddressesOkAction,
  afterDeliveryCalcAction,
  displacementAction,
  distanceAndPrevisionAction,
  deliveryRouteValueAction,
  deliveryTotalValueAction,
  deliveryPaymentTypeAction,
  deliveryDiscountAction,
  deliveryPriceTableAction,
  deliveryProductsValuesAction,
  statusPaymentAction,
  gatewayPaymentAction,
  paymentCardAction,
  scheduleRegisterAction,
  deliverymanAction
} = deliverySlice.actions;
export const deliverySelector = state => state.entrega;
export default deliverySlice.reducer;

import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    id: null,
    tipo: null, // Pessoa Física ou Pessoa Jurídica
    nome: null,
    cpfCnpj: null,
    login: null,
    email: null,
    telefone: null,
    senha: null,
    logradouro: null,
    numero: null,
    complemento: null,
    referencia: null,
    bairro: null,
    municipio: null,
    estado: null,
    cep: null,
    veiculo: {
      nome: null,
      modelo: null,
      placa: null,
    }
}

const deliverymanSlice = createSlice({
    name: 'entregador',
    initialState: initialState,
    reducers: {
      deliverymanInitialStateAction: () => (
        initialState
      ),
      deliverymanRegisterAction: (state, action) => ({
        ...state,
        id: action.payload.id,
        tipo: action.payload.tipo,
        nome: action.payload.nome,
        cpfCnpj: action.payload.cpfCnpj,
        login: action.payload.login,
        email: action.payload.email,
        telefone: action.payload.telefone,
        senha: action.payload.senha,
        logradouro: action.payload.logradouro,
        numero: action.payload.numero,
        complemento: action.payload.complemento,
        referencia: action.payload.referencia,
        bairro: action.payload.bairro,
        municipio: action.payload.municipio,
        estado: action.payload.estado,
        cep: action.payload.cep
      }),
      deliverymanVehicleAction: (state, action) => ({
        ...state,
        veiculo: action.payload.veiculo
      })
    }
});

export const {
    deliverymanInitialStateAction,
    deliverymanRegisterAction,
    deliverymanVehicleAction
} = deliverymanSlice.actions;
export const deliverymanSelector = state => state.entregador;
export default deliverymanSlice.reducer;
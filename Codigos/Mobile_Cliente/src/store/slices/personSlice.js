import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    id: null,
    tipo: null,
    nome: null,
    email: null,
    telefone: null,
    nascimento: null,
    rg: null,
    cpfCnpj: null,
    nomeFantasia: null,
    ramoAtividade: null,
    entregador: false,
    cliente: true,
    parceiro: false,
    colaborador: false,
    ativo: true,
    online: false,
    dataInclusao: null,
    dataAlteracao: null
}

const personSlice = createSlice({
    name: 'pessoa',
    initialState,
    reducers: {
        personInitialStateAction: () => (
            initialState
        ),
        personRegisterAction: (state, action) => ({
            ...state,
            id: action.payload.id,
            tipo: action.payload.tipo,
            nome: action.payload.nome,
            email: action.payload.email,
            telefone: action.payload.telefone,
            nascimento: action.payload.nascimento,
            rg: action.payload.rg,
            cpfCnpj: action.payload.cpfCnpj,
            nomeFantasia: action.payload.nomeFantasia,
            ramoAtividade: action.payload.ramoAtividade,
            entregador: action.payload.entregador,
            cliente: action.payload.cliente,
            parceiro: action.payload.parceiro,
            colaborador: action.payload.colaborador,
            ativo: action.payload.ativo,
            dataInclusao: action.payload.dataInclusao,
            dataAlteracao: action.payload.dataAlteracao
        }),
        personTypeRegisterAction: (state, action) => ({
            ...state,
            tipo: action.payload.tipo
        }),
        personMarketSegmentAction: (state, action) => ({
            ...state,
            ramoAtividade: action.payload.ramoAtividade
        })
    }
});


export const {
    personInitialStateAction,
    personRegisterAction,
    personTypeRegisterAction,
    personMarketSegmentAction
} = personSlice.actions;
export const personSelector = state => state.pessoa;
export default personSlice.reducer;

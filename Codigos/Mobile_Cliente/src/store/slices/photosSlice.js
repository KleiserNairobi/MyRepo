import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  perfil: {
    descricao: 'FOTO DO PERFIL',
    tipoFoto: 'P',
    tipoConteudo: 'JPG',
    caminhoArquivo: null,
    conteudoArquivo: null,
    linkWebservice: null
  }
}

const photosSlice = createSlice({
  name: 'fotos',
  initialState,
  reducers: {
    photosInitialStateAction: (state) => (
      initialState
    ),
    perfilAction: (state, action) => ({
      ...state,
      perfil: {
        ...state.perfil,
        caminhoArquivo: action.payload.caminhoArquivo,
        conteudoArquivo: action.payload.conteudoArquivo
      }
    }),
    perfilLinkAction: (state, action) => ({
      ...state,
      perfil: {
        ...state.perfil,
        linkWebservice: action.payload.link
      }
    }),
  }
});

export const {
  photosInitialStateAction,
  perfilAction,
  perfilLinkAction,
} = photosSlice.actions;
export const photosSelector = state => state.fotos;
export default photosSlice.reducer;

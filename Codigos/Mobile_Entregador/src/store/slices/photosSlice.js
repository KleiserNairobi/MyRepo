import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  perfil: {
    descricao: 'PERFIL',
    tipoFoto: 'P',
    tipoConteudo: 'JPG',
    caminhoArquivo: null,
    conteudoArquivo: null,
    linkWebservice: null
  },
  RG: {
    descricao: 'FOTO DOCUMENTO IDENTIDADE',
    tipoFoto: 'RG',
    tipoConteudo: 'JPG',
    caminhoArquivo: null,
    conteudoArquivo: null,
    linkWebservice: null
  },
  CNH: {
    descricao: 'FOTO DOCUMENTO HABILITAÇÃO',
    tipoFoto: 'CNH',
    tipoConteudo: 'JPG',
    caminhoArquivo: null,
    conteudoArquivo: null,
    linkWebservice: null
  },
  CRLV: {
    descricao: 'FOTO DOCUMENTO VEÍCULO',
    tipoFoto: 'CRLV',
    tipoConteudo: 'JPG',
    caminhoArquivo: null,
    conteudoArquivo: null,
    linkWebservice: null
  },
  endereco: {
    descricao: 'FOTO COMPROVANTE DE ENDEREÇO',
    tipoFoto: 'CE',
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
    RGAction: (state, action) => ({
      ...state,
      RG: {
        ...state.RG,
        caminhoArquivo: action.payload.caminhoArquivo,
        conteudoArquivo: action.payload.conteudoArquivo
      }
    }),
    RGLinkAction: (state, action) => ({
      ...state,
      RG: {
        ...state.RG,
        linkWebservice: action.payload.link
      }
    }),
    CNHAction: (state, action) => ({
      ...state,
      CNH: {
        ...state.CNH,
        caminhoArquivo: action.payload.caminhoArquivo,
        conteudoArquivo: action.payload.conteudoArquivo
      }
    }),
    CNHLinkAction: (state, action) => ({
      ...state,
      CNH: {
        ...state.CNH,
        linkWebservice: action.payload.link
      }
    }),
    CRLVAction: (state, action) => ({
      ...state,
      CRLV: {
        ...state.CRLV,
        caminhoArquivo: action.payload.caminhoArquivo,
        conteudoArquivo: action.payload.conteudoArquivo
      }
    }),
    CRLVLinkAction: (state, action) => ({
      ...state,
      CRLV: {
        ...state.CRLV,
        linkWebservice: action.payload.link
      }
    }),
    enderecoAction: (state, action) => ({
      ...state,
      endereco: {
        ...state.endereco,
        caminhoArquivo: action.payload.caminhoArquivo,
        conteudoArquivo: action.payload.conteudoArquivo
      }
    }),
    enderecoLinkAction: (state, action) => ({
      ...state,
      endereco: {
        ...state.endereco,
        linkWebservice: action.payload.link
      }
    })
  }
});

export const {
  photosInitialStateAction,
  perfilAction,
  perfilLinkAction,
  RGAction,
  RGLinkAction,
  CNHAction,
  CNHLinkAction,
  CRLVAction,
  CRLVLinkAction,
  enderecoAction,
  enderecoLinkAction
} = photosSlice.actions;
export const photosSelector = state => state.fotos;
export default photosSlice.reducer;

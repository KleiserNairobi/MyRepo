import * as yup from 'yup';
const CAMPO_REQUERIDO = ' é obrigatório';

export default yup.object().shape({
  pessoa: yup.object().shape({
    id: yup.number()
    .typeError('Membro deve ser um número')
    .required('Membro' + CAMPO_REQUERIDO)
  }),  
  cep: yup.string()
    .min(9, 'CEP deve ter 9 caracteres')
    .max(9, 'CEP deve ter 9 caracteres')
    .required('CEP' + CAMPO_REQUERIDO),
  logradouro: yup.string()
    .max(60, 'Logradouro deve ter no máximo 60 caracteres')
    .required('Logradouro' + CAMPO_REQUERIDO),
  complemento: yup.string()
    .max(60, 'Complemento deve ter no máximo 60 caracteres')
    .required('Complemento' + CAMPO_REQUERIDO),
  bairro: yup.string()
    .max(60, 'Bairro deve ter no máximo 60 caracteres')
    .required('Bairro' + CAMPO_REQUERIDO),
  cidade: yup.string()
    .max(60, 'Cidade deve ter no máximo 60 caracteres')
    .required('Cidade' + CAMPO_REQUERIDO),
  estado: yup.string()
    .min(2, 'Estado deve ter 2 caracteres')
    .max(2, 'Estado deve ter 2 caracteres')
    .required('UF' + CAMPO_REQUERIDO),
})
import * as yup from 'yup';
const CAMPO_REQUERIDO = ' é obrigatório';

export default yup.object().shape({
  origCep: yup.string()
    .nullable()
    .required('CEP' + CAMPO_REQUERIDO)
    .min(9, 'CEP deve ter 9 caracteres')
    .max(9, 'CEP deve ter 9 caracteres'),
  origLogradouro: yup.string()
    .nullable()
    .required('Logradouro' + CAMPO_REQUERIDO)
    .max(60, 'Logradouro deve ter no máximo 60 caracteres'),
  origNumero: yup.string()
    .nullable()
    .max(10, 'Número deve ter no máximo 10 caracteres'),
  origComplemento: yup.string()
    .nullable()
    .max(60, 'Complemento deve ter no máximo 60 caracteres'),
  origReferencia: yup.string()
    .nullable()
    .max(60, 'Referência deve ter no máximo 60 caracteres'),
  origBairro: yup.string()
    .nullable()
    .required('Bairro' + CAMPO_REQUERIDO)
    .max(60, 'Bairro deve ter no máximo 60 caracteres'),
  origCidade: yup.string()
    .nullable()
    .required('Cidade' + CAMPO_REQUERIDO)
    .max(60, 'Cidade deve ter no máximo 60 caracteres'),
  origEstado: yup.string()
    .nullable()
    .required('Estado' + CAMPO_REQUERIDO)
    .min(2, 'Estado deve ter 2 caracteres')
    .max(2, 'Estado deve ter 2 caracteres'),
})
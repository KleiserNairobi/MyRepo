import * as yup from 'yup';
const CAMPO_REQUERIDO = ' é obrigatório';

export default yup.object().shape({
  destCep: yup.string()
    .nullable()
    .required('CEP' + CAMPO_REQUERIDO)
    .min(9, 'CEP deve ter 9 caracteres')
    .max(9, 'CEP deve ter 9 caracteres'),
  destLogradouro: yup.string()
    .nullable()
    .required('Logradouro' + CAMPO_REQUERIDO)
    .max(60, 'Logradouro deve ter no máximo 60 caracteres'),
  destNumero: yup.string()
    .nullable()
    .max(10, 'Número deve ter no máximo 10 caracteres'),
  destComplemento: yup.string()
    .nullable()
    .max(60, 'Complemento deve ter no máximo 60 caracteres'),
  destReferencia: yup.string()
    .nullable()
    .max(60, 'Referência deve ter no máximo 60 caracteres'),
  destBairro: yup.string()
    .nullable()
    .required('Bairro' + CAMPO_REQUERIDO)
    .max(60, 'Bairro deve ter no máximo 60 caracteres'),
  destCidade: yup.string()
    .nullable()
    .required('Cidade' + CAMPO_REQUERIDO)
    .max(60, 'Cidade deve ter no máximo 60 caracteres'),
  destEstado: yup.string()
    .nullable()
    .required('Estado' + CAMPO_REQUERIDO)
    .min(2, 'Estado deve ter 2 caracteres')
    .max(2, 'Estado deve ter 2 caracteres'),
})
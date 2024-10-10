import * as yup from 'yup';
const CAMPO_REQUERIDO = ' é obrigatório';

export default yup.object().shape({
  nome: yup.string()
    .max(60, 'O nome deve ter no máximo 60 caracteres')
    .required('Nome' + CAMPO_REQUERIDO),
  email: yup.string()
    .email('Informe um e-mail válido')
    .required('E-Mail' + CAMPO_REQUERIDO),
  telefone: yup.string()
    .min(13, 'Telefone deve ter 13 caracteres')
    .max(14, 'Telefone deve ter 14 caracteres')
    .required('Telefone' + CAMPO_REQUERIDO),
  rg: yup.string()
    .max(45, 'Identidade deve ter no máximo 45 caracteres'),
  nascimento: yup.date()
    .typeError('Entre com uma data válida')
    .nullable(),     
})
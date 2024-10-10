import * as yup from 'yup';
const CAMPO_REQUERIDO = ' é obrigatório';

export default yup.object().shape({
  pessoa: yup.object().shape({
    id: yup.number()
    .typeError('Membro deve ser um número')
    .required('Membro' + CAMPO_REQUERIDO)
  }),
  agencia: yup.object().shape({
    id: yup.number()
    .typeError('Agência deve ser um número')
    .required('Agência' + CAMPO_REQUERIDO)
  }),
  tipoConta: yup.string()
    .required('Tipo de Conta' + CAMPO_REQUERIDO),
  codigo: yup.string()
    .max(9, 'Código deve ter no máximo 9 caracteres')
    .required('Código' + CAMPO_REQUERIDO),
})
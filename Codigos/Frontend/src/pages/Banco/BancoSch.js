import * as yup from 'yup';
const CAMPO_REQUERIDO = ' é obrigatório';

export default yup.object().shape({
  codigo: yup.string()
    .max(4, 'O código deve ter no máximo 4 caracteres')
    .required('Código' + CAMPO_REQUERIDO),
  nome: yup.string()
    .max(60, 'O nome deve ter no máximo 60 caracteres')
    .required('Nome' + CAMPO_REQUERIDO),
})
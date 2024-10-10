import * as yup from 'yup';
const CAMPO_REQUERIDO = ' é obrigatório';

export default yup.object().shape({
  nome: yup.string()
    .max(40, 'Nome deve ter no máximo 40 caracteres')
    .required('Nome' + CAMPO_REQUERIDO),
})        
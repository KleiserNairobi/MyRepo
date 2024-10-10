import * as yup from 'yup';
const CAMPO_REQUERIDO = ' é obrigatório';

export default yup.object().shape({
  banco: yup.object().shape({
    id: yup.number()
    .typeError('Banco deve ser um número')
    .required('Banco' + CAMPO_REQUERIDO)
  }),
  codigo: yup.string()
    .min(3, 'Código deve ter no mínimo 3 caracteres')
    .max(15, 'Código deve ter no máximo 15 caracteres')
    .required('Código' + CAMPO_REQUERIDO),
  nome: yup.string()
    .min(3, 'Nome deve ter no mínimo 3 caracteres')
    .max(40, 'Nome deve ter no máximo 40 caracteres')
    .required('Nome' + CAMPO_REQUERIDO),
})
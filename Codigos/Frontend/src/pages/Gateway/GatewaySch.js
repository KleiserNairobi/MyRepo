import * as yup from 'yup';
const CAMPO_REQUERIDO = ' é um campo obrigatório';

export default yup.object().shape({
  tipoGateway: yup.string()
    .required('Tipo de Gateway' + CAMPO_REQUERIDO),
  nome: yup.string()
    .min(3, 'A nome deve ter no mínimo 3 caracteres')
    .max(60, 'A nome deve ter no máximo 60 caracteres')
    .required('Nome' + CAMPO_REQUERIDO),
  ativo: yup.boolean()
    .required('Ativo' + CAMPO_REQUERIDO)
})
import * as yup from 'yup';

const CAMPO_REQUERIDO = ' é obrigatório';

export default yup.object().shape({
  tipoCategoria: yup.string()
    .required('Tipo' + CAMPO_REQUERIDO),
  codigo: yup.string()
    .max(10, 'O campo código tem que ter 10 caracteres')
    .required('Código' + CAMPO_REQUERIDO),
  descricao: yup.string()
    .max(60, 'A descrição deve ter no máximo 60 caracteres')
    .required('Descrição' + CAMPO_REQUERIDO),
})
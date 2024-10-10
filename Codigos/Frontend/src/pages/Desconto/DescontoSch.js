import * as yup from 'yup'
const CAMPO_REQUERIDO = ' é obrigatório';

export default yup.object().shape({
  codigo: yup.string()
    .max(10, 'Código deve ter no máximo 10 caracteres')
    .required('Código' + CAMPO_REQUERIDO),
  descricao: yup.string()
    .max(45, 'Descrição deve ter no máximo 45 caracteres')
    .required('Descrição' + CAMPO_REQUERIDO),
  valor: yup.string()
    .required('Valor' + CAMPO_REQUERIDO),
  piso: yup.string()
    .required('Valor' + CAMPO_REQUERIDO),
  validadeInicio: yup.date()
    .typeError('Entre com uma data válida')
    .required('Início da Validade' + CAMPO_REQUERIDO),
  validadeFim: yup.date()
    .typeError('Entre com uma data válida')  
})
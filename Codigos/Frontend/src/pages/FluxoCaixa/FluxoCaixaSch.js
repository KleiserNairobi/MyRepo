import * as yup from 'yup';
const CAMPO_REQUERIDO = ' é obrigatório';

export default yup.object().shape({
  conta: yup.object().shape({
    id: yup.number()
    .typeError('Conta deve ser um número')
    .required('Conta' + CAMPO_REQUERIDO)
  }),  
  nome: yup.string()
    .min(3, 'Nome deve ter no mínimo 3 caracteres')
    .max(50, 'Nome deve ter no máximo 50 caracteres')  
    .required('Nome' + CAMPO_REQUERIDO),
  tipoContaCaixa: yup.string()
    .required('Tipo de Conta' + CAMPO_REQUERIDO),
  mes: yup.number()
    .typeError('Mês deve ser um número')
    .min(1, 'Entre com um mês válido')
    .max(12, 'Entre com um mês válido')
    .required('Mês' + CAMPO_REQUERIDO),
  ano: yup.number()
    .typeError('Ano deve ser um número')
    .min(2020, 'Entre com um ano válido')
    .required('Ano' + CAMPO_REQUERIDO),
})
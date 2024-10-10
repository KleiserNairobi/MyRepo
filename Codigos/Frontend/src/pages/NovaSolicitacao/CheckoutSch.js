import * as yup from 'yup';
const CAMPO_REQUERIDO = ' é obrigatório';

export default yup.object().shape({
  nome: yup.string()
    .max(60, 'Nome no cartão deve ter no máximo 60 caracteres')
    .required('Nome no cartão' + CAMPO_REQUERIDO),
  email: yup.string()
    .email('Informe um e-mail válido'),
  numero: yup.string()
    .min(15, 'Número do cartão deve ter 15 caracteres')
    .max(16, 'Número do cartão deve ter 16 caracteres')
    .required('Número do cartão' + CAMPO_REQUERIDO),
  mes: yup.number()
    .typeError('Mês' + CAMPO_REQUERIDO)
    .required('Mês' + CAMPO_REQUERIDO)
    .min(1,'Mês inválido')
    .max(12, 'Mês inválido'),
  ano: yup.number()
    .typeError('Ano' + CAMPO_REQUERIDO)
    .required('Ano' + CAMPO_REQUERIDO)
    .min(2020, 'Ano inválido')
    .max(2030, 'Ano inválido'),
  cvc: yup.string()
    .nullable()    
    .trim()
    .min(3, 'CV deve ter no mínimo 3 caracteres')
    .max(4, 'CV deve ter no máximo 4 caracteres')
    .required('CV' + CAMPO_REQUERIDO),
})
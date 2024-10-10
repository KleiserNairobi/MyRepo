import * as yup from 'yup';
const CAMPO_REQUERIDO = ' é obrigatório';

export default yup.object().shape({
  pessoa: yup.object().shape({
    id: yup.number()
    .typeError('Membro deve ser um número')
    .required('Membro' + CAMPO_REQUERIDO)
  }),
  categoria: yup.object().shape({
    id: yup.number()
    .typeError('Categoria deve ser um número')
    .required('Categoria' + CAMPO_REQUERIDO)
  }),
  moeda: yup.object().shape({
    id: yup.number()
    .typeError('Moeda deve ser um número')
    .required('Moeda' + CAMPO_REQUERIDO)
  }),
  origem: yup.string()
    .required('Origem' + CAMPO_REQUERIDO),  
  documento: yup.string()
    .max(20, 'Documento deve ter no máximo 20 caracteres')
    .required('Documento' + CAMPO_REQUERIDO),
  parcelas: yup.number()
    .typeError('Parcelas deve ser um número')
    .positive('Parcelas deve ser um valor positivo')
    .required('Parcelas' + CAMPO_REQUERIDO),
  emissao: yup.date()
    .typeError('Entre com uma data válida')
    .required('Emissão' + CAMPO_REQUERIDO),  
  primeiroVcto: yup.date()
    .typeError('Entre com uma data válida')
    .required('Primeiro Vencimento' + CAMPO_REQUERIDO),  
  valorTotal: yup.string()
    .required('Valor Total' + CAMPO_REQUERIDO),
})
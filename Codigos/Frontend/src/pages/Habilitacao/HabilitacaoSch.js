import * as yup from 'yup';
const CAMPO_REQUERIDO = ' é obrigatório';

export default yup.object().shape({
  pessoa: yup.object().shape({
    id: yup.number()
    .typeError('Membro deve ser um número')
    .required('Membro' + CAMPO_REQUERIDO)
  }), 
  registro: yup.string()
    .max(15, 'Registro deve ter no máximo 15 caracteres')
    .required('Registro' + CAMPO_REQUERIDO),
  validade: yup.date()
    .typeError('Entre com uma data válida')
    .required('Validade' + CAMPO_REQUERIDO),    
  categoria: yup.string()
    .max(5, 'Categoria deve ter no máximo 5 caracteres')
    .required('Categoria' + CAMPO_REQUERIDO),
  localExpedicao: yup.string()
    .max(60, 'Local Expedição deve ter no máximo 60 caracteres')
    .required('Local Expedição' + CAMPO_REQUERIDO),
  dataEmissao: yup.date()
    .typeError('Entre com uma data válida')
    .required('Data de Emissão' + CAMPO_REQUERIDO),
})
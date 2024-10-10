import * as yup from 'yup';
const CAMPO_REQUERIDO = ' é obrigatório';

export default yup.object().shape({
  dataRecebimento: yup.date()
    .typeError('Entre com uma data válida')
    .required('Data de Recebimento' + CAMPO_REQUERIDO),  
  valorRecebimento: yup.string()
    .required('Valor Recebimento' + CAMPO_REQUERIDO),
})
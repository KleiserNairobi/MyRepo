import * as yup from 'yup';
const CAMPO_REQUERIDO = ' é obrigatório';

export default yup.object().shape({
  dataInicial: yup.date()
    .typeError('Entre com uma data válida')
    .required('Data Inicial' + CAMPO_REQUERIDO),
  dataFinal: yup.date()
    .typeError('Entre com uma data válida')
    .min(yup.ref('dataInicial'), 'A Data Final tem que ser posterior a data inicial' )
    .required('Data Final' + CAMPO_REQUERIDO),
})
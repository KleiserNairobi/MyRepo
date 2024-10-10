import * as yup from 'yup';
const CAMPO_REQUERIDO = ' é obrigatório';

export default yup.object().shape({
  dataPagamento: yup.date()
    .typeError('Entre com uma data válida')
    .required('Data de Pagamento' + CAMPO_REQUERIDO),  
  valorPagamento: yup.string()
    .required('Valor Pagamento' + CAMPO_REQUERIDO),
})
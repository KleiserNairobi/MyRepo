import * as yup from 'yup';
const CAMPO_REQUERIDO = ' é obrigatório';

export default yup.object().shape({
  tabelaPreco: yup.object().shape({
    id: yup.number()
    .typeError('Tabela de Preço deve ser um número')
    .required('Tabela de Preço' + CAMPO_REQUERIDO)
  }),
  horaInicio: yup.string()
    .required('Hora Inicial' + CAMPO_REQUERIDO),
  horaFim: yup.string()
    .required('Hora Final' + CAMPO_REQUERIDO),
  tarifaAdicional: yup.string()
    .required('Tarifa Adicional' + CAMPO_REQUERIDO),    
})
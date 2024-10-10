import * as yup from 'yup';
const CAMPO_REQUERIDO = ' é obrigatório';

export default yup.object().shape({
  tipoAgendamento: yup.string()
    .required('Tipo de Agendamento' + CAMPO_REQUERIDO),
  qtdeRepeticao: yup.number()
    .typeError('Qtde Repetição deve ser um número')
    .required('Qtde Repetição' + CAMPO_REQUERIDO),
  dataExecucao: yup.date()
    .typeError('Entre com uma data válida')
    .required('Data Execução' + CAMPO_REQUERIDO),
  horaExecucao: yup.string()
  .required('Hora Execução' + CAMPO_REQUERIDO),
})
import * as yup from 'yup';
const CAMPO_REQUERIDO = ' é um campo obrigatório';

export default yup.object().shape({
  gateway: yup.object().shape({
    id: yup.number()
    .typeError('Gateway deve ser um número')
    .required('Gateway' + CAMPO_REQUERIDO)
  }),
  data: yup.date()
    .typeError('Entre com uma data válida')
    .required('Data Cotação' + CAMPO_REQUERIDO),  
  debito: yup.string()
    .required('Débito' + CAMPO_REQUERIDO),
  creditoAvista: yup.string()
    .required('Crédito Avista' + CAMPO_REQUERIDO),
  creditoParcelado: yup.string()
    .required('Crédito Parcelado' + CAMPO_REQUERIDO),
  creditoAntecipacao: yup.string()
    .required('Crédito Antecipado' + CAMPO_REQUERIDO),
  boleto: yup.string()
    .required('Boleto' + CAMPO_REQUERIDO),
  taxaAdministrativa: yup.string()
    .required('Taxa Administrativa' + CAMPO_REQUERIDO),
})
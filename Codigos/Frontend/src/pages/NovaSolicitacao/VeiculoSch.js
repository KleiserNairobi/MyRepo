import * as yup from 'yup';
const CAMPO_REQUERIDO = ' é obrigatório';

export default yup.object().shape({
  tipoVeiculo: yup.string()
    .required('Tipo de Veículo' + CAMPO_REQUERIDO),
})
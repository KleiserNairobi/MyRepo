import * as yup from 'yup';
const CAMPO_REQUERIDO = ' é um campo obrigatório';

export default yup.object().shape({
  percentualAplicativo: yup.string()
    .required('Percentual aplicativo' + CAMPO_REQUERIDO),
  percentualEntregador: yup.string()
    .required('Percentual entregador' + CAMPO_REQUERIDO),
  distanciaBike: yup.string()
    .required('Distância bike' + CAMPO_REQUERIDO),
  distanciaMoto: yup.string()
    .required('Distância moto' + CAMPO_REQUERIDO),
  distanciaCarro: yup.string()
    .required('Distância carro' + CAMPO_REQUERIDO),
})


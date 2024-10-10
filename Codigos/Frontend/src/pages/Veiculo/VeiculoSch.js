import * as yup from 'yup';
const CAMPO_REQUERIDO = ' é obrigatório';

export default yup.object().shape({
  pessoa: yup.object().shape({
    id: yup.number()
    .typeError('Membro deve ser um número')
    .required('Membro' + CAMPO_REQUERIDO)
  }),  
  tipo: yup.string()
    .required('Tipo' + CAMPO_REQUERIDO),
  modelo: yup.string()
    .max(50, 'Modelo deve ter no máximo 50 caracteres')
    .required('Modelo' + CAMPO_REQUERIDO),
  renavan: yup.string()
    .max(11, 'Renavan deve ter no máximo 11 caracteres'),
  placa: yup.string()
    .max(7, 'Placa deve ter no máximo 7 caracteres'),
})
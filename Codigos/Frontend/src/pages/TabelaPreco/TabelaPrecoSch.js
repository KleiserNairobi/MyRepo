import * as yup from 'yup';
const CAMPO_REQUERIDO = ' é obrigatório';

export default yup.object().shape({
  tipoVeiculo: yup.string()
    .required('Tipo de Veículo' + CAMPO_REQUERIDO),
  descricao: yup.string()
    .min(3, 'Descrição deve ter no mínimo 3 caracteres')
    .max(45, 'Descrição deve ter no máximo 45 caracteres')
    .required('Descrição' + CAMPO_REQUERIDO),
  validadeInicio: yup.date()
    .typeError('Entre com uma data válida')
    .required('Início da Validade' + CAMPO_REQUERIDO),
  validadeFim: yup.date()
    .typeError('Entre com uma data válida'),
  tarifaKm: yup.string()
    .required('KM Básico' + CAMPO_REQUERIDO),
  tarifaValor: yup.string()
    .required('Valor KM Básico' + CAMPO_REQUERIDO),
  ativo: yup.boolean()
    .required('Ativo' + CAMPO_REQUERIDO),    
  padrao: yup.boolean()
    .required('Padrão' + CAMPO_REQUERIDO),     
})
import * as yup from 'yup';
const CAMPO_REQUERIDO = ' é obrigatório';

export default yup.object().shape({
  statusAprovacao: yup.string()
    .required('Status Aprovação' + CAMPO_REQUERIDO),

  tipoPessoa: yup.string()
    .required('Tipo Pessoa' + CAMPO_REQUERIDO),
  nome: yup.string()
    .min(3, 'Nome deve ter no mínimo 3 caracteres')
    .max(60,'Nome deve ter no máximo 60 caracteres')
    .required('Nome' + CAMPO_REQUERIDO),
  telefone: yup.string()
    .min(13, 'Telefone deve ter no mínimo 13 caracteres')
    .max(14, 'Telefone deve ter no máximo 14 caracteres')
    .required('Telefone' + CAMPO_REQUERIDO),
  email: yup.string()
    .email('Informe um e-mail válido')
    .required('E-Mail' + CAMPO_REQUERIDO),
  cep: yup.string()
    .min(9, 'CEP deve ter 9 caracteres')
    .max(9, 'CEP deve ter 9 caracteres')
    .required('CEP' + CAMPO_REQUERIDO),
  logradouro: yup.string()
    .max(60, 'Logradouro deve ter no máximo 60 caracteres')
    .required('Logradouro' + CAMPO_REQUERIDO),
  complemento: yup.string()
    .max(60, 'Complemento deve ter no máximo 60 caracteres')
    .required('Complemento' + CAMPO_REQUERIDO),
  bairro: yup.string()
    .max(60, 'Bairro deve ter no máximo 60 caracteres')
    .required('Bairro' + CAMPO_REQUERIDO),
  cidade: yup.string()
    .max(60, 'Cidade deve ter no máximo 60 caracteres')
    .required('Cidade' + CAMPO_REQUERIDO),
  estado: yup.string()
    .min(2, 'Estado deve ter 2 caracteres')
    .max(2, 'Estado deve ter 2 caracteres')
    .required('UF' + CAMPO_REQUERIDO),
  tipoVeiculo: yup.string()
    .required('Tipo Veículo' + CAMPO_REQUERIDO),
  modelo: yup.string()
    .max(50, 'Modelo deve ter no máximo 50 caracteres')
    .required('Modelo' + CAMPO_REQUERIDO),
  renavan: yup.string()
    .max(11, 'Renavan deve ter no máximo 11 caracteres'),
  placa: yup.string()
    .max(7, 'Placa deve ter no máximo 7 caracteres'),
  registro: yup.string()
    .max(15, 'Registro deve ter no máximo 15 caracteres')
    .required('Registro' + CAMPO_REQUERIDO),
  categoria: yup.string()
    .max(5, 'Categoria deve ter no máximo 5 caracteres')
    .required('Categoria' + CAMPO_REQUERIDO),
  localExpedicao: yup.string()
    .max(60, 'Local Expedição deve ter no máximo 60 caracteres')
    .required('Local Expedição' + CAMPO_REQUERIDO),
  dataEmissao: yup.date()
    .typeError('Entre com uma data válida')
    .required('Data de Emissão' + CAMPO_REQUERIDO),
  validade: yup.date()
    .typeError('Entre com uma data válida')
    .required('Validade' + CAMPO_REQUERIDO),    

})
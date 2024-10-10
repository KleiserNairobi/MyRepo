import * as yup from 'yup'
const CAMPO_REQUERIDO = ' é obrigatório'

export default yup.object().shape({
  tipoPessoa: yup.string()
    .required('Tipo Pessoa' + CAMPO_REQUERIDO),
  nome: yup.string()
    .min(3, 'Nome deve ter no mínimo 3 caracteres')
    .max(60, 'Nome deve ter no máximo 60 caracteres')
    .required('Nome' + CAMPO_REQUERIDO),
  telefone: yup.string()
    .min(13, 'Celular deve ter 13 caracteres')
    .max(14, 'Celular deve ter 14 caracteres')
    .required('Celular' + CAMPO_REQUERIDO),
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
  senha: yup.string()
    .matches(/^\d+$/, 'Apenas número é permitido')
    .min(4, 'Senha deve ter pelo menos 4 caracteres')
    .max(6, 'Senha deve ter no máximo 6 caracteres')
    .required('Senha' + CAMPO_REQUERIDO),
  confirmeSenha: yup.string()
    .matches(/^\d+$/, 'Apenas número é permitido')
    .min(4, 'Senha deve ter pelo menos 4 caracteres')
    .max(6, 'Senha deve ter no máximo 6 caracteres')
    .oneOf([yup.ref('senha'), null], 'As senhas são diferentes')
})
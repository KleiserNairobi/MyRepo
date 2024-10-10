import * as yup from 'yup'

export default yup.object().shape({
  email: yup.string()
    .email('Informe um e-mail válido'),
  telefone: yup.string()
    .min(13, 'Telefone deve ter no mínimo 13 caracteres')
    .max(14, 'Telefone deve ter no máximo 14 caracteres'),
  senha: yup.string()
    .min(4, 'A senha deve ter pelo menos 4 caracteres')
    .max(12, 'A senha deve ter no máximo 12 caracteres'),
})
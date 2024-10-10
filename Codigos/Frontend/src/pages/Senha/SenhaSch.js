import * as yup from 'yup'
const CAMPO_REQUERIDO = ' é obrigatório'

export default yup.object().shape({
  senhaAtual: yup.string()
    .matches(/^\d+$/, 'Apenas número é permitido')
    .min(4, 'Senha Atual deve ter pelo menos 4 caracteres')
    .max(6, 'Senha Atual deve ter no máximo 6 caracteres')
    .required('Senha Atual' + CAMPO_REQUERIDO),    
  novaSenha: yup.string()
    .matches(/^\d+$/, 'Apenas número é permitido')
    .min(4, 'Nova Senha deve ter pelo menos 4 caracteres')
    .max(6, 'Nova Senha deve ter no máximo 6 caracteres')
    .required('Nova Senha' + CAMPO_REQUERIDO),
  confirmeSenha: yup.string()
    .matches(/^\d+$/, 'Apenas número é permitido')
    .min(4, 'Confirmação Senha deve ter pelo menos 4 caracteres')
    .max(6, 'Confirmação Senha deve ter no máximo 6 caracteres')
    .oneOf([yup.ref('novaSenha'), null], 'As senhas são diferentes')        
})
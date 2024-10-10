import * as yup from 'yup';
const CAMPO_REQUERIDO = ' é obrigatório';

export default yup.object().shape({
  codigo: yup.string()
    .max(8, 'Código deve ter no máximo 8 caracteres')
    .required('Campo código' + CAMPO_REQUERIDO),
  email: yup.string()
    .email('Informe um e-mail válido')
    .required('Campo e-mail' + CAMPO_REQUERIDO),
  senha: yup.string()
    .matches(/^\d+$/, 'Apenas número é permitido')
    .min(4, 'Senha deve ter pelo menos 4 caracteres')
    .max(6, 'Senha deve ter no máximo 6 caracteres')
    .required('Campo senha' + CAMPO_REQUERIDO),
  confirmeSenha: yup.string()
    .matches(/^\d+$/, 'Apenas número é permitido')
    .min(4, 'Senha deve ter pelo menos 4 caracteres')
    .max(6, 'Senha deve ter no máximo 6 caracteres')
    .oneOf([yup.ref('senha'), null], 'As senhas são diferentes') 
})
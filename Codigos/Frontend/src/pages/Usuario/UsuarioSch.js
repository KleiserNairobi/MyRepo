import * as yup from 'yup';
const CAMPO_REQUERIDO = ' é obrigatório';

export default yup.object().shape({
  pessoa: yup.object().shape({
    id: yup.number()
      .typeError('Membro deve ser um número')
      .required('Membro' + CAMPO_REQUERIDO)
  }),
  nome: yup.string()
    .min(3, 'Nome deve ter no mínimo 3 caracteres')
    .max(60, 'Nome deve ter no máximo 60 caracteres')
    .required('Nome' + CAMPO_REQUERIDO),
  email: yup.string()
    .email('Informe um e-mail válido'),
  telefone: yup.string()
    .matches(/^(?:\(?([1-9][0-9])\)?\s?)?(?:((?:9\d|[2-9])\d{3})-?(\d{4}))$/, {
      message: 'Formatos permitidos: (99)99999-9999 ou (99) 9999-9999', 
      excludeEmptyString: true 
    }),        
  //senha: yup.string()
  //  .min(4, 'Senha deve ter pelo menos 4 caracteres')
  //  .max(12, 'Senha deve ter no máximo 12 caracteres')
  //  .required('Senha' + CAMPO_REQUERIDO),
  //confirmeSenha: yup.string()
  //  .min(4, 'Senha deve ter pelo menos 4 caracteres')
  //  .max(12, 'Senha deve ter no máximo 12 caracteres')
  //  .oneOf([yup.ref('senha'), null], 'As senhas são diferentes')
})
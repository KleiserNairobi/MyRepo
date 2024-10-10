import * as yup from 'yup'

const CAMPO_REQUERIDO = ' é obrigatório'

export default yup.object().shape({
    descricao: yup.string()
        .max(60,'A descrição deve ter no máximo 60 caracteres')
        .required('Descrição' + CAMPO_REQUERIDO),
})
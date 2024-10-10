//import { formatText } from './converter';

export default listErrors = (errors) => {
    let messages = 'Erro no processo.';
    //messages += (errors.status) ? 'Código: ' + errors.status + '\n' : '\n';
    messages += '\n';

    if (errors.listaDeProblemas && errors.listaDeProblemas.length) {
        let problems = errors.listaDeProblemas;
        for (let i=0; i < problems.length; i++) {
            if (problems[i].campo && problems[i].problema) {
                //messages += ' ' + formatText(problems[i].campo) + ': ' + problems[i].problema + '\n';
                messages += ' - ' + problems[i].problema + '\n';
            } else if (problems[i].problema) {
                messages += ' - ' + problems[i].problema + '\n';
            } else {
                messages += ' - ' + problems[i].erro + '\n';
            }
        }
    } else if (errors.detalhe && errors.detalhe.length) {
        messages += ' - ' + errors.detalhe + '\n';
    }

    return messages;
}
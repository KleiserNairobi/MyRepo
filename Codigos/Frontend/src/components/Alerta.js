import React from 'react'
import Snackbar from '@material-ui/core/Snackbar'
import { Alert, AlertTitle } from '@material-ui/lab'
import { useAlerta } from '../contexts/AlertaCtx';

const Alerta = () => {
    const {conteudo, setConteudo} = useAlerta();  

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setConteudo({...conteudo, exibir: false})
    }

    return (
        <Snackbar
            open={conteudo.exibir} 
            autoHideDuration={4000} 
            anchorOrigin={{vertical: 'top', horizontal: 'center'}}
            onClose={handleClose} 
        >
            <Alert variant="filled" severity={conteudo.tipo} onClose={handleClose}>
                <AlertTitle>{conteudo.titulo}</AlertTitle>
                {conteudo.descricao}
            </Alert>
        </Snackbar>
    )
}

export default Alerta
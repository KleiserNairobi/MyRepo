import React from 'react'
import { 
    Dialog, DialogTitle, DialogContent, IconButton, 
    Typography, Button, DialogActions, makeStyles, Grid 
} from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import { useGeral } from '../contexts/GeralCtx';

const useStyles = makeStyles(theme => ({
    titulo: {
        backgroundColor: '#38454C',
        '& .MuiTypography-h6': {
            color: '#FEC601'
        },
        '& .MuiTypography-caption': {
            color: '#FFFFFF',
            opacity: '0.9'
        },
        '& .MuiButtonBase-root': {
            color: '#FEC601'
        },
        '& .MuiIconButton-root': {
            color: '#FEC601'
        },
        '& .MuiSvgIcon-root': {
            color: '#FEC601'
        }
    },
    conteudo: {
        marginTop: '20px',
        marginBottom: '20px'
    },
    acao: {
        marginBottom: '20px',
        '& .MuiButtonBase-root': {
            color: '#38454C'
        }         
    }
}))

export default function Modal(props) {
    const { children, titulo, subtitulo, abrir, setAbrir } = props;
    const estilo = useStyles();
    const { setGravar, setLimpar } = useGeral();

    return (
        <Dialog open={abrir} fullWidth={true} maxWidth="md">
            <DialogTitle className={estilo.titulo}>
                <div style={{display: 'flex'}}>
                    <Grid direction="column" justify="center" alignItems="flex-start">
                        <Typography variant="h6" component="div">{titulo}</Typography>
                        <Typography variant="caption" component="div">{subtitulo}</Typography>
                    </Grid>
                    <div style={{flex: 1}}/>
                    <IconButton onClick={() => setAbrir(false)}><CloseIcon /></IconButton>
                </div>
            </DialogTitle>
            <DialogContent>
                <div className={estilo.conteudo}>
                    {children}
                </div>
            </DialogContent>
            <DialogActions className={estilo.acao}>
                <Button 
                    variant="contained" 
                    color="primary" 
                    disableElevation
                    onClick={()=>setGravar(true)}
                >
                    Salvar
                </Button>
                <Button 
                    variant="contained" 
                    color="primary" 
                    disableElevation 
                    style={{marginRight: '15px'}}
                    onClick={()=>setLimpar(true)}
                >
                    Limpar
                </Button>
            </DialogActions>
        </Dialog>
    )
}

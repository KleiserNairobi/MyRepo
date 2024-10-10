import {makeStyles} from '@material-ui/core/styles';
import fundo1 from '../../assets/images/cadastro_1024w.svg';
import fundo2 from '../../assets/images/cadastro_1920w.svg';

const cssDashboard = makeStyles((theme) => ({
    root: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        backgroundColor: '#FEC601',
        [theme.breakpoints.up('sm')]: {backgroundImage: `url(${fundo1})`},
        [theme.breakpoints.up('md')]: {backgroundImage: `url(${fundo1})`},
        [theme.breakpoints.up('lg')]: {backgroundImage: `url(${fundo2})`},
        [theme.breakpoints.up('xl')]: {backgroundImage: `url(${fundo2})`},
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed',
    },        
    tituloPagina: {
        paddingTop: theme.spacing(4),
        '& .MuiTypography-h5': {
            color: '#FFF',
        },
    },    
    subtituloPagina: {
        marginBottom: theme.spacing(4),
        '& .MuiTypography-h5': {
            color: '#FFF',
        },
    },
    cartaoTipoPessoa: {
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'column',
    },
    cartaoExterno: {        
        [theme.breakpoints.up('xs')]: {width: '100vw'},
        [theme.breakpoints.up('sm')]: {width:  '90vw'},
        [theme.breakpoints.up('md')]: {width:  '80vw'},
        [theme.breakpoints.up('lg')]: {width:  '60vw'},
        [theme.breakpoints.up('xl')]: {width:  '50vw'},
        marginBottom: 50,
        padding: 5
    },
    cartaoTitulo: {
        backgroundColor: '#38454C',
        '& .MuiCardHeader-title': {
            color: '#FEC601'
        },
        '& .MuiCardHeader-subheader': {
            color: '#FFFFFF',
            opacity: '0.9'
        },
        '& .MuiSvgIcon-root': {
            color: '#FEC601'
        }        
    },
    avatar: {
        backgroundColor: '#2F3D44',
    },
    mensTipoPessoa: {
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'column',
        marginTop: 10,
        marginBottom: 10,
    },
    botoesAcao: {
        marginTop: 30,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
        '& .MuiButton-root': {
            marginLeft: 10,
        },
        '& .MuiButton-label': {
            color: '#38454C',
        },
    },
    linha: {
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'row',
    },

}));

export default cssDashboard;
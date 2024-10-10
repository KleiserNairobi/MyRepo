import {makeStyles} from '@material-ui/core/styles';

const cssDashboard = makeStyles((theme) => ({
  icones: {
    color: '#FEC601', 
    margin: '10px',
  },
  
  tituloCartao: {
    display: 'flex',
    margin: 10,
    alignItems: 'center',
    '& .MuiTypography-subtitle1': {
      color: '#2F3D44',
    },
  },


    tituloBoxCartoes:{
        color: '#FFFFFF',
        fontSize: '18px',
    },
    hr1: {
        border: 0,
        borderTop: `1px solid #FFFFFF`,
    },
    cartaoAmarelo: {
        backgroundColor: '#FEC601',
        '& .MuiCardHeader-title': {
            color: '#FFFFFF',
            fontSize: '18px',
        },       
    },
    cartaoVermelho: {
        backgroundColor: '#B22222',
        '& .MuiCardHeader-title': {
            color: '#FFFFFF',
            fontSize: '18px',
        },       
    },
    cartaoVerde: {
        backgroundColor: '#008000',
        '& .MuiCardHeader-title': {
            color: '#FFFFFF',
            fontSize: '18px',
        },       
    },
    cartaoAzul: {
        backgroundColor: '#4682B4',
        '& .MuiCardHeader-title': {
            color: '#FFFFFF',
            fontSize: '18px',
        },       
    },
    corVerde: {
        backgroundColor: '#008000',
    },
    corVermelha: {
        backgroundColor: '#B22222',
    }, 
    corLaranja: {
        backgroundColor: '#FEC601',
    }, 
    corAzul: {
        backgroundColor: '#4682B4',
    },
    mb3: {
        marginBottom: theme.spacing(3),
    },
}));

export default cssDashboard;
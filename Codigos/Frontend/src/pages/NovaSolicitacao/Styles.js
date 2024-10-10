import {makeStyles} from '@material-ui/core/styles';

const styles = makeStyles((theme) => ({
  tituloPagina: {
    display: 'flex',
    marginLeft: 0,
    alignItems: 'center',
    '& .MuiTypography-subtitle1': {
      color: '#FEC601',
    },
  },
  subtituloPagina: {
    display: 'flex',
    marginLeft: 0,
    marginBottom: 20,
    alignItems: 'center',
    '& .MuiTypography-body2': {
      color: '#2F3D44',
    },
  },
  contexto: {
    display: 'flex',
    marginLeft: 0,
    marginTop: 20,
    marginBottom: 5,
    alignItems: 'center',
    '& .MuiTypography-body2': {
      color: '#FEC601',
    },
  },
  root: {
    flexGrow: 1,
    backgroundColor: '#FFF',
  },
  solContainer: {
    display: 'flex',
    marginTop: '5px',
    width: '100%',
    [theme.breakpoints.up('xs')]: {flexDirection: 'column'},
    [theme.breakpoints.up('sm')]: {flexDirection: 'column'},
    [theme.breakpoints.up('md')]: {flexDirection: 'row'},
    [theme.breakpoints.up('lg')]: {flexDirection: 'row'},
  },
  solDados: {
    [theme.breakpoints.up('xs')]: {flexGrow: 1, width: '100%'},
    [theme.breakpoints.up('sm')]: {flexGrow: 1, width: '100%'},
    [theme.breakpoints.up('md')]: {flexGrow: 1, width: '50%'},
    [theme.breakpoints.up('lg')]: {flexGrow: 1, width: '46%'},  
    [theme.breakpoints.up('xl')]: {flexGrow: 1, width: '35%'},      
  },
  solMapa: {        
    [theme.breakpoints.up('xs')]: { 
      flexGrow: 1,
      width: '100%',
      height: '400px',
      marginTop: '10px',
    },
    [theme.breakpoints.up('sm')]: { 
      flexGrow: 1,
      width: '100%',
      height: '400px',
      marginTop: '10px',
    },    
    [theme.breakpoints.up('md')]: { 
      flexGrow: 1, 
      width: '50%',
      height: '86vh',
      marginTop: '0px',
      marginLeft: '10px',
    },    
    [theme.breakpoints.up('lg')]: { 
      flexGrow: 1, 
      width: '54%',
      height: '86vh',
      marginTop: '0px',
      marginLeft: '10px',
    },    
    [theme.breakpoints.up('xl')]: { 
      flexGrow: 1, 
      width: '65%',
      height: '86vh',
      marginTop: '0px',
      marginLeft: '10px',
    },  
  },
  avatar: {
    backgroundColor: '#2F3D44',
  },
  cartaoTitulo: {
    backgroundColor: '#38454C',
    '& .MuiCardHeader-title': {
      color: '#FEC601',
      fontSize: '15px',
    },
    '& .MuiCardHeader-subheader': {
      color: '#FFFFFF',
      opacity: '0.9',
      fontSize: '12px',
    },
    '& .MuiSvgIcon-root': {
      color: '#FEC601'
    }
  },
  mensagem: {
    display: 'flex', 
    flexDirection: 'column', 
    justifyContent: 'center', 
    alignItems: 'center', 
    width: '100%', 
    marginBottom: '20px',
  },
  barraBotaoEmLinha: {
    display: 'flex', 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center',
  },



}));

export default styles;
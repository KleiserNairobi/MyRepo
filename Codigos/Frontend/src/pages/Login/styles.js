import { makeStyles } from '@material-ui/core/styles';
import login_300w from '../../assets/images/login_300w.jpg'
import login_640w from '../../assets/images/login_640w.jpg'
import login_960w from '../../assets/images/login_960w.jpg'
import login_1280w from '../../assets/images/login_1280w.jpg'

const useStyles = makeStyles((theme) => ({

  root: {
    height: '100vh',
  },
  boxImage: {
    [theme.breakpoints.up('sm')]: { backgroundImage: `url(${login_300w})` },
    [theme.breakpoints.up('md')]: { backgroundImage: `url(${login_640w})` },
    [theme.breakpoints.up('lg')]: { backgroundImage: `url(${login_960w})` },
    [theme.breakpoints.up('xl')]: { backgroundImage: `url(${login_1280w})` },
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundColor: '#FCBB1C',
  },
  tituloBoxImagem: {
    position: 'relative',
    top: '5%',
  },
  boxImagemTitulo: {
    color: '#FFF',
    textShadow: '1px 1px 0px #000, 2px 1px 0px rgba(0,0,0,0.15)',
    fontFamily: 'Roboto',
  },
  logomarca: {
    marginBottom: '15px',
    [theme.breakpoints.down('sm')]: { width: '100px', height: '46px' },
    [theme.breakpoints.up('sm')]: { width: '200px', height: '91px' }
  },
  paper: {
    margin: theme.spacing(4, 4),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  form: {
    width: '100%',
    marginTop: theme.spacing(1),
  },
  textField: {
    marginTop: '20px',
  },
  botoes: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: '40px',
  },
  mt20: {
    marginTop: '30px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  tituloEscolhaLogin: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  separador: {
    width: '100%',
    marginTop: 60,
    textAlign: 'center',
    lineHeight: '1px',
    borderBottom: '1px solid #FECC00',
  },
  textoSeparador: {
    color: '#999',
    padding: '0 10px',
    background: '#fff',
  },
  mediaSocial: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  botoesMidiaSocial: {
    width: 110,
    margin: 8,
    color: '#FEC601',
    backgroundColor: '#2B373D',
    textTransform: 'capitalize',
    '&:hover': {
      color: '#FFF',
      backgroundColor: '#2B373D',
    },
  },
  trocaSenhaLogo: {
    margin: 0,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },


}))

export default useStyles
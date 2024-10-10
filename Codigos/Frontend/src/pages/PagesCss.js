import { makeStyles } from '@material-ui/core/styles';

const PagesCss = makeStyles((theme) => ({
  root: {},
  tituloPagina: {
    marginLeft: 0,
    '& .MuiTypography-h6': {
      color: '#FEC601',
    },
  },
  subtituloPagina: {
    marginLeft: 0,
    marginBottom: theme.spacing(2),
    '& .MuiTypography-caption': {
      color: '#FFFFFF',
      opacity: '0.9',
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
  formBarraBotao: {
    marginTop: 40,
    marginBottom: 20,
  },
  formBotaoDeAcao: {
    marginLeft: 10,
    '& .MuiButton-label': {
      color: '#38454C',
    },
  },
  contextoSolicitacao: {
    height: '390px',
    '& .MuiAvatar-root': {
      color: '#FEC601',
    },
    '& .MuiSvgIcon-root': {
      color: '#2F3D44',
    },    
  },
  labelRdbTipoPgto: {
    '& .MuiFormControlLabel-label': {
      fontSize: '14px'
    }
  },
  labelRdbGateway: {
    '& .MuiFormControlLabel-label': {
      fontSize: '12px'
    }
  },
  solMapa: {        
    flexGrow: 1,
    width: '100%',
    height: '500px',
    // marginTop: '20px',
    paddingTop: '15px',
    // marginBotton: '5px',
    paddingBottom: '5px'
  },

}));

export default PagesCss;
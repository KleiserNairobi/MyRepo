import {makeStyles} from '@material-ui/core/styles';

const drawerWidth = 240;

const styles = makeStyles((theme) => ({
    root: {
        display: 'flex',        
    },
    appBar: {
        backgroundColor: '#2B373D',
        zIndex: theme.zIndex.drawer + 1,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
    },
    appBarShift: {
        marginLeft: drawerWidth,
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    },
    menuButton: {
        marginRight: theme.spacing(1),               
    },
    hide: {
        display: 'none',
    },
    drawer: {
        width: drawerWidth,
        flexShrink: 0,
        whiteSpace: 'nowrap',
    },
    drawerOpen: {
        width: drawerWidth,
        transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    },
    drawerClose: {
        transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        overflowX: 'hidden',
        width: theme.spacing(7) + 1,
        [theme.breakpoints.up('sm')]: {
            width: theme.spacing(9) + 1,
        },
    },
    drawerPaper: {
        backgroundColor: '#FEC601',
    },
    drawerPaperSubMenu: {
        backgroundColor: '#eae2b7',
    },
    toolbar: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: theme.spacing(0, 1),
        backgroundColor: '#2F3D44',
        ...theme.mixins.toolbar,
        // necessary for content to be below app bar
    },
    conteudo: {
        flexGrow: 1,
        minHeight: `calc(100vh - 50px)`,        
        height: `calc(100vh - 50px)`,
        marginLeft: '70px',
        marginTop: '50px',        
        padding: theme.spacing(3),
        transition: theme.transitions.create('margin', {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.leavingScreen,
        }),
        overflowY: 'scroll',
        backgroundColor: '#44575F'

    }, 
    conteudoShift: {
        minHeight: `calc(100vh - 50px)`,
        height: `calc(100vh - 50px)`,
        marginLeft: '240px',
        transition: theme.transitions.create('margin', {
          easing: theme.transitions.easing.easeOut,
          duration: theme.transitions.duration.enteringScreen,
        }),
    },
    margemAvatar: {
        '& > *': {
            marginLeft: theme.spacing(0),
            marginRight: theme.spacing(2),
        },
    },     
    dadosUsuario: {
        marginLeft: '0px',
        marginRight: '20px',
        display: 'flex',
        alignItems: 'center',
    },
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
    ml1: {
        '& > *': {
            marginLeft: theme.spacing(1),
        },
    },
    formMargemCard: {
        paddingTop: 40,
        paddingLeft: 20,
        paddingRight: 20,
        paddingBottom: 40,
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
    }


}));

export default styles;
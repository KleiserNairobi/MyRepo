import { createMuiTheme } from "@material-ui/core";
import { ptBR } from '@material-ui/core/locale';

const theme = createMuiTheme({
    palette:{
        common:{
            black: '#000000',
            white: '#FFFFFF'
        },
        background:{
            paper: '#FFFFFF',
            default: '#2B373D'
        },
        primary:{
            light: '#F6CD51',
            main: '#FEC601',
            dark: '#EFBC05',
            contrastText: '#FFFFFF'
        },
        secondary:{
            light: '#EFBC6B',
            main: '#F5A623',
            dark: '#EA9C2A',
            contrastText: '#000000'
        },
        error:{
            light:'#e57373',
            main:'#f44336',
            dark:'#d32f2f',
            contrastText:'#FFFFFF'
        },
        text:{
            primary: '#38454C',
            secondary: '#292929',
            disabled: '#777777',
            hint: '#777777'
        }
    }
}, ptBR);

export default theme;
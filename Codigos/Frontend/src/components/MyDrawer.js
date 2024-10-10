import React, {Fragment} from 'react';
import clsx from 'clsx';
import { Link as RouterLink } from 'react-router-dom'
import { Drawer, IconButton, Divider, List, ListItem, ListItemIcon, ListItemText, Tooltip } from '@material-ui/core';
import { useTheme } from '@material-ui/core/styles'
import { ChevronLeft, ChevronRight, Speed, ExitToApp } from '@material-ui/icons';
import { useGeral } from '../contexts/GeralCtx';
import { useAutenticacao } from '../contexts/AutenticacaoCtx';
import styles from '../layout/styles';
import logo from '../assets/images/chamai_L50.png';
import MenuCadastros from './MenuCadastros';
import MenuMembros from './MenuMembros';
import MenuHistoricos from './MenuHistoricos';
import MenuSolicitacoes from './MenuSolicitacoes';
import MenuFinanceiro from './MenuFinanceiro';
import MenuRelatorios from './MenuRelatorios';
// import MenuConteudos from './MenuConteudos';
import MenuConfiguracoes from './MenuConfiguracoes';


export default function MyDrawer() {
  const estilo = styles();
  const theme = useTheme();
  const { abrirMenu, setAbrirMenu, setCarregar } = useGeral();
  const { tipoMembro, handleLogout } = useAutenticacao();

  function ListItemLink(props) {
    const { icon, primary, to } = props;
    const renderLink = React.useMemo(() =>
      React.forwardRef((itemProps, ref) =>
        <RouterLink to={to} ref={ref} {...itemProps} />
      ), [to],
    );
    return (
      <Tooltip title={primary} placement="right" arrow>
        <li >
          <ListItem button component={renderLink} onClick={() => setCarregar(true)} >
            {icon ? <ListItemIcon className={estilo.ml1}>{icon}</ListItemIcon> : null}
            <ListItemText primary={primary} />
          </ListItem>
        </li>
      </Tooltip>
    );
  }

  return (
    <Drawer
      variant="permanent"
      className={clsx(estilo.drawer, {
        [estilo.drawerOpen]: abrirMenu,
        [estilo.drawerClose]: !abrirMenu,
      })}
      classes={{
        paper: clsx(estilo.drawerPaper, {
          [estilo.drawerOpen]: abrirMenu,
          [estilo.drawerClose]: !abrirMenu,
        }),
      }}
    >
      <div className={estilo.toolbar}>
        <img src={logo} alt="logomarca" style={{ marginLeft: "20px" }} />
        <IconButton onClick={() => setAbrirMenu(false)}>
          {theme.direction === 'rtl' ? <ChevronRight /> : <ChevronLeft />}
        </IconButton>
      </div>
      <Divider />
      <List dense={true}>
        <ListItemLink to="/dashboard" primary="Dashboard" icon={<Speed />} />        
        <MenuCadastros />
        <MenuMembros />
        <MenuHistoricos />
        {
          (tipoMembro.indexOf("COL") !== -1) || (tipoMembro.indexOf("CLI") !== -1) || (tipoMembro.indexOf("PAR") !== -1)
          ? <MenuSolicitacoes />
          : null
        }        
      </List>
      {
        (tipoMembro.indexOf("COL") !== -1) ?
        <Fragment>
          <Divider />
          <List dense={true}>
            <MenuFinanceiro />
          </List>
          <Divider />
          <List dense={true}>
            <MenuRelatorios />
            {/* <MenuConteudos /> */}
            <MenuConfiguracoes />            
          </List>
        </Fragment>
        : null
      }
      <Divider />
      <Tooltip title="Sair" placement="right" arrow>
        <ListItem button key="Sair" onClick={() => handleLogout()}>
          <ListItemIcon className={estilo.ml1}>
            <ExitToApp />
          </ListItemIcon>
          <ListItemText primary="Sair" />
        </ListItem>
      </Tooltip>
    </Drawer>
  );
}


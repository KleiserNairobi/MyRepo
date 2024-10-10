import React, { Fragment, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom'
import { Tooltip, ListItem, ListItemIcon, ListItemText, Collapse, List } from '@material-ui/core';
import {
  ExpandLess, ExpandMore, Settings, AccountBalanceWallet, AttachMoney, 
  MoneyOff, Build, HowToReg, PostAdd
} from '@material-ui/icons';
import styles from '../layout/styles';
import { useGeral } from '../contexts/GeralCtx';


export default function MenuConfiguracoes() {
  const estilo = styles();
  const [abrir, setAbrir] = useState(false);
  const { setCarregar, setAlterar } = useGeral();

  function abrirMenu() {
    setAbrir(!abrir);
  }

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
          <ListItem button component={renderLink} onClick={() => { setCarregar(true); setAlterar(false); }}>
            {icon ? <ListItemIcon className={estilo.ml1}>{icon}</ListItemIcon> : null}
            <ListItemText primary={primary} />
          </ListItem>
        </li>
      </Tooltip>
    );
  }

  return (
    <Fragment>
      <Tooltip title="Configurações" placement="right" arrow>
        <ListItem button key="Configurações" onClick={() => abrirMenu()}>
          <ListItemIcon className={estilo.ml1}>
            <Settings />
          </ListItemIcon>
          <ListItemText primary="Configurações" />
          {abrir ? <ExpandLess /> : <ExpandMore />}
        </ListItem>
      </Tooltip>

      <Collapse in={abrir} timeout="auto" unmountOnExit className={estilo.drawerPaperSubMenu}>
        <List component="div" disablePadding dense={true}>
          <ListItemLink to="/gateways" primary="Gateways" icon={<AccountBalanceWallet />} />
          <ListItemLink to="/gateways-taxas" primary="Gateways Taxas" icon={<AccountBalanceWallet />} />          
          <ListItemLink to="/descontos" primary="Descontos" icon={<MoneyOff />} />
          <ListItemLink to="/tabela-precos" primary="Tabelas de Preços" icon={<AttachMoney />} />
          <ListItemLink to="/tarifas-adicionais" primary="Tarifas Adicionais" icon={<PostAdd />} />
          <ListItemLink to="/permissoes" primary="Permissões" icon={<HowToReg />} />
          <ListItemLink to="/parametros" primary="Parâmetros Gerais" icon={<Build />} />
        </List>
      </Collapse>

    </Fragment>
  );
}
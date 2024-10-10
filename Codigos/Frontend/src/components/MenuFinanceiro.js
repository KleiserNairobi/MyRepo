import React, { Fragment, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom'
import {
  List, ListItem, ListItemIcon, ListItemText, Tooltip, Collapse
} from '@material-ui/core';
import {
  ExpandLess, ExpandMore, Inbox, AllInbox, Archive, Unarchive, MonetizationOn, Publish, GetApp
} from '@material-ui/icons';
import styles from '../layout/styles';
import { useGeral } from '../contexts/GeralCtx';


export default function MenuFinanceiro() {
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
      
      <Tooltip title="Financeiro" placement="right" arrow>
        <ListItem button key="Financeiro" onClick={() => abrirMenu()}>
          <ListItemIcon className={estilo.ml1}>
            <MonetizationOn />
          </ListItemIcon>
          <ListItemText primary="Financeiro" />
          {abrir ? <ExpandLess /> : <ExpandMore />}
        </ListItem>
      </Tooltip>

      <Collapse in={abrir} timeout="auto" unmountOnExit className={estilo.drawerPaperSubMenu}>
        <List component="div" disablePadding dense={true}>
          <ListItemLink to="/lctoContaPagar" primary="Lançar Conta a Pagar" icon={<Unarchive />} />
          <ListItemLink to="/lctoContaReceber" primary="Lançar Conta a Receber" icon={<Archive />} />
          <ListItemLink to="/pagamentos" primary="Pagamentos" icon={<Publish />} />
          <ListItemLink to="/recebimentos" primary="Recebimentos" icon={<GetApp />} />
          <ListItemLink to="/fluxo-caixas" primary="Fluxo de Caixa" icon={<Inbox />} />
          <ListItemLink to="/mov-caixas" primary="Movimento de Caixa" icon={<AllInbox />} />
        </List>
      </Collapse>
    </Fragment>
  );
}

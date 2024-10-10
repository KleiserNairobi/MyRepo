import React, { Fragment, useState } from 'react';
import { Tooltip, List, ListItem, ListItemIcon, ListItemText, Collapse } from '@material-ui/core';
import { ExpandLess, ExpandMore, PinDrop, Map, AddLocation } from '@material-ui/icons';
import { Link as RouterLink } from 'react-router-dom'
import styles from '../layout/styles';
import { useGeral } from '../contexts/GeralCtx';


export default function MenuSolicitacoes() {
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
      <Tooltip title="Solicitações" placement="right" arrow>
        <ListItem button key="Solicitações" onClick={() => abrirMenu()}>
          <ListItemIcon className={estilo.ml1}>
            <PinDrop />
          </ListItemIcon>
          <ListItemText primary="Solicitações" />
          {abrir ? <ExpandLess /> : <ExpandMore />}
        </ListItem>
      </Tooltip>
      <Collapse in={abrir} timeout="auto" unmountOnExit className={estilo.drawerPaperSubMenu}>
        <List component="div" disablePadding dense={true}>         
          <ListItemLink to="/nova-solicitacao" primary="Nova Solicitação" icon={<AddLocation />} />
          <ListItemLink to="/mapa" primary="Mapa" icon={<Map />} />
        </List>
      </Collapse>
    </Fragment>
  );
}
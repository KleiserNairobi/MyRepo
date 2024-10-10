import React, { Fragment, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { List, ListItem, ListItemIcon, ListItemText, Tooltip, Collapse } from '@material-ui/core';
import { ExpandLess, ExpandMore, EventNote, AccountBalance, Domain, LocalAtm, AccountTree, VpnKey, Person } from '@material-ui/icons';
import styles from '../layout/styles';
import { useGeral } from '../contexts/GeralCtx';
import { useAutenticacao } from '../contexts/AutenticacaoCtx';


export default function MenuCadastros() {
  const estilo = styles();
  const [abrir, setAbrir] = useState(false);
  const { setCarregar, setAlterar } = useGeral();
  const { tipoMembro } = useAutenticacao();

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
          <ListItem button component={renderLink} onClick={() => { setCarregar(true); setAlterar(false); }} >
            {icon ? <ListItemIcon className={estilo.ml1}>{icon}</ListItemIcon> : null}
            <ListItemText primary={primary} />
          </ListItem>
        </li>
      </Tooltip>
    );
  }

  return (
    <Fragment>
      <Tooltip title="Cadastros" placement="right" arrow>
        <ListItem button key="Cadastros" onClick={() => abrirMenu()}>
          <ListItemIcon className={estilo.ml1}>
            <EventNote />
          </ListItemIcon>
          <ListItemText primary="Cadastros" />
          {abrir ? <ExpandLess /> : <ExpandMore />}
        </ListItem>
      </Tooltip>
      <Collapse in={abrir} timeout="auto" unmountOnExit className={estilo.drawerPaperSubMenu}>
        <List component="div" disablePadding dense={true}>
          <ListItemLink to="/usuarios" primary="Usuários" icon={<Person />} />
          <ListItemLink to="/senha" primary="Alterar Senha" icon={<VpnKey />} />
          {
            (tipoMembro.indexOf("COL") !== -1)
            ? <ListItemLink to="/bancos" primary="Bancos" icon={<AccountBalance />} />
            : null
          }            
          <ListItemLink to="/agencias" primary="Agências" icon={<Domain />} />       
          {
            (tipoMembro.indexOf("COL") !== -1)
            ? <ListItemLink to="/moedas" primary="Moedas" icon={<LocalAtm />} />
            : null
          }
          {
            (tipoMembro.indexOf("COL") !== -1)
            ? <ListItemLink to="/categorias" primary="Categorias" icon={<AccountTree />} />
            : null
          }
        </List>
      </Collapse>
    </Fragment>
  );
}
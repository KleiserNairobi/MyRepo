import React, { Fragment, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom'
import { Tooltip, List, ListItem, ListItemIcon, ListItemText, Collapse } from '@material-ui/core';
import { ExpandLess, ExpandMore, Alarm, Grade, WhereToVote, NotListedLocation, Assessment } from '@material-ui/icons';
import styles from '../layout/styles';
import { useGeral } from '../contexts/GeralCtx';
import { useAutenticacao } from '../contexts/AutenticacaoCtx';

export default function MenuHistoricos() {
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
      <Tooltip title="Históricos" placement="right" arrow>
        <ListItem button key="Históricos" onClick={() => abrirMenu()}>
          <ListItemIcon className={estilo.ml1}>
            <NotListedLocation />
          </ListItemIcon>
          <ListItemText primary="Históricos" />
          {abrir ? <ExpandLess /> : <ExpandMore />}
        </ListItem>
      </Tooltip>

      <Collapse in={abrir} timeout="auto" unmountOnExit className={estilo.drawerPaperSubMenu}>        
        <List component="div" disablePadding dense={true}>
          <ListItemLink to="/movimentacoes" primary="Movimentacoes" icon={<Assessment />} />
          {
            (tipoMembro.indexOf("COL") !== -1) || (tipoMembro.indexOf("CLI") !== -1) || (tipoMembro.indexOf("PAR") !== -1)
            ? <ListItemLink to="/agendamentos" primary="Agendamentos" icon={<Alarm />} />
            : null
          }
          <ListItemLink to="/solicitacoes" primary="Solicitações" icon={<WhereToVote />} />
          <ListItemLink to="/avaliacoes" primary="Avaliações" icon={<Grade />} />
        </List>
      </Collapse>
    </Fragment>
  );
}
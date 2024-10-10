import React, { Fragment, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom'
import { Tooltip, List, ListItem, ListItemIcon, ListItemText, Collapse } from '@material-ui/core';
import { 
  ExpandLess, ExpandMore, PeopleAlt, Group, Wc, TransferWithinAStation, 
  LocationCity, Payment, DriveEta, RecentActors, GroupAdd
} from '@material-ui/icons';
import styles from '../layout/styles';
import { useGeral } from '../contexts/GeralCtx';
import { useAutenticacao } from '../contexts/AutenticacaoCtx';

export default function MenuMembros() {
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
      <Tooltip title="Membros" placement="right" arrow>
        <ListItem button key="Membros" onClick={() => abrirMenu()}>
          <ListItemIcon className={estilo.ml1}>
            <PeopleAlt />
          </ListItemIcon>
          <ListItemText primary="Membros" />
          {abrir ? <ExpandLess /> : <ExpandMore />}
        </ListItem>
      </Tooltip>
      <Collapse in={abrir} timeout="auto" unmountOnExit className={estilo.drawerPaperSubMenu}>
        <List component="div" disablePadding dense={true}>            
          {
            (tipoMembro.indexOf("CLI") !== -1) || (tipoMembro.indexOf("COL") !== -1)
            ? <ListItemLink to="/clientes" primary="Clientes" icon={<Group />} />
            : null
          }
          {
            (tipoMembro.indexOf("ENT") !== -1) || (tipoMembro.indexOf("COL") !== -1)
            ? <ListItemLink to="/entregadores" primary="Entregadores" icon={<TransferWithinAStation />} />
            : null
          }
          {  
            (tipoMembro.indexOf("PAR") !== -1) || (tipoMembro.indexOf("COL") !== -1)
            ? <ListItemLink to="/parceiros" primary="Parceiros" icon={<GroupAdd />} />
            : null
          }  
          {
            (tipoMembro.indexOf("COL") !== -1)
            ? <ListItemLink to="/colaboradores" primary="Colaboradores" icon={<Wc />} />
            : null
          }
          <ListItemLink to="/enderecos" primary="Endereços" icon={<LocationCity />} /> 
          {
            (tipoMembro.indexOf("ENT") !== -1) || (tipoMembro.indexOf("COL") !== -1)
            ? <ListItemLink to="/veiculos" primary="Veículos" icon={<DriveEta />} />
            : null
          }
          {
            (tipoMembro.indexOf("ENT") !== -1) || (tipoMembro.indexOf("COL") !== -1)
            ? <ListItemLink to="/habilitacoes" primary="Habilitações" icon={<RecentActors />} />
            : null
          }
          <ListItemLink to="/contas" primary="Contas Bancárias" icon={<Payment />} /> 
        </List>
      </Collapse>
    </Fragment>
  );
}
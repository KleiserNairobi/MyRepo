import React, { Fragment, useState } from 'react';
import { Tooltip, ListItem, ListItemIcon, ListItemText } from '@material-ui/core';
import { ExpandLess, ExpandMore, Print } from '@material-ui/icons';
//import { Link as RouterLink } from 'react-router-dom'
import styles from '../layout/styles';
//import { useGeral } from '../contexts/GeralCtx';


export default function MenuRelatorios() {
  const estilo = styles();
  const [abrir, setAbrir] = useState(false);


  //const {setCarregar} = useGeral();

  function abrirMenu() {
    setAbrir(!abrir);
  }

  /*
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
                      <ListItem button component={renderLink} onClick={()=>setCarregar(true)}>
                          {icon ? <ListItemIcon className={estilo.ml1}>{icon}</ListItemIcon> : null}
                          <ListItemText primary={primary} />
                      </ListItem>
                  </li>
              </Tooltip>
          );
      }
  */

  return (
    <Fragment>
      <Tooltip title="Relatórios" placement="right" arrow>
        <ListItem button key="Relatórios" onClick={() => abrirMenu()}>
          <ListItemIcon className={estilo.ml1}>
            <Print />
          </ListItemIcon>
          <ListItemText primary="Relatórios" />
          {abrir ? <ExpandLess /> : <ExpandMore />}
        </ListItem>
      </Tooltip>
    </Fragment>
  );
}

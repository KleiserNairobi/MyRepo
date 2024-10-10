import React from 'react';
import clsx from 'clsx';
import { CssBaseline, AppBar } from '@material-ui/core';
import { useGeral } from '../../contexts/GeralCtx';

import MyToolBar from '../../components/MyToolBar';
import MyDrawer from '../../components/MyDrawer';
import styles from '../styles';

export default function Header() {
  const estilo = styles();
  const { abrirMenu } = useGeral();

  return (
    <div className={estilo.root}>
      <CssBaseline />
      <AppBar
        position="fixed"
        className={clsx(estilo.appBar, { [estilo.appBarShift]: abrirMenu, })}
      >
        <MyToolBar />
      </AppBar>
      <MyDrawer />
    </div>
  );
}
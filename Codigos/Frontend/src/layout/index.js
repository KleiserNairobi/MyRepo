import React from 'react';
import { CssBaseline, ThemeProvider } from '@material-ui/core';

import theme from './theme';
import Header from './Header';
import Content from './Content';

export default function Layout({ children }) {
  return (
    <ThemeProvider theme={theme}>
      <div>
        <CssBaseline />
        <Header />
        <Content>{children}</Content>
      </div>
    </ThemeProvider>
  );
}

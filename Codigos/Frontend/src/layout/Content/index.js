import React from 'react';
import clsx from 'clsx';
import { useGeral } from '../../contexts/GeralCtx';
import styles from '../styles';

export default function Content({ children }) {
  const estilo = styles();
  const { abrirMenu } = useGeral();

  return (
    <main className={clsx(estilo.conteudo, { [estilo.conteudoShift]: abrirMenu, })}>
      {children}      
    </main>
  );
}
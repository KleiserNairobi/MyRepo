import React from 'react';
import clsx from 'clsx';
import { useGeral } from '../../contexts/GeralCtx';
import styles from '../styles';

export default function Footer() {
    const estilo = styles();
    const { abrirMenu } = useGeral();

    return ( 
        <footer className={
            clsx(estilo.conteudo, { [estilo.conteudoShift]: abrirMenu, })} 
        >
            Chamaí! &copy; {new Date().getFullYear()}
        </footer>
    );
}

import React, { useState } from 'react';
import clsx from 'clsx';
import { useHistory } from 'react-router-dom';
import { Toolbar, Tooltip, IconButton, Badge, Avatar, Typography } from '@material-ui/core';
import { Menu, ExitToApp, FullscreenOutlined, FullscreenExitOutlined, AssignmentInd, Chat, Person } from '@material-ui/icons';
import { useAutenticacao } from '../contexts/AutenticacaoCtx';
import { useGeral } from '../contexts/GeralCtx';
import { useSolicitacao } from '../contexts/SolicitacaoCtx';
import styles from '../layout/styles';


export default function MyToolBar() {

  const estilo = styles();
  const history = useHistory();
  const elem = document.documentElement;
  const { handleLogout, tipoMembro, nomeUsuario, avatarUsuario } = useAutenticacao();
  const { limpaObjDados, limpaObjPgto, limpaObjCartao } = useSolicitacao();
  const { abrirMenu, setAbrirMenu, setCarregar } = useGeral();
  const [telaCheia, setTelaCheia] = useState(false);

  const abreTelaCheia = () => {
    setTelaCheia(true)
    if (elem.requestFullscreen) {
      elem.requestFullscreen()
    } else if (elem.mozRequestFullScreen) {
      elem.mozRequestFullScreen()
    } else if (elem.webkitRequestFullscreen) {
      elem.webkitRequestFullscreen()
    } else if (elem.msRequestFullscreen) {
      elem.msRequestFullscreen()
    }
  }

  const fechaTelaCheia = () => {
    setTelaCheia(false)
    if (document.exitFullscreen) {
      document.exitFullscreen()
    } else if (document.mozCancelFullScreen) {
      document.mozCancelFullScreen()
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen()
    } else if (document.msExitFullscreen) {
      document.msExitFullscreen()
    }
  }

  function telaChat() {
    history.push('/chat');
  }

  function telaAprovacao() {
    setCarregar(true);
    history.push('/aprovacoes')
  }

  function sairSistema() {
    limpaObjDados();
    limpaObjPgto();
    limpaObjCartao();
    handleLogout();
  }

  return (
    <Toolbar>
      <IconButton
        color="inherit"
        edge="start"
        aria-label="abre menu"
        className={clsx(estilo.menuButton, { [estilo.hide]: abrirMenu, })}
        onClick={() => setAbrirMenu(true)}
      >
        <Menu />
      </IconButton>
      <div className={estilo.dadosUsuario}>
        <div className={estilo.margemAvatar}>
          {(avatarUsuario === null || avatarUsuario === '') 
            ? <Avatar alt="usuario"><Person /></Avatar>
            : <Avatar alt="usuario" src={avatarUsuario}/>
          }        
        </div>
        <Typography variant="subtitle1">{nomeUsuario}</Typography>
      </div>
      <Tooltip title="Chat" placement="bottom" arrow>
        <IconButton color="inherit" onClick={telaChat}  >
          <Badge badgeContent={0} color="secondary">
            <Chat />
          </Badge>
        </IconButton>
      </Tooltip>
      { (tipoMembro.indexOf("COL") !== -1) ?
        <Tooltip title="Aprovação" placement="bottom" arrow>
          <IconButton color="inherit" onClick={telaAprovacao}>
            <Badge badgeContent={0} color="secondary">
              <AssignmentInd />
            </Badge>
          </IconButton>
        </Tooltip>
        : null
      }
      <div style={{ flex: 1 }} />
      {telaCheia ? (
        <Tooltip title="Sair do modo tela cheia" placement="bottom" arrow>
          <IconButton color="inherit" onClick={fechaTelaCheia}>
            <FullscreenExitOutlined />
          </IconButton>
        </Tooltip>
      ) : (
        <Tooltip title="Entrar no modo tela cheia" placement="bottom" arrow>
          <IconButton color="inherit" onClick={abreTelaCheia}>
            <FullscreenOutlined />
          </IconButton>
        </Tooltip>
      )}
      <Tooltip title="Sair do sistema" placement="bottom" arrow>
        <IconButton color="inherit" onClick={() => sairSistema()}>
          <ExitToApp />
        </IconButton>
      </Tooltip>
    </Toolbar>
  );
}
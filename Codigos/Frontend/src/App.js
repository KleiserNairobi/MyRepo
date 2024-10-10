import React from 'react';
import { useLocation } from 'react-router-dom';

// Importando os providers
import { AlertaProvider } from './contexts/AlertaCtx';
import { AutenticacaoProvider } from './contexts/AutenticacaoCtx';
import { GeralProvider } from './contexts/GeralCtx';
import { SolicitacaoProvider } from './contexts/SolicitacaoCtx';
import { MapaProvider } from './contexts/MapaCtx';

// Importando o layout e as páginas
import Layout from './layout';
import Pages from './pages';
import Alerta from './components/Alerta';


export default function App() {
  let location = useLocation();

  return (
    <AlertaProvider>
      <AutenticacaoProvider>
        <GeralProvider>          
          <SolicitacaoProvider>
            <MapaProvider>
            <div>
              <Alerta />
              {
                //location.pathname === '/' || 
                location.pathname === '/login' ||
                location.pathname === '/trocar-senha' ||
                location.pathname === '/cadastro'
                ? <Pages />
                : <Layout><Pages /></Layout>
              }
            </div>
            </MapaProvider>            
          </SolicitacaoProvider>          
        </GeralProvider>
      </AutenticacaoProvider>
    </AlertaProvider>
  );
}

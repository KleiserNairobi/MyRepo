import React, {useEffect} from 'react';
import {Card} from '@material-ui/core';
import MyGoogleMaps from './MyGoogleMaps';
import { useSolicitacao } from '../../contexts/SolicitacaoCtx';
import { useGeral } from '../../contexts/GeralCtx';
import Styles from './Styles';

// import das páginas envolvidas no processo
import Veiculo from './Veiculo';
import Retirada from './Retirada';
import RetiradaInstrucoes from './RetiradaInstrucoes';
import Entrega from './Entrega';
import EntregaInstrucoes from './EntregaInstrucoes';
import Confirmacao from './Confirmacao';
import Pagamento from './Pagamento';
import Checkout from './Checkout';
import Conclusao from './Conclusao';
import Agendamento from './Agendamento';

export default function NovaSolicitacao() {

  const classes = Styles();
  const { tela, setTela } = useSolicitacao();
  const { carregar, setCarregar } = useGeral();

  function chamaTela(step) {
    switch(step) {
      case 1:
        return <Veiculo/>
      case 2:
        return <Retirada/>
      case 3:
        return <RetiradaInstrucoes/>
      case 4:
        return <Entrega/>
      case 5:
        return <EntregaInstrucoes/>
      case 6:
        return <Confirmacao/>  
      case 7:
        return <Agendamento/>
      case 8:
        return <Pagamento/>
      case 9: 
        return <Checkout/>
      case 10: 
        return <Conclusao/>
      default: break
    }
  }

  // Seta o stepper inicial
  useEffect(() => {
    if (carregar) {
      setTela(1);
      setCarregar(false);
    }
  }, [setTela, carregar, setCarregar])

  return (
    <div className={classes.solContainer}>  
      <div className={classes.solDados}>
        {chamaTela(tela)}
      </div>
      <Card className={classes.solMapa} >
      <MyGoogleMaps/>
      </Card>
    </div>
  )
}

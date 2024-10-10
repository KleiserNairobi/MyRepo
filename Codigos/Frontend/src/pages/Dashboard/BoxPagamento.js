import React from 'react';
import { Typography, Grid, Card, CardHeader, CardContent, Avatar, CardActionArea } from '@material-ui/core';
import { AttachMoney, MoneyOff, CreditCard, Money } from '@material-ui/icons';
import styles from '../Dashboard/styles';

export default function BoxPagamento() {
    const estilo = styles();
    return (
        <div>
            <Typography variant="h6" className={estilo.tituloBoxCartoes}>Pagamentos</Typography>
            <hr className={estilo.hr1} />
            <br/>
        <Grid container direction="row" justify="flex-start" alignItems="center" spacing={3} className={estilo.mb3}>
            <Grid item xs={12} sm={12} md={6} lg={3} xl={3}>
                <Card variant="outlined" >
                    <CardHeader 
                        avatar={
                            <Avatar className={estilo.corLaranja} >
                                <CreditCard fontSize="large" />
                            </Avatar>
                        }
                        title="Pagamentos c/ Cartão"
                        className={estilo.cartaoAmarelo}
                    />
                    <CardActionArea>
                        <CardContent>
                            <Typography variant="h4" align="center">R$ 10.500,00</Typography>
                        </CardContent>
                    </CardActionArea>
                </Card>
            </Grid>
            <Grid item xs={12} sm={12} md={6} lg={3} xl={3}>
                <Card variant="outlined" >
                    <CardHeader 
                        avatar={
                            <Avatar className={estilo.corVermelha}>
                                <MoneyOff fontSize="large"/>
                            </Avatar>
                        }
                        title="Pagamentos c/Desconto"
                        className={estilo.cartaoVermelho}
                    />
                    <CardActionArea>
                        <CardContent>
                            <Typography variant="h4" align="center">R$ 500,00</Typography>
                        </CardContent>
                    </CardActionArea>
                </Card>
            </Grid>
            <Grid item xs={12} sm={12} md={6} lg={3} xl={3}>
                <Card variant="outlined" >
                    <CardHeader 
                        avatar={
                            <Avatar className={estilo.corVerde}>
                                <AttachMoney fontSize="large"/>
                            </Avatar>
                        }
                        title="Pagamentos em Dinheiro"
                        className={estilo.cartaoVerde}
                    />
                    <CardActionArea>
                        <CardContent>
                            <Typography variant="h4" align="center">R$ 30.000,00</Typography>
                        </CardContent>
                    </CardActionArea>
                </Card>
            </Grid>
            <Grid item xs={12} sm={12} md={6} lg={3} xl={3}>
                <Card variant="outlined" >
                    <CardHeader 
                        avatar={
                            <Avatar className={estilo.corAzul}>
                                <Money fontSize="large"/>
                            </Avatar>
                        }
                        title="Pagamentos Total"
                        className={estilo.cartaoAzul}
                    />
                    <CardActionArea>
                        <CardContent>
                            <Typography variant="h4" align="center">R$ 40.000,00</Typography>
                        </CardContent>
                    </CardActionArea>
                </Card>
            </Grid>                
        </Grid>
        </div>
    );
}

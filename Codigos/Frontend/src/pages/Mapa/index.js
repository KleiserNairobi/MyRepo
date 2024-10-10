import React, {useState} from 'react';
import { Card, CardContent, Grid, TextField, Typography } from '@material-ui/core';
import {GoogleMap, LoadScript, Marker} from '@react-google-maps/api';

import { useGeral } from '../../contexts/GeralCtx';
import styles from '../../layout/styles';
import PagesCss from '../PagesCss';
import { Autocomplete } from '@material-ui/lab';


export default function Mapa() {

  const estilo = styles();
  const classes = PagesCss();
  const { estiloDeCampo } = useGeral();
  const [markers, setMarkers] = useState([]);

  const containerStyle = {
    width: '100%',
    height: '100%',
  };

  const center = {
    lat: parseFloat(-16.6864),
    lng: parseFloat(-49.2643),
  };

  const options = {
    disableDefaultUI: true,
    scrollwheel: false,
    zoomControl: true    
  } 

  
  const entregadores = [
    { title: 'TODOS...' },
    { title: 'ONLINE' },
    { title: 'OFFLINE' },
    { title: 'EM ENTREGA' },
  ];

  return (
    <div>
      <Grid container direction="row" justify="space-between" alignItems="center">
        <div>
          <div className={estilo.tituloPagina}>
            <Typography variant="h6">Mapa</Typography>
          </div>
          <div className={estilo.subtituloPagina}>
            <Typography variant="caption">Posição atual do entregador</Typography>
          </div>
        </div>
      </Grid>
      
      <Card>
        <CardContent>
          <Grid container direction="row"spacing={2}>
            <Grid item xs={12}>
              Informações sobre o filtro
            </Grid>
            <Grid item xs={12}>
            <Autocomplete
              id="cbxEntregador"
              options={entregadores}
              getOptionLabel={(option) => option.title}
              style={{ width: 300 }}
              renderInput={(params) => <TextField {...params} label="Entregador" variant={estiloDeCampo} />}
            />
          </Grid>

          </Grid>
          <Grid className={classes.solMapa}>
            <LoadScript
              googleMapsApiKey = {process.env.REACT_APP_GOOGLE_MAPS_KEY}
            >
              <GoogleMap
                id='chamaih-map'
                zoom={10}
                center={center}
                options={options}
                mapContainerStyle={containerStyle}
                onClick={(event) => {
                  setMarkers((current) => [
                    ...current,
                    {
                      lat: event.latLng.lat(),
                      lng: event.latLng.lng(),
                      time: new Date(),
                    },
                  ]);
                }}
              >

              {
                markers.map( (marker) => (
                  <Marker
                    key={marker.time.toISOString()}
                    position={{ lat: marker.lat, lng: marker.lng }}
                  />
                ))
              }

              </GoogleMap>
            </LoadScript>

          </Grid>
        </CardContent>
      </Card>

    </div>
  )
}

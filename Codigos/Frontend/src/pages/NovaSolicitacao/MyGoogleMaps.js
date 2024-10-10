import React, {useState, useMemo, memo} from 'react';
import {DirectionsRenderer, DirectionsService, GoogleMap, LoadScript} from '@react-google-maps/api';
import { useMapa } from '../../contexts/MapaCtx';


function MyGoogleMaps() {
  
  const { mapa } = useMapa();
  
  const [opcoes, setOpcoes ] = useState({
    origin: null,
    destination: null,
    travelMode: "DRIVING",
    response: null
  });

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

  function directionsCallback(response) {
    if (response !== null) {
      if (response.status === 'OK') {
        setOpcoes(() => ({response}));
      } 
    }
  }

  useMemo(() => {
    setOpcoes({
      origin: mapa.origem,
      destination: mapa.destino,
      travelMode: mapa.modoViagem
    });
  },[mapa]);


  return (
    <LoadScript
      googleMapsApiKey = {process.env.REACT_APP_GOOGLE_MAPS_KEY}
    >
      <GoogleMap
        id='chamaih-map'
        zoom={10}
        center={center}
        options={options}
        mapContainerStyle={containerStyle}
        // onLoad={map => {console.log('DirectionsRenderer onLoad map: ', map)}}
        // onUnmount={map => {console.log('DirectionsRenderer onUnmount map: ', map)}}
      >
      {
        opcoes.origin !== null &&
        opcoes.destination !== null && (
          <div> 
            <DirectionsService
              options={opcoes}
              callback={directionsCallback}
            />
            <DirectionsRenderer
              options={{directions: opcoes.response}}
              // onLoad={directionsRenderer => {console.log('Carregando: ', directionsRenderer)}}
              // onUnmount={directionsRenderer => {console.log('Desmontando: ', directionsRenderer)}}
            />
          </div>
        )
      }
      </GoogleMap>
    </LoadScript>
  )
}

export default memo(MyGoogleMaps);


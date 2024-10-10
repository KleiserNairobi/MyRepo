import React, { Component } from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';

import MapView from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';

const GOOGLE_MAPS_APIKEY = 'AIzaSyBikffeHfv1Ne2udYZco66_lE0XYdzViW8';
const backgroundColor = '#007256';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  map: {
    ...StyleSheet.absoluteFillObject
  }
});

export default class MakeMap extends Component {
  constructor(props) {
    super(props);
    this.state = {
      origin: props.origin,
      destination: props.destination,
      originText: 'Origem',
      destinationText: 'Destino',
    };
  }

  render() {
    return (
      <View style={styles.container}>
        {
          this.state.origin && 
          this.state.origin.latitude && 
          this.state.destination && 
          this.state.destination.latitude ? (
          <MapView
            ref={(map) => { this.map = map }}
            style={styles.map}
            region={{
              latitude: (this.state.origin.latitude + this.state.destination.latitude) / 2,
              longitude: (this.state.origin.longitude + this.state.destination.longitude) / 2,
              latitudeDelta: Math.abs(this.state.origin.latitude - this.state.destination.latitude) + Math.abs(this.state.origin.latitude - this.state.destination.latitude) * .1,
              longitudeDelta: Math.abs(this.state.origin.longitude - this.state.destination.longitude) + Math.abs(this.state.origin.longitude - this.state.destination.longitude) * .2,
            }}
            loadingEnabled={true}
            zoomEnabled={true}
            zoomControlEnabled={true}
            mapType="standard"
          >
            <MapView.Marker
              coordinate={this.state.destination}
              title="Local de Retirada"
            />
            <MapView.Marker
              coordinate={this.state.origin}
              title="Local de Entrega"
            />
            <MapViewDirections
              origin={this.state.origin}
              destination={this.state.destination}
              apikey={GOOGLE_MAPS_APIKEY}
            />
          </MapView>
        ) : (
          <Text style={{ textAlign: 'center' }}>Erro na Localização</Text>
        )}
      </View>
    );
  }
}

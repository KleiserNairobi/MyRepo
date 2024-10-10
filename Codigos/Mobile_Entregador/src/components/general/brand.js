import React, { useState, useEffect } from 'react';
import { View, Animated, Keyboard } from 'react-native';

import Styles from '../../assets/scss/styles';

const sourceLogo = require('../../assets/images/chamaih_L320.png');

export default Brand = () => {
  const [offset] = useState(new Animated.ValueXY({ x:0, y:95 }));
  const [opacity] = useState(new Animated.Value(0));
  const [areaHeight] = useState(new Animated.Value(Styles.brandContainer.height));
  const [logo] = useState(new Animated.ValueXY({ 
    x: Styles.brandSmall.width,
    y: Styles.brandSmall.height 
  }));

  function keyboardDidShow() {
    Animated.parallel([
      Animated.timing(logo.x, { 
        toValue: Styles.brandSmallExtra.width, 
        duration: 100, 
        useNativeDriver: false }),
      Animated.timing(logo.y, { 
        toValue: Styles.brandSmallExtra.height, 
        duration: 100, 
        useNativeDriver: false }),
      Animated.timing(areaHeight, {
        toValue: Styles.brandSmallContainer.height,
        duration: 100,
        useNativeDriver: false })
    ]).start();
  }

  function keyboardDidHide() {
    Animated.parallel([
      Animated.timing(logo.x, { 
        toValue: Styles.brandSmall.width, 
        duration: 100, 
        useNativeDriver: false }),
      Animated.timing(logo.y, { 
        toValue: Styles.brandSmall.height, 
        duration: 100, 
        useNativeDriver: false }),
      Animated.timing(areaHeight, { 
        toValue: Styles.brandContainer.height, 
        duration: 100, 
        useNativeDriver: false }),
    ]).start();
  }

  useEffect(() => {
    Keyboard.addListener('keyboardDidShow', keyboardDidShow);
    Keyboard.addListener('keyboardDidHide', keyboardDidHide);

    Animated.parallel([
      Animated.spring(offset.y, { 
        toValue: 0, 
        speed: 4, 
        bounciness: 20, 
        useNativeDriver: false 
      }),
      Animated.timing(opacity, { 
        toValue: 1, 
        duration: 200, 
        useNativeDriver: false 
      })
    ]).start();
  }, []);

  return (
    <Animated.View style={[Styles.brandContainer, { height: areaHeight }]}>
      <Animated.Image
        style={[Styles.brandSmall, { width: logo.x }]}
        source={sourceLogo} />
    </Animated.View>
  );
}

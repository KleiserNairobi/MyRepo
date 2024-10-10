/**
 * Buttons Styles
 */

import React from 'react';
import { StyleSheet, Dimensions } from 'react-native';

export const Styles = StyleSheet.create({
    default: {
        width: '98%',
        height: 50,
        fontSize: 20,
        textAlign: 'center',
        textAlignVertical: 'center',
        color: '#fff',
        margin: 10
    },
    color1: {
        color: 'deepskyblue',
        backgroundColor: '#fff',
        borderColor: '#fff',
    },
    color2: {
        color: '#fff',
        backgroundColor: 'darkorange',
        borderColor: 'rgba(0,0,0,0)',
    }
});

export default Styles;
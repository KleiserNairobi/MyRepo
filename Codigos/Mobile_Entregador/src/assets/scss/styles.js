/**
 * Basics Styles
 */

import React from 'react';
import { StyleSheet, Dimensions, Platform } from 'react-native';

const heightMap = Platform.OS == 'ios' ? Dimensions.get('window').height - 635 : Dimensions.get('window').height - 585;

// Bases Styles
const baseStyles = {
  scrollView: {
    backgroundColor: 'lightgray'
  },
  body: {
    flex: 1,
    backgroundColor: '#FFCC00',
    color: '#000000',
    fontFamily: 'Roboto',
  },
  container: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center'
  },
  link: {
    borderWidth: 1,
    borderColor: 'transparent',
    borderBottomColor: '#000000',
  }
}

// Margin and Padding Styles
const marginPaddingStyles = {
  m10: { margin: 10 },
  m15: { margin: 15 },
  m20: { margin: 20 },
  p10: { padding: 10 },
  p15: { padding: 15 },
  p20: { padding: 20 }
}

// Color Styles
const colorStyles = {
  blackColor: { color: '#000000' },
  yellowColor: { color: '#fdd20e' },
  yellowDarkColor: { color: '#ffcc00' },
  yellowLightColor: { color: '#fbe6b1'},
  whiteColor: { color: '#ffffff' },
  grayColor: { color: '#4e4e4e' },
  grayDarkColor: { color: '#bdbdbd' },
  grayLightColor: { color: '#eaebea' },
  blackBorder: { borderColor: '#000000' },
  yellowBorder: { borderColor: '#fdd20e' },
  yellowDarkBorder: { borderColor: '#ffcc00' },
  yellowLightBorder: { borderColor: '#fbe6b1'},
  whiteBorder: { borderColor: '#ffffff' },
  grayBorder: { borderColor: '#4e4e4e'},
  grayDarkBorder: { borderColor: '#bdbdbd' },
  grayLightBorder: { borderColor: '#eaebea'},
}

// Background Styles
const backgroundStyles = {
  blackBg: { backgroundColor: '#000000' },
  yellowBg: { backgroundColor: '#ffcc00' },
  yellowLightBg: { backgroundColor: '#fbe6b1' },
  whiteBg: { backgroundColor: '#ffffff' },
  grayBg: { backgroundColor: '#eaebea' },
  grayLightBg: { backgroundColor: '#f5f5f5' },
}

// Font Styles
const fontStyles = {
  font10: { fontSize: 10, fontFamily: 'Roboto' },
  font12: { fontSize: 12, fontFamily: 'Roboto' },
  font14: { fontSize: 14, fontFamily: 'Roboto' },
  font16: { fontSize: 16, fontFamily: 'Roboto' },
  font20: { fontSize: 20, fontFamily: 'Roboto' },
  font24: { fontSize: 24, fontFamily: 'Roboto' },
  font26: { fontSize: 26, fontFamily: 'Roboto' },
  font30: { fontSize: 30, fontFamily: 'Roboto' },
  fontBold: { fontWeight: 'bold', fontFamily: 'Roboto' },
  fontHighlight: { fontWeight: '700', fontFamily: 'Roboto' },
  fontUppercase: { textTransform: 'uppercase' },
  fontLowercase: { textTransform: 'lowercase' }
}

// Brand Styles
const brandStyles = {
  brandContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: Platform.OS == 'ios' ? 180 : 140,
    paddingTop: Platform.OS == 'ios' ? 45 : 0,
    paddingBottom: Platform.OS == 'ios' ? 15 : 0
  },
  imageBrand: {
    margin: 10,
    resizeMode: 'contain',
  },
}

// Form Elements Styles
const formElementsStyles = {
  formItem: {
    width: 300,
    minHeight: 50
  },
  inputText: {
    width: '90%',
    color: '#000',
    backgroundColor: 'rgba(0,0,0,0)', 
    borderColor: 'rgba(0,0,0,0)', 
    borderBottomColor: '#fff',
    borderWidth: 0,
    fontSize: 17,
    fontFamily: 'Roboto'
  },
  textarea: {
    width: '100%',
    borderColor: '#eaebea', 
    borderWidth: 2,
    borderRadius: 10,
  },
  checkbox: {
    borderColor: '#ffffff',
    borderWidth: 1,
    marginRight: 10,
    marginTop: 5
  }
}

// Button and Link Styles
const buttonStyles = {
  defaultButton: {
    width: 150,
    height: 50,
    borderWidth: 2,
    borderRadius: 50,
    borderColor: '#ffffff',
    backgroundColor: '#fdd20e',
    alignItems: 'center',
    justifyContent: 'center',
    margin: 10
  },
  textButton: {
    color: '#000000',
    fontWeight: 'bold',
    textTransform: 'uppercase',
    fontFamily: 'Roboto'
  },
  linkDefault: {
    ...baseStyles.link,
    ...fontStyles.font12,
    ...colorStyles.blackColor,
  }
}

// Styles
export default StyleSheet.create({
  ...baseStyles,
  brandSmallContainer: {
    ...brandStyles.brandContainer,
    height: Platform.OS == 'ios' ? 100 : 80,
  },
  contentContainer: {
    ...baseStyles.container,
    flex: 3,
    justifyContent: 'flex-start',
  },
  horizontalContainer: {
    ...baseStyles.container,
    minHeight: 50,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  justifyTopContainer: {
    ...baseStyles.container,
    justifyContent: 'flex-start',
    paddingTop: 5
  },
  formContainer: {
    ...marginPaddingStyles.m15,
    width: '85%'
  },
  mapaContainer: {
    ...backgroundStyles.grayLightBg,
    height: heightMap, 
    margin: 15,
    borderRadius: 5,
    justifyContent: 'center'
  },
  detailsItemContainer: {
    ...colorStyles.grayLightBorder,
    borderBottomWidth: 1,
    width:'100%',
    minHeight: 35,
    flex:0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  detailsItemDescriptionContainer: {
    ...fontStyles.fontBold,
    ...fontStyles.font16,
    width: '40%',
    padding: 5,
    alignItems: 'center'
  },
  detailsItemValueContainer: {
    width: '60%',
    padding: 5,
    alignItems: 'center'
  },
  containerButtonBottom: {
    ...baseStyles.container,
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingTop: 40, 
    paddingBottom: 10
  },
  bottomContainerForButton: {
    height: '15%',
    flexDirection: 'row', 
    alignItems: 'flex-end', 
    justifyContent: 'center', 
    paddingBottom: 10
  },
  textBox: {
    alignItems: 'center',
    maxWidth: '100%',
    padding: 15
  },
  textSmallBox: {
    alignItems: 'center',
    maxWidth: '100%',
    padding: 5
  },

  ...marginPaddingStyles,
  mInternalBox: { 
    marginLeft: 15, 
    marginRight: 15, 
    marginTop: 5, 
    marginBottom: 5 
  },

  ...colorStyles,
  facebookStyle: { 
    color: fontStyles.whiteColor, 
    backgroundColor: '#3b5998',
    borderWidth: 0
  },
  googleStyle: { 
    color: fontStyles.whiteColor, 
    backgroundColor: '#DB4437',
    borderWidth: 0
  },

  ...backgroundStyles,

  ...fontStyles,
  fontBoxDefault: {
    ...fontStyles.font12,
    ...fontStyles.fontBold,
    ...fontStyles.fontUppercase
  },

  ...brandStyles,
  brandSmallExtra: { ...brandStyles.imageBrand, width: 102, height: 53 },
  brandSmall: { ...brandStyles.imageBrand, width: 173, height: 91 },
  brandNormal: { ...brandStyles.imageBrand, width: 214, height: 112 },
  brandLarge: { ...brandStyles.imageBrand, width: 222, height: 117 },
  brandLargeExtra: { ...brandStyles.imageBrand, width: 246, height: 130 },

  ...formElementsStyles,

  ...buttonStyles,
  smallButton: {
    ...buttonStyles.defaultButton,
    width: 120,
    height: 35
  },
  smallLineButton: {
    ...buttonStyles.defaultButton,
    width: 120,
    height: 35,
    borderColor: '#fdd20e',
    backgroundColor: '#ffffff',
    borderWidth: 2,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    margin: 5
  },
  largeButton: {
    ...buttonStyles.defaultButton,
    width: 260,
    height: 50
  },
  largeBlockButton: {
    width: Dimensions.get('window').width - 60,
    height: 38,
    borderColor: '#fdd20e',
    backgroundColor: '#ffffff',
    borderWidth: 2,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    margin: 5
  },
  iconButton: {
    fontSize: 24,
    margin: 5
  },

  header: {
    backgroundColor: '#FFCC00',
  },
  headerLeft: {
    flex: 1,
  },
  headerCenter: {
    flex: 2,
    alignItems: 'center'
  },
  headerRight: {
    flex: 1,
  },
  headerTitle: {
    ...colorStyles.grayColor,
    fontSize: 20,
    fontWeight: '600',
    textAlign: 'center'
  },

  barVehicles: {
    ...backgroundStyles.grayBg,
    flex: 1,
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between',
    height: 72
  },
  barVehiclesButtom: {
    width: '25%', 
    height: '100%',
    flexDirection: 'column', 
    alignItems: 'center', 
    justifyContent: 'center'
  },
  barVehiclesIcon: {
    fontSize: 36,
    color: colorStyles.grayDarkColor.color
  },
  barVehiclesIconSelected: {
    fontSize: 36,
    color: colorStyles.yellowDarkColor.color
  },
  barVehiclesText: {
    fontSize: 16,
    color: colorStyles.grayDarkColor.color
  },
  barVehiclesTextSelected: {
    fontSize: 16,
    color: colorStyles.yellowDarkColor.color
  }, 

  tabBarBottom: {
    color: '#FFFFFF',
    backgroundColor: '#000000',
  },
  tabBarBottomText: {
    color: '#FFFFFF',
    fontSize: 18,
  }
});
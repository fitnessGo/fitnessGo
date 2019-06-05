import { StyleSheet, Platform } from 'react-native';

export const ScreenStyles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    paddingTop: (Platform.OS === 'ios') ? 18 : 0
  }
});

export const FontStyles = StyleSheet.create({
  default: {
    fontSize: 14
  },
  h1:{
    fontSize: 20
  },
  h2:{
    fontSize: 18
  },
  h3:{
    fontSize: 16
  },
  bold: {
    fontWeight: 'bold'
  }
});

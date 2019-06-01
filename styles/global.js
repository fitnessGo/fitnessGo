import { StyleSheet, Platform } from 'react-native';

export const ScreenStyles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    paddingTop: (Platform.OS === 'ios') ? 18 : 0
  }
});

export const FontStyles = StyleSheet.create({
  bold: {
    fontWeight: 'bold'
  }
});

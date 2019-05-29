import {StyleSheet} from 'react-native';

export const Colors = {
    dark: '#1e1e1e',
    light: 'white'
};

const lightStyleSheet = StyleSheet.create({
    background: {
        backgroundColor: Colors.light
    },
    text: {
        color: '#000000'
    }
});

const darkStyleSheet = StyleSheet.create({
    background: {
        backgroundColor: Colors.dark
    },
    text: {
        color: '#ffffff'
    }
});

export default function getStyleSheet(useDarkTheme){
    return useDarkTheme ? darkStyleSheet : lightStyleSheet;   
}
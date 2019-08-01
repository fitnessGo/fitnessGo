import React, { Component } from "react";
import { SafeAreaView, View, ScrollView, Text, Image, StyleSheet, Linking } from "react-native";
import { Overlay, Icon, Button } from 'react-native-elements'
import getStyleSheet from "../styles/themestyles";
import { ScreenStyles, FontStyles } from '../styles/global';
import Logo from '../logo.png';

class AboutScreen extends Component {
    static navigationOptions = ({ navigation }) => {
        return {
            headerTintColor: global.darkTheme ? "#cfcfcf" : '#101010',
            headerStyle: {
                backgroundColor: getStyleSheet(global.darkTheme).background.backgroundColor
            }
        };
    };

    constructor(props) {
        super(props)
    }
    _goToURL(url) {
        Linking.canOpenURL(url).then(supported => {
          if (supported) {
            Linking.openURL(url);
          } else {
            console.log('Don\'t know how to open URI: ' + url);
          }
        });
      }
    render() {
        return (
            <SafeAreaView style={[ScreenStyles.screenContainer]}>
                <ScrollView style={[ScreenStyles.screenContainer, styles.container,{ height: "100%",  width: '100%' }]} showsVerticalScrollIndicator={true}>
                    <View style={{ alignItems: "center", height: "100%"}}>
                        <View style={styles.imageContainer}>
                            <Image
                                style={styles.image}
                                source={Logo}
                                resizeMode="contain"
                            />
                        </View>
                        <View style={{marginTop: "10%", width: "90%", left: "5%"  }}>
                            <Text>Exercise images designed by: </Text>
                            <Text onPress={ () => {this._goToURL("http://www.freepik.com")}} style={FontStyles.bold}>   macrovector / Freepik</Text>
                            <Text onPress={ () => {this._goToURL("http://www.freepik.com")}} style={FontStyles.bold}>   macrovector_official / Freepik</Text>
                            <Text onPress={ () => {this._goToURL("http://www.freepik.com")}} style={FontStyles.bold}>   grmarc / Freepik</Text>
                        </View>
                        <View style={{marginTop: "5%",  textAlign: "left", width: "90%", left: "5%" }}>
                                <Text style={{textAlign: "left" }}>Sounds: </Text>
                                <Text onPress={ () => {this._goToURL("https://freesound.org/people/tommon/sounds/40753/")}}>  "One Blast Whistle SHORT" by <Text style={FontStyles.bold}>tommon</Text></Text>
                                <Text onPress={ () => {this._goToURL("https://freesound.org/people/unfa/sounds/215416/")}}>  "Short Ping!" by <Text style={FontStyles.bold}>unfa</Text></Text>
                                <Text onPress={ () => {this._goToURL("https://freesound.org/people/ross_stack/sounds/220763/")}}>  "Kitchen Egg Timer Ring 04" by <Text style={FontStyles.bold}>ross_stack</Text></Text>
                                <Text onPress={ () => {this._goToURL("https://freesound.org/people/FoolBoyMedia/sounds/352661/")}}>  "Complete Chime" by <Text style={FontStyles.bold}>FoolBoyMedia</Text></Text>
                        </View>
                    </View>
                </ScrollView>
            </SafeAreaView>
        );
    }
}

const styles = StyleSheet.create({
    imageContainer: {
        backgroundColor: "#3c1a5b",
        borderRadius: 1000,
        alignItems: "center",
        width: "30%",
        aspectRatio: 1,
        paddingHorizontal: 10
    },
    image: {
        width: '100%'
    },
    button: {
        height: 55,
        marginTop: 20,
        marginLeft: 20,
        marginRight: 20
    },
    container: {
        paddingVertical: 20
    }
});


export default AboutScreen;
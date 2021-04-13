import React from 'react';
import { SafeAreaView, StatusBar, Image, View,Text, ImageBackground, TouchableOpacity } from 'react-native';
import {heightToDp, widthToDp} from '../components/Responsive';

export default class LandingScreen extends React.Component {
    render = () => (
        <ImageBackground
            source={require("../../assets/splash__screen_bg.png")}
            resizeMode="stretch"
            style={{flex: 1}}
        >
            <StatusBar backgroundColor="#007dfe" barStyle="light-content"/>
            <View 
                style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center'
                }}
            >
                <Image
                    source={require("../../assets/logo.png")}
                    style={{height: '24%', width: '24%'}}
                    resizeMode="contain"
                />
            </View>
            <TouchableOpacity
                style={{
                    position: 'absolute',
                    bottom: heightToDp("6%"),
                    alignSelf: 'center',    
                    backgroundColor: '#fff',
                    width: widthToDp("70%"),
                    padding: widthToDp("3%"),
                    borderRadius: 10
                }}
                activeOpacity={0.7}
                onPress={() => this.props.navigation.navigate("SignInScreen")}
            >
                <Text
                    style={{
                        textAlign: 'center',
                        color: "#69abff", 
                        fontWeight: 'bold',
                        fontSize: widthToDp("3.8%")
                    }}
                >
                    Get Started
                </Text>
            </TouchableOpacity>
        </ImageBackground> 
    )
}
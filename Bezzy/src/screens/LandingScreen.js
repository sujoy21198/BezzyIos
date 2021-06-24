import React from 'react';
import { SafeAreaView, StatusBar, Image, View, Text, ImageBackground, TouchableOpacity } from 'react-native';
import { heightToDp, widthToDp } from '../components/Responsive';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default class LandingScreen extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            valuePresent: false
        }
    }

    componentDidMount(){
        this.splash()
    }

    splash = async () => {
        let value = await AsyncStorage.getItem('token')
        if(value) this.setState({valuePresent: true});
        setTimeout(async () => {
            if (value) {                
                this.props.navigation.reset({
                    index: 0,
                    routes: [{ name: "HomeScreen" }]
                });
            }
        }, 3000)
    }
    render() {
        return (
            <ImageBackground
                source={require("../../assets/splash__screen_bg.png")}
                resizeMode="stretch"
                style={{ flex: 1 }}
            >
                <StatusBar backgroundColor="#007dfe" barStyle="light-content" />
                <View
                    style={{
                        flex: 1,
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}
                >
                    <Image
                        source={require("../../assets/logo.png")}
                        style={{ height: '24%', width: '24%' }}
                        resizeMode="contain"
                    />
                </View>
                {
                    !this.state.valuePresent && <TouchableOpacity
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
                                fontFamily: "ProximaNova-Black",
                                fontSize: widthToDp("4.5%")
                            }}
                        >
                            Get Started
                    </Text>
                    </TouchableOpacity>
                }

            </ImageBackground>
        )
    }
}
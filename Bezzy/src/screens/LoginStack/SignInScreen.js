import React from 'react';
import { SafeAreaView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Header from '../../components/Header';
import { heightToDp, widthToDp } from '../../components/Responsive';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import Icon from 'react-native-vector-icons/Ionicons';
import axios from 'axios'
import DataAccess from '../../components/DataAccess'
import { Toast } from 'native-base';

export default class SignInScreen extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            email: "",
            password: "",
            isEmailValid: ''
        }
    }

    setEmail = (text) => {
        let emailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if (!emailRegex.test(text.trim())) {
            // this.setState({ isEmailValid: false, email: text.trim() })
            // alert(this.state.email)
            this.state.email = text
            this.state.isEmailValid = false
        } else {
            this.setState({ email: text.trim(), isEmailValid: true });
        }
    }

    logIn = async () => {
        // let emailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        // if (this.state.email === "") {
        //     return;
        // }
        // if (this.state.password === "") {
        //     return;
        // }
        // if (!emailRegex.test(this.state.email.trim())) {
        //     return;
        // }
        // console.log("Call Sign In Api");
        // await axios.post(DataAccess.BaseUrl + DataAccess.SignIn, {
        //     username: this.state.email,
        //     password: this.state.password
        // }).then(function (response) {
        //     console.log(response.data.resp)
        //     if (response.data.resp === 'false') {
        //         return Toast.show({
        //             text:response.data.message,
        //             duration:6000
        //         })
        //     }

        // }).catch(function (error) {
        //     alert(error)
        // })
        this.props.navigation.navigate("HomeScreen")
    }

    render = () => (
        <KeyboardAwareScrollView
            style={{ flex: 1, backgroundColor: '#69abff' }}
            keyboardShouldPersistTaps='handled'>
            <Header headerText={"Welcome to Bezzy"} />
            <View
                style={{
                    height: heightToDp('100%'),
                    backgroundColor: '#fff',
                    borderTopWidth: 1,
                    borderTopColor: '#69abff',
                    borderTopLeftRadius: 18,
                    borderTopRightRadius: 18,
                }}
            >
                <View
                    style={{
                        paddingVertical: heightToDp("6%"),
                        paddingHorizontal: widthToDp("3%")
                    }}
                >
                    <Text
                        style={{
                            fontWeight: 'bold',
                            fontSize: widthToDp("4.5%")
                        }}
                    >
                        Sign In
                    </Text>
                    <Text
                        style={{
                            fontWeight: 'bold',
                            fontSize: widthToDp("4.5%")
                        }}
                    >
                        Let's get started
                    </Text>
                    <View
                        style={{
                            alignItems: 'center',
                            borderBottomWidth: 1,
                            borderBottomColor: '#a9a9a9',
                            marginTop: heightToDp("10%"),
                        }}
                    >
                        <TextInput
                            style={{
                                color: '#808080',
                                fontSize: widthToDp("3.3%"),
                                fontFamily: 'Oswald-Medium',
                                width: widthToDp("95%")
                            }}
                            placeholder="Email id"
                            keyboardType="email-address"
                            placeholderTextColor="#808080"
                            onChangeText={this.setEmail}
                        />
                    </View>
                    {
                        !this.state.isEmailValid && this.state.email !== "" &&
                        <Text
                            style={{
                                color: "#ff0000"
                            }}
                        >Entered email address is not valid</Text>
                    }
                    <View
                        style={{
                            flexDirection: 'row',
                            justifyContent: 'center',
                            borderBottomWidth: 1,
                            borderBottomColor: '#a9a9a9',
                            marginTop: heightToDp("3%"),
                        }}
                    >
                        <TextInput
                            style={{
                                color: '#808080',
                                fontSize: widthToDp("3.3%"),
                                fontFamily: 'Oswald-Medium',
                                width: widthToDp("87%")
                            }}
                            placeholder="Password"
                            secureTextEntry={!this.state.showPassword}
                            placeholderTextColor="#808080"
                            onChangeText={text => this.setState({ password: text })}
                        />
                        <Icon
                            name={this.state.showPassword ? "eye-off" : "eye"}
                            size={20}
                            color="#808080"
                            onPress={() => this.setState({ showPassword: !this.state.showPassword })}
                            style={{ marginTop: heightToDp("1.7%"), marginRight: widthToDp("4%") }}
                        />
                    </View>
                    <TouchableOpacity
                        style={{
                            marginTop: heightToDp("3%"),
                            width: "100%",
                            backgroundColor: "#69abff",
                            padding: widthToDp("3%"),
                            borderRadius: 10
                        }}
                        activeOpacity={0.7}
                        onPress={this.logIn}
                    >
                        <Text
                            style={{
                                color: "#fff",
                                textAlign: "center",
                                fontWeight: 'bold'
                            }}
                        >
                            Login
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={{
                            marginTop: heightToDp("2%")
                        }}
                        activeOpacity={0.7}
                        onPress={() => this.props.navigation.navigate("ForgotPassword")}
                    >
                        <Text
                            style={{
                                color: "#69abff"
                            }}
                        >
                            Forgot Password?
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={{
                            marginTop: heightToDp("1%")
                        }}
                        activeOpacity={0.7}
                        onPress={() => this.props.navigation.navigate("SignUpScreen")}
                    >
                        <Text
                            style={{
                                color: "#69abff"
                            }}
                        >
                            New User? Register
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </KeyboardAwareScrollView>
    )
}
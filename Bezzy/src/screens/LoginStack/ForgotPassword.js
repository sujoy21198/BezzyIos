import React from 'react';
import { ActivityIndicator, SafeAreaView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Header from '../../components/Header';
import { heightToDp, widthToDp } from '../../components/Responsive';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import Icon from 'react-native-vector-icons/Ionicons';
import axios from 'axios';
import DataAccess from '../../components/DataAccess'
import { Toast } from 'native-base';

export default class ForgotPassword extends React.Component {
    constructor(props){
        super(props)
        this.state={
            email:'',
            isLoading: false,
            isEmailValid: false
        }
    }

    //SET EMAIL FUNCTION
    setEmail = (text) => {
        let emailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if (!emailRegex.test(text.trim())) {
            this.setState({ isEmailValid: false, email: text.trim() })
        } else {
            this.setState({ email: text.trim(), isEmailValid: true });
        }
    }

    forgotPassword = async() => {
        let emailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if(this.state.email.trim() === "") {
            return Toast.show({
                text: "Please enter email",
                style: {
                    backgroundColor: '#777',
                }
            })
        }
        if(!emailRegex.test(this.state.email.trim())) {
            return Toast.show({
                text: "Please enter a valid email",
                style: {
                    backgroundColor: '#777',
                }
            })
        }
        this.setState({isLoading: true});
        let response = await axios.post(DataAccess.BaseUrl+DataAccess.ForgotPass,{
            email: this.state.email
        });
        this.setState({isLoading: false});
        if(response.data.resp === "true"){
            Toast.show({
                text: response.data.reg_msg,
                style: {
                    backgroundColor: '#777'
                },
                duration: 6000
            });
            this.props.navigation.navigate("OtpVerify", {userId : response.data.userID});
        } else if(response.data.resp === "false"){
            Toast.show({
                text: response.data.reg_msg,
                style: {
                    backgroundColor: '#777'
                },
                duration: 6000
            });
        } else {
            Toast.show({
                text: "Some error happened. Please retry.",
                style: {
                    backgroundColor: '#777'
                },
                duration: 6000
            });
        }
    }

    render = () => (
        <KeyboardAwareScrollView 
        keyboardShouldPersistTaps='handled'
        style={{flex: 1, backgroundColor: '#69abff'}}>
            <Header headerText={"Forgot Password"} isBackButton navigation={this.props.navigation}/>
            <View
                style={{
                    height: heightToDp("100%"),
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
                        paddingHorizontal: widthToDp("3%"),
                        marginTop: heightToDp("10%"), 
                    }}
                >
                    <Text
                        style={{
                            fontWeight: 'bold',
                            fontSize: widthToDp("4%")
                        }}
                    >
                        Enter your registered Email Id
                    </Text>
                    <View
                        style={{ 
                            alignItems: 'center',
                            borderBottomWidth: 1,
                            borderBottomColor: '#a9a9a9',
                            marginTop: heightToDp("3%"), 
                        }}
                    >
                        <TextInput
                            style={{
                                color: '#808080',
                                fontSize: widthToDp("4%"),
                                fontFamily: 'Oswald-Medium',
                                width: widthToDp("95%")
                            }}
                            placeholder="Enter Mail Id"
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
                    <TouchableOpacity
                        style={{
                            marginTop: heightToDp("3%"),
                            width: "100%",
                            backgroundColor: "#69abff",
                            padding: widthToDp("3%"),
                            borderRadius: 10
                        }}
                        activeOpacity={0.7}
                        disabled={this.state.isLoading}
                        onPress={() => this.forgotPassword()}
                    >
                        <Text
                            style={{
                                color: "#fff",
                                textAlign: "center",
                                fontWeight: 'bold'
                            }}
                        >
                            Next
                        </Text>
                        {
                            this.state.isLoading && 
                            <View
                                style={{
                                    position: 'absolute',
                                    right: widthToDp("4%"),
                                    top: heightToDp('1.5%')
                                }}
                            >
                                <ActivityIndicator
                                    size="small"
                                    color="#fff"
                                />
                            </View>
                        }
                    </TouchableOpacity>             
                </View>
            </View>
        </KeyboardAwareScrollView>
    )
}
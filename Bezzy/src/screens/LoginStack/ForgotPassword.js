import React from 'react';
import { ActivityIndicator, Platform, SafeAreaView, StatusBar, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Header from '../../components/Header';
import { heightToDp, widthToDp } from '../../components/Responsive';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import axios from 'axios';
import DataAccess from '../../components/DataAccess'
import { Form, Input, Item, Label, Toast } from 'native-base';
import RBSheet from 'react-native-raw-bottom-sheet';
import NetInfo from '@react-native-community/netinfo';
import ButtonComponent from '../../components/ButtonComponent';

export default class ForgotPassword extends React.Component {
    constructor(props){
        super(props)
        this.state={
            email:'',
            isEmailValid: false,            
            isEmailFocused: false,
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
        let isOnline = await NetInfo.fetch().then(state => state.isConnected);
        if(!isOnline) {
            return Toast.show({
                text: "Please be online to login to the app.",
                style: {
                    backgroundColor: '#777',
                }
            })
        }
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
        this.RBSheet.open();
        let response = await axios.post(DataAccess.BaseUrl+DataAccess.ForgotPass,{
            email: this.state.email
        }, DataAccess.AuthenticationHeader);
        console.log(response.config);
        if(response.data.resp === "true"){
            Toast.show({
                text: response.data.reg_msg,
                style: {
                    backgroundColor: '#777'
                },
                duration: 6000
            });
            this.RBSheet.close()
            this.props.navigation.navigate("OtpVerify", {userId : response.data.userID});
        } else if(response.data.resp === "false"){
            Toast.show({
                text: response.data.reg_msg,
                style: {
                    backgroundColor: '#777'
                },
                duration: 6000
            });
            this.RBSheet.close()
        } else {
            Toast.show({
                text: "Some error happened. Please retry.",
                style: {
                    backgroundColor: '#777'
                },
                duration: 6000
            });
            this.RBSheet.close()
        }
    }

    render = () => (
        <SafeAreaView 
        style={{flex: 1, backgroundColor: '#69abff'}}>
            <StatusBar backgroundColor="#007dfe" barStyle={Platform.OS==='android' ? "light-content" : "dark-content"} />
            <Header headerText={"Forgot Password"} isBackButton loginStack={true} navigation={this.props.navigation}/>
            <KeyboardAwareScrollView
                keyboardShouldPersistTaps='handled'
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
                            fontFamily: "ProximaNova-Black",
                            fontSize: widthToDp("4%")
                        }}
                    >
                        Enter your registered Email Id
                    </Text>
                    <Form
                        style={{
                            marginLeft: Platform.isPad ? widthToDp("-1%") : widthToDp("-3%")
                        }}
                    >
                        <Item 
                            style={{
                                alignItems: 'center',
                                borderBottomWidth: 1,
                                borderBottomColor: this.state.isEmailFocused ? '#69abff' : '#a9a9a9',
                                marginTop: heightToDp("3%"),
                                paddingBottom: Platform.isPad ? heightToDp("2%") : 0
                            }}
                            floatingLabel
                        >
                            <Label
                                style={{
                                    color: this.state.isEmailFocused ? '#69abff' : '#808080',
                                    fontSize: widthToDp(`${this.state.isEmailFocused ? 3 : 3.4}%`),
                                    marginTop: heightToDp("-0.5%"),
                                    fontFamily: "Poppins-Regular",
                                }}
                            >Enter Mail Id</Label>
                            <Input
                                style={{
                                    width: widthToDp("99%"),
                                    borderWidth: 0,
                                    fontSize: widthToDp("3.6%"),
                                    color: '#1b1b1b',
                                    fontFamily: "Poppins-Regular",
                                    paddingLeft: Platform.OS==='android' ? widthToDp("-1%") : undefined
                                }}
                                keyboardType="email-address"
                                onChangeText={(text) => this.setEmail(text)}
                                onFocus={() => this.setState({ isEmailFocused: true })}
                                returnKeyType="done"
                                onSubmitEditing={() => this.setState({ isNameFocused: false, isEmailFocused: false })}
                            />
                        </Item>
                        {
                            !this.state.isEmailValid && this.state.email !== "" &&
                            <Text
                                style={[{
                                    color: "#ff0000",
                                    marginLeft: Platform.isPad ? widthToDp("1.5%") : widthToDp("3%"),
                                }, Platform.isPad && {fontSize: widthToDp("3%")}]}
                            >Entered email address is not valid</Text>
                        }
                    </Form>
                    <ButtonComponent
                        onPressButton={this.forgotPassword}
                        buttonText={"Next"}
                    />    
                    <RBSheet
                        ref={ref => {
                            this.RBSheet = ref;
                        }}
                        height={heightToDp("6%")}
                        closeOnPressMask={false}
                        closeOnPressBack={false}
                        // openDuration={250}
                        customStyles={{
                            container: {
                                width: widthToDp("15%"),
                                position: 'absolute',
                                top: heightToDp("45%"),
                                left: widthToDp("40%"),
                                alignItems: 'center',
                                justifyContent: 'center',
                                backgroundColor: '#fff',
                                borderRadius: 10
                            },
                        }}
                    >
                        <ActivityIndicator
                            size="large"
                            color="#69abff"
                        />
                    </RBSheet>        
                </View>
            </KeyboardAwareScrollView>
        </SafeAreaView>
    )
}
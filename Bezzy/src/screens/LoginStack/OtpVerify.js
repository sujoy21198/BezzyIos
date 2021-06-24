import React from 'react';
import { ActivityIndicator, SafeAreaView, StatusBar, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Header from '../../components/Header';
import { heightToDp, widthToDp } from '../../components/Responsive';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import Icon from 'react-native-vector-icons/Ionicons';
import OTPTextView from 'react-native-otp-textinput';
import { Toast } from 'native-base';
import axios from 'axios';
import DataAccess from '../../components/DataAccess';
import RBSheet from 'react-native-raw-bottom-sheet';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';
import ButtonComponent from '../../components/ButtonComponent';

export default class OtpVerify extends React.Component {
    state = {
        otp: "",
    };    

    otpVerify = async() => {        
        let isOnline = await NetInfo.fetch().then(state => state.isConnected);
        if(!isOnline) {
            return Toast.show({
                text: "Please be online to login to the app.",
                style: {
                    backgroundColor: '#777',
                }
            })
        }
        if((this.props.route && this.props.route.params && this.props.route.params.userId)) {
            if(this.state.otp === "") {
                return Toast.show({
                    text: "Please enter OTP",
                    style: {
                        backgroundColor: '#777',
                    }
                })
            }
            this.RBSheet.open();
            let response = await axios.post(DataAccess.BaseUrl + DataAccess.SendOtp, {
                "otp_code": this.state.otp,
                "userID": this.props.route.params.userId,
                "device_token": null
            });
            if(response.data.resp === "true"){                
                this.RBSheet.close()
                if(this.props.route.params.type === "verify" || this.props.route.params.type === "loginVerify") {
                    Toast.show({
                        text: this.props.route.params.type === "verify" ? "Your account is registered & activated successfully. Now you can login to the app." : "Account is activated successfully.",
                        type: "success",
                        duration: 6000
                    });
                    if(this.props.route.params.type === "verify") {
                        this.props.navigation.navigate("SignInScreen", {userId: this.props.route.params.userId})
                    }
                    if(this.props.route.params.type === "loginVerify") {
                        AsyncStorage.setItem("userDetails", JSON.stringify(response.data.usedetails)); 
                        AsyncStorage.setItem("userId", String(response.data.id));       
                        AsyncStorage.setItem("token", String(response.data.remember_token));       
                        AsyncStorage.setItem("otpStatus", "true");   
                        this.props.navigation.navigate("HomeScreen")
                    }
                } else {
                    Toast.show({
                        text: response.data.message,
                        style: {
                            backgroundColor: '#777'
                        },
                        duration: 6000
                    });
                    this.props.navigation.navigate("ResetPassword", {userId: this.props.route.params.userId});
                }                
            } else if(response.data.resp === "false"){
                Toast.show({
                    text: response.data.message,
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
    }

    resendOtp = async () => {              
        let isOnline = await NetInfo.fetch().then(state => state.isConnected);
        if(!isOnline) {
            return Toast.show({
                text: "Please be online to login to the app.",
                style: {
                    backgroundColor: '#777',
                }
            })
        }
        this.RBSheet.open();
        let response = await axios.post(DataAccess.BaseUrl + DataAccess.resendOtp, {
            "userID": this.props.route.params.userId
        });
        this.RBSheet.close();
        if(response.data.resp === "true") {
            return Toast.show({
                text: response.data.reg_msg,
                style: {backgroundColor: '#777'},
                duration: 3000
            })
        } else {
            return Toast.show({
                text: response.data.reg_msg,
                style: {backgroundColor: '#777'},
                duration: 3000
            })
        }
    }

    render = () => (
        <SafeAreaView 
        style={{flex: 1, backgroundColor: '#69abff'}}>
            <StatusBar backgroundColor="#007dfe" barStyle="light-content" />
            <Header headerText={"OTP Verification"} isBackButton loginStack={true} navigation={this.props.navigation}/>
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
                            fontSize: widthToDp("4%"),
                            textAlign: 'center',
                            fontFamily: "ProximaNova-Black",
                        }}
                    >
                        Verification
                    </Text>
                    <Text
                        style={{
                            marginTop: heightToDp("1%"),
                            fontSize: widthToDp("4%"),
                            textAlign: 'center',
                            fontFamily: "ProximaNova-Black",
                        }}
                    >
                        Enter the 4 digit OTP
                    </Text>
                    <View
                        style={{ 
                            alignItems: 'center',
                            marginTop: heightToDp("2%"), 
                        }}
                    >
                        <OTPTextView 
                            ref={e => (this.otpInput = e)} 
                            textInputStyle={{
                                backgroundColor: "#ececec",
                                fontSize: widthToDp("3.8%"),
                                fontFamily: "Poppins-Regular",
                            }}
                            offTintColor="#ececec"
                            tintColor="#ececec"
                            handleTextChange={(text) => this.setState({otp: text})}
                            inputCount={4}
                            inputCellLength={1}
                            keyboardType="numeric"
                        />
                    </View> 
                    <ButtonComponent
                        onPressButton={this.otpVerify}
                        buttonText={"Verify OTP"}
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
                    <TouchableOpacity                    
                    activeOpacity={0.7}
                    onPress={this.resendOtp}
                    >
                        <Text
                            style={{
                                marginTop: heightToDp('2%'),
                                fontSize: widthToDp("3.8%"),
                                textAlign: "center",
                                color: "#808080",
                                fontFamily: "ProximaNova-Black",
                            }}
                        >
                            Resend OTP?
                        </Text>  
                    </TouchableOpacity>           
                </View>
            </KeyboardAwareScrollView>
        </SafeAreaView>
    )
}
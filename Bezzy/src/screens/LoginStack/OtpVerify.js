import React from 'react';
import { ActivityIndicator, SafeAreaView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Header from '../../components/Header';
import { heightToDp, widthToDp } from '../../components/Responsive';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import Icon from 'react-native-vector-icons/Ionicons';
import OTPTextView from 'react-native-otp-textinput';
import { Toast } from 'native-base';
import axios from 'axios';
import DataAccess from '../../components/DataAccess';

export default class OtpVerify extends React.Component {
    state = {
        otp: "",
        isLoading: false
    };
    

    otpVerify = async() => {
        if((this.props.route && this.props.route.params && this.props.route.params.userId)) {
            if(this.state.otp === "") {
                return Toast.show({
                    text: "Please enter OTP",
                    style: {
                        backgroundColor: '#777',
                    }
                })
            }
            this.setState({isLoading: true});
            let response = await axios.post(DataAccess.BaseUrl + DataAccess.SendOtp, {
                "otp_code": this.state.otp,
                "userID": this.props.route.params.userId,
                "device_token": null
            });
            this.setState({isLoading: false});
            if(response.data.resp === "true"){
                Toast.show({
                    text: response.data.message,
                    style: {
                        backgroundColor: '#777'
                    },
                    duration: 6000
                });
                this.props.navigation.navigate("ResetPassword");
            } else if(response.data.resp === "false"){
                Toast.show({
                    text: response.data.message,
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
    }

    render = () => (
        <KeyboardAwareScrollView 
        keyboardShouldPersistTaps='handled'
        style={{flex: 1, backgroundColor: '#69abff'}}>
            <Header headerText={"OTP Verification"} isBackButton navigation={this.props.navigation}/>
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
                            fontSize: widthToDp("4%"),
                            textAlign: 'center'
                        }}
                    >
                        Verification
                    </Text>
                    <Text
                        style={{
                            fontWeight: 'bold',
                            marginTop: heightToDp("1%"),
                            fontSize: widthToDp("4%"),
                            textAlign: 'center'
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
                                fontSize: widthToDp("3.8%")
                            }}
                            offTintColor="#ececec"
                            tintColor="#ececec"
                            handleTextChange={(text) => this.setState({otp: text})}
                            inputCount={4}
                            inputCellLength={1}
                            keyboardType="numeric"
                        />
                    </View> 
                    <TouchableOpacity
                        style={{
                            marginTop: heightToDp("1%"),
                            width: "100%",
                            backgroundColor: "#69abff",
                            padding: widthToDp("3%"),
                            borderRadius: 10
                        }}
                        activeOpacity={0.7}
                        onPress={this.otpVerify}
                    >
                        <Text
                            style={{
                                color: "#fff",
                                textAlign: "center",
                                fontWeight: 'bold'
                            }}
                        >
                            Verify OTP                        
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
                    <Text
                        style={{
                            marginTop: heightToDp('2%'),
                            fontSize: widthToDp("3.8%"),
                            textAlign: "center",
                            color: "#808080",
                            fontWeight: "bold",
                        }}
                    >
                        Resend OTP?
                    </Text>             
                </View>
            </View>
        </KeyboardAwareScrollView>
    )
}
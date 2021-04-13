import React from 'react';
import { SafeAreaView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Header from '../../components/Header';
import { heightToDp, widthToDp } from '../../components/Responsive';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import Icon from 'react-native-vector-icons/Ionicons';
import OTPTextView from 'react-native-otp-textinput';

export default class OtpVerify extends React.Component {
    state = {};
    render = () => (
        <SafeAreaView style={{flex: 1, backgroundColor: '#69abff'}}>
            <Header headerText={"OTP Verification"} isBackButton navigation={this.props.navigation}/>
            <KeyboardAwareScrollView
                keyboardShouldPersistTaps='handled'
                style={{
                    flex: 1,
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
                            handleTextChange={(text) => console.log(text)}
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
            </KeyboardAwareScrollView>
        </SafeAreaView>
    )
}
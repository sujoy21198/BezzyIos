import axios from 'axios';
import { Toast } from 'native-base';
import React from 'react';
import { ActivityIndicator, SafeAreaView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import RBSheet from 'react-native-raw-bottom-sheet';
import Icon from 'react-native-vector-icons/Ionicons';
import DataAccess from '../../components/DataAccess';
import Header from '../../components/Header';
import { heightToDp, widthToDp } from '../../components/Responsive';
import NetInfo from '@react-native-community/netinfo';
import ButtonComponent from '../../components/ButtonComponent';

export default class ResetPassword extends React.Component {
    state = {
        showNewPassword: false,
        showConfirmPassword: false,
        password: "",
        confirmPassword: ""
    };

    resetPassword = async () => {        
        let isOnline = await NetInfo.fetch().then(state => state.isConnected);
        if(!isOnline) {
            return Toast.show({
                text: "Please be online to login to the app.",
                style: {
                    backgroundColor: '#777',
                }
            })
        }      
        if(this.state.password.trim()==="") {
            return Toast.show({
                text: "Please enter a password",
                style: {
                    backgroundColor: '#777',
                }
            })
        }
        if(this.state.confirmPassword.trim()==="") {
            return Toast.show({
                text: "Please confirm the entered password",
                style: {
                    backgroundColor: '#777',
                }
            })
        }
        if(this.state.password.trim()!==this.state.confirmPassword.trim()) {
            return Toast.show({
                text: "Passwords do not match",
                style: {
                    backgroundColor: '#777',
                }
            })
        }

        this.RBSheet.open();
        let response = await axios.post(DataAccess.BaseUrl + DataAccess.ResetPassword, {
            "userID": this.props.route.params.userId,
            "password": this.state.password
        });
        if(response.data.resp === "true"){
            Toast.show({
                text: response.data.reg_msg,
                type: "success",
                duration: 6000
            });
            this.RBSheet.close()
            this.props.navigation.navigate("SignInScreen");
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
            style={{
                flex: 1,
            }}
        >
            <Header isBackButton navigation={this.props.navigation} loginStack={true} headerText="Create New Password"/>
            <View style={{height: heightToDp("2%")}}/>
            <KeyboardAwareScrollView
                style={{
                    height: heightToDp('94%'),
                    paddingHorizontal: widthToDp("3%"),
                }}
                keyboardShouldPersistTaps="handled"
            >
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
                        placeholder="Enter New Password"
                        secureTextEntry={!this.state.showNewPassword}
                        placeholderTextColor="#808080"
                        onChangeText={text => this.setState({ password: text.trim() })}
                    />
                    <Icon
                        name={this.state.showNewPassword ? "eye-off" : "eye"}
                        size={20}
                        color="#808080"
                        onPress={() => this.setState({ showNewPassword: !this.state.showNewPassword })}
                        style={{ marginTop: heightToDp("1.7%"), marginRight: widthToDp("4%") }}
                    />
                </View>
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
                        placeholder="Confirm New Password"
                        secureTextEntry={!this.state.showConfirmPassword}
                        placeholderTextColor="#808080"
                        onChangeText={text => this.setState({ confirmPassword: text.trim() })}
                    />
                    <Icon
                        name={this.state.showConfirmPassword ? "eye-off" : "eye"}
                        size={20}
                        color="#808080"
                        onPress={() => this.setState({ showConfirmPassword: !this.state.showConfirmPassword })}
                        style={{ marginTop: heightToDp("1.7%"), marginRight: widthToDp("4%") }}
                    />
                </View>
                <ButtonComponent
                    onPressButton={this.resetPassword}
                    buttonText={"Update"}
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
            </KeyboardAwareScrollView>
        </SafeAreaView>
    )
}
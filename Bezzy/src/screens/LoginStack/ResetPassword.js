import axios from 'axios';
import { Form, Input, Item, Label, Toast } from 'native-base';
import React from 'react';
import { ActivityIndicator, SafeAreaView, StatusBar, Text, TextInput, TouchableOpacity, View } from 'react-native';
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
        confirmPassword: "",
        isPasswordFocused: false,
        isConfirmPasswordFocused: false
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
            <StatusBar backgroundColor="#007dfe" barStyle="light-content" />
            <Header isBackButton navigation={this.props.navigation} loginStack={true} headerText="Create New Password"/>
            <View style={{height: heightToDp("2%")}}/>
            <KeyboardAwareScrollView
                style={{
                    height: heightToDp('94%'),
                    paddingHorizontal: widthToDp("3%"),
                }}
                keyboardShouldPersistTaps="handled"
            >
                <Form
                    style={{
                        marginLeft: widthToDp("-3%")
                    }}
                >
                    <View style={{
                        flexDirection: 'row', 
                        alignItems: 'center',
                        borderBottomWidth: 1,
                        borderBottomColor: this.state.isPasswordFocused ? '#69abff' : '#a9a9a9',
                        marginTop: heightToDp("5%"),
                        marginLeft: widthToDp("3%")
                    }}>
                        <Item 
                            style={{
                                alignItems: 'center',
                                marginTop: heightToDp("-2%"),
                                width: widthToDp("87%"),
                                marginLeft: widthToDp("0%"),
                                borderBottomWidth: 0
                            }}
                            floatingLabel
                        >
                            <Label
                                style={{
                                    color: this.state.isPasswordFocused ? '#69abff' : '#808080',
                                    fontSize: widthToDp(`${this.state.isPasswordFocused ? 3 : 3.4}%`),
                                    marginTop: heightToDp("-0.5%"),
                                }}
                            >Enter New Password</Label>
                            <Input
                                style={{
                                    borderWidth: 0,
                                    fontSize: widthToDp("3.6%"),
                                    color: '#1b1b1b',
                                    marginLeft: widthToDp("-1%"),
                                    fontFamily: 'Oswald-Medium'
                                }}
                                secureTextEntry={!this.state.showPassword}
                                onChangeText={(text) => this.setState({ password: text.trim() })}
                                onFocus={() => this.setState({ isPasswordFocused: true, isConfirmPasswordFocused: false })}
                                returnKeyType="next"
                                onSubmitEditing={() => {
                                    this.setState({ isPasswordFocused: false, isConfirmPasswordFocused: true });
                                    this.refConfirmPassword._root.focus();
                                }}
                            />
                        </Item>
                        <Icon
                            name={this.state.showPassword ? "eye-off" : "eye"}
                            size={20}
                            color="#808080"
                            onPress={() => this.setState({ showPassword: !this.state.showPassword })}
                        />
                    </View>
                    {
                        this.state.password!=="" && this.state.password.trim().length < 8 &&
                        <Text
                            style={{
                                color: "#ff0000",
                                marginLeft: widthToDp("3%"),
                            }}
                        >Password should have at least 8 characters</Text>
                    }
                    <View style={{
                        flexDirection: 'row', 
                        alignItems: 'center',
                        borderBottomWidth: 1,
                        borderBottomColor: this.state.isConfirmPasswordFocused ? '#69abff' : '#a9a9a9',
                        marginTop: heightToDp("5%"),
                        marginLeft: widthToDp("3%")
                    }}>
                        <Item
                            style={{
                                alignItems: 'center',
                                marginTop: heightToDp("-2%"),
                                width: widthToDp("87%"),
                                marginLeft: widthToDp("0%"),
                                borderBottomWidth: 0
                            }}
                            floatingLabel
                        >
                            <Label
                                style={{
                                    color: this.state.isConfirmPasswordFocused ? '#69abff' : '#808080',
                                    fontSize: widthToDp(`${this.state.isConfirmPasswordFocused ? 3 : 3.4}%`),
                                    marginTop: heightToDp("-0.5%"),
                                }}
                            >Confirm New Password</Label>
                            <Input
                                getRef={ref => this.refConfirmPassword = ref}
                                style={{
                                    borderWidth: 0,
                                    fontSize: widthToDp("3.6%"),
                                    color: '#1b1b1b',
                                    marginLeft: widthToDp("-1%"),
                                    fontFamily: 'Oswald-Medium'
                                }}
                                secureTextEntry={!this.state.showConfirmPassword}
                                onChangeText={(text) => this.setState({ confirmPassword: text.trim() })}
                                onFocus={() => this.setState({ isPasswordFocused: false, isConfirmPasswordFocused: true })}
                                returnKeyType="done"
                                onSubmitEditing={() => this.setState({ isPasswordFocused: false, isConfirmPasswordFocused: false })}
                            />
                        </Item>
                        <Icon
                            name={this.state.showConfirmPassword ? "eye-off" : "eye"}
                            size={20}
                            color="#808080"
                            onPress={() => this.setState({ showConfirmPassword: !this.state.showConfirmPassword })}
                        />
                    </View>
                    {
                        this.state.confirmPassword.trim()!=="" && this.state.password.trim()!==this.state.confirmPassword.trim() &&
                        <Text
                            style={{
                                color: "#ff0000",
                                marginLeft: widthToDp("3%"),
                            }}
                        >Passwords should match</Text>
                    }
                </Form>
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
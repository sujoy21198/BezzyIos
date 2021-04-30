import React from 'react';
import { ActivityIndicator, SafeAreaView, StatusBar, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import RBSheet from 'react-native-raw-bottom-sheet';
import Icon from 'react-native-vector-icons/Ionicons';
import ButtonComponent from '../../components/ButtonComponent';
import Header from '../../components/Header';
import { heightToDp, widthToDp } from '../../components/Responsive';
import NetInfo from '@react-native-community/netinfo';
import { Form, Input, Item, Label, Toast } from 'native-base';
import DataAccess from '../../components/DataAccess';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

export default class ChangePassword extends React.Component {
    state = {
        showOldPassword: false,
        showNewPassword: false,
        showConfirmPassword: false,
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
        isCurrentPasswordFocused: false,
        isPasswordFocused: false,
        isConfirmPasswordFocused: false
    };

    changePassword = async () => {
        let isOnline = await NetInfo.fetch().then(state => state.isConnected);
        if(!isOnline) {
            return Toast.show({
                text: "Please be online to login to the app.",
                style: {
                    backgroundColor: '#777',
                }
            })
        }      
        if(this.state.currentPassword.trim()==="") {
            return Toast.show({
                text: "Please enter your current password",
                style: {
                    backgroundColor: '#777',
                }
            })
        }
        if(this.state.newPassword.trim()==="") {
            return Toast.show({
                text: "Please enter your new password",
                style: {
                    backgroundColor: '#777',
                }
            })
        }
        if(this.state.newPassword.trim().length < 8) {
            return Toast.show({
                text: "New Password should have at least 8 characters",
                style: {
                    backgroundColor: '#777',
                }
            })
        }
        if(this.state.confirmPassword.trim()==="") {
            return Toast.show({
                text: "Please confirm your new password",
                style: {
                    backgroundColor: '#777',
                }
            })
        }
        if(this.state.newPassword.trim()!==this.state.confirmPassword.trim()) {
            return Toast.show({
                text: "New Passwords do not match",
                style: {
                    backgroundColor: '#777',
                }
            })
        }

        this.RBSheet.open();
        let userId = await AsyncStorage.getItem("userId");
        let response = await axios.post(DataAccess.BaseUrl + DataAccess.changePassword, {
            "userID": userId,
            "current_password": this.state.currentPassword.trim(),
            "password": this.state.newPassword.trim(),
        });
        this.RBSheet.close();
        this.setState({
            showNewPassword: false,
            showConfirmPassword: false,
            showOldPassword: false,
            currentPassword: '',
            newPassword: '',
            confirmPassword: '',
            isCurrentPasswordFocused: false, 
            isPasswordFocused: false, 
            isConfirmPasswordFocused: false
        });
        this.refCurrentPassword._root.clear();
        this.refNewPassword._root.clear();
        this.refConfirmPassword._root.clear();
        if(response.data.resp === "true"){
            Toast.show({
                text: response.data.reg_msg,
                type: "success",
                duration: 3000
            });
        } else if(response.data.resp === "false"){
            Toast.show({
                text: response.data.reg_msg,
                type: "danger",
                duration: 3000
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
            <StatusBar backgroundColor="#69abff" barStyle="light-content" />
            <Header isBackButton isHomeStackInnerPage backToProfile={true} navigation={this.props.navigation} headerText="Change Password"/>
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
                        borderBottomColor: this.state.isCurrentPasswordFocused ? '#69abff' : '#a9a9a9',
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
                                    color: this.state.isCurrentPasswordFocused ? '#69abff' : '#808080',
                                    fontSize: widthToDp(`${this.state.isCurrentPasswordFocused ? 3 : 3.4}%`),
                                    marginTop: heightToDp("-0.5%"),
                                }}
                            >Enter Old Password</Label>
                            <Input
                                getRef={ref => this.refCurrentPassword = ref}
                                style={{
                                    borderWidth: 0,
                                    fontSize: widthToDp("3.6%"),
                                    color: '#1b1b1b',
                                    marginLeft: widthToDp("-1%"),
                                    fontFamily: 'Oswald-Medium'
                                }}
                                secureTextEntry={!this.state.showOldPassword}
                                onChangeText={(text) => this.setState({ currentPassword: text.trim() })}
                                onFocus={() => this.setState({ isCurrentPasswordFocused: true, isPasswordFocused: false, isConfirmPasswordFocused: false })}
                                returnKeyType="next"
                                onSubmitEditing={() => {
                                    this.setState({ isCurrentPasswordFocused: false, isPasswordFocused: true, isConfirmPasswordFocused: false });
                                    this.refNewPassword._root.focus();
                                }}
                            />
                        </Item>
                        <Icon
                            name={this.state.showOldPassword ? "eye-off" : "eye"}
                            size={20}
                            color="#808080"
                            onPress={() => this.setState({ showOldPassword: !this.state.showOldPassword })}
                        />
                    </View>
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
                                getRef={ref => this.refNewPassword = ref}
                                style={{
                                    borderWidth: 0,
                                    fontSize: widthToDp("3.6%"),
                                    color: '#1b1b1b',
                                    marginLeft: widthToDp("-1%"),
                                    fontFamily: 'Oswald-Medium'
                                }}
                                secureTextEntry={!this.state.showNewPassword}
                                onChangeText={(text) => this.setState({ newPassword: text.trim() })}
                                onFocus={() => this.setState({ isCurrentPasswordFocused: false, isPasswordFocused: true, isConfirmPasswordFocused: false })}
                                returnKeyType="next"
                                onSubmitEditing={() => {
                                    this.setState({ isCurrentPasswordFocused: false, isPasswordFocused: false, isConfirmPasswordFocused: true });
                                    this.refConfirmPassword._root.focus();
                                }}
                            />
                        </Item>
                        <Icon
                            name={this.state.showNewPassword ? "eye-off" : "eye"}
                            size={20}
                            color="#808080"
                            onPress={() => this.setState({ showNewPassword: !this.state.showNewPassword })}
                        />
                    </View>
                    {
                        this.state.newPassword!=="" && this.state.newPassword.trim().length < 8 &&
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
                                onFocus={() => this.setState({ isCurrentPasswordFocused: false, isPasswordFocused: false, isConfirmPasswordFocused: true })}
                                returnKeyType="done"
                                onSubmitEditing={() => this.setState({ isCurrentPasswordFocused: false, isPasswordFocused: false, isConfirmPasswordFocused: false })}
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
                        this.state.confirmPassword.trim()!=="" && this.state.newPassword.trim()!==this.state.confirmPassword.trim() &&
                        <Text
                            style={{
                                color: "#ff0000",
                                marginLeft: widthToDp("3%"),
                            }}
                        >Passwords should match</Text>
                    }
                </Form>

                <ButtonComponent
                    onPressButton={this.changePassword}
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
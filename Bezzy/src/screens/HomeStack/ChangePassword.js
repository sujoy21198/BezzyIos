import React from 'react';
import { ActivityIndicator, SafeAreaView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import RBSheet from 'react-native-raw-bottom-sheet';
import Icon from 'react-native-vector-icons/Ionicons';
import ButtonComponent from '../../components/ButtonComponent';
import Header from '../../components/Header';
import { heightToDp, widthToDp } from '../../components/Responsive';
import NetInfo from '@react-native-community/netinfo';
import { Toast } from 'native-base';
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
        confirmPassword: ''
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
            confirmPassword: ''
        });
        this.refCurrentPassword.clear();
        this.refNewPassword.clear();
        this.refConfirmPassword.clear();
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
            <Header isBackButton isHomeStackInnerPage backToProfile={true} navigation={this.props.navigation} headerText="Change Password"/>
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
                        ref={ref => this.refCurrentPassword = ref}
                        placeholder="Enter Old Password"
                        secureTextEntry={!this.state.showOldPassword}
                        placeholderTextColor="#808080"
                        onChangeText={text => this.setState({ currentPassword: text })}
                    />
                    <Icon
                        name={this.state.showOldPassword ? "eye-off" : "eye"}
                        size={20}
                        color="#808080"
                        onPress={() => this.setState({ showOldPassword: !this.state.showOldPassword })}
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
                        ref={ref => this.refNewPassword = ref}
                        placeholder="Enter New Password"
                        secureTextEntry={!this.state.showNewPassword}
                        placeholderTextColor="#808080"
                        onChangeText={text => this.setState({ newPassword: text })}
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
                        ref={ref => this.refConfirmPassword = ref}
                        placeholder="Confirm New Password"
                        secureTextEntry={!this.state.showConfirmPassword}
                        placeholderTextColor="#808080"
                        onChangeText={text => this.setState({ confirmPassword: text })}
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
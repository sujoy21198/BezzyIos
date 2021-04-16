import React from 'react';
import { SafeAreaView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Icon from 'react-native-vector-icons/Ionicons';
import Header from '../../components/Header';
import { heightToDp, widthToDp } from '../../components/Responsive';

export default class ChangePassword extends React.Component {
    state = {
        showOldPassword: false,
        showNewPassword: false,
        showConfirmPassword: false
    };
    render = () => (
        <SafeAreaView
            style={{
                flex: 1,
            }}
        >
            <Header isBackButton isHomeStackInnerPage navigation={this.props.navigation} headerText="Create New Password"/>
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
                        placeholder="Enter Old Password"
                        secureTextEntry={!this.state.showOldPassword}
                        placeholderTextColor="#808080"
                        onChangeText={text => this.setState({ password: text })}
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
                        placeholder="Enter New Password"
                        secureTextEntry={!this.state.showNewPassword}
                        placeholderTextColor="#808080"
                        onChangeText={text => this.setState({ password: text })}
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
                        onChangeText={text => this.setState({ password: text })}
                    />
                    <Icon
                        name={this.state.showConfirmPassword ? "eye-off" : "eye"}
                        size={20}
                        color="#808080"
                        onPress={() => this.setState({ showConfirmPassword: !this.state.showConfirmPassword })}
                        style={{ marginTop: heightToDp("1.7%"), marginRight: widthToDp("4%") }}
                    />
                </View>

                <TouchableOpacity
                    style={{
                        marginTop: heightToDp("4%"),
                        backgroundColor: "#69abff",
                        padding: widthToDp("3%"),
                        borderRadius: 10
                    }}
                    activeOpacity={0.7}
                    // onPress={() => this.signUp()}
                >
                    <Text
                        style={{
                            color: "#fff",
                            textAlign: "center",
                            fontWeight: 'bold'
                        }}
                    >
                        Update
                    </Text>
                </TouchableOpacity>
            </KeyboardAwareScrollView>
        </SafeAreaView>
    )
}
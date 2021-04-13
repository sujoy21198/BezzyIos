import React from 'react';
import { SafeAreaView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Header from '../../components/Header';
import { heightToDp, widthToDp } from '../../components/Responsive';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import Icon from 'react-native-vector-icons/Ionicons';

export default class ForgotPassword extends React.Component {
    state = {};
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
                            onChangeText={text => this.setState({email: text})}
                        />
                    </View> 
                    <TouchableOpacity
                        style={{
                            marginTop: heightToDp("3%"),
                            width: "100%",
                            backgroundColor: "#69abff",
                            padding: widthToDp("3%"),
                            borderRadius: 10
                        }}
                        activeOpacity={0.7}
                        onPress={() => this.props.navigation.navigate("OtpVerify")}
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
                    </TouchableOpacity>             
                </View>
            </View>
        </KeyboardAwareScrollView>
    )
}
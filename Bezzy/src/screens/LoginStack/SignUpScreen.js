import React from 'react';
import { Image, SafeAreaView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Header from '../../components/Header';
import { heightToDp, widthToDp } from '../../components/Responsive';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import Icon from 'react-native-vector-icons/Ionicons';
import {Picker} from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';

export default class SignUpScreen extends React.Component {
    state = {
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        gender: "",
        dob: ""
    };
    
    setEmail = text => {
        let emailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if(!emailRegex.test(text.trim())) {
            this.setState({isEmailValid: false, email: text.trim()})
        } else {
            this.setState({email: text.trim(), isEmailValid: true});
        }
    }

    isEligableForRegister = async () => {
        let emailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if(this.state.name === "") {
            return false;
        }
        if(this.state.email === "") {
            return false;
        }
        if(!emailRegex.test(this.state.email.trim())) {
            return false;
        } 
        if(this.state.password === "") {
            return false;
        }
        if(this.state.confirmPassword === "") {
            return false;
        }
        if(this.state.password === this.state.confirmPassword) {
            return false;
        }
        if(this.state.dob === "") {
            return false;
        }
        return true;
    }

    setDate = date => {
        if(date.type === "set") {
            let dateString = String(date.nativeEvent.timestamp);
            let monthArray = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
            let day = dateString.split(" ")[2];
            let month = monthArray.indexOf(dateString.split(" ")[1]) + 1;
            let year = dateString.split(" ")[3];
            this.setState({dob: day + "-" + month + "-" + year, showDatePicker: false});
        } else {
            this.setState({dob: this.state.dob, showDatePicker: false})
        }
    }

    render = () => (
        <SafeAreaView style={{flex: 1, backgroundColor: '#69abff'}}>
            <Header headerText={"Go Login"} isBackButton navigation={this.props.navigation}/>
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
                        paddingVertical: heightToDp("2%"),
                        paddingHorizontal: widthToDp("3%")
                    }}
                >
                    <Text
                        style={{
                            fontWeight: 'bold',
                            fontSize: widthToDp("4.5%")
                        }}
                    >
                        Register
                    </Text>
                    <TouchableOpacity
                        style={{                            
                            marginTop: heightToDp("2%"),
                        }}
                        activeOpacity={0.7}
                    >
                        <Image
                            source={require("../../../assets/sign_up.png")}
                            resizeMode="contain"
                            style={{
                                height: heightToDp("7%"),
                                width: widthToDp("20%"),
                                alignSelf: "center"
                            }}
                        />
                    </TouchableOpacity>
                    <View
                        style={{ 
                            alignItems: 'center',
                            borderBottomWidth: 1,
                            borderBottomColor: '#a9a9a9',
                            marginTop: heightToDp("2%"), 
                        }}
                    >
                        <TextInput
                            style={{
                                color: '#808080',
                                fontSize: widthToDp("3.3%"),
                                fontFamily: 'Oswald-Medium',
                                width: widthToDp("95%")
                            }}
                            placeholder="Name"
                            placeholderTextColor="#808080"
                            onChangeText={text => this.setState({name: text})}
                        />
                    </View> 
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
                                fontSize: widthToDp("3.3%"),
                                fontFamily: 'Oswald-Medium',
                                width: widthToDp("95%")
                            }}
                            placeholder="Email Address"
                            keyboardType="email-address"
                            placeholderTextColor="#808080"
                            onChangeText={this.setEmail}
                        />
                    </View> 
                    {
                        !this.state.isEmailValid && this.state.email!=="" &&
                        <Text
                            style={{
                                color: "#ff0000"
                            }}
                        >Entered email address is not valid</Text>
                    }
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
                            placeholder="Password"
                            secureTextEntry={!this.state.showPassword}
                            placeholderTextColor="#808080"
                            onChangeText={text => this.setState({password: text})}
                        />
                        <Icon
                            name={this.state.showPassword ? "eye-off" : "eye"}
                            size={20}
                            color="#808080"
                            onPress={() => this.setState({showPassword: !this.state.showPassword})}
                            style={{marginTop: heightToDp("1.7%"), marginRight: widthToDp("4%")}}
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
                            placeholder="Confirm Password"
                            secureTextEntry={!this.state.showConfirmPassword}
                            placeholderTextColor="#808080"
                            onChangeText={text => this.setState({confirmPassword: text})}
                        />
                        <Icon
                            name={this.state.showConfirmPassword ? "eye-off" : "eye"}
                            size={20}
                            color="#808080"
                            onPress={() => this.setState({showConfirmPassword: !this.state.showConfirmPassword})}
                            style={{marginTop: heightToDp("1.7%"), marginRight: widthToDp("4%")}}
                        />
                    </View> 
                    <View
                        style={{
                            marginTop: heightToDp("3%"), 
                            borderBottomWidth: 1,
                            borderBottomColor: '#a9a9a9', 
                            backgroundColor: "#fff",
                            alignItems: "flex-start"
                        }}
                    >
                        <Picker
                            style={{                                 
                                width: widthToDp("95%"), 
                            }}
                            mode="dropdown"
                            onValueChange={(item, index) => this.setState({gender: item})}
                        >
                            <Picker.Item label="Select Your Gender" value="-1" color="#808080" style={{fontSize: widthToDp("3.5%")}}/>
                            <Picker.Item label="Male" value="0" color="#808080" />
                            <Picker.Item label="Female" value="1" color="#808080" />
                        </Picker> 
                    </View>   
                    <TouchableOpacity
                        style={{
                            marginTop: heightToDp("4%"), 
                            borderBottomWidth: 1,
                            borderBottomColor: '#a9a9a9', 
                            backgroundColor: "#fff",
                            alignItems: "flex-start"
                        }}
                        activeOpacity={0.7}
                        onPress={() => this.setState({showDatePicker: true})}
                    >
                        <Text
                            style={{
                            color: '#808080',
                            fontSize: widthToDp("3.3%"),
                            paddingBottom: heightToDp("2%"),
                            fontFamily: 'Oswald-Medium',
                            width: widthToDp("87%")
                        }}
                        >
                            {this.state.dob!=="" ? this.state.dob : 'Date of Birth'}
                        </Text>
                    </TouchableOpacity>
                    {
                        this.state.showDatePicker && 
                        <DateTimePicker
                            testID="dateTimePicker"
                            value={new Date()}
                            mode="date"
                            is24Hour={true}
                            // display="default"
                            onChange={this.setDate}
                        />
                    }
                    <View
                        style={{ 
                            flexDirection: 'row',
                            borderBottomWidth: 0,
                            marginTop: heightToDp("3%"), 
                        }}
                    >
                        <Icon
                            name={this.state.checkTerms ? "checkbox" : "square-outline"}
                            color="#808080"
                            size={20}
                            onPress={() => this.setState({checkTerms: !this.state.checkTerms})}
                        />
                        <Text
                            style={{
                                marginLeft: widthToDp("1%")
                            }}
                        >
                            I accept the <Text style={{color: "#69abff"}}>Terms & Conditions</Text>
                        </Text>
                    </View>
                    {
                        this.isEligableForRegister() && 
                        <TouchableOpacity
                            style={{
                                marginTop: heightToDp("4%"),
                                width: "100%",
                                backgroundColor: "#69abff",
                                padding: widthToDp("3%"),
                                borderRadius: 10
                            }}
                            activeOpacity={0.7}
                            // onPress={this.register}
                        >
                            <Text
                                style={{
                                    color: "#fff",
                                    textAlign: "center",
                                    fontWeight: 'bold'
                                }}
                            >
                                Register
                            </Text>
                        </TouchableOpacity> 
                    }             
                </View>
            </KeyboardAwareScrollView>
        </SafeAreaView>
    )
}
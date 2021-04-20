import React from 'react';
import { Image, SafeAreaView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Header from '../../components/Header';
import { heightToDp, widthToDp } from '../../components/Responsive';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DataAccess from '../../components/DataAccess';
import axios from 'axios';

export default class EditProfileScreen extends React.Component {
    state = {
        name: "",
        email: "",
        isEmailValid: false,
        showDatePicker: false,
        image: "",
        name: "",
        email: "",
        dob: "",
        gender: "",
        bio: ""
    }

    //SET EMAIL FUNCTION
    setEmail = (text) => {
        let emailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if (!emailRegex.test(text.trim())) {
            this.setState({ isEmailValid: false, email: text.trim() })
        } else {
            this.setState({ email: text.trim(), isEmailValid: true });
        }
    }

    //SET THE DATE FUNCTION
    setDate = (date) => {
        if (date.type === "set") {
            let dateString = String(date.nativeEvent.timestamp);
            let monthArray = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
            let day = dateString.split(" ")[2];
            let month = monthArray.indexOf(dateString.split(" ")[1]) + 1;
            let year = dateString.split(" ")[3];
            this.setState({ dob: day + "-" + month + "-" + year, showDatePicker: false });
        } else {
            this.setState({ dob: this.state.dob, showDatePicker: false })
        }
    }

    componentDidMount() {
        this.getProfileData()
    }

    getProfileData = async () => {
        var image, name, email, dob, gender, bio;
        let userId = await AsyncStorage.getItem("userId");
        await axios.post(DataAccess.BaseUrl + DataAccess.getProfileDetails, {
            "profile_id" : userId
        }).then(res => {
            console.warn(res.data.usedetails);
            image = res.data.usedetails.profile_pic;
            name = res.data.usedetails.get_name;
            email = res.data.usedetails.get_email;
            gender = res.data.usedetails.get_gender;
            dob = res.data.usedetails.get_dateofbirth;
            bio = res.data.usedetails.bio || "";
            console.warn(res.data);
        }).catch(err => console.log(err))

        this.setState({image, name, email, gender, dob, bio})
        this.setState({isLoading: false})
        this.RBSheet.close();
    }

    render = () => (
        <SafeAreaView style={{flex: 1}}>
            <Header isBackButton isHomeStackInnerPage headerText={"Edit Profile"} navigation={this.props.navigation}/>
            <TouchableOpacity
                style={{
                    marginTop: heightToDp("5%")
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
                    marginTop: heightToDp("6%"),
                    marginHorizontal: widthToDp("3.5%")
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
                    onChangeText={text => this.setState({ name: text })}
                />
            </View>
            <View
                style={{
                    alignItems: 'center',
                    borderBottomWidth: 1,
                    borderBottomColor: '#a9a9a9',
                    marginTop: heightToDp("3%"),
                    marginHorizontal: widthToDp("3.5%")
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
                    onChangeText={(text) => this.setEmail(text)}
                />
            </View>
            {
                !this.state.isEmailValid && this.state.email !== "" &&
                <Text
                    style={{
                        color: "#ff0000",
                        marginHorizontal: widthToDp("3%")
                    }}
                >Entered email address is not valid</Text>
            }
            <TouchableOpacity
                style={{
                    marginTop: heightToDp("4%"),
                    borderBottomWidth: 1,
                    borderBottomColor: '#a9a9a9',
                    alignItems: "flex-start",
                    marginHorizontal: widthToDp("3%")
                }}
                activeOpacity={0.7}
                onPress={() => this.setState({ showDatePicker: true })}
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
                    {this.state.dob !== "" ? this.state.dob : 'Date of Birth'}
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
                    marginTop: heightToDp("3%"),
                    borderBottomWidth: 1,
                    borderBottomColor: '#a9a9a9',
                    alignItems: "flex-start",
                    marginHorizontal: widthToDp("3%")
                }}
            >
                <Picker
                    style={{
                        width: widthToDp("95%"),
                    }}
                    mode="dropdown"
                    onValueChange={(item, index) => this.setState({ gender: item })}
                >
                    <Picker.Item label="Select Your Gender" value="-1" color="#808080" style={{ fontSize: widthToDp("3.5%") }} />
                    <Picker.Item label="Male" value="0" color="#808080" />
                    <Picker.Item label="Female" value="1" color="#808080" />
                </Picker>
            </View>
            
            <View
                style={{
                    alignItems: 'center',
                    borderBottomWidth: 1,
                    borderBottomColor: '#a9a9a9',
                    marginTop: heightToDp("3%"),
                    marginHorizontal: widthToDp("3.5%")
                }}
            >
                <TextInput
                    style={{
                        color: '#808080',
                        fontSize: widthToDp("3.3%"),
                        fontFamily: 'Oswald-Medium',
                        width: widthToDp("95%")
                    }}
                    placeholder="Bio"
                    placeholderTextColor="#808080"
                    onChangeText={text => this.setState({ bio: text })}
                />
            </View>

            <TouchableOpacity
                style={{
                    marginTop: heightToDp("4%"),
                    width: widthToDp("94.5%"),
                    backgroundColor: "#69abff",
                    padding: widthToDp("3%"),
                    marginHorizontal: widthToDp("3%"),
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
        </SafeAreaView>
    )
}
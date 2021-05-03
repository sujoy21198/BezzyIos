import React from 'react';
import { ActivityIndicator, Alert, Image, SafeAreaView, StatusBar, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Header from '../../components/Header';
import { heightToDp, widthToDp } from '../../components/Responsive';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import Icon from 'react-native-vector-icons/Ionicons';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Toast, ActionSheet, Input, Form, Item, Label } from 'native-base';
import ImagePicker from 'react-native-image-crop-picker';
import { check, PERMISSIONS, RESULTS, request, checkMultiple, requestMultiple } from 'react-native-permissions'
import axios from 'axios';
import DataAccess from '../../components/DataAccess';
import RBSheet from 'react-native-raw-bottom-sheet';
import NetInfo from '@react-native-community/netinfo'
import ButtonComponent from '../../components/ButtonComponent';

export default class SignUpScreen extends React.Component {
    state = {
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        gender: "",
        dob: "",
        checkTerms: false,
        imagePath: '',
        isImagePathPresent: false,
        isNameFocused: false,
        isEmailFocused: false,
        isPasswordFocused: false,
        isConfirmPasswordFocused: false
    };

    //SET EMAIL FUNCTION
    setEmail = (text) => {
        let emailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if (!emailRegex.test(text.trim())) {
            this.setState({ isEmailValid: false, email: text.trim() })
        } else {
            this.setState({ email: text.trim(), isEmailValid: true });
        }
    }

    componentDidMount() {
        this.askPermission();
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

    //IMAGE UPLOAD FUNCTION
    uploadPicture = async () => {
        const buttons = ['Camera', 'Photo Library', 'Cancel'];
        ActionSheet.show(
            {
                options: buttons,
                cancelButtonIndex: 2,
            },
            buttonIndex => {
                switch (buttonIndex) {
                    case 0:
                        this.takePhotoFromCamera();
                        break;
                    case 1:
                        this.choosePhotosFromGallery();
                        break;
                    default:
                        break;
                }
            },
        );
    }

    //OPEN CAMERA TO SELECT IMAGE FUNCTION
    takePhotoFromCamera = async () => {
        ImagePicker.openCamera({
            width: 300,
            height: 400,
            cropping: true,
        })
            .then(image => {
                //let imageData = [image];
                // if (imageData.length > 0) {
                //     this.navigateToViewPhotos(imageData);
                // }
                this.state.imagePath = image.path
                this.setState({ isImagePathPresent: true })
                console.log(image.path)
            })
            .catch(err => {
                console.log('Error fetching image from Camera roll', err);
            });
    }

    //OPEN GALLERY TO SELECT IMAGE
    choosePhotosFromGallery = async () => {

        ImagePicker.openPicker({
            width: 300,
            height: 200,
            cropping: true,
        })
            .then(images => {
                this.state.imagePath = images.path
                this.setState({ isImagePathPresent: true })
                console.log(images)
                // if (images.length > 0) {
                //     this.navigateToViewPhotos(images);
                // }
            })
            .catch(err => {
                console.log(' Error fetching images from gallery ', err);
            });
    }

    //GRANT PERMISSION FUNCTION
    askPermission = async () => {
        requestMultiple([PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE, PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE, PERMISSIONS.ANDROID.READ_PHONE_STATE, PERMISSIONS.ANDROID.CAMERA, PERMISSIONS.IOS.READ_EXTERNAL_STORAGE, PERMISSIONS.IOS.WRITE_EXTERNAL_STORAGE, PERMISSIONS.IOS.READ_PHONE_STATE, PERMISSIONS.IOS.CAMERA]).then((result) => {
            console.log(result)
            return;
        }).catch((error) => {
            console.log(error)
        })
    }

    // SIGNUP FUNCTION
    signUp = async () => {        
        let isOnline = await NetInfo.fetch().then(state => state.isConnected);
        if(!isOnline) {
            return Toast.show({
                text: "Please be online to login to the app.",
                style: {
                    backgroundColor: '#777',
                }
            })
        }
        let emailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if(this.state.imagePath==="") {
            return Toast.show({
                text: "Please choose a profile picture",
                style: {
                    backgroundColor: '#777',
                }
            })
        }
        if(this.state.name.trim()==="") {
            return Toast.show({
                text: "Please enter name",
                style: {
                    backgroundColor: '#777',
                }
            })
        }
        if(this.state.email.trim()==="") {
            return Toast.show({
                text: "Please enter email",
                style: {
                    backgroundColor: '#777',
                }
            })
        }
        if(!emailRegex.test(this.state.email.trim())) {
            return Toast.show({
                text: "Please enter a valid email",
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
        if(this.state.password.trim().length < 8) {
            return Toast.show({
                text: "Password should have at least 8 characters",
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
        if(this.state.gender === "") {
            return Toast.show({
                text: "Please select your gender",
                style: {
                    backgroundColor: '#777',
                }
            })
        }
        if(this.state.dob === "") {
            return Toast.show({
                text: "Please select your date of birth",
                style: {
                    backgroundColor: '#777',
                }
            })
        }
        this.RBSheet.open();
        var formData = new FormData()
        formData.append('username', null)
        formData.append('fullname', this.state.name.trim())
        formData.append('email', this.state.email.trim())
        formData.append('password', this.state.password.trim())
        formData.append('dob', this.state.dob)
        formData.append('gender', this.state.gender)
        formData.append('user_profile_iamge',{
            uri: this.state.imagePath,
            name: 'userProfile.jpg',
            type: 'image/jpg'
        })
        console.log(formData._parts,"formdata")

        let response = await axios.post(DataAccess.BaseUrl+DataAccess.Registration,formData);
        if(response.data.resp === "true") {
            Toast.show({
                text: response.data.reg_msg,
                style: {
                    backgroundColor: '#777'
                },
                duration: 6000
            });
            this.RBSheet.close()
            this.props.navigation.navigate("OtpVerify", {userId: response.data.log_userID, type: "verify"})
        } else if(response.data.resp === "false") {
            Toast.show({
                text: response.data.reg_msg,
                style: {
                    backgroundColor: '#777'
                },
                duration: 6000
            });
            this.RBSheet.close()
        } else {
            if(response.data.resp == true) {
                Toast.show({
                    text: "Some error happened. Please retry.",
                    style: {
                        backgroundColor: '#777'
                    },
                    duration: 6000
                });
            }
            this.RBSheet.close()
        }
    }

    render = () => (
        <SafeAreaView
            style={{ flex: 1, backgroundColor: '#69abff' }}
        >
            <StatusBar backgroundColor="#007dfe" barStyle="light-content" />
            <Header headerText={"Go Login"} isBackButton loginStack={true} navigation={this.props.navigation} />
            <KeyboardAwareScrollView                
                keyboardShouldPersistTaps='handled'
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
                        activeOpacity={0.7}                        
                        style={{
                            marginTop: heightToDp("2%"),
                        }}
                        onPress={() => this.uploadPicture()}
                    >
                        {
                            this.state.isImagePathPresent ?
                                <Image
                                    source={{ uri: this.state.imagePath }}
                                    style={{
                                        height: heightToDp("9%"),
                                        width: widthToDp("18%"),
                                        borderRadius: 8,
                                        alignSelf: "center"
                                    }}
                                /> :
                                <Image
                                    source={require("../../../assets/sign_up.png")}
                                    resizeMode="contain"
                                    style={{
                                        height: heightToDp("7%"),
                                        width: widthToDp("20%"),
                                        alignSelf: "center"
                                    }}
                                />
                        }

                    </TouchableOpacity>
                    <Form
                        style={{
                            marginLeft: widthToDp("-3%")
                        }}
                    >
                        <Item 
                            style={{
                                alignItems: 'center',
                                borderBottomWidth: 1,
                                borderBottomColor: this.state.isNameFocused ? '#69abff' : '#a9a9a9',
                                marginTop: heightToDp("2%"),
                            }}
                            floatingLabel
                        >
                            <Label
                                style={{
                                    color: this.state.isNameFocused ? '#69abff' : '#808080',
                                    fontSize: widthToDp(`${this.state.isNameFocused ? 3 : 3.4}%`),
                                    marginTop: heightToDp("-0.5%"),
                                }}
                            >Name</Label>
                            <Input
                                style={{
                                    width: widthToDp("99%"),
                                    borderWidth: 0,
                                    fontSize: widthToDp("3.6%"),
                                    color: '#1b1b1b',
                                    marginLeft: widthToDp("-1%"),
                                    fontFamily: 'Oswald-Medium'
                                }}
                                onChangeText={(text) => this.setState({ name: text.trim() })}
                                onFocus={() => this.setState({ isNameFocused: true, isEmailFocused: false, isPasswordFocused: false, isConfirmPasswordFocused: false })}
                                returnKeyType="next"
                                onSubmitEditing={() => {
                                    this.setState({ isNameFocused: false, isEmailFocused: true, isPasswordFocused: false, isConfirmPasswordFocused: false })
                                    this.refEmail._root.focus()
                                }}
                            />
                        </Item>
                        <Item 
                            style={{
                                alignItems: 'center',
                                borderBottomWidth: 1,
                                borderBottomColor: this.state.isEmailFocused ? '#69abff' : '#a9a9a9',
                                marginTop: heightToDp("3%"),
                            }}
                            floatingLabel
                        >
                            <Label
                                style={{
                                    color: this.state.isEmailFocused ? '#69abff' : '#808080',
                                    fontSize: widthToDp(`${this.state.isEmailFocused ? 3 : 3.4}%`),
                                    marginTop: heightToDp("-0.5%"),
                                }}
                            >Email Address</Label>
                            <Input
                                getRef={ref => this.refEmail = ref}
                                style={{
                                    width: widthToDp("99%"),
                                    borderWidth: 0,
                                    fontSize: widthToDp("3.6%"),
                                    color: '#1b1b1b',
                                    marginLeft: widthToDp("-1%"),
                                    fontFamily: 'Oswald-Medium'
                                }}
                                keyboardType="email-address"
                                onChangeText={(text) => this.setEmail(text)}
                                onFocus={() => this.setState({ isEmailFocused: true, isNameFocused: false, isPasswordFocused: false, isConfirmPasswordFocused: false })}
                                returnKeyType="next"
                                onSubmitEditing={() => {
                                    this.setState({ isNameFocused: false, isEmailFocused: false, isPasswordFocused: true, isConfirmPasswordFocused: false });
                                    this.refPassword._root.focus();
                                }}
                            />
                        </Item>
                        {
                            !this.state.isEmailValid && this.state.email !== "" &&
                            <Text
                                style={{
                                    color: "#ff0000",
                                    marginLeft: widthToDp("3%"),
                                }}
                            >Entered email address is not valid</Text>
                        }
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
                                >Password</Label>
                                <Input
                                    getRef={ref => this.refPassword = ref}
                                    style={{
                                        borderWidth: 0,
                                        fontSize: widthToDp("3.6%"),
                                        color: '#1b1b1b',
                                        marginLeft: widthToDp("-1%"),
                                        fontFamily: 'Oswald-Medium'
                                    }}
                                    secureTextEntry={!this.state.showPassword}
                                    onChangeText={(text) => this.setState({ password: text.trim() })}
                                    onFocus={() => this.setState({ isNameFocused: false, isEmailFocused: false, isPasswordFocused: true, isConfirmPasswordFocused: false })}
                                    returnKeyType="next"
                                    onSubmitEditing={() => {
                                        this.setState({ isNameFocused: false, isEmailFocused: false, isPasswordFocused: false, isConfirmPasswordFocused: true });
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
                                >Confirm Password</Label>
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
                                    onFocus={() => this.setState({ isNameFocused: false, isEmailFocused: false, isPasswordFocused: false, isConfirmPasswordFocused: true })}
                                    returnKeyType="done"
                                    onSubmitEditing={() => this.setState({ isNameFocused: false, isEmailFocused: false, isPasswordFocused: false, isConfirmPasswordFocused: false })}
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
                    {
                        this.state.dob !== "" &&
                        <Text
                            style={{                                
                                color: '#808080',
                                fontSize: widthToDp("3.0%"),
                                marginTop: heightToDp("3%"),
                                marginBottom: heightToDp("0.5%")
                            }}
                        >Date of Birth</Text>
                    }                 
                    <TouchableOpacity
                        style={{
                            marginTop: heightToDp( `${this.state.dob !== "" ? 0 : 5}%`),
                            borderBottomWidth: 1,
                            borderBottomColor: '#a9a9a9',
                            backgroundColor: "#fff",
                            alignItems: "flex-start"
                        }}
                        activeOpacity={0.7}
                        onPress={() => this.setState({ showDatePicker: true, isNameFocused: false, isEmailFocused: false, isPasswordFocused: false, isConfirmPasswordFocused: false })}
                    >
                        <Text
                            style={{
                                color: this.state.dob === ""  ? '#808080' : "#1b1b1b",
                                fontSize: widthToDp("3.4%"),
                                paddingBottom: heightToDp("1%"),
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
                            backgroundColor: "#fff",
                            alignItems: "flex-start"
                        }}
                    >
                        <Picker
                            style={{
                                width: widthToDp("95%"),
                            }}
                            mode="dropdown"
                            onValueChange={(item, index) => this.setState({ gender: item, isNameFocused: false, isEmailFocused: false, isPasswordFocused: false, isConfirmPasswordFocused: false })}
                        >
                            <Picker.Item label="Select Your Gender" value="-1" color="#808080" style={{ fontSize: widthToDp("3.5%") }} />
                            <Picker.Item label="Male" value="0" color="#1b1b1b" />
                            <Picker.Item label="Female" value="1" color="#1b1b1b" />
                        </Picker>
                    </View>
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
                            onPress={() => this.setState({ checkTerms: !this.state.checkTerms })}
                        />
                        <Text
                            style={{
                                marginLeft: widthToDp("1%")
                            }}
                        >
                            I accept the <Text style={{ color: "#69abff" }} onPress={() => this.props.navigation.navigate("Terms")}>Terms & Conditions</Text>
                        </Text>
                    </View>
                    {
                        this.state.checkTerms &&
                        <>
                            <ButtonComponent
                                onPressButton={this.signUp}
                                buttonText={"Register"}
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
                        </> 
                    }
                </View>
            </KeyboardAwareScrollView>
        </SafeAreaView>
    )
}
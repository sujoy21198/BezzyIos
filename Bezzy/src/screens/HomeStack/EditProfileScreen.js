import React from 'react';
import { ActivityIndicator, Image, SafeAreaView, StatusBar, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Header from '../../components/Header';
import { heightToDp, widthToDp } from '../../components/Responsive';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DataAccess from '../../components/DataAccess';
import axios from 'axios';
import RBSheet from 'react-native-raw-bottom-sheet';
import RBSheet1 from 'react-native-raw-bottom-sheet';
import { ActionSheet, Toast } from 'native-base';
import NetInfo from '@react-native-community/netinfo';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { checkMultiple, PERMISSIONS, requestMultiple, RESULTS } from 'react-native-permissions';
import ImagePicker from 'react-native-image-crop-picker';
import ImgToBase64 from 'react-native-image-base64';
import ButtonComponent from '../../components/ButtonComponent';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import PushNotificationController from '../../components/PushNotificationController';

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
        bio: "",
        base64:''
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
        let dateObject = new Date(date);
        let onlyDate = dateObject.getDate();
        let onlyMonth = dateObject.getMonth();
        let onlyYear = dateObject.getFullYear();
        this.setState({
            dob: onlyDate + "-" + onlyMonth + "-" + onlyYear, 
            showDatePicker: false
        })
        // if (date.type === "set") {
        //     let dateString = String(date.nativeEvent.timestamp);
        //     let monthArray = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        //     let day = dateString.split(" ")[2];
        //     let month = monthArray.indexOf(dateString.split(" ")[1]) + 1;
        //     let year = dateString.split(" ")[3];
        //     this.setState({ dob: day + "-" + month + "-" + year, showDatePicker: false });
        // } else {
        //     this.setState({ dob: this.state.dob, showDatePicker: false })
        // }
    }

    componentDidMount() {
        this.getProfileData()
    }

    getProfileData = async () => {
        this.RBSheet.open();
        var image, name, email, dob, gender, bio, userDob = new Date();
        let userId = await AsyncStorage.getItem("userId");
        await axios.post(DataAccess.BaseUrl + DataAccess.getProfileDetails, {
            "profile_id" : userId
        }).then(res => {
            image = res.data.usedetails.profile_pic;
            name = res.data.usedetails.get_name;
            email = res.data.usedetails.get_email;
            this.setEmail(email);
            gender = res.data.usedetails.get_gender;
            dob = res.data.usedetails.get_dateofbirth;
            bio = res.data.usedetails.bio || "";
            userDob.setDate(Number(dob.split("-")[0]));
            userDob.setMonth(Number(dob.split("-")[1]));
            userDob.setFullYear(Number(dob.split("-")[2]));
        }).catch(err => console.log(err))
        this.setState({image, name, email, gender, dob, bio, userDob});
        this.RBSheet.close();
    }

    updateProfile = async () => {
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
        if(this.state.image==="") {
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
        if(this.state.bio.trim() === "") {
            return Toast.show({
                text: "Please write few of your bio",
                style: {
                    backgroundColor: '#777',
                }
            })
        }
        this.RBSheet.open();
        let userId = await AsyncStorage.getItem("userId");

        let response = await axios.post(DataAccess.BaseUrl+DataAccess.updateProfile, {
            "userID" : userId,
            "username" : null,
            "fullname" : this.state.name.trim(),
            "email" : this.state.email.trim(),
            "dob" : this.state.dob, 
            "gender" : this.state.gender, 
            "user_bio" : this.state.bio.trim()
        });
        if(response.data.resp === "success") {           

            if(this.state.image.startsWith("http://")) {
                Toast.show({
                    text: "Profile has been updated successfully",
                    type: "success",
                    duration: 3000
                });
                this.RBSheet.close()
                this.props.navigation.reset({
                    index: 3,
                    routes: [
                        { name: "ProfileScreen" , params:{profile_id : ''}}
                    ]
                })                
            } else {
                this.convertImage()
            }      
        } else {
            Toast.show({
                text: response.data.message,
                type: "danger",
                duration: 3000
            });
            this.RBSheet.close()
        } 
    }

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
        let userId = await AsyncStorage.getItem("userId");
        ImagePicker.openCamera({
            width: 300,
            height: 400,
            cropping: true,
        })
        .then(async image => {
            //this.RBSheet.open()
            let oldImage = this.state.image;
            this.setState({image: image.path});
        })
        .catch(err => {
            console.log('Error fetching image from Camera roll', err);
        });
    }

    //OPEN GALLERY TO SELECT IMAGE
    choosePhotosFromGallery = async () => {
        var filepath
        ImagePicker.openPicker({
            width: 300,
            height: 200,
            cropping: true,
        })
            .then(async images => {
                let oldImage = this.state.image;
                filepath = images.path
                this.setState({image: images.path});
            })
            .catch(err => {
                console.log(' Error fetching images from gallery ', err);
            });
    }

    //convert image to base64
    convertImage = async() => {
        var filepath = this.state.image
        ImgToBase64.getBase64String(filepath)
        .then(base64String => {
            this.updateProfilePicture(base64String)
            // console.log(base64String)
            //this.setState({base64 : base64String})
        })
        .catch(err => console.log(err))
        //console.log(this.state.base64,"poppopopopopopop")
    }

    //upload converted image function
    updateProfilePicture = async(base64ImageName) => {
        let userID = await AsyncStorage.getItem('userId')
        let response = await axios.post(DataAccess.BaseUrl+DataAccess.UpdateProfilePicture,{
            'userID' : userID,
            'profile_picture' : base64ImageName
        })
        this.RBSheet.close()
        if(response.data.resp === "true") {
            Toast.show({
                text: "Profile has been updated successfully",
                type: "success",
                duration: 3000
            });
            this.RBSheet.close()
            this.props.navigation.reset({
                index: 3,
                routes: [
                    { name: "ProfileScreen" , params:{profile_id : ''}}
                ]
            })
        } else {
            this.RBSheet.close()
            Toast.show({
                text: response.data.reg_msg,
                type: "danger",
                duration: 3000
            });
        }
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

    render = () => (
        <SafeAreaView style={{flex: 1}}>       
            <StatusBar backgroundColor="#69abff" barStyle="light-content" />
            {/* <Header isBackButton isHomeStackInnerPage backToProfile={true} headerText={"Edit Profile"} navigation={this.props.navigation}/> */}
            <Header isHomeStackInnerPage block={true} headerText={"Edit Profile"} navigation={this.props.navigation}/>
            <KeyboardAwareScrollView
                keyboardShouldPersistTaps="handled"
            >
                <TouchableOpacity
                    style={{
                        marginVertical: heightToDp("5%")
                    }}
                    activeOpacity={0.7}
                    onPress={() => this.uploadPicture()}
                >
                    {
                        this.state.image!=="" ?
                            <Image
                                source={{ uri: this.state.image }}
                                style={{
                                    height: heightToDp("11%"),
                                    width: widthToDp("22%"),
                                    borderRadius: 50,
                                    alignSelf: "center",
                                    borderWidth: 1,
                                    borderColor: '#69abff'
                                }}
                            /> :
                            <Image
                                source={require("../../../assets/sign_up.png")}
                                resizeMode="contain"
                                style={{
                                    height: heightToDp("7%"),
                                    width: widthToDp("14%"),
                                    alignSelf: "center",
                                }}
                            />
                    }
                </TouchableOpacity>
                
                <View
                    style={{
                        alignItems: 'center',
                        borderBottomWidth: 1,
                        borderBottomColor: '#a9a9a9',
                        marginHorizontal: widthToDp("3.5%")
                    }}
                >
                    <TextInput
                        style={{
                            color: '#808080',
                            fontSize: widthToDp("3.3%"),
                            width: widthToDp("95%")
                        }}
                        defaultValue={this.state.name}
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
                            width: widthToDp("95%")
                        }}
                        defaultValue={this.state.email}
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
                            width: widthToDp("87%")
                        }}
                    >
                        {this.state.dob !== "" ? this.state.dob : 'Date of Birth'}
                    </Text>
                </TouchableOpacity>
                <DateTimePickerModal
                    isVisible={this.state.showDatePicker}
                    mode="date"
                    onConfirm={this.setDate}
                    onCancel={() => this.setState({showDatePicker: !this.state.showDatePicker})}
                />
                <TouchableOpacity
                    style={{
                        marginTop: heightToDp("5%"),
                        borderBottomWidth: 1,
                        borderBottomColor: '#a9a9a9',
                        alignItems: "flex-start",
                        width: widthToDp("95%"),
                        marginHorizontal: widthToDp("3%")
                    }}
                    activeOpacity={0.7}
                    onPress={() => this.RBSheet1.open()}
                >
                    <Text
                        style={{
                            color: "#808080",
                            fontSize: widthToDp("3.4%"),
                            paddingBottom: heightToDp("1%"),
                            width: widthToDp("87%")
                        }}
                    >
                        {
                            this.state.gender === "0" ? "Male" :
                            this.state.gender === "1" ? "Female" :
                            "Select Your Gender"
                        }
                    </Text>
                </TouchableOpacity>
                
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
                            width: widthToDp("95%")
                        }}
                        defaultValue={this.state.bio}
                        placeholder="Bio"
                        placeholderTextColor="#808080"
                        onChangeText={text => this.setState({ bio: text })}
                    />
                </View>
                
                <ButtonComponent
                    onPressButton={this.updateProfile}
                    buttonText={"Update"}
                    updateProfile={true}
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
            <RBSheet1
                ref={ref => {
                    this.RBSheet1 = ref;
                }}
                height={heightToDp("15%")}
                // openDuration={250}
                customStyles={{
                    container: {
                        alignItems: 'flex-start',
                        justifyContent: 'center',
                        paddingLeft: widthToDp("5%"),
                        backgroundColor: '#fff',
                        borderRadius: 30
                    }
                }}
            >
                <TouchableOpacity 
                    onPress={() => {
                        this.setState({ gender: "0" });
                        this.RBSheet1.close()
                    }}
                    style={{width: '100%'}}
                >
                    <Text
                        style={{
                            fontSize: widthToDp("4.6%"),
                        }}
                    >Male</Text>
                </TouchableOpacity>
                <View style={{ height: heightToDp("1.3%") }} />
                <TouchableOpacity
                    style={{width: '100%'}}
                    onPress={() => {
                        this.setState({ gender: "1" })
                        this.RBSheet1.close()
                    }}>
                    <Text
                        style={{
                            fontSize: widthToDp("4.6%"),
                            
                        }}
                    >Female</Text>
                </TouchableOpacity>
            </RBSheet1>
            <PushNotificationController navigation={this.props.navigation}/>
        </SafeAreaView>
    )
}
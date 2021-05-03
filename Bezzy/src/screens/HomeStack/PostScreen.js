import React from 'react';
import { SafeAreaView, Text, TextInput, TouchableOpacity, View, FlatList, Image, StatusBar, ActivityIndicator } from 'react-native';
import { ActionSheet, Toast } from 'native-base'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import Icon from 'react-native-vector-icons/Ionicons';
import Header from '../../components/Header';
import { heightToDp, widthToDp } from '../../components/Responsive';
import ImagePicker from 'react-native-image-crop-picker';
import { check, PERMISSIONS, RESULTS, request, checkMultiple, requestMultiple } from 'react-native-permissions'
import { FlatGrid } from 'react-native-super-grid'
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createThumbnail } from "react-native-create-thumbnail";
import RBSheet from 'react-native-raw-bottom-sheet';

export default class PostScreen extends React.Component {
    state = {
        focusedTab: "photo",
        buttonText: '',
        imagePath: '',
        isImagePathPresent: false,
        imagesArray: [],
        caption: '',
        thumbnail: ''
    }

    componentDidMount() {
        this.askPermission()
    }

    uploadButtonFunction = async () => {
        if (this.state.buttonText === 'UPLOAD PHOTO') {
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
        } else if (this.state.buttonText === 'UPLOAD VIDEO') {
            ImagePicker.openPicker({
                width: 300,
                height: 200,
                mediaType: 'video',
            })
                .then(images => {
                    this.createThumbnailVIdeo(images.path)
                    //console.log(videoPath)
                })
                .catch(err => {
                    console.log(' Error fetching images from gallery ', err);
                });

            //console.log(this.state.videoPath)
            // createThumbnail({
            //     url: videoPath,
            //     timeStamp : 10000
            // })
            // .then(response => console.log({response}))
            // .catch(err => console.log({err}))
        }
    }

    //setThumbnail for video 
    createThumbnailVIdeo = (filepath) => {
        var imageForVideo
        createThumbnail({
            url: filepath,
            timeStamp: 10000
        })
            .then(response => {imageForVideo = response.path})
            .catch(err => console.log({ err }))

            console.log(imageForVideo)
    }

    //OPEN CAMERA TO SELECT IMAGE FUNCTION
    takePhotoFromCamera = async () => {
        // checkMultiple([PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE, PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE, PERMISSIONS.ANDROID.READ_PHONE_STATE])
        //     .then((result) => {
        //         if (RESULTS.DENIED) {
        //             this.askPermission();
        //         } else if (RESULTS.GRANTED) {
        //             return;
        //         }
        //     })
        if (this.state.focusedTab === 'photo') {
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
    }

    //OPEN GALLERY TO SELECT IMAGE
    choosePhotosFromGallery = async () => {
        // checkMultiple([PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE, PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE, PERMISSIONS.ANDROID.READ_PHONE_STATE])
        //     .then((result) => {
        //         if (RESULTS.DENIED) {
        //             this.askPermission();
        //         } else if (RESULTS.GRANTED) {
        //             return;
        //         }
        //     })

        ImagePicker.openPicker({
            width: 300,
            height: 200,
            cropping: true,
            multiple: true,
            maxFiles: 5 //applicable for only ios
        })
            .then(images => {
                this.state.imagePath = images.path
                this.setState({ isImagePathPresent: true })
                this.setState({ imagesArray: images })
                //console.log(this.state.imagesArray, "lp")
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

    //Upload photo and video function
    postImage = async () => {
        this.RBSheet.open();
        let userID = await AsyncStorage.getItem('userId')
        if (this.state.focusedTab === 'photo') {
            if (this.state.imagesArray.length <= 0 || this.state.caption === '') {
                alert('please enter image and caption')
                this.RBSheet.close();  
            } else {
                var filePaths = this.state.imagesArray.map((i) => i.path)
                var formData = new FormData()
                filePaths.forEach((element, i) => {
                    formData.append('post_image[]', {
                        uri: element,
                        name: `userProfile${i}.jpg`,
                        type: 'image/jpg'
                    })
                    formData.append('userID', userID)
                    formData.append('post_content', this.state.caption)
                })

                // formData.append('post_image[]',{
                //     uri: 'file:///data/user/0/com.bezzy/cache/react-native-image-crop-picker/20210418_051123.jpg',
                //     name: 'userProfile.jpg',
                //     type: 'image/jpg'
                // })
                // formData.append('userID', '232')
                // formData.append('post_content', this.state.caption)
                // console.log(formData._parts)
                let response = await axios.post('http://161.35.122.165/bezzy.websteptech.co.uk/api/PostImage', formData)
                
                if(response.data.resp === "success") {
                    Toast.show({
                        type: "success",
                        text: response.data.message,
                        duration: 3000
                    })
                    this.props.navigation.reset({
                        index: 0,
                        routes: [
                            { name: "HomeScreen" }
                        ]
                    });
                } else {
                    Toast.show({
                        type: "warning",
                        text: response.data.message ? response.data.message : "Some error happened. Please retry.",
                        duration: 3000
                    })
                }
                this.RBSheet.close();               
                
            }
        } else {
            this.RBSheet.close();  
        }
    }

    render() {
        var imagesArray = []
        imagesArray = this.state.imagesArray
        return (
            <SafeAreaView style={{ flex: 1 }}>       
                <StatusBar backgroundColor="#69abff" barStyle="light-content" />
                <Header isHomeStackInnerPage isBackButton navigation={this.props.navigation} headerText={this.state.focusedTab === "photo" ? "Photo" : "Video"} />

                <View
                    style={{
                        marginVertical: heightToDp('1.3%'),
                        marginHorizontal: widthToDp("1.5%"),
                        backgroundColor: '#fff',
                        paddingHorizontal: widthToDp("2%"),
                        borderRadius: 10,
                        borderWidth: 1,
                        borderColor: '#fff'
                    }}
                >
                    <TextInput
                        style={{
                            color: "#69abff",
                            marginBottom: heightToDp("1%"),
                            height: heightToDp("10%"),
                        }}
                        textAlignVertical="top"
                        placeholder="Write Something here..."
                        placeholderTextColor="#69abff"
                        multiline
                        onChangeText={(text) => this.setState({ caption: text })}
                    />
                    <View style={{ alignItems: 'flex-end', paddingBottom: heightToDp("1%") }}>
                        <View
                            style={{
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                                alignItems: 'center'
                            }}
                        >
                            <TouchableOpacity
                                style={{
                                    padding: widthToDp("2%"),
                                    backgroundColor: '#69abff',
                                    borderWidth: 1,
                                    borderRadius: 10,
                                    borderColor: '#69abff'
                                }}
                                onPress={(text) => this.uploadButtonFunction(text)}
                            >
                                <Text
                                    style={{
                                        color: '#fff'
                                    }}
                                >
                                    {this.state.focusedTab === "photo" ? this.state.buttonText = "UPLOAD PHOTO" : this.state.buttonText = "UPLOAD VIDEO"}
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={{
                                    padding: widthToDp("2%"),
                                    backgroundColor: '#69abff',
                                    borderWidth: 1,
                                    borderRadius: 10,
                                    borderColor: '#69abff',
                                    marginLeft: widthToDp("1.5%")
                                }}
                                onPress={() => this.postImage()}
                            >
                                <Text
                                    style={{
                                        color: '#fff'
                                    }}
                                >
                                    POST
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
                {
                    this.state.focusedTab === 'photo' ? 
                    <FlatList
                        data={imagesArray}
                        numColumns={2}
                        ItemSeparatorComponent={() => <View style={{width: widthToDp("0.5%")}}/>}
                        renderItem={({ index, item }) => (
                            <View style={{ paddingHorizontal: widthToDp("1%"), paddingVertical: heightToDp("0.5%") }}>
                                <Image
                                    source={{ uri: item.path }}
                                    style={{ width: widthToDp("48%"), height: heightToDp("30%"), alignSelf: 'center', borderRadius: 10 }}
                                />
                            </View>
                        )}
                    /> : <View>
                        <Image
                            source={{ uri: this.state.thumbnail}}
                            style={{ width: widthToDp("40%"), height: heightToDp("20%"), alignSelf: 'center' }}
                        />
                    </View>
                }
                <View
                    style={{
                        position: 'absolute',
                        bottom: 0,
                        width: widthToDp("100%"),
                    }}
                >
                    <View
                        style={{
                            backgroundColor: '#ececec',
                            height: heightToDp("8%"),
                            justifyContent: 'flex-end',
                            borderTopWidth: 10,
                            borderTopColor: '#ececec'
                        }}
                    >
                        <View
                            style={{
                                height: heightToDp("7.5%"),
                                flexDirection: 'row'
                            }}
                        >
                            <TouchableOpacity
                                style={{
                                    backgroundColor: '#fff',
                                    height: heightToDp("7.5%"),
                                    width: widthToDp("50%"),
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    elevation: 10
                                }}
                                activeOpacity={0.7}
                                disabled={this.state.focusedTab === "photo"}
                                onPress={() => this.setState({ focusedTab: "photo" })}
                            >
                                <Icon
                                    name={Platform.OS === 'android' ? 'md-camera' : 'ios-camera'}
                                    size={23}
                                    color={this.state.focusedTab === "photo" ? "#007dfe" : "#808080"}
                                />
                                <Text
                                    style={{
                                        fontSize: widthToDp("3%"),
                                        color: this.state.focusedTab === "photo" ? "#007dfe" : "#808080"
                                    }}
                                >PHOTO</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={{
                                    backgroundColor: '#fff',
                                    height: heightToDp("7.5%"),
                                    width: widthToDp("50%"),
                                    justifyContent: 'center',
                                    borderTopWidth: 1,
                                    borderTopColor: '#ececec',
                                    borderTopRightRadius: 8,
                                    alignItems: 'center',
                                    elevation: 10,
                                }}
                                activeOpacity={0.7}
                                disabled={this.state.focusedTab === "video"}
                                onPress={() => this.setState({ focusedTab: "video" })}
                            >
                                <Icon
                                    name={Platform.OS === 'android' ? 'md-videocam-outline' : 'ios-videocam-outline'}
                                    size={23}
                                    color={this.state.focusedTab === "video" ? "#007dfe" : "#808080"}
                                />
                                <Text
                                    style={{
                                        fontSize: widthToDp("3%"),
                                        color: this.state.focusedTab === "video" ? "#007dfe" : "#808080"
                                    }}
                                >Video</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
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
            </SafeAreaView>
        )
    }
}
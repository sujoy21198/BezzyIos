import React from 'react';
import { SafeAreaView, Text, TextInput, TouchableOpacity, View, FlatList, Image, StatusBar, ActivityIndicator, Platform, Dimensions } from 'react-native';
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
import Video from 'react-native-video'
import RBSheet from "react-native-raw-bottom-sheet"
import RBSheet1 from "react-native-raw-bottom-sheet"
import PushNotificationController from '../../components/PushNotificationController';
import DataAccess from '../../components/DataAccess';
import PushNotification from 'react-native-push-notification';

export default class PostScreen extends React.Component {
    state = {
        focusedTab: "photo",
        buttonText: '',
        imagePath: '',
        isImagePathPresent: false,
        imagesArray: [],
        caption: '',
        thumbnail: '',
        fromCamera: false,
        cameraImagePath: '',
        followingList: [],
        isLoading: false,
        tagUserId: []
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
                mediaType: 'video'
            })
                .then(images => {
                    this.setState({ thumbnail: images.path })
                    //alert(images.path)
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
    // createThumbnailVIdeo = (filepath) => {
    //     var imageForVideo
    //     createThumbnail({
    //         url: filepath,
    //         timeStamp: 10000
    //     })
    //         .then(response => { imageForVideo = response.path })
    //         .catch(err => console.log({ err }))

    //     console.log(imageForVideo)
    // }

    //OPEN CAMERA TO SELECT IMAGE FUNCTION
    takePhotoFromCamera = async () => {
        if(Platform.OS === "ios") {
            checkMultiple([
                PERMISSIONS.IOS.CAMERA,
                PERMISSIONS.ANDROID.CAMERA, 
            ])
            .then((result) => {
                if (RESULTS.DENIED) {
                    this.askPermission();
                } else if (RESULTS.GRANTED) {
                    // return;
                }
            })
        }
        if (this.state.focusedTab === 'photo') {
            ImagePicker.openCamera({
                width: Dimensions.get("window").width,
                height: (16 / 9) * Dimensions.get("window").width, //aspect ratio * width
                cropping: true,
            })
                .then(image => {
                    this.state.cameraImagePath = image.path
                    this.setState({ fromCamera: true })
                    //alert(this.state.cameraImagePath)
                })
                .catch(err => {
                    console.log('Error fetching image from Camera roll', err);
                });
        }
    }

    //OPEN GALLERY TO SELECT IMAGE
    choosePhotosFromGallery = async () => {
        if(Platform.OS === 'ios') {
            checkMultiple([
                PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE, 
                PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE, 
                PERMISSIONS.ANDROID.READ_PHONE_STATE, 
                PERMISSIONS.IOS.READ_EXTERNAL_STORAGE, 
                PERMISSIONS.IOS.WRITE_EXTERNAL_STORAGE, 
                PERMISSIONS.IOS.READ_PHONE_STATE, 
            ])
            .then((result) => {
                if (RESULTS.DENIED) {
                    this.askPermission();
                } else if (RESULTS.GRANTED) {
                    return;
                }
            })
        }

        ImagePicker.openPicker({
            width: 300,
            height: 200,
            cropping: true,
            multiple: true,
            maxFiles: 30
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
        requestMultiple([
            PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE, 
            PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE, 
            PERMISSIONS.ANDROID.READ_PHONE_STATE, 
            PERMISSIONS.IOS.READ_EXTERNAL_STORAGE, 
            PERMISSIONS.IOS.WRITE_EXTERNAL_STORAGE, 
            PERMISSIONS.IOS.READ_PHONE_STATE, 
            PERMISSIONS.IOS.CAMERA,
            PERMISSIONS.ANDROID.CAMERA, 
        ]).then((result) => {
            console.log(result)
            return;
        }).catch((error) => {
            console.log(error)
        })
    }

    //Upload photo and video function
    postImage = async () => {
        //if (this.state.caption.trim() === "") {
        //   this.setState({ isCaptionEmpty: true });
        //    return;
        //}
        //this.setState({ isCaptionEmpty: false });
        let userID = await AsyncStorage.getItem('userId')
        if (this.state.focusedTab === 'photo') {
            if (this.state.fromCamera === false) {
                if (this.state.imagesArray.length <= 0) {
                    alert('Please upload image')
                } else {
                    // this.RBSheet.open();
                    // await AsyncStorage.setItem("upload", JSON.stringify({
                    //     type: "image",
                    //     isUploading: true,
                    //     errorText: "",
                    //     uploadSuccess: false,
                    // }))
                    this.props.navigation.reset({
                        index: 0,
                        routes: [
                            { name: "HomeScreen" }
                        ]
                    })
                    if(Platform.OS==='android') {
                        PushNotification.getChannels(channelIds => {
                            if(channelIds.length === 0) {
                                PushNotification.createChannel({
                                    channelId: Date.now().toString(),
                                    channelName: "Channel"
                                }, (created) => {
                                    PushNotification.getChannels(channelIds => {
                                        PushNotification.localNotification({
                                            channelId: channelIds[0],
                                            title: "Image Upload",
                                            message: "Your image is uploading. Please wait..."
                                        })
                                    })
                                })
                            } else {
                                PushNotification.getChannels(channelIds => {
                                    PushNotification.localNotification({
                                        channelId: channelIds[0],
                                        title: "Image Upload",
                                        message: "Your image is uploading. Please wait..."
                                    })
                                })
                            }
                        })
                    } else {
                        PushNotification.localNotification({
                            title: "Image Upload",
                            channelId: Platform.OS==="android" ? undefined : "imageupload",
                            id: Platform.OS==="android" ? undefined : "imageupload",
                            message: "Your image is uploading. Please wait..."
                        })
                    }

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
                    await axios.post('http://bezzy-app.com/admin/api/PostImage', formData)
                        .then(async response => {
                            console.log(response.data)
                            if(this.state.tagUserId.length > 0) {
                                await axios.post(DataAccess.BaseUrl +  DataAccess.postTaggedUserContent, {
                                    "post_id" : response.data.post_id,
                                    "log_user_id" : userID,
                                    "post_content" : this.state.caption,
                                    "post_type_id" : '1',
                                    "tag_user_id" : JSON.stringify(this.state.tagUserId).split("[")[1].split("]")[0]
                                }).then(res => {
                                    console.log(res.data);
                                    this.setState({tagUserId: []})
                                }).catch(err => console.log(err))
                            }
                            // await AsyncStorage.setItem("upload", JSON.stringify({
                            //     type: "image",
                            //     isUploading: false,
                            //     errorText: "",
                            //     uploadSuccess: true,
                            // }))
                            Platform.OS==="android" ? undefined : PushNotification.deleteChannel("imageupload")
                            Platform.OS==="android" ? undefined : PushNotification.removeDeliveredNotifications(["imageupload"])
                            if(Platform.OS === "android") {
                                PushNotification.getChannels(channelIds => {
                                    if(channelIds.length === 0) {
                                        PushNotification.createChannel({
                                            channelId: Date.now().toString(),
                                            channelName: "Channel"
                                        }, (created) => {
                                            PushNotification.getChannels(channelIds => {
                                                PushNotification.localNotification({
                                                    channelId: channelIds[0],
                                                    title: "Image Upload",
                                                    message: "Your image has been uploaded successfully."
                                                })
                                            })
                                        })
                                    } else {
                                        PushNotification.getChannels(channelIds => {
                                            PushNotification.localNotification({
                                                channelId: channelIds[0],
                                                title: "Image Upload",
                                                message: "Your image has been uploaded successfully."
                                            })
                                        })
                                    }
                                })
                            } else {
                                PushNotification.localNotification({
                                    title: "Image Upload",
                                    channelId: Platform.OS==="android" ? undefined : "imageupload",
                                    id: Platform.OS==="android" ? undefined : "imageupload",
                                    message: "Your image has been uploaded successfully."
                                })
                            }
                        }).catch(async function (error) {
                            console.log(error)
                            // await AsyncStorage.setItem("upload", JSON.stringify({
                            //     type: "image",
                            //     isUploading: false,
                            //     errorText: JSON.stringify(error),
                            //     uploadSuccess: false,
                            // }))
                            if(Platform.OS === "android") {
                                PushNotification.getChannels(channelIds => {
                                    if(channelIds.length === 0) {
                                        PushNotification.createChannel({
                                            channelId: Date.now().toString(),
                                            channelName: "Channel"
                                        }, (created) => {
                                            PushNotification.getChannels(channelIds => {
                                                PushNotification.localNotification({
                                                    channelId: channelIds[0],
                                                    title: "Image Upload",
                                                    message: JSON.stringify(error)
                                                })
                                            })
                                        })
                                    } else {
                                        PushNotification.getChannels(channelIds => {
                                            PushNotification.localNotification({
                                                channelId: channelIds[0],
                                                title: "Image Upload",
                                                message: JSON.stringify(error)
                                            })
                                        })
                                    }
                                })
                            } else {
                                PushNotification.localNotification({
                                    title: "Image Upload",
                                    channelId: Platform.OS==="android" ? undefined : "imageupload",
                                    id: Platform.OS==="android" ? undefined : "imageupload",
                                    message: JSON.stringify(error)
                                })
                            }
                        })


                    // this.RBSheet.close();
                    // this.props.navigation.reset({
                    //     index: 0,
                    //     routes: [
                    //         { name: "HomeScreen" }
                    //     ]
                    // });
                }
            } else if (this.state.fromCamera === true) {
                // this.RBSheet.open();
                // await AsyncStorage.setItem("upload", JSON.stringify({
                //     upload: {
                //         type: "image",
                //         isUploading: true,
                //         errorText: "",
                //         uploadSuccess: false,
                //     }
                // }))
                this.props.navigation.reset({
                    index: 0,
                    routes: [
                        { name: "HomeScreen" }
                    ]
                })
                if(Platform.OS==='android') {
                    PushNotification.getChannels(channelIds => {
                        if(channelIds.length === 0) {
                            PushNotification.createChannel({
                                channelId: Date.now().toString(),
                                channelName: "Channel"
                            }, (created) => {
                                PushNotification.getChannels(channelIds => {
                                    PushNotification.localNotification({
                                        channelId: channelIds[0],
                                        title: "Image Upload",
                                        message: "Your image is uploading. Please wait..."
                                    })
                                })
                            })
                        } else {
                            PushNotification.getChannels(channelIds => {
                                PushNotification.localNotification({
                                    channelId: channelIds[0],
                                    title: "Image Upload",
                                    message: "Your image is uploading. Please wait..."
                                })
                            })
                        }
                    })
                } else {
                    PushNotification.localNotification({
                        title: "Image Upload",
                        channelId: Platform.OS==="android" ? undefined : "imageupload",
                        id: Platform.OS==="android" ? undefined : "imageupload",
                        message: "Your image is uploading. Please wait..."
                    })
                }
                var formDataCamera = new FormData()
                formDataCamera.append('post_image[]', {
                    uri: this.state.cameraImagePath,
                    name: 'userProfile.jpg',
                    type: 'image/jpg'
                })
                formDataCamera.append('userID', userID)
                formDataCamera.append('post_content', this.state.caption)
                console.log(formDataCamera._parts)

                await axios.post('http://bezzy-app.com/admin/api/PostImage', formDataCamera)
                    .then(async response => {
                        console.log(response.data, "CAMERA", this.state, this.state.tagUserId)
                        if(this.state.tagUserId.length > 0) {
                            await axios.post(DataAccess.BaseUrl +  DataAccess.postTaggedUserContent, {
                                "post_id" : response.data.post_id,
                                "log_user_id" : userID,
                                "post_content" : this.state.caption,
                                "post_type_id" : '1',
                                "tag_user_id" : JSON.stringify(this.state.tagUserId).split("[")[1].split("]")[0]
                            }).then(res => {
                                console.log(res.data);
                                this.setState({tagUserId: []})
                            }).catch(err => console.log(err))
                        }
                        // await AsyncStorage.setItem("upload", JSON.stringify({
                        //     type: "image",
                        //     isUploading: false,
                        //     errorText: "",
                        //     uploadSuccess: true,
                        // }))
                        if(Platform.OS === "android") {
                            PushNotification.getChannels(channelIds => {
                                if(channelIds.length === 0) {
                                    PushNotification.createChannel({
                                        channelId: Date.now().toString(),
                                        channelName: "Channel"
                                    }, (created) => {
                                        PushNotification.getChannels(channelIds => {
                                            PushNotification.localNotification({
                                                channelId: channelIds[0],
                                                title: "Image Upload",
                                                message: "Your image has been uploaded successfully."
                                            })
                                        })
                                    })
                                } else {
                                    PushNotification.getChannels(channelIds => {
                                        PushNotification.localNotification({
                                            channelId: channelIds[0],
                                            title: "Image Upload",
                                            message: "Your image has been uploaded successfully."
                                        })
                                    })
                                }
                            })
                        } else {
                            PushNotification.localNotification({
                                title: "Image Upload",
                                channelId: Platform.OS==="android" ? undefined : "imageupload",
                                id: Platform.OS==="android" ? undefined : "imageupload",
                                message: "Your image has been uploaded successfully."
                            })
                        }
                    }).catch(async error => {
                        console.log(error)
                
                        // await AsyncStorage.setItem("upload", JSON.stringify({
                        //     type: "image",
                        //     isUploading: false,
                        //     errorText: JSON.stringify(error),
                        //     uploadSuccess: false,
                        // }))
                        if(Platform.OS === "android") {
                            PushNotification.getChannels(channelIds => {
                                if(channelIds.length === 0) {
                                    PushNotification.createChannel({
                                        channelId: Date.now().toString(),
                                        channelName: "Channel"
                                    }, (created) => {
                                        PushNotification.getChannels(channelIds => {
                                            PushNotification.localNotification({
                                                channelId: channelIds[0],
                                                title: "Image Upload",
                                                message: JSON.stringify(error)
                                            })
                                        })
                                    })
                                } else {
                                    PushNotification.getChannels(channelIds => {
                                        PushNotification.localNotification({
                                            channelId: channelIds[0],
                                            title: "Image Upload",
                                            message: JSON.stringify(error)
                                        })
                                    })
                                }
                            })
                        } else {
                            PushNotification.localNotification({
                                title: "Image Upload",
                                channelId: Platform.OS==="android" ? undefined : "imageupload",
                                id: Platform.OS==="android" ? undefined : "imageupload",
                                message: JSON.stringify(error)
                            })
                        }
                    })
                // this.RBSheet.close();
                // this.props.navigation.reset({
                //     index: 0,
                //     routes: [
                //         { name: "HomeScreen" }
                //     ]
                // });
            }
            if(this.state.imagesArray.length > 0 || this.state.cameraImagePath !== "") {
                Toast.show({
                    text: "Image is uploaded successfully",
                    type: "success",
                    duration: 3000
                });
            }
            this.setState({imagesArray: [], cameraImagePath: ""})
        } else if (this.state.focusedTab === 'video') {
            if(this.state.thumbnail === "") {
                alert('Please upload video')
            } else {
                // this.RBSheet.open();
                
                // await AsyncStorage.setItem("upload", JSON.stringify({
                //     type: "video",
                //     isUploading: true,
                //     errorText: "",
                //     uploadSuccess: false,
                // }))
                this.props.navigation.reset({
                    index: 0,
                    routes: [
                        { name: "HomeScreen" }
                    ]
                })
                if(Platform.OS === "android") {
                    PushNotification.getChannels(channelIds => {
                        if(channelIds.length === 0) {
                            PushNotification.createChannel({
                                channelId: Date.now().toString(),
                                channelName: "Channel"
                            }, (created) => {
                                PushNotification.getChannels(channelIds => {
                                    PushNotification.localNotification({
                                        channelId: channelIds[0],
                                        title: "Video Upload",
                                        message: "Your video is uploading. Please wait..."
                                    })
                                })
                            })
                        } else {
                            PushNotification.getChannels(channelIds => {
                                PushNotification.localNotification({
                                    channelId: channelIds[0],
                                    title: "Video Upload",
                                    message: "Your video is uploading. Please wait..."
                                })
                            })
                        }
                    })
                } else {
                    PushNotification.localNotification({
                        title: "Video Upload",
                        channelId: Platform.OS==="android" ? undefined : "videoupload",
                        id: Platform.OS==="android" ? undefined : "videoupload",
                        message: "Your video is uploading. Please wait..."
                    })
                }
                var fromDataVideo = new FormData()
                fromDataVideo.append('post_video', {
                    name: 'name.mp4',
                    uri: this.state.thumbnail,
                    type: 'video/mp4'
                })
                fromDataVideo.append('post_content', this.state.caption)
                fromDataVideo.append('userID', userID)

                await axios.post('http://bezzy-app.com/admin/api/PostVideo', fromDataVideo)
                    .then(async response => {
                        console.log(response.data, "VIDEO")
                        if(this.state.tagUserId.length > 0) {
                            await axios.post(DataAccess.BaseUrl +  DataAccess.videoPostTaggedUserContent, {
                                "post_id" : response.data.post_id,
                                "log_user_id" : userID,
                                "post_content" : this.state.caption,
                                "post_type_id" : '3',
                                "tag_user_id" : JSON.stringify(this.state.tagUserId).split("[")[1].split("]")[0]
                            }).then(res => {
                                console.log(res.data);
                                this.setState({tagUserId: []})
                            }).catch(err => console.log(err))
                        }
                
                        // await AsyncStorage.setItem("upload", JSON.stringify({
                        //     type: "video",
                        //     isUploading: false,
                        //     errorText: "",
                        //     uploadSuccess: true,
                        // }))
                        if(Platform.OS === "android") {
                            PushNotification.getChannels(channelIds => {
                                if(channelIds.length === 0) {
                                    PushNotification.createChannel({
                                        channelId: Date.now().toString(),
                                        channelName: "Channel"
                                    }, (created) => {
                                        PushNotification.getChannels(channelIds => {
                                            PushNotification.localNotification({
                                                channelId: channelIds[0],
                                                title: "Video Upload",
                                                message: "Your video has been uploaded successfully."
                                            })
                                        })
                                    })
                                } else {
                                    PushNotification.getChannels(channelIds => {
                                        PushNotification.localNotification({
                                            channelId: channelIds[0],
                                            title: "Video Upload",
                                            message: "Your video has been uploaded successfully."
                                        })
                                    })
                                }
                            })
                        } else {
                            PushNotification.localNotification({
                                title: "Video Upload",
                                channelId: Platform.OS==="android" ? undefined : "videoupload",
                                id: Platform.OS==="android" ? undefined : "videoupload",
                                message: "Your video has been uploaded successfully."
                            })
                        }
                    }).catch(async function (error) {
                        console.log(error)
                
                        // await AsyncStorage.setItem("upload", JSON.stringify({
                        //     type: "video",
                        //     isUploading: false,
                        //     errorText: JSON.stringify(error),
                        //     uploadSuccess: false,
                        // }))
                        if(Platform.OS === "android") {
                            PushNotification.getChannels(channelIds => {
                                if(channelIds.length === 0) {
                                    PushNotification.createChannel({
                                        channelId: Date.now().toString(),
                                        channelName: "Channel"
                                    }, (created) => {
                                        PushNotification.getChannels(channelIds => {
                                            PushNotification.localNotification({
                                                channelId: channelIds[0],
                                                title: "Video Upload",
                                                message: JSON.stringify(error)
                                            })
                                        })
                                    })
                                } else {
                                    PushNotification.getChannels(channelIds => {
                                        PushNotification.localNotification({
                                            channelId: channelIds[0],
                                            title: "Video Upload",
                                            message: JSON.stringify(error)
                                        })
                                    })
                                }
                            })
                        } else {
                            PushNotification.localNotification({
                                title: "Video Upload",
                                channelId: Platform.OS==="android" ? undefined : "videoupload",
                                id: Platform.OS==="android" ? undefined : "videoupload",
                                message: JSON.stringify(error)
                            })
                        }
                    })
                // this.RBSheet.close();
                // this.props.navigation.reset({
                //     index: 0,
                //     routes: [
                //         { name: "HomeScreen" }
                //     ]
                // });
            }

            if(this.state.thumbnail !== "") {
                Toast.show({
                    text: "Video uploaded successfully",
                    type: "success",
                    duration: 3000
                });
            }

            this.setState({thumbnail: ""})
        }
    }

    getFollowings = async (mention) => {
        if(mention === "@") return;
        this.setState({followingList: []})
        let userId = await AsyncStorage.getItem("userId");
        let followingList = []
        let response = await axios.post(DataAccess.BaseUrl + DataAccess.userFollowingList, {"loguser_id" : userId});
        if(response.data.resp === "success") {
            console.warn(response.data);
            // console.warn(response.data.total_feed_response.friend_list, mention.split("@")[1].toLowerCase());
            // console.warn(response.data.total_feed_response.friend_list);
            response.data && response.data.following_user_list &&
            response.data.following_user_list.length > 0 &&
            response.data.following_user_list.map(element => {
                if(element.name && element.name.toLowerCase().startsWith(mention.split("@")[1].toLowerCase())) {
                    followingList.push(element);
                }
            })
        } else {
            this.setState({followingList: []});
        }

        this.setState({followingList})
        this.state.followingList.length > 0 && this.RBSheet1.open()

        // console.warn(this.state.followingList);
    }

    render() {
        var imagesArray = []
        imagesArray = this.state.imagesArray
        return (
            <SafeAreaView style={{ flex: 1 }}>
                <StatusBar backgroundColor="#69abff" barStyle={Platform.OS==='android' ? "light-content" : "dark-content"}/>
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
                        style={[{
                            color: "#69abff",
                            marginBottom: heightToDp("1%"),
                            height: heightToDp("10%"),
                            fontFamily: "Poppins-Regular"
                        }, Platform.isPad && {fontSize: widthToDp("3%")}]}
                        textAlignVertical="top"
                        placeholder="Write Something here..."
                        placeholderTextColor="#69abff"
                        multiline
                        defaultValue={this.state.caption}
                        onChangeText={(text) => {
                            this.setState({ caption: text, followingList: [] }, () => {
                                if(this.state.caption.split(" ") && this.state.caption.split(" ").length > 0) {
                                    // console.warn(this.state.caption.split(" "));
                                }
                                if(
                                    this.state.caption.includes("@") && this.state.caption.match(/\B@\w+/g) && 
                                    this.state.caption.match(/\B@\w+/g).length > 0 && (
                                        this.state.caption.split(" ") && this.state.caption.split(" ").length > 0 &&
                                        this.state.caption.split(" ")[this.state.caption.split(" ").length - 1] !== "" &&
                                        this.state.caption.split(" ")[this.state.caption.split(" ").length - 1] !== "@" && 
                                        this.state.caption.split(" ")[this.state.caption.split(" ").length - 1].includes("@")
                                    )
                                ) {
                                    this.getFollowings(this.state.caption.match(/\B@\w+/g)[this.state.caption.match(/\B@\w+/g).length - 1]);
                                    // console.warn("Abc ", text.match(/\B@\w+/g) && text.match(/\B@\w+/g).length > 0 && text.match(/\B@\w+/g)[text.match(/\B@\w+/g).length - 1]);
                                }
                            });
                        }}
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
                                    style={[{
                                        color: '#fff',
                                        fontFamily: "ProximaNova-Black"
                                    }, Platform.isPad && {fontSize: widthToDp("3%")}]}
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
                                    style={[{
                                        color: '#fff',
                                        fontFamily: "ProximaNova-Black"
                                    }, Platform.isPad && {fontSize: widthToDp("3%")}]}
                                >
                                    POST
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
                {
                    this.state.isCaptionEmpty &&
                    <Text
                        style={{
                            marginVertical: heightToDp("0.5%"),
                            marginHorizontal: widthToDp("1%"),
                            color: "#ff0000"
                        }}
                    >
                        Caption field can't be empty
                    </Text>
                }
                {
                    this.state.focusedTab === 'photo' && this.state.fromCamera === true ?
                        <View>
                            <Image
                                source={{ uri: this.state.cameraImagePath }}
                                style={{ width: widthToDp("48%"), height: heightToDp("30%"), alignSelf: 'center', borderRadius: 10 }}
                            />
                        </View> : ((this.state.focusedTab === 'photo' && this.state.fromCamera === false) ? <FlatList
                            data={imagesArray}
                            numColumns={2}
                            ListFooterComponent={<View style={{height: heightToDp("10%")}} />}
                            ItemSeparatorComponent={() => <View style={{ width: widthToDp("0.5%") }} />}
                            renderItem={({ index, item }) => (
                                <View style={{ paddingHorizontal: widthToDp("1%"), paddingVertical: heightToDp("0.5%") }}>
                                    <Image
                                        source={{ uri: item.path }}
                                        style={{ width: widthToDp("48%"), height: heightToDp("30%"), alignSelf: 'center', borderRadius: 10 }}
                                    />
                                </View>
                            )}
                        /> : ((this.state.focusedTab === 'video') ? <View>
                            <Video
                                source={{ uri: this.state.thumbnail }}
                                ref={(ref) => {
                                    this.player = ref
                                }}
                                onBuffer={this.onBuffer}
                                onError={this.videoError}
                                controls={true}
                                style={{
                                    height: "50%",
                                    width: "90%",
                                    alignSelf: 'center'
                                }}
                                resizeMode="contain"
                            />
                        </View> : null))
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
                                    size={Platform.isPad ? 40 : 23}
                                    color={this.state.focusedTab === "photo" ? "#007dfe" : "#808080"}
                                />
                                <Text
                                    style={{
                                        fontSize: widthToDp("3%"),
                                        color: this.state.focusedTab === "photo" ? "#007dfe" : "#808080",
                                        fontFamily: "ProximaNova-Black"
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
                                    size={Platform.isPad ? 40 : 23}
                                    color={this.state.focusedTab === "video" ? "#007dfe" : "#808080"}
                                />
                                <Text
                                    style={{
                                        fontSize: widthToDp("3%"),
                                        color: this.state.focusedTab === "video" ? "#007dfe" : "#808080",
                                        fontFamily: "ProximaNova-Black"
                                    }}
                                >Video</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
                <RBSheet1
                    ref={ref => {
                        this.RBSheet1 = ref;
                    }}
                    closeOnPressMask={true}
                    closeOnPressBack={true}
                    // height={100}
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
                    <FlatList
                        style={{
                            padding: widthToDp("2%")
                        }}
                        data={this.state.followingList}
                        // ListFooterComponent={<View style={{height: heightToDp("1%")}}/>}
                        ItemSeparatorComponent={() => <View style={{height: heightToDp("1%")}}/>}
                        renderItem={({item}) => (
                            <TouchableOpacity
                                onPress={() => {
                                    this.setState({
                                        caption: this.state.caption.substring(0, this.state.caption.trim().length - this.state.caption.match(/\B@\w+/g)[this.state.caption.match(/\B@\w+/g).length - 1].length) + "@" + item.name + " ",
                                        tagUserId: [...this.state.tagUserId, item.following_user_id]
                                    }, () => {
                                        console.log("Tagged IDs => ", this.state.tagUserId)
                                    })
                                    this.RBSheet1.close()
                                }}
                            >
                                <Text
                                    style={{
                                        fontSize: widthToDp("4.6%"),
                                        fontFamily: "Poppins-Regular",
                                    }}
                                >{item.name}</Text>
                            </TouchableOpacity>
                        )}
                    />
                </RBSheet1>
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
                <PushNotificationController navigation={this.props.navigation}/>
            </SafeAreaView>
        )
    }
}
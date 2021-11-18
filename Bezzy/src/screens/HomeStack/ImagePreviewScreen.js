import React from 'react';
import { ActivityIndicator, Alert, Dimensions, FlatList, Image, Platform, Keyboard, SafeAreaView, ScrollView, StatusBar, Text, TextInput, TouchableOpacity, View, KeyboardAvoidingView } from 'react-native';
import { heightToDp, widthToDp } from '../../components/Responsive';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/FontAwesome5';
import Icon1 from 'react-native-vector-icons/FontAwesome';
import Icon2 from 'react-native-vector-icons/Ionicons';
import axios from 'axios';
import DataAccess from '../../components/DataAccess';
import RBSheet from 'react-native-raw-bottom-sheet';
import { Toast } from 'native-base';
import AsyncStorage from '@react-native-async-storage/async-storage';
import PushNotificationController from '../../components/PushNotificationController';
import VideoPlayer from 'react-native-video-controls';
import Autolink from 'react-native-autolink';

export default class ImagePreviewScreen extends React.Component {
    
    constructor(props){
        super(props)
        this.state = {
            numberOfLikes: 0,
            numberOfComments: 0,
            isLiked: false,
            isLoading: false,
            postCaption: "",
            captionEditable: false,
            isUpdatingCaption: false,
            postUrl: [],
            otherProfile:false,
            postType: '',
            videoPlayTimes: {
                currentTime: 0,
                seekableDuration: 0
            },
            isPaused: false,
            isMuted: false
        }
        this.state.otherProfile = this.props.route.params.otherProfile
        //alert(this.state.otherProfile)
    }

    UNSAFE_componentWillMount () {
        this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => this.setState({keyboardOpened: true}));
        this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => this.setState({keyboardOpened: false}));
    }

    componentDidMount() {
        this.unsubscribe = this.props.navigation.addListener("focus", () => {
            this.RBSheet.open();
            this.getPostDetails()
        })
        this.RBSheet.open();
        this.getPostDetails()
    }

    componentWillUnmount() {
        this.unsubscribe()
    }

    getPostDetails = async () => {
        let userId = await AsyncStorage.getItem("userId");
        let response =  await axios.get(
            DataAccess.BaseUrl + DataAccess.getPostDetails + "/" + 
            this.props.route.params.image.post_id + "/" + userId, 
            DataAccess.AuthenticationHeader
        );
        if(response.data.status === 'success') {
            if(response.data.post_details.log_user_like_status === "No") {
                this.setState({isLiked: false});
            } else if(response.data.post_details.log_user_like_status === "Yes") {
                this.setState({isLiked: true});
            }
            response.data.post_details.post_img_video_live && response.data.post_details.post_img_video_live.length > 0 &&
            response.data.post_details.post_img_video_live.map(item => item.isLoading = false);
            this.setState({
                postUrl: response.data.post_details.post_img_video_live,
                numberOfComments: response.data.post_details.number_of_comment, 
                numberOfLikes: response.data.post_details.number_of_like, 
                postCaption: response.data.post_details.post_content,
                postType: response.data.post_details.post_type,
            })
        } else {
            this.setState({
                postUrl: [],
                numberOfComments: 0, 
                numberOfLikes: 0,  
                postCaption: ""
            })
        }
        this.RBSheet.close();   
    }

    deleteImage = async () => {
        Alert.alert(
            "Delete", 
            "Are you sure to delete this image?",
            [
                {
                    text: "No",
                    onPress: () => undefined,
                    style:  'cancel'
                },
                {
                    text: "Yes",
                    onPress: async () => {
                        this.RBSheet.open();
                        let response = await axios.post(DataAccess.BaseUrl + DataAccess.deletePost, {
                            "imgvideoID" : this.props.route.params.image.id,
                            "post_type" : this.props.route.params.image.post_type
                        }, DataAccess.AuthenticationHeader);
                        if(response.data.status === "success") {
                            this.RBSheet.close();
                            Toast.show({
                                text: response.data.message,
                                type: "success",
                                duration: 2000
                            })
                            if(this.player) this.player = undefined;
                            this.props.navigation.reset({
                                index: 3,
                                routes: [
                                    { name: "ProfileScreen",params: {
                                        profile_id : '',
                                        imageDeleted: this.props.route.params.share
                                    } }
                                ]
                            })
                        } else {
                            this.RBSheet.close();
                            Toast.show({
                                text: response.data,
                                type: "danger",
                                duration: 2000
                            })
                        }
                    }
                }
            ]
        )
    }

    likeImage = async () => {
        this.setState({isLoading: true})
        let userId = await AsyncStorage.getItem("userId");
        let response = await axios.get(DataAccess.BaseUrl + DataAccess.likePost + "/" + userId + "/" + this.props.route.params.image.post_id, DataAccess.AuthenticationHeader);
        if(response.data.status === "success") {
            if(this.state.isLiked) {
                this.setState({
                    numberOfLikes: this.state.numberOfLikes - 1,
                    isLiked: false
                })
            } else {
                this.setState({
                    numberOfLikes: this.state.numberOfLikes + 1,
                    isLiked: true
                })
            }
        } else {
            //
        }
        this.setState({isLoading: false})
    }

    updateCaption = async() => {
        if(!this.state.captionEditable) {
            this.setState({captionEditable: true});
        } else if(this.state.captionEditable && this.state.postCaption !== ""){
            this.setState({isUpdatingCaption: true})
            let response = await axios.post(DataAccess.BaseUrl + DataAccess.updatePostCaption, {
                "post_id" : this.props.route.params.image.post_id,
                "post_type" : this.props.route.params.image.post_type,
                "post_caption_text" : this.state.postCaption
            }, DataAccess.AuthenticationHeader);
            this.setState({isUpdatingCaption: false})
            if(response.data.resp === "success") {
                this.setState({captionEditable: false})
            } else {
                //
            }
        } else {
            //
        }        
    }

    reportPost = async () => {
        Alert.alert(
            "Do you want to report on this post?", 
            "Reported post will be deleted from our server.", 
            [
                {
                    text: "Cancel"
                }, 
                {
                    text: "Ok",
                    onPress: async () => {
                        this.RBSheet.open()
                        let userId = await AsyncStorage.getItem("userId");
                        console.warn(userId);
                        await axios.get(DataAccess.BaseUrl + DataAccess.reportPost + "/" + userId + "/" + this.props.route.params.image.post_id, DataAccess.AuthenticationHeader)
                            .then(res => {
                                console.log("Report Post Response ==> ", res.data);
                                if(res.data.resp === "true") {
                                    Toast.show({
                                        type: "success",
                                        text: res.data.message,
                                        duration: 2000
                                    })
                                    this.RBSheet.close();
                                    this.props.navigation.goBack();
                                } else if(res.data.resp === "false") {
                                    Toast.show({
                                        type: "warning",
                                        text: res.data.message,
                                        duration: 2000
                                    })
                                    this.RBSheet.close();
                                } else {
                                    Toast.show({
                                        type: "danger",
                                        text: "Some error happened. Please retry!",
                                        duration: 2000
                                    })
                                    this.RBSheet.close();
                                }
                            })
                            .catch(err => {
                                console.log(err);
                                Toast.show({
                                    type: "danger",
                                    text: "Either client or server side network error !!!",
                                    duration: 2000
                                })
                                this.RBSheet.close();
                            })
                    }
                }
            ]
        )
    }

    render = () => (
        Platform.OS === 'android' ?
        <ScrollView style={{flex:1, backgroundColor: '#1b1b1b'}}>
            <StatusBar backgroundColor="#69abff" barStyle="light-content" />            
            <LinearGradient
                style={{paddingTop: heightToDp(`${this.state.postUrl.length !== 0 ? this.state.postType === "image" ? 4 : 0 : 90}%`)}}
                colors={['#fff', '#1b1b1b']}
            >
                {
                    (this.state.postUrl && this.state.postUrl.length > 0) &&
                    <FlatList
                        data={this.state.postUrl}
                        horizontal={true}
                        showsHorizontalScrollIndicator={false}
                        ItemSeparatorComponent={() => <View style={{width: widthToDp("5%")}}/>}
                        renderItem={({item, index}) => (
                            this.state.postType === "image" ?
                            <Image
                                resizeMode="contain"
                                style={{ height: heightToDp("80%"), width: widthToDp("100%") }}
                                source={{ uri: item.post_url}}
                                /> :
                                <View
                                    style={{
                                        height: (this.props.route && this.props.route.params && this.props.route.params.hideFunctionalities) ? heightToDp("100%") : heightToDp("80%")
                                    }}
                                >
                                    <VideoPlayer
                                        source={{ uri: item.post_url }}
                                        ref={(ref) => {
                                            this.player = ref
                                        }}
                                        ignoreSilentSwitch="ignore"
                                        onLoadStart={() => this.setState({isLoading: true})}
                                        onLoad={() => this.setState({isLoading: false})}
                                        // onBuffer={this.onBuffer}
                                        // onError={this.videoError}
                                        // paused={this.state.isPaused}
                                        // muted={this.state.isMuted}
                                        // onProgress={({currentTime, playableDuration, seekableDuration}) => {
                                        //     this.setState({
                                        //         videoPlayTimes: {
                                        //             currentTime,
                                        //             seekableDuration
                                        //         }
                                        //     })
                                        //     // console.warn(currentTime, playableDuration, seekableDuration)
                                        // }}
                                        // onSeek={({currentTime, seekTime}) => {
                                        //     console.warn(currentTime, seekTime);
                                        // }}
                                        // paused
                                        navigator={this.props.navigation}
                                        repeat
                                        style={{
                                            height: heightToDp("70%"),
                                            width: widthToDp("100%"),
                                            alignSelf: 'center',
                                        }}
                                        resizeMode="contain"
                                    />
                                    {/* <View style={{
                                        height: heightToDp("10%"),
                                        flexDirection: "row",
                                        alignItems: "center",
                                        paddingLeft: Dimensions.get("window").width / 2 
                                    }}>
                                        <TouchableOpacity
                                            onPress={() => this.setState({isPaused: !this.state.isPaused})}
                                        >
                                            {
                                                this.state.isPaused ?
                                                <Icon2
                                                    name={Platform.OS==='android' ? "md-play-circle-outline" : "ios-play-circle-outline"}
                                                    size={45}
                                                    color="#fff"
                                                /> :
                                                <Icon2
                                                    name={Platform.OS==='android' ? "md-pause-circle-outline" : "ios-pause-circle-outline"}
                                                    size={45}
                                                    color="#fff"
                                                />
                                            }
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            onPress={() => this.setState({isMuted: !this.state.isMuted})}
                                            style={{
                                                paddingLeft: "10%"
                                            }}
                                        >
                                            {
                                                this.state.isMuted ?
                                                <Icon2
                                                    name={Platform.OS==='android' ? "md-volume-high-outline" : "ios-volume-high-outline"}
                                                    size={25}
                                                    color="#fff"
                                                /> :
                                                <Icon2
                                                    name={Platform.OS==='android' ? "md-volume-mute-outline" : "ios-volume-mute-outline"}
                                                    size={25}
                                                    color="#fff"
                                                />
                                            }
                                        </TouchableOpacity>
                                    </View> */}
                                    {/* {
                                        this.state.isLoading &&
                                        <ActivityIndicator
                                            size="large"
                                            color="#4977b2"
                                            style={{
                                                position: "absolute",
                                                top: Dimensions.get("window").width / 2,
                                                left: Dimensions.get("window").width / 2,
                                                alignSelf: "center"
                                            }}
                                        />
                                    } */}
                                    {/* <View
                                        style={{
                                            width: "100%",
                                            position: "absolute",
                                            bottom: 20,
                                            flexDirection: "row",
                                            alignItems: "center",
                                            justifyContent: "space-between",
                                            paddingHorizontal: "3%"
                                        }}
                                    >
                                        <Text
                                            style={{
                                                width: "15%",
                                                fontFamily: "Poopins-Regular",
                                                color: "#fff"
                                            }}
                                        >{
                                            `${
                                                parseInt(this.state.videoPlayTimes.currentTime) >= 60 ? (
                                                    parseInt(this.state.videoPlayTimes.currentTime / 60).toString().length === 2 ? 
                                                    parseInt(this.state.videoPlayTimes.currentTime / 60) : 
                                                    "0" + parseInt(this.state.videoPlayTimes.currentTime / 60)
                                                ) : "00"
                                            }:${
                                                parseInt(this.state.videoPlayTimes.currentTime) >= 60 ? (
                                                    parseInt(this.state.videoPlayTimes.currentTime % 60).toString().length === 2 ? 
                                                    parseInt(this.state.videoPlayTimes.currentTime % 60) : 
                                                    "0" + parseInt(this.state.videoPlayTimes.currentTime % 60)
                                                ) : (
                                                    parseInt(this.state.videoPlayTimes.currentTime).toString().length === 2 ? 
                                                    parseInt(this.state.videoPlayTimes.currentTime) : 
                                                    "0" + parseInt(this.state.videoPlayTimes.currentTime)
                                                )
                                            }`
                                        }</Text>
                                        <Slider
                                            step={0.01}
                                            value={this.state.videoPlayTimes.currentTime} 
                                            onValueChange={value => {
                                                this.setState({isLoading: true})
                                                let seekTime = value * (this.state.videoPlayTimes.currentTime / this.state.videoPlayTimes.seekableDuration) * 1000;
                                                this.player.seek(seekTime);
                                                this.state.videoPlayTimes.currentTime = seekTime;
                                                this.setState({isLoading: false})
                                            }} 
                                            onSlidingComplete={() => console.log("Slide complete")}
                                            minimumValue={0}
                                            maximumValue={this.state.videoPlayTimes.seekableDuration}
                                            style={{
                                                width: "65%",
                                                height: 10,
                                                borderRadius: 5,
                                            }}
                                            minimumTrackTintColor="blue"
                                            maximumTrackTintColor="gray"
                                        />
                                        <Text
                                            style={{
                                                width: "15%",
                                                paddingLeft: "3%",
                                                fontFamily: "Poopins-Regular",
                                                color: "#fff"
                                            }}
                                        >{
                                            `${
                                                parseInt(this.state.videoPlayTimes.seekableDuration) >= 60 ? (
                                                    parseInt(this.state.videoPlayTimes.seekableDuration / 60).toString().length === 2 ? 
                                                    parseInt(this.state.videoPlayTimes.seekableDuration / 60) : 
                                                    "0" + parseInt(this.state.videoPlayTimes.seekableDuration / 60)
                                                ) : "00"
                                            }:${
                                                parseInt(this.state.videoPlayTimes.seekableDuration) >= 60 ? (
                                                    parseInt(this.state.videoPlayTimes.seekableDuration % 60).toString().length === 2 ? 
                                                    parseInt(this.state.videoPlayTimes.seekableDuration % 60) : 
                                                    "0" + parseInt(this.state.videoPlayTimes.seekableDuration % 60)
                                                ) : (
                                                    parseInt(this.state.videoPlayTimes.seekableDuration).toString().length === 2 ? 
                                                    parseInt(this.state.videoPlayTimes.seekableDuration) : 
                                                    "0" + parseInt(this.state.videoPlayTimes.seekableDuration)
                                                )
                                            }`
                                        }</Text>
                                    </View> */}
                                </View>
                        )}
                    />
                }                
            </LinearGradient>   
            {
                this.state.postType === 'image' &&
                <TouchableOpacity
                    style={{
                        position: 'absolute',
                        top: heightToDp(`${this.state.postType === "video" ? 10 : 2}%`),
                        left: widthToDp("3.5%"),
                        backgroundColor: "#1b1b1b",
                        height: 50, 
                        width: 50,
                        borderRadius: 50 / 2,
                        justifyContent: 'center',
                        flexDirection: 'row',
                        alignItems: 'center'
                    }}
                    activeOpacity={0.7}
                    onPress={() => this.props.navigation.goBack()}
                >
                    <Icon
                        name="chevron-left"
                        color="#fff"
                        size={Platform.isPad ? 30 : 20}                    
                    />  
                </TouchableOpacity> 
            }
            {
                !(this.props.route && this.props.route.params && this.props.route.params.hideFunctionalities) &&
                <View
                    style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        backgroundColor: '#1b1b1b',
                        paddingTop: heightToDp("5%"),
                        paddingHorizontal: widthToDp("3%")
                    }}
                >           
                    {
                        this.state.captionEditable ? 
                        <TextInput
                            style={{
                                color: '#fff',
                                fontSize: widthToDp("3.5%"),
                                width: widthToDp((this.props.route.params.type === "otherUserPost" || this.props.route.params.noEditCaption) ? "88%" : "83%"),
                                borderBottomWidth: (this.state.captionEditable && this.props.route.params.type !== "otherUserPost") ? 1 : 0,
                                borderBottomColor: '#fff',
                                fontFamily: "Poppins-Regular"
                            }}
                            multiline
                            defaultValue={this.state.postCaption}
                            editable={this.state.captionEditable}
                            onChangeText={text => this.setState({postCaption: text.trim()})}
                        /> :
                        <Autolink
                            component={Text}
                            stripPrefix={false}
                            text={
                                (
                                    this.state.postCaption === null || this.state.postCaption === "null"
                                ) ? "" : this.state.postCaption
                            }
                            style={{
                                color: '#fff',
                                fontSize: widthToDp("3.5%"),
                                width: widthToDp((this.props.route.params.type === "otherUserPost" || this.props.route.params.noEditCaption) ? "88%" : "83%"),
                                borderBottomWidth: (this.state.captionEditable && this.props.route.params.type !== "otherUserPost") ? 1 : 0,
                                borderBottomColor: '#fff',
                                fontFamily: "Poppins-Regular"
                            }}
                            email
                            url
                            linkStyle={{
                                color: '#fff', 
                                textDecorationLine: "underline",
                                fontFamily: "Poppins-Regular", 
                                fontSize: widthToDp("3.5%")
                            }}
                        />  
                    }
                    {
                        this.props.route.params.type !== "otherUserPost" && !this.props.route.params.noEditCaption &&
                        <TouchableOpacity
                            activeOpacity={0.7}
                            style={{
                                marginLeft: widthToDp("5%")
                            }}
                            disabled={this.state.isUpdatingCaption}
                            onPress={this.updateCaption}
                        >
                            {
                                this.state.otherProfile === false ? ((this.state.isUpdatingCaption) ? <ActivityIndicator size="small" color="#fff"/> :<Icon
                                name={this.state.captionEditable ? "paper-plane" : "pen"}
                                color="#fff"
                                size={Platform.isPad ? 25 : 20}                    
                            />):null
                            } 
                        </TouchableOpacity>  
                    }                              
                </View>  
            }      
            {
                !(this.props.route && this.props.route.params && this.props.route.params.hideFunctionalities) &&
                <View
                    style={{
                        flex: 1,
                        backgroundColor: '#1b1b1b',
                        alignSelf: 'flex-end',
                        paddingHorizontal: widthToDp("3%"),
                        paddingTop: this.state.postType === "image" ? heightToDp("3%") : heightToDp("5%"),
                        paddingBottom: heightToDp("1%"),
                        flexDirection: 'row',
                        alignItems: 'center'
                    }}
                >
                    <TouchableOpacity
                        activeOpacity={0.7}
                        onPress={this.likeImage}
                        disabled={this.state.isLoading || (this.props.route && this.props.route.params && this.props.route.params.type === "otherUserPost")}
                    >
                        {
                            this.state.isLiked ?
                            <Icon1
                                name="heart"
                                color={"#ff0000"}
                                size={Platform.isPad ? 30 : 20}
                            /> :
                            <Icon
                                name="heart"
                                color={"#fff"}
                                size={Platform.isPad ? 30 : 20}
                            />
                        }
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => {
                            if(this.player) this.player = undefined;
                            this.props.navigation.navigate("PostLikedUsersList", {postId: this.props.route.params.image.post_id});
                        }}
                    >
                        <Text
                            style={{
                                color: "#fff",
                                fontSize: Platform.OS==='android' ? widthToDp("2.5%") : Platform.isPad ? widthToDp("3%") : widthToDp("3.5%"),
                                paddingLeft: widthToDp("2%"),
                                fontFamily: "Poppins-Regular"
                            }}
                        >{this.state.numberOfLikes}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        activeOpacity={0.7}
                        style={{paddingLeft: widthToDp("4%")}}
                        onPress={() => {
                            if(this.player) this.player = undefined;
                            this.props.navigation.navigate("CommentScreen", {post: this.props.route.params.image});
                        }}
                        disabled={!this.state.otherProfile && this.props.route && this.props.route.params && this.props.route.params.type === "otherUserPost"}
                    >
                        <Icon
                            name="comment"
                            color="#fff"
                            size={Platform.isPad ? 30 : 20}
                        />
                    </TouchableOpacity>
                    <Text
                        style={{
                            color: "#fff",
                            fontSize: Platform.OS==='android' ? widthToDp("2.5%") : Platform.isPad ? widthToDp("3%") : widthToDp("3.5%"),
                            paddingLeft: widthToDp("2%"),
                            fontFamily: "Poppins-Regular"
                        }}
                    >{this.props.route.params.commentCount ? this.props.route.params.commentCount : this.state.numberOfComments}</Text>
                    
                    {
                        this.state.otherProfile === false ? (
                            (this.props.route.params.type !== "otherUserPost") ? 
                            <TouchableOpacity
                                style={{paddingLeft: widthToDp("4%")}}
                                onPress={this.deleteImage}
                            >
                                <Icon
                                    name="trash-alt"
                                    color="#fff"
                                    size={Platform.isPad ? 30 : 20}
                                />
                            </TouchableOpacity> : 
                            null
                        ) : (
                            <TouchableOpacity
                                style={{paddingLeft: widthToDp("4%")}}
                                onPress={this.reportPost}
                            >
                                <Icon2
                                    name={Platform.OS === 'android' ? 'md-alert-circle-outline' : 'ios-alert-circle-outline'}
                                    color="#fff"
                                    size={Platform.isPad ? 40 : 25}
                                />
                            </TouchableOpacity>
                        )
                    }            
                </View> 
            }
             
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
                        width: "14%",
                        position: 'absolute',
                        top: "40%",
                        alignSelf: "center",
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
        </ScrollView> :
        <KeyboardAvoidingView behavior="padding" style={{flex:1, backgroundColor: '#1b1b1b'}}>
            <StatusBar backgroundColor="#69abff" barStyle={Platform.OS==='android' ? "light-content" : "dark-content"} />            
            <LinearGradient
                style={{
                    flex: 0.85,
                    paddingTop: heightToDp(`${this.state.postUrl.length !== 0 ? this.state.postType === "image" ? 4 : 0 : 90}%`
                )}}
                colors={['#fff', '#1b1b1b']}
            >
                {
                    (this.state.postUrl && this.state.postUrl.length > 0) &&
                    <FlatList
                        data={this.state.postUrl}
                        horizontal={true}
                        showsHorizontalScrollIndicator={false}
                        ItemSeparatorComponent={() => <View style={{width: widthToDp("5%")}}/>}
                        renderItem={({item, index}) => (
                            this.state.postType === "image" ?
                            <>
                                <Image
                                    resizeMode="contain"
                                    style={{ height: heightToDp("80%"), width: widthToDp("100%") }}
                                    source={{ uri: item.post_url}}
                                    onLoadStart={() => {
                                        // console.warn(item.id);
                                        this.state.postUrl.map(element => {
                                            if(item.id === element.id) {
                                                element.isLoading = true;
                                            }
                                        })
                                    }}
                                    onLoad={() => {
                                        // console.warn(item.id);
                                        this.state.postUrl.map(element => {
                                            if(item.id === element.id) {
                                                element.isLoading = false;
                                            }
                                        })
                                    }}
                                />
                                {item.isLoading &&
                                 <ActivityIndicator size="large" />
                                }
                            </> :
                            <View
                                style={{
                                    height: (this.props.route && this.props.route.params && this.props.route.params.hideFunctionalities) ? heightToDp("100%") : heightToDp("80%")
                                }}
                            >
                                <VideoPlayer
                                    source={{ uri: item.post_url }}
                                    ref={(ref) => {
                                        this.player = ref
                                    }}
                                    ignoreSilentSwitch="ignore"
                                    onLoadStart={() => this.setState({isLoading: true})}
                                    onLoad={() => this.setState({isLoading: false})}
                                    navigator={this.props.navigation}
                                    repeat
                                    style={{
                                        height: heightToDp("70%"),
                                        width: widthToDp("100%"),
                                        alignSelf: 'center',
                                    }}
                                    resizeMode="contain"
                                />
                            </View>
                        )}
                    />
                }      
            </LinearGradient>   
            <View
                style={{
                    flex: 0.15
                }}
            >
                {
                    !(this.props.route && this.props.route.params && this.props.route.params.hideFunctionalities) &&
                    <View
                        style={{
                            flex: 0.5,
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            backgroundColor: '#1b1b1b',
                            // paddingTop: heightToDp("5%"),
                            paddingHorizontal: widthToDp("3%")
                        }}
                    >           
                        {
                            this.state.captionEditable ? 
                            <TextInput
                                style={{
                                    color: '#fff',
                                    fontSize: widthToDp("3.5%"),
                                    width: widthToDp((this.props.route.params.type === "otherUserPost" || this.props.route.params.noEditCaption) ? "88%" : "83%"),
                                    borderBottomWidth: (this.state.captionEditable && this.props.route.params.type !== "otherUserPost") ? 1 : 0,
                                    borderBottomColor: '#fff',
                                    fontFamily: "Poppins-Regular"
                                }}
                                multiline
                                defaultValue={this.state.postCaption}
                                editable={this.state.captionEditable}
                                onChangeText={text => this.setState({postCaption: text.trim()})}
                            /> :
                            <Autolink
                                component={Text}
                                stripPrefix={false}
                                text={
                                    (
                                        this.state.postCaption === null || this.state.postCaption === "null"
                                    ) ? "" : this.state.postCaption
                                }
                                style={{
                                    color: '#fff',
                                    fontSize: widthToDp("3.5%"),
                                    width: widthToDp((this.props.route.params.type === "otherUserPost" || this.props.route.params.noEditCaption) ? "88%" : "83%"),
                                    borderBottomWidth: (this.state.captionEditable && this.props.route.params.type !== "otherUserPost") ? 1 : 0,
                                    borderBottomColor: '#fff',
                                    fontFamily: "Poppins-Regular"
                                }}
                                email
                                url
                                linkStyle={{
                                    color: '#fff', 
                                    textDecorationLine: "underline",
                                    fontFamily: "Poppins-Regular", 
                                    fontSize: widthToDp("3.5%")
                                }}
                            />  
                        }
                        {
                            this.props.route.params.type !== "otherUserPost" && !this.props.route.params.noEditCaption &&
                            <TouchableOpacity
                                activeOpacity={0.7}
                                style={{
                                    marginLeft: widthToDp("5%")
                                }}
                                disabled={this.state.isUpdatingCaption}
                                onPress={this.updateCaption}
                            >
                                {
                                    this.state.otherProfile === false ? ((this.state.isUpdatingCaption) ? <ActivityIndicator size="small" color="#fff"/> :<Icon
                                    name={this.state.captionEditable ? "paper-plane" : "pen"}
                                    color="#fff"
                                    size={Platform.isPad ? 25 : 20}                    
                                />):null
                                } 
                            </TouchableOpacity>  
                        }                              
                    </View>  
                }   
                {
                    !this.state.keyboardOpened &&
                    !(this.props.route && this.props.route.params && this.props.route.params.hideFunctionalities) &&
                    <View
                        style={{
                            flex: 0.5,
                            backgroundColor: '#1b1b1b',
                            alignSelf: 'flex-end',
                            paddingHorizontal: widthToDp("3%"),
                            // paddingTop: this.state.postType === "image" ? heightToDp("3%") : heightToDp("5%"),
                            // paddingBottom: heightToDp("1%"),
                            flexDirection: 'row',
                            alignItems: 'center'
                        }}
                    >
                        <TouchableOpacity
                            activeOpacity={0.7}
                            onPress={this.likeImage}
                            disabled={this.state.isLoading || (this.props.route && this.props.route.params && this.props.route.params.type === "otherUserPost")}
                        >
                            {
                                this.state.isLiked ?
                                <Icon1
                                    name="heart"
                                    color={"#ff0000"}
                                    size={Platform.isPad ? 30 : 20}
                                /> :
                                <Icon
                                    name="heart"
                                    color={"#fff"}
                                    size={Platform.isPad ? 30 : 20}
                                />
                            }
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => {
                                if(this.player) this.player = undefined;
                                this.props.navigation.navigate("PostLikedUsersList", {postId: this.props.route.params.image.post_id});
                            }}
                        >
                            <Text
                                style={{
                                    color: "#fff",
                                    fontSize: Platform.OS==='android' ? widthToDp("2.5%") : Platform.isPad ? widthToDp("3%") : widthToDp("3.5%"),
                                    paddingLeft: widthToDp("2%"),
                                    fontFamily: "Poppins-Regular"
                                }}
                            >{this.state.numberOfLikes}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            activeOpacity={0.7}
                            style={{paddingLeft: widthToDp("4%")}}
                            onPress={() => {
                                if(this.player) this.player = undefined;
                                this.props.navigation.navigate("CommentScreen", {post: this.props.route.params.image});
                            }}
                            disabled={!this.state.otherProfile && this.props.route && this.props.route.params && this.props.route.params.type === "otherUserPost"}
                        >
                            <Icon
                                name="comment"
                                color="#fff"
                                size={Platform.isPad ? 30 : 20}
                            />
                        </TouchableOpacity>
                        <Text
                            style={{
                                color: "#fff",
                                fontSize: Platform.OS==='android' ? widthToDp("2.5%") : Platform.isPad ? widthToDp("3%") : widthToDp("3.5%"),
                                paddingLeft: widthToDp("2%"),
                                fontFamily: "Poppins-Regular"
                            }}
                        >{this.props.route.params.commentCount ? this.props.route.params.commentCount : this.state.numberOfComments}</Text>
                        
                        {
                            this.state.otherProfile === false ? (
                                (this.props.route.params.type !== "otherUserPost") ? 
                                <TouchableOpacity
                                    style={{paddingLeft: widthToDp("4%")}}
                                    onPress={this.deleteImage}
                                >
                                    <Icon
                                        name="trash-alt"
                                        color="#fff"
                                        size={Platform.isPad ? 30 : 20}
                                    />
                                </TouchableOpacity> : 
                                null
                            ) : (
                                <TouchableOpacity
                                    style={{paddingLeft: widthToDp("4%")}}
                                    onPress={this.reportPost}
                                >
                                    <Icon2
                                        name={Platform.OS === 'android' ? 'md-alert-circle-outline' : 'ios-alert-circle-outline'}
                                        color="#fff"
                                        size={Platform.isPad ? 40 : 25}
                                    />
                                </TouchableOpacity>
                            )
                        }            
                    </View> 
                }
            </View>  
            {
                this.state.postType === 'image' &&
                <TouchableOpacity
                    style={{
                        position: 'absolute',
                        top: "8%",
                        left: "3%",
                        backgroundColor: "#1b1b1b",
                        height: 50, 
                        width: 50,
                        borderRadius: 50 / 2,
                        justifyContent: 'center',
                        flexDirection: 'row',
                        alignItems: 'center'
                    }}
                    activeOpacity={0.7}
                    onPress={() => this.props.navigation.goBack()}
                >
                    <Icon
                        name="chevron-left"
                        color="#fff"
                        size={Platform.isPad ? 30 : 20}                    
                    />  
                </TouchableOpacity> 
            }
               
            
             
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
                        width: "14%",
                        position: 'absolute',
                        top: "40%",
                        alignSelf: "center",
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
        </KeyboardAvoidingView>
    )
}
import React from 'react';
import { AppState, ActivityIndicator, Alert, FlatList, Image, Platform, RefreshControl, SafeAreaView, ScrollView, StatusBar, Text, Touchable, TouchableOpacity, View, ImageBackground, Dimensions } from 'react-native';
import { Card, Toast } from 'native-base'
import Icon from 'react-native-vector-icons/FontAwesome5';
import Icon1 from 'react-native-vector-icons/FontAwesome';
import Icon2 from 'react-native-vector-icons/Ionicons';
import ShareIcon from 'react-native-vector-icons/EvilIcons'
import BottomTab from '../../components/BottomTab';
import Header from '../../components/Header';
import { heightToDp, widthToDp } from '../../components/Responsive';
import Accordion from 'react-native-collapsible/Accordion';
import axios from 'axios';
import RBSheet from 'react-native-raw-bottom-sheet';
import RBSheet1 from 'react-native-raw-bottom-sheet';
import RBSheet2 from 'react-native-raw-bottom-sheet';
import DataAccess from '../../components/DataAccess';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FlatGrid } from 'react-native-super-grid'
import { element, number } from 'prop-types';
import Share from 'react-native-share'
import Video from 'react-native-video'
import PushNotificationController from '../../components/PushNotificationController';
import Autolink from 'react-native-autolink';

export default class HomeScreen extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            activeSections: [],
            isLoading: false,
            userList: [],
            followingList: [],
            expand: false,
            postDetails: [],
            isRefreshing: false,
            isRefreshingFeed: false,
            userId: '',
            sharepostID: '',
            shouldPlay: false,
            isLoading: false,
            appState: AppState.currentState
        }
    }

    componentDidMount() {
        // AppState.addEventListener('change', this._handleAppStateChange);
        this.unsubscribe = this.props.navigation.addListener("focus", () => {
            this.setState({isLoading: true})
            this.fetchHomeListing();
            this.userId()
        })
        this.setState({isLoading: true})
        this.fetchHomeListing();
        this.userId()
    }

    componentWillUnmount() {
        // AppState.removeEventListener('change', this._handleAppStateChange);
        this.unsubscribe()
    }

    _handleAppStateChange = (nextAppState) => {
        if (this.state.appState.match(/inactive|background/) && nextAppState === 'active') {
          console.log('App has come to the foreground!')
        }
        this.setState({expand: false, postDetails: [], appState: nextAppState}, () => {
            this.props.navigation.reset({
                index: 0,
                routes: [
                    { name: "HomeScreen" }
                ]
            })
        });
    }

    userId = async () => {
        let user_id = await AsyncStorage.getItem('userId')
        this.setState({ userId: user_id })
        //alert(this.state.userId)
    }

    fetchHomeListing = async (type) => {
        if (type === "pullRefresh") { this.setState({ userList: [], followingList: [] }) }
        var userList = [], followingList = [];
        let userId = await AsyncStorage.getItem("userId");
        await axios.get(DataAccess.BaseUrl + DataAccess.friendBlockList + "/" + userId, DataAccess.AuthenticationHeader)
            .then(async response => {
                // console.warn(response.data.total_feed_response)
                if (response.data.status === "success") {
                    userList = [];
                    response.data.total_feed_response.friend_list.map(item => item.expand = false);
                    followingList = response.data.total_feed_response.friend_list;
                    console.log(response.data.total_feed_response.friend_list);
                    if(this.state.activeSections.length > 0) {
                        followingList.map((item, index) => {
                            if(index === this.state.activeSections[0]) {
                                item.expand = true;
                            } 
                        })
                        this.setState({isAccordianOpening: true, loadingPosts: true});
                        // console.warn(this.state.followingList[this.state.activeSections[0]]);
                        this.friendsBlockDetails(followingList[this.state.activeSections[0]].friend_id)
                    }
                } else if (response.data.status === "error") {
                    await axios.post(DataAccess.BaseUrl + DataAccess.userList, {
                        "log_userID": userId
                    }, DataAccess.AuthenticationHeader)
                        .then(function (responseUserList) {
                            if (responseUserList.data.resp === "success") {
                                responseUserList.data.all_user_list = responseUserList.data.all_user_list.filter(item => String(item.user_id) !== userId)
                                userList = responseUserList.data.all_user_list;
                                followingList = [];
                            } else {
                                userList = [];
                                followingList = [];
                            }
                        })
                        .catch(function (error) {
                            console.log(error);
                        })
                }

            })
            .catch(async error => {
                console.log(error);
                await axios.post(DataAccess.BaseUrl + DataAccess.userList, {
                    "log_userID": userId
                }, DataAccess.AuthenticationHeader)
                    .then(function (responseUserList) {
                        if (responseUserList.data.resp === "success") {
                            responseUserList.data.all_user_list = responseUserList.data.all_user_list.filter(item => String(item.user_id) !== userId)
                            userList = responseUserList.data.all_user_list;
                            followingList = [];
                        } else {
                            userList = [];
                            followingList = [];
                        }
                    })
                    .catch(function (error) {
                        console.log(error);
                    })
            })
        let noPostUsers = [], postUsers = [];
        followingList.length > 0 &&
            followingList.map(element => {
                if (element.have_post === "No") {
                    noPostUsers.push(element);
                } else {
                    postUsers.push(element);
                }
            })
        this.setState({ userList, followingList: [...postUsers, ...noPostUsers], isRefreshing: false, isRefreshingFeed: false })
        //this.RBSheet1.close();
        this.setState({isLoading: false})
    }

    _renderSectionTitle = section => {
        return (
            <View >
                <Text style={{fontFamily: "Poppins-Regular"}}>{section.content}</Text>
            </View>
        );
    };

    followUser = async (item, index) => {
        this.RBSheet.open();
        let userId = await AsyncStorage.getItem("userId"), response;
        if (item.user_is_flollowers === "No") {
            response = await axios.post(DataAccess.BaseUrl + DataAccess.followUser, {
                "user_one_id": userId,
                "user_two_id": item.user_id
            }, DataAccess.AuthenticationHeader);
        } else {
            response = await axios.post(DataAccess.BaseUrl + DataAccess.followBack, {
                "login_userID": userId,
                "userID": item.user_id
            }, DataAccess.AuthenticationHeader);
        }
        if (response.data.status === "success") {
            this.fetchHomeListing();
            Toast.show({
                text: item.user_is_flollowers === "No" ? "Follow successful" : response.data.message,
                type: "success",
                duration: 2000
            })
        } else {
            Toast.show({
                text: response.data.message,
                type: "warning",
                duration: 2000
            })
        }
        this.RBSheet.close();
    }

    _renderHeader = section => {
        return (
            <View >
                <Card style={{ paddingHorizontal: widthToDp("1%"), width: widthToDp("95%"), alignSelf: 'center', borderRadius: 10 }}>
                    <View style={{ flexDirection: 'row' }}>
                        <TouchableOpacity onPress={() => this.props.navigation.navigate('ProfileScreen', { profile_id: section.friend_id })}>
                            <Image
                                source={{ uri: section.friend_photo }}
                                style={{ marginVertical: heightToDp("1.5%"), height: heightToDp("12%"), width: widthToDp("24%"), marginLeft: widthToDp("2%"), borderRadius: 10 }}
                            />
                        </TouchableOpacity>
                        <View style={{
                            justifyContent: "center",
                            paddingHorizontal: widthToDp("2%"),
                            width: "65%"
                        }}>
                            <Text style={{fontFamily: "Poppins-Regular", fontSize: Platform.isPad ? widthToDp('3%') : widthToDp('3.5%'), textAlign: "left"}}>{section.friend_name || "Anonymous User"}</Text>
                            {
                                section.today_post !== "" ?
                                    <View>
                                        <Text style={{ color: '#ff0000', fontFamily: "Poppins-Regular", fontSize: Platform.isPad ? widthToDp('2.5%') : widthToDp('3%') }}>{Number(section.today_post) === 1 ? section.today_post + " New Post" : section.today_post + " New Posts"}</Text>
                                    </View> :(
                                        Number(section.past_post_days) !== 0 &&
                                        <View>
                                            <Text style={{ color: '#f1b45c', fontFamily: "Poppins-Regular", fontSize: Platform.isPad ? widthToDp('2.5%') : widthToDp('3%'), textAlign: "left" }}>
                                                Posted {
                                                    Number(section.past_post_days) > 365 ? (
                                                        String(parseInt(Number(section.past_post_days) / 365)) + " " + ((Number(section.past_post_days) / 365) === 1 ? "year " : "years ")
                                                    ) : Number(section.past_post_days) > 30 ? (
                                                        String(parseInt(Number(section.past_post_days) / 30)) + " " + ((Number(section.past_post_days) / 30) === 1 ? "month " : "months ")
                                                    ) : (
                                                        String(section.past_post_days) + " " + (Number(section.past_post_days) === 1 ? "day " : "days ")
                                                    ) 
                                                }ago
                                            </Text>
                                        </View>
                                    )
                            }
                        </View>
                        {
                            section.unread_post_number === "" ?
                                <View style={{ position: 'absolute', top: Platform.isPad ? heightToDp("0.5%") : 0, right: widthToDp('1%') }}>
                                    <Image
                                        source={require("../../../assets/ago.png")}
                                        resizeMode="contain"
                                        style={{ height: Platform.isPad ? heightToDp("4.5%") : heightToDp("6%"), width: Platform.isPad ? widthToDp("4.5%") : widthToDp("6%") }}
                                    />
                                </View> :
                                <TouchableOpacity
                                    activeOpacity={0.7}
                                    style={{ position: 'absolute', top: 0, right: widthToDp('1%') }}
                                    onPress={() => this.props.navigation.navigate("NotificationScreen")}
                                >
                                    <Image
                                        source={require("../../../assets/notification.png")}
                                        resizeMode="contain"
                                        style={{ 
                                            height: Platform.isPad ? heightToDp("5%") : heightToDp("6%"), 
                                            width: Platform.isPad ? widthToDp("5%") : widthToDp("6%"),
                                            position: 'absolute',
                                            top: heightToDp("1%"),
                                            right: Platform.isPad ? widthToDp("0.5%") : widthToDp('1.5%')
                                        }}
                                    />
                                    <View
                                        style={{
                                            position: "absolute",
                                            top: Platform.isPad ? heightToDp("1%") : heightToDp("1.5%"),
                                            right: widthToDp("0.5%"),
                                            backgroundColor: "#ff0000",
                                            borderRadius: Platform.isPad ? 36 / 2 :18 / 2,
                                            height: Platform.isPad ? 36 : 18,
                                            width: Platform.isPad ? 36 : 18,
                                            paddingHorizontal: 2,
                                        }}
                                    >
                                        <Text
                                            style={[{
                                                color: "#fff",
                                                fontSize: widthToDp("3.2%"),
                                                fontFamily: "Poppins-Regular",
                                                textAlign: "center"
                                            }, Platform.isPad && {fontSize: widthToDp('2.5%')}]}
                                        >{section.unread_post_number}</Text>
                                    </View>
                                </TouchableOpacity>
                        }
                        
                        <TouchableOpacity
                            activeOpacity={0.7}
                            onPress={() => this.props.navigation.reset({
                                index: 0,
                                routes: [{
                                    name: "InboxScreen", 
                                    params: { friendId: section.friend_id, friendImage: section.friend_photo, friendName: section.friend_name }
                                }]
                            })}
                            style={{ position: 'absolute', bottom: heightToDp("1%"), right: widthToDp('1%') }}>
                            <Icon2
                                name={Platform.OS === "android" ? 'md-chatbox-ellipses-outline' : 'ios-chatbox-ellipses-outline'}
                                size={Platform.isPad ? 40 : 23}
                                color={"#69abff"}
                            />
                        </TouchableOpacity>

                    </View>
                </Card>
            </View>
        );
    };

    likePost = async (item) => {
        let posts = this.state.postDetails;
            posts.map(i => {
                if (i.post_id === item.post_id) {
                    i.isLiking = true;
                }
            })
            this.setState({ postDetails: posts });
        let userId = await AsyncStorage.getItem("userId");
        let response = await axios.get(DataAccess.BaseUrl + DataAccess.likePost + "/" + userId + "/" + item.post_id, DataAccess.AuthenticationHeader);
        if (response.data.status === "success") {
            let posts = this.state.postDetails;
            posts.map(i => {
                if (i.post_id === item.post_id) {
                    i.log_user_like_status === "No" ? i.number_of_like += 1 : i.number_of_like -= 1;
                    i.log_user_like_status = i.log_user_like_status === "No" ? "Yes" : "No";
                    i.isLiking = false;
                }
            })
            this.setState({ postDetails: posts });
        } else {
            //
        }
    }

    reportPost = async (i) => {
        Alert.alert(
            "Do you want to report on this post?", 
            "Reported post will be deleted from this user block. This content will be reviewed by the admin and if it violates the terms, then the admin will take necessary actions.", 
            [
                {
                    text: "Cancel"
                }, 
                {
                    text: "Ok",
                    onPress: async () => {
                        let userId = await AsyncStorage.getItem("userId");
                        await axios.get(DataAccess.BaseUrl + DataAccess.reportPost + "/" + userId + "/" + i.post_id, DataAccess.AuthenticationHeader)
                            .then(res => {
                                console.log("Report Post Response ==> ", res.data);
                                if(res.data.resp === "true") {
                                    let posts = this.state.postDetails;
                                    posts.map((item, index) => {
                                        if (i.post_id === item.post_id) {
                                            posts.splice(index, 1);
                                        }
                                    })
                                    this.setState({ postDetails: posts });
                                    Toast.show({
                                        type: "success",
                                        text: res.data.message,
                                        duration: 2000
                                    })
                                } else if(res.data.resp === "false") {
                                    Toast.show({
                                        type: "warning",
                                        text: res.data.message,
                                        duration: 2000
                                    })
                                } else {
                                    Toast.show({
                                        type: "danger",
                                        text: "Some error happened. Please retry!",
                                        duration: 2000
                                    })
                                }
                            })
                            .catch(err => {
                                console.log(err);
                                Toast.show({
                                    type: "danger",
                                    text: "Either client or server side network error !!!",
                                    duration: 2000
                                })
                            })
                    }
                }
            ]
        )
    }

    _renderContent = section => {
        var postDetails = []
        postDetails = this.state.postDetails
        console.log(postDetails);
        return (
            <View >
                {
                    this.state.isAccordianOpening ?
                        <View style={{ 
                            height: Platform.OS==='android' ? heightToDp("100%") : heightToDp("83%"), 
                            // paddingVertical: Platform.OS==='android' ? undefined : heightToDp("25%"), 
                            backgroundColor: "#fff", 
                            width: widthToDp("95%"), 
                            alignSelf: 'center', 
                            justifyContent: 'center', 
                            borderRadius: 10 
                        }}>
                            <ActivityIndicator size="large" color="#69abff" />
                        </View> : (
                            section.expand &&
                            postDetails && postDetails.length > 0 &&
                            <FlatList
                                data={postDetails}
                                keyExtractor={i => i.post_id}                           
                                refreshing={this.state.isRefreshingFeed}
                                onRefresh={() => this.setState({ isRefreshing: false, isRefreshingFeed: true }, () => this.friendsBlockDetails(this.state.followingList[this.state.activeSections[0]].friend_id, "pullRefresh"))}
                                style={{
                                    height: Platform.OS==='ios' ? heightToDp("83%") : heightToDp("100%"),
                                    alignSelf: 'center',
                                    borderRadius: 20,
                                    backgroundColor: "#fff",
                                    borderColor: "#fff",
                                    borderWidth: 1
                                }}
                                contentContainerStyle={{
                                    borderRadius: 20,
                                    // backgroundColor: "#fff",
                                    borderColor: "#fff",
                                    borderWidth: 1,
                                }}
                                nestedScrollEnabled
                                // ItemSeparatorComponent={() => <View style={{ borderWidth: 0.5, borderColor: '#cdcdcd', marginHorizontal: widthToDp("0%") }} />}
                                showsVerticalScrollIndicator={true}
                                // ItemSeparatorComponent={() => <View style={{ borderWidth: 0.5, borderColor: '#cdcdcd', marginHorizontal: widthToDp("4%") }} />}
                                renderItem={(i, key) => (
                                    <View style={{ width: widthToDp("95%"), paddingVertical: heightToDp('0%'), alignSelf: 'center' }} key={key}>
                                        {/* <View style={{ flexDirection: 'row' }}>
                                            <Image
                                                source={{ uri: section.friend_photo }}
                                                style={{ height: Platform.isPad ? 80 : 40, width: Platform.isPad ? 80 : 40, marginLeft: widthToDp("4%"), borderRadius: Platform.isPad ? 80 / 2 : 40 / 2, marginTop: heightToDp("2%") }}
                                            />
                                            <View>
                                                <View style={{ marginLeft: widthToDp("6%"), marginTop: heightToDp("2%") }}>
                                                    <Text style={{fontFamily: "Poppins-Regular", fontSize: widthToDp("3.5%")}}>{section.friend_name}</Text>
                                                </View>
                                                <View style={{ marginLeft: widthToDp("6%"), marginTop: heightToDp("0%") }}>
                                                    <Text style={{ color: '#69abff', fontFamily: "Poppins-Regular", fontSize: widthToDp("3%") }}>{i.item.post_time}</Text>
                                                </View>
                                            </View>
                                        </View> */}
                                        {/* {
                                            i.item.post_content !== "" &&
                                            <View
                                                style={{
                                                    flexDirection: 'row',
                                                    justifyContent: 'space-between',
                                                    alignItems: "flex-start",
                                                    paddingRight: "3%"
                                                }}
                                            >
                                                <View style={{ marginLeft: widthToDp("6%"), marginTop: heightToDp("1.5%"), width: "70%" }}>
                                                    <Text style={{ color: 'black', fontFamily: "Poppins-Regular", fontSize: widthToDp("4%") }}>{i.item.post_content}</Text>
                                                    <Autolink
                                                        component={Text}
                                                        text={
                                                            (
                                                                i.item.post_content === null || i.item.post_content === "null"
                                                            ) ? "" : i.item.post_content
                                                        }
                                                        style={{
                                                            color: '#1b1b1b', 
                                                            fontFamily: "Poppins-Regular", 
                                                            fontSize: widthToDp("4%")
                                                        }}
                                                        email
                                                        url
                                                        linkStyle={{
                                                            color: '#0000ff', 
                                                            textDecorationLine: "underline",
                                                            fontFamily: "Poppins-Regular", 
                                                            fontSize: widthToDp("4%")
                                                        }}
                                                    />
                                                </View>
                                                <TouchableOpacity
                                                    style={{
                                                        flexDirection: 'row',
                                                        alignItems: "center",
                                                        marginRight: widthToDp("6%"),
                                                        marginTop: heightToDp("1.5%"),
                                                    }}
                                                    onPress={() => this.reportPost(i.item)}>
                                                    <Icon2
                                                        name={Platform.OS === 'android' ? 'md-alert-circle-outline' : 'ios-alert-circle-outline'}
                                                        // color="#ff0000"
                                                        size={Platform.isPad ? 60 : 35}
                                                    />
                                                </TouchableOpacity>
                                            </View>
                                        } */}
                                        {
                                            i.item.post_type === "video" &&  i.item.post_img_video_live.length > 0 &&
                                            <FlatList
                                                data={i.item.post_img_video_live}
                                                // style={{
                                                //     padding: widthToDp("2%")
                                                // }}    
                                                showsHorizontalScrollIndicator={true}
                                                renderItem={({ item, index }) => (
                                                    <TouchableOpacity
                                                        activeOpacity={0.7}
                                                        onPress={() => {
                                                            for(let j=0; j < i.item.post_img_video_live.length; j++) {
                                                                if(this[`player${j}`]) this[`player${j}`] = undefined;
                                                            }
                                                            this.setState({ shouldPlay: false, postDetails: [] });
                                                            this.props.navigation.navigate("ImagePreviewScreen", { image: { ...item, post_id: i.item.post_id }, otherProfile: this.state.otherProfile })
                                                        }}
                                                        style={{ 
                                                            alignSelf: 'center', 
                                                            // marginTop: heightToDp("2%") 
                                                        }}
                                                    >
                                                        <Video
                                                            source={{ uri: item.post_url }}
                                                            ref={(ref) => {
                                                                this[`player${index}`] = ref
                                                            }}
                                                            muted={item.isMuted}
                                                            repeat
                                                            key={index}
                                                            ignoreSilentSwitch="ignore"
                                                            // bufferConfig={{
                                                            //     minBufferMs: 1, 
                                                            //     maxBufferMs: 5,
                                                            //     bufferForPlaybackMs: 0,
                                                            //     bufferForPlaybackAfterRebufferMs: 5
                                                            // }}
                                                            // paused={!this.state.shouldPlay}
                                                            style={{
                                                                height: 500,
                                                                width: Dimensions.get("window").width * 0.95,
                                                                alignSelf: 'center',
                                                                
                                                                borderTopLeftRadius: 15, 
                                                                borderTopRightRadius: 15,
                                                                borderBottomLeftRadius: 15,
                                                                borderBottomRightRadius: 15,
                                                            }}
                                                            resizeMode="cover"
                                                        />
                                                        <View
                                                            style={{
                                                                position: "absolute",
                                                                top: 2,
                                                                left: 5,
                                                                flexDirection: "row",
                                                                justifyContent: "space-between",
                                                                alignItems: "flex-start"
                                                            }}
                                                        >
                                                            <View
                                                                style={{
                                                                    flexDirection: 'row',
                                                                    alignItems: "flex-start",
                                                                    width: "87%"
                                                                }}
                                                            >
                                                                <Image
                                                                    source={{ uri: section.friend_photo }}
                                                                    style={{ 
                                                                        height: Platform.isPad ? 80 : 70, 
                                                                        width: Platform.isPad ? 80 : 70, 
                                                                        marginHorizontal: widthToDp("1%"), 
                                                                        borderRadius: Platform.isPad ? 80 / 2 : 70 / 2, 
                                                                        marginTop: heightToDp("1%"),
                                                                        backgroundColor: "#ececec",
                                                                        borderColor: "#ececec",
                                                                        borderWidth: 2,
                                                                        // borderWidth: 1, 
                                                                    }}
                                                                />
                                                                <View 
                                                                    style={{                                                                    
                                                                        width: "73%",
                                                                        backgroundColor: "#474e6275",
                                                                        borderRadius: 15,
                                                                        paddingHorizontal: "3%",
                                                                        paddingVertical: "1%",
                                                                        marginTop: "2%" 
                                                                    }}
                                                                >
                                                                    {
                                                                        !(i.item.post_content === null || i.item.post_content === "null" || i.item.post_content === "") &&
                                                                        <Autolink
                                                                            component={Text}
                                                                            stripPrefix={false}
                                                                            text={
                                                                                (
                                                                                    i.item.post_content === null || i.item.post_content === "null"
                                                                                ) ? "" : (
                                                                                    i.item.post_content.length <= 70 ?
                                                                                    i.item.post_content.trim() : 
                                                                                    `${i.item.post_content.substring(0,70)}...`
                                                                                )
                                                                            }
                                                                            style={{
                                                                                color: '#fff', 
                                                                                fontFamily: "ProximaNova-Black", 
                                                                                fontSize: widthToDp("3.5%"),
                                                                                paddingHorizontal: "2%",
                                                                                paddingVertical: "2%", 
                                                                                // fontWeight: "800",                                                              
                                                                            }}
                                                                            email
                                                                            url
                                                                            linkStyle={{
                                                                                color: '#0000ff', 
                                                                                textDecorationLine: "underline",
                                                                                fontFamily: "ProximaNova-Black", 
                                                                                fontSize: widthToDp("3.5%"), 
                                                                                // fontWeight: "800",
                                                                            }}
                                                                        />
                                                                    }
                                                                    <Text style={{ color: "#fff", fontFamily: "Poppins-Regular", fontSize: widthToDp("2.5%"), paddingTop: !(i.item.post_content === null || i.item.post_content === "null" || i.item.post_content === "") ? "1%" : undefined }}>{i.item.post_time}</Text>
                                                                </View>                                                                
                                                            </View>
                                                            {
                                                                i.item.post_img_video_live.length > 1 &&
                                                                <View
                                                                    style={{
                                                                        backgroundColor: "#474e6275",
                                                                        borderRadius: 15,
                                                                        paddingHorizontal: 5,
                                                                        paddingVertical: 2,
                                                                        justifyContent: "center",
                                                                        alignItems: "center",
                                                                        marginTop: "2%" 
                                                                    }}
                                                                >
                                                                    <Text
                                                                        style={{
                                                                            fontFamily: "ProximaNova-Black",
                                                                            color: "#fff",
                                                                            fontSize: widthToDp("3%")
                                                                        }}
                                                                    >{(index + 1) + " / " + i.item.post_img_video_live.length}</Text>
                                                                </View>
                                                            }
                                                        </View>
                                                        <TouchableOpacity
                                                            style={{
                                                                position: "absolute",
                                                                bottom: 10,
                                                                right: 10,
                                                                backgroundColor: "#474e6275",
                                                                borderRadius: 15,
                                                                paddingHorizontal: 5,
                                                                paddingVertical: 2,
                                                                justifyContent: "center",
                                                                alignItems: "center",
                                                            }}
                                                            onPress={() => {
                                                                let postDetails = this.state.postDetails;
                                                                postDetails.map(x => {
                                                                    x.post_img_video_live.map(y => {
                                                                        if(item.id === y.id) {
                                                                            y.isMuted = !y.isMuted;
                                                                        } else {
                                                                            y.isMuted = true;
                                                                        }
                                                                    })
                                                                })
                                                                this.setState({postDetails})
                                                            }}
                                                        >
                                                            {
                                                                !item.isMuted ?
                                                                <Icon2
                                                                    name={Platform.OS==='android' ? "md-volume-high-outline" : "ios-volume-high-outline"}
                                                                    size={20}
                                                                    color="#fff"
                                                                /> :
                                                                <Icon2
                                                                    name={Platform.OS==='android' ? "md-volume-mute-outline" : "ios-volume-mute-outline"}
                                                                    size={20}
                                                                    color="#fff"
                                                                />
                                                            }
                                                        </TouchableOpacity>
                                                    </TouchableOpacity>
                                                )}
                                            />
                                        } 
                                        
                                        {(i.item.post_type === 'image') && 
                                            i.item.post_img_video_live.length > 0 &&
                                            <FlatList
                                                data={i.item.post_img_video_live}
                                                horizontal={true}
                                                // contentContainerStyle={{
                                                //     paddingHorizontal: widthToDp("4%")
                                                // }}    
                                                showsHorizontalScrollIndicator={true}
                                                ItemSeparatorComponent={() => <View style={{ width: widthToDp("2%") }} />}
                                                renderItem={({ item, index }) => {
                                                    console.log(i.item);
                                                    // Image.getSize(item.post_url, (width, height) => {
                                                    //     width = width;
                                                    //     height = height;
                                                    // })
                                                    return (
                                                    <TouchableOpacity
                                                        activeOpacity={0.7}
                                                        onPress={() => {
                                                            for(let j=0; j < i.item.post_img_video_live.length; j++) {
                                                                if(this[`player${j}`]) this[`player${j}`] = undefined;
                                                            }
                                                            this.setState({ shouldPlay: false, postDetails: [] });
                                                            this.props.navigation.navigate("ImagePreviewScreen", { image: { ...item, post_id: i.item.post_id }, otherProfile: this.state.otherProfile })
                                                        }}
                                                        style={{ 
                                                            alignSelf: 'center', 
                                                            // marginTop: heightToDp("2%") 
                                                        }}
                                                        key={index}
                                                    >
                                                        <Image
                                                            style={{ 
                                                                height: 500, 
                                                                width: Dimensions.get("window").width * 0.95,
                                                                borderTopLeftRadius: 15, 
                                                                borderTopRightRadius: 15,
                                                                borderBottomLeftRadius: 15,
                                                                borderBottomRightRadius: 15,
                                                                backgroundColor: "#ececec",
                                                                // width: widthToDp("100%"), 
                                                            }}
                                                            resizeMode="cover"                                                                        
                                                            source={{ uri: item.post_url }}
                                                        />
                                                        <View
                                                            style={{
                                                                position: "absolute",
                                                                top: 2,
                                                                left: 5,
                                                                flexDirection: "row",
                                                                justifyContent: "space-between",
                                                                alignItems: "flex-start"
                                                            }}
                                                        >
                                                            <View
                                                                style={{
                                                                    flexDirection: 'row',
                                                                    alignItems: "flex-start",
                                                                    width: "87%"
                                                                }}
                                                            >
                                                                <Image
                                                                    source={{ uri: section.friend_photo }}
                                                                    style={{ 
                                                                        height: Platform.isPad ? 80 : 70, 
                                                                        width: Platform.isPad ? 80 : 70, 
                                                                        marginHorizontal: widthToDp("1%"), 
                                                                        borderRadius: Platform.isPad ? 80 / 2 : 70 / 2, 
                                                                        marginTop: heightToDp("1%"),
                                                                        backgroundColor: "#ececec",
                                                                        borderWidth: 2,
                                                                        borderColor: "#ececec",
                                                                        // borderWidth: 1, 
                                                                    }}
                                                                />
                                                                <View
                                                                    style={{
                                                                        maxWidth: i.item.post_img_video_live.length > 1 ? "73%" : "100%",
                                                                        backgroundColor: "#474e6275",
                                                                        borderRadius: 15,
                                                                        paddingHorizontal: "3%",
                                                                        paddingVertical: "1%", 
                                                                        marginTop: "2%" 
                                                                    }}
                                                                >
                                                                    
                                                                    {
                                                                        !(i.item.post_content === null || i.item.post_content === "null" || i.item.post_content === "") &&
                                                                        <Autolink
                                                                            component={Text}
                                                                            stripPrefix={false}
                                                                            text={
                                                                                (
                                                                                    i.item.post_content === null || i.item.post_content === "null"
                                                                                ) ? "" : (
                                                                                    i.item.post_content.length <= 70 ?
                                                                                    i.item.post_content.trim() : 
                                                                                    `${i.item.post_content.substring(0,70)}...`
                                                                                )
                                                                            }
                                                                            style={{
                                                                                color: '#fff', 
                                                                                fontFamily: "ProximaNova-Black", 
                                                                                fontSize: widthToDp("3.5%"),
                                                                                // fontWeight: "800",                                                              
                                                                            }}
                                                                            email
                                                                            url
                                                                            linkStyle={{
                                                                                color: '#0000ff', 
                                                                                textDecorationLine: "underline",
                                                                                fontFamily: "ProximaNova-Black", 
                                                                                fontSize: widthToDp("3.5%"), 
                                                                                // fontWeight: "800",
                                                                            }}
                                                                        />
                                                                    }
                                                                    <Text style={{ color: "#fff", fontFamily: "Poppins-Regular", fontSize: widthToDp("2.5%"), paddingTop: !(i.item.post_content === null || i.item.post_content === "null" || i.item.post_content === "") ? "1%" : undefined }}>{i.item.post_time}</Text>
                                                                </View>                                                            
                                                            </View>
                                                            {
                                                                i.item.post_img_video_live.length > 1 &&
                                                                <View
                                                                    style={{
                                                                        backgroundColor: "#474e6275",
                                                                        borderRadius: 15,
                                                                        paddingHorizontal: 5,
                                                                        paddingVertical: 2,
                                                                        justifyContent: "center",
                                                                        alignItems: "center",
                                                                        marginTop: "2%" 
                                                                    }}
                                                                >
                                                                    <Text
                                                                        style={{
                                                                            fontFamily: "ProximaNova-Black",
                                                                            color: "#fff",
                                                                            fontSize: widthToDp("3%")
                                                                        }}
                                                                    >{(index + 1) + " / " + i.item.post_img_video_live.length}</Text>
                                                                </View>
                                                            }
                                                        </View>
                                                    </TouchableOpacity>
                                                )}}
                                            />   
                                        }

                                        <View
                                            style={{
                                                flexDirection: "row",
                                                alignItems: "center",
                                                justifyContent: "space-between"
                                            }}
                                        >
                                            <View
                                                style={{
                                                    flexDirection: 'row',
                                                    alignItems: 'center',
                                                    paddingVertical: heightToDp("1.5%"),
                                                    paddingHorizontal: widthToDp("4.5%"),
                                                    width: "60%"
                                                }}
                                            >
                                                <TouchableOpacity
                                                    onPress={() => this.likePost(i.item)}
                                                    activeOpacity={0.7}
                                                    disabled={i.item.isLiking}
                                                >
                                                    {
                                                        i.item.isLiking ? 
                                                        <ActivityIndicator size="small" color="#69abff" /> :
                                                        i.item.log_user_like_status === "No" ?
                                                            <Icon
                                                                name="heart"
                                                                color="#69abff"
                                                                size={Platform.isPad ? 35 : 23}
                                                            /> :
                                                            <Icon1
                                                                name="heart"
                                                                color="#ff0000"
                                                                size={Platform.isPad ? 35 : 23}
                                                            />
                                                    }
                                                </TouchableOpacity>
                                                <TouchableOpacity
                                                    onPress={() => this.props.navigation.navigate("PostLikedUsersList", {postId: i.item.post_id})}
                                                >
                                                    <Text
                                                        style={{
                                                            color: "#cdcdcd",
                                                            fontSize: Platform.isPad ? widthToDp("3%") : widthToDp("3.5%"),
                                                            paddingLeft: widthToDp("1%"),
                                                            fontFamily: "Poppins-Regular"
                                                        }}
                                                    >{i.item.number_of_like}</Text>
                                                </TouchableOpacity>
                                                <TouchableOpacity
                                                    onPress={() => this.props.navigation.navigate("CommentScreen", { post: i.item, type: "otherUserPost" })}
                                                >
                                                    <Icon
                                                        name="comment"
                                                        color="#69abff"
                                                        size={Platform.isPad ? 35 : 23}
                                                        style={{ paddingLeft: widthToDp("4%") }}
                                                    />
                                                </TouchableOpacity>
                                                <Text
                                                    style={{
                                                        color: "#cdcdcd",
                                                        fontSize: Platform.isPad ? widthToDp("3%") : widthToDp("3.5%"),
                                                        paddingLeft: widthToDp("1%"),
                                                        fontFamily: "Poppins-Regular"
                                                    }}
                                                >{i.item.number_of_comment}</Text>
                                                <Icon2
                                                    name={Platform.OS === 'android' ? 'md-arrow-redo-outline' : 'ios-arrow-redo-outline'}
                                                    color="#69abff"
                                                    size={Platform.isPad ? 40 : 25}
                                                    style={{ paddingLeft: widthToDp("4%") }}
                                                    onPress={() => this.setState({ sharepostID: i.item }, () => this.RBSheet2.open())}
                                                />
                                            </View>
                                            <TouchableOpacity
                                                style={{
                                                    flexDirection: 'row',
                                                    alignItems: "center",
                                                    marginRight: widthToDp("4%"),
                                                    // marginTop: heightToDp("1.5%"),
                                                }}
                                                onPress={() => this.reportPost(i.item)}>
                                                <Icon2
                                                    name={Platform.OS === 'android' ? 'md-alert-circle-outline' : 'ios-alert-circle-outline'}
                                                    // color="#ff0000"
                                                    size={Platform.isPad ? 60 : 35}
                                                />
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                )}
                            />
                        )
                }
                {/* {
                    this.state.postDetails.map((i) => {
                        <Text>hi</Text>
                    })
                } */}

            </View >
        );
    };

    _updateSections = activeSections => {
        if (activeSections.length <= 0) {
            console.log("empty press")
            this.setState({ isAccordianOpening: false, shouldPlay: false, postDetails: [] });
            this.state.followingList.map(item => item.expand = false);
        } else {
            console.log(activeSections, this.state.postDetails.length + " posts contained")
            var friends_id = this.state.followingList[activeSections].friend_id
            if (this.state.followingList[activeSections].have_post === "Yes") {
                this.setState({loadingPosts: true})
                this.friendsBlockDetails(friends_id);
            } else {
                this.state.followingList.map(item => item.expand = false);
                this.setState({ isAccordianOpening: false, shouldPlay: false, postDetails: [] })
                console.log("No Posts Contained", activeSections);
            }
        }

    };

    friendsBlockDetails = async (id, type) => {
        if(type === "pullRefresh") this.setState({isRefreshing: false, postDetails: []})
        this.setState({ isAccordianOpening: true, shouldPlay: false });
        let userID = await AsyncStorage.getItem('userId')
        var status
        var postDetails
        await axios.get(DataAccess.BaseUrl + DataAccess.friendblockdetails + id + '/' + userID, DataAccess.AuthenticationHeader)
        .then(response => {
            if (response.data.status === "success") {
                status = response.data.status
                response.data.post_details.map(item => {
                    item.post_img_video_live.length > 0 &&
                    item.post_img_video_live.map(element => {
                        if(element.post_type === "video") {
                            element.isMuted = true;
                        }
                    })
                })
                postDetails = response.data.post_details
            } else {
                postDetails = [];
            }
        })
        .catch(err => {
            console.log(err);
            postDetails = []
        })
        this.setState({ postDetails, isAccordianOpening: false });
        if (status === 'success') {
            this.setState({ shouldPlay: true })
        } else {
            this.setState({ shouldPlay: false })
        }
        this.setState({loadingPosts: false, isRefreshingFeed: false})
        // console.warn(this.state.postDetails.length);
    }

    shareImageInternally = async () => {
        this.RBSheet2.close()
        var resp, msg
        let value = await AsyncStorage.getItem('userId')
        await axios.get(DataAccess.BaseUrl + DataAccess.sharePostInternally + "/" + this.state.sharepostID.post_id + "/" + value + `/${this.state.sharepostID.post_type === 'image' ? 1 : 2}`, DataAccess.AuthenticationHeader)
            .then(function (response) {
                resp = response.data.resp
                msg = response.data.message
                console.log(response.data, "KPKPKPKPKP")
            }).catch(function (error) {
                console.log(error)
            })

        if (resp === 'success') {
            Toast.show({
                text: msg,
                type: "success",
                duration: 3000
            });
        }
    }

    shareImageExternally = async () => {
        this.RBSheet2.close()
        const ShareOptions = {
            message: `hi check this from link : ${this.state.sharepostID.post_img_video_live[0].post_url}`
        }

        try {
            const ShareResponse = await Share.open(ShareOptions)
        } catch (error) {
            console.log(error)
        }
    }

    render() {
        var userList = [], followingList = [];
        userList = this.state.userList;
        followingList = this.state.followingList;
        return (
            <SafeAreaView style={{ flex: 1, backgroundColor: '#ececec' }}>
                <StatusBar backgroundColor="#69abff" barStyle={Platform.OS==='android' ? "light-content" : "dark-content"} />
                <Header isHomeScreen navigation={this.props.navigation} loading={this.state.isLoading} />
                {
                    this.state.isLoading ? 
                    <View
                        style={{
                            flex: 1,
                            justifyContent: 'center',
                            alignItems:'center'
                        }}
                    >
                        <ActivityIndicator size="large" color="#1b1b1b"/>
                    </View> :
                    this.state.followingList.length > 0 ?
                        <ScrollView 
                            refreshControl={
                                <RefreshControl                                    
                                    refreshing={this.state.isRefreshing}
                                    onRefresh={() => this.setState({ isRefreshing: true }, () => this.fetchHomeListing("pullRefresh"))}
                                />
                            }
                            showsVerticalScrollIndicator={false}
                        >
                            <Accordion
                                sections={followingList}
                                touchableProps={{
                                    activeOpacity: 0.95
                                }}
                                containerStyle={{
                                    paddingVertical: heightToDp("1%"),
                                }}
                                underlayColor="#ececec"
                                activeSections={this.state.activeSections}
                                //renderSectionTitle={this._renderSectionTitle}
                                renderHeader={this._renderHeader}
                                renderContent={this._renderContent}
                                onChange={activeSections => {
                                    if(this.state.loadingPosts) {
                                        let postsRequested = this.state.followingList.find(item => item.expand);
                                        if(typeof postsRequested === "object") {
                                            Toast.show({
                                                text: "Posts of " + postsRequested.friend_name + " are fetching. Please wait.",
                                                style: {
                                                    backgroundColor: "#777"
                                                },
                                                duration: 1500
                                            })
                                        }
                                        return;
                                    }
                                    for(let i=0; i<5; i++) {
                                        if(this[`player${i}`]) this[`player${i}`] = undefined;
                                    }
                                    this.setState({ postDetails: [], activeSections, isAccordianOpening: true, shouldPlay: false });
                                    this.state.followingList.map((item, index) => {
                                        if(index === activeSections[0]) {
                                            item.expand = true;
                                        } else {
                                            item.expand = false;
                                        }
                                    })
                                    this._updateSections(activeSections);
                                }}
                            />
                            <View style={{ marginBottom: heightToDp("10%") }} />
                        </ScrollView> :
                        <FlatList
                            data={userList}
                            numColumns={3}
                            contentContainerStyle={{
                                padding: widthToDp("2%")
                            }}
                            ListFooterComponent={<View style={{ height: heightToDp("10%") }} />}
                            renderItem={({ item, index }) => (
                                <View
                                    style={{
                                        paddingBottom: heightToDp("1%"),
                                        width: widthToDp("31%"),
                                        backgroundColor: "#fff",
                                        borderRadius: 10,
                                        marginRight: widthToDp("1.5%"),
                                        marginBottom: heightToDp("0.8%")
                                    }}
                                    key={index}
                                >
                                    <Image
                                        source={{ uri: item.image }}
                                        style={{ height: heightToDp("13%"), width: widthToDp("31%"), borderTopLeftRadius: 10, borderTopRightRadius: 10 }}
                                    />
                                    <Text
                                        style={[{
                                            textAlign: "center",
                                            paddingVertical: heightToDp("0.8%"),
                                            fontFamily: "Poppins-Regular"
                                        }, Platform.isPad && {fontSize: widthToDp("2%")}]}
                                        numberOfLines={1}
                                        ellipsizeMode="tail"
                                    >{item.name}</Text>
                                    <TouchableOpacity
                                        activeOpacity={0.7}
                                        style={{
                                            backgroundColor: "#69abff",
                                            borderRadius: 10,
                                            alignItems: "center",
                                            padding: 5,
                                            marginHorizontal: 5
                                        }}
                                        onPress={() => this.followUser(item, index)}
                                    >
                                        <Text style={{ color: "#fff", fontFamily: "ProximaNova-Black", fontSize: widthToDp("2%") }}>{item.user_is_flollowers === "No" ? "FOLLOW" : "FOLLOW BACK"}</Text>
                                    </TouchableOpacity>
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
                                </View>
                            )}
                        />
                }
                <RBSheet1
                    ref={ref => {
                        this.RBSheet1 = ref;
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
                </RBSheet1>
                <RBSheet2
                    ref={ref => {
                        this.RBSheet2 = ref;
                    }}
                    height={Platform.isPad ? 250 : 100}
                >
                    <View
                        style={{
                            paddingHorizontal: widthToDp('2%'),
                            paddingVertical: heightToDp("2%")
                        }}
                    >
                        <TouchableOpacity
                            style={{
                                flexDirection: 'row',
                                alignItems: "center",
                                justifyContent: "center",
                                paddingHorizontal: widthToDp("2%"),
                                marginBottom: widthToDp("4%")
                            }}
                            onPress={() => this.shareImageInternally()}>
                            <ShareIcon
                                name={'share-apple'}
                                size={Platform.isPad ? 50 : 25}
                            />
                            <Text style={{ marginLeft: widthToDp("2%"), fontSize: widthToDp('4%'), fontFamily: "Poppins-Regular" }}>Share Internally</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={{
                                flexDirection: 'row',
                                alignItems: "center",
                                justifyContent: "center",
                                paddingHorizontal: widthToDp("2%"),
                            }}
                            onPress={() => this.shareImageExternally()}>
                            <ShareIcon
                                name={'share-google'}
                                size={Platform.isPad ? 50 : 25}
                            />
                            <Text style={{ marginLeft: widthToDp("2%"), fontSize: widthToDp('4%'), fontFamily: "Poppins-Regular" }}>Share Externally</Text>
                        </TouchableOpacity>
                    </View>
                </RBSheet2>
                <PushNotificationController navigation={this.props.navigation} />
                <BottomTab isHomeFocused navigation={this.props.navigation} />
            </SafeAreaView>
        )
    }
}
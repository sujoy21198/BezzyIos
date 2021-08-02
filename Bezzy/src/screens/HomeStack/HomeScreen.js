import React from 'react';
import { ActivityIndicator, Alert, FlatList, Image, Platform, RefreshControl, SafeAreaView, ScrollView, StatusBar, Text, Touchable, TouchableOpacity, View } from 'react-native';
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
import { element } from 'prop-types';
import Share from 'react-native-share'
import Video from 'react-native-video'
import PushNotificationController from '../../components/PushNotificationController';

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
            userId: '',
            sharepostID: '',
            shouldPlay: false,
            isLoading: false
        }
    }

    componentDidMount() {
        this.setState({isLoading: true})
        //this.RBSheet1.open();
        this.fetchHomeListing();
        this.userId()
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
        await axios.get(DataAccess.BaseUrl + DataAccess.friendBlockList + "/" + userId)
            .then(async function (response) {
                // console.warn(response.data.total_feed_response)
                if (response.data.status === "success") {
                    userList = [];
                    followingList = response.data.total_feed_response.friend_list;
                    console.log(response.data.total_feed_response.friend_list);
                } else if (response.data.status === "error") {
                    await axios.post(DataAccess.BaseUrl + DataAccess.userList, {
                        "log_userID": userId
                    })
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
            .catch(async function (error) {
                console.log(error);
                await axios.post(DataAccess.BaseUrl + DataAccess.userList, {
                    "log_userID": userId
                })
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
        this.setState({ userList, followingList: [...postUsers, ...noPostUsers], isRefreshing: false })
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
            });
        } else {
            response = await axios.post(DataAccess.BaseUrl + DataAccess.followBack, {
                "login_userID": userId,
                "userID": item.user_id
            });
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
                <Card style={{ paddingVertical: heightToDp("1.5%"), paddingHorizontal: widthToDp("1%"), width: widthToDp("95%"), alignSelf: 'center', borderRadius: 10 }}>
                    <View style={{ flexDirection: 'row' }}>
                        <TouchableOpacity onPress={() => this.props.navigation.navigate('ProfileScreen', { profile_id: section.friend_id })}>
                            <Image
                                source={{ uri: section.friend_photo }}
                                style={{ height: heightToDp("12%"), width: widthToDp("24%"), marginLeft: widthToDp("2%"), borderRadius: 10 }}
                            />
                        </TouchableOpacity>

                        <View>
                            {
                                section.unread_post_number === "" ?
                                    <View style={{ marginLeft: Platform.isPad ? widthToDp("61%") : widthToDp("60%"), marginTop: Platform.isPad ? 0 : heightToDp("-2%") }}>
                                        <Image
                                            source={require("../../../assets/ago.png")}
                                            resizeMode="contain"
                                            style={{ height: Platform.isPad ? heightToDp("5%") : heightToDp("6%"), width: Platform.isPad ? widthToDp("5%") : widthToDp("6%") }}
                                        />
                                    </View> :
                                    <TouchableOpacity
                                        activeOpacity={0.7}
                                        style={{ marginLeft: widthToDp("59%") }}
                                        onPress={() => this.props.navigation.navigate("NotificationScreen")}
                                    >
                                        <Image
                                            source={require("../../../assets/notification.png")}
                                            resizeMode="contain"
                                            style={{ height: Platform.isPad ? heightToDp("5%") : heightToDp("6%"), width: Platform.isPad ? widthToDp("5%") : widthToDp("6%") }}
                                        />
                                        <View
                                            style={{
                                                position: "absolute",
                                                top: heightToDp("0.5%"),
                                                right: widthToDp("0.5%"),
                                                backgroundColor: "#ff0000",
                                                borderRadius: 18 / 2,
                                                height: 18,
                                                width: 18,
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
                            <View style={{ marginLeft: widthToDp("6%"), marginTop: heightToDp(`${section.past_post_days === "" ? 0 : section.past_post_days !== "" ? -1 : section.have_post === "No" ? 3.5 : 0}%`), }}>
                                <Text style={{fontFamily: "Poppins-Regular", fontSize: widthToDp('3%')}}>{section.friend_name || "Anonymous User"}</Text>
                            </View>
                            {
                                section.today_post !== "" ?
                                    <View style={{ marginLeft: widthToDp("6%"), marginTop: heightToDp("0.5%") }}>
                                        <Text style={{ color: '#ff0000', fontFamily: "Poppins-Regular", fontSize: widthToDp('2.2%') }}>{Number(section.today_post) === 1 ? section.today_post + " New Post" : "New Post"}</Text>
                                    </View> :(
                                        section.past_post_days !== "" &&
                                    <View style={{ marginLeft: widthToDp("6%") }}>
                                        <Text style={{ color: '#f1b45c', fontFamily: "Poppins-Regular", fontSize: widthToDp('2.2%') }}>Posted {section.past_post_days} {Number(section.past_post_days) === 1 ? "day" : "days"} ago</Text>
                                    </View>)
                            }
                            <TouchableOpacity
                                activeOpacity={0.7}
                                onPress={() => this.props.navigation.navigate("InboxScreen", { friendId: section.friend_id, friendImage: section.friend_photo, friendName: section.friend_name })}
                                style={{ marginLeft: Platform.isPad ? widthToDp('62%') : widthToDp("60%"), marginTop: heightToDp(`${section.today_post === "" ? section.past_post_days === "" ? 2 : 0 : 0.2}%`) }}>
                                <Icon2
                                    name={Platform.OS === "android" ? 'md-chatbox-ellipses-outline' : 'ios-chatbox-ellipses-outline'}
                                    size={Platform.isPad ? 40 : 23}
                                    color={"#69abff"}
                                />
                            </TouchableOpacity>
                        </View>

                    </View>
                </Card>
            </View>
        );
    };

    likePost = async (item) => {
        let userId = await AsyncStorage.getItem("userId");
        let response = await axios.get(DataAccess.BaseUrl + DataAccess.likePost + "/" + userId + "/" + item.post_id);
        if (response.data.status === "success") {
            let posts = this.state.postDetails;
            posts.map(i => {
                if (i.post_id === item.post_id) {
                    i.log_user_like_status === "No" ? i.number_of_like += 1 : i.number_of_like -= 1;
                    i.log_user_like_status = i.log_user_like_status === "No" ? "Yes" : "No";
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
            "Reported post will be deleted from our server.", 
            [
                {
                    text: "Cancel"
                }, 
                {
                    text: "Ok",
                    onPress: async () => {
                        let userId = await AsyncStorage.getItem("userId");
                        await axios.get(DataAccess.BaseUrl + DataAccess.reportPost + "/" + userId + "/" + i.post_id)
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
        return (
            <View >
                {
                    this.state.isAccordianOpening ?
                        <Card style={{ height: heightToDp("50%"), width: widthToDp("95%"), alignSelf: 'center', justifyContent: 'center', borderRadius: 10 }}>
                            <ActivityIndicator size="large" color="#69abff" />
                        </Card> : (
                            this.state.expand &&
                            postDetails && postDetails.length > 0 &&
                            <Card style={{
                                paddingHorizontal: widthToDp("2%"),
                                paddingVertical: heightToDp("1%"),
                                width: widthToDp("95%"),
                                alignSelf: 'center',
                                borderRadius: 10
                            }}>
                                {
                                    postDetails.map((i, key) => (
                                        <View style={{ width: widthToDp("95%"), alignSelf: 'center' }} key={key}>
                                            <View style={{ flexDirection: 'row' }}>
                                                <Image
                                                    source={{ uri: section.friend_photo }}
                                                    style={{ height: Platform.isPad ? 80 : 40, width: Platform.isPad ? 80 : 40, marginLeft: widthToDp("4%"), borderRadius: Platform.isPad ? 80 / 2 : 40 / 2, marginTop: heightToDp("2%") }}
                                                />
                                                <View>
                                                    <View style={{ marginLeft: widthToDp("6%"), marginTop: heightToDp("2%") }}>
                                                        <Text style={{fontFamily: "Poppins-Regular", fontSize: widthToDp("3%")}}>{section.friend_name}</Text>
                                                    </View>
                                                    <View style={{ marginLeft: widthToDp("6%"), marginTop: heightToDp("0%") }}>
                                                        <Text style={{ color: '#69abff', fontFamily: "Poppins-Regular", fontSize: widthToDp("2%") }}>{i.post_time}</Text>
                                                    </View>
                                                </View>
                                            </View>
                                            {
                                                i.post_content !== "" &&
                                                <View
                                                    style={{
                                                        flexDirection: 'row',
                                                        justifyContent: 'space-between',
                                                        alignItems: "flex-start",
                                                        paddingRight: "3%"
                                                    }}
                                                >
                                                    <View style={{ marginLeft: widthToDp("6%"), marginTop: heightToDp("1.5%"), width: "70%" }}>
                                                        <Text style={{ color: 'black', fontFamily: "Poppins-Regular", fontSize: widthToDp("4%") }}>{i.post_content}</Text>
                                                    </View>
                                                    <TouchableOpacity
                                                        style={{
                                                            flexDirection: 'row',
                                                            alignItems: "center",
                                                            marginRight: widthToDp("6%"),
                                                            marginTop: heightToDp("1.5%"),
                                                            width: "20%",
                                                            padding: "1%",
                                                            borderWidth: 1,
                                                            borderRadius: 10
                                                        }}
                                                        onPress={() => this.reportPost(i)}>
                                                        <Icon2
                                                            name={Platform.OS === 'android' ? 'md-thumbs-down' : 'ios-thumbs-down'}
                                                            // color="#ff0000"
                                                            size={Platform.isPad ? 25 : 15}
                                                        />
                                                        <Text style={{ marginLeft: widthToDp("2%"), fontSize: widthToDp('3%'), fontFamily: "Poppins-Regular" }}>REPORT</Text>
                                                    </TouchableOpacity>
                                                </View>
                                            }
                                            {
                                                i.post_type === "video" ? <View>
                                                    {
                                                        i.post_img_video_live.length > 0 &&
                                                        <FlatList
                                                            data={i.post_img_video_live}
                                                            style={{
                                                                padding: widthToDp("2%")
                                                            }}
                                                            renderItem={({ item, index }) => (
                                                                <TouchableOpacity
                                                                    activeOpacity={0.7}
                                                                    onPress={() => {
                                                                        this.setState({ shouldPlay: false });
                                                                        this.props.navigation.navigate("ImagePreviewScreen", { image: { ...item, post_id: i.post_id }, otherProfile: this.state.otherProfile })
                                                                    }}
                                                                >
                                                                    <Video
                                                                        source={{ uri: item.post_url }}
                                                                        ref={(ref) => {
                                                                            this.player = ref
                                                                        }}
                                                                        volume={0.0}
                                                                        repeat
                                                                        key={index}
                                                                        ignoreSilentSwitch="ignore"
                                                                        // paused={!this.state.shouldPlay}
                                                                        style={{
                                                                            height: heightToDp("30%"),
                                                                            width: widthToDp("85%"),
                                                                            alignSelf: 'center',
                                                                        }}
                                                                        resizeMode="contain"
                                                                    />
                                                                </TouchableOpacity>
                                                            )}
                                                        />
                                                    }
                                                </View> : ((i.post_type === 'image') ? <View>
                                                    {
                                                        i.post_img_video_live.length > 0 &&
                                                        <FlatList
                                                            data={i.post_img_video_live}
                                                            horizontal={true}
                                                            contentContainerStyle={{
                                                                paddingHorizontal: widthToDp("4%")
                                                            }}
                                                            showsHorizontalScrollIndicator={false}
                                                            ItemSeparatorComponent={() => <View style={{ width: widthToDp("2%") }} />}
                                                            renderItem={({ item, index }) => (
                                                                <TouchableOpacity
                                                                    activeOpacity={0.7}
                                                                    onPress={() => this.props.navigation.navigate("ImagePreviewScreen", { type: "otherUserPost", image: { ...item, post_id: i.post_id } })}
                                                                    style={{ alignSelf: 'center', marginTop: heightToDp("2%") }}
                                                                    key={index}
                                                                >
                                                                    <Image
                                                                        style={{ height: heightToDp("30%"), width: widthToDp("85%"), borderRadius: 10 }}
                                                                        source={{ uri: item.post_url }}
                                                                    />
                                                                </TouchableOpacity>
                                                            )}
                                                        />
                                                    }
                                                </View> : null)
                                            }

                                            <View
                                                style={{
                                                    flexDirection: 'row',
                                                    alignItems: 'center',
                                                    paddingVertical: heightToDp("1.5%"),
                                                    paddingHorizontal: widthToDp("4.5%")
                                                }}
                                            >
                                                <TouchableOpacity
                                                    onPress={() => this.likePost(i)}
                                                    activeOpacity={0.7}
                                                >
                                                    {
                                                        i.log_user_like_status === "No" ?
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
                                                    onPress={() => this.props.navigation.navigate("PostLikedUsersList", {postId: i.post_id})}
                                                >
                                                    <Text
                                                        style={{
                                                            color: "#cdcdcd",
                                                            fontSize: Platform.isPad ? widthToDp("3%") : widthToDp("3.5%"),
                                                            paddingLeft: widthToDp("1%"),
                                                            fontFamily: "Poppins-Regular"
                                                        }}
                                                    >{i.number_of_like}</Text>
                                                </TouchableOpacity>
                                                <TouchableOpacity
                                                    onPress={() => this.props.navigation.navigate("CommentScreen", { post: i, type: "otherUserPost" })}
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
                                                >{i.number_of_comment}</Text>
                                                <Icon2
                                                    name={Platform.OS === 'android' ? 'md-arrow-redo-outline' : 'ios-arrow-redo-outline'}
                                                    color="#69abff"
                                                    size={Platform.isPad ? 40 : 25}
                                                    style={{ paddingLeft: widthToDp("4%") }}
                                                    onPress={() => this.sharePostMethod(i.post_id)}
                                                />
                                            </View>
                                            {
                                                key !== postDetails.length - 1 &&
                                                <View style={{ borderWidth: 0.5, borderColor: '#cdcdcd', marginHorizontal: widthToDp("4%") }} />
                                            }
                                        </View>
                                    ))
                                }
                            </Card>
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
        this.setState({ activeSections });

        console.log(activeSections)

        if (activeSections.length <= 0) {
            console.log("empty press")
        } else {
            var friends_id = this.state.followingList[activeSections].friend_id
            if (this.state.followingList[activeSections].have_post === "Yes") {
                this.friendsBlockDetails(friends_id);
            } else {
                this.setState({ postDetails: [] })
            }
        }

    };

    sharePostMethod = async (value) => {
        this.setState({ sharepostID: value })
        // const ShareOptions = {
        //     message : "hi check this from link : https://bezzyapp.page.link/appadmin"
        // }

        // try{
        //     const ShareResponse = await Share.open(ShareOptions)
        // }catch(error){
        //     console.log(error)
        // }
        this.RBSheet2.open()
    }

    friendsBlockDetails = async (id) => {
        this.setState({ isAccordianOpening: true, expand: false, shouldPlay: false });
        let userID = await AsyncStorage.getItem('userId')
        var status
        var postDetails
        await axios.get(DataAccess.BaseUrl + DataAccess.friendblockdetails + id + '/' + userID)
        .then(response => {
            if (response.data.status === "success") {
                status = response.data.status
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
            this.setState({ expand: true, shouldPlay: true })
        } else {
            this.setState({ expand: false, shouldPlay: false })
        }
    }

    shareImageInternally = async () => {
        this.RBSheet2.close()
        var resp, msg
        let value = await AsyncStorage.getItem('userId')
        await axios.get(DataAccess.BaseUrl + DataAccess.sharePostInternally + "/" + this.state.sharepostID + "/" + value + "/1")
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
            message: "hi check this from link : https://bezzyapp.page.link/appadmin"
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
                <StatusBar backgroundColor="#69abff" barStyle="light-content" />
                <Header isHomeScreen navigation={this.props.navigation} />
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
                            contentContainerStyle={{
                                paddingTop: heightToDp("1%")
                            }}
                            refreshControl={
                                <RefreshControl
                                    refreshing={this.state.isRefreshing}
                                    onRefresh={() => this.setState({ isRefreshing: true }, () => this.fetchHomeListing("pullRefresh"))}
                                />
                            }
                        >
                            <Accordion
                                sections={followingList}
                                touchableProps={{
                                    activeOpacity: 0.95
                                }}
                                underlayColor="#ececec"
                                activeSections={this.state.activeSections}
                                //renderSectionTitle={this._renderSectionTitle}
                                renderHeader={this._renderHeader}
                                renderContent={this._renderContent}
                                onChange={this._updateSections}
                            />
                            <View style={{ marginBottom: heightToDp("10%") }}></View>
                        </ScrollView> :
                        <FlatList
                            data={userList}
                            numColumns={3}
                            contentContainerStyle={{
                                padding: widthToDp("2%")
                            }}
                            refreshing={this.state.isRefreshing}
                            onRefresh={() => this.setState({ isRefreshing: true }, () => this.fetchHomeListing("pullRefresh"))}
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
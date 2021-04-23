import React from 'react';
import { ActivityIndicator, FlatList, Image, SafeAreaView, ScrollView, StatusBar, Text, Touchable, TouchableOpacity, View } from 'react-native';
import { Card, Toast } from 'native-base'
import Icon from 'react-native-vector-icons/FontAwesome5';
import Icon1 from 'react-native-vector-icons/FontAwesome';
import BottomTab from '../../components/BottomTab';
import Header from '../../components/Header';
import { heightToDp, widthToDp } from '../../components/Responsive';
import Accordion from 'react-native-collapsible/Accordion';
import axios from 'axios';
import RBSheet from 'react-native-raw-bottom-sheet';
import RBSheet1 from 'react-native-raw-bottom-sheet';
import DataAccess from '../../components/DataAccess';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default class HomeScreen extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            activeSections: [],
            isLoading: false,
            userList: [],
            followingList: [],
            expand: false,
            postDetails: []
        }
    }

    componentDidMount() {
        this.RBSheet1.open();
        this.fetchHomeListing();
    }

    // userId = async() => {
    //     let user_id = await AsyncStorage.getItem('userId')
    //     alert(user_id)
    // }

    fetchHomeListing = async () => {
        var userList = [], followingList = [];
        let userId = await AsyncStorage.getItem("userId");
        await axios.get(DataAccess.BaseUrl + DataAccess.friendBlockList + "/" + userId)
            .then(async function (response) {
                console.log(response.data.total_feed_response)
                if (response.data.status === "error") {
                    await axios.post(DataAccess.BaseUrl + DataAccess.userList, {
                        "log_userID": userId
                    })
                        .then(function (responseUserList) {
                            if (responseUserList.data.resp === "success") {
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
                } else {
                    userList = [];
                    followingList = response.data.total_feed_response.friend_list;
                }
            })
            .catch(function (error) {
                console.log(error);
            })
        this.setState({ userList, followingList })
        this.RBSheet1.close();
    }

    _renderSectionTitle = section => {
        return (
            <View >
                <Text>{section.content}</Text>
            </View>
        );
    };

    followUser = async (item, index) => {
        this.RBSheet.open();
        let userId = await AsyncStorage.getItem("userId");
        let response = await axios.post(DataAccess.BaseUrl + DataAccess.followUser, {
            "user_one_id": userId,
            "user_two_id": item.user_id
        });
        if (response.data.status === "success") {
            this.fetchHomeListing();
            return Toast.show({
                text: "Follow successful",
                type: "success",
                duration: 2000
            })
        } else {
            //
        }
        this.RBSheet.close();
    }

    _renderHeader = section => {
        return (
            <View >
                <Card style={{ height: heightToDp("15%"), width: widthToDp("95%"), alignSelf: 'center', justifyContent: 'center', borderRadius: 10 }}>
                    <View style={{ flexDirection: 'row' }}>
                        <Image
                            source={{ uri: section.friend_photo }}
                            style={{ height: heightToDp("13%"), width: widthToDp("22%"), marginLeft: widthToDp("2%"), borderRadius: 10 }}
                        />
                        <View>
                            {
                                section.have_post === "Yes" &&
                                <View style={{ marginLeft: widthToDp("60%"), marginTop: heightToDp("-1%") }}>
                                    <Image
                                        source={require("../../../assets/ago.png")}
                                        resizeMode="contain"
                                        style={{ height: heightToDp("6%"), width: widthToDp("6%") }}
                                    />
                                </View>
                            }
                            <View style={{ marginLeft: widthToDp("6%"), marginTop: heightToDp(`${section.have_post === "Yes" ? -1.5 : 3}%`) }}>
                                <Text>{section.friend_name}</Text>
                            </View>
                            {
                                section.past_post_days !== "" &&
                                <View style={{ marginLeft: widthToDp("6%"), }}>
                                    <Text style={{ color: '#ff0000' }}>{section.past_post_days} days ago</Text>
                                </View>
                            }
                            <TouchableOpacity
                                activeOpacity={0.7}
                                onPress={() => this.props.navigation.navigate("MessageScreen")}
                                style={{ marginLeft: widthToDp("60%"), marginTop: heightToDp(`${section.past_post_days !== "" ? 2 : 4}%`) }}>
                                <Icon
                                    name="comments"
                                    size={20}
                                    color={"#87CEEB"}
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
        if(response.data.status === "success") {
            let posts = this.state.postDetails;
            posts.map(i => {
                if(i.post_id === item.post_id) {
                    i.log_user_like_status === "No" ? i.number_of_like += 1 : i.number_of_like -= 1;
                    i.log_user_like_status = i.log_user_like_status === "No" ? "Yes" : "No";
                }
            })
            this.setState({postDetails: posts});
        } else {
            //
        }
    } 

    _renderContent = section => {
        var postDetails = []
        postDetails = this.state.postDetails
        return (
            <View >
                {
                    this.state.isLoading ?
                    <Card style={{ height: heightToDp("50%"), width: widthToDp("95%"), alignSelf: 'center', justifyContent: 'center', borderRadius: 10 }}>
                        <ActivityIndicator size="large" color="#69abff"/>
                    </Card> : (
                        postDetails && postDetails.length > 0 &&
                        postDetails.map((i) => (
                            <Card style={{ height: heightToDp(`${i.post_content!=="" ? 50 : 47}%`), width: widthToDp("95%"), alignSelf: 'center', borderRadius: 10 }}>
                                <View style={{ flexDirection: 'row' }}>
                                    <Image
                                        source={{ uri: section.friend_photo }}
                                        style={{ height: heightToDp("5%"), width: widthToDp("10%"), marginLeft: widthToDp("4%"), borderRadius: 300, marginTop: heightToDp("2%") }}
                                    />
                                    <View>
                                        <View style={{ marginLeft: widthToDp("6%"), marginTop: heightToDp("2%") }}>
                                            <Text>{section.friend_name}</Text>
                                        </View>
                                        <View style={{ marginLeft: widthToDp("6%"), marginTop: heightToDp("0%") }}>
                                            <Text style={{ color: '#69abff' }}>{i.post_time}</Text>
                                        </View>
                                    </View>
                                </View>
                                {
                                    i.post_content!=="" &&
                                    <View style={{ marginLeft: widthToDp("6%"), marginTop: heightToDp("1%") }}>
                                        <Text style={{ color: 'black' }}>{i.post_content}</Text>
                                    </View>
                                }                                
                                <TouchableOpacity 
                                    activeOpacity={0.7}
                                    onPress={() => this.props.navigation.navigate("ImagePreviewScreen", {type: "otherUserPost", image: i})}
                                    style={{ alignSelf: 'center', marginTop: heightToDp("2%") }}
                                >
                                    <Image
                                        style={{ height: heightToDp("30%"), width: widthToDp("85%"), borderRadius: 10 }}
                                        source={{ uri: i.post_img_video_live[0].post_url}}
                                    />
                                </TouchableOpacity>
                                <View
                                    style={{
                                        position: 'absolute',
                                        bottom: heightToDp("1.5%"),
                                        left: widthToDp("3%"),
                                        flexDirection: 'row',
                                        alignItems: 'center'
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
                                                size={23}
                                            /> :
                                            <Icon1
                                                name="heart"
                                                color="#ff0000"
                                                size={23}
                                            />
                                        }
                                    </TouchableOpacity>                                    
                                    <Text
                                        style={{
                                            color: "#cdcdcd",
                                            fontSize: widthToDp("3.5%"),
                                            paddingLeft: widthToDp("1%")
                                        }}
                                    >{i.number_of_like}</Text>
                                    <TouchableOpacity
                                        onPress={() => this.props.navigation.navigate("CommentScreen", {post: i, type: "otherUserPost"})}
                                    >
                                        <Icon
                                            name="comment"
                                            color="#69abff"
                                            size={23}
                                            style={{paddingLeft: widthToDp("4%")}}
                                        />
                                    </TouchableOpacity>
                                    <Text
                                        style={{
                                            color: "#cdcdcd",
                                            fontSize: widthToDp("3.5%"),
                                            paddingLeft: widthToDp("1%")
                                        }}
                                    >{i.number_of_comment}</Text>
                                    <Icon
                                        name="share"
                                        color="#69abff"
                                        size={23}
                                        style={{paddingLeft: widthToDp("4%")}}
                                    />
                                </View>
                            </Card>
                        ))
                    )
                }
                {/* {
                    this.state.postDetails.map((i) => {
                        <Text>hi</Text>
                    })
                } */}

            </View>
        );
    };

    _updateSections = activeSections => {
        this.setState({ activeSections });

        console.log(activeSections)
        
        if (activeSections.length <= 0) {
            console.log("empty press")
        } else {
            var friends_id = this.state.followingList[activeSections].friend_id
            if(this.state.followingList[activeSections].have_post === "Yes") {
                this.friendsBlockDetails(friends_id);
            } else {
                this.setState({postDetails: []})
            }            
        }

    };

    friendsBlockDetails = async (id) => {
        this.setState({isLoading: true});
        let userID = await AsyncStorage.getItem('userId')
        var status
        var postDetails
        let response = await axios.get(DataAccess.BaseUrl + DataAccess.friendblockdetails + id + '/' + userID);
        this.setState({isLoading: false});
        if(response.data.status === "success") {
            status = response.data.status
            postDetails = response.data.post_details
        } else {
            postDetails = [];
        }
        this.setState({postDetails});

        if (status === 'success') {
            this.setState({ expand: true })
        } else {
            this.setState({ expand: false })
        }
    }

    render() {
        var userList = [], followingList = [];
        userList = this.state.userList;
        followingList = this.state.followingList;
        return (
            <SafeAreaView style={{ flex: 1, backgroundColor: '#ececec' }}>                
                <StatusBar backgroundColor="#69abff" barStyle="light-content" />
                <Header isHomeScreen  navigation={this.props.navigation}/>
                {
                    this.state.followingList.length > 0 ?
                    <ScrollView>
                        <Accordion
                            sections={followingList}
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
                        ListFooterComponent={<View style={{ height: heightToDp("10%") }} />}
                        renderItem={({ item, index }) => (
                            <View
                                style={{
                                    paddingVertical: heightToDp("1%"),
                                    width: widthToDp("30%"),
                                    backgroundColor: "#fff",
                                    borderRadius: 10,
                                    marginRight: widthToDp("2%"),
                                    marginBottom: heightToDp("1%")
                                }}
                                key={index}
                            >
                                <Image
                                    source={{ uri: item.image }}
                                    style={{ height: heightToDp("13%"), width: widthToDp("30%") }}
                                    resizeMode="contain"
                                />
                                <Text
                                    style={{
                                        textAlign: "center",
                                        paddingVertical: heightToDp("0.8%"),
                                    }}
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
                                    <Text style={{ color: "#fff" }}>FOLLOW</Text>
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
                <BottomTab isHomeFocused navigation={this.props.navigation} />
            </SafeAreaView>
        )
    }
}
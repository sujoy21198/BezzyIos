import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import React from 'react';
import { ActivityIndicator, Alert, FlatList, Image, Keyboard, KeyboardAvoidingView, Platform, SafeAreaView, StatusBar, Text, TextInput, Touchable, TouchableOpacity, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {Toast} from 'native-base';
import DataAccess from '../../components/DataAccess';
import Header from '../../components/Header';
import { heightToDp, widthToDp } from '../../components/Responsive';
import Icon from 'react-native-vector-icons/FontAwesome5';
import Icon1 from 'react-native-vector-icons/FontAwesome';
import RBSheet from 'react-native-raw-bottom-sheet';
import PushNotificationController from '../../components/PushNotificationController';
import Autolink from 'react-native-autolink';
import RBSheet1 from "react-native-raw-bottom-sheet"

export default class CommentScreen extends React.Component {
    
    constructor(props){
        super(props)
        this.state = {
            comments: [],
            commentText: "",
            isSendingComment: false,
            post_id:'',
            isKeyboardOpened: false,
            followingList: [],
            isLoading: false,
            tagUserId: [],
            isSelected: false, 
            deleteIds: [], 
            userDetails: {}
        }
        this.state.post_id = typeof this.props.route.post === "object" ? this.props.route.post.post_id : this.props.route.params.post.post_id
    }

    UNSAFE_componentWillMount () {
        this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this._keyboardDidShow);
        this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this._keyboardDidHide);
    }

    _keyboardDidShow = () => this.setState({isKeyboardOpened: true})

    _keyboardDidHide = () => this.setState({isKeyboardOpened: false})
    
    componentWillUnmount () {
        this.keyboardDidShowListener.remove();
        this.keyboardDidHideListener.remove();
    }

    componentDidMount = async () => {
        this.setState({userDetails: JSON.parse(await AsyncStorage.getItem("userDetails"))});
        this.getPostCommentedUsers();
    }    
    
    getPostCommentedUsers = async () => {
        this.RBSheet.open()
        let userId = await AsyncStorage.getItem("userId");
        let response = await axios.post(DataAccess.BaseUrl + DataAccess.postCommentedUsers, {
            "post_id" : this.state.post_id,
            "loginuserID" : userId
        });
        if(response.data.status === 'success') {
            if(response.data.message === "No comment found") {
                this.setState({comments: []});
            } else {
                response.data.comment_list.Parent.map(item => item.isSelected = false);
                this.setState({
                    comments: response.data.comment_list.Parent, 
                })
                console.log(this.state.comments)
            }
        } else {
            this.setState({comments: []});
        }
        console.warn(this.state.comments, JSON.parse(await AsyncStorage.getItem("userDetails")));
        this.RBSheet.close()
    }

    sendComment = async () => {
        this.RBSheet.open()
        this.setState({isSendingComment: true})
        let userId = await AsyncStorage.getItem("userId");
        let response = await axios.post(DataAccess.BaseUrl + DataAccess.postComment, {
            "userID" : userId,
            "PostId" : this.state.post_id,
            "commentParentId" : "0",
            "tag_user_id" : this.state.tagUserId.length > 0 ? JSON.stringify(this.state.tagUserId).split("[")[1].split("]")[0] : null,
            "commentText" : this.state.commentText.trim()
        });
        this.setState({isSendingComment: false})
        console.warn(response.data, {
            "userID" : userId,
            "PostId" : this.state.post_id,
            "commentParentId" : "0",
            "tag_user_id" : this.state.tagUserId.length > 0 ? JSON.stringify(this.state.tagUserId).split("[")[1].split("]")[0] : null,
            "commentText" : this.state.commentText.trim()
        });
        if(response.data.status === "success") {
            this.getPostCommentedUsers();
            this.setState({commentText: "", tagUserId: []})
            this.refChatField.clear();
        } else {
            //
        }
        this.RBSheet.close();
    } 

    likeDislikeComment = async (item) => {
        let userId = await AsyncStorage.getItem("userId");
        let response = await axios.get(DataAccess.BaseUrl + DataAccess.likeDislikeComment + "/" + userId + "/" + item.comment_id);
        if(response.data.status === "success") {
            let comments = this.state.comments;
            comments.map(i => {
                if(response.data.activity.rescommentID == i.comment_id) {
                    i.login_user_like_comment = i.login_user_like_comment=="Yes" ? "No" : "Yes";
                    i.total_like_on_comment = response.data.activity.number_of_activity;
                }
            })
            this.setState({comments})
        } else {
            //
        }
    }

    threadComment = async(item) => {
        this.props.navigation.navigate({
            name: 'ThreadCommentScreen',
            params: {
                ...item,
                post_id : this.state.post_id,
            }
        })
    }

    getFollowings = async (mention) => {
        if(mention === "@") return;
        this.setState({followingList: []})
        let userId = await AsyncStorage.getItem("userId");
        let followingList = []
        let response = await axios.post(DataAccess.BaseUrl + DataAccess.userFollowingList, {"loguser_id" : userId});
        if(response.data.resp === "success") {
            // console.warn(response.data.total_feed_response.friend_list, mention.split("@")[1].toLowerCase());
            // console.warn(response.data.total_feed_response.friend_list);
            response.data && response.data.following_user_list &&
            response.data.following_user_list.length > 0 &&
            response.data.following_user_list.map(element => {
                if(element.name.toLowerCase().startsWith(mention.split("@")[1].toLowerCase())) {
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

    deleteMessage = async (deleteFromIcon) => {
      console.log(this.state.deleteIds, DataAccess.BaseUrl + (this.state.deleteIds.length === 1 ? DataAccess.deleteSingleComment : DataAccess.deleteMultipleComment));
      Alert.alert(
        "Are you sure?",
        this.state.deleteIds.length + ` ${this.state.deleteIds.length === 1 ? "comment" : "comments"} will be deleted`, [
          {
            text: "Cancel",
            onPress: () => {
                if(deleteFromIcon) {
                    this.setState({deleteIds: []});
                }
            }
          },
          {
            text: "Ok", 
            onPress: async () => {
                this.RBSheet.open();
                this.setState({comments: [], isSendingComment: true, isSelected: false})
                await axios.post(DataAccess.BaseUrl + (this.state.deleteIds.length === 1 ? DataAccess.deleteSingleComment : DataAccess.deleteMultipleComment), {
                    "cmnt_id": this.state.deleteIds.length === 1 ? this.state.deleteIds[0] : this.state.deleteIds
                }).then(response => {
                    console.log("Comment delete success response :- ", response);
                    if(response.data.status === "success") {
                    this.state.comments.map(item => item.isSelected = false);
                    this.setState({deleteIds: []});
                    this.getPostCommentedUsers();
                    this.setState({isSendingComment: false});
                    } else {
                    //
                    }
                }).catch(error => {
                    console.log("Comment delete error response :- ", error)
                })
            }
          }
        ]
      )
    }

    render = () => (
        <SafeAreaView style={{flex: 1, backgroundColor: 'rgba(220,220,220,0)'}}>
            <StatusBar backgroundColor="#69abff" barStyle="light-content" />
            {!this.state.isSelected && 
            <Header isBackButton isHomeStackInnerPage headerText={"Comments"} navigation={this.props.navigation} commentCount={(this.props.route.params && this.props.route.params.type !== "otherUserPost") ? this.state.comments.length : undefined} />}
            {
                this.state.isSelected &&
                <View
                    style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        alignItems: "center",
                        backgroundColor: this.state.isSelected ? "rgba(0, 125, 254, 0.2)" : undefined,
                        paddingHorizontal: widthToDp("2%"),
                        borderBottomWidth: 1,
                        borderBottomColor: "#ececec",
                    }}
                >
                    <TouchableOpacity
                        style={{
                            paddingVertical: heightToDp("1%"),
                            flexDirection: 'row',
                            alignItems: 'center',
                        }}
                        activeOpacity={0.7}
                        onPress={this.state.isSelected ? () => {
                        let comments = this.state.comments;
                        comments.map(i => i.isSelected = false)
                        this.setState({comments: comments, isSelected: false, deleteIds: []})
                        } : () => this.props.navigation.goBack()}
                    >
                        <Icon 
                            name="chevron-left"
                            size={Platform.isPad ? 40 : 20}
                            color={"#808080"}                        
                        />
                        <Text
                            style={{
                                marginLeft: widthToDp("2%"),
                                fontSize: widthToDp("4.5%"),
                                fontFamily: "ProximaNova-Black",
                                color: "#808080"
                            }}
                        >
                            {this.state.deleteIds.length}
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        activeOpacity={0.7}
                        onPress={this.deleteMessage}
                    >
                        <Ionicons 
                            name={Platform.OS==='android' ? 'md-trash' : 'ios-trash'}
                            size={Platform.isPad ? 40 : 20}
                            color={"#808080"}                        
                        />
                    </TouchableOpacity>
                </View>
            }
            <KeyboardAvoidingView behavior="padding" style={{flex: 1}}>
                <View style={{flex: 0.965}}>
                    {
                        this.state.comments.length > 0 &&
                        <FlatList
                        data={this.state.comments}
                        keyExtractor={item => item.comment_id}
                        ref={ref => this.refList = ref}
                        ItemSeparatorComponent={() => <View style={{height: heightToDp("3%")}}/>}
                        ListFooterComponent={<View style={{height: heightToDp("2%")}}/>}
                        ListHeaderComponent={<View style={{height: heightToDp("3%")}}/>}
                        renderItem={({item, index}) => (
                            <TouchableOpacity
                                style={
                                    item.isSelected ? {
                                        backgroundColor: "rgba(0, 125, 254, 0.1)",
                                        paddingVertical: widthToDp("1%")
                                    } : {}
                                }
                                activeOpacity={0.7}
                                onLongPress={() => {
                                    if(item.userimage !== this.state.userDetails.profile_pic) {
                                        Toast.show({
                                            style: {
                                                backgroundColor: '#777',
                                            },
                                            text: "Only Self Comments can be deleted",
                                            duration: 3000
                                        });
                                        return;
                                    }
                                    let comments = this.state.comments;
                                    comments.map(i => {
                                        if(i.comment_id === item.comment_id) {
                                            i.isSelected = true
                                        }
                                    })
                                    this.setState({comments: comments, isSelected: true, deleteIds: [...this.state.deleteIds, item.comment_id]})
                                }}
                                onPress={async() => {
                                    if(this.state.isSelected && item.userimage !== this.state.userDetails.profile_pic) {
                                        Toast.show({
                                            style: {
                                                backgroundColor: '#777',
                                            },
                                            text: "Only Self Comments can be deleted",
                                            duration: 3000
                                        })
                                        return;
                                    }
                                    if(this.state.isSelected) {
                                        let comments = this.state.comments;
                                        comments.map(i => {
                                        if(i.comment_id === item.comment_id) {
                                            if(i.isSelected) {
                                                this.state.deleteIds.splice(this.state.deleteIds.findIndex(element => element === item.comment_id), 1)
                                                this.setState({deleteIds: this.state.deleteIds})
                                            } else {
                                                this.setState({deleteIds: [...this.state.deleteIds, item.comment_id]})
                                            }
                                            i.isSelected = !i.isSelected
                                        }
                                        })
                                        if(!comments.find(item => item.isSelected)) {
                                            this.setState({isSelected: false})
                                        } 
                                        this.setState({comments: comments})
                                    } else {
            
                                        // this.props.navigation.navigate('ChatImagePreviewScreen', { imageUrl: item.chat_message })
            
                                    }
                                }}
                            >
                                <View
                                    style={{
                                        flexDirection: 'row',
                                        alignItems: 'flex-start',
                                        paddingHorizontal: widthToDp("2%"),
                                    }}
                                >
                                    <Image
                                        source={{uri: item.userimage}}
                                        style={{height: Platform.isPad ? 80 : 40, width: Platform.isPad ? 80 : 40, borderRadius: Platform.isPad ? 80 / 2 : 40 / 2, borderWidth: 1, borderColor: '#69abff'}}
                                    />
                                    <View
                                        style={{
                                            marginLeft: widthToDp("3%"),
                                            padding: widthToDp("2%"),
                                            backgroundColor: 'rgba(0, 255, 255, 0.1)',
                                            borderRadius: 10,
                                            width: Platform.isPad ? widthToDp("85%") : widthToDp("82.5%")
                                        }}
                                    >
                                        <Text
                                            style={{
                                                width: widthToDp("100%"),
                                                color: '#1b1b1b',
                                                fontFamily: "ProximaNova-Black",
                                                fontSize: widthToDp("3.5%")
                                            }}
                                        >{item.username}</Text>
                                        <Autolink
                                            component={Text}
                                            text={item.commentText}
                                            style={{
                                                color: '#1b1b1b',
                                                fontSize: widthToDp("3%"),
                                                marginTop: heightToDp("1%"),
                                                fontFamily: "Poppins-Regular"
                                            }}
                                            email
                                            url
                                            linkStyle={{
                                                color: '#0000ff', 
                                                textDecorationLine: "underline",
                                                fontSize: widthToDp("3%"),
                                                marginTop: heightToDp("1%"),
                                                fontFamily: "Poppins-Regular"
                                            }}
                                        />
                                        {/* <Text
                                            style={{
                                                color: '#1b1b1b',
                                                fontSize: widthToDp("3%"),
                                                marginTop: heightToDp("1%"),
                                                fontFamily: "Poppins-Regular"
                                            }}
                                        >{item.commentText}</Text> */}
                                    </View>                            
                                </View>
                                <View
                                    style={{
                                        marginLeft: widthToDp("16%"),
                                        marginTop: heightToDp("0.8%"),
                                        width: widthToDp("82%"),
                                        flexDirection: 'row',
                                        justifyContent: 'space-between', 
                                        alignItems: 'center'
                                    }}
                                >
                                    <Text
                                        style={{
                                            color: '#808080',
                                            fontSize: widthToDp("3%"),
                                            fontFamily: "Poppins-Regular"
                                        }}
                                    >{item.postcomment_time}</Text>
                                    <View
                                        style={{
                                            position: 'absolute',
                                            top: heightToDp("0%"),
                                            right: widthToDp("0%"),
                                            flexDirection: 'row',
                                            alignItems: 'center'
                                        }}
                                    >
                                        <TouchableOpacity
                                            activeOpacity={0.7}
                                            onPress={() => this.likeDislikeComment(item)}
                                            disabled={this.state.isSelected}
                                        >
                                            {
                                                item.login_user_like_comment === "Yes" ?
                                                <Icon1
                                                    name="heart"
                                                    color={"#ff0000"}
                                                    size={Platform.isPad ? 30 : 15}
                                                /> :
                                                <Icon
                                                    name="heart"
                                                    color={"#69abff"}
                                                    size={Platform.isPad ? 30 : 15}
                                                />
                                            }
                                        </TouchableOpacity>
                                        <Text
                                            style={{
                                                color: "#777",
                                                fontSize: Platform.isPad ? widthToDp("3%") : widthToDp("3.5%"),
                                                paddingLeft: widthToDp("2%"),
                                                fontFamily: "Poppins-Regular"
                                            }}
                                        >{item.total_like_on_comment}</Text>
                                        <Icon
                                            name="comment"
                                            color="#69abff"
                                            size={Platform.isPad ? 30 : 15}
                                            style={{paddingLeft: widthToDp("4%")}}
                                            onPress={() => this.state.isSelected ? undefined : this.threadComment(item)}
                                        />
                                        <Text
                                            style={{
                                                color: "#777",
                                                fontSize: Platform.isPad ? widthToDp("3%") : widthToDp("3.5%"),
                                                paddingLeft: widthToDp("2%"),
                                                fontFamily: "Poppins-Regular"
                                            }}
                                        >{item.total_comment_on_comment}</Text>
                                        {
                                            !this.state.isSelected && item.userimage === this.state.userDetails.profile_pic &&
                                            <TouchableOpacity
                                                style={{
                                                    flexDirection: "row",
                                                    alignItems: "center",
                                                    justifyContent: "space-between"
                                                }}
                                                onPress={() => {
                                                    !this.state.deleteIds.includes(item.comment_id) &&
                                                    this.state.deleteIds.push(item.comment_id);
                                                    this.deleteMessage(true);
                                                }}
                                            >
                                                <Ionicons
                                                    name={Platform.OS==='android' ? "md-trash" : "ios-trash"}
                                                    color="#69abff"
                                                    size={Platform.isPad ? 30 : 15}
                                                    style={{paddingLeft: widthToDp("2%")}}
                                                />
                                                <Text
                                                    style={{
                                                        color: "#777",
                                                        fontSize: Platform.isPad ? widthToDp("3%") : widthToDp("3.5%"),
                                                        paddingLeft: widthToDp("0.5%"),
                                                        fontFamily: "Poppins-Regular"
                                                    }}
                                                >Delete</Text>
                                            </TouchableOpacity>
                                        }
                                    </View> 
                                </View>
                            </TouchableOpacity>
                        )}
                        />
                    }  
                </View>
                <View
                    style={{
                        flex: 0.035,
                        backgroundColor: '#fff',
                        paddingHorizontal: widthToDp("1%"),
                        paddingBottom: heightToDp("2%"),
                        paddingTop: heightToDp("1%"),
                        marginBottom:heightToDp(`${this.state.isKeyboardOpened ? 2 : 1}%`)
                    }}
                >
                    <View
                        style={{
                            paddingHorizontal: widthToDp("2%"),
                            width: widthToDp("98%"),
                            borderWidth: 1,
                            borderRadius: 10,
                            borderColor: "#69abff",
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            height: heightToDp("5%")
                        }}
                    >
                        <TextInput
                            placeholder="Enter message"
                            placeholderTextColor="#808080"
                            style={{
                                width: Platform.isPad ? widthToDp("90%") : widthToDp("88%"),
                                paddingHorizontal: widthToDp("1%"),
                                paddingVertical: heightToDp("0%"),
                                fontSize: Platform.isPad ? widthToDp("3%") : widthToDp("4.3%"),
                                color: '#777',
                                fontFamily: "Poppins-Regular",
                                maxHeight: 300
                            }}
                            multiline
                            ref={ref => this.refChatField = ref}
                            defaultValue={this.state.commentText}
                            onChangeText={(text) => {
                                this.setState({ commentText: text, followingList: [] }, () => {
                                    // if(this.state.commentText.split(" ") && this.state.commentText.split(" ").length > 0) {
                                    //     console.warn(this.state.commentText.split(" "));
                                    // }
                                    if(
                                        this.state.commentText.includes("@") && this.state.commentText.match(/\B@\w+/g) && 
                                        this.state.commentText.match(/\B@\w+/g).length > 0 && (
                                            this.state.commentText.split(" ") && this.state.commentText.split(" ").length > 0 &&
                                            this.state.commentText.split(" ")[this.state.commentText.split(" ").length - 1] !== "" &&
                                            this.state.commentText.split(" ")[this.state.commentText.split(" ").length - 1] !== "@" && 
                                            this.state.commentText.split(" ")[this.state.commentText.split(" ").length - 1].includes("@")
                                        )
                                    ) {
                                        this.getFollowings(this.state.commentText.match(/\B@\w+/g)[this.state.commentText.match(/\B@\w+/g).length - 1]);
                                        // console.warn("Abc ", text.match(/\B@\w+/g) && text.match(/\B@\w+/g).length > 0 && text.match(/\B@\w+/g)[text.match(/\B@\w+/g).length - 1]);
                                    }
                                });
                            }}
                        />
                        <TouchableOpacity
                            onPress={this.sendComment}
                            style={{width: widthToDp("12%")}}
                            disabled={this.state.commentText.trim() === "" || this.state.isSendingComment}
                        >
                            <Ionicons
                            name={Platform.OS==='android' ? 'md-send' : 'ios-send'}
                            size={Platform.isPad ? 40 : 20}
                            color="#69abff"
                            />
                        </TouchableOpacity>
                    </View>
                </View>
            </KeyboardAvoidingView>  
                
            
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
                                    commentText: this.state.commentText.substring(0, this.state.commentText.trim().length - this.state.commentText.match(/\B@\w+/g)[this.state.commentText.match(/\B@\w+/g).length - 1].length) + "@" + item.name + " ",
                                    tagUserId: [...this.state.tagUserId, item.following_user_id]
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
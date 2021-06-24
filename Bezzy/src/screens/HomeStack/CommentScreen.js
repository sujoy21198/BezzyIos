import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import React from 'react';
import { ActivityIndicator, FlatList, Image, Platform, SafeAreaView, StatusBar, Text, TextInput, Touchable, TouchableOpacity, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Ionicons from 'react-native-vector-icons/Ionicons';
import DataAccess from '../../components/DataAccess';
import Header from '../../components/Header';
import { heightToDp, widthToDp } from '../../components/Responsive';
import Icon from 'react-native-vector-icons/FontAwesome5';
import Icon1 from 'react-native-vector-icons/FontAwesome';
import RBSheet from 'react-native-raw-bottom-sheet';
import PushNotificationController from '../../components/PushNotificationController';

export default class CommentScreen extends React.Component {
    
    constructor(props){
        super(props)
        this.state = {
            comments: [],
            commentText: "",
            isSendingComment: false,
            post_id:''
        }
        this.state.post_id = typeof this.props.route.post === "object" ? this.props.route.post.post_id : this.props.route.params.post.post_id
    }

    componentDidMount = async () => {
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
                this.setState({
                    comments: response.data.comment_list.Parent, 
                })
                console.log(this.state.comments)
            }
        } else {
            this.setState({comments: []});
        }
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
            "tag_user_id" : null,
            "commentText" : this.state.commentText.trim()
        });
        this.setState({isSendingComment: false})
        if(response.data.status === "success") {
            this.getPostCommentedUsers();
            this.setState({commentText: ""})
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

    render = () => (
        <SafeAreaView style={{flex: 1, backgroundColor: 'rgba(220,220,220,0)'}}>
            <StatusBar backgroundColor="#69abff" barStyle="light-content" />
            <Header isBackButton isHomeStackInnerPage headerText={"Comments"} navigation={this.props.navigation} commentCount={(this.props.route.params && this.props.route.params.type !== "otherUserPost") ? this.state.comments.length : undefined} />
            <KeyboardAwareScrollView
                keyboardShouldPersistTaps="handled"
                style={{flex: 0.935}}
            >
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
                            <>
                                <View
                                    style={{
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        paddingHorizontal: widthToDp("2%")
                                    }}
                                >
                                    <Image
                                        source={{uri: item.userimage}}
                                        style={{height: heightToDp("5%"), width: widthToDp("10%"), borderRadius: 25}}
                                    />
                                    <View
                                        style={{
                                            marginLeft: widthToDp("3%"),
                                            padding: widthToDp("2%"),
                                            backgroundColor: 'rgba(0, 255, 255, 0.1)',
                                            borderRadius: 10,
                                            width: widthToDp("82.5%")
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
                                        <Text
                                            style={{
                                                color: '#1b1b1b',
                                                fontSize: widthToDp("3%"),
                                                marginTop: heightToDp("1%"),
                                                fontFamily: "Poppins-Regular"
                                            }}
                                        >{item.commentText}</Text>
                                    </View>                            
                                </View>
                                <View
                                    style={{
                                        marginLeft: widthToDp("15%"),
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
                                        >
                                            {
                                                item.login_user_like_comment === "Yes" ?
                                                <Icon1
                                                    name="heart"
                                                    color={"#ff0000"}
                                                    size={15}
                                                /> :
                                                <Icon
                                                    name="heart"
                                                    color={"#69abff"}
                                                    size={15}
                                                />
                                            }
                                        </TouchableOpacity>
                                        <Text
                                            style={{
                                                color: "#777",
                                                fontSize: widthToDp("3.5%"),
                                                paddingLeft: widthToDp("2%"),
                                                fontFamily: "Poppins-Regular"
                                            }}
                                        >{item.total_like_on_comment}</Text>
                                        <Icon
                                            name="comment"
                                            color="#69abff"
                                            size={15}
                                            style={{paddingLeft: widthToDp("4%")}}
                                            onPress={() => this.threadComment(item)}
                                        />
                                        <Text
                                            style={{
                                                color: "#777",
                                                fontSize: widthToDp("3.5%"),
                                                paddingLeft: widthToDp("2%"),
                                                fontFamily: "Poppins-Regular"
                                            }}
                                        >{item.total_comment_on_comment}</Text>
                                    </View> 
                                </View>
                            </>
                        )}
                        />
                    }  
            </KeyboardAwareScrollView>  
                <View
                    style={{
                        flex: 0.065,
                        backgroundColor: '#fff',
                        padding: widthToDp("1%"),
                        marginBottom:heightToDp("1%")
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
                                width: widthToDp("88%"),
                                paddingHorizontal: widthToDp("1%"),
                                paddingVertical: heightToDp("0%"),
                                fontSize: widthToDp("4.3%"),
                                color: '#777',
                                fontFamily: "Poppins-Regular"
                            }}
                            multiline
                            ref={ref => this.refChatField = ref}
                            onChangeText={text => this.setState({commentText: text})}
                        />
                        <TouchableOpacity
                            onPress={this.sendComment}
                            style={{width: widthToDp("12%")}}
                            disabled={this.state.commentText.trim() === "" || this.state.isSendingComment}
                        >
                            <Ionicons
                            name={Platform.OS==='android' ? 'md-send' : 'ios-send'}
                            size={20}
                            color="#69abff"
                            />
                        </TouchableOpacity>
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
            <PushNotificationController navigation={this.props.navigation}/> 
        </SafeAreaView>
    )
}
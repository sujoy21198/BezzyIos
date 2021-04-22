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

export default class CommentScreen extends React.Component {
    state = {
        comments: [],
        commentText: "",
        isSendingComment: false
    }

    componentDidMount = async () => {
        this.getPostCommentedUsers();
    }    
    
    getPostCommentedUsers = async () => {
        this.RBSheet.open()
        let userId = await AsyncStorage.getItem("userId");
        let response = await axios.post(DataAccess.BaseUrl + DataAccess.postCommentedUsers, {
            "post_id" : this.props.route.params.post.post_id,
            "loginuserID" : userId
        });
        if(response.data.status === 'success') {
            if(response.data.message === "No comment found") {
                this.setState({comments: []});
            } else {
                this.setState({
                    comments: response.data.comment_list.Parent, 
                })
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
            "PostId" : this.props.route.params.post.post_id,
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

    render = () => (
        <SafeAreaView style={{flex: 1}}>
            <StatusBar backgroundColor="#69abff" barStyle="light-content" />
            <Header isBackButton isHomeStackInnerPage headerText={"Comments"} navigation={this.props.navigation} commentCount={this.state.comments.length}/>
            <View
                style={{flex: 1}}
            >
                {
                    this.state.comments.length > 0 &&
                    <FlatList
                    data={this.state.comments}
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
                                    style={{height: heightToDp("4%"), width: widthToDp("8%"), borderRadius: 20}}
                                />
                                <View
                                    style={{
                                        marginLeft: widthToDp("5%"),
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
                                            fontSize: widthToDp("3.5%")
                                        }}
                                    >{item.username}</Text>
                                    <Text
                                        style={{
                                            color: '#1b1b1b',
                                            fontSize: widthToDp("3%"),
                                            marginTop: heightToDp("1%")
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
                                        fontSize: widthToDp("3%")
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
                                            paddingLeft: widthToDp("2%")
                                        }}
                                    >{item.total_like_on_comment}</Text>
                                    <Icon
                                        name="comment"
                                        color="#69abff"
                                        size={15}
                                        style={{paddingLeft: widthToDp("4%")}}
                                    />
                                    <Text
                                        style={{
                                            color: "#777",
                                            fontSize: widthToDp("3.5%"),
                                            paddingLeft: widthToDp("2%")
                                        }}
                                    >{item.total_comment_on_comment}</Text>
                                </View> 
                            </View>
                        </>
                    )}
                    />
                }     
            </View> 
            <View
                style={{
                    backgroundColor: '#fff',
                    padding: widthToDp("1%"),
                }}
            >
                <View
                    style={{
                        paddingHorizontal: widthToDp("2%"),
                        width: widthToDp("98%"),
                        borderWidth: 1,
                        borderRadius: 5,
                        borderColor: "#69abff",
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                    }}
                >
                    <TextInput
                        placeholder="Enter message"
                        placeholderTextColor="#808080"
                        style={{
                            width: widthToDp("88%"),
                            padding: widthToDp("1%"),
                            fontSize: widthToDp("3.5%"),
                            color: '#777'
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
        </SafeAreaView>
    )
}

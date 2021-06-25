import React, { Component } from 'react'
import { Text, View, SafeAreaView, StatusBar, FlatList, TextInput, TouchableOpacity, ActivityIndicator, Image, KeyboardAvoidingView, Keyboard } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import Ionicons from 'react-native-vector-icons/Ionicons';
import DataAccess from '../../components/DataAccess';
import Header from '../../components/Header';
import { heightToDp, widthToDp } from '../../components/Responsive';
import Icon from 'react-native-vector-icons/FontAwesome5';
import Icon1 from 'react-native-vector-icons/FontAwesome';
import RBSheet from 'react-native-raw-bottom-sheet';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import PushNotificationController from '../../components/PushNotificationController';

export default class ThreadCommentScreen extends Component {
    constructor(props) {
        super(props)
        this.state = {
            comment_id: '',
            comments: [],
            commentText: '',
            post_id: '',
            isSendingComment: false,
            isKeyboardOpened: false
        }
        this.state.comment_id = this.props.route.params.comment_id
        this.state.post_id = this.props.route.params.post_id
        //alert(this.state.post_id)

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

    componentDidMount() {
        this.getCommentReplyList()
    }

    getCommentReplyList = async () => {
        this.RBSheet.open()
        let response = await axios.post(DataAccess.BaseUrl + DataAccess.commentReplyList, {
            "comment_id": this.state.comment_id
        });
        if (response.data.status === 'success') {
            if (response.data.message === "No comment found") {
                this.setState({ comments: [] });
            } else {
                this.setState({
                    comments: response.data.comment_list.Parent,
                })
                console.log(this.state.comments)
            }
        } else {
            this.setState({ comments: [] });
        }
        this.RBSheet.close()
    }

    sendComment = async () => {
        this.RBSheet.open()
        this.setState({ isSendingComment: true })
        let userId = await AsyncStorage.getItem("userId");
        let response = await axios.post(DataAccess.BaseUrl + DataAccess.postComment, {
            "userID": userId,
            "PostId": this.state.post_id,
            "commentParentId": this.state.comment_id,
            "tag_user_id": null,
            "commentText": this.state.commentText.trim()
        });
        //console.log(response.data)
        this.setState({ isSendingComment: false })
        if (response.data.status === "success") {
            this.getCommentReplyList();
            this.setState({ commentText: "" })
            this.refChatField.clear();
        } else {
            //
        }
        this.RBSheet.close();
    }
    render() {
        return (
            <SafeAreaView style={{ flex: 1, backgroundColor: 'rgba(220,220,220,0)' }}>
                <StatusBar backgroundColor="#69abff" barStyle="light-content" />
                <Header isBackButton threadCommentReload isHomeStackInnerPage headerText={"Replies"} navigation={this.props.navigation} post={{post_id: this.props.route.params.post_id}} />
                <KeyboardAvoidingView behavior="padding" style={{ flex: 1 }}>
                    <View style={{paddingVertical: heightToDp('2%'), flex: 0.135}}>
                        <View
                            style={{
                                flexDirection: 'row',
                                alignItems: "flex-start",
                                paddingHorizontal: widthToDp("2%")
                            }}
                        >
                            <Image
                                source={{ uri: this.props.route.params.userimage }}
                                style={{height: 40, width: 40, borderRadius: 40 / 2, borderWidth: 1, borderColor: '#69abff'}}
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
                                >{this.props.route.params.username}</Text>
                                <Text
                                    style={{
                                        color: '#1b1b1b',
                                        fontSize: widthToDp("3%"),
                                        marginTop: heightToDp("1%"),
                                        fontFamily: "Poppins-Regular"
                                    }}
                                >{this.props.route.params.commentText}</Text>
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
                            >{this.props.route.params.postcomment_time}</Text>
                            <View
                                style={{
                                    position: 'absolute',
                                    top: heightToDp("0%"),
                                    right: widthToDp("0%"),
                                    flexDirection: 'row',
                                    alignItems: 'center'
                                }}
                            >

                            </View>
                        </View>
                    </View>
                    <View style={{
                        flex: 0.815, 
                        marginTop: heightToDp(`${this.state.isKeyboardOpened ? 4 : 2}%`),
                        marginLeft: widthToDp("4%")
                    }}>
                        {
                            this.state.comments.length > 0 &&
                            <FlatList
                                data={this.state.comments}
                                keyExtractor={item => item.comment_id}
                                ItemSeparatorComponent={() => <View style={{ height: heightToDp("3%") }} />}
                                ListFooterComponent={<View style={{ height: heightToDp("2%") }} />}
                                renderItem={({ item, index }) => (
                                    <View style={{paddingLeft: widthToDp("10%")}}>
                                        <View
                                            style={{
                                                flexDirection: 'row',
                                                alignItems: "flex-start",
                                                paddingHorizontal: widthToDp("2%")
                                            }}
                                        >
                                            <Image
                                                source={{ uri: item.userimage }}
                                                style={{height: 40, width: 40, borderRadius: 40 / 2, borderWidth: 1, borderColor: '#69abff'}}
                                            />
                                            <View
                                                style={{
                                                    marginLeft: widthToDp("3%"),
                                                    padding: widthToDp("2%"),
                                                    backgroundColor: 'rgba(0, 255, 255, 0.1)',
                                                    borderRadius: 10,
                                                    width: widthToDp("68.5%")
                                                }}
                                            >
                                                <Text
                                                    style={{
                                                        width: widthToDp("90%"),
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

                                            </View>
                                        </View>
                                    </View>
                                )}
                            />
                        }
                    </View>    
                    <View
                        style={{
                            backgroundColor: '#fff',
                            flex: 0.05,
                            paddingHorizontal: widthToDp("1%"),
                            paddingBottom: heightToDp("2%"),
                            paddingTop: heightToDp("1%"),
                            marginBottom:heightToDp(`${this.state.isKeyboardOpened ? 2 : 1}%`)
                        }}
                    >
                        <View
                            style={{
                                padding: widthToDp("2%"),
                                width: widthToDp("98%"),
                                borderWidth: 1,
                                borderRadius: 10,
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
                                    paddingHorizontal: widthToDp("1%"),
                                    paddingVertical: heightToDp("0%"),
                                    fontSize: widthToDp("4.3%"),
                                    color: '#777',
                                    height: heightToDp("3%"),
                                    fontFamily: "Poppins-Regular"
                                }}
                                multiline
                                ref={ref => this.refChatField = ref}
                                onChangeText={text => this.setState({ commentText: text })}
                            />
                            <TouchableOpacity
                                onPress={this.sendComment}
                                style={{ width: widthToDp("12%") }}
                                disabled={this.state.commentText.trim() === "" || this.state.isSendingComment}
                            >
                                <Ionicons
                                    name={Platform.OS === 'android' ? 'md-send' : 'ios-send'}
                                    size={20}
                                    color="#69abff"
                                />
                            </TouchableOpacity>
                        </View>
                    </View>
                </KeyboardAvoidingView>
                
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
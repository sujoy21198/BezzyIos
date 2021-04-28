import React from 'react';
import { ActivityIndicator, Alert, Image, SafeAreaView, StatusBar, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { heightToDp, widthToDp } from '../../components/Responsive';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/FontAwesome5';
import Icon1 from 'react-native-vector-icons/FontAwesome';
import axios from 'axios';
import DataAccess from '../../components/DataAccess';
import RBSheet from 'react-native-raw-bottom-sheet';
import { Toast } from 'native-base';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default class ImagePreviewScreen extends React.Component {
    state = {
        numberOfLikes: 0,
        numberOfComments: 0,
        isLiked: false,
        isLoading: false,
        postCaption: "",
        captionEditable: false,
        isUpdatingCaption: false
    }

    componentDidMount() {
        this.RBSheet.open();
        if(this.props.route.params.type === "otherUserPost") {
            this.setState({postCaption: this.props.route.params.image.post_content});
        }
        this.getPostLikedUsers();
        this.getPostCommentedUsers();
        this.RBSheet.close();        
    }

    getPostCommentedUsers = async () => {
        let userId = await AsyncStorage.getItem("userId");
        let response = await axios.post(DataAccess.BaseUrl + DataAccess.postCommentedUsers, {
            "post_id" : this.props.route.params.image.post_id,
            "loginuserID" : userId
        });
        if(response.data.status === 'success') {
            if(response.data.message === "No comment found") {
                this.setState({numberOfComments: 0});
            } else {
                this.setState({
                    numberOfComments: response.data.comment_list.Parent.length, 
                })
            }
        } else {
            this.setState({numberOfComments: 0});
        }
    }

    getPostLikedUsers = async () => {
        let userId = await AsyncStorage.getItem("userId");
        let response = await axios.get(DataAccess.BaseUrl + DataAccess.postLikedUsers + "/" + this.props.route.params.image.post_id);
        if(response.data.status === 'success') {
            if(response.data.message === "No user found") {
                this.setState({numberOfLikes: 0, isLiked: false});
            } else {
                response.data.userlist.map(element => {
                    if(element.id == userId) {
                        this.setState({isLiked: true});
                    }
                })
                this.setState({
                    numberOfLikes: response.data.userlist.length
                })
            }
        } else {
            this.setState({numberOfLikes: 0});
        }
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
                        });
                        if(response.data.status === "success") {
                            this.RBSheet.close();
                            Toast.show({
                                text: response.data.message,
                                type: "success",
                                duration: 2000
                            })
                            this.props.navigation.reset({
                                index: 3,
                                routes: [
                                    { name: "ProfileScreen" }
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
        let response = await axios.get(DataAccess.BaseUrl + DataAccess.likePost + "/" + userId + "/" + this.props.route.params.image.post_id);
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
            });
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

    render = () => (
        <SafeAreaView style={{flex:1}}>
            <StatusBar backgroundColor="#69abff" barStyle="light-content" />
            <LinearGradient
                colors={['#fff', '#1b1b1b']}
            >
                <Image
                resizeMode="contain"
                source={{ uri : this.props.route.params.type === "otherUserPost" ? this.props.route.params.image.post_img_video_live[0].post_url : this.props.route.params.image.post_url.split("?src=")[1].split('&w=')[0] }}
                style={{height: heightToDp("100%"), width: widthToDp("100%"), resizeMode: "contain"}}
                />
            </LinearGradient> 
            <TouchableOpacity
                style={{
                    position: 'absolute',
                    top: heightToDp("2%"),
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
                    size={20}                    
                />  
            </TouchableOpacity>            
            <View
                style={{
                    position: 'absolute',
                    bottom: heightToDp("4%"),
                    right: widthToDp("4%"),
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
                            size={25}
                        /> :
                        <Icon
                            name="heart"
                            color={"#fff"}
                            size={25}
                        />
                    }
                </TouchableOpacity>
                <Text
                    style={{
                        color: "#fff",
                        fontSize: widthToDp("3.5%"),
                        paddingLeft: widthToDp("2%")
                    }}
                >{this.state.numberOfLikes}</Text>
                <TouchableOpacity
                    activeOpacity={0.7}
                    style={{paddingLeft: widthToDp("4%")}}
                    onPress={() => this.props.navigation.navigate("CommentScreen", {post: this.props.route.params.image})}
                    disabled={this.props.route && this.props.route.params && this.props.route.params.type === "otherUserPost"}
                >
                    <Icon
                        name="comment"
                        color="#fff"
                        size={25}
                    />
                </TouchableOpacity>
                <Text
                    style={{
                        color: "#fff",
                        fontSize: widthToDp("3.5%"),
                        paddingLeft: widthToDp("2%")
                    }}
                >{this.props.route.params.commentCount ? this.props.route.params.commentCount : this.state.numberOfComments}</Text>
                {
                    this.props.route.params.type !== "otherUserPost" &&
                    <TouchableOpacity
                        style={{paddingLeft: widthToDp("4%")}}
                        onPress={this.deleteImage}
                    >
                        <Icon
                            name="trash-alt"
                            color="#fff"
                            size={25}
                        />
                    </TouchableOpacity>
                }                
            </View> 
            <View
                style={{
                    position: 'absolute',
                    bottom: heightToDp("12%"),
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    paddingHorizontal: widthToDp("3%")
                }}
            >                
                <TextInput
                    style={{
                        color: '#fff',
                        fontSize: widthToDp("3.5%"),
                        width: widthToDp(this.props.route.params.type === "otherUserPost" ? "88%" : "83%"),
                        borderBottomWidth: (this.state.captionEditable && this.props.route.params.type !== "otherUserPost") ? 1 : 0,
                        borderBottomColor: '#fff'
                    }}
                    multiline
                    defaultValue={this.state.postCaption}
                    editable={this.state.captionEditable}
                    onChangeText={text => this.setState({postCaption: text.trim()})}
                />
                {
                    this.props.route.params.type !== "otherUserPost" &&
                    <TouchableOpacity
                        activeOpacity={0.7}
                        style={{
                            marginLeft: widthToDp("5%")
                        }}
                        disabled={this.state.isUpdatingCaption}
                        onPress={this.updateCaption}
                    >
                        {
                            this.state.isUpdatingCaption ? 
                            <ActivityIndicator size="small" color="#fff"/>
                            : <Icon
                                name={this.state.captionEditable ? "paper-plane" : "pen"}
                                color="#fff"
                                size={20}                    
                            /> 
                        } 
                    </TouchableOpacity>  
                }                              
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
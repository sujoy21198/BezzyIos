import React from 'react';
import { ActivityIndicator, Image, SafeAreaView, Text, TouchableOpacity, View } from 'react-native';
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
    }

    componentDidMount() {
        this.RBSheet.open();
        this.getPostLikedUsers();
        this.getPostCommentedUsers();
        this.RBSheet.close();        
    }

    getPostCommentedUsers = async () => {
        let userId = await AsyncStorage.getItem("userId");
        let response = await axios.post(DataAccess.BaseUrl + DataAccess.postCommentedUsers, {
            "post_id" : this.props.route.params.image.id,
            "loginuserID" : userId
        });
        if(response.data.status === 'success') {
            if(response.data.message === "No user found") {
                this.setState({numberOfComments: 0});
            } else {
                // this.setState({
                //     numberOfComments: response.data.userlist.length, 
                // })
            }
        } else {
            this.setState({numberOfComments: 0});
        }
    }

    getPostLikedUsers = async () => {
        let response = await axios.get(DataAccess.BaseUrl + DataAccess.postLikedUsers + "/" + this.props.route.params.image.id);
        if(response.data.status === 'success') {
            if(response.data.message === "No user found") {
                this.setState({numberOfLikes: 0, isLiked: false});
            } else {
                this.setState({
                    numberOfLikes: response.data.userlist.length, 
                    isLiked: true
                })
            }
        } else {
            this.setState({numberOfLikes: 0});
        }
    }

    deleteImage = async () => {
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
            this.props.navigation.goBack();
        } else {
            this.RBSheet.close();
            Toast.show({
                text: response.data,
                type: "danger",
                duration: 2000
            })
        }
    }

    likeImage = async () => {
        let userId = await AsyncStorage.getItem("userId");
        this.RBSheet.open();
        let response = await axios.get(DataAccess.BaseUrl + DataAccess.likePost + "/" + userId + "/" + this.props.route.params.image.id);
        this.RBSheet.close();
        console.warn(response);
        if(response.data.status === "success") {
            this.setState({
                numberOfLikes: response.data.activity.number_of_activity,
                isLiked: true
            })
            this.RBSheet.close();
        } else {
            this.RBSheet.close();
        }
    }
    render = () => (
        <SafeAreaView style={{flex:1}}>
            <LinearGradient
                colors={['#fff', '#1b1b1b']}
            >
                <Image
                resizeMode="contain"
                source={{ uri : this.props.route.params.image.post_url.split("?src=")[1].split('&w=')[0] }}
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
                <Icon
                    name="comment"
                    color="#fff"
                    size={25}
                    style={{paddingLeft: widthToDp("4%")}}
                    onPress={() => this.props.navigation.navigate("CommentScreen", {post: this.props.route.params.image})}
                />
                <Text
                    style={{
                        color: "#fff",
                        fontSize: widthToDp("3.5%"),
                        paddingLeft: widthToDp("2%")
                    }}
                >{this.state.numberOfComments}</Text>
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
            </View> 
            <TouchableOpacity
                style={{
                    position: 'absolute',
                    bottom: heightToDp("12%"),
                    right: widthToDp("3.5%"),
                }}
                activeOpacity={0.7}
            >
                <Icon
                    name="pen"
                    color="#fff"
                    size={20}                    
                />  
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
        </SafeAreaView>
    )
}
import React from 'react';
import { ActivityIndicator, Alert, FlatList, Image, SafeAreaView, ScrollView, StatusBar, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { heightToDp, widthToDp } from '../../components/Responsive';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/FontAwesome5';
import Icon1 from 'react-native-vector-icons/FontAwesome';
import axios from 'axios';
import DataAccess from '../../components/DataAccess';
import RBSheet from 'react-native-raw-bottom-sheet';
import { Toast } from 'native-base';
import AsyncStorage from '@react-native-async-storage/async-storage';
import PushNotificationController from '../../components/PushNotificationController';
import Video from 'react-native-video';

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
            postType: ''
        }
        this.state.otherProfile = this.props.route.params.otherProfile
        //alert(this.state.otherProfile)
    }

    componentDidMount() {
        this.RBSheet.open();
        this.getPostDetails()
    }

    getPostDetails = async () => {
        let userId = await AsyncStorage.getItem("userId");
        let response =  await axios.get(
            DataAccess.BaseUrl + DataAccess.getPostDetails + "/" + 
            this.props.route.params.image.post_id + "/" + userId
        );
        if(response.data.status === 'success') {
            if(response.data.post_details.log_user_like_status === "No") {
                this.setState({isLiked: false});
            } else if(response.data.post_details.log_user_like_status === "Yes") {
                this.setState({isLiked: true});
            }
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
        <ScrollView style={{flex:1, backgroundColor: '#1b1b1b'}}>
            <StatusBar backgroundColor="#69abff" barStyle="light-content" />            
            <LinearGradient
                style={{paddingTop: heightToDp(`${this.state.postUrl.length !== 0 ? 4 : 90}%`)}}
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
                            <Video
                                source={{ uri: item.post_url }}
                                ref={(ref) => {
                                    this.player = ref
                                }}
                                // onBuffer={this.onBuffer}
                                // onError={this.videoError}
                                controls={true}
                                // paused
                                style={{
                                    height: heightToDp("80%"),
                                    width: widthToDp("100%"),
                                    alignSelf: 'center',
                                }}
                                resizeMode="contain"
                            />
                        )}
                    />
                }                
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
            {
                !(this.props.route && this.props.route.params && this.props.route.params.hideFunctionalities) &&
                <View
                    style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        backgroundColor: '#1b1b1b',
                        paddingTop: heightToDp("2%"),
                        paddingHorizontal: widthToDp("3%")
                    }}
                >                
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
                    />
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
                                size={20}                    
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
                        paddingTop: heightToDp("2%"),
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
                                size={25}
                            /> :
                            <Icon
                                name="heart"
                                color={"#fff"}
                                size={25}
                            />
                        }
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => this.props.navigation.navigate("PostLikedUsersList", {postId: this.props.route.params.image.post_id})}
                    >
                        <Text
                            style={{
                                color: "#fff",
                                fontSize: widthToDp("3.5%"),
                                paddingLeft: widthToDp("2%"),
                                fontFamily: "Poppins-Regular"
                            }}
                        >{this.state.numberOfLikes}</Text>
                    </TouchableOpacity>
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
                            paddingLeft: widthToDp("2%"),
                            fontFamily: "Poppins-Regular"
                        }}
                    >{this.props.route.params.commentCount ? this.props.route.params.commentCount : this.state.numberOfComments}</Text>
                    
                    {
                        this.state.otherProfile === false ? ((this.props.route.params.type !== "otherUserPost") ? <TouchableOpacity
                        style={{paddingLeft: widthToDp("4%")}}
                        onPress={this.deleteImage}
                    >
                        <Icon
                            name="trash-alt"
                            color="#fff"
                            size={25}
                        />
                    </TouchableOpacity> : null):null
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
        </ScrollView>
    )
}
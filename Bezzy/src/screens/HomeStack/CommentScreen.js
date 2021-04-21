import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import React from 'react';
import { Platform, SafeAreaView, TextInput, Touchable, TouchableOpacity, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Ionicons from 'react-native-vector-icons/Ionicons';
import DataAccess from '../../components/DataAccess';
import Header from '../../components/Header';
import { widthToDp } from '../../components/Responsive';

export default class CommentScreen extends React.Component {
    state = {
        comments: [],
        commentText: ""
    }

    componentDidMount = async () => {
        this.getPostCommentedUsers();
    }    
    
    getPostCommentedUsers = async () => {
        let userId = await AsyncStorage.getItem("userId");
        let response = await axios.post(DataAccess.BaseUrl + DataAccess.postCommentedUsers, {
            "post_id" : this.props.route.params.post.id,
            "loginuserID" : userId
        });
        if(response.data.status === 'success') {
            if(response.data.message === "No user found") {
                this.setState({comments: []});
            } else {
                // this.setState({
                //     numberOfComments: response.data.userlist.length, 
                // })
            }
        } else {
            this.setState({comments: []});
        }
    }

    sendComment = async () => {

    } 

    render = () => (
        <SafeAreaView style={{flex: 1}}>
            <Header isBackButton isHomeStackInnerPage headerText={"Comments"} navigation={this.props.navigation}/>
            <KeyboardAwareScrollView 
            keyboardShouldPersistTaps="handled"
            style={{flex: 1}}>

            </KeyboardAwareScrollView>
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
                            padding: widthToDp("1%"),
                            fontSize: widthToDp("3.5%"),
                            color: '#777'
                        }}
                        onChangeText={text => this.setState({commentText: text})}
                    />
                    <TouchableOpacity
                        onPress={this.sendComment}
                    >
                        <Ionicons
                        name={Platform.OS==='android' ? 'md-send' : 'ios-send'}
                        size={20}
                        color="#69abff"
                        />
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    )
}

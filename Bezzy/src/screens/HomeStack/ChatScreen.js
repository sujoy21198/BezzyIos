import React from 'react';
import { RefreshControl,Image, SafeAreaView, ScrollView, StatusBar, FlatList, KeyboardAvoidingView, View, StyleSheet, TextInput, TouchableOpacity, Text } from 'react-native';
import BottomTab from '../../components/BottomTab';
import Header from '../../components/Header';
import {
    Container,
    Card,
    UserInfo,
    UserImgWrapper,
    UserImg,
    UserInfoText,
    UserName,
    PostTime,
    MessageText,
    TextSection,
} from '../../../styles/MessageStyles';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import DataAccess from '../../components/DataAccess';
import { heightToDp, widthToDp } from '../../components/Responsive';

// const Messages = [
    
// ];

export default class ChatScreen extends React.Component {
    state = {
        isRefreshing: false,
        Messages:[]
    }

    componentDidMount(){
        this.getChatList()
    }


    getChatList = async() => {
        let value = await AsyncStorage.getItem('userId')
        let response = await axios.get(DataAccess.BaseUrl+DataAccess.chatList+"/"+value)
        this.setState({Messages : response.data.chat_notification_list})
        console.log(response.data.chat_notification_list)
    }

    render = () => (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#ececec' }}>
            <StatusBar backgroundColor="#69abff" barStyle="light-content" />
            <Header isMessageScreen headerText="Messages" />
            <FlatList
                data={this.state.Messages}
                keyExtractor={item => item.id}
                renderItem={({ item }) => (
                    <Card onPress={() => this.props.navigation.navigate('InboxScreen', { friendId: item.friendID })}>
                        <UserInfo>
                            <View>
                                <Image
                                source={{uri:item.userimage}}
                                style={{height:heightToDp("10%"),width:widthToDp("20%"),marginLeft:widthToDp("5%")}}
                                />
                            </View>
                            <TextSection>
                                <UserInfoText>
                                    <UserName>{item.username}</UserName>
                                    <PostTime>{item.chat_date_time}</PostTime>
                                </UserInfoText>
                                <MessageText>{item.chat_message}</MessageText>
                            </TextSection>
                        </UserInfo>
                    </Card>
                )}
            />
            <BottomTab isChatFocused navigation={this.props.navigation} />
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff'
    },
    row: {
        flexDirection: 'row',
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#eee'
    },
    avatar: {
        borderRadius: 20,
        width: 40,
        height: 40,
        marginRight: 10
    },
    rowText: {
        flex: 1
    },
    message: {
        fontSize: 18
    },
    sender: {
        fontWeight: 'bold',
        paddingRight: 10
    },
    footer: {
        flexDirection: 'row',
        backgroundColor: '#eee'
    },
    input: {
        paddingHorizontal: 20,
        fontSize: 18,
        flex: 1
    },
    send: {
        alignSelf: 'center',
        color: 'lightseagreen',
        fontSize: 16,
        fontWeight: 'bold',
        padding: 20
    }
});
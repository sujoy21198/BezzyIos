import React from 'react';
import { RefreshControl, Image, SafeAreaView, ScrollView, StatusBar, FlatList, KeyboardAvoidingView, View, StyleSheet, TextInput, TouchableOpacity, Text, ActivityIndicator, Platform } from 'react-native';
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
import PushNotificationController from '../../components/PushNotificationController';
import RBSheet from 'react-native-raw-bottom-sheet';
// const Messages = [

// ];

export default class ChatScreen extends React.Component {
    state = {
        isRefreshing: false,
        Messages: []
    }

    componentDidMount() {
        this.unsubscribe = this.props.navigation.addListener("focus", () => {
            this.RBSheet.open()
            this.getChatList("")
        })
        this.RBSheet.open()
        this.getChatList("")
    }

    componentWillUnmount() {
        this.unsubscribe()
    }


    getChatList = async (type) => {
        let value = await AsyncStorage.getItem('userId')
        let response = await axios.get(DataAccess.BaseUrl + DataAccess.chatList + "/" + value)
        this.setState({ Messages: response.data.chat_notification_list })
        console.log(response.data.chat_notification_list)
        if(type === "pullRefresh") this.setState({isRefreshing: false})
        else this.RBSheet.close()
    }

    render = () => (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#ececec' }}>
            <StatusBar backgroundColor="#69abff" barStyle="light-content" />
            <Header isMessageScreen headerText="Messages" />
            <FlatList
                data={this.state.Messages}
                keyExtractor={item => item.id}
                refreshing={this.state.isRefreshing}
                onRefresh={() => this.setState({ isRefreshing: true }, () => this.getChatList("pullRefresh"))}
                renderItem={({ item }) => (
                    !Platform.isPad ? 
                    <Card onPress={() => this.props.navigation.navigate('InboxScreen', { friendId: item.friendID, friendImage: item.userimage, friendName: item.username })}>
                        <UserInfo>
                            <View>
                                <Image
                                    source={{ uri: item.userimage }}
                                    style={{height: 40, width: 40, borderRadius: 40 / 2, borderWidth: 1, borderColor: '#69abff', marginTop: heightToDp("1%"), marginLeft: widthToDp("5%")}}
                                />
                                {
                                    item.user_active_status === "true" &&
                                    <View 
                                        style={{
                                            height: 13,
                                            width: 13,
                                            borderRadius: 13 / 2,
                                            backgroundColor: "#008000",
                                            left: widthToDp("15%"),
                                            top: widthToDp("-2%")
                                        }}
                                    />
                                }
                            </View>
                            <TextSection>
                                <UserInfoText>
                                    <Text style={{ width: "50%", fontFamily: "ProximaNova-Black" }}>{item.username}</Text>
                                    <PostTime>{item.chat_date_time}</PostTime>
                                </UserInfoText>
                                <UserInfoText>
                                    <Text style={{ width: "90%", fontFamily: "Poppins-Regular", }} numberOfLines={1} ellipsizeMode="tail">{item.chat_message}</Text>
                                    {
                                        item.unread_msg > 0 &&
                                        <View
                                            style={{
                                                height: 20,
                                                width: 20,
                                                borderRadius: 20 / 2,
                                                backgroundColor: "#69abff",
                                                justifyContent: "center",
                                                alignItems: 'center'
                                            }}
                                        >
                                            <Text style={{ color: "#fff", fontSize: widthToDp("3"), fontFamily: "Poppins-Regular", }}>{item.unread_msg}</Text>
                                        </View>
                                    }
                                </UserInfoText>
                            </TextSection>
                        </UserInfo>
                    </Card> :
                    <TouchableOpacity 
                    style={{
                        flexDirection: 'row',
                        alignItems: "center"
                    }}
                    onPress={() => this.props.navigation.navigate('InboxScreen', { friendId: item.friendID, friendImage: item.userimage, friendName: item.username })}>
                        <Image
                            source={{ uri: item.userimage }}
                            style={{height: Platform.isPad ? 80 : 40, width: Platform.isPad ? 80 : 40, borderRadius: Platform.isPad ? 80 / 2 : 40 / 2, borderWidth: 1, borderColor: '#69abff', marginTop: heightToDp("2%"), marginLeft: widthToDp("2%")}}
                        />
                        {
                            item.user_active_status === "true" &&
                            <View 
                                style={{
                                    height: 20,
                                    width: 20,
                                    borderRadius: 20 / 2,
                                    backgroundColor: "#008000",
                                    position: "absolute",
                                    left: widthToDp("9%"),
                                    top: widthToDp("9%")
                                }}
                            />
                        }
                        <View
                            style={{
                                flexDirection: "column",
                                justifyContent: "flex-start",
                                marginLeft: widthToDp("3%"),
                                paddingTop: heightToDp("3%"),
                                paddingBottom: heightToDp('1%'),
                                borderBottomWidth: 1,
                                borderBottomColor: "#cccccc",
                                width: "85%"
                            }}
                        >
                            <View
                                style={{
                                    flexDirection: "row",
                                    justifyContent: "space-between",
                                }}
                            >
                                <Text style={{ width: "57%", fontSize: widthToDp("3%"), fontFamily: "ProximaNova-Black" }}>{item.username}</Text>
                                <Text style={{
                                    fontSize: widthToDp("2%"),
                                    color: "#666",
                                    fontFamily: "Poppins-Regular"
                                }}>{item.chat_date_time}</Text>
                            </View>
                            <View
                                style={{
                                    flexDirection: "row",
                                    justifyContent: "space-between",
                                    alignItems: 'center',
                                }}
                            >
                                <Text style={{ width: "80%", fontSize: widthToDp("2%"), fontFamily: "Poppins-Regular", }} numberOfLines={1} ellipsizeMode="tail">{item.chat_message}</Text>
                                    {
                                        item.unread_msg > 0 &&
                                        <View
                                            style={{
                                                height: Platform.isPad ? 30 : 20,
                                                width: Platform.isPad ? 30 : 20,
                                                borderRadius: Platform.isPad ? 30 / 2 : 20 / 2,
                                                backgroundColor: "#69abff",
                                                justifyContent: "center",
                                                alignItems: 'center'
                                            }}
                                        >
                                            <Text style={{ color: "#fff", fontSize: widthToDp("2%"), fontFamily: "Poppins-Regular", }}>{item.unread_msg}</Text>
                                        </View>
                                    }  
                            </View>
                        </View>
                    </TouchableOpacity>
                )}
            />
            <PushNotificationController navigation={this.props.navigation} />
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
        padding: 20
    }
});
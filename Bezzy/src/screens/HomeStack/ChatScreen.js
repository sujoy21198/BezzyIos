import React from 'react';
import { RefreshControl, Image, SafeAreaView, ScrollView, StatusBar, FlatList, KeyboardAvoidingView, View, StyleSheet, TextInput, TouchableOpacity, Text, ActivityIndicator } from 'react-native';
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
        this.RBSheet.open()
        this.getChatList()
    }


    getChatList = async () => {
        let value = await AsyncStorage.getItem('userId')
        let response = await axios.get(DataAccess.BaseUrl + DataAccess.chatList + "/" + value)
        this.setState({ Messages: response.data.chat_notification_list })
        console.log(response.data.chat_notification_list)
        this.RBSheet.close()
    }

    render = () => (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#ececec' }}>
            <StatusBar backgroundColor="#69abff" barStyle="light-content" />
            <Header isMessageScreen headerText="Messages" />
            <FlatList
                data={this.state.Messages}
                keyExtractor={item => item.id}
                renderItem={({ item }) => (
                    <Card onPress={() => this.props.navigation.navigate('InboxScreen', { friendId: item.friendID, friendImage: item.userimage, friendName: item.username })}>
                        <UserInfo>
                            <View>
                                <Image
                                    source={{ uri: item.userimage }}
                                    style={{ height: heightToDp("7%"), width: widthToDp("13%"), marginLeft: widthToDp("5%"), borderRadius: 300, marginTop: heightToDp("1%") }}
                                />
                            </View>
                            <TextSection>
                                <UserInfoText>
                                    <Text style={{ width: "50%", fontWeight: "bold" }}>{item.username}</Text>
                                    <PostTime>{item.chat_date_time}</PostTime>
                                </UserInfoText>
                                <UserInfoText>
                                    <Text style={{ width: "90%" }}>{item.chat_message}</Text>
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
                                            <Text style={{ color: "#fff", fontSize: widthToDp("2.8%") }}>{item.unread_msg}</Text>
                                        </View>
                                    }
                                </UserInfoText>
                            </TextSection>
                        </UserInfo>
                    </Card>
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
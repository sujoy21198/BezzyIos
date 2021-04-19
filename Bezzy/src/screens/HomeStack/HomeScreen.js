import React from 'react';
import { ActivityIndicator, FlatList, Image, SafeAreaView, ScrollView, Text, Touchable, TouchableOpacity, View } from 'react-native';
import { Card, Toast } from 'native-base'
import { FlatGrid } from 'react-native-super-grid';
import Icon from 'react-native-vector-icons/FontAwesome5';
import BottomTab from '../../components/BottomTab';
import Header from '../../components/Header';
import { heightToDp, widthToDp } from '../../components/Responsive';
import Accordion from 'react-native-collapsible/Accordion';
import axios from 'axios';
import DataAccess from '../../components/DataAccess';
import AsyncStorage from '@react-native-async-storage/async-storage';


const SECTIONS = [
    {
        title: 'First',
        content: 'Lorem ipsum...',
        lastSeen: '1 Day Ago',
        image: 'https://media.wired.com/photos/598e35fb99d76447c4eb1f28/master/pass/phonepicutres-TA.jpg',
        postedTime: '2 minutues ago',
        caption: 'Hi there'
    },
    {
        title: 'Second',
        content: 'Lorem ipsum...',
        lastSeen: '2 Days Ago',
        image: 'https://media.wired.com/photos/598e35fb99d76447c4eb1f28/master/pass/phonepicutres-TA.jpg',
        postedTime: '2 minutues ago',
        caption: 'Hi there'
    },
];

export default class HomeScreen extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            activeSections: [],
            isLoading: false,
            userList: [],
            followingList: []
        }
    }

    componentDidMount = async () => {
        this.fetchHomeListing();
    }

    fetchHomeListing = async () => {
        let userId = await AsyncStorage.getItem("userId");
        let response = await axios.get(DataAccess.BaseUrl + DataAccess.friendBlockList + "/" + userId);
        if(response.data.status === "error") {
            let responseUserList = await axios.post(DataAccess.BaseUrl + DataAccess.userList, {
                "log_userID": userId
            });
            if(responseUserList.data.resp === "success") {
                console.warn(responseUserList);
                this.setState({userList: responseUserList.data.all_user_list, isLoading: false, followingList: []});
            } else {
                this.setState({userList: [], isLoading: false, followingList: []});
            }
        } else {
            // console.warn("Friend is there", response);
            this.setState({followingList: response.data.total_feed_response.friend_list});
            await AsyncStorage.setItem("numberOfFollowings", String(response.data.total_feed_response.friend_list.length));
        }
    }

    _renderSectionTitle = section => {
        return (
            <View >
                <Text>{section.content}</Text>
            </View>
        );
    };

    followUser = async (item, index) => {
        console.warn(item, index);
        let userId = await AsyncStorage.getItem("userId");
        let response = await axios.post(DataAccess.BaseUrl + DataAccess.followUser, {
            "user_one_id" : userId,
            "user_two_id" : item.user_id
        });
        if(response.data.status === "success") {
            this.fetchHomeListing();
            return Toast.show({
                text: "Follow successful",
                type: "success",
                duration: 2000
            })
        }
        // console.warn(response);
    } 

    _renderHeader = section => {
        console.warn(section);
        return (
            <View >
                <Card style={{ height: heightToDp("15%"), width: widthToDp("95%"), alignSelf: 'center', justifyContent: 'center', borderRadius: 10 }}>
                    <View style={{ flexDirection: 'row' }}>
                        <Image
                            source={{uri: section.friend_photo}}
                            style={{ height: heightToDp("13%"), width: widthToDp("22%"), marginLeft: widthToDp("2%"), borderRadius: 10 }}
                        />
                        <View>
                            <View style={{ marginLeft: widthToDp("60%"), marginTop: heightToDp("-1%") }}>
                                <Image
                                source={require("../../../assets/ago.png")}
                                resizeMode="contain"
                                style={{height: heightToDp("6%"), width: widthToDp("6%")}}
                                />
                            </View>
                            <View style={{ marginLeft: widthToDp("6%"),marginTop: heightToDp("-1.5%") }}>
                                <Text>{section.friend_name}</Text>
                            </View>
                            {
                                section.past_post_days!=="" &&
                                <View style={{ marginLeft: widthToDp("6%"), }}>
                                    <Text style={{ color: '#ff0000' }}>{section.past_post_days} days ago</Text>
                                </View>
                            }                            
                            <TouchableOpacity 
                            activeOpacity={0.7}
                            onPress={() => this.props.navigation.navigate("MessageScreen")}
                            style={{ marginLeft: widthToDp("60%"), marginTop: heightToDp(`${section.past_post_days!=="" ? 2 : 4}%`) }}>
                                <Icon
                                    name="comments"
                                    size={20}
                                    color={"#87CEEB"}
                                />
                            </TouchableOpacity>
                        </View>

                    </View>
                </Card>
            </View>
        );
    };

    _renderContent = section => {
        return (
            <View >
                <Card style={{ height: heightToDp("60%"), width: widthToDp("95%"), alignSelf: 'center', borderRadius: 10 }}>
                    <View style={{ flexDirection: 'row' }}>
                        <Image
                            source={require("../../../assets/default_person.png")}
                            style={{ height: heightToDp("8%"), width: widthToDp("10%"), marginLeft: widthToDp("4%"), borderRadius: 300, marginTop: heightToDp("2%") }}
                        />
                        <View>
                            <View style={{ marginLeft: widthToDp("6%"), marginTop: heightToDp("4%") }}>
                                <Text>{section.title}</Text>
                            </View>
                            <View style={{ marginLeft: widthToDp("6%"), marginTop: heightToDp("0%") }}>
                                <Text style={{ color: 'blue' }}>{section.postedTime}</Text>
                            </View>
                        </View>
                    </View>
                    <View>
                        <View style={{ marginLeft: widthToDp("6%"), marginTop: heightToDp("0%") }}>
                            <Text style={{ color: 'black' }}>{section.caption}</Text>
                        </View>
                    </View>
                    <View style={{ alignSelf: 'center',marginTop:heightToDp("2%") }}>
                        <Image
                            style={{ height: heightToDp("20%"), width: widthToDp("60%") }}
                            source={{ uri: 'https://media.wired.com/photos/598e35fb99d76447c4eb1f28/master/pass/phonepicutres-TA.jpg' }}
                        />
                    </View>
                </Card>
            </View>
        );
    };

    _updateSections = activeSections => {
        this.setState({ activeSections });
    };

    render() {
        return (
            <SafeAreaView style={{ flex: 1, backgroundColor: '#ececec' }}>
                <Header isHomeScreen />
                {
                    this.state.isLoading ?
                    <View
                        style={{
                            flex: 1,
                            justifyContent: 'center',
                            alignItems: 'center'
                        }}
                    >
                        <ActivityIndicator
                            size="large"
                            color="#69abff"
                        />
                    </View>: (
                        this.state.followingList.length > 0 ?
                        <ScrollView>
                            <Accordion
                                sections={this.state.followingList}
                                activeSections={this.state.activeSections}
                                //renderSectionTitle={this._renderSectionTitle}
                                renderHeader={this._renderHeader}
                                renderContent={this._renderContent}
                                onChange={this._updateSections}
                            />
                            <View style={{ marginBottom: heightToDp("10%") }}></View>
                        </ScrollView>:
                        <FlatList
                            data={this.state.userList}
                            numColumns={3}
                            contentContainerStyle={{
                                padding: widthToDp("2%")
                            }}
                            ListFooterComponent={<View style={{ height: heightToDp("10%") }} />}
                            renderItem={({ item, index }) => (
                                <View
                                    style={{
                                        paddingVertical: heightToDp("1%"),
                                        width: widthToDp("30%"),
                                        backgroundColor: "#fff",
                                        borderRadius: 10,
                                        marginRight: widthToDp("2%"),
                                        marginBottom: heightToDp("1%")
                                    }}
                                    key={index}
                                >
                                    <Image
                                        source={{uri: item.image}}
                                        style={{ height: heightToDp("13%"), width: widthToDp("30%") }}
                                        resizeMode="contain"
                                    />
                                    <Text
                                        style={{
                                            textAlign: "center",
                                            paddingVertical: heightToDp("0.8%"),
                                        }}
                                    >{item.name}</Text>
                                    <TouchableOpacity
                                        activeOpacity={0.7}
                                        style={{
                                            backgroundColor: "#69abff",
                                            borderRadius: 10,
                                            alignItems: "center",
                                            padding: 5,
                                            marginHorizontal: 5
                                        }}
                                        onPress={() => this.followUser(item, index)}
                                    >
                                        <Text style={{ color: "#fff" }}>FOLLOW</Text>
                                    </TouchableOpacity>
                                </View>
                            )}
                        />
                    )                    
                }
                <BottomTab isHomeFocused navigation={this.props.navigation} />
            </SafeAreaView>
        )
    }
}
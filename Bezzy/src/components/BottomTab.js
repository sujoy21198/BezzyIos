import Icon from 'react-native-vector-icons/Ionicons';
import React from "react";
import { Dimensions, Platform, SafeAreaView, Text, TouchableOpacity, View, Image } from "react-native";
import { SceneMap, TabBar, TabView } from "react-native-tab-view";
import { heightToDp, widthToDp } from './Responsive';
import axios from 'axios';
import DataAccess from './DataAccess';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default class BottomTab extends React.Component {
    componentDidMount = async() => {
        let userID = await AsyncStorage.getItem('userId')
        await axios.post(DataAccess.BaseUrl + DataAccess.setUserActiveStatus, {
            "userID" : userID,
            "user_active_status" : "true"
        }).then(res => {
            // console.log(res.data);
        }).catch(err => {
            // console.log(err);
        })
    }

    render = () => (
        <SafeAreaView
            style={{
                position: 'absolute',
                bottom: heightToDp("0%"),
                width: widthToDp("100%"),
                backgroundColor: '#ececec',
            }}
        >
            <View
                style={{
                    backgroundColor: '#ececec',
                    height: heightToDp("9%"),
                    justifyContent: 'flex-end',
                    borderTopWidth: 10,
                    paddingBottom: heightToDp("1%"),
                    borderTopColor: '#ececec'
                }}
            >
                <View
                    style={{
                        height: heightToDp("7.5%"),
                        flexDirection: 'row'
                    }}
                >
                    <TouchableOpacity
                        style={{
                            backgroundColor: '#fff',
                            height: heightToDp("8%"),
                            width: widthToDp("21.3%"),
                            justifyContent: 'center',
                            alignItems: 'center',
                            elevation: 10
                        }}
                        activeOpacity={0.7}
                        onPress={
                            () =>
                                this.props.isHomeFocused ?
                                    undefined :
                                    this.props.navigation.reset({
                                        index: 0,
                                        routes: [
                                            { name: "HomeScreen" }
                                        ]
                                    })
                        }
                    >
                        {
                            this.props.isHomeFocused ? 
                            <Image
                                source={require("../../assets/homeBlue.png")}
                                style={{ height: heightToDp("3.1%"), width: widthToDp("6%") }}
                                resizeMode="contain"
                            /> :
                            <Image
                                source={require("../../assets/home.png")}
                                style={{ height: heightToDp("6%"), width: widthToDp("6%") }}
                                resizeMode="contain"
                            />
                        } 
                        {
                            this.props.isHomeFocused &&
                            <Text
                                style={{
                                    fontSize: widthToDp("3%"),
                                    color: "#69abff",
                                    fontFamily: "ProximaNova-Black",
                                }}
                            >Home</Text>
                        }
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={{
                            backgroundColor: '#fff',
                            height: heightToDp("8%"),
                            width: widthToDp("21.3%"),
                            justifyContent: 'center',
                            borderTopWidth: 1,
                            borderTopColor: '#ececec',
                            borderTopRightRadius: 8,
                            alignItems: 'center',
                            elevation: 10,
                        }}
                        activeOpacity={0.7}
                        onPress={() => this.props.isChatFocused ? undefined : this.props.navigation.navigate("ChatScreen")}
                    >
                        {
                            this.props.isChatFocused ? 
                            <Image
                                source={require("../../assets/chatBlue.png")}
                                style={{ height: heightToDp("3.1%"), width: widthToDp("6%") }}
                                resizeMode="contain"
                            /> :
                            <Image
                                source={require("../../assets/chat.png")}
                                style={{ height: heightToDp("6%"), width: widthToDp("6%") }}
                                resizeMode="contain"
                            />
                        } 
                        {
                            this.props.isChatFocused &&
                            <Text
                                style={{
                                    fontSize: widthToDp("3%"),
                                    color: "#69abff",
                                    fontFamily: "ProximaNova-Black",
                                }}
                            >Chat</Text>
                        }
                    </TouchableOpacity>
                    <View
                        style={{
                            height: heightToDp("7.5%"),
                            width: widthToDp("14.8%"),
                            backgroundColor: '#fff',
                            elevation: 10,
                            flex: 1
                        }}
                    >
                        <View
                            style={{
                                height: heightToDp("7.5%"),
                                flex: 1,
                                borderBottomWidth: 1,
                                borderBottomLeftRadius: 30,
                                borderBottomRightRadius: 30,
                                borderBottomColor: '#ececec',
                                backgroundColor: '#ececec'
                            }}
                        />
                        <TouchableOpacity
                            style={{
                                position: 'absolute',
                                bottom: heightToDp("4.9%"),
                                left: widthToDp("1.4%"),
                                height: 50,
                                width: Platform.isPad ? '80%' : 50,
                                borderRadius: 50 / 2,
                                backgroundColor: "#007dfe",
                                justifyContent: 'center',
                                alignItems: 'center',
                                elevation: 2
                            }}
                            activeOpacity={0.7}
                            onPress={() => this.props.navigation.navigate("PostScreen")}
                        >
                            <Icon
                                name={Platform.OS === 'android' ? 'md-add' : 'ios-add'}
                                size={30}
                                color="#fff"
                            />
                        </TouchableOpacity>
                        <View style={{ height: heightToDp("3.8%"), backgroundColor: '#fff' }} />
                    </View>
                    <TouchableOpacity
                        style={{
                            backgroundColor: '#fff',
                            height: heightToDp("8%"),
                            width: widthToDp("21.3%"),
                            justifyContent: 'center',
                            alignItems: 'center',
                            elevation: 10,
                            borderTopWidth: 1,
                            borderTopColor: '#ececec',
                            borderTopLeftRadius: 8,
                        }}
                        activeOpacity={0.7}
                        onPress={
                            () =>
                                this.props.isSearchFocused ?
                                    undefined :
                                    this.props.navigation.reset({
                                        index: 2,
                                        routes: [
                                            { name: "SearchScreen" }
                                        ]
                                    })
                        }
                    >
                        {
                            this.props.isSearchFocused ? 
                            <Image
                                source={require("../../assets/searchBlue.png")}
                                style={{ height: heightToDp("3.1%"), width: widthToDp("6%") }}
                                resizeMode="contain"
                            /> :
                            <Image
                                source={require("../../assets/search.png")}
                                style={{ height: heightToDp("6%"), width: widthToDp("6%") }}
                                resizeMode="contain"
                            />
                        } 
                        {
                            this.props.isSearchFocused &&
                            <Text
                                style={{
                                    fontSize: widthToDp("3%"),
                                    color: "#69abff",
                                    marginLeft: widthToDp("1%"),
                                    fontFamily: "ProximaNova-Black",
                                }}
                            >Search</Text>
                        }
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={{
                            backgroundColor: '#fff',
                            height: heightToDp("8%"),
                            width: widthToDp("21.3%"),
                            justifyContent: 'center',
                            alignItems: 'center',
                            elevation: 10
                        }}
                        activeOpacity={0.7}
                        onPress={
                            () =>
                                this.props.isProfileFocused ?
                                    undefined :
                                    this.props.navigation.reset({
                                        index: 3,
                                        routes: [
                                            { name: "ProfileScreen", params: { profile_id: '' } }
                                        ]
                                    })
                        }
                    >
                        {
                            this.props.isProfileFocused ? 
                            <Image
                                source={require("../../assets/profileBlue.png")}
                                style={{ height: heightToDp("3.1%"), width: widthToDp("6%") }}
                                resizeMode="contain"
                            /> :
                            <Image
                                source={require("../../assets/profile.png")}
                                style={{ height: heightToDp("6%"), width: widthToDp("6%") }}
                                resizeMode="contain"
                            />
                        } 
                        {
                            this.props.isProfileFocused &&
                            <Text
                                style={{
                                    fontSize: widthToDp("3%"),
                                    color: "#69abff",
                                    fontFamily: "ProximaNova-Black",
                                }}
                            >Profile</Text>
                        }
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    )
}
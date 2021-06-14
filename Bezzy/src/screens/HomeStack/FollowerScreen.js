import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { Toast } from 'native-base';
import React from 'react';
import { ActivityIndicator, FlatList, Image, SafeAreaView, StatusBar, Text, Touchable, TouchableOpacity, View } from 'react-native';
import RBSheet from 'react-native-raw-bottom-sheet';
import DataAccess from '../../components/DataAccess';
import Header from '../../components/Header';
import { heightToDp, widthToDp } from '../../components/Responsive';
import PushNotificationController from '../../components/PushNotificationController';

export default class FollowerScreen extends React.Component {
    state = {
        followerList: [],
        isLoading: false
    }

    componentDidMount = async () => {
        this.setState({isLoading: true})
        let userId = await AsyncStorage.getItem("userId");
        let response = await axios.post(DataAccess.BaseUrl + DataAccess.followerList, {
            "loguser_id" : userId
        });
        if(response.data.resp === "success") {
            this.setState({followerList: response.data.follower_user_list});
        } else {
            this.setState({followerList: []});
        }
        this.setState({isLoading: false})
    }

    followBack = async (item, index) => {
        this.RBSheet.open();
        let userId = await AsyncStorage.getItem("userId");
        let response = await axios.post(DataAccess.BaseUrl + DataAccess.followBack, {
            "login_userID" : userId,
            "userID" : item.following_user_id
        });
        if(response.data.status === "success") {
            Toast.show({
                type: "success",
                text: response.data.message,
                duration: 3000
            })
        } else {
            Toast.show({
                type: "success",
                text: response.data.message,
                duration: 3000
            })
            // this.setState({followingList: []});
        }
        this.RBSheet.close()
    }

    removeUser = async (item, index) => {
        this.RBSheet.open();
        let userId = await AsyncStorage.getItem("userId");
        let response = await axios.post(DataAccess.BaseUrl + DataAccess.removeUser, {
            "loginUserID" : userId,
            "removeuserID" : item.following_user_id
        });
        if(response.data.resp === "success") {
            let followerList = this.state.followerList;
            followerList.splice(index, 1);
            this.setState({followerList});
            Toast.show({
                type: "success",
                text: response.data.message,
                duration: 3000
            })
        } else {
            Toast.show({
                type: "success",
                text: response.data.message,
                duration: 3000
            })
        }
        this.RBSheet.close()
    }

    blockUser = async (item, index) => {
        this.RBSheet.open();
        let userId = await AsyncStorage.getItem("userId");
        let response = await axios.post(DataAccess.BaseUrl + DataAccess.blockUser, {
            "loginUserID" : userId,
            "blockuserID" : item.following_user_id
        });
        if(response.data.status === "success") {
            let followerList = this.state.followerList;
            followerList.splice(index, 1);
            this.setState({followerList});
            Toast.show({
                type: "success",
                text: response.data.message,
                duration: 3000
            })
        } else {
            Toast.show({
                type: "success",
                text: response.data.message,
                duration: 3000
            })
        }
        this.RBSheet.close()
    }

    render = () => (
        <SafeAreaView style={{flex: 1}}>       
            <StatusBar backgroundColor="#69abff" barStyle="light-content" />
            <Header isHomeStackInnerPage block={true} headerText={this.props.route.params.user} navigation={this.props.navigation}/>
            {
                this.state.isLoading ?
                <View 
                    style={{
                        flex: 1,
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}
                >
                    <ActivityIndicator size="large" color="#007dfe"/>
                </View>:
                <FlatList
                    contentContainerStyle={{
                        padding: widthToDp("2%")
                    }}
                    data={this.state.followerList}
                    ItemSeparatorComponent={() => <View style={{height: heightToDp("1%")}}/>}
                    renderItem={({item, index}) => (
                        <View
                            style={{
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                backgroundColor: "#fff",
                                padding: widthToDp("3%"),
                                borderRadius: 10
                            }}
                        >
                            <View
                                style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    width: widthToDp("63%")
                                }}
                            >
                                <Image
                                    source={{uri: item.image}}
                                    style={{height: heightToDp("5%"), width: widthToDp("10%"), borderRadius: 40, borderWidth: 1, borderColor: '#69abff'}}
                                />
                                <Text
                                    style={{
                                        marginLeft: widthToDp("2%")
                                    }}
                                >{item.name}</Text>
                            </View>
                            <View
                                style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    width: widthToDp("30%")
                                }}
                            >
                                <TouchableOpacity
                                    activeOpacity={0.7}
                                    onPress={() => this.followBack(item, index)}
                                >
                                    <Image
                                        source={require("../../../assets/unfollow.png")}
                                        style={{height: heightToDp("2.5%"), width: widthToDp("8%")}}
                                        resizeMode="contain"
                                    />
                                </TouchableOpacity>
                                <TouchableOpacity
                                    activeOpacity={0.7}
                                    style={{
                                        marginLeft: widthToDp("2%")
                                    }}
                                    onPress={() => this.removeUser(item, index)}
                                >
                                    <Image
                                        source={require("../../../assets/remove.png")}
                                        style={{height: heightToDp("2.5%"), width: widthToDp("8%")}}
                                        resizeMode="contain"
                                    />
                                </TouchableOpacity>
                                <TouchableOpacity
                                    activeOpacity={0.7}
                                    style={{
                                        marginLeft: widthToDp("2%")
                                    }}
                                    onPress={() => this.blockUser(item, index)}
                                >
                                    <Image
                                        source={require("../../../assets/block.png")}
                                        style={{height: heightToDp("2.5%"), width: widthToDp("8%")}}
                                        resizeMode="contain"
                                    />
                                </TouchableOpacity>
                            </View>
                        </View>
                    )}
                />
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
        </SafeAreaView>
    )
}
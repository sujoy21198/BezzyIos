import React from 'react';
import { FlatList, Image, SafeAreaView, Text, TouchableOpacity, View, TextInput, ActivityIndicator, StatusBar } from 'react-native';
import BottomTab from '../../components/BottomTab';
import Header from '../../components/Header';
import { heightToDp, widthToDp } from '../../components/Responsive';
import Icon from 'react-native-vector-icons/FontAwesome5';
import RBSheet from 'react-native-raw-bottom-sheet';
import RBSheet1 from 'react-native-raw-bottom-sheet';
import RBSheet2 from 'react-native-raw-bottom-sheet';
import axios from 'axios';
import DataAccess from '../../components/DataAccess'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Toast } from 'native-base';
import LinearGradient from 'react-native-linear-gradient';

export default class SearchScreen extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            userList: [],
            isRefreshing: false
        }
    }
    componentDidMount() {
        this.RBSheet2.open()
        this.searchUsers("")
    }
    searchUsers = async (text, type) => {
        if (type === "pullRefresh") { this.setState({ userList: [] }) }
        var user = [], response;
        let userId = await AsyncStorage.getItem("userId");
        if (text !== "") {
            response = await axios.post(DataAccess.BaseUrl + DataAccess.Search, {
                searchval: text,
                loguser_id: userId
            })
        } else {
            response = await axios.post(DataAccess.BaseUrl + DataAccess.userList, {
                log_userID: userId
            })
        }
        if (response.data.resp === "success") {
            if (text !== "") {
                user = response.data.search_result;
            } else {
                user = response.data.all_user_list;
            }
        } else {
            user = [];
        }
        this.setState({ userList: user, isRefreshing: false })
        this.RBSheet2.close()
    }

    followUser = async (item, index) => {
        this.RBSheet.open();
        let userId = await AsyncStorage.getItem("userId"), response;
        if (item.user_is_flollowers === "No") {
            response = await axios.post(DataAccess.BaseUrl + DataAccess.followUser, {
                "user_one_id": userId,
                "user_two_id": item.user_id
            });
        } else {
            response = await axios.post(DataAccess.BaseUrl + DataAccess.followBack, {
                "login_userID": userId,
                "userID": item.user_id
            });
        }
        if (response.data.status === "success") {
            Toast.show({
                text: item.user_is_flollowers === "No" ? "Follow successful" : response.data.message,
                type: "success",
                duration: 2000
            })
            this.props.navigation.reset({
                index: 0,
                routes: [
                    { name: "HomeScreen" }
                ]
            });
        } else {
            Toast.show({
                text: response.data.message,
                type: "warning",
                duration: 2000
            })
        }
        this.RBSheet.close();
    }

    render() {
        var userList = []
        userList = this.state.userList
        return (
            <SafeAreaView style={{ flex: 1, backgroundColor: '#ececec' }}>
                <StatusBar backgroundColor="#69abff" barStyle="light-content" />
                <View style={{ height: heightToDp("5%"), backgroundColor: "#fff", flexDirection: 'row' }}>
                    <View style={{ marginTop: heightToDp("1.3%"), marginLeft: widthToDp("2%"), width: widthToDp("37%") }}>
                        <Text style={{ fontSize: widthToDp("4.5%"), color: '#007dfe', fontWeight: 'bold' }}>Search for friends</Text>
                    </View>
                    <TouchableOpacity
                        activeOpacity={0.7}
                        onPress={() => this.RBSheet1.open()}
                    >
                        <Icon
                            name={"search"}
                            size={20}
                            color="#a9a9a9"
                            style={{ marginLeft: widthToDp("50%"), marginTop: heightToDp("1%") }}
                        />
                    </TouchableOpacity>
                    <RBSheet
                        ref={ref => {
                            this.RBSheet1 = ref;
                        }}
                        height={heightToDp("6%")}
                        // openDuration={250}
                        customStyles={{
                            container: {
                                width: widthToDp("97%"),
                                position: 'absolute',
                                top: heightToDp("5.5%"),
                                alignItems: 'flex-start',
                                justifyContent: 'center',
                                paddingLeft: widthToDp("5%"),
                                backgroundColor: '#fff',
                                borderRadius: 15
                            },
                        }}
                    >
                        <TextInput
                            placeholderTextColor="#808080"
                            placeholder="Search by name"
                            style={{
                                width: widthToDp("97%"),
                                color: "#777",
                                fontSize: widthToDp("3.5%")
                            }}
                            onChangeText={text => this.searchUsers(text)}
                        />
                    </RBSheet>
                </View>
                <FlatList
                    data={userList}
                    numColumns={3}
                    contentContainerStyle={{
                        padding: widthToDp("2%")
                    }}
                    refreshing={this.state.isRefreshing}
                    onRefresh={() => this.setState({ isRefreshing: true }, () => this.searchUsers("", "pullRefresh"))}
                    ListFooterComponent={<View style={{ height: heightToDp("10%") }} />}
                    renderItem={({ item, index }) => (
                        <View
                            style={{
                                paddingBottom: heightToDp("1%"),
                                width: widthToDp("31%"),
                                backgroundColor: "#fff",
                                borderRadius: 10,
                                marginRight: widthToDp("1.5%"),
                                marginBottom: heightToDp("0.8%")
                            }}
                            key={index}
                        >
                            <TouchableOpacity onPress={() => this.props.navigation.navigate('ProfileScreen', { profile_id: item.user_id })}>
                                <Image
                                    source={{ uri: item.image }}
                                    style={{ height: heightToDp("13%"), width: widthToDp("31%"), borderTopLeftRadius: 10, borderTopRightRadius: 10 }}
                                />
                            </TouchableOpacity>
                            <Text
                                style={{
                                    textAlign: "center",
                                    paddingVertical: heightToDp("0.8%"),
                                }}
                                numberOfLines={1}
                                ellipsizeMode="tail"
                            >{item.name}</Text>
                            <TouchableOpacity
                                activeOpacity={0.7}
                                onPress={() => this.followUser(item, index)}
                            >
                                <LinearGradient
                                    colors={["#007dfe", "#10c0ff"]}
                                    start={{ x: 0.15, y: 0.8 }}
                                    style={{borderRadius: 10,
                                        alignItems: "center",
                                        padding: 5,
                                        marginHorizontal: 5}}
                                >
                                    <Text style={{ color: "#fff" }}>{item.user_is_flollowers === "No" ? "FOLLOW" : "FOLLOW BACK"}</Text>
                                </LinearGradient>

                            </TouchableOpacity>
                            <RBSheet1
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
                            </RBSheet1>
                        </View>
                    )}
                />
                <RBSheet2
                    ref={ref => {
                        this.RBSheet2 = ref;
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
                </RBSheet2>
                <BottomTab isSearchFocused navigation={this.props.navigation} />
            </SafeAreaView>
        )
    }
}
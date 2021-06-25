import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { Toast } from 'native-base';
import React from 'react';
import { ActivityIndicator, FlatList, Image, SafeAreaView, StatusBar, Text, TouchableOpacity, View } from 'react-native';
import RBSheet from 'react-native-raw-bottom-sheet';
import DataAccess from '../../components/DataAccess';
import Header from '../../components/Header';
import PushNotificationController from '../../components/PushNotificationController';
import { heightToDp, widthToDp } from '../../components/Responsive';

export default class BlockList extends React.Component {
    state = {
        blockList: [],
        isLoading: false
    }

    componentDidMount = async () => {
        this.setState({isLoading: true})
        let userId = await AsyncStorage.getItem("userId");
        let response = await axios.post(DataAccess.BaseUrl + DataAccess.blockList, {
            "loginuserID" : userId
        });
        if(response.data.resp === "success") {
            if(response.data.block_user_list !== "No user found!") {
                this.setState({blockList: response.data.block_user_list});
            } else {
                this.setState({blockList: []})
            }            
        } else {
            this.setState({blockList: []});
        }
        this.setState({isLoading: false});
    }

    unblockUser = async (item, index) => {
        this.RBSheet.open();
        let userId = await AsyncStorage.getItem("userId");
        let response = await axios.post(DataAccess.BaseUrl + DataAccess.unblockUser, {
            "loginUserID" : userId,
            "unblockuserID" : item.block_user_id
        });
        if(response.data.status === "success") {
            let blockList = this.state.blockList;
            blockList.splice(index, 1);
            this.setState({blockList});
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
            // this.setState({blockList: []});
        }
        this.RBSheet.close()
    }

    render = () => (
        <SafeAreaView style={{flex: 1}}>       
            <StatusBar backgroundColor="#69abff" barStyle="light-content" />
            <Header isHomeStackInnerPage isBackButton block={true} headerText={"Block List"} navigation={this.props.navigation}/>

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
                </View> :
                <FlatList
                    contentContainerStyle={{
                        padding: widthToDp("2%")
                    }}
                    data={this.state.blockList}
                    ListFooterComponent={<View style={{height: heightToDp("1%")}}/>}
                    ItemSeparatorComponent={() => <View style={{height: heightToDp("1%")}}/>}
                    renderItem={({item, index}) => (
                        <TouchableOpacity
                            style={{
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                backgroundColor: "#fff",
                                padding: widthToDp("3%"),
                                borderRadius: 10
                            }}
                            activeOpacity={0.7}
                            // onPress={() => this.props.navigation.navigate("ViewProfileScreen", {name: item.name, id: item.block_user_id, loginStack: true})}
                        >
                            <View
                                style={{
                                    flexDirection: 'row',
                                    alignItems: 'center'
                                }}
                            >
                                <Image
                                    source={{uri: item.image}}
                                    style={{height: heightToDp("5%"), width: widthToDp("10%"), borderRadius: 40, borderWidth: 1, borderColor: '#69abff'}}
                                />
                                <Text
                                    style={{
                                        marginLeft: widthToDp("2%"),
                                        fontFamily: "Poppins-Regular"
                                    }}
                                >{item.name}</Text>
                            </View>
                            <TouchableOpacity
                                activeOpacity={0.7}
                                onPress={() => this.unblockUser(item, index)}
                            >
                                <Image
                                    source={require("../../../assets/unblock.png")}
                                    resizeMode="contain"
                                    style={{height: heightToDp("5%"), width: widthToDp('5%')}}
                                />
                            </TouchableOpacity>
                        </TouchableOpacity>
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
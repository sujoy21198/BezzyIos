import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import React from 'react';
import { ActivityIndicator, FlatList, Image, SafeAreaView, StatusBar, Text, View } from 'react-native';
import Header from '../../components/Header';
import DataAccess from '../../components/DataAccess';
import { heightToDp, widthToDp } from '../../components/Responsive';
import RBSheet from 'react-native-raw-bottom-sheet';
import {Toast} from 'native-base';

export default class NotificationScreen extends React.Component {
    state = {
        notificationList: [],
        isLoading: false
    }

    componentDidMount = async () => {
        this.setState({isLoading: true})
        let userId = await AsyncStorage.getItem("userId");
        let response = await axios.get(DataAccess.BaseUrl + DataAccess.fetchNotifications + "/" + userId);
        if(response.data.status === "success") {
            this.setState({notificationList: response.data.notification_list});
        } else {
            this.setState({notificationList: []});
        }
        this.setState({isLoading: false})
    }

    clearNotifications = async () => {
        this.RBSheet.open()
        let userId = await AsyncStorage.getItem("userId");
        let response = await axios.get(DataAccess.BaseUrl + DataAccess.clearNotification + "/" + userId);
        if(response.data.status === "success") {
            this.setState({notificationList: []})
            Toast.show({
                type: "success",
                text: "Notifications have been deleted successfully.",
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
            <Header isHomeStackInnerPage isBackButton notification={this.state.notificationList.length > 0 ? true : false} clearNotifications={this.clearNotifications} headerText={"Notifications"} navigation={this.props.navigation}/>
            {
                this.state.isLoading ?
                <View
                    style={{
                        flex: 1,
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}
                >
                    <ActivityIndicator size="large" color="#007dfe" />
                </View>: 
                <FlatList
                    contentContainerStyle={{
                        flex: this.state.notificationList.length > 0 ? 0 : 1,
                        padding: widthToDp("2%")
                    }}
                    ListEmptyComponent={
                        <View
                            style={{
                                flex: 1,
                                justifyContent: 'center',
                                alignItems: 'center'
                            }}
                        >
                            <Text
                                style={{
                                    fontSize: widthToDp("3.8%"),
                                    color: '#007dfe'
                                }}
                            >No Records Found</Text>
                        </View>
                    }
                    data={this.state.notificationList}
                    ListHeaderComponent={<View style={{height: heightToDp("1.5%")}}/>}
                    ListFooterComponent={<View style={{height: heightToDp("1.5%")}}/>}
                    ItemSeparatorComponent={() => <View style={{height: heightToDp("1%")}}/>}
                    renderItem={({item, index}) => (
                        <View
                            style={{
                                width: widthToDp("95%"),
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                backgroundColor: "#fff",
                                padding: widthToDp("3%"),
                                borderRadius: 6,
                                elevation: 2,                            
                                borderLeftColor: '#007dfe',
                                borderLeftWidth: 5.5,
                            }}
                        >
                            <View
                                style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                }}
                            >
                                <Image
                                    source={{uri: item.userimage}}
                                    style={{height: heightToDp("5%"), width: widthToDp("10%"), borderRadius: 40}}
                                />
                                <Text
                                    style={{
                                        marginLeft: widthToDp("2%"),
                                        fontSize: widthToDp("3%")
                                    }}
                                >{item.activity_message}</Text>
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
        </SafeAreaView>
    )
}
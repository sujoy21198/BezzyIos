import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import React from 'react';
import { ActivityIndicator, FlatList, Image, SafeAreaView, StatusBar, Text, View } from 'react-native';
import RBSheet from 'react-native-raw-bottom-sheet';
import DataAccess from '../../components/DataAccess';
import Header from '../../components/Header';
import { heightToDp, widthToDp } from '../../components/Responsive';

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

    render = () => (
        <SafeAreaView style={{flex: 1}}>       
            <StatusBar backgroundColor="#69abff" barStyle="light-content" />
            <Header isHomeStackInnerPage isBackButton backToProfile={true} headerText={this.props.route.params.user} navigation={this.props.navigation}/>
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
                                alignItems: 'center',
                                backgroundColor: "#fff",
                                padding: widthToDp("3%"),
                                borderRadius: 10
                            }}
                        >
                            <Image
                                source={{uri: item.image}}
                                style={{height: heightToDp("5%"), width: widthToDp("12%")}}
                            />
                            <Text
                                style={{
                                    marginLeft: widthToDp("2%")
                                }}
                            >{item.name}</Text>
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
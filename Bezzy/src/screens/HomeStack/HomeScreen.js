import React from 'react';
import { FlatList, Image, SafeAreaView, Text, Touchable, TouchableOpacity, View } from 'react-native';
import { FlatGrid } from 'react-native-super-grid';
import Icon from 'react-native-vector-icons/FontAwesome5';
import BottomTab from '../../components/BottomTab';
import Header from '../../components/Header';
import { heightToDp, widthToDp } from '../../components/Responsive';

export default class HomeScreen extends React.Component {
    state = {
        userList: [],
        isFollowingPresent: true,
        followingList: []
    }

    componentDidMount = () => {
        this.setState({
            userList: [
                {
                    imageUrl: require("../../../assets/default_person.png"),
                    name: "Rockstar"
                },
                {
                    imageUrl: require("../../../assets/default_person.png"),
                    name: "Rockstar"
                },
                {
                    imageUrl: require("../../../assets/default_person.png"),
                    name: "Rockstar"
                },
                {
                    imageUrl: require("../../../assets/default_person.png"),
                    name: "Rockstar"
                },
            ],
            followingList: [
                {
                    imageUrl: require("../../../assets/default_person.png"),
                    name: "David Villareal",
                    postTime: "100 days ago",
                },
                {
                    imageUrl: require("../../../assets/default_person.png"),
                    name: "David Villareal",
                    postTime: "100 days ago",
                }
                ,
                {
                    imageUrl: require("../../../assets/default_person.png"),
                    name: "David Villareal",
                    postTime: "100 days ago",
                },
                {
                    imageUrl: require("../../../assets/default_person.png"),
                    name: "David Villareal",
                    postTime: "100 days ago",
                },
            ]
        })
    }

    render = () => (
        <SafeAreaView style={{flex: 1, backgroundColor: '#ececec'}}>
            <Header isHomeScreen/>
            <View style={{height: heightToDp("1%")}}/>
            {
                !this.state.isFollowingPresent ? 
                <FlatGrid
                    data={this.state.userList}
                    itemDimension={widthToDp("30%")}
                    // ItemSeparatorComponent={() => <View style={{width: widthToDp("10%"), height: 10}}/>}
                    renderItem={({item, index}) => (
                        <View 
                            style={{
                                paddingVertical: heightToDp("1%"),
                                width: widthToDp("30%"),
                                backgroundColor: "#fff",
                                borderRadius: 10,
                            }}
                            key={index}
                        >
                            <Image 
                                source={item.imageUrl}
                                style={{height: heightToDp("13%"), width: widthToDp("30%")}}
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
                                // onPress={() => }
                            >
                                <Text style={{color: "#fff"}}>FOLLOW</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                /> :
                <FlatGrid
                    data={this.state.followingList}
                    itemDimension={widthToDp("95%")}
                    renderItem={({item, index}) => (
                        <View
                            style={{
                                width: widthToDp("95%"),
                                paddingBottom: heightToDp('1%'),
                                paddingHorizontal: widthToDp("2%"),
                                borderRadius: 10,
                                backgroundColor: "#fff",
                            }}
                        >
                            <View
                                style={{
                                    flexDirection: 'row',
                                    justifyContent: 'space-between',
                                    alignItems: 'center'
                                }}
                            >
                                <View
                                    style={{
                                        flexDirection: 'row',
                                        alignItems: 'center'
                                    }}
                                >
                                    <Image
                                        source={item.imageUrl}
                                        resizeMode="contain"
                                        style={{height: heightToDp("12%"), width: widthToDp("25%")}}
                                    />
                                    <View style={{paddingLeft: widthToDp("4%")}}>
                                        <Text
                                            style={{
                                                fontWeight: 'bold'
                                            }}
                                        >{item.name}</Text>
                                        <Text 
                                            style={{
                                                color: "#f1b45c",
                                                marginTop: heightToDp("0.5%")
                                            }}
                                        >Posted {item.postTime}</Text>
                                    </View>
                                </View>
                                <View 
                                    style={{
                                        alignSelf: 'flex-start'
                                    }}
                                >
                                    <Image
                                    source={require("../../../assets/ago.png")}
                                    resizeMode="contain"
                                    style={{height: heightToDp("5%"), width: widthToDp('5%')}}
                                    />
                                    <Icon
                                        name="comments"
                                        size={20}
                                        color={"#69abff"}
                                        style={{
                                            marginTop: heightToDp("7%")
                                        }}
                                        onPress={() => this.props.navigation.navigate("MessageScreen")}
                                    />
                                </View>
                            </View>
                        </View>
                    )}
                />
            }
            
            
            <View style={{height: heightToDp("10%")}}/>
            <BottomTab isHomeFocused navigation={this.props.navigation}/>
        </SafeAreaView>
    )
}
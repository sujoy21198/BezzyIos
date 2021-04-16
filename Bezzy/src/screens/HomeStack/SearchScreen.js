import React from 'react';
import { FlatList, Image, SafeAreaView, Text, TouchableOpacity, View, TextInput } from 'react-native';
import BottomTab from '../../components/BottomTab';
import Header from '../../components/Header';
import { heightToDp, widthToDp } from '../../components/Responsive';
import Icon from 'react-native-vector-icons/FontAwesome5';
import RBSheet from 'react-native-raw-bottom-sheet';
import axios from 'axios';
import DataAccess from '../../components/DataAccess'

export default class SearchScreen extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            userList: []
        }
    }
    componentDidMount() {
        this.searchUsers("")
    }
    searchUsers = async (text) => {
        var user = []
        await axios.post(DataAccess.BaseUrl + DataAccess.Search, {
            searchval: text,
            loguser_id: '232'
        }).then(function (response) {
            if (response.data.resp === 'error') {
                user = []
            } else {
                user = response.data.search_result
            }
            console.log(response.data.search_result)
        }).catch(function (error) {
            console.log(error)
        })
        this.setState({ userList: user })
    }

    render() {
        var userList = []
        userList = this.state.userList
        return (
            <SafeAreaView style={{ flex: 1, backgroundColor: '#ececec' }}>
                <View style={{ height: heightToDp("5%"), backgroundColor: "#fff", flexDirection: 'row' }}>
                    <View style={{ marginTop: heightToDp("1.3%"), marginLeft: widthToDp("2%"), width: widthToDp("37%") }}>
                        <Text style={{ fontSize: widthToDp("5%") }}>Search for friends</Text>
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
                                source={{uri:item.image}}
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
                            // onPress={() => }
                            >
                                <Text style={{ color: "#fff" }}>FOLLOW</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                />
                <BottomTab isSearchFocused navigation={this.props.navigation} />
            </SafeAreaView>
        )
    }
}
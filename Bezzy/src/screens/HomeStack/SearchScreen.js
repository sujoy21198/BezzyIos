import React from 'react';
import { FlatList, Image, SafeAreaView, Text, TouchableOpacity, View } from 'react-native';
import BottomTab from '../../components/BottomTab';
import Header from '../../components/Header';
import { heightToDp, widthToDp } from '../../components/Responsive';

export default class SearchScreen extends React.Component {
    state = {
        userList: []
    }

    async componentDidMount() {
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
            ]
        })
    }

    render = () => (
        <SafeAreaView style={{flex: 1, backgroundColor: '#ececec'}}>
            <Header isSearchFocused headerText="Search for friends"/>
            <FlatList
                data={this.state.userList}
                numColumns={3}
                contentContainerStyle={{
                    padding: widthToDp("2%")
                }}
                ListFooterComponent={<View style={{height: heightToDp("10%")}}/>}
                renderItem={({item, index}) => (
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
            />
            <BottomTab isSearchFocused navigation={this.props.navigation}/>
        </SafeAreaView>
    )
}
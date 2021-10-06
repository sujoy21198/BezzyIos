import axios from "axios";
import React from "react";
import { ActivityIndicator, FlatList, Image, Platform, SafeAreaView, StatusBar, Text, View } from "react-native";
import DataAccess from "../../components/DataAccess";
import Header from "../../components/Header";
import { heightToDp, widthToDp } from "../../components/Responsive";

export default class PostLikedUsersList extends React.Component {
    state={
        likedUsers: [],
        isLoading: false
    }

    async componentDidMount() {
        this.setState({isLoading: true})
        await axios.get(DataAccess.BaseUrl + DataAccess.postLikedUsers + "/" + this.props.route.params.postId)
        .then(res => {
            if(res.data.status === "success") {
                this.setState({likedUsers: res.data.userlist});
            } else {
                this.setState({likedUsers: []});
            }
        })
        .catch(err => {
            console.log(err);
            this.setState({likedUsers: []});
        })
        this.setState({isLoading: false})
    }

    render = () => (
        <SafeAreaView style={{flex: 1}}>
            <StatusBar backgroundColor="#69abff" barStyle={Platform.OS==='android' ? "light-content" : "dark-content"} />
            <Header isHomeStackInnerPage isBackButton block={true} headerText={"Liked Users"} navigation={this.props.navigation}/>
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
                    data={this.state.likedUsers}
                    ListFooterComponent={<View style={{height: heightToDp("1%")}}/>}
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
                                    alignItems: 'center'
                                }}
                            >
                                <Image
                                    source={{uri: item.profilePicture}}
                                    style={{height: Platform.isPad ? 80 : 40, width: Platform.isPad ? 80 : 40, borderRadius: Platform.isPad ? 80 / 2 : 40 / 2, borderWidth: 1, borderColor: '#69abff'}}
                                />
                                <Text
                                    style={[{
                                        marginLeft: widthToDp("2%"),
                                        fontFamily: "Poppins-Regular"
                                    }, Platform.isPad && {fontSize: widthToDp("3%")}]}
                                >{item.name}</Text>
                            </View>
                        </View>
                    )}
                />
            }
        </SafeAreaView>
    )
}
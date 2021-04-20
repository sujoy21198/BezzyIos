import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import React from 'react';
import { ActivityIndicator, FlatList, Image, Platform, SafeAreaView, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import RBSheet from 'react-native-raw-bottom-sheet';
import { FlatGrid } from 'react-native-super-grid';
import Icon from 'react-native-vector-icons/FontAwesome5';
import BottomTab from '../../components/BottomTab';
import DataAccess from '../../components/DataAccess';
import Header from '../../components/Header';
import { heightToDp, widthToDp } from '../../components/Responsive';

export default class ProfileScreen extends React.Component {
    state = {
        isPostsFocused: true,
        isShareFocused: false,
        numberOfFollowers: 0,
        numberOfFollowings: 1,
        numberOfPosts: 6,
        isLoading: true
    }

    onPostTabPress = () => {
        this.setState({isPostsFocused: true, isShareFocused: false})
    }

    onShareTabPress = () => (
        this.setState({isShareFocused: true, isPostsFocused: false})
    )

    componentDidMount() {
        this.RBSheet.open();
        this.setState({isLoading: true})
        this.getAsyncValues()
        this.getProfileData();
    } 

    getProfileData = async () => {
        var userDetails = {};
        let userId = await AsyncStorage.getItem("userId");
        await axios.post(DataAccess.BaseUrl + DataAccess.getProfileDetails, {
            "profile_id" : userId
        }).then(res => {
            userDetails = res.data.usedetails;
            // console.warn(res.data);
        }).catch(err => console.log(err))

        this.setState({userDetails})
        this.setState({isLoading: false})
        this.RBSheet.close();
    }

    getAsyncValues = async () => {
        let numberOfFollowings = await AsyncStorage.getItem("numberOfFollowings");
        this.setState({numberOfFollowings});
    }

    render = () => (
        <SafeAreaView style={{flex: 1, backgroundColor: '#ececec'}}>
            <Header isProfileFocused headerText="Profile" navigation={this.props.navigation}/>

            {
                !this.state.isLoading &&
                <View
                    style={{
                        flex: 1,
                        paddingVertical: heightToDp("1%")
                    }}
                >
                    <View
                        style={{
                            justifyContent: 'center',
                            alignItems: 'center',
                            paddingVertical: heightToDp("1%")
                        }}
                    >
                        <Image
                            source={{uri: this.state.userDetails.profile_pic}}
                            style={{height: heightToDp("10%"), width: widthToDp("20%"), borderRadius: 20}}
                        />
                        <Text
                            style={{
                                color: '#69abff',
                                fontWeight: 'bold',
                                marginTop: heightToDp('1.5%'),
                                marginBottom: heightToDp('0.5%'),
                                fontSize: widthToDp("4.5%")
                            }}
                        >{this.state.userDetails.get_name}</Text>
                        {
                            this.state.userDetails.bio &&
                            <Text
                                style={{
                                    // paddingVertical: heightToDp('0%'),
                                    fontSize: widthToDp("4%")
                                }}
                            >{this.state.userDetails.bio}</Text>
                        }                        
                    </View>
                    <View
                        style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            paddingHorizontal: widthToDp("10%"),
                            paddingVertical: heightToDp("0.5%")
                        }}
                    >
                        <TouchableOpacity
                            style={{
                                alignItems: 'center',
                            }}
                            activeOpacity={0.7}
                            disabled={this.state.userDetails.following === 0}
                            onPress={() => this.props.navigation.navigate("FollowingScreen", {user: "Demo User"})}
                        >   
                            <Text>{this.state.userDetails.following}</Text>
                            <Text
                                style={{
                                    fontSize: widthToDp("3.8%")
                                }}
                            >Following</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={{
                                alignItems: 'center',
                            }}
                            activeOpacity={0.7}
                            disabled={this.state.userDetails.followers === 0}
                            onPress={() => this.props.navigation.navigate("FollowerScreen", {user: "Demo User"})}
                        >   
                            <Text>{this.state.userDetails.followers}</Text>
                            <Text
                                style={{
                                    fontSize: widthToDp("3.8%")
                                }}
                            >Followers</Text>
                        </TouchableOpacity>
                        <View
                            style={{
                                alignItems: 'center',
                            }}
                        >   
                            <Text>{this.state.userDetails.number_of_post}</Text>
                            <Text
                                style={{
                                    fontSize: widthToDp("3.8%")
                                }}
                            >Posts</Text>
                        </View>
                    </View>
                    <View
                        style={{
                            justifyContent: 'center',
                            alignItems: 'center',
                            paddingVertical: heightToDp("1%")
                        }}
                    >
                        <TouchableOpacity
                            style={{
                                paddingVertical: heightToDp("1%"),
                                backgroundColor: '#69abff',
                                width: widthToDp("40%"),
                                borderRadius: 8,
                            }}
                            activeOpacity={0.7}
                            onPress={() => this.props.navigation.navigate("EditProfileScreen")}
                        >
                            <Text
                                style={{
                                    color: '#fff',
                                    textAlign: 'center'
                                }}
                            >Edit Profile</Text>
                        </TouchableOpacity>
                    </View>
                    <View
                        style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            paddingVertical: heightToDp("0.5%"),
                            paddingHorizontal: widthToDp('1%'),
                        }}
                    >
                        <TouchableOpacity
                            style={{
                                width: widthToDp("48.8%"),
                                // padding: widthToDp("1%"),
                                backgroundColor: "#fff",
                                alignItems: 'center'
                            }}
                            activeOpacity={0.7}
                            onPress={this.onPostTabPress}
                        >
                            <Image
                            source={
                                this.state.isPostsFocused ? 
                                require("../../../assets/posts.png") :
                                require("../../../assets/default_posts.png")
                            }
                            resizeMode="contain"
                            style={{height: heightToDp("5%"), width: widthToDp("5%")}}
                            />
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={{
                                width: widthToDp("48.8%"),
                                padding: widthToDp("2%"),
                                backgroundColor: "#fff",
                                alignItems: 'center'
                            }}
                            activeOpacity={0.7}
                            onPress={this.onShareTabPress}
                        >
                            <Icon
                            name={'share'}
                            size={24}
                            color={this.state.isShareFocused ? "#69abff" : "#666"}
                            />
                        </TouchableOpacity>
                    </View>
                    {
                        this.state.isPostsFocused &&
                        <FlatList
                            data={[
                                require("../../../assets/default_person.png"),
                                require("../../../assets/default_person.png"),
                                require("../../../assets/default_person.png"),
                                require("../../../assets/default_person.png"),
                                require("../../../assets/default_person.png"),
                                require("../../../assets/default_person.png")
                            ]}
                            contentContainerStyle={{
                                paddingHorizontal: widthToDp("2%")
                            }}
                            numColumns={2}
                            keyExtractor={({item, index}) => index}
                            ListFooterComponent={<View style={{height: heightToDp("7%")}}/>}
                            renderItem={({item, index}) => (
                                <>
                                    <TouchableOpacity
                                        onPress={() => this.props.navigation.navigate("ImagePreviewScreen", {image: item})}
                                    >
                                        <Image
                                            source={item}
                                            // resizeMode="contain"
                                            style={{
                                                height: heightToDp("20%"), 
                                                marginBottom: heightToDp("0.5%"), 
                                                width: widthToDp("47.5%"), 
                                                borderRadius: 5,
                                            }}
                                            key={index}
                                        />
                                    </TouchableOpacity>
                                    <View
                                        style={{
                                            position: 'absolute',
                                            bottom: heightToDp("1.2%"),
                                            left: widthToDp(`${index % 2 === 0 ? 1.5 : 49}%`)
                                        }}
                                    >
                                        <Text
                                            style={{
                                                color: "#db472b",
                                                fontSize: widthToDp("3%")
                                            }}
                                        >{"15/04/2021 3:40 pm"}</Text>
                                    </View>
                                    {
                                        index % 2 === 0 &&
                                        <View style={{width: widthToDp("1%")}}/>
                                    }
                                </>
                            )}
                        />
                    }
                    {
                        this.state.isShareFocused &&
                        <FlatList
                            data={[
                                require("../../../assets/default_person.png"),
                                require("../../../assets/default_person.png"),
                                require("../../../assets/default_person.png"),
                            ]}
                            contentContainerStyle={{
                                paddingHorizontal: widthToDp("2%")
                            }}
                            numColumns={2}
                            keyExtractor={({item, index}) => index}
                            ListFooterComponent={<View style={{height: heightToDp("7%")}}/>}
                            renderItem={({item, index}) => (
                                <>
                                    <Image
                                        source={item}
                                        // resizeMode="contain"
                                        style={{
                                            height: heightToDp("20%"), 
                                            marginBottom: heightToDp("0.5%"), 
                                            width: widthToDp("47.5%"), 
                                            borderRadius: 5,
                                        }}
                                        key={index}
                                    />
                                    <View
                                        style={{
                                            position: 'absolute',
                                            bottom: heightToDp("1.2%"),
                                            left: widthToDp(`${index % 2 === 0 ? 1.5 : 49}%`)
                                        }}
                                    >
                                        <Text
                                            style={{
                                                color: "#db472b",
                                                fontSize: widthToDp("3%")
                                            }}
                                        >{"15/04/2021 3:40 pm"}</Text>
                                    </View>
                                    {
                                        index % 2 === 0 &&
                                        <View style={{width: widthToDp("1%")}}/>
                                    }
                                </>
                            )}
                        />
                    }
                </View>
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

            <BottomTab isProfileFocused navigation={this.props.navigation}/>
        </SafeAreaView>
    )
}
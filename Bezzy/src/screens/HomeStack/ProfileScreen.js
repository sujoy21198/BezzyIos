import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import React from 'react';
import { ActivityIndicator, FlatList, Image, Platform, SafeAreaView, ScrollView, StatusBar, Text, TouchableOpacity, View } from 'react-native';
import RBSheet from 'react-native-raw-bottom-sheet';
import { FlatGrid } from 'react-native-super-grid';
import Icon from 'react-native-vector-icons/FontAwesome5';
import BottomTab from '../../components/BottomTab';
import ButtonComponent from '../../components/ButtonComponent';
import DataAccess from '../../components/DataAccess';
import Header from '../../components/Header';
import { heightToDp, widthToDp } from '../../components/Responsive';
import LinearGradient from 'react-native-linear-gradient';
import ShimmerPlaceHolder from 'react-native-shimmer-placeholder'

export default class ProfileScreen extends React.Component {
    state = {
        isPostsFocused: true,
        isShareFocused: false,
        numberOfFollowers: 0,
        numberOfFollowings: 1,
        numberOfPosts: 6,
        isLoading: true,
        userPosts: [],
        userDetails: {}
    }

    onPostTabPress = () => {
        this.setState({isPostsFocused: true, isShareFocused: false})
    }

    onShareTabPress = () => (
        this.setState({isShareFocused: true, isPostsFocused: false})
    )

    componentDidMount() {
        this.setState({isLoading: true})
        this.getProfileData();
    } 

    getProfileData = async () => {
        var userDetails = {}, userPosts = [];
        let userId = await AsyncStorage.getItem("userId");
        await axios.post(DataAccess.BaseUrl + DataAccess.getProfileDetails, {
            "profile_id" : userId
        }).then(res => {
            userDetails = res.data.usedetails;
            res.data.user_all_posts.map((item, key) => {
                userPosts = res.data.user_all_posts[res.data.user_all_posts.length - 1];
            })
        }).catch(err => console.log(err))
        this.setState({userDetails, userPosts})
        this.setState({isLoading: false})
    }

    render = () => (
        <SafeAreaView style={{flex: 1, backgroundColor: '#ececec'}}>            
            <StatusBar backgroundColor="#69abff" barStyle="light-content" />
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
                        {
                            Object.keys(this.state.userDetails).length > 0 &&
                            <>
                                <Image
                                    source={{uri: this.state.userDetails.profile_pic}}
                                    style={{height: heightToDp("10%"), width: widthToDp("20%"), borderRadius: 20}}
                                />
                                <Text
                                    style={{
                                        color: '#007dfe',
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
                            </>
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
                            disabled={Object.keys(this.state.userDetails).length > 0 && this.state.userDetails.following === 0}
                            onPress={() => this.props.navigation.navigate("FollowingScreen", {user: this.state.userDetails.get_name})}
                        >   
                            <Text>{Object.keys(this.state.userDetails).length > 0 ? this.state.userDetails.following : 0}</Text>
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
                            disabled={Object.keys(this.state.userDetails).length > 0 && this.state.userDetails.followers === 0}
                            onPress={() => this.props.navigation.navigate("FollowerScreen", {user: this.state.userDetails.get_name})}
                        >   
                            <Text>{Object.keys(this.state.userDetails).length > 0 ? this.state.userDetails.followers : 0}</Text>
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
                            <Text>{Object.keys(this.state.userDetails).length > 0 ? this.state.userDetails.number_of_post : 0}</Text>
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
                        <ButtonComponent
                            onPressButton={() => this.props.navigation.navigate("EditProfileScreen")}
                            buttonText={"Edit Profile"}
                            editProfile={true}
                            disabled={Object.keys(this.state.userDetails).length == 0}
                        />
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
                    <FlatList
                        data={this.state.userPosts}
                        contentContainerStyle={{
                            paddingHorizontal: widthToDp("2%")
                        }}
                        numColumns={2}
                        keyExtractor={({item, index}) => index}
                        ItemSeparatorComponent={() => <View style={{height: heightToDp("0.3%")}}/>}
                        ListFooterComponent={<View style={{height: heightToDp("7%")}}/>}
                        renderItem={({item, index}) => (
                            <>
                                {
                                    !(item && item.post_url) ? 
                                    <ShimmerPlaceHolder
                                        height={heightToDp("20%")}
                                        width={widthToDp("47.5%")}
                                        duration={2000}
                                        shimmerStyle={{
                                            borderRadius: 5
                                        }}
                                        shimmerColors={[
                                            "#cdcdcd", "#ececec"
                                        ]}
                                        LinearGradient={LinearGradient}
                                    /> :
                                    <TouchableOpacity
                                        onPress={() => this.props.navigation.navigate("ImagePreviewScreen", {image: item})}
                                    >
                                        <Image
                                            source={{uri: item.post_url.split("?src=")[1].split('&w=')[0]}}
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
                                }                                
                                {
                                    (item && item.post_date && item.post_time) &&
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
                                        >{item.post_date + " " + item.post_time}</Text>
                                    </View>
                                }
                                {
                                    (this.state.userPosts.length > 0 && index % 2 === 0) &&
                                    <View style={{width: widthToDp("1%")}}/>
                                }
                            </>
                        )}
                    />  
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
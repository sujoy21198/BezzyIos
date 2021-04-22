import Icon from 'react-native-vector-icons/Ionicons';
import React from "react";
import { Dimensions, Platform, SafeAreaView, Text, TouchableOpacity, View } from "react-native";
import { SceneMap, TabBar, TabView } from "react-native-tab-view";
import { heightToDp, widthToDp } from './Responsive';

export default class BottomTab extends React.Component {
    render = () => (
        <SafeAreaView
            style={{
                position: 'absolute',
                bottom: 0,                
                width: widthToDp("100%"),   
            }}
        >
            <View
                style={{
                    backgroundColor: '#ececec',
                    height: heightToDp("8%"),
                    justifyContent: 'flex-end',
                    borderTopWidth: 10,
                    borderTopColor: '#ececec'
                }}
            >
                <View
                    style={{
                        height: heightToDp("7.5%"),
                        flexDirection: 'row'
                    }}
                >
                    <TouchableOpacity
                        style={{
                            backgroundColor: '#fff',
                            height: heightToDp("7.5%"),
                            width: widthToDp("21.3%"),
                            justifyContent: 'center',
                            alignItems: 'center',
                            elevation: 10
                        }}
                        activeOpacity={0.7}
                        onPress={
                            () => 
                                this.props.isHomeFocused ? 
                                undefined : 
                                this.props.navigation.reset({
                                    index: 0,
                                    routes: [
                                        { name: "HomeScreen" }
                                    ]
                                })
                            }
                    >
                        <Icon
                            name={Platform.OS==='android' ? 'md-home-outline' : 'ios-home-outline'}
                            size={23}
                            color={this.props.isHomeFocused ? "#69abff" : "#808080"}
                        />
                        {
                            this.props.isHomeFocused &&
                            <Text
                                style={{
                                    fontSize: widthToDp("3%"),
                                    color: "#69abff"
                                }}
                            >Home</Text>
                        }
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={{
                            backgroundColor: '#fff',
                            height: heightToDp("7.5%"),
                            width: widthToDp("21.3%"),
                            justifyContent: 'center',
                            borderTopWidth: 1,
                            borderTopColor: '#ececec',
                            borderTopRightRadius: 8,
                            alignItems: 'center',
                            elevation: 10,
                        }}
                        activeOpacity={0.7}
                        onPress={() => this.props.isChatFocused ? undefined : this.props.navigation.navigate("ChatScreen")}
                    >
                        <Icon
                            name={Platform.OS==='android' ? 'md-chatbubbles-outline' : 'ios-chatbubbles-outline'}
                            size={23}
                            color={this.props.isChatFocused ? "#69abff" : "#808080"}
                        />
                        {
                            this.props.isChatFocused && 
                            <Text
                                style={{
                                    fontSize: widthToDp("3%"),
                                    color: "#69abff"
                                }}
                            >Chat</Text>
                        }
                    </TouchableOpacity>
                    <View 
                        style={{
                            height: heightToDp("7.5%"), 
                            width: widthToDp("14.8%"), 
                            backgroundColor: '#fff',
                            elevation: 10,
                            flex: 1
                        }}
                    >
                        <View 
                            style={{
                                height: heightToDp("7.5%"),
                                flex: 1,
                                borderBottomWidth: 1,
                                borderBottomLeftRadius: 30,
                                borderBottomRightRadius: 30,
                                borderBottomColor: '#ececec',
                                backgroundColor: '#ececec'
                            }}
                        />
                        <TouchableOpacity 
                            style={{
                                position: 'absolute',
                                bottom: heightToDp("4.9%"),
                                left: widthToDp("1.4%"),
                                height: 50, 
                                width: 50, 
                                borderRadius: 50 / 2,
                                backgroundColor: "#69abff",
                                justifyContent: 'center',
                                alignItems: 'center',
                                elevation: 2
                            }}
                            activeOpacity={0.7}
                            onPress={() => this.props.navigation.navigate("PostScreen")}
                        >
                            <Icon
                                name={Platform.OS==='android' ? 'md-add' : 'ios-add'}
                                size={30}
                                color="#fff"
                            />
                        </TouchableOpacity>
                        <View style={{height: heightToDp("3.8%"), backgroundColor: '#fff'}}/>
                    </View>
                    <TouchableOpacity
                        style={{
                            backgroundColor: '#fff',
                            height: heightToDp("8%"),
                            width: widthToDp("21.3%"),
                            justifyContent: 'center',
                            alignItems: 'center',
                            elevation: 10,
                            borderTopWidth: 1,
                            borderTopColor: '#ececec',
                            borderTopLeftRadius: 8,
                        }}
                        activeOpacity={0.7}
                        onPress={
                            () => 
                                this.props.isSearchFocused ? 
                                undefined : 
                                this.props.navigation.reset({
                                    index: 2,
                                    routes: [
                                        { name: "SearchScreen" }
                                    ]
                                })
                            }
                    >
                        <Icon
                            name={Platform.OS==='android' ? 'md-search-outline' : 'ios-search-outline'}
                            size={23}
                            color={this.props.isSearchFocused ? "#69abff" : "#808080"}
                        />
                        {
                            this.props.isSearchFocused && 
                            <Text
                                style={{
                                    fontSize: widthToDp("3%"),
                                    color: "#69abff"
                                }}
                            >Search</Text>
                        }
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={{
                            backgroundColor: '#fff',
                            height: heightToDp("8%"),
                            width: widthToDp("21.3%"),
                            justifyContent: 'center',
                            alignItems: 'center',
                            elevation: 10
                        }}
                        activeOpacity={0.7}
                        onPress={
                            () => 
                                this.props.isProfileFocused ? 
                                undefined : 
                                this.props.navigation.reset({
                                    index: 3,
                                    routes: [
                                        { name: "ProfileScreen" }
                                    ]
                                })
                            }
                    >
                        <Icon
                            name={Platform.OS==='android' ? 'md-person-outline' : 'ios-person-outline'}
                            size={23}
                            color={this.props.isProfileFocused ? "#69abff" : "#808080"}
                        />
                        {
                            this.props.isProfileFocused && 
                            <Text
                                style={{
                                    fontSize: widthToDp("3%"),
                                    color: "#69abff"
                                }}
                            >Profile</Text>
                        }
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    )
}
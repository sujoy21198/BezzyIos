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
                flexDirection: 'row'
            }}
        >
            <TouchableOpacity
                style={{
                    backgroundColor: '#fff',
                    height: heightToDp("8%"),
                    width: widthToDp("20%"),
                    justifyContent: 'center',
                    alignItems: 'center',
                    elevation: 10
                }}
                activeOpacity={0.7}
                onPress={() => this.props.isHomeFocused ? undefined : this.props.navigation.navigate("HomeScreen")}
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
                    height: heightToDp("8%"),
                    width: widthToDp("20%"),
                    justifyContent: 'center',
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
                    backgroundColor: '#fff',
                    height: heightToDp("8%"),
                    width: widthToDp("20%"),
                    alignItems: 'center',
                    elevation: 10
                }}
            >
                <View 
                    style={{
                        position: 'absolute',
                        bottom: heightToDp("4.4%"),
                        height: 68, 
                        width: 68, 
                        borderRadius: 68 / 2,
                        backgroundColor: "#ececec",
                        justifyContent: 'center',
                        alignItems: 'center',
                        borderTopWidth: 1,
                        borderTopColor: '#ececec',
                    }}
                />
                <TouchableOpacity 
                    style={{
                        position: 'absolute',
                        bottom: heightToDp("5.5%"),
                        height: 50, 
                        width: 50, 
                        borderRadius: 50 / 2,
                        backgroundColor: "#69abff",
                        justifyContent: 'center',
                        alignItems: 'center',
                        elevation: 2
                    }}
                    activeOpacity={0.7}
                >
                    <Icon
                        name={Platform.OS==='android' ? 'md-add' : 'ios-add'}
                        size={30}
                        color="#fff"
                    />
                </TouchableOpacity>
            </View>
            <TouchableOpacity
                style={{
                    backgroundColor: '#fff',
                    height: heightToDp("8%"),
                    width: widthToDp("20%"),
                    justifyContent: 'center',
                    alignItems: 'center',
                    elevation: 10
                }}
                activeOpacity={0.7}
                onPress={() => this.props.isSearchFocused ? undefined : this.props.navigation.navigate("SearchScreen")}
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
                    width: widthToDp("20%"),
                    justifyContent: 'center',
                    alignItems: 'center',
                    elevation: 10
                }}
                activeOpacity={0.7}
                onPress={() => this.props.isProfileFocused ? undefined : this.props.navigation.navigate("ProfileScreen")}
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
        </SafeAreaView>
    )
}
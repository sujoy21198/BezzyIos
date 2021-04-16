import React from 'react';
import { BackHandler, Image, Modal, Platform, SafeAreaView, Text, TextInput, Touchable, TouchableOpacity, View } from 'react-native';
import { heightToDp, widthToDp } from './Responsive';
import Icon from 'react-native-vector-icons/FontAwesome5';
import RBSheet from 'react-native-raw-bottom-sheet';
import RBSheet1 from 'react-native-raw-bottom-sheet';

export default class Header extends React.Component {
    state = {
        openUserModal: false
    }
    
    componentDidMount = () => {
        if(this.props.isHomeScreen || this.props.isMessageScreen || this.props.isSearchFocused || this.props.isProfileFocused) {
            BackHandler.addEventListener("hardwareBackPress", () => undefined);
        }
    }

    componentWillUnmount = () => {
        if(this.props.isHomeScreen || this.props.isMessageScreen || this.props.isSearchFocused || this.props.isProfileFocused) {
            BackHandler.removeEventListener("hardwareBackPress", () => undefined);
        }
    }

    navigateToOtherScreen = (type) => {
        this.RBSheet.close();
        if(type === "block") {
            this.props.navigation.navigate("BlockList");
        } else if(type === "changePassword") {
            this.props.navigation.navigate('ChangePassword');
        } else if(type === "logout") {
            this.props.navigation.navigate("SignInScreen")
        } 
    }

    render = () => (
        <SafeAreaView 
            style={{
                paddingVertical: heightToDp("1%"),
                backgroundColor: (this.props.isHomeScreen || this.props.isMessageScreen || this.props.isSearchFocused || this.props.isProfileFocused || this.props.isHomeStackInnerPage) ? '#fff' : '#69abff',
                paddingHorizontal: widthToDp('3%'),
                // paddingTop: heightToDp("1%"),
                // paddingBottom: heightToDp("1.4%")
            }}
        >
            {
                (this.props.isHomeScreen || this.props.isMessageScreen || this.props.isSearchFocused || this.props.isProfileFocused) ? 
                <View 
                    style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between'
                    }}
                >
                    <View 
                        style={{
                            flexDirection: 'row',
                            alignItems: 'center'
                        }}
                    >
                        {
                            this.props.isBackButton &&
                            <Icon 
                                name="chevron-left"
                                size={20}
                                color={"#69abff"}
                            />
                        }
                        {
                            !this.props.headerText ?
                            <Image
                                source={require("../../assets/bezzy_logo.png")}
                                resizeMode="contain"
                                style={{height: heightToDp("3%"), width: widthToDp("20%"), marginLeft: widthToDp(`${this.props.isBackButton ? 3 : 0}%`)}}
                            /> :
                            <Text style={{
                                color: !this.props.headerText ? '#fff' : '#69abff',
                                fontSize: widthToDp("4.5%"),
                                fontWeight: 'bold',
                                marginLeft: this.props.isBackButton ? widthToDp("2%") : 0
                            }}>
                                {this.props.headerText}
                            </Text>
                        }
                    </View>
                    {
                        this.props.isSearchFocused &&
                        <>
                            <TouchableOpacity
                                activeOpacity={0.7}
                                onPress={() => this.RBSheet1.open()}
                            >
                                <Icon
                                    name={"search"}
                                    size={20}
                                    color="#a9a9a9"
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
                                    onChangeText={text => console.log(text)}
                                />
                            </RBSheet>
                        </>
                    }
                    {
                        this.props.isHomeScreen &&
                        <TouchableOpacity>
                            <Image
                                source={require("../../assets/notification.png")}
                                resizeMode="contain"
                                style={{height: heightToDp("4%"), width: widthToDp("4%")}}
                            />
                        </TouchableOpacity>
                    }
                    {
                        this.props.isProfileFocused &&
                        <>
                            <TouchableOpacity
                                // activeOpacity={0.7}
                                onPress={() => this.RBSheet.open()}
                            >
                                <Image
                                    source={require("../../assets/menu.png")}
                                    resizeMode="contain"
                                    style={{height: heightToDp("3.5%"), width: widthToDp("3.5%")}}
                                />
                            </TouchableOpacity>
                            <RBSheet
                                ref={ref => {
                                    this.RBSheet = ref;
                                }}
                                height={heightToDp("22%")}
                                // openDuration={250}
                                customStyles={{
                                    container: {
                                        alignItems: 'flex-start',
                                        justifyContent: 'center',
                                        paddingLeft: widthToDp("5%"),
                                        backgroundColor: '#fff',
                                        borderRadius: 30
                                    }
                                }}
                            >
                                <TouchableOpacity onPress={() => this.navigateToOtherScreen("block")}>
                                    <Text 
                                        style={{ 
                                            fontSize: widthToDp("4.6%"), 
                                            fontFamily: 'Oswald-Medium',
                                        }}
                                    >Block List</Text>
                                </TouchableOpacity>
                                <View style={{height: heightToDp("3%")}}/>
                                <TouchableOpacity 
                                activeOpacity={0.7}
                                onPress={() => this.navigateToOtherScreen("changePassword")}>
                                    <Text 
                                        style={{ 
                                            fontSize: widthToDp("4.6%"), 
                                            fontFamily: 'Oswald-Medium',
                                        }}
                                    >Change Password</Text>
                                </TouchableOpacity>
                                <View style={{height: heightToDp("3%")}}/>
                                <TouchableOpacity onPress={() => this.navigateToOtherScreen("logout")}>
                                    <Text 
                                        style={{ 
                                            fontSize: widthToDp("4.6%"), 
                                            fontFamily: 'Oswald-Medium',
                                        }}
                                    >Logout</Text>
                                </TouchableOpacity>
                            </RBSheet>
                        </>
                    }
                </View>:
                <TouchableOpacity
                    style={{
                        flexDirection: 'row',
                        alignItems: 'center'
                    }}
                    activeOpacity={0.7}
                    onPress={() => this.props.navigation.goBack()}
                >
                    {
                        this.props.isBackButton && 
                        <Icon 
                            name="chevron-left"
                            size={15}
                            color={this.props.isHomeStackInnerPage ? '#69abff' : "#fff"}
                        />
                    }
                    <Text style={{
                        color: this.props.isHomeStackInnerPage ? '#69abff' : '#fff',
                        fontSize: 15,
                        fontWeight: 'bold',
                        marginLeft: this.props.isBackButton ? widthToDp("2%") : 0
                    }}>
                        {this.props.headerText}
                    </Text>
                </TouchableOpacity>   
            }           
        </SafeAreaView>
    )
}
import React from 'react';
import { BackHandler, Image, Platform, SafeAreaView, Text, TouchableOpacity, View } from 'react-native';
import { heightToDp, widthToDp } from './Responsive';
import Icon from 'react-native-vector-icons/FontAwesome5'

export default class Header extends React.Component {
    componentDidMount = () => {
        if(this.props.isBottomTabScreen && !this.props.isBackButton) {
            BackHandler.addEventListener("hardwareBackPress", () => true);
        }
    }

    componentWillUnmount = () => {
        if(this.props.isBottomTabScreen && !this.props.isBackButton) {
            BackHandler.removeEventListener("hardwareBackPress", () => true);
        }
    }

    render = () => (
        <SafeAreaView 
            style={{
                paddingVertical: heightToDp("1%"),
                backgroundColor: this.props.isBottomTabScreen ? '#fff' : '#69abff',
                paddingHorizontal: widthToDp('3%'),
                // paddingTop: heightToDp("1%"),
                // paddingBottom: heightToDp("1.4%")
            }}>
                {
                    this.props.isBottomTabScreen ? 
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
                            !this.props.isMessageScreen &&
                            <Icon
                                name={this.props.isSearchFocused ? "search" : this.props.isProfileFocused ? "ellipsis-v" : "bell"}
                                size={(this.props.isSearchFocused || this.props.isProfileFocused) ? 20 : 22}
                                color="#a9a9a9"
                            />
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
                                color={"#fff"}
                            />
                        }
                        <Text style={{
                            color: '#fff',
                            fontSize: 15,
                            marginLeft: this.props.isBackButton ? widthToDp("2%") : 0
                        }}>
                            {this.props.headerText}
                        </Text>
                    </TouchableOpacity>   
                }             
        </SafeAreaView>
    )
}
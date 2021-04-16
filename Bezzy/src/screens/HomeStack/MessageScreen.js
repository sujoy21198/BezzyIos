import React from 'react';
import { Image, Platform, Text, TextInput, Touchable, TouchableOpacity, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import Icon from 'react-native-vector-icons/FontAwesome5';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { heightToDp, widthToDp } from '../../components/Responsive';

export default class MessageScreen extends React.Component {
    render = () => (
        <KeyboardAwareScrollView
            style={{
                flex: 1,
                backgroundColor: '#fff'
            }}
            keyboardShouldPersistTaps="handled"
        >
            <TouchableOpacity
                style={{
                    paddingHorizontal: widthToDp("2%"),
                    height: heightToDp("6%"),
                    flexDirection: 'row',
                    alignItems: 'center',
                    borderBottomWidth: 1,
                    borderBottomColor: "#ececec",
                }}
                activeOpacity={0.7}
                onPress={() => this.props.navigation.goBack()}
            >
                <Icon 
                    name="chevron-left"
                    size={20}
                    color={"#69abff"}                        
                />
                <Image
                source={require("../../../assets/default_person.png")}
                style={{height: 40, width: 40, borderRadius: 40 / 2, marginLeft: widthToDp("1%")}}
                resizeMode="contain"
                />
                <Text
                    style={{
                        marginLeft: widthToDp("2%"),
                        fontSize: widthToDp("3.6%")
                    }}
                >
                    Demo User
                </Text>
            </TouchableOpacity>
            <View style={{height: heightToDp("89%")}}/>
            
            <View
                style={{
                    height: heightToDp("5%"),
                    borderTopWidth: 1,
                    borderTopColor: '#ececec',
                    padding: widthToDp('1%'),
                    flexDirection: 'row',
                    alignItems: 'center',
                }}
            >
                <Icon
                    name="smile"
                    size={20}
                    color="#69abff"
                />
                <Ionicons
                    name={Platform.OS==='android' ? 'md-image' : 'ios-image'}
                    size={25}
                    color="#69abff"
                    style={{paddingLeft: widthToDp("1%")}}
                />
                <View
                    style={{
                        marginLeft: widthToDp("1%"),
                        paddingHorizontal: widthToDp("2%"),
                        width: widthToDp("85%"),
                        borderWidth: 1,
                        borderRadius: 5,
                        borderColor: "#69abff",
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                    }}
                >
                    <TextInput
                        placeholder="Enter message"
                        placeholderTextColor="#808080"
                        style={{
                            padding: widthToDp("1%"),
                            fontSize: widthToDp("3.5%"),
                            color: '#777'
                        }}
                    />
                    <Ionicons
                    name={Platform.OS==='android' ? 'md-send' : 'ios-send'}
                    size={20}
                    color="#69abff"
                    />
                </View>
            </View>
        </KeyboardAwareScrollView>
    )
}
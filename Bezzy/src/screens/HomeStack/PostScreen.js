import React from 'react';
import { SafeAreaView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import Icon from 'react-native-vector-icons/Ionicons';
import Header from '../../components/Header';
import { heightToDp, widthToDp } from '../../components/Responsive';

export default class PostScreen extends React.Component {
    state = {
        focusedTab: "photo"
    }

    render = () => (
        <SafeAreaView style={{flex: 1}}>  
            <Header isHomeStackInnerPage isBackButton navigation={this.props.navigation} headerText={this.state.focusedTab==="photo" ? "Photo" : "Video"}/>
            <KeyboardAwareScrollView
                keyboardShouldPersistTaps="handled"
            >          
                <View
                    style={{
                        marginVertical: heightToDp('1.3%'),
                        marginHorizontal: widthToDp("1.5%"),
                        backgroundColor: '#fff',
                        paddingHorizontal: widthToDp("2%"),
                        borderRadius: 10,
                        borderWidth: 1,
                        borderColor: '#fff'
                    }}
                >
                    <TextInput
                        style={{ 
                            color: "#69abff",
                            marginBottom: heightToDp("1%"),
                            height: heightToDp("10%"),
                        }}
                        textAlignVertical="top"
                        placeholder="Write Something here..."
                        placeholderTextColor="#69abff"
                        multiline
                    />
                    <View style={{ alignItems: 'flex-end', paddingBottom: heightToDp("1%") }}>
                        <View
                            style={{
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                                alignItems: 'center'
                            }}
                        >
                            <TouchableOpacity
                                style={{
                                    padding: widthToDp("2%"),
                                    backgroundColor: '#69abff',
                                    borderWidth: 1,
                                    borderRadius: 10,
                                    borderColor: '#69abff'
                                }}
                            >
                                <Text
                                    style={{
                                        color: '#fff'
                                    }}
                                >
                                    UPLOAD {this.state.focusedTab==="photo" ? "PHOTO" : "VIDEO"}
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={{
                                    padding: widthToDp("2%"),
                                    backgroundColor: '#69abff',
                                    borderWidth: 1,
                                    borderRadius: 10,
                                    borderColor: '#69abff',
                                    marginLeft: widthToDp("1.5%")
                                }}
                            >
                                <Text
                                    style={{
                                        color: '#fff'
                                    }}
                                >
                                    POST
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View> 
                </View>
            </KeyboardAwareScrollView>
            <View
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
                                width: widthToDp("50%"),
                                justifyContent: 'center',
                                alignItems: 'center',
                                elevation: 10
                            }}
                            activeOpacity={0.7}
                            disabled={this.state.focusedTab==="photo"}
                            onPress={() => this.setState({focusedTab: "photo"})}
                        >
                            <Icon
                                name={Platform.OS==='android' ? 'md-camera' : 'ios-camera'}
                                size={23}
                                color={this.state.focusedTab==="photo" ? "#69abff" : "#808080"}
                            />
                            <Text
                                style={{
                                    fontSize: widthToDp("3%"),
                                    color: this.state.focusedTab==="photo" ? "#69abff" : "#808080"
                                }}
                            >PHOTO</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={{
                                backgroundColor: '#fff',
                                height: heightToDp("7.5%"),
                                width: widthToDp("50%"),
                                justifyContent: 'center',
                                borderTopWidth: 1,
                                borderTopColor: '#ececec',
                                borderTopRightRadius: 8,
                                alignItems: 'center',
                                elevation: 10,
                            }}
                            activeOpacity={0.7}
                            disabled={this.state.focusedTab==="video"}
                            onPress={() => this.setState({focusedTab: "video"})}
                        >
                            <Icon
                                name={Platform.OS==='android' ? 'md-videocam-outline' : 'ios-videocam-outline'}
                                size={23}
                                color={this.state.focusedTab==="video" ? "#69abff" : "#808080"}
                            />
                            <Text
                                style={{
                                    fontSize: widthToDp("3%"),
                                    color: this.state.focusedTab==="video" ? "#69abff" : "#808080"
                                }}
                            >Video</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </SafeAreaView>
    )
}
import React, { Component } from 'react'
import { ActivityIndicator, Alert, FlatList, Image, SafeAreaView, ScrollView, StatusBar, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { heightToDp, widthToDp } from '../../components/Responsive';
import LinearGradient from 'react-native-linear-gradient';
import PushNotificationController from '../../components/PushNotificationController';

export default class ChatImagePreviewScreen extends Component {

    constructor(props) {
        super(props)
        this.state = {
            imageUrl: ''
        }
        this.state.imageUrl = this.props.route.params.imageUrl
        //alert(this.state.imageUrl)
    }
    render() {
        return (
            <View style={{ flex: 1, backgroundColor: '#1b1b1b' }}>
                <LinearGradient
                    style={{ paddingTop: heightToDp("10%") }}
                    colors={['#fff', '#1b1b1b']}
                >
                    <Image
                        resizeMode="contain"
                        style={{ height: heightToDp("80%"), width: widthToDp("100%") }}
                        source={{ uri: this.state.imageUrl }}
                    />
                </LinearGradient>
                <PushNotificationController navigation={this.props.navigation}/>
            </View>
        );
    }
}
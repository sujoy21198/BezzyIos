import React from 'react';
import { SafeAreaView, StatusBar } from 'react-native';
import BottomTab from '../../components/BottomTab';
import Header from '../../components/Header';

export default class ChatScreen extends React.Component {
    render = () => (
        <SafeAreaView style={{flex: 1, backgroundColor: '#ececec'}}>       
            <StatusBar backgroundColor="#69abff" barStyle="light-content" />
            <Header isMessageScreen headerText="Messages"/>
            <BottomTab isChatFocused navigation={this.props.navigation}/>
        </SafeAreaView>
    )
}
import React from 'react';
import { SafeAreaView } from 'react-native';
import BottomTab from '../../components/BottomTab';
import Header from '../../components/Header';

export default class ChatScreen extends React.Component {
    render = () => (
        <SafeAreaView style={{flex: 1, backgroundColor: '#ececec'}}>
            <Header isMessageScreen headerText="Messages"/>
            <BottomTab isChatFocused navigation={this.props.navigation}/>
        </SafeAreaView>
    )
}
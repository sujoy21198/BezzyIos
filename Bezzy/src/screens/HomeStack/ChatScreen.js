import React from 'react';
import { RefreshControl, SafeAreaView, ScrollView, StatusBar } from 'react-native';
import BottomTab from '../../components/BottomTab';
import Header from '../../components/Header';

export default class ChatScreen extends React.Component {
    state = {
        isRefreshing: false
    }
    render = () => (
        <SafeAreaView style={{flex: 1, backgroundColor: '#ececec'}}>       
            <StatusBar backgroundColor="#69abff" barStyle="light-content" />
            <Header isMessageScreen headerText="Messages"/>
            <ScrollView
                refreshControl={
                    <RefreshControl
                        refreshing={this.state.isRefreshing}
                        onRefresh={() => this.setState({isRefreshing: true}, () => this.setState({isRefreshing: false}))}
                    />
                }
            >

            </ScrollView>
            <BottomTab isChatFocused navigation={this.props.navigation}/>
        </SafeAreaView>
    )
}
import React from 'react';
import { SafeAreaView } from 'react-native';
import BottomTab from '../../components/BottomTab';
import Header from '../../components/Header';

export default class ProfileScreen extends React.Component {
    render = () => (
        <SafeAreaView style={{flex: 1, backgroundColor: '#ececec'}}>
            <Header isBottomTabScreen isProfileFocused headerText="Profile"/>
            <BottomTab isProfileFocused navigation={this.props.navigation}/>
        </SafeAreaView>
    )
}
import React from 'react';
import { SafeAreaView } from 'react-native';
import BottomTab from '../../components/BottomTab';
import Header from '../../components/Header';

export default class SearchScreen extends React.Component {
    render = () => (
        <SafeAreaView style={{flex: 1, backgroundColor: '#ececec'}}>
            <Header isBottomTabScreen isSearchFocused headerText="Search for friends"/>
            <BottomTab isSearchFocused navigation={this.props.navigation}/>
        </SafeAreaView>
    )
}
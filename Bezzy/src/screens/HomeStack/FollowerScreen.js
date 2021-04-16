import React from 'react';
import { SafeAreaView } from 'react-native';
import Header from '../../components/Header';

export default class FollowerScreen extends React.Component {
    render = () => (
        <SafeAreaView style={{flex: 1}}>
            <Header isHomeStackInnerPage isBackButton headerText={this.props.route.params.user} navigation={this.props.navigation}/>
        </SafeAreaView>
    )
}
import React from 'react';
import { SafeAreaView, StatusBar } from 'react-native';
import Header from '../../components/Header';
import ProfileScreen from './ProfileScreen';

export default class ViewProfileScreen extends React.Component {
    render = () => (
        <SafeAreaView style={{flex: 1}}>
            <StatusBar backgroundColor="#69abff" barStyle="light-content" />
            <Header isBackButton isHomeStackInnerPage loginStack={this.props.route.params.loginStack} headerText={this.props.route.params.name} navigation={this.props.navigation}/>
            <ProfileScreen
                viewProfile={true}
                userId={this.props.route.params.id}
                navigation={this.props.navigation}
            />
        </SafeAreaView>
    )
}
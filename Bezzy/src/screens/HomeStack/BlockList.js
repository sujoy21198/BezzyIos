import React from 'react';
import { SafeAreaView, StatusBar } from 'react-native';
import Header from '../../components/Header';

export default class BlockList extends React.Component {
    render = () => (
        <SafeAreaView style={{flex: 1}}>       
            <StatusBar backgroundColor="#69abff" barStyle="light-content" />
            <Header isHomeStackInnerPage block={true} headerText={"Block List"} navigation={this.props.navigation}/>
        </SafeAreaView>
    )
}
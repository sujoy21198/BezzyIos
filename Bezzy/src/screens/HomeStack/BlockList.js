import React from 'react';
import { SafeAreaView } from 'react-native';
import Header from '../../components/Header';

export default class BlockList extends React.Component {
    render = () => (
        <SafeAreaView style={{flex: 1}}>
            <Header isHomeStackInnerPage isBackButton backToProfile={true} headerText={"Block List"} navigation={this.props.navigation}/>
        </SafeAreaView>
    )
}
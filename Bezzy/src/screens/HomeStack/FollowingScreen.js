import React from 'react';
import { FlatList, SafeAreaView, Text, View } from 'react-native';
import Header from '../../components/Header';
import { widthToDp } from '../../components/Responsive';

export default class FollowingScreen extends React.Component {
    render = () => (
        <SafeAreaView style={{flex: 1}}>
            <Header isHomeStackInnerPage isBackButton headerText={this.props.route.params.user} navigation={this.props.navigation}/>
            <FlatList
            contentContainerStyle={{
                padding: widthToDp("2%")
            }}
            data={[
                "Demo User"
            ]}
            renderItem={({item, index}) => (
                <View
                    style={{
                        backgroundColor: "#fff",
                        padding: widthToDp("2%"),
                        borderRadius: 10
                    }}
                ></View>
            )}
            />
        </SafeAreaView>
    )
}
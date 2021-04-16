import React from 'react';
import { FlatList, Image, Platform, SafeAreaView, Text, View } from 'react-native';
import Header from '../../components/Header';
import { heightToDp, widthToDp } from '../../components/Responsive';

export default class FollowingScreen extends React.Component {
    render = () => (
        <SafeAreaView style={{flex: 1}}>
            <Header isHomeStackInnerPage isBackButton headerText={this.props.route.params.user} navigation={this.props.navigation}/>
            <FlatList
            contentContainerStyle={{
                padding: widthToDp("2%")
            }}
            data={[
                "Demo User",
                "Demo User"
            ]}
            ItemSeparatorComponent={() => <View style={{height: heightToDp("1%")}}/>}
            renderItem={({item, index}) => (
                <View
                    style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        backgroundColor: "#fff",
                        padding: widthToDp("3%"),
                        borderRadius: 10
                    }}
                >
                    <View
                        style={{
                            flexDirection: 'row',
                            alignItems: 'center'
                        }}
                    >
                        <Image
                            source={require("../../../assets/default_person.png")}
                            style={{height: heightToDp("5%"), width: widthToDp("12%")}}
                        />
                        <Text
                            style={{
                                marginLeft: widthToDp("2%")
                            }}
                        >Abc User</Text>
                    </View>
                    <Image
                        source={require("../../../assets/unfriend.png")}
                        resizeMode="contain"
                        style={{height: heightToDp("7%"), width: widthToDp('7%')}}
                    />
                </View>
            )}
            />
        </SafeAreaView>
    )
}
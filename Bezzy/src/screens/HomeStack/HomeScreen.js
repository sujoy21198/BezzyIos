import React from 'react';
import { FlatList, Image, SafeAreaView, ScrollView, Text, Touchable, TouchableOpacity, View } from 'react-native';
import { Card } from 'native-base'
import { FlatGrid } from 'react-native-super-grid';
import Icon from 'react-native-vector-icons/FontAwesome5';
import BottomTab from '../../components/BottomTab';
import Header from '../../components/Header';
import { heightToDp, widthToDp } from '../../components/Responsive';
import Accordion from 'react-native-collapsible/Accordion';


const SECTIONS = [
    {
        title: 'First',
        content: 'Lorem ipsum...',
        lastSeen: '1 Day Ago',
        image: 'https://media.wired.com/photos/598e35fb99d76447c4eb1f28/master/pass/phonepicutres-TA.jpg',
        postedTime: '2 minutues ago',
        caption: 'Hi there'
    },
    {
        title: 'Second',
        content: 'Lorem ipsum...',
        lastSeen: '2 Days Ago',
        image: 'https://media.wired.com/photos/598e35fb99d76447c4eb1f28/master/pass/phonepicutres-TA.jpg',
        postedTime: '2 minutues ago',
        caption: 'Hi there'
    },
];

export default class HomeScreen extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            activeSections: []
        }
    }

    _renderSectionTitle = section => {
        return (
            <View >
                <Text>{section.content}</Text>
            </View>
        );
    };

    _renderHeader = section => {
        return (
            <View >
                <Card style={{ height: heightToDp("15%"), width: widthToDp("95%"), alignSelf: 'center', borderRadius: 10 }}>
                    <View style={{ flexDirection: 'row' }}>
                        <Image
                            source={require("../../../assets/default_person.png")}
                            style={{ height: heightToDp("13%"), width: widthToDp("22%"), marginLeft: widthToDp("2%"), borderRadius: 10 }}
                        />
                        <View>
                            <View style={{ marginLeft: widthToDp("60%"), marginTop: heightToDp("2%") }}>
                                <Icon
                                    name="bell"
                                    size={20}
                                    color={"#008000"}
                                />
                            </View>
                            <View style={{ marginLeft: widthToDp("6%"), }}>
                                <Text>{section.title}</Text>
                            </View>
                            <View style={{ marginLeft: widthToDp("6%"), }}>
                                <Text style={{ color: '#ff0000' }}>{section.lastSeen}</Text>
                            </View>
                            <TouchableOpacity 
                            activeOpacity={0.7}
                            onPress={() => this.props.navigation.navigate("MessageScreen")}
                            style={{ marginLeft: widthToDp("60%"), marginTop: heightToDp("2%") }}>
                                <Icon
                                    name="comments"
                                    size={20}
                                    color={"#87CEEB"}
                                />
                            </TouchableOpacity>
                        </View>

                    </View>
                </Card>
            </View>
        );
    };

    _renderContent = section => {
        return (
            <View >
                <Card style={{ height: heightToDp("60%"), width: widthToDp("95%"), alignSelf: 'center', borderRadius: 10 }}>
                    <View style={{ flexDirection: 'row' }}>
                        <Image
                            source={require("../../../assets/default_person.png")}
                            style={{ height: heightToDp("8%"), width: widthToDp("10%"), marginLeft: widthToDp("4%"), borderRadius: 300, marginTop: heightToDp("2%") }}
                        />
                        <View>
                            <View style={{ marginLeft: widthToDp("6%"), marginTop: heightToDp("4%") }}>
                                <Text>{section.title}</Text>
                            </View>
                            <View style={{ marginLeft: widthToDp("6%"), marginTop: heightToDp("0%") }}>
                                <Text style={{ color: 'blue' }}>{section.postedTime}</Text>
                            </View>
                        </View>
                    </View>
                    <View>
                        <View style={{ marginLeft: widthToDp("6%"), marginTop: heightToDp("0%") }}>
                            <Text style={{ color: 'black' }}>{section.caption}</Text>
                        </View>
                    </View>
                    <View style={{ alignSelf: 'center',marginTop:heightToDp("2%") }}>
                        <Image
                            style={{ height: heightToDp("20%"), width: widthToDp("60%") }}
                            source={{ uri: 'https://media.wired.com/photos/598e35fb99d76447c4eb1f28/master/pass/phonepicutres-TA.jpg' }}
                        />
                    </View>
                </Card>
            </View>
        );
    };

    _updateSections = activeSections => {
        this.setState({ activeSections });
    };

    render() {
        return (
            <SafeAreaView style={{ flex: 1, backgroundColor: '#ececec' }}>
                <Header isHomeScreen />
                <ScrollView>
                    <Accordion
                        sections={SECTIONS}
                        activeSections={this.state.activeSections}
                        //renderSectionTitle={this._renderSectionTitle}
                        renderHeader={this._renderHeader}
                        renderContent={this._renderContent}
                        onChange={this._updateSections}
                    />
                    <View style={{ margin: 10 }}></View>
                </ScrollView>
                <BottomTab isHomeFocused navigation={this.props.navigation} />
            </SafeAreaView>
        )
    }
}
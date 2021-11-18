import React from "react";
import { Platform, SafeAreaView, ScrollView, StatusBar, Text, TouchableOpacity, View } from "react-native";
import Header from "../../components/Header";
import { heightToDp, widthToDp } from "../../components/Responsive";

export default class Settings extends React.Component {
    render = () => (
        <SafeAreaView style={{flex: 1}}>    
            <StatusBar backgroundColor="#69abff" barStyle={Platform.OS==='android' ? "light-content" : "dark-content"} />
            <Header isHomeStackInnerPage settings isBackButton block={true} headerText={"Settings"} navigation={this.props.navigation}/>

            <ScrollView showsVerticalScrollIndicator={false}>
                <TouchableOpacity
                    style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        backgroundColor: "#fff",
                        paddingVertical: 5,
                        paddingHorizontal: 10,
                        margin: heightToDp("1%"),
                        borderRadius: 10
                    }}
                    activeOpacity={0.7}
                    onPress={() => this.props.navigation.navigate("Terms")}
                >
                    <Text
                        style={{
                            fontSize: widthToDp("3.8%"),
                            fontFamily: "Poppins-Regular"
                        }}
                    >Terms & Conditions</Text>
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    )
}
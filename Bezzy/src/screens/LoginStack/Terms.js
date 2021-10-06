import axios from 'axios';
import React from 'react';
import {ActivityIndicator, Dimensions, Platform, SafeAreaView, ScrollView, StatusBar, View} from 'react-native'; 
import DataAccess from '../../components/DataAccess';
import Header from '../../components/Header';
import HTML from "react-native-render-html";
import { heightToDp, widthToDp } from '../../components/Responsive';

export default class Terms extends React.Component {
    state = {
        isLoading: false,
        terms: ""
    }

    componentDidMount = async () => {
        this.setState({isLoading: true})
        let response = await axios.get(DataAccess.BaseUrl + DataAccess.terms);
        this.setState({isLoading: false})

        if(response.data.status === "success") {
            this.setState({
                terms: response.data.page_content
            })
        }
    }

    render = () => (
        <SafeAreaView style={{flex: 1, backgroundColor: '#69abff'}}>
            <StatusBar backgroundColor="#007dfe" barStyle={Platform.OS==='android' ? "light-content" : "dark-content"} />
            <Header isBackButton loginStack={true} headerText={"Terms & Conditions"} navigation={this.props.navigation} />
            <View
                style={{
                    borderTopWidth: 1,
                    borderTopColor: '#69abff',
                    borderTopLeftRadius: 18,
                    borderTopRightRadius: 18,
                    flex: 1, 
                    backgroundColor: '#fff', 
                }}
            >
                {
                    this.state.isLoading ?
                    <View
                        style={{
                            flex: 1,
                            justifyContent: 'center', 
                            alignSelf: 'center'
                        }}
                    >
                        <ActivityIndicator size="large" color="#69abff" />
                    </View> :
                    <ScrollView
                        style={{
                            paddingHorizontal: widthToDp("2%"),
                            paddingVertical: heightToDp("0.5%"),
                        }}
                        showsVerticalScrollIndicator={false}
                    >
                        <HTML source={{ html: this.state.terms || '<p></p>' }} baseFontStyle={{fontSize: Platform.isPad ? 20 : 15}} contentWidth={Dimensions.get("window").width} />
                    </ScrollView>
                }
            </View>
        </SafeAreaView>
    )
}
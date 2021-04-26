import axios from 'axios';
import React from 'react';
import {ActivityIndicator, Dimensions, SafeAreaView, ScrollView, View} from 'react-native'; 
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
        <SafeAreaView style={{flex: 1}}>
            <Header isBackButton loginStack={true} headerText={"Terms & Conditions"} navigation={this.props.navigation} />
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
                        flex: 1, 
                        backgroundColor: '#fff', 
                        paddingHorizontal: widthToDp("2%"),
                        paddingVertical: heightToDp("0.5%")
                    }}
                    showsVerticalScrollIndicator={false}
                >
                    <HTML source={{ html: this.state.terms || '<p></p>' }} contentWidth={Dimensions.get("window").width} />
                </ScrollView>
            }
        </SafeAreaView>
    )
}
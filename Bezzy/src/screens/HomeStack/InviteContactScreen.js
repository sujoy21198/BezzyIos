import React from "react";
import { ActivityIndicator, FlatList, Platform, SafeAreaView, StatusBar, Text, TouchableOpacity, View } from "react-native";
import Header from "../../components/Header";
import Contacts from 'react-native-contacts';
import { heightToDp, widthToDp } from "../../components/Responsive";
import Share from "react-native-share";
import Icon from "react-native-vector-icons/Ionicons"

export default class InviteContactScreen extends React.Component {
    state={
        isLoading: true,
        myContacts: []
    };
    async componentDidMount() {
        let myContacts = await Contacts.getAll();
        myContacts.length > 0 &&
        myContacts.map(element => {
            let phoneNumbers = "";
            element.phoneNumbers.map((item, index) => {
                phoneNumbers += item.number + (index !== element.phoneNumbers.length - 1 ? ", " : "");
            })
            element.phoneNumbersString = phoneNumbers;
            phoneNumbers = "";
        })
        this.setState({isLoading : false, myContacts})
        console.warn(myContacts, "==> My Contacts");
    }

    inviteContacts = async () => {
        const ShareOptions = {
            message: "hi check this from link : https://bezzyapp.page.link/appadmin"
        }

        try {
            Share.open(ShareOptions).then(res => console.log(res))
            .catch(err => console.log(err))
        } catch (error) {
            console.log(error)
        }
    }

    render = () => (
        <SafeAreaView style={{flex: 1}}>
            <StatusBar backgroundColor="#69abff" barStyle={Platform.OS==='android' ? "light-content" : "dark-content"} />

            <Header isHomeStackInnerPage isBackButton block={true} headerText={"Invite A Friend"} navigation={this.props.navigation}/>
            {
                this.state.isLoading ?
                <View 
                    style={{
                        flex: 1,
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}
                >
                    <ActivityIndicator size="large" color="#007dfe"/>
                </View> :
                <FlatList
                    style={{
                        padding: widthToDp("2%")
                    }}
                    data={this.state.myContacts}
                    ListFooterComponent={<View style={{height: heightToDp("1%")}}/>}
                    ItemSeparatorComponent={() => <View style={{height: heightToDp("1%")}}/>}
                    renderItem={({item, index}) => (
                        <TouchableOpacity
                            onPress={this.inviteContacts}
                            style={{
                                backgroundColor: "#fff",
                                paddingHorizontal: widthToDp("3%"),
                                paddingVertical: heightToDp("1%"),
                                borderRadius: 10,
                            }}
                        >
                            <View
                                style={{
                                    flexDirection: 'row',
                                }}
                            >
                                <Icon
                                    name={Platform.OS==='android' ? "md-person-circle-outline" : "ios-person-circle-outline"}
                                    size={Platform.isPad ? 50 : 25}
                                    color="#808080"
                                />
                                <View style={{
                                    paddingHorizontal: "2%"
                                }}>
                                    <Text
                                        style={{
                                            fontSize: widthToDp("3.3%"),
                                            fontFamily: "Poppins-Regular"
                                        }}
                                    >{item.givenName + " " + item.middleName + " " + item.familyName}</Text>
                                    <Text
                                        style={{
                                            fontSize: widthToDp("3%"),
                                            fontFamily: "Poppins-Regular",
                                            color: "#808080",
                                            width: "100%"
                                        }}
                                    >{item.phoneNumbersString}</Text>
                                </View>
                            </View>
                        </TouchableOpacity>
                    )}
                />
            }
        </SafeAreaView>
    )
}
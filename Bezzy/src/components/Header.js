import React from 'react';
import { SafeAreaView, Text, TouchableOpacity, View } from 'react-native';
import { heightToDp, widthToDp } from './Responsive';
import Icon from 'react-native-vector-icons/FontAwesome5'

export default class Header extends React.Component {
    render = () => (
        <SafeAreaView 
            style={{
                flex: 0.03,
                backgroundColor: '#69abff',
                paddingHorizontal: widthToDp('3%'),
                paddingTop: heightToDp("1%"),
                paddingBottom: heightToDp("1.4%")
            }}>
                <TouchableOpacity
                    style={{
                        flexDirection: 'row',
                        alignItems: 'center'
                    }}
                    activeOpacity={0.7}
                    onPress={() => this.props.navigation.goBack()}
                >
                    {
                        this.props.isBackButton && 
                        <Icon 
                            name="chevron-left"
                            size={15}
                            color={"#fff"}
                        />
                    }
                    <Text style={{
                        color: '#fff',
                        fontSize: 15,
                        marginLeft: this.props.isBackButton ? widthToDp("2%") : 0
                    }}>
                        {this.props.headerText}
                    </Text>
                </TouchableOpacity>                
        </SafeAreaView>
    )
}
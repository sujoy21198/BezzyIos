import React from 'react';
import { Text, TouchableOpacity } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { heightToDp, widthToDp } from './Responsive';

export default class ButtonComponent extends React.Component {
    render = () => (
        <LinearGradient
            colors={["#007dfe", "#10c0ff"]}
            start={{x: 0.15, y: 0.8}} 
            style={{
                marginTop: heightToDp(`${this.props.editProfile ? 2 : 3}%`),
                borderRadius: 10,            
                marginHorizontal: this.props.updateProfile ? widthToDp("2.7%") : '0%',
                width: this.props.editProfile ? widthToDp("40%") : this.props.updateProfile ? "95%" : "100%",
                padding: widthToDp(`${this.props.editProfile ? 2.5 : 3}%`)
            }}
        >
            <TouchableOpacity
                activeOpacity={0.7}
                onPress={this.props.onPressButton}
                disabled={this.props.disabled}
            >
                <Text
                    style={{
                        color: "#fff",
                        textAlign: "center",
                        fontFamily: "proxima_nova_black"
                    }}
                >
                    {this.props.buttonText}
                </Text>
            </TouchableOpacity>
        </LinearGradient>
    )
}
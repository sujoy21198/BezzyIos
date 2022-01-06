import React from "react";
import { Platform, Text, TouchableOpacity } from "react-native";
import LinearGradient from "react-native-linear-gradient";
import { heightToDp, widthToDp } from "./Responsive";
import Icon from "react-native-vector-icons/Ionicons";

export default class ButtonComponent extends React.Component {
  render = () => (
    <LinearGradient
      colors={["#007dfe", "#10c0ff"]}
      start={{ x: 0.15, y: 0.8 }}
      style={{
        marginTop: heightToDp(`${this.props.marginTop ? 1 : this.props.editProfile ? 2 : 3}%`),
        borderRadius: 10,
        marginHorizontal: this.props.updateProfile ? widthToDp("2.7%") : "0%",
        width: this.props.socialLogin
          ? "48%"
          : this.props.editProfile
          ? widthToDp("45%")
          : this.props.updateProfile
          ? "95%"
          : "100%",
        padding: widthToDp(`${this.props.editProfile ? 2.5 : 3}%`),
      }}
    >
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={this.props.onPressButton}
        disabled={this.props.disabled}
      >
        {this.props.socialLogin ? (
          <TouchableOpacity
            style={{
              flex: 1,
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "flex-end",
              borderRadius: 5,
              // padding: 4.5
            }}
            onPress={this.props.onPressButton}
          >
            <Icon
              name={this.props.icon}
              size={Platform.isPad ? 50 : 25}
              color="white"
            />
            <Text
              style={{
                color: "white",
                fontWeight: "bold",
                alignSelf: "center",
                fontSize: widthToDp("4%"),
              }}
            >
              {this.props.buttonText}
            </Text>
          </TouchableOpacity>
        ) : (
          <Text
            style={[
              {
                color: "#fff",
                textAlign: "center",
                fontFamily: "ProximaNova-Black",
              },
              Platform.isPad && { fontSize: widthToDp("3.2%") },
            ]}
          >
            {this.props.buttonText}
          </Text>
        )}
      </TouchableOpacity>
    </LinearGradient>
  );
}

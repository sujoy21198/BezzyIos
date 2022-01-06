import React from "react";
import {
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import Header from "../../components/Header";
import { heightToDp, widthToDp } from "../../components/Responsive";

class Settings extends React.Component {
  state = {
    isAccountPrivate: false,
  };

  render = () => (
    <SafeAreaProvider style={{ flex: 1 }}>
      <View style={{ height: this.props.insets.top, backgroundColor: "#fff" }}>
        <StatusBar backgroundColor="#fff" barStyle={"dark-content"} animated />
      </View>
      <Header
        isHomeStackInnerPage
        settings
        isBackButton
        block={true}
        headerText={"Settings"}
        navigation={this.props.navigation}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{ paddingVertical: 10 }}
      >
        <TouchableOpacity
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            backgroundColor: "#fff",
            paddingVertical: 5,
            paddingHorizontal: 10,
            margin: heightToDp("1%"),
            borderRadius: 5,
            borderWidth: 1,
            borderColor: "#ececec",
          }}
          activeOpacity={0.7}
          onPress={() => this.props.navigation.navigate("Terms")}
        >
          <Text
            style={{
              fontSize: widthToDp("3.8%"),
              fontFamily: "Poppins-Regular",
            }}
          >
            Terms & Conditions
          </Text>
          <FontAwesome
            name="chevron-right"
            size={Platform.isPad ? 30 : 18}
            color={"#69abff"}
          />
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaProvider>
  );
}

export default (props) => {
  const insets = useSafeAreaInsets();
  return <Settings {...props} insets={insets} />;
};

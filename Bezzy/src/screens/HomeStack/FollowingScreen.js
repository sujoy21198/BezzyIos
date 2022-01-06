import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import React from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  Platform,
  SafeAreaView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Header from "../../components/Header";
import { heightToDp, widthToDp } from "../../components/Responsive";
import DataAccess from "../../components/DataAccess";
import RBSheet from "react-native-raw-bottom-sheet";
import { Toast } from "native-base";
import PushNotificationController from "../../components/PushNotificationController";
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

class FollowingScreen extends React.Component {
  state = {
    followingList: [],
    isLoading: false,
  };

  componentDidMount = async () => {
    this.setState({ isLoading: true });
    let userId = await AsyncStorage.getItem("userId");
    let response = await axios.post(
      DataAccess.BaseUrl + DataAccess.userFollowingList,
      { loguser_id: userId },
      DataAccess.AuthenticationHeader
    );
    console.warn(response.data);
    if (response.data.resp === "success") {
      this.setState({ followingList: response.data.following_user_list });
    } else {
      this.setState({ followingList: [] });
    }
    this.setState({ isLoading: false });
  };

  unfollow = async (item, index) => {
    this.RBSheet.open();
    let userId = await AsyncStorage.getItem("userId");
    let response = await axios.post(
      DataAccess.BaseUrl + DataAccess.unfollow,
      {
        loginUserID: userId,
        unfriendID: item.following_user_id,
      },
      DataAccess.AuthenticationHeader
    );
    if (response.data.status === "success") {
      let followingList = this.state.followingList;
      followingList.splice(index, 1);
      this.setState({ followingList });
      Toast.show({
        type: "success",
        text: response.data.alert_msg,
        duration: 3000,
      });
    } else {
      Toast.show({
        type: "success",
        text: response.data.alert_msg,
        duration: 3000,
      });
      // this.setState({followingList: []});
    }
    this.RBSheet.close();
  };

  render = () => (
    <SafeAreaProvider style={{ flex: 1 }}>
      <View style={{ height: this.props.insets.top, backgroundColor: "#fff" }}>
        <StatusBar backgroundColor="#fff" barStyle={"dark-content"} animated />
      </View>
      <Header
        isHomeStackInnerPage
        isBackButton
        block={true}
        headerText={this.props.route.params.user}
        navigation={this.props.navigation}
      />
      {this.state.isLoading ? (
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <ActivityIndicator size="large" color="#007dfe" />
        </View>
      ) : (
        <FlatList
          contentContainerStyle={{
            padding: widthToDp("2%"),
          }}
          data={this.state.followingList}
          initialNumToRender={1000}
          ListFooterComponent={<View style={{ height: heightToDp("1%") }} />}
          ItemSeparatorComponent={() => (
            <View style={{ height: heightToDp("1%") }} />
          )}
          renderItem={({ item, index }) => (
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                backgroundColor: "#fff",
                paddingHorizontal: widthToDp("3%"),
                paddingVertical: 0,
                borderRadius: 10,
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <Image
                  source={{ uri: item.image }}
                  style={{
                    height: Platform.isPad ? 80 : 40,
                    width: Platform.isPad ? 80 : 40,
                    borderRadius: Platform.isPad ? 80 / 2 : 40 / 2,
                    borderWidth: 1,
                    borderColor: "#69abff",
                  }}
                />
                <Text
                  style={{
                    marginLeft: widthToDp("2%"),
                    fontSize: widthToDp("3%"),
                    fontFamily: "Poppins-Regular",
                  }}
                >
                  {item.name}
                </Text>
              </View>
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => this.unfollow(item, index)}
              >
                <Image
                  source={require("../../../assets/unfriend.png")}
                  resizeMode="contain"
                  style={{ height: heightToDp("7%"), width: widthToDp("7%") }}
                />
              </TouchableOpacity>
              <RBSheet
                ref={(ref) => {
                  this.RBSheet = ref;
                }}
                height={heightToDp("6%")}
                closeOnPressMask={false}
                closeOnPressBack={false}
                // openDuration={250}
                customStyles={{
                  container: {
                    width: widthToDp("15%"),
                    position: "absolute",
                    top: heightToDp("45%"),
                    left: widthToDp("40%"),
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: "#fff",
                    borderRadius: 10,
                  },
                }}
              >
                <ActivityIndicator size="large" color="#69abff" />
              </RBSheet>
            </View>
          )}
        />
      )}
      <PushNotificationController navigation={this.props.navigation} />
    </SafeAreaProvider>
  );
}

export default (props) => {
  const insets = useSafeAreaInsets();
  return <FollowingScreen {...props} insets={insets} />;
};

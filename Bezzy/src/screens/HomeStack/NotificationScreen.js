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
  Touchable,
  TouchableOpacity,
  View,
} from "react-native";
import Header from "../../components/Header";
import DataAccess from "../../components/DataAccess";
import { heightToDp, widthToDp } from "../../components/Responsive";
import RBSheet from "react-native-raw-bottom-sheet";
import { Toast } from "native-base";
import PushNotificationController from "../../components/PushNotificationController";
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

class NotificationScreen extends React.Component {
  state = {
    notificationList: [],
    isLoading: false,
  };

  componentDidMount = async () => {
    this.setState({ isLoading: true });
    setTimeout(this.fetchNotifications, 2000);
  };

  fetchNotifications = async () => {
    let userId = await AsyncStorage.getItem("userId");
    let response = await axios.get(
      DataAccess.BaseUrl + DataAccess.fetchNotifications + "/" + userId,
      DataAccess.AuthenticationHeader
    );
    // console.log(response);
    if (response.data.status === "success") {
      if (
        response.data.notification_list &&
        response.data.notification_list.length > 0
      ) {
        response.data.notification_list.map(async (item, index) => {
          if (item.activity_message.includes("following")) {
            let res = await axios.post(
              DataAccess.BaseUrl + DataAccess.userFollowingList,
              { loguser_id: userId },
              DataAccess.AuthenticationHeader
            );
            if (res.data.resp === "success") {
              if (
                res.data.following_user_list &&
                res.data.following_user_list.length > 0
              ) {
                res.data.following_user_list.map((element) => {
                  if (item.from_id === element.following_user_id) {
                    item.isFollowing = true;
                  }
                });
              }
            } else {
              item.isFollowing = false;
            }
          }
        });
      }
      this.setState({ notificationList: response.data.notification_list });
    } else {
      this.setState({ notificationList: [] });
    }

    let res = await axios.get(
      DataAccess.BaseUrl + DataAccess.readNotifications + "/" + userId,
      DataAccess.AuthenticationHeader
    );
    // if(response.data.status === "success") {
    //     this.setState({notificationList: response.data.notification_list});
    // } else {
    //     this.setState({notificationList: []});
    // }
    this.setState({ isLoading: false });
    console.log(this.state.notificationList);
  };

  clearNotifications = async () => {
    this.RBSheet.open();
    let userId = await AsyncStorage.getItem("userId");
    let response = await axios.get(
      DataAccess.BaseUrl + DataAccess.clearNotification + "/" + userId,
      DataAccess.AuthenticationHeader
    );
    if (response.data.status === "success") {
      this.setState({ notificationList: [] });
      Toast.show({
        type: "success",
        text: "Notifications have been deleted successfully.",
        duration: 3000,
      });
    } else {
      Toast.show({
        type: "success",
        text: response.data.message,
        duration: 3000,
      });
    }
    this.RBSheet.close();
  };

  followUser = async (item, index) => {
    this.RBSheet.open();
    let userId = await AsyncStorage.getItem("userId");
    let response = await axios.post(
      DataAccess.BaseUrl + DataAccess.followBack,
      {
        login_userID: userId,
        userID: item.from_id,
      },
      DataAccess.AuthenticationHeader
    );
    // console.log(response.data)
    if (response.data.status === "success") {
      Toast.show({
        type: "success",
        text: "Follow successful",
        duration: 3000,
      });
      this.RBSheet.close();

      this.setState({ isLoading: true });
      this.fetchNotifications();
    } else {
      Toast.show({
        type: "success",
        text: response.data.message,
        duration: 3000,
      });
      this.RBSheet.close();
      // this.setState({followingList: []});
    }
  };

  render = () => (
    <SafeAreaProvider style={{ flex: 1 }}>
      <View style={{ height: this.props.insets.top, backgroundColor: "#fff" }}>
        <StatusBar backgroundColor="#fff" barStyle={"dark-content"} animated />
      </View>
      <Header
        isHomeStackInnerPage
        isBackButton
        notification={this.state.notificationList.length > 0 ? true : false}
        clearNotifications={this.clearNotifications}
        headerText={"Notifications"}
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
            flex: this.state.notificationList.length > 0 ? 0 : 1,
            padding: widthToDp("2%"),
          }}
          ListEmptyComponent={
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  fontSize: widthToDp("3.8%"),
                  color: "#007dfe",
                  fontFamily: "Poppins-Regular",
                }}
              >
                No Records Found
              </Text>
            </View>
          }
          data={this.state.notificationList}
          ListHeaderComponent={<View style={{ height: heightToDp("1.5%") }} />}
          ListFooterComponent={<View style={{ height: heightToDp("1.5%") }} />}
          ItemSeparatorComponent={() => (
            <View style={{ height: heightToDp("1%") }} />
          )}
          renderItem={({ item, index }) => (
            <TouchableOpacity
              style={{
                width: widthToDp("95%"),
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                backgroundColor: "#fff",
                padding: widthToDp("3%"),
                borderRadius: 6,
                elevation: 2,
                borderLeftColor: "#007dfe",
                borderLeftWidth: item.is_view === "1" ? 0 : 5.5,
              }}
              disabled={item.respostID === "" && item.notification_type !== "9"}
              activeOpacity={0.7}
              onPress={() =>
                item.notification_type === "9"
                  ? this.props.navigation.navigate("InboxScreen", {
                      friendId: item.from_id,
                      friendImage: item.userimage,
                      friendName: item.username,
                    })
                  : this.props.navigation.navigate("ImagePreviewScreen", {
                      hideFunctionalities: true,
                      image: { post_id: item.respostID },
                    })
              }
            >
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <Image
                  source={{ uri: item.userimage }}
                  style={{
                    height: Platform.isPad ? 80 : 40,
                    width: Platform.isPad ? 80 : 40,
                    borderRadius: Platform.isPad ? 80 / 2 : 40 / 2,
                  }}
                />
                <Text
                  style={{
                    marginLeft: widthToDp("2%"),
                    fontSize: widthToDp("3%"),
                    fontFamily: "Poppins-Regular",
                    width:
                      item.activity_message.includes("following") &&
                      !item.isFollowing
                        ? "59%"
                        : "86%",
                  }}
                >
                  {item.activity_message}
                </Text>
                {item.activity_message.includes("following") &&
                  !item.isFollowing && (
                    <TouchableOpacity
                      style={{
                        backgroundColor: "#ececec",
                        paddingHorizontal: 10,
                        paddingVertical: 5,
                        borderRadius: 8,
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                      onPress={() => this.followUser(item, index)}
                    >
                      <Text
                        style={{
                          fontSize: widthToDp("3.6%"),
                          fontWeight: "bold",
                        }}
                      >
                        Follow Back
                      </Text>
                    </TouchableOpacity>
                  )}
              </View>
            </TouchableOpacity>
          )}
        />
      )}

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
      <PushNotificationController navigation={this.props.navigation} />
    </SafeAreaProvider>
  );
}

export default (props) => {
  const insets = useSafeAreaInsets();
  return <NotificationScreen {...props} insets={insets} />;
};

import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import React from "react";
import { ActivityIndicator, FlatList, Image, Platform, ScrollView, StatusBar, Text, TouchableOpacity, View } from "react-native";
import RBSheet from "react-native-raw-bottom-sheet";
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import DataAccess from "../../components/DataAccess";
import Header from "../../components/Header";
import PushNotificationController from "../../components/PushNotificationController";
import { heightToDp, widthToDp } from "../../components/Responsive";
import Ionicons from "react-native-vector-icons/Ionicons"
import { Toast } from "native-base";

class FollowRequests extends React.Component {
  state = {
    followRequests: [],
    isLoading: false
  }

  componentDidMount = async () => {
    this.setState({ isLoading: true });
    let userId = await AsyncStorage.getItem("userId");
    let response = await axios.post(
      DataAccess.BaseUrl + DataAccess.followRequests,
      { toId: userId },
      DataAccess.AuthenticationHeader
    );
    console.log(response.data);
    if (response.data && response.data.length > 0) {
      this.setState({ followRequests: response.data });
    } else {
      this.setState({ followRequests: [] });
    }
    this.setState({ isLoading: false });
  };

  approveOrReject = async (item, index, type) => {
    this.RBSheet.open();
    console.log({
      fromId: userId,
      toId: item.id,
      appoval_status: type === "accept" ? 1 : 0
    })
    let userId = await AsyncStorage.getItem("userId");
    let response = await axios.post(
      DataAccess.BaseUrl + DataAccess.approveFollowRequest,
      {
        fromId: item.id,
        toId: userId,
        appoval_status: type === "accept" ? 1 : 0
      },
      DataAccess.AuthenticationHeader
    );
    console.warn(response.data);
    if (response.data.resp === "success") {
      let followRequests = this.state.followRequests;
      followRequests.splice(index, 1);
      this.setState({ followRequests });
      Toast.show({
        type: "success",
        text: type === "accept" ? item.name + " is now my follower." : "Rejected the follow request.",
        duration: 3000,
      });
    } else {
      Toast.show({
        type: "success",
        text: response.data.message,
        duration: 3000,
      });
      // this.setState({followingList: []});
    }
    this.RBSheet.close();
  }

  render = () => (
    <SafeAreaProvider style={{ flex: 1 }}>
      <View style={{ height: this.props.insets.top, backgroundColor: "#fff" }}>
        <StatusBar backgroundColor="#fff" barStyle={"dark-content"} animated />
      </View>
      <Header
        isHomeStackInnerPage
        isBackButton
        settings
        headerText={"Follow Requests"}
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
          data={this.state.followRequests}
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
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center"
                }}
              >
                <TouchableOpacity
                  onPress={() => this.approveOrReject(item, index, "accept")}
                >
                  <Ionicons
                    name={Platform.OS==='android' ? 'md-checkmark-outline' : 'ios-checkmark-outline'}
                    size={Platform.isPad ? 40 : 20}
                    color="#008000"
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  style={{paddingLeft: 10}}
                  onPress={() => this.approveOrReject(item, index, "reject")}
                >
                  <Ionicons
                    name={Platform.OS==='android' ? 'md-close-outline' : 'ios-close-outline'}
                    size={Platform.isPad ? 40 : 20}
                    color="#ff0000"
                  />
                </TouchableOpacity>
              </View>
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
  return <FollowRequests {...props} insets={insets} />;
};

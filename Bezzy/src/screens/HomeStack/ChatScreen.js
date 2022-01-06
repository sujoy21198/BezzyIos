import React from "react";
import {
  RefreshControl,
  Image,
  SafeAreaView,
  ScrollView,
  StatusBar,
  FlatList,
  KeyboardAvoidingView,
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Text,
  ActivityIndicator,
  Platform,
} from "react-native";
import BottomTab from "../../components/BottomTab";
import Header from "../../components/Header";
import {
  Container,
  Card,
  UserInfo,
  UserImgWrapper,
  UserImg,
  UserInfoText,
  UserName,
  PostTime,
  MessageText,
  TextSection,
  TextSectionAndroid,
} from "../../../styles/MessageStyles";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import DataAccess from "../../components/DataAccess";
import { heightToDp, widthToDp } from "../../components/Responsive";
import PushNotificationController from "../../components/PushNotificationController";
import RBSheet from "react-native-raw-bottom-sheet";
import RBSheet1 from "react-native-raw-bottom-sheet";
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { Toast } from "native-base";
import moment from "moment-timezone"
// const Messages = [

// ];

class ChatScreen extends React.Component {
  state = {
    isRefreshing: false,
    Messages: [],
    chatHeadToBeDeleted: "",
    deletingChatHead: false
  };

  componentDidMount() {
    this.unsubscribe = this.props.navigation.addListener("focus", () => {
      this.RBSheet.open();
      this.getChatList("")
    });
    this.RBSheet.open();
    this.getChatList("")
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  getChatList = async (type) => {
    let value = await AsyncStorage.getItem("userId");
    await axios
      .get(
        DataAccess.BaseUrl + DataAccess.chatList + "/" + value,
        DataAccess.AuthenticationHeader
      )
      .then((response) => {
        console.log(response.data.chat_notification_list);
        this.setState({ Messages: response.data.chat_notification_list });
      })
      .catch((error) => {
        console.log(error);
      });
    if (type === "pullRefresh") this.setState({ isRefreshing: false });
    this.RBSheet.close();
  };

  deleteChatHead = async() => {
    let userId = await AsyncStorage.getItem("userId");
    if(this.state.chatHeadToBeDeleted === "") return;
    // console.log(this.state.chatHeadToBeDeleted,userId)
    this.RBSheet1.close();
    this.setState({deletingChatHead: true})
    // this.RBSheet.open();
    await axios
      .post(
        DataAccess.BaseUrl + DataAccess.clearChat,
        {
          from_user_id: userId,
          to_user_id: this.state.chatHeadToBeDeleted.friendID
        },
        DataAccess.AuthenticationHeader
      )
      .then((res) => {
        console.log(res)
        if (res.data.status === "success") {
          this.setState({chatHeadToBeDeleted: ""});
          this.getChatList("");
          // this.RBSheet.close();
          Toast.show({
            type: "success",
            text: "All chats are cleared successfully.",
            duration: 3000,
          });
        }
      })
      .catch((err) => {
        this.setState({chatHeadToBeDeleted: ""});
        console.log(err);
        // this.RBSheet.close();
      });
      this.setState({deletingChatHead: false})
  }

  render = () => (
    <SafeAreaProvider style={{ flex: 1, backgroundColor: "#ececec" }}>
      <View style={{ height: this.props.insets.top, backgroundColor: "#fff" }}>
        <StatusBar backgroundColor="#fff" barStyle={"dark-content"} animated />
      </View>
      <Header
        isMessageScreen
        navigation={this.props.navigation}
        headerText="Messages"
      />
      {
        this.state.deletingChatHead ? 
        <View 
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center"
          }}
        >
          <ActivityIndicator size="large" color="#69abff" />
        </View> :
        <FlatList
          data={this.state.Messages}
          keyExtractor={(item) => item.id}
          refreshing={this.state.isRefreshing}
          onRefresh={() =>
            this.setState({ isRefreshing: true }, () =>
              this.getChatList("pullRefresh")
            )
          }
          renderItem={({ item }) =>
            !Platform.isPad && Platform.OS !== "android" ? (
              <TouchableOpacity
                onLongPress={() => {
                  this.setState({chatHeadToBeDeleted: item});
                  this.RBSheet1.open();
                }}
                onPress={() =>
                  this.props.navigation.navigate("InboxScreen", {
                    friendId: item.friendID,
                    friendImage: item.userimage,
                    friendName: item.username,
                  })
                }
              >
                <UserInfo>
                  <View>
                    <Image
                      source={{ uri: item.userimage }}
                      style={{
                        height: 40,
                        width: 40,
                        borderRadius: 40 / 2,
                        borderWidth: 1,
                        borderColor: "#69abff",
                        marginTop: heightToDp("1%"),
                        marginLeft: widthToDp("5%"),
                      }}
                    />
                    {item.user_active_status === "true" && (
                      <View
                        style={{
                          height: 13,
                          width: 13,
                          borderRadius: 13 / 2,
                          backgroundColor: "#008000",
                          left: widthToDp(Platform.OS === "ios" ? "15%" : "13%"),
                          top: widthToDp("-2%"),
                        }}
                      />
                    )}
                  </View>
                  {Platform.OS === "ios" ? (
                    <TextSection>
                      <UserInfoText>
                        <Text
                          style={{
                            width: "50%",
                            fontFamily: "ProximaNova-Black",
                          }}
                        >
                          {item.username}
                        </Text>
                        <PostTime>
                          {
                            Platform.OS === 'ios' ?
                            new Date(item.chat_date_time.split(" ")[0]+"T"+item.chat_date_time.split(" ")[1]+"Z").toLocaleTimeString("en-US", {timeZone: "america/chicago", year: 'numeric', month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit'}) :
                            moment(
                              new Date(item.chat_date_time.split(" ")[0]+"T"+item.chat_date_time.split(" ")[1]+"Z").toLocaleDateString("en-US", {timeZone: "america/chicago"}) + " " +
                              new Date(item.chat_date_time.split(" ")[0]+"T"+item.chat_date_time.split(" ")[1]+"Z").toLocaleTimeString("en-US", {timeZone: "america/chicago"})
                            ).tz("america/chicago").format('YYYY-MM-DD HH:mm A')
                          }</PostTime>
                      </UserInfoText>
                      <UserInfoText>
                        <Text
                          style={{ width: "90%", fontFamily: "Poppins-Regular" }}
                          numberOfLines={1}
                          ellipsizeMode="tail"
                        >
                          {item.chat_message}
                        </Text>
                        {item.unread_msg > 0 && (
                          <View
                            style={{
                              height: 20,
                              width: 20,
                              borderRadius: 20 / 2,
                              backgroundColor: "#69abff",
                              justifyContent: "center",
                              alignItems: "center",
                            }}
                          >
                            <Text
                              style={{
                                color: "#fff",
                                fontSize: widthToDp("3"),
                                fontFamily: "Poppins-Regular",
                              }}
                            >
                              {item.unread_msg}
                            </Text>
                          </View>
                        )}
                      </UserInfoText>
                    </TextSection>
                  ) : (
                    <TextSectionAndroid>
                      <UserInfoText>
                        <Text
                          style={{
                            width: "50%",
                            fontFamily: "ProximaNova-Black",
                          }}
                        >
                          {item.username}
                        </Text>
                        <PostTime>{
                            moment(
                              new Date(item.chat_date_time.split(" ")[0]+"T"+item.chat_date_time.split(" ")[1]+"Z").toLocaleDateString("en-US", {timeZone: "america/chicago"}) + " " +
                              new Date(item.chat_date_time.split(" ")[0]+"T"+item.chat_date_time.split(" ")[1]+"Z").toLocaleTimeString("en-US", {timeZone: "america/chicago"})
                            ).tz("America/Chicago").format('YYYY-MM-DD HH:mm A')
                          }</PostTime>
                      </UserInfoText>
                      <UserInfoText>
                        <Text
                          style={{ width: "90%", fontFamily: "Poppins-Regular" }}
                          numberOfLines={1}
                          ellipsizeMode="tail"
                        >
                          {item.chat_message}
                        </Text>
                        {item.unread_msg > 0 && (
                          <View
                            style={{
                              height: 20,
                              width: 20,
                              borderRadius: 20 / 2,
                              backgroundColor: "#69abff",
                              justifyContent: "center",
                              alignItems: "center",
                            }}
                          >
                            <Text
                              style={{
                                color: "#fff",
                                fontSize: widthToDp("3"),
                                fontFamily: "Poppins-Regular",
                              }}
                            >
                              {item.unread_msg}
                            </Text>
                          </View>
                        )}
                      </UserInfoText>
                    </TextSectionAndroid>
                  )}
                </UserInfo>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                }}
                onLongPress={() => {
                  this.setState({chatHeadToBeDeleted: item});
                  this.RBSheet1.open();
                }}
                onPress={() =>
                  this.props.navigation.reset({
                    index: 0,
                    routes: [
                      {
                        name: "InboxScreen",
                        params: {
                          friendId: item.friendID,
                          friendImage: item.userimage,
                          friendName: item.username,
                        },
                      },
                    ],
                  })
                }
              >
                <Image
                  source={{ uri: item.userimage }}
                  style={{
                    height: Platform.isPad ? 80 : 40,
                    width: Platform.isPad ? 80 : 40,
                    borderRadius: Platform.isPad ? 80 / 2 : 40 / 2,
                    borderWidth: 1,
                    borderColor: "#69abff",
                    marginTop: heightToDp("2%"),
                    marginLeft: widthToDp("2%"),
                  }}
                />
                {item.user_active_status === "true" && (
                  <View
                    style={{
                      height: Platform.isPad ? 20 : 10,
                      width: Platform.isPad ? 20 : 10,
                      borderRadius: Platform.isPad ? 20 / 2 : 10 / 2,
                      backgroundColor: "#008000",
                      position: "absolute",
                      left: Platform.isPad ? widthToDp("9%") : widthToDp("10%"),
                      top: Platform.isPad ? widthToDp("9%") : widthToDp("15%"),
                    }}
                  />
                )}
                <View
                  style={{
                    flexDirection: "column",
                    justifyContent: "flex-start",
                    marginLeft: widthToDp("3%"),
                    paddingTop: Platform.isPad
                      ? heightToDp("3%")
                      : heightToDp("4%"),
                    paddingBottom: heightToDp("1%"),
                    borderBottomWidth: 1,
                    borderBottomColor: "#cccccc",
                    width: Platform.isPad ? "85%" : "83%",
                  }}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                    }}
                  >
                    <Text
                      style={{
                        width: "57%",
                        fontSize: Platform.isPad
                          ? widthToDp("3%")
                          : widthToDp("3.8%"),
                        fontFamily: "ProximaNova-Black",
                      }}
                    >
                      {item.username}
                    </Text>
                    <Text
                      style={{
                        fontSize: Platform.isPad
                          ? widthToDp("2%")
                          : widthToDp("2.8%"),
                        color: "#666",
                        fontFamily: "Poppins-Regular",
                      }}
                    >
                      {
                        moment(
                          new Date(item.chat_date_time.split(" ")[0]+"T"+item.chat_date_time.split(" ")[1]+"Z").toLocaleDateString("en-US", {timeZone: "america/chicago"}) + " " +
                          new Date(item.chat_date_time.split(" ")[0]+"T"+item.chat_date_time.split(" ")[1]+"Z").toLocaleTimeString("en-US", {timeZone: "america/chicago"})
                        ).tz("America/Chicago").format('YYYY-MM-DD HH:mm A')
                      }
                    </Text>
                  </View>
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Text
                      style={{
                        width: "80%",
                        fontSize: Platform.isPad
                          ? widthToDp("2%")
                          : widthToDp("3%"),
                        fontFamily: "Poppins-Regular",
                      }}
                      numberOfLines={1}
                      ellipsizeMode="tail"
                    >
                      {item.chat_message}
                    </Text>
                    {item.unread_msg > 0 && (
                      <View
                        style={{
                          height: Platform.isPad ? 30 : 20,
                          width: Platform.isPad ? 30 : 20,
                          borderRadius: Platform.isPad ? 30 / 2 : 20 / 2,
                          backgroundColor: "#69abff",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <Text
                          style={{
                            color: "#fff",
                            fontSize: widthToDp("2%"),
                            fontFamily: "Poppins-Regular",
                          }}
                        >
                          {item.unread_msg}
                        </Text>
                      </View>
                    )}
                  </View>
                </View>
              </TouchableOpacity>
            )
          }
        />
      }
      <PushNotificationController navigation={this.props.navigation} />
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
            width: "14%",
            position: "absolute",
            top: "40%",
            alignSelf: "center",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#fff",
            borderRadius: 10,
          },
        }}
      >
        <ActivityIndicator size="large" color="#69abff" />
      </RBSheet>
      
      <RBSheet1
        ref={(ref) => {
          this.RBSheet1 = ref;
        }}
        height={heightToDp("6%")}
        // openDuration={250}
        customStyles={{
          container: {
            alignItems: "flex-start",
            justifyContent: "center",
            paddingLeft: widthToDp("5%"),
            backgroundColor: "#fff",
            borderRadius: 30,
          },
        }}
      >
        <TouchableOpacity
        onPress={this.deleteChatHead}
          // onPress={() => this.navigateToOtherScreen("block")}
        >
          <Text
            style={{
              fontSize: widthToDp("4.6%"),
              fontFamily: "Poppins-Regular",
            }}
          >
            Delete
          </Text>
        </TouchableOpacity>
      </RBSheet1>
      <BottomTab isChatFocused navigation={this.props.navigation} />
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  row: {
    flexDirection: "row",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  avatar: {
    borderRadius: 20,
    width: 40,
    height: 40,
    marginRight: 10,
  },
  rowText: {
    flex: 1,
  },
  message: {
    fontSize: 18,
  },
  sender: {
    paddingRight: 10,
  },
  footer: {
    flexDirection: "row",
    backgroundColor: "#eee",
  },
  input: {
    paddingHorizontal: 20,
    fontSize: 18,
    flex: 1,
  },
  send: {
    alignSelf: "center",
    color: "lightseagreen",
    fontSize: 16,
    padding: 20,
  },
});

export default (props) => {
  const insets = useSafeAreaInsets();
  return <ChatScreen {...props} insets={insets} />;
};

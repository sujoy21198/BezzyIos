import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import React from "react";
import {
  ActivityIndicator,
  FlatList,
  Linking,
  Platform,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import RBSheet from "react-native-raw-bottom-sheet";
import Icon from "react-native-vector-icons/FontAwesome5";
import PlayIcon from "react-native-vector-icons/AntDesign";
import BottomTab from "../../components/BottomTab";
import ButtonComponent from "../../components/ButtonComponent";
import DataAccess from "../../components/DataAccess";
import Header from "../../components/Header";
import { heightToDp, widthToDp } from "../../components/Responsive";
import PushNotificationController from "../../components/PushNotificationController";
import { Image } from "react-native-elements";
import LinearGradient from "react-native-linear-gradient";
import ShimmerPlaceHolder from "react-native-shimmer-placeholder";
import { Toast } from "native-base";
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

class ProfileScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isPostsFocused: this.props.route.params.imageDeleted ? false : true,
      isShareFocused: this.props.route.params.imageDeleted ? true : false,
      numberOfFollowers: 0,
      numberOfFollowings: 1,
      numberOfPosts: 6,
      isLoading: true,
      isRefreshing: false,
      userPosts: [],
      userDetails: {},
      otherProfile: false,
      friendsProfileId: "",
      sharePost: [],
      links: [],
      isLoadingNextPostPage: false,
      isLoadingNextSharePage: false,
      postPage: 1,
      sharePage: 1,
      sharedMedia: [],
      newPosts: ["new"],
      newShares: ["new"],
      sendFollowRequest: "Send Follow Request"
    };
    this.state.friendsProfileId = this.props.route.params.profile_id;
    if (this.state.friendsProfileId != "") {
      this.state.otherProfile = true;
    }
    //alert(this.state.friendsProfileId)
  }

  onPostTabPress = () => {
    this.setState({ isPostsFocused: true, isShareFocused: false });
  };

  onShareTabPress = () =>
    this.setState({ isShareFocused: true, isPostsFocused: false });

  componentDidMount() {
    this.setState({
      postPage: 1,
      sharePage: 1,
      newPosts: ["new"],
      newShares: ["new"],
    });
    console.log("Page on load: ", this.state.postPage, this.state.sharePage);
    this.unsubscribe = this.props.navigation.addListener("focus", () => {
      this.setState({
        postPage: 1,
        sharePage: 1,
        newPosts: ["new"],
        newShares: ["new"],
      });
      this.RBSheet.open();
      this.setState({ isLoading: true });
      setTimeout(() => {
        this.getProfileData();
        this.getSharedMediaData();
      }, 2000);
    });
    this.RBSheet.open();
    this.setState({ isLoading: true });
    setTimeout(() => {
      this.getProfileData();
      this.getSharedMediaData();
    }, 2000);
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  getSharedMediaData = async () => {
    let value = await AsyncStorage.getItem("userId");
    var sharedMedia = [];
    if (this.state.otherProfile === false) {
      await axios
        .post(
          DataAccess.BaseUrl + DataAccess.getSharePostData,
          {
            profile_id: value,
            page: this.state.sharePage,
          },
          DataAccess.AuthenticationHeader
        )
        .then((response) => {
          if (response.data.user_all_posts.length > 0) {
            response.data.user_all_posts[
              response.data.user_all_posts.length - 1
            ].map((item, index) => {
              if (JSON.stringify(item) == "null") {
                response.data.user_all_posts[
                  response.data.user_all_posts.length - 1
                ].splice(index, 1);
              }
            });
            response.data.user_all_posts[
              response.data.user_all_posts.length - 1
            ].forEach((item) => {
              if (item.post_type !== "livestreaming") {
                sharedMedia.push(item);
              }
            });
          } else {
            this.state.newShares = [];
          }

          this.setState({ sharePost: sharedMedia });
        })
        .catch(function (error) {
          // console.log(
          //   error + " own share data"
          // );
        });
    } else {
      await axios
        .post(
          DataAccess.BaseUrl + DataAccess.getSharePostData,
          {
            profile_id: this.state.friendsProfileId,
            page: this.state.sharePage,
          },
          DataAccess.AuthenticationHeader
        )
        .then((response) => {
          if (response.data.user_all_posts.length > 0) {
            response.data.user_all_posts[
              response.data.user_all_posts.length - 1
            ].map((item, index) => {
              // console.warn(index, JSON.stringify(item));
              if (item == "null") {
                response.data.user_all_posts[
                  response.data.user_all_posts.length - 1
                ].splice(index, 1);
              }
            });
            response.data.user_all_posts[
              response.data.user_all_posts.length - 1
            ].forEach((item) => {
              if (item.post_type !== "livestreaming") {
                sharedMedia.push(item);
              }
            });
          } else {
            this.state.newShares = [];
          }

          this.setState({ sharePost: sharedMedia });
        })
        .catch(function (error) {
          // console.log(
          //   error + " " + DataAccess.BaseUrl + DataAccess.getSharePostData
          // );
        });
    }

    // let sharePost = this.state.sharePost;
    // if(sharePost.length > 0) {
    //   for(let i=0; i<sharePost.length; i++) {
    //     if(i < (sharePost.length - 1) && sharePost[i] && sharePost[i+1] && sharePost[i].post_id === sharePost[i+1].post_id) {
    //       sharePost.splice(i+1, 1);
    //     }
    //   }
    // }
    // this.setState({sharePost});
    console.log("Shares =>  ", this.state.sharePost);
  };

  detectUrls = (text) => {
    var urlRegex = /(((https?:\/\/)|(www\.))[^\s]+)/g;
    if (text) {
      let linksAvailable = text.match(urlRegex);
      this.setState({ links: linksAvailable });
    }
  };

  getProfileData = async () => {
    var userDetails = {},
      userPosts = [];
    let userId = await AsyncStorage.getItem("userId");
    if (this.state.otherProfile === true) {
      // console.log(this.state.friendsProfileId);
      await axios
        .post(
          DataAccess.BaseUrl + DataAccess.getProfileDetails,
          {
            profile_id: this.state.friendsProfileId,
            page: this.state.postPage,
          },
          DataAccess.AuthenticationHeader
        )
        .then(async (res) => {
          // console.warn(res);
          userDetails = res.data.usedetails;

          let res1 = await axios.post(
            DataAccess.BaseUrl + DataAccess.userFollowingList,
            { loguser_id: userId },
            DataAccess.AuthenticationHeader
          );
          console.warn(res1);
          if (res1.data.resp === "success") {
            if (
              res1.data.following_user_list &&
              res1.data.following_user_list.length > 0 &&
              res1.data.following_user_list.findIndex(
                (item) =>
                  Number(item.following_user_id) ===
                  Number(this.state.friendsProfileId)
              ) !== -1
            ) {
              userDetails.iFollowFriend = true;
            }
          }

          let res2 = await axios.post(
            DataAccess.BaseUrl + DataAccess.userFollowingList,
            { loguser_id: this.state.friendsProfileId },
            DataAccess.AuthenticationHeader
          );
          console.warn(res2);
          if (res2.data.resp === "success") {
            if (
              res2.data.following_user_list &&
              res2.data.following_user_list.length > 0 &&
              res2.data.following_user_list.findIndex(
                (item) => Number(item.following_user_id) === Number(userId)
              ) !== -1
            ) {
              userDetails.friendFollowMe = true;
            }
          }

          if(
            !userDetails.iFollowFriend &&
            userDetails.friendFollowMe
          ) {
            this.setState({sendFollowRequest : "Send Follow Back Request"})
          } else {
            this.setState({sendFollowRequest : "Send Follow Request"})
          }

          if (res.data.user_all_posts.length > 0) {
            res.data.user_all_posts[res.data.user_all_posts.length - 1].map(
              (item, index) => {
                if (JSON.stringify(item) == "null") {
                  res.data.user_all_posts[
                    res.data.user_all_posts.length - 1
                  ].splice(index, 1);
                }
              }
            );

            res.data.user_all_posts[res.data.user_all_posts.length - 1].forEach(
              (item) => {
                if (item.post_type !== "livestreaming") {
                  userPosts.push(item);
                }
              }
            );
          } else {
            this.state.newPosts = [];
          }
        })
        .catch((err) => {
          console.warn(err);
          // this.state.newPosts = []
        });

      this.setState({ userDetails, userPosts }, () =>
        this.detectUrls(this.state.userDetails.bio)
      );
      this.setState({ isLoading: false, isRefreshing: false });
      this.RBSheet.close();
    } else {
      await axios
        .post(
          DataAccess.BaseUrl + DataAccess.getProfileDetails,
          {
            profile_id: userId,
            page: this.state.postPage,
          },
          DataAccess.AuthenticationHeader
        )
        .then((res) => {
          // console.log(res.data)
          userDetails = res.data.usedetails;
          if (res.data.user_all_posts.length > 0) {
            res.data.user_all_posts[res.data.user_all_posts.length - 1].map(
              (item, index) => {
                if (JSON.stringify(item) == "null") {
                  res.data.user_all_posts[
                    res.data.user_all_posts.length - 1
                  ].splice(index, 1);
                }
              }
            );

            res.data.user_all_posts[res.data.user_all_posts.length - 1].forEach(
              (item) => {
                if (item.post_type !== "livestreaming") {
                  userPosts.push(item);
                }
              }
            );
          } else {
            this.state.newPosts = [];
          }
        })
        .catch((err) => {
          console.log(err);
          // this.state.newPosts = [];
        });
      this.setState({ userDetails, userPosts }, () =>
        this.detectUrls(this.state.userDetails.bio)
      );
      await AsyncStorage.setItem(
        "userDetails",
        JSON.stringify(this.state.userDetails)
      );
      this.setState({ isLoading: false, isRefreshing: false });
      this.RBSheet.close();
    }
    console.log(this.state.userDetails, "userdetails");
  };

  loadMorePost = () => {
    this.setState(
      { isLoadingNextPostPage: true, postPage: this.state.postPage + 1 },
      async () => {
        console.log("Post next ", this.state.postPage);
        let userPosts = this.state.userPosts;
        let userId = await AsyncStorage.getItem("userId");
        if (this.state.otherProfile === true) {
          // console.log(this.state.friendsProfileId);
          await axios
            .post(
              DataAccess.BaseUrl + DataAccess.getProfileDetails,
              {
                profile_id: this.state.friendsProfileId,
                page: this.state.postPage,
              },
              DataAccess.AuthenticationHeader
            )
            .then((res) => {
              // console.warn(res);
              // userDetails = res.data.usedetails;
              console.log("Posts => ", res.data.user_all_posts);
              if (res.data.user_all_posts.length > 0) {
                res.data.user_all_posts[res.data.user_all_posts.length - 1].map(
                  (item, index) => {
                    if (JSON.stringify(item) == "null") {
                      res.data.user_all_posts[
                        res.data.user_all_posts.length - 1
                      ].splice(index, 1);
                    }
                  }
                );
                res.data.user_all_posts[
                  res.data.user_all_posts.length - 1
                ].forEach((item) => {
                  if (
                    userPosts.findIndex(
                      (element) => element.post_id === item.post_id
                    ) !== -1
                  ) {
                    console.log("post present");
                  } else {
                    if (item.post_type !== "livestreaming") {
                      userPosts.push(item);
                    }
                  }
                });
              } else {
                this.state.newPosts = [];
              }
            })
            .catch((err) => {
              console.warn(err);
              // this.state.newPosts = [];
            });
          this.setState({ userPosts });
          // this.RBSheet.close();
        } else {
          await axios
            .post(
              DataAccess.BaseUrl + DataAccess.getProfileDetails,
              {
                profile_id: userId,
                page: this.state.postPage,
              },
              DataAccess.AuthenticationHeader
            )
            .then((res) => {
              // console.log(res.data)
              // userDetails = res.data.usedetails;
              if (res.data.user_all_posts.length > 0) {
                res.data.user_all_posts[res.data.user_all_posts.length - 1].map(
                  (item, index) => {
                    if (JSON.stringify(item) == "null") {
                      res.data.user_all_posts[
                        res.data.user_all_posts.length - 1
                      ].splice(index, 1);
                    }
                  }
                );
                res.data.user_all_posts[
                  res.data.user_all_posts.length - 1
                ].forEach((item) => {
                  if (
                    userPosts.findIndex(
                      (element) => element.post_id === item.post_id
                    ) !== -1
                  ) {
                    console.log("post present");
                  } else {
                    if (item.post_type !== "livestreaming") {
                      userPosts.push(item);
                    }
                  }
                });
              } else {
                this.state.newPosts = [];
              }
            })
            .catch((err) => console.log(err));
          this.setState({ userPosts });
          // this.RBSheet.close();
        }
      }
    );
    this.setState({ isLoadingNextPostPage: false });
    // console.log(this.state.userPosts);
  };

  loadMoreShare = () => {
    this.setState(
      {
        isLoadingNextSharePage: true,
        sharePage: this.state.sharePage + 1,
      },
      async () => {
        console.log("Share next ", this.state.sharePage);
        let value = await AsyncStorage.getItem("userId");
        var sharedMedia = this.state.sharePost;
        if (this.state.otherProfile === false) {
          await axios
            .post(
              DataAccess.BaseUrl + DataAccess.getSharePostData,
              {
                profile_id: value,
                page: this.state.sharePage,
              },
              DataAccess.AuthenticationHeader
            )
            .then((response) => {
              // response.data.user_all_posts[response.data.user_all_posts.length - 1] &&
              // response.data.user_all_posts[response.data.user_all_posts.length - 1].length > 0 &&
              // sharedMedia.length > 0 &&
              // response.data.user_all_posts[response.data.user_all_posts.length - 1].map(item => {
              //   if(item && item.post_id) {
              //     if(sharedMedia.findIndex(element => element.post_id === item.post_id) !== -1) {
              //       console.log("post present");
              //     } else {
              //       sharedMedia.push(item);
              //     }
              //   }

              // })
              console.log("Shares => ", response.data.user_all_posts);
              if (response.data.user_all_posts.length > 0) {
                response.data.user_all_posts[
                  response.data.user_all_posts.length - 1
                ].map((item, index) => {
                  if (
                    JSON.stringify(item) == "null" ||
                    (JSON.stringify(item) != "null" &&
                      item.post_type === "livestreaming")
                  ) {
                    response.data.user_all_posts[
                      response.data.user_all_posts.length - 1
                    ].splice(index, 1);
                  }
                });
                sharedMedia = [
                  ...sharedMedia,
                  ...response.data.user_all_posts[
                    response.data.user_all_posts.length - 1
                  ],
                ];
              } else {
                this.state.newShares = [];
              }

              this.setState({ sharePost: sharedMedia });
            })
            .catch(function (error) {
              console.log(
                error + " " + DataAccess.BaseUrl + DataAccess.getSharePostData
              );
            });
        } else {
          await axios
            .post(
              DataAccess.BaseUrl + DataAccess.getSharePostData,
              {
                profile_id: this.state.friendsProfileId,
                page: this.state.sharePage,
              },
              DataAccess.AuthenticationHeader
            )
            .then((response) => {
              // response.data.user_all_posts[response.data.user_all_posts.length - 1] &&
              // response.data.user_all_posts[response.data.user_all_posts.length - 1].length > 0 &&
              // sharedMedia.length > 0 &&
              // response.data.user_all_posts[response.data.user_all_posts.length - 1].map(item => {
              //   if(item && item.post_id) {
              //     if(sharedMedia.findIndex(element => element.post_id === item.post_id) !== -1) {
              //       console.log("post present");
              //     } else {
              //       sharedMedia.push(item);
              //     }
              //   }
              // })
              if (response.data.user_all_posts.length > 0) {
                response.data.user_all_posts[
                  response.data.user_all_posts.length - 1
                ].map((item, index) => {
                  if (
                    JSON.stringify(item) == "null" ||
                    (JSON.stringify(item) != "null" &&
                      item.post_type === "livestreaming")
                  ) {
                    response.data.user_all_posts[
                      response.data.user_all_posts.length - 1
                    ].splice(index, 1);
                  }
                });
                sharedMedia = [
                  ...sharedMedia,
                  ...response.data.user_all_posts[
                    response.data.user_all_posts.length - 1
                  ],
                ];
              } else {
                this.state.newShares = [];
              }

              this.setState({ sharePost: sharedMedia });
            })
            .catch(function (error) {
              console.log(
                error + " " + DataAccess.BaseUrl + DataAccess.getSharePostData
              );
            });
        }
      }
    );

    // let sharePost = this.state.sharePost;
    // if(sharePost.length > 0) {
    //   for(let i=0; i<sharePost.length; i++) {
    //     if(i < (sharePost.length - 1) && sharePost[i] && sharePost[i+1] && sharePost[i].post_id === sharePost[i+1].post_id) {
    //       sharePost.splice(i+1, 1);
    //     }
    //   }
    // }
    // this.setState({sharePost});

    this.setState({ isLoadingNextSharePage: false });
  };

  followUser = async () => {
    this.RBSheet.open();
    let userId = await AsyncStorage.getItem("userId");
    let response;
    if (
      !this.state.userDetails.iFollowFriend &&
      this.state.userDetails.friendFollowMe
    ) {
      response = await axios.post(
        DataAccess.BaseUrl + DataAccess.followBack,
        {
          login_userID: userId,
          userID: this.state.friendsProfileId,
        },
        DataAccess.AuthenticationHeader
      );
    } else {
      response = await axios.post(
        DataAccess.BaseUrl + DataAccess.followUser,
        {
          user_one_id: userId,
          user_two_id: this.state.friendsProfileId,
        },
        DataAccess.AuthenticationHeader
      );
    }
    // console.log(response.data)
    if (response.data.status === "success") {
      this.state.userDetails.iFollowFriend = true;
      Toast.show({
        type: "success",
        text:
          !this.state.userDetails.iFollowFriend &&
          this.state.userDetails.friendFollowMe
            ? response.data.message
            : "Follow successful",
        duration: 3000,
      });
    } else {
      Toast.show({
        type: "danger",
        text: response.data.message,
        duration: 3000,
      });
      // this.setState({followingList: []});
    }
    this.RBSheet.close();
  };

  sendFollowRequest = async () => {
    this.RBSheet.open();
    let userId = await AsyncStorage.getItem("userId");
    await axios.post(
      DataAccess.BaseUrl + DataAccess.requestFollow,
      {
        fromId: userId,
        toId: this.state.friendsProfileId,
      },
      DataAccess.AuthenticationHeader
    ).then(res => {
      console.log(res.data);
      if (res.data.resp === "success") {
        this.setState({sendFollowRequest: "Requested to follow"});
        Toast.show({
          type: "success",
          text: "Requested to follow.",
          duration: 3000,
        });
      } else {
        Toast.show({
          type: "danger",
          text: res.data.message,
          duration: 3000,
        });
        // this.setState({followingList: []});
      }
    }).catch(err => {
      console.log(err);
    })
    this.RBSheet.close();
  };

  render = () => (
    <SafeAreaProvider style={{ flex: 1, backgroundColor: "#ececec" }}>
      <View style={{ height: this.props.insets.top, backgroundColor: "#fff" }}>
        <StatusBar backgroundColor="#fff" barStyle={"dark-content"} animated />
      </View>
      <Header
        isHomeStackInnerPage
        isProfileFocused={!this.state.otherProfile}
        block={true}
        resetPage={() => this.setState({newPosts: []})}
        isBackButton={this.state.otherProfile}
        headerText={
          this.state.otherProfile
            ? this.state.userDetails.get_name || "View Profile"
            : "Profile"
        }
        navigation={this.props.navigation}
      />

      {!this.state.isLoading && (
        <ScrollView
          refreshControl={
            <RefreshControl
              refreshing={this.state.isRefreshing}
              onRefresh={() =>
                this.setState(
                  { isRefreshing: true, postPage: 1, sharePage: 1 },
                  () => {
                    this.getProfileData();
                    this.getSharedMediaData();
                  }
                )
              }
            />
          }
          style={{
            flex: 1,
            paddingVertical: heightToDp("1%"),
          }}
        >
          <View
            style={{
              paddingVertical: heightToDp("1%"),
            }}
          >
            {Object.keys(this.state.userDetails).length > 0 && (
              <View
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Image
                  source={{ uri: this.state.userDetails.profile_pic }}
                  transition={false}
                  PlaceholderContent={
                    <ShimmerPlaceHolder
                      LinearGradient={LinearGradient}
                      style={{
                        width: "100%",
                        height: "100%",
                        borderRadius: 20,
                      }}
                    />
                  }
                  placeholderStyle={{ backgroundColor: "#fff" }}
                  style={{
                    height: heightToDp("10%"),
                    width: widthToDp("20%"),
                    borderRadius: 20,
                    borderWidth: 1,
                    borderColor: "#69abff",
                  }}
                />
                <Text
                  style={{
                    color: "#007dfe",
                    marginTop: heightToDp("1.5%"),
                    marginBottom: heightToDp("0.5%"),
                    fontSize: widthToDp("4.5%"),
                    fontFamily: "Poppins-Regular",
                  }}
                >
                  {this.state.userDetails.get_name}
                </Text>
                {((typeof this.state.userDetails.iFollowFriend !== undefined &&
                  typeof this.state.userDetails.friendFollowMe !== undefined &&
                  !this.state.userDetails.iFollowFriend &&
                  !this.state.userDetails.friendFollowMe) ||
                  (!this.state.userDetails.iFollowFriend &&
                    this.state.userDetails.friendFollowMe)) &&
                  this.state.otherProfile && (
                    <TouchableOpacity
                      style={{
                        backgroundColor: "#ffffff",
                        borderRadius: 8,
                        padding: 5,
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                      onPress={this.state.userDetails.private_account === "1" ? this.sendFollowRequest : this.followUser}
                    >
                      <Text
                        style={{
                          fontSize: widthToDp("3.6%"),
                          fontWeight: "bold",
                        }}
                      >
                        {!this.state.userDetails.iFollowFriend &&
                        this.state.userDetails.friendFollowMe
                          ? this.state.userDetails.private_account === "1" ? this.state.sendFollowRequest : "FOLLOW BACK"
                          : this.state.userDetails.private_account === "1" ? this.state.sendFollowRequest : "FOLLOW"}
                      </Text>
                    </TouchableOpacity>
                  )}
                {this.state.userDetails.bio && (
                  <Text
                    style={{
                      paddingHorizontal: widthToDp("2%"),
                      fontSize: widthToDp("3.5%"),
                      fontFamily: "Poppins-Regular",
                      color:
                        this.state.links && this.state.links.length > 0
                          ? "#777"
                          : "#1b1b1b",
                    }}
                  >
                    {this.state.userDetails.bio !== "" ||
                    this.state.userDetails.bio !== undefined
                      ? this.state.userDetails.bio
                      : "No bio yet"}
                  </Text>
                )}
                {this.state.links && this.state.links.length > 0 && (
                  <FlatList
                    data={this.state.links}
                    contentContainerStyle={{
                      paddingVertical: "2%",
                    }}
                    ItemSeparatorComponent={() => (
                      <View style={{ height: "1%" }} />
                    )}
                    renderItem={({ item, index }) => (
                      <TouchableOpacity
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          paddingHorizontal: "2%",
                          width: "98%",
                        }}
                        onPress={() =>
                          Linking.openURL(
                            item.startsWith("www") ? "https://" + item : item
                          )
                        }
                      >
                        <Icon name="link" size={10} color="#1b1b1b" />
                        <Text
                          style={{
                            paddingHorizontal: widthToDp("2%"),
                            fontSize: widthToDp("3.3%"),
                            fontFamily: "Poppins-Regular",
                            color: "#1b1b1b",
                          }}
                        >
                          {item}
                        </Text>
                      </TouchableOpacity>
                    )}
                  />
                )}
              </View>
            )}
          </View>
          {this.state.otherProfile === false ? (
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                paddingHorizontal: widthToDp("10%"),
                paddingBottom: heightToDp("0.5%"),
              }}
            >
              <TouchableOpacity
                style={{
                  alignItems: "center",
                }}
                activeOpacity={0.7}
                disabled={
                  Object.keys(this.state.userDetails).length > 0 &&
                  this.state.userDetails.following === 0
                }
                onPress={() =>{
                  this.setState({newPosts: []});
                  this.props.navigation.navigate("FollowingScreen", {
                    user: this.state.userDetails.get_name,
                  })
                }}
              >
                <Text
                  style={{
                    fontSize: widthToDp("3.8%"),
                    fontFamily: "Poppins-Regular",
                    color: "#808080",
                  }}
                >
                  {Object.keys(this.state.userDetails).length > 0
                    ? this.state.userDetails.following
                    : 0}
                </Text>
                <Text
                  style={{
                    fontSize: widthToDp("3.8%"),
                    fontFamily: "Poppins-Regular",
                    color: "#808080",
                  }}
                >
                  Following
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  alignItems: "center",
                }}
                activeOpacity={0.7}
                disabled={
                  Object.keys(this.state.userDetails).length > 0 &&
                  this.state.userDetails.followers === 0
                }
                onPress={() =>{
                  this.setState({newPosts: []});
                  this.props.navigation.navigate("FollowerScreen", {
                    user: this.state.userDetails.get_name,
                  })
                }}
              >
                <Text
                  style={{
                    fontSize: widthToDp("3.8%"),
                    fontFamily: "Poppins-Regular",
                    color: "#808080",
                  }}
                >
                  {Object.keys(this.state.userDetails).length > 0
                    ? this.state.userDetails.followers
                    : 0}
                </Text>
                <Text
                  style={{
                    fontSize: widthToDp("3.8%"),
                    fontFamily: "Poppins-Regular",
                    color: "#808080",
                  }}
                >
                  Followers
                </Text>
              </TouchableOpacity>
              <View
                style={{
                  alignItems: "center",
                }}
              >
                <Text
                  style={{
                    fontSize: widthToDp("3.8%"),
                    fontFamily: "Poppins-Regular",
                    color: "#808080",
                  }}
                >
                  {Object.keys(this.state.userDetails).length > 0
                    ? this.state.userDetails.number_of_post
                    : 0}
                </Text>
                <Text
                  style={{
                    fontSize: widthToDp("3.8%"),
                    fontFamily: "Poppins-Regular",
                    color: "#808080",
                  }}
                >
                  Posts
                </Text>
              </View>
            </View>
          ) : (
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                paddingHorizontal: widthToDp("10%"),
                paddingVertical: heightToDp("0.5%"),
              }}
            >
              <View
                style={{
                  alignItems: "center",
                }}
              >
                <Text
                  style={{
                    fontSize: widthToDp("3.8%"),
                    fontFamily: "Poppins-Regular",
                    color: "#808080",
                  }}
                >
                  {Object.keys(this.state.userDetails).length > 0
                    ? this.state.userDetails.following
                    : 0}
                </Text>
                <Text
                  style={{
                    fontSize: widthToDp("3.8%"),
                    fontFamily: "Poppins-Regular",
                    color: "#808080",
                  }}
                >
                  Following
                </Text>
              </View>
              <View
                style={{
                  alignItems: "center",
                }}
              >
                <Text
                  style={{
                    fontSize: widthToDp("3.8%"),
                    fontFamily: "Poppins-Regular",
                    color: "#808080",
                  }}
                >
                  {Object.keys(this.state.userDetails).length > 0
                    ? this.state.userDetails.followers
                    : 0}
                </Text>
                <Text
                  style={{
                    fontSize: widthToDp("3.8%"),
                    fontFamily: "Poppins-Regular",
                    color: "#808080",
                  }}
                >
                  Followers
                </Text>
              </View>
              <View
                style={{
                  alignItems: "center",
                }}
              >
                <Text
                  style={{
                    fontSize: widthToDp("3.8%"),
                    fontFamily: "Poppins-Regular",
                    color: "#808080",
                  }}
                >
                  {Object.keys(this.state.userDetails).length > 0
                    ? this.state.userDetails.number_of_post
                    : 0}
                </Text>
                <Text
                  style={{
                    fontSize: widthToDp("3.8%"),
                    fontFamily: "Poppins-Regular",
                    color: "#808080",
                  }}
                >
                  Posts
                </Text>
              </View>
            </View>
          )}
          <View
            style={{
              flexDirection: 'row',
              justifyContent: !(
                Object.keys(this.state.userDetails).length > 0 &&
                Number(this.state.userDetails.private_account) === 1
              ) ? "center" : "space-between",
              alignItems: "center",
              padding: heightToDp("1%"),
            }}
          >
            {this.state.otherProfile === true ? null : (
              <ButtonComponent
                onPressButton={() =>{
                  this.setState({newPosts: []});
                  this.props.navigation.navigate("EditProfileScreen")
                }}
                buttonText={"Edit Profile"}
                editProfile={true}
                disabled={Object.keys(this.state.userDetails).length == 0}
              />
            )}
            {this.state.otherProfile === true ? null : (
              Object.keys(this.state.userDetails).length > 0 &&
              Number(this.state.userDetails.private_account) === 1 &&
              <ButtonComponent
                onPressButton={() =>{
                  this.setState({newPosts: []});
                  this.props.navigation.navigate("FollowRequests")
                }}
                buttonText={"Follow Requests"}
                editProfile={true}
                disabled={Object.keys(this.state.userDetails).length == 0}
              />
            )}
          </View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              paddingVertical: heightToDp("0.5%"),
              paddingHorizontal: widthToDp("1%"),
            }}
          >
            <TouchableOpacity
              style={{
                width: widthToDp("48.8%"),
                height: heightToDp("5%"),
                justifyContent: "center",
                backgroundColor: "#fff",
                alignItems: "center",
              }}
              activeOpacity={0.7}
              onPress={this.onPostTabPress}
            >
              <Image
                source={
                  this.state.isPostsFocused
                    ? require("../../../assets/posts.png")
                    : require("../../../assets/default_posts.png")
                }
                transition={false}
                PlaceholderContent={
                  <ShimmerPlaceHolder
                    LinearGradient={LinearGradient}
                    style={{
                      width: "100%",
                      height: "100%",
                    }}
                  />
                }
                placeholderStyle={{ backgroundColor: "#fff" }}
                resizeMode="contain"
                style={{
                  height: Platform.isPad ? 56 : 28,
                  width: Platform.isPad ? 56 : 28,
                }}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                width: widthToDp("48.8%"),
                height: heightToDp("5%"),
                justifyContent: "center",
                backgroundColor: "#fff",
                alignItems: "center",
              }}
              activeOpacity={0.7}
              onPress={this.onShareTabPress}
            >
              <Icon
                name={"share"}
                size={Platform.isPad ? 40 : 24}
                color={this.state.isShareFocused ? "#69abff" : "#666"}
              />
            </TouchableOpacity>
          </View>
          {this.state.isPostsFocused && (
            <View
              style={{
                marginBottom: this.state.otherProfile
                  ? heightToDp("2%")
                  : heightToDp("10%"),
              }}
            >
              <FlatList
                data={this.state.userPosts}
                extraData={this.state.userPosts}
                contentContainerStyle={{
                  paddingHorizontal: widthToDp("2%"),
                }}
                onEndReached={() => {
                  if (this.state.newPosts.length === 0) return;
                  this.setState(
                    { isLoadingNextPostPage: true },
                    this.loadMorePost
                  );
                }}
                onEndReachedThreshold={0}
                ListFooterComponent={
                  this.state.isLoadingNextSharePage && (
                    <ActivityIndicator
                      style={{
                        alignSelf: "center",
                        paddingTop: heightToDp("2%"),
                      }}
                      color="#69abff"
                      size="small"
                    />
                  )
                }
                numColumns={2}
                keyExtractor={({ item, index }) => index}
                ItemSeparatorComponent={() => (
                  <View style={{ height: heightToDp("0.3%") }} />
                )}
                renderItem={({ item, index }) => (
                  <>
                    {item.post_type === "video" ? (
                      <View>
                        <TouchableOpacity
                          onPress={() =>{
                            this.setState({newPosts: []}, () => {
                              this.props.navigation.navigate(
                                "ImagePreviewScreen",
                                {
                                  image: item,
                                  otherProfile: this.state.otherProfile,
                                }
                              )
                            })
                          }}
                        >
                          <Image
                            source={{ uri: item.post_url }}
                            style={{
                              height: heightToDp("20%"),
                              marginBottom: heightToDp("0.5%"),
                              width: widthToDp("47.5%"),
                              borderRadius: 5,
                            }}
                            transition={false}
                            PlaceholderContent={
                              <ShimmerPlaceHolder
                                style={{
                                  width: "100%",
                                  height: "100%",
                                  borderRadius: 5,
                                  borderWidth: 1,
                                  borderColor: "#69abff",
                                }}
                                LinearGradient={LinearGradient}
                              />
                            }
                            placeholderStyle={{ backgroundColor: "#fff" }}
                            key={index}
                          />
                          <PlayIcon
                            name={"playcircleo"}
                            size={25}
                            style={{
                              position: "absolute",
                              top: heightToDp("8%"),
                              alignSelf: "center",
                            }}
                          />
                        </TouchableOpacity>
                      </View>
                    ) : (
                      <TouchableOpacity
                        onPress={() =>{
                          this.setState({newPosts: []}, () => {
                            this.props.navigation.navigate("ImagePreviewScreen", {
                              image: item,
                              otherProfile: this.state.otherProfile,
                            })
                          })
                        }}
                      >
                        <Image
                          source={{
                            uri: item.post_url
                              .split("?src=")[1]
                              .split("&w=")[0],
                          }}
                          // resizeMode="contain"
                          transition={false}
                          PlaceholderContent={
                            <ShimmerPlaceHolder
                              style={{
                                width: "100%",
                                height: "100%",
                                borderRadius: 5,
                                borderWidth: 1,
                                borderColor: "#69abff",
                              }}
                              LinearGradient={LinearGradient}
                            />
                          }
                          placeholderStyle={{ backgroundColor: "#fff" }}
                          style={{
                            height: heightToDp("20%"),
                            marginBottom: heightToDp("0.5%"),
                            width: widthToDp("47.5%"),
                            borderRadius: 5,
                          }}
                          key={index}
                        />
                      </TouchableOpacity>
                    )}

                    {item && item.post_date && item.post_time && (
                      <View
                        style={{
                          position: "absolute",
                          bottom: heightToDp("1.2%"),
                          left: widthToDp(`${index % 2 === 0 ? 1.5 : 49}%`),
                        }}
                      >
                        <Text
                          style={{
                            color: "#db472b",
                            fontSize: widthToDp("3%"),
                            fontFamily: "Poppins-Regular",
                          }}
                        >
                          {item.post_date + " " + item.post_time}
                        </Text>
                      </View>
                    )}
                    {this.state.userPosts.length > 0 && index % 2 === 0 && (
                      <View style={{ width: widthToDp("1%") }} />
                    )}
                  </>
                )}
              />
            </View>
          )}
          {this.state.isShareFocused && (
            <View
              style={{
                marginBottom: this.state.otherProfile
                  ? heightToDp("2%")
                  : heightToDp("10%"),
              }}
            >
              <FlatList
                data={this.state.sharePost}
                contentContainerStyle={{
                  paddingHorizontal: widthToDp("2%"),
                }}
                numColumns={2}
                keyExtractor={({ item, index }) => index}
                onEndReached={() => {
                  if (this.state.newShares.length === 0) return;
                  this.setState(
                    { isLoadingNextSharePage: true },
                    this.loadMoreShare
                  );
                }}
                onEndReachedThreshold={0}
                ListFooterComponent={
                  this.state.isLoadingNextSharePage && (
                    <ActivityIndicator
                      style={{
                        alignSelf: "center",
                        paddingTop: heightToDp("2%"),
                      }}
                      color="#69abff"
                      size="small"
                    />
                  )
                }
                renderItem={({ item, index }) =>
                  item.post_type === "video" ? (
                    <View>
                      <TouchableOpacity
                        onPress={() =>{
                          this.setState({newPosts: []}, () => {
                            this.props.navigation.navigate("ImagePreviewScreen", {
                              otherProfile:
                                this.state.otherProfile === true ? true : false,
                              share: true,
                              noEditCaption: true,
                              image: { ...item, post_id: item.post_id },
                            })
                          })
                        }}
                      >
                        <Image
                          source={{ uri: item.post_url }}
                          style={{
                            height: heightToDp("20%"),
                            marginBottom: heightToDp("0.5%"),
                            width: widthToDp("47.5%"),
                            borderRadius: 5,
                          }}
                          transition={false}
                          PlaceholderContent={
                            <ShimmerPlaceHolder
                              style={{
                                width: "100%",
                                height: "100%",
                                borderRadius: 5,
                                borderWidth: 1,
                                borderColor: "#69abff",
                              }}
                              LinearGradient={LinearGradient}
                            />
                          }
                          placeholderStyle={{ backgroundColor: "#fff" }}
                          key={index}
                        />
                        <PlayIcon
                          name={"playcircleo"}
                          size={25}
                          style={{
                            position: "absolute",
                            top: heightToDp("8%"),
                            alignSelf: "center",
                          }}
                        />
                      </TouchableOpacity>
                      {item && item.post_date && item.post_time && (
                        <View
                          style={{
                            position: "absolute",
                            bottom: heightToDp("1.2%"),
                            left: widthToDp(`${index % 2 === 0 ? 1.5 : 49}%`),
                          }}
                        >
                          <Text
                            style={{
                              color: "#db472b",
                              fontSize: widthToDp("3%"),
                              fontFamily: "Poppins-Regular",
                            }}
                          >
                            {item.post_date + " " + item.post_time}
                          </Text>
                        </View>
                      )}
                      {this.state.sharePost &&
                        this.state.sharePost.length > 0 &&
                        index % 2 === 0 && (
                          <View style={{ width: widthToDp("1%") }} />
                        )}
                    </View>
                  ) : (
                    <>
                      <TouchableOpacity
                        onPress={() => {
                          this.setState({newPosts: []}, () => {
                            this.props.navigation.navigate("ImagePreviewScreen", {
                              otherProfile:
                                this.state.otherProfile === true ? true : false,
                              share: true,
                              noEditCaption: true,
                              image: { ...item, post_id: item.post_id },
                            })
                          })
                        }}
                      >
                        <Image
                          source={{ uri: item.post_url }}
                          // resizeMode="contain"
                          transition={false}
                          PlaceholderContent={
                            <ShimmerPlaceHolder
                              style={{
                                width: "100%",
                                height: "100%",
                                borderRadius: 5,
                                borderWidth: 1,
                                borderColor: "#69abff",
                              }}
                              LinearGradient={LinearGradient}
                            />
                          }
                          placeholderStyle={{ backgroundColor: "#fff" }}
                          style={{
                            height: heightToDp("20%"),
                            marginBottom: heightToDp("0.5%"),
                            width: widthToDp("47.5%"),
                            borderRadius: 5,
                          }}
                          key={index}
                        />
                      </TouchableOpacity>
                      {item && item.post_date && item.post_time && (
                        <View
                          style={{
                            position: "absolute",
                            bottom: heightToDp("1.2%"),
                            left: widthToDp(`${index % 2 === 0 ? 1.5 : 49}%`),
                          }}
                        >
                          <Text
                            style={{
                              color: "#db472b",
                              fontSize: widthToDp("3%"),
                              fontFamily: "Poppins-Regular",
                            }}
                          >
                            {item.post_date + " " + item.post_time}
                          </Text>
                        </View>
                      )}
                      {this.state.sharePost &&
                        this.state.sharePost.length > 0 &&
                        index % 2 === 0 && (
                          <View style={{ width: widthToDp("1%") }} />
                        )}
                    </>
                  )
                }
              />
            </View>
          )}
        </ScrollView>
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
      <PushNotificationController navigation={this.props.navigation} />
      {!this.state.otherProfile && (
        <BottomTab
          resetPage={() => this.setState({newPosts: []})} 
          isProfileFocused 
          navigation={this.props.navigation} 
        />
      )}
    </SafeAreaProvider>
  );
}

export default (props) => {
  const insets = useSafeAreaInsets();
  return <ProfileScreen {...props} insets={insets} />;
};

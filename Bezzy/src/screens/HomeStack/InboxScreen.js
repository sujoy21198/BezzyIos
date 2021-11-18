import React, { Component } from 'react';
import { View, ScrollView, Text, Button, StyleSheet, FlatList, TextInput, Image, TouchableOpacity, StatusBar, Platform, SafeAreaView, KeyboardAvoidingView, Keyboard, ActivityIndicator, Alert } from 'react-native';
import { Bubble, GiftedChat, Send, QuickReplies } from 'react-native-gifted-chat';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Icon from 'react-native-vector-icons/FontAwesome5';
import Icon2 from 'react-native-vector-icons/Entypo'
import axios from 'axios';
import DataAccess from '../../components/DataAccess';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { heightToDp, widthToDp } from '../../components/Responsive';
import EmojiBoard from 'react-native-emoji-board'
import ImagePicker from 'react-native-image-crop-picker';
import ImgToBase64 from 'react-native-image-base64';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import PushNotificationController from '../../components/PushNotificationController';
import RBSheet from 'react-native-raw-bottom-sheet';
import Autolink from 'react-native-autolink';
import PushNotification from 'react-native-push-notification';
import {Toast} from "native-base"

export default class InboxScreen extends Component {
  constructor(props) {
    super(props)
    this.state = {
      mychat: true,
      myMessage: '',
      friendsId: '',
      userId: '',
      message: [],
      tempId: 0,
      show: false,
      isFetching: false,
      page: 1,
      imagePath: '',
      friendImage: '',
      friendName: '',
      imagesArray: [],
      isKeyboardOpened: false,
      isSelected: false, 
      deleteIds: []
    }
    this.interval = setInterval(() => {
      this.getIncomingMessage();
    }, 3000)
    this.state.friendsId = this.props.route.params.friendId
    this.state.friendImage = this.props.route.params.friendImage
    this.state.friendName = this.props.route.params.friendName
    //alert(this.state.friendName)
  }

  getIncomingMessage = async () => {
    // this.setState({page: this.state.page + 1})
    // console.log("re-render");
    let message = this.state.message;
    let userId = await AsyncStorage.getItem("userId");
    await axios.get(DataAccess.BaseUrl + DataAccess.instantMessage + "/" + userId + "/" +  this.props.route.params.friendId + "/1", DataAccess.AuthenticationHeader)
    .then(response => {
      console.log(response.data, "response");
      if(response.data.status === 'success') {
        this.setState({page: 1, message: []});
        this.getInboxChats("0");
        // response.data.chat_history_list.forEach(item => {
        //   item.isSelected = false;
        //   item.type = item.chat_message.endsWith(".jpg") ? "image" : "text";
        //   item.chat_message = item.chat_message.endsWith(".jpg") ? "http://bezzy-app.com/admin/public/chat/image/" + item.chat_message : item.chat_message
        // });
        // // console.log(message.reverse());
        // console.log(this.state.message.reverse(), "before");
        // this.setState({message: this.state.message.concat(response.data.chat_history_list).reverse()})
        // console.log(this.state.message, "after");


      }
    })
    .catch(err => {
      // console.log(err.data, "err");
      Toast.show({
        type: "danger",
        text: "Network Error!!!",
        duration: 3000
      })
    })
    // console.log(this.state.message)
    // this.readChats()
  }

  UNSAFE_componentWillMount () {
      this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this._keyboardDidShow);
      this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this._keyboardDidHide);
  }

  _keyboardDidShow = () => this.setState({isKeyboardOpened: true})

  _keyboardDidHide = () => this.setState({isKeyboardOpened: false })
  
  componentWillUnmount () {
      this.keyboardDidShowListener.remove();
      this.keyboardDidHideListener.remove();
      clearInterval(this.interval);
  }

  componentDidMount() {
    this.getUserId()
    //this.imageToBase64Converter()
    

  }

  getUserId = async () => {
    let value = await AsyncStorage.getItem('userId')
    this.setState({ userId: value })
    this.getInboxChats("0")
    // this.readChats()
  }

  readChats = async() => {
    let userId = await AsyncStorage.getItem("userId");
    await axios.get(DataAccess.BaseUrl + DataAccess.readUnreadChats + "/" + userId + "/" + this.props.route.params.friendId, DataAccess.AuthenticationHeader)
    .then(res => {
      // console.log(res);
    })
    .catch(err => {
      // console.log(err);
    })
  }

  getInboxChats = async (value) => {
    // if(this.state.isFetching || this.state.isFetchingMore) return;
    // console.log("chat refreshed", this.state.page);
    let existingMessages = this.state.message.length > 0 ? this.state.message : [];
    this.setState({isFetching: false})
    if (value === '0') {
      this.state.message.length === 0 && this.setState({isFetching: true});
      var messages = []
      console.log("API Called ==> ", DataAccess.BaseUrl + DataAccess.chatListInbox + this.state.userId + "/" + this.state.friendsId + "/" + this.state.page);
      await axios.get(DataAccess.BaseUrl + DataAccess.chatListInbox + this.state.userId + "/" + this.state.friendsId + "/" + this.state.page, DataAccess.AuthenticationHeader)
        .then(response => {
          response.data.chat_history_list.forEach(item => {
            existingMessages.forEach(element => {
              if(element.id === item.id) {
                element.isSelected ? item.isSelected = true : item.isSelected = false
              } 
            })
          });
          
          messages = response.data.chat_history_list
          // console.log(response.data.chat_history_list)
        }).catch(error => {
          messages = this.state.message.length > 0 ? this.state.message : [];
          // if(JSON.stringify(error).includes("Request failed with status code 429")) {
          //   Toast.show({
          //     text: "Network Error!", 
          //     duration: 3000,
          //     style: {
          //       backgroundColor: "#777"
          //     }
          //   })
          // }
          Toast.show({
            type: "danger",
            text: "Network Error!!!",
            duration: 3000
          })
        })
      this.setState({ message: messages })
      //this.setState({ message: this.state.message.concat(messages) })
      //this.state.message = this.state.message.concat(messages)
      this.setState({ isFetching: false })
      console.log(this.state.message);
    }
  }

  pagination = async () => {
    var messages = []
    console.log("API Called ==> ", DataAccess.BaseUrl + DataAccess.chatListInbox + this.state.userId + "/" + this.state.friendsId + "/" + this.state.page);
    await axios.get(DataAccess.BaseUrl + DataAccess.chatListInbox + this.state.userId + "/" + this.state.friendsId + "/" + this.state.page, DataAccess.AuthenticationHeader)
      .then(function (response) {
        response.data.chat_history_list.forEach(item => {
          item.isSelected = false;
        })
        messages = response.data.chat_history_list
        // console.log(response.data.chat_history_list)
      }).catch(function (error) {
        console.log(error)
        Toast.show({
          type: "danger",
          text: "Network Error!!!",
          duration: 3000
        })
      })
    //this.setState({ message: messages })
    this.setState({ message: this.state.message.concat(messages) })
    //this.state.message = this.state.message.concat(messages)
    this.setState({ isFetchingMore: false })
  }

  sendMessage = async () => {
    if(this.state.myMessage.trim() === "") return;
    this.RBSheet.open()
    await axios.post(DataAccess.BaseUrl + DataAccess.addChatData, {
      "from_userID": this.state.userId,
      "to_userID": this.state.friendsId,
      "chat_message": this.state.myMessage
    }, DataAccess.AuthenticationHeader).then(response => {
      console.log(response.data)
      if(response.data.status === "success") {
        this.setState({message: response.data.chat_history_list})
      }
    }).catch(error => {
      console.log(error)
      Toast.show({
        type: "danger",
        text: "Network Error!!!",
        duration: 3000
      })
    })
    this.setState({page: 1, message: []});
    this.getInboxChats("0")
    this.state.myMessage = ""
    this.RBSheet.close()
  }

  startEmoji = () => {
    //alert("ji")
    if(this.state.isKeyboardOpened) {
      Keyboard.dismiss()
    }
    this.setState({ show: true })
  }

  endEmoji = (value) => {
    // console.log(value.code, "fuck me")
    this.setState({ myMessage: this.state.myMessage + value.code })
    this.setState({ show: false })

  }
  // onRefresh = () => {
  //   this.setState({ isFetching: true }, function () { this.getInboxChats() });
  // }
  handleLoadMore = () => {
    this.setState({ page: this.state.page + 1, isFetchingMore: true }, this.pagination)
  }

  // renderFooter = () => {
  //   return()
  // }


  openImageSelection = () => {

    ImagePicker.openPicker({
      width: 300,
      height: 200,
      cropping: true,
      multiple: true,
      maxFiles: 30
    })
      .then(images => {
        this.state.imagePath = images.path
        this.setState({ isImagePathPresent: true })
        this.setState({ imagesArray: images })
        this.postImageToChat()
        // console.log(this.state.imagesArray, "imageArray")
      })
      .catch(err => {
        console.log(' Error fetching images from gallery ', err);
      });
    //console.log(this.state.imagePath)

  }

  postImageToChat = async () => {
    if (this.state.imagesArray.length <= 0) {
      //alert('please enter image and caption')
    } else {
      console.warn("abc");
      if(Platform.OS === "android") {
        PushNotification.getChannels(channelIds => {
            if(channelIds.length === 0) {
                PushNotification.createChannel({
                    channelId: Date.now().toString(),
                    channelName: "Channel"
                }, (created) => {
                    PushNotification.getChannels(channelIds => {
                        PushNotification.localNotification({
                            channelId: channelIds[0],
                            title: "Image Upload",
                            message: this.state.imagesArray.length + (this.state.imagesArray.length === 1 ? " image is sending. Please wait..." : " images are sending. Please wait...")
                        })
                    })
                })
            } else {
              PushNotification.localNotification({
                channelId: channelIds[0],
                title: "Image Upload",
                message: this.state.imagesArray.length + (this.state.imagesArray.length === 1 ? " image is sending. Please wait..." : " images are sending. Please wait...")
              })
            }
        })
      } else {
        PushNotification.localNotification({
            title: "Image Upload",
            channelId: Platform.OS==="android" ? undefined : "videoupload",
            id: Platform.OS==="android" ? undefined : "videoupload",
            message: this.state.imagesArray.length + (this.state.imagesArray.length === 1 ? " image is sending. Please wait..." : " images are sending. Please wait...")
        })
      }
      var filePaths = this.state.imagesArray.map((i) => i.path)
      var formData = new FormData()
      filePaths.forEach((element, i) => {
        formData.append('chat_image[]', {
          uri: element,
          name: `userProfile${i}.jpg`,
          type: 'image/jpg'
        })
        formData.append('from_userID', this.state.userId)
        formData.append('to_userID', this.state.friendsId)
      })
      await axios.post(DataAccess.BaseUrl + DataAccess.addChatDataImage, formData, DataAccess.AuthenticationHeader)
        .then(response => {
          console.log(response.data, "HOHOHO HAHAHAHAHAHA")
          Toast.show({
            type: "success", 
            text: this.state.imagesArray.length + (this.state.imagesArray.length === 1 ? " image has been sent successfully." : " images have been sent successfully."),
            duration: 2000
          })
          if(Platform.OS === "android") {
            PushNotification.getChannels(channelIds => {
                if(channelIds.length === 0) {
                    PushNotification.createChannel({
                        channelId: Date.now().toString(),
                        channelName: "Channel"
                    }, (created) => {
                        PushNotification.getChannels(channelIds => {
                            PushNotification.localNotification({
                                channelId: channelIds[0],
                                title: "Image Upload",
                                message: this.state.imagesArray.length + (this.state.imagesArray.length === 1 ? " image has been sent successfully." : " images have been sent successfully.")
                            })
                        })
                    })
                } else {
                    PushNotification.getChannels(channelIds => {
                        PushNotification.localNotification({
                            channelId: channelIds[0],
                            title: "Image Upload",
                            message: this.state.imagesArray.length + (this.state.imagesArray.length === 1 ? " image has been sent successfully." : " images have been sent successfully.")
                        })
                    })
                }
            })
          } else {
            PushNotification.localNotification({
                title: "Image Upload",
                channelId: Platform.OS==="android" ? undefined : "videoupload",
                id: Platform.OS==="android" ? undefined : "videoupload",
                message: this.state.imagesArray.length + (this.state.imagesArray.length === 1 ? " image has been sent successfully." : " images have been sent successfully.")
            })
          }
        }).catch(function (error) {
          console.log(error)
          Toast.show({
            type: "danger", 
            text: "Image Sending Error! Please try again.",
            duration: 2000
          })
          if(Platform.OS === "android") {
            PushNotification.getChannels(channelIds => {
                if(channelIds.length === 0) {
                    PushNotification.createChannel({
                        channelId: Date.now().toString(),
                        channelName: "Channel"
                    }, (created) => {
                        PushNotification.getChannels(channelIds => {
                            PushNotification.localNotification({
                                channelId: channelIds[0],
                                title: "Image Upload",
                                message: JSON.stringify(error)
                            })
                        })
                    })
                } else {
                    PushNotification.getChannels(channelIds => {
                        PushNotification.localNotification({
                            channelId: channelIds[0],
                            title: "Image Upload",
                            message: JSON.stringify(error)
                        })
                    })
                }
            })
          } else {
            PushNotification.localNotification({
                title: "Image Upload",
                channelId: Platform.OS==="android" ? undefined : "videoupload",
                id: Platform.OS==="android" ? undefined : "videoupload",
                message: JSON.stringify(error)
            })
          }
        })

      this.setState({page: 1, message: []})
      this.getInboxChats("0")
    }
  }

  // imageToBase64Converter = () => {
  //   console.log("hulo khulo")
  //   ImgToBase64.getBase64String(' file:///data/user/0/com.bezzy/cache/react-native-image-crop-picker/IMG-20210516-WA0002.jpg')
  //     .then(base64String => console.log(base64String))
  //     .catch(err => console.log(err));
  // }

  deleteMessage = async () => {
    console.log(this.state.deleteIds, DataAccess.BaseUrl + (this.state.deleteIds.length === 1 ? DataAccess.deleteSingleMessage : DataAccess.deleteMultipleMessage));
    Alert.alert(
      "Are you sure?",
      this.state.deleteIds.length + ` ${this.state.deleteIds.length === 1 ? "message" : "messages"} will be deleted`, [
        {
          text: "Cancel",
        },
        {
          text: "Yes", 
          onPress: async () => {
            this.setState({message: [], isFetching: true, isSelected: false})
            await axios.post(DataAccess.BaseUrl + (this.state.deleteIds.length === 1 ? DataAccess.deleteSingleMessage : DataAccess.deleteMultipleMessage), {
              "chat_id": this.state.deleteIds.length === 1 ? this.state.deleteIds[0] : this.state.deleteIds,
              "user_id": await AsyncStorage.getItem("userId")
            }, DataAccess.AuthenticationHeader).then(response => {
              console.log("Chat message delete success response :- ", response.data, typeof response.data);
              if(response.data.status === "success") {
                this.state.message.map(item => item.isSelected = false);
                this.setState({deleteIds: [], page: 1, message: [], isFetching: false});
                this.getInboxChats("0")
              } else {
                //
              }
            }).catch(error => {
              console.log("Chat message delete error response :- ", error)
            })
          }
        }
      ]
    )
  }

  render() {
    return (
      <SafeAreaView 
        style={{
          flex: 1,
          backgroundColor: '#fff'
        }}        
      >
        <StatusBar backgroundColor="#69abff" barStyle={Platform.OS==='android' ? "light-content" : "dark-content"} />
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            backgroundColor: this.state.isSelected ? "rgba(0, 125, 254, 0.2)" : undefined,
            paddingHorizontal: widthToDp("2%"),
            borderBottomWidth: 1,
            borderBottomColor: "#ececec",
          }}
        >
          <TouchableOpacity
            style={{
              height: heightToDp("6%"),
              flexDirection: 'row',
              alignItems: 'center',
            }}
            activeOpacity={0.7}
            onPress={this.state.isSelected ? () => {
              let messages = this.state.message;
              messages.map(i => i.isSelected = false)
              this.setState({message: messages, isSelected: false, deleteIds: []})
            } : () => this.props.navigation.navigate("ChatScreen")}
          >
            <Icon 
              name="chevron-left"
              size={Platform.isPad ? 40 : 20}
              color={this.state.isSelected ? "#808080" : "#69abff"}                        
            />
            {!this.state.isSelected && <Image
            source={{ uri: this.state.friendImage }}
            style={{height: Platform.isPad ? 80 : 40, width: Platform.isPad ? 80 : 40, borderRadius: Platform.isPad ? 80 / 2 : 40 / 2, marginLeft: widthToDp("1%")}}
            resizeMode="contain"
            />}
            <Text
                style={{
                    marginLeft: widthToDp("2%"),
                    fontSize: this.state.isSelected ? widthToDp("4.5%") : widthToDp("3.6%"),
                    fontFamily: "ProximaNova-Black",
                    color: this.state.isSelected ? "#808080" : "#1b1b1b"
                }}
            >
              {this.state.isSelected ? this.state.deleteIds.length : this.state.friendName}
            </Text>
          </TouchableOpacity>
          {
            !this.state.isSelected &&
            <TouchableOpacity
              style={{
                position: "absolute",
                top: 15,
                right: 15,
              }}
              onPress={() => this.props.navigation.navigate("Settings")}
            >
              <Ionicons
                name={Platform.OS === 'android' ? 'md-settings-outline' : 'ios-settings-outline'}
                color={"#1b1b1b"}
                size={Platform.isPad ? 40 : 20}
              />
            </TouchableOpacity>
          }
          {
            this.state.isSelected &&
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={this.deleteMessage}
            >
              <Ionicons 
                name={Platform.OS==='android' ? 'md-trash' : 'ios-trash'}
                size={Platform.isPad ? 40 : 20}
                color={this.state.isSelected ? "#808080" : "#69abff"}                        
              />
            </TouchableOpacity>
          }
        </View>
        {
          Platform.OS === 'ios' &&
          <KeyboardAvoidingView behavior="padding" style={{flex: 1}}>
            {
              this.state.isFetching ?
              <View
                style={{
                  flex: 1,
                  justifyContent: 'center',
                  alignItems: 'center'
                }}
              >
                <ActivityIndicator size="large" color="#69abff"/>
              </View> :
              <View style={{flex: 0.935}}>
                <FlatList
                  data={this.state.message}
                  keyExtractor={(item, index) => String(index)}
                  inverted={true}
                  ListFooterComponent={
                    !this.state.isFetchingMore ?
                    <View style={{height: heightToDp("5%")}}/> :
                    <ActivityIndicator 
                      style={{
                        alignSelf: "center",
                        paddingTop: heightToDp("2%")
                      }}
                      color="#69abff"
                      size="small"
                    />
                  }
                  style={{ backgroundColor: '#fff', height: heightToDp("80%"), paddingVertical: widthToDp("2%") }}
                  // onRefresh={() => this.onRefresh()}
                  // refreshing={this.state.isFetching}
                  onEndReached={this.handleLoadMore}
                  onEndReachedThreshold={0}
                  //ListFooterComponent={this.renderFooter}
                  renderItem={({ item }) =>
                    item &&
                    <View
                      style={{
                        backgroundColor: item.isSelected ? "rgba(0, 125, 254, 0.2)" : undefined,
                        marginBottom: heightToDp("2%"), 
                      }}
                    >

                      {
                        item.message_by === 'self' && item.type === 'text' ? 
                        <TouchableOpacity 
                        style={{paddingHorizontal: widthToDp("2%")}}
                        onLongPress={() => {
                          let messages = this.state.message;
                          messages.map(i => {
                            if(i.id === item.id) {
                              i.isSelected = true
                            }
                          })
                          this.setState({message: messages, isSelected: true, deleteIds: [...this.state.deleteIds, item.id]})
                        }}
                        onPress={() => {
                          if(this.state.isSelected) {
                            let messages = this.state.message;
                            messages.map(i => {
                              if(i.id === item.id) {
                                if(i.isSelected) {
                                  this.state.deleteIds.splice(this.state.deleteIds.findIndex(element => element === item.id), 1)
                                  this.setState({deleteIds: this.state.deleteIds})
                                } else {
                                  this.setState({deleteIds: [...this.state.deleteIds, item.id]})
                                }
                                i.isSelected = !i.isSelected
                              }
                            })
                            if(!messages.find(item => item.isSelected)) {
                              this.setState({isSelected: false})
                            } 
                            this.setState({message: messages})
                          } else {

                            // this.props.navigation.navigate('ChatImagePreviewScreen', { imageUrl: item.chat_message })

                          }
                        }}
                        >
                          <View
                            style={{
                              alignSelf: 'flex-end', 
                              backgroundColor: '#007dfe',
                              width: widthToDp("40%"), 
                              paddingVertical: heightToDp('0.5%'),
                              borderTopLeftRadius: 10,
                              borderTopRightRadius: 10,
                              borderBottomLeftRadius: 10, 
                            }}
                          >
                            <Autolink
                              stripPrefix={false}
                              component={Text}
                              text={item.chat_message}
                              style={{ 
                                marginLeft: widthToDp("2%"), 
                                color: 'white', 
                                fontSize: widthToDp("3.3%"), 
                                fontFamily: "Poppins-Regular",
                                alignSelf: 'flex-end', 
                                paddingHorizontal: widthToDp("2%")
                              }}
                              email
                              url
                              linkStyle={{
                                marginLeft: widthToDp("2%"), 
                                color: 'white', 
                                fontSize: widthToDp("3.3%"), 
                                fontFamily: "Poppins-Regular", 
                                textDecorationLine: "underline",
                              }}
                            />
                            {/* <Text style={{ marginLeft: widthToDp("2%"), color: 'white', fontSize: widthToDp("3.3%"), fontFamily: "Poppins-Regular" }}>{item.chat_message}</Text> */}
                            <Text style={{ marginRight: widthToDp("2%"), color: 'white', alignSelf: 'flex-end', fontSize: widthToDp("3%"), marginTop: heightToDp("1%"), fontFamily: "Poppins-Regular" }}>{item.chat_msg_time}</Text>
                            <Ionicons
                              name={Platform.OS==='android' ? 'md-checkmark-done-outline' : 'ios-checkmark-done-outline'}
                              size={Platform.isPad ? 30 : 15}
                              color="#fff"
                              style={{alignSelf: 'flex-end', marginRight: widthToDp("2%")}}
                            />
                          </View>
                        </TouchableOpacity> : ((item.message_by === 'self' && item.type === 'image') ?
                          <TouchableOpacity 
                            style={{ 
                              paddingHorizontal: widthToDp('2%')
                            }}
                            onLongPress={() => {
                              let messages = this.state.message;
                              messages.map(i => {
                                if(i.id === item.id) {
                                  i.isSelected = true
                                }
                              })
                              this.setState({message: messages, isSelected: true, deleteIds: [...this.state.deleteIds, item.id]})
                            }}
                            onPress={() => {
                              if(this.state.isSelected) {
                                let messages = this.state.message;
                                messages.map(i => {
                                  if(i.id === item.id) {
                                    if(i.isSelected) {
                                      this.state.deleteIds.splice(this.state.deleteIds.findIndex(element => element === item.id), 1)
                                      this.setState({deleteIds: this.state.deleteIds})
                                    } else {
                                      this.setState({deleteIds: [...this.state.deleteIds, item.id]})
                                    }
                                    i.isSelected = !i.isSelected
                                  }
                                })
                                if(!messages.find(item => item.isSelected)) {
                                  this.setState({isSelected: false})
                                } 
                                this.setState({message: messages})
                              } else {

                                this.props.navigation.navigate('ChatImagePreviewScreen', { imageUrl: item.chat_message })

                              }
                            }}
                            >
                            <View
                              style={{
                                alignSelf: 'flex-end', 
                                backgroundColor: '#007dfe',
                                width: widthToDp("40%"), 
                                paddingVertical: heightToDp('0.5%'),
                                borderTopLeftRadius: 10,
                                borderTopRightRadius: 10,
                                borderBottomLeftRadius: 10, 
                              }}
                            >
                              <Image
                                source={{ uri: item.chat_message }}
                                resizeMode="contain"
                                style={{ 
                                  alignSelf: 'center',
                                  height: heightToDp("20%"), 
                                  width: widthToDp("40%"), 
                                  borderTopLeftRadius: 20,
                                  borderTopRightRadius: 20,
                                  borderBottomLeftRadius: 20, 
                                }}
                              />

                              <Text style={{ 
                                position: 'absolute',
                                bottom: 20,
                                right: 5,
                                color: 'white', 
                                fontFamily: "Poppins-Regular",
                                fontSize: widthToDp("3%"), 
                              }}>{item.chat_msg_time}</Text>
                              <Ionicons
                              name={Platform.OS==='android' ? 'md-checkmark-done-outline' : 'ios-checkmark-done-outline'}
                              size={Platform.isPad ? 30 : 15}
                              color="#fff"
                              style={{
                                position: 'absolute',
                                bottom: 5,
                                right: 5,
                                color: 'white', 
                              }}
                              />
                            </View>
                          </TouchableOpacity> : ((item.message_by === 'other' && item.type === 'text') ? 
                          <TouchableOpacity 
                            style={{ 
                              paddingHorizontal: widthToDp("2%")
                            }}
                            onLongPress={() => {
                              let messages = this.state.message;
                              messages.map(i => {
                                if(i.id === item.id) {
                                  i.isSelected = true
                                }
                              })
                              this.setState({message: messages, isSelected: true, deleteIds: [...this.state.deleteIds, item.id]})
                            }}
                            onPress={() => {
                              if(this.state.isSelected) {
                                let messages = this.state.message;
                                messages.map(i => {
                                  if(i.id === item.id) {
                                    if(i.isSelected) {
                                      this.state.deleteIds.splice(this.state.deleteIds.findIndex(element => element === item.id), 1)
                                      this.setState({deleteIds: this.state.deleteIds})
                                    } else {
                                      this.setState({deleteIds: [...this.state.deleteIds, item.id]})
                                    }
                                    i.isSelected = !i.isSelected
                                  }
                                })
                                if(!messages.find(item => item.isSelected)) {
                                  this.setState({isSelected: false})
                                } 
                                this.setState({message: messages})
                              } else {

                                // this.props.navigation.navigate('ChatImagePreviewScreen', { imageUrl: item.chat_message })

                              }
                            }}
                          >
                            <View
                              style={{
                                alignSelf: 'flex-start', 
                                backgroundColor: '#ececec',
                                width: widthToDp("40%"), 
                                paddingVertical: heightToDp('0.5%'),
                                borderBottomRightRadius: 10,
                                borderTopRightRadius: 10,
                                borderBottomLeftRadius: 10, 
                              }}
                            >
                              <Autolink
                                component={Text}
                                stripPrefix={false}
                                text={item.chat_message}
                                style={{ 
                                  marginLeft: widthToDp("2%"),
                                  color: "#1b1b1b", 
                                  fontSize: widthToDp("3.3%"), 
                                  fontFamily: "Poppins-Regular" 
                                }}
                                email
                                url
                                linkStyle={{
                                  marginLeft: widthToDp("2%"), 
                                  fontSize: widthToDp("3.3%"), 
                                  color: "#1b1b1b",
                                  fontFamily: "Poppins-Regular", 
                                  textDecorationLine: "underline",
                                }}
                              />
                              {/* <Text style={{ marginLeft: widthToDp("2%"), fontSize: widthToDp("3.3%"), fontFamily: "Poppins-Regular" }}>{item.chat_message}</Text> */}
                              <Text style={{ marginRight: widthToDp("2%"), color: 'black', alignSelf: 'flex-start', fontSize: widthToDp("3%"), marginLeft: widthToDp("2%"), marginTop: heightToDp("1%"), fontFamily: "Poppins-Regular" }}>{item.chat_msg_time}</Text>
                              <Ionicons
                              name={Platform.OS==='android' ? 'md-checkmark-done-outline' : 'ios-checkmark-done-outline'}
                              size={Platform.isPad ? 30 : 15}
                              color="#1b1b1b"
                              style={{alignSelf: 'flex-start', marginLeft: widthToDp("2%")}}
                              />
                            </View>
                          </TouchableOpacity> : (((item.message_by === 'other' && item.type === 'image') ? 
                          <TouchableOpacity style={{ 
                            paddingHorizontal: widthToDp("2%")
                          }}
                          onLongPress={() => {
                            let messages = this.state.message;
                            messages.map(i => {
                              if(i.id === item.id) {
                                i.isSelected = true
                              }
                            })
                            this.setState({message: messages, isSelected: true, deleteIds: [...this.state.deleteIds, item.id]})
                          }}
                          onPress={() => {
                            if(this.state.isSelected) {
                              let messages = this.state.message;
                              messages.map(i => {
                                if(i.id === item.id) {
                                  if(i.isSelected) {
                                    this.state.deleteIds.splice(this.state.deleteIds.findIndex(element => element === item.id), 1)
                                    this.setState({deleteIds: this.state.deleteIds})
                                  } else {
                                    this.setState({deleteIds: [...this.state.deleteIds, item.id]})
                                  }
                                  i.isSelected = !i.isSelected
                                }
                              })
                              if(!messages.find(item => item.isSelected)) {
                                this.setState({isSelected: false})
                              } 
                              this.setState({message: messages})
                            } else {

                              this.props.navigation.navigate('ChatImagePreviewScreen', { imageUrl: item.chat_message })

                            }
                          }}
                          >
                            <View
                              style={{
                                alignSelf: 'flex-start', 
                                backgroundColor: '#ececec',
                                width: widthToDp("40%"), 
                                paddingVertical: heightToDp('0.5%'),
                                borderBottomRightRadius: 10,
                                borderTopRightRadius: 10,
                                borderBottomLeftRadius: 10, 
                              }}
                            >
                              <Image
                                source={{ uri: item.chat_message }}
                                style={{ 
                                  height: heightToDp("20%"), 
                                  width: widthToDp("40%"),
                                  borderTopRightRadius: 20,
                                  borderBottomLeftRadius: 20,
                                  borderBottomRightRadius: 20,
                                }}
                                resizeMode="contain"
                              />

                              <Text style={{ 
                                position: 'absolute',
                                bottom: 20,
                                left: 5,
                                color: '#1b1b1b', 
                                fontSize: widthToDp("3%"), 
                                fontFamily: "Poppins-Regular"
                              }}>{item.chat_msg_time}</Text>
                              <Ionicons
                              name={Platform.OS==='android' ? 'md-checkmark-done-outline' : 'ios-checkmark-done-outline'}
                              size={Platform.isPad ? 30 : 15}
                              color="#fff"
                              style={{
                                position: 'absolute',
                                bottom: 5,
                                left: 5,
                                color: '#1b1b1b', 
                              }}
                              />
                            </View>
                          </TouchableOpacity> : null))))
                      }
                    </View>

                  }
                />
              </View>
            }
            <View
              style={{
                flex: 0.065,
                position: Platform.OS==='android' ? "absolute" : undefined,
                bottom: Platform.OS==='android' ? 0 : undefined,
                borderTopWidth: 1,
                borderTopColor: '#ececec',
                paddingHorizontal: widthToDp('1%'),
                paddingVertical: this.state.isKeyboardOpened ? heightToDp("1%") : heightToDp(Platform.OS==='android' ? "0.5%" : "0%"),
                flexDirection: 'row',
                alignItems: 'center',
              }}
            >
              <Icon
                name="smile"
                size={Platform.isPad ? 40 : 20}
                color="#69abff"
                onPress={() => this.startEmoji()}
                style={{paddingTop: this.state.isKeyboardOpened ? heightToDp("0.5%") : heightToDp("0%")}}
              />
              <Ionicons
                name={Platform.OS==='android' ? 'md-image' : 'ios-image'}
                size={Platform.isPad ? 50 : 25}
                color="#69abff"
                style={{paddingLeft: widthToDp("1%")}}
                onPress={() => this.openImageSelection()}
              />
              <View
                  style={{
                      marginLeft: widthToDp("1%"),
                      paddingHorizontal: widthToDp("2%"),
                      // height: heightToDp(`0%`),
                      width: Platform.isPad ? widthToDp("87%") : widthToDp("85%"),
                      borderWidth: 1,
                      borderRadius: 5,
                      borderColor: "#69abff",
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                  }}
              >
                  <TextInput
                    placeholder="Enter message"
                    value={this.state.myMessage}
                    placeholderTextColor="#808080"
                    style={{
                        padding: widthToDp("1%"),
                        fontSize: widthToDp("4%"),
                        width: widthToDp("75%"),
                        color: '#777',
                        fontFamily: "Poppins-Regular"
                    }}
                    onChangeText={(text) => this.setState({ myMessage: text })}
                    multiline
                  />
                  <Ionicons
                  name={Platform.OS==='android' ? 'md-send' : 'ios-send'}
                  size={Platform.isPad ? 40 : 20}
                  color="#69abff"
                  onPress={() => this.sendMessage()}
                  />
              </View>
            </View>    
          </KeyboardAvoidingView> 
        }
        {
          Platform.OS==='android' &&
          <>
            {
              this.state.isFetching ?
              <View
                style={{
                  flex: 1,
                  justifyContent: 'center',
                  alignItems: 'center'
                }}
              >
                <ActivityIndicator size="large" color="#69abff"/>
              </View> :
              <FlatList
              data={this.state.message}
              keyExtractor={(item, index) => String(index)}
              inverted={true}
              ListFooterComponent={
                !this.state.isFetchingMore ?
                <View style={{height: heightToDp("5%")}}/> :
                <ActivityIndicator 
                  style={{
                    alignSelf: "center",
                    paddingTop: heightToDp("2%")
                  }}
                  color="#69abff"
                  size="small"
                />
              }
              style={{ backgroundColor: '#fff', height: heightToDp("80%"), paddingVertical: widthToDp("2%"), marginBottom: Platform.OS === "android" ? this.state.isKeyboardOpened ? heightToDp("6%") : heightToDp("5%") : undefined}}
              // onRefresh={() => this.onRefresh()}
              // refreshing={this.state.isFetching}
              onEndReached={this.handleLoadMore}
              onEndReachedThreshold={0}
              //ListFooterComponent={this.renderFooter}
              renderItem={({ item }) =>
                item &&
                <View
                  style={{
                    backgroundColor: item.isSelected ? "rgba(0, 125, 254, 0.2)" : undefined,
                    marginBottom: heightToDp("2%"), 
                  }}
                >

                  {
                    item.message_by === 'self' && item.type === 'text' ? 
                    <TouchableOpacity 
                    style={{paddingHorizontal: widthToDp("2%")}}
                    onLongPress={() => {
                      let messages = this.state.message;
                      messages.map(i => {
                        if(i.id === item.id) {
                          i.isSelected = true
                        }
                      })
                      this.setState({message: messages, isSelected: true, deleteIds: [...this.state.deleteIds, item.id]})
                    }}
                    onPress={() => {
                      if(this.state.isSelected) {
                        let messages = this.state.message;
                        messages.map(i => {
                          if(i.id === item.id) {
                            if(i.isSelected) {
                              this.state.deleteIds.splice(this.state.deleteIds.findIndex(element => element === item.id), 1)
                              this.setState({deleteIds: this.state.deleteIds})
                            } else {
                              this.setState({deleteIds: [...this.state.deleteIds, item.id]})
                            }
                            i.isSelected = !i.isSelected
                          }
                        })
                        if(!messages.find(item => item.isSelected)) {
                          this.setState({isSelected: false})
                        } 
                        this.setState({message: messages})
                      } else {

                        // this.props.navigation.navigate('ChatImagePreviewScreen', { imageUrl: item.chat_message })

                      }
                    }}
                    >
                      <View
                        style={{
                          alignSelf: 'flex-end', 
                          backgroundColor: '#007dfe',
                          width: widthToDp("40%"), 
                          paddingVertical: heightToDp('0.5%'),
                          borderTopLeftRadius: 10,
                          borderTopRightRadius: 10,
                          borderBottomLeftRadius: 10, 
                        }}
                      >
                        <Autolink
                          component={Text}
                          stripPrefix={false}
                          text={item.chat_message}
                          style={{ 
                            marginLeft: widthToDp("2%"), 
                            color: 'white', 
                            fontSize: widthToDp("3.3%"), 
                            fontFamily: "Poppins-Regular",
                            alignSelf: 'flex-end', 
                            paddingHorizontal: widthToDp("2%")
                          }}
                          email
                          url
                          linkStyle={{
                            marginLeft: widthToDp("2%"), 
                            color: 'white', 
                            fontSize: widthToDp("3.3%"), 
                            fontFamily: "Poppins-Regular", 
                            textDecorationLine: "underline",
                          }}
                        />
                        {/* <Text style={{ marginLeft: widthToDp("2%"), color: 'white', fontSize: widthToDp("3.3%"), fontFamily: "Poppins-Regular" }}>{item.chat_message}</Text> */}
                        <Text style={{ marginRight: widthToDp("2%"), color: 'white', alignSelf: 'flex-end', fontSize: widthToDp("3%"), marginTop: heightToDp("1%"), fontFamily: "Poppins-Regular" }}>{item.chat_msg_time}</Text>
                        <Ionicons
                          name={Platform.OS==='android' ? 'md-checkmark-done-outline' : 'ios-checkmark-done-outline'}
                          size={Platform.isPad ? 30 : 15}
                          color="#fff"
                          style={{alignSelf: 'flex-end', marginRight: widthToDp("2%")}}
                        />
                      </View>
                    </TouchableOpacity> : ((item.message_by === 'self' && item.type === 'image') ?
                      <TouchableOpacity 
                        style={{ 
                          paddingHorizontal: widthToDp('2%')
                        }}
                        onLongPress={() => {
                          let messages = this.state.message;
                          messages.map(i => {
                            if(i.id === item.id) {
                              i.isSelected = true
                            }
                          })
                          this.setState({message: messages, isSelected: true, deleteIds: [...this.state.deleteIds, item.id]})
                        }}
                        onPress={() => {
                          if(this.state.isSelected) {
                            let messages = this.state.message;
                            messages.map(i => {
                              if(i.id === item.id) {
                                if(i.isSelected) {
                                  this.state.deleteIds.splice(this.state.deleteIds.findIndex(element => element === item.id), 1)
                                  this.setState({deleteIds: this.state.deleteIds})
                                } else {
                                  this.setState({deleteIds: [...this.state.deleteIds, item.id]})
                                }
                                i.isSelected = !i.isSelected
                              }
                            })
                            if(!messages.find(item => item.isSelected)) {
                              this.setState({isSelected: false})
                            } 
                            this.setState({message: messages})
                          } else {

                            this.props.navigation.navigate('ChatImagePreviewScreen', { imageUrl: item.chat_message })

                          }
                        }}
                        >
                        <View
                          style={{
                            alignSelf: 'flex-end', 
                            backgroundColor: '#007dfe',
                            width: widthToDp("40%"), 
                            paddingVertical: heightToDp('0.5%'),
                            borderTopLeftRadius: 10,
                            borderTopRightRadius: 10,
                            borderBottomLeftRadius: 10, 
                          }}
                        >
                          <Image
                            source={{ uri: item.chat_message }}
                            resizeMode="contain"
                            style={{ 
                              alignSelf: 'center',
                              height: heightToDp("20%"), 
                              width: widthToDp("40%"), 
                              borderTopLeftRadius: 20,
                              borderTopRightRadius: 20,
                              borderBottomLeftRadius: 20, 
                            }}
                          />

                          <Text style={{ 
                            position: 'absolute',
                            bottom: 20,
                            right: 5,
                            color: 'white', 
                            fontFamily: "Poppins-Regular",
                            fontSize: widthToDp("3%"), 
                          }}>{item.chat_msg_time}</Text>
                          <Ionicons
                          name={Platform.OS==='android' ? 'md-checkmark-done-outline' : 'ios-checkmark-done-outline'}
                          size={Platform.isPad ? 30 : 15}
                          color="#fff"
                          style={{
                            position: 'absolute',
                            bottom: 5,
                            right: 5,
                            color: 'white', 
                          }}
                          />
                        </View>
                      </TouchableOpacity> : ((item.message_by === 'other' && item.type === 'text') ? 
                      <TouchableOpacity 
                        style={{ 
                          paddingHorizontal: widthToDp("2%")
                        }}
                        onLongPress={() => {
                          let messages = this.state.message;
                          messages.map(i => {
                            if(i.id === item.id) {
                              i.isSelected = true
                            }
                          })
                          this.setState({message: messages, isSelected: true, deleteIds: [...this.state.deleteIds, item.id]})
                        }}
                        onPress={() => {
                          if(this.state.isSelected) {
                            let messages = this.state.message;
                            messages.map(i => {
                              if(i.id === item.id) {
                                if(i.isSelected) {
                                  this.state.deleteIds.splice(this.state.deleteIds.findIndex(element => element === item.id), 1)
                                  this.setState({deleteIds: this.state.deleteIds})
                                } else {
                                  this.setState({deleteIds: [...this.state.deleteIds, item.id]})
                                }
                                i.isSelected = !i.isSelected
                              }
                            })
                            if(!messages.find(item => item.isSelected)) {
                              this.setState({isSelected: false})
                            } 
                            this.setState({message: messages})
                          } else {

                            // this.props.navigation.navigate('ChatImagePreviewScreen', { imageUrl: item.chat_message })

                          }
                        }}
                      >
                        <View
                          style={{
                            alignSelf: 'flex-start', 
                            backgroundColor: '#ececec',
                            width: widthToDp("40%"), 
                            paddingVertical: heightToDp('0.5%'),
                            borderBottomRightRadius: 10,
                            borderTopRightRadius: 10,
                            borderBottomLeftRadius: 10, 
                          }}
                        >
                          <Autolink
                            component={Text}
                            stripPrefix={false}
                            text={item.chat_message}
                            style={{ 
                              marginLeft: widthToDp("2%"), 
                              fontSize: widthToDp("3.3%"), 
                              fontFamily: "Poppins-Regular" 
                            }}
                            email
                            url
                            linkStyle={{
                              marginLeft: widthToDp("2%"), 
                              fontSize: widthToDp("3.3%"), 
                              fontFamily: "Poppins-Regular", 
                              textDecorationLine: "underline",
                            }}
                          />
                          {/* <Text style={{ marginLeft: widthToDp("2%"), fontSize: widthToDp("3.3%"), fontFamily: "Poppins-Regular" }}>{item.chat_message}</Text> */}
                          <Text style={{ marginRight: widthToDp("2%"), color: 'black', alignSelf: 'flex-start', fontSize: widthToDp("3%"), marginLeft: widthToDp("2%"), marginTop: heightToDp("1%"), fontFamily: "Poppins-Regular" }}>{item.chat_msg_time}</Text>
                          <Ionicons
                          name={Platform.OS==='android' ? 'md-checkmark-done-outline' : 'ios-checkmark-done-outline'}
                          size={Platform.isPad ? 30 : 15}
                          color="#1b1b1b"
                          style={{alignSelf: 'flex-start', marginLeft: widthToDp("2%")}}
                          />
                        </View>
                      </TouchableOpacity> : (((item.message_by === 'other' && item.type === 'image') ? 
                      <TouchableOpacity style={{ 
                        paddingHorizontal: widthToDp("2%")
                      }}
                      onLongPress={() => {
                        let messages = this.state.message;
                        messages.map(i => {
                          if(i.id === item.id) {
                            i.isSelected = true
                          }
                        })
                        this.setState({message: messages, isSelected: true, deleteIds: [...this.state.deleteIds, item.id]})
                      }}
                      onPress={() => {
                        if(this.state.isSelected) {
                          let messages = this.state.message;
                          messages.map(i => {
                            if(i.id === item.id) {
                              if(i.isSelected) {
                                this.state.deleteIds.splice(this.state.deleteIds.findIndex(element => element === item.id), 1)
                                this.setState({deleteIds: this.state.deleteIds})
                              } else {
                                this.setState({deleteIds: [...this.state.deleteIds, item.id]})
                              }
                              i.isSelected = !i.isSelected
                            }
                          })
                          if(!messages.find(item => item.isSelected)) {
                            this.setState({isSelected: false})
                          } 
                          this.setState({message: messages})
                        } else {

                          this.props.navigation.navigate('ChatImagePreviewScreen', { imageUrl: item.chat_message })

                        }
                      }}
                      >
                        <View
                          style={{
                            alignSelf: 'flex-start', 
                            backgroundColor: '#ececec',
                            width: widthToDp("40%"), 
                            paddingVertical: heightToDp('0.5%'),
                            borderBottomRightRadius: 10,
                            borderTopRightRadius: 10,
                            borderBottomLeftRadius: 10, 
                          }}
                        >
                          <Image
                            source={{ uri: item.chat_message }}
                            style={{ 
                              height: heightToDp("20%"), 
                              width: widthToDp("40%"),
                              borderTopRightRadius: 20,
                              borderBottomLeftRadius: 20,
                              borderBottomRightRadius: 20,
                            }}
                            resizeMode="contain"
                          />

                          <Text style={{ 
                            position: 'absolute',
                            bottom: 20,
                            left: 5,
                            color: '#1b1b1b', 
                            fontSize: widthToDp("3%"), 
                            fontFamily: "Poppins-Regular"
                          }}>{item.chat_msg_time}</Text>
                          <Ionicons
                          name={Platform.OS==='android' ? 'md-checkmark-done-outline' : 'ios-checkmark-done-outline'}
                          size={Platform.isPad ? 30 : 15}
                          color="#fff"
                          style={{
                            position: 'absolute',
                            bottom: 5,
                            left: 5,
                            color: '#1b1b1b', 
                          }}
                          />
                        </View>
                      </TouchableOpacity> : null))))
                    }
                  </View>

                }
              />
            }
            <View
              style={{
                position: Platform.OS==='android' ? "absolute" : undefined,
                bottom: Platform.OS==='android' ? 0 : undefined,
                borderTopWidth: 1,
                borderTopColor: '#ececec',
                paddingHorizontal: widthToDp('1%'),
                paddingVertical: this.state.isKeyboardOpened ? heightToDp("1%") : heightToDp(Platform.OS==='android' ? "0.5%" : "0%"),
                flexDirection: 'row',
                alignItems: 'center',
              }}
            >
              <Icon
                name="smile"
                size={Platform.isPad ? 40 : 20}
                color="#69abff"
                onPress={() => this.startEmoji()}
                style={{paddingTop: this.state.isKeyboardOpened ? heightToDp("0.5%") : heightToDp("0%")}}
              />
              <Ionicons
                name={Platform.OS==='android' ? 'md-image' : 'ios-image'}
                size={Platform.isPad ? 50 : 25}
                color="#69abff"
                style={{paddingLeft: widthToDp("1%")}}
                onPress={() => this.openImageSelection()}
              />
              <View
                  style={{
                      marginLeft: widthToDp("1%"),
                      paddingHorizontal: widthToDp("2%"),
                      paddingHorizontal: 3,
                      paddingVertical: 0,
                      width: Platform.isPad ? widthToDp("87%") : widthToDp("85%"),
                      borderWidth: 1,
                      borderRadius: 5,
                      borderColor: "#69abff",
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                  }}
              >
                  <TextInput
                    placeholder="Enter message"
                    value={this.state.myMessage}
                    placeholderTextColor="#808080"
                    style={{
                        padding: widthToDp("1%"),
                        fontSize: widthToDp("4%"),
                        width: widthToDp("75%"),
                        color: '#777',
                        fontFamily: "Poppins-Regular"
                    }}
                    onChangeText={(text) => this.setState({ myMessage: text })}
                    multiline
                  />
                  <Ionicons
                  name={Platform.OS==='android' ? 'md-send' : 'ios-send'}
                  size={Platform.isPad ? 40 : 20}
                  color="#69abff"
                  onPress={() => this.sendMessage()}
                  />
              </View>
            </View>
          </>
        }
        <EmojiBoard showBoard={this.state.show} onClick={(value) => this.endEmoji(value)} />
        <PushNotificationController navigation={this.props.navigation}/>
        <RBSheet
          ref={ref => {
              this.RBSheet = ref;
          }}
          height={heightToDp("6%")}
          closeOnPressMask={false}
          closeOnPressBack={false}
          // openDuration={250}
          customStyles={{
              container: {
                  width: widthToDp("15%"),
                  position: 'absolute',
                  top: heightToDp("45%"),
                  left: widthToDp("40%"),
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: '#fff',
                  borderRadius: 10
              },
          }}
      >
          <ActivityIndicator
              size="large"
              color="#69abff"
          />
      </RBSheet> 
      </SafeAreaView>
    )
  }
}



// export default class InboxScreen extends Component {

//   constructor(props) {
//     super(props);
//     this.state = {
//       messages: [],
//       friendsId: '',
//       userId: ''
//     };
//     this.state.friendsId = this.props.route.params.friendId
//     //alert(this.state.friendsId)
//     this.onSend = this.onSend.bind(this);
//   }
//   componentDidMount() {
//     //this.getMessages()
//     this.getUserId()
//   }

//   getUserId = async () => {
//     let value = await AsyncStorage.getItem('userId')
//     this.setState({ userId: value })
//     this.getInboxChats()
//   }


//   getInboxChats = async () => {
//     var messages = []
//     await axios.get(DataAccess.BaseUrl + DataAccess.chatList + this.state.userId + "/" + this.state.friendsId + "/1")
//       .then(function (response) {
//         messages = response.data.chat_history_list
//         console.log(response.data.chat_history_list)
//       }).catch(function (error) {
//         console.log(error)
//       })
//     let giftedMessage = messages.map((i) => {
//       var other,self
//       i.message_by === 'other' ? other = i.id : null
//       i.message_by === 'self' ? self = i.id : null
//       //console.log(self)
//       let gcm = {
//         _id: other,
//         text: i.chat_message,
//         createdAt: i.chat_date_time,
//         user: {
//           _id: self,
//           name: 'React Native',
//         }
//       }
//       return gcm
//       console.log(gcm,"gcm")
//     })
//     this.setState({messages: giftedMessage})
//   }



//   getMessages = () => {
//     this.setState({
//       messages: [
//         {
//           _id: 1,
//           text: 'Hello developer',
//           createdAt: new Date(Date.UTC(2016, 7, 30, 17, 20, 0)),
//           user: {
//             _id: 2,
//             name: 'React Native',
//             avatar: 'https://facebook.github.io/react/img/logo_og.png',
//           },
//         }
//       ],
//     });
//   }



//   onSend(messages = []) {
//     this.setState((previousState) => {
//       return {
//         messages: GiftedChat.append(previousState.messages, messages),
//       };
//     });
//   }

//   render() {
//     return (
//       <GiftedChat
//         messages={this.state.messages}
//         onSend={this.onSend}
//         user={{
//           _id: 1,
//         }}
//       />
//     )
//   }
// }
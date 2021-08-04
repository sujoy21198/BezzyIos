import React, { Component } from 'react';
import { View, ScrollView, Text, Button, StyleSheet, FlatList, TextInput, Image, TouchableOpacity, StatusBar, Platform, SafeAreaView, KeyboardAvoidingView, Keyboard, ActivityIndicator } from 'react-native';
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
      isKeyboardOpened: false
    }
    this.state.friendsId = this.props.route.params.friendId
    this.state.friendImage = this.props.route.params.friendImage
    this.state.friendName = this.props.route.params.friendName
    //alert(this.state.friendName)
  }

  UNSAFE_componentWillMount () {
      this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this._keyboardDidShow);
      this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this._keyboardDidHide);
  }

  _keyboardDidShow = () => this.setState({isKeyboardOpened: true})

  _keyboardDidHide = () => this.setState({isKeyboardOpened: false})
  
  componentWillUnmount () {
      this.keyboardDidShowListener.remove();
      this.keyboardDidHideListener.remove();
  }

  componentDidMount() {
    this.getUserId()
    //this.imageToBase64Converter()
    setInterval(() => this.getInboxChats("0"), 4000)

  }

  getUserId = async () => {
    let value = await AsyncStorage.getItem('userId')
    this.setState({ userId: value })
    this.getInboxChats("0")
    this.readChats()
  }

  readChats = async() => {
    let userId = await AsyncStorage.getItem("userId");
    await axios.get(DataAccess.BaseUrl + DataAccess.readUnreadChats + "/" + userId + "/" + this.props.route.params.friendId)
    .then(res => {
      console.log(res);
    })
    .catch(err => {
      console.log(err);
    })
  }

  getInboxChats = async (value) => {
    if (value === '0') {
      var messages = []
      await axios.get(DataAccess.BaseUrl + DataAccess.chatListInbox + this.state.userId + "/" + this.state.friendsId + "/1")
        .then(function (response) {
          messages = response.data.chat_history_list
          // console.log(response.data.chat_history_list)
        }).catch(function (error) {
          console.log(error)
        })
      this.setState({ message: messages })
      //this.setState({ message: this.state.message.concat(messages) })
      //this.state.message = this.state.message.concat(messages)
      this.setState({ isFetching: false })
    }
  }

  pagination = async () => {
    var messages = []
    await axios.get(DataAccess.BaseUrl + DataAccess.chatListInbox + this.state.userId + "/" + this.state.friendsId + "/" + this.state.page)
      .then(function (response) {
        messages = response.data.chat_history_list
        console.log(response.data.chat_history_list)
      }).catch(function (error) {
        console.log(error)
      })
    //this.setState({ message: messages })
    this.setState({ message: this.state.message.concat(messages) })
    //this.state.message = this.state.message.concat(messages)
    this.setState({ isFetching: false })
  }

  sendMessage = async () => {
    if(this.state.myMessage.trim() === "") return;
    this.RBSheet.open()
    await axios.post(DataAccess.BaseUrl + DataAccess.addChatData, {
      "from_userID": this.state.userId,
      "to_userID": this.state.friendsId,
      "chat_message": this.state.myMessage
    }).then(function (response) {
      console.log(response.data)
    }).catch(function (error) {
      console.log(error)
    })
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
    console.log(value.code, "fuck me")
    this.setState({ myMessage: this.state.myMessage + value.code })
    this.setState({ show: false })

  }
  // onRefresh = () => {
  //   this.setState({ isFetching: true }, function () { this.getInboxChats() });
  // }
  handleLoadMore = () => {
    this.setState({ page: this.state.page + 1 }, this.pagination)
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
      maxFiles: 5
    })
      .then(images => {
        this.state.imagePath = images.path
        this.setState({ isImagePathPresent: true })
        this.setState({ imagesArray: images })
        this.postImageToChat()
        console.log(this.state.imagesArray)
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
      await axios.post(DataAccess.BaseUrl + DataAccess.addChatDataImage, formData)
        .then(function (response) {
          console.log(response.data, "HOHOHO HAHAHAHAHAHA")
        }).catch(function (error) {
          console.log(error)
        })


      this.getInboxChats("0")
    }
  }

  // imageToBase64Converter = () => {
  //   console.log("hulo khulo")
  //   ImgToBase64.getBase64String(' file:///data/user/0/com.bezzy/cache/react-native-image-crop-picker/IMG-20210516-WA0002.jpg')
  //     .then(base64String => console.log(base64String))
  //     .catch(err => console.log(err));
  // }


  render() {
    return (
      <SafeAreaView 
        style={{
          flex: 1,
          backgroundColor: '#fff'
        }}        
      >
        <StatusBar backgroundColor="#69abff" barStyle="light-content" />
        <TouchableOpacity
          style={{
              paddingHorizontal: widthToDp("2%"),
              height: heightToDp("6%"),
              flexDirection: 'row',
              alignItems: 'center',
              borderBottomWidth: 1,
              borderBottomColor: "#ececec",
          }}
          activeOpacity={0.7}
          onPress={() => this.props.navigation.goBack()}
      >
          <Icon 
            name="chevron-left"
            size={Platform.isPad ? 40 : 20}
            color={"#69abff"}                        
          />
          <Image
          source={{ uri: this.state.friendImage }}
          style={{height: Platform.isPad ? 80 : 40, width: Platform.isPad ? 80 : 40, borderRadius: Platform.isPad ? 80 / 2 : 40 / 2, marginLeft: widthToDp("1%")}}
          resizeMode="contain"
          />
          <Text
              style={{
                  marginLeft: widthToDp("2%"),
                  fontSize: widthToDp("3.6%"),
                  fontFamily: "ProximaNova-Black"
              }}
          >
            {this.state.friendName}
          </Text>
        </TouchableOpacity>
        <KeyboardAvoidingView behavior="padding" style={{flex: 1}}>
            <View style={{flex: 0.935}}>
              <FlatList
                data={this.state.message}
                keyExtractor={(item, index) => String(index)}
                inverted={true}
                ListFooterComponent={<View style={{height: heightToDp("5%")}}/>}
                style={{ backgroundColor: '#fff', height: heightToDp("80%"), padding: widthToDp("2%") }}
                // onRefresh={() => this.onRefresh()}
                // refreshing={this.state.isFetching}
                onEndReached={this.handleLoadMore}
                onEndReachedThreshold={0}
                //ListFooterComponent={this.renderFooter}
                renderItem={({ item }) =>
                  item &&
                  <View>

                    {
                      item.message_by === 'self' && item.type === 'text' ? 
                      <View style={{ 
                        backgroundColor: '#007dfe',
                        paddingVertical: heightToDp('0.5%'),
                        width: widthToDp("40%"), 
                        borderTopLeftRadius: 10,
                        borderTopRightRadius: 10,
                        borderBottomLeftRadius: 10, 
                        marginBottom: heightToDp("2%"), 
                        alignSelf: 'flex-end', 
                        marginBottom: heightToDp("2%") 
                      }}>
                        <Autolink
                          component={Text}
                          text={item.chat_message}
                          style={{ 
                            marginLeft: widthToDp("2%"), 
                            color: 'white', 
                            fontSize: widthToDp("3.3%"), 
                            fontFamily: "Poppins-Regular" 
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
                        <Text style={{ marginRight: widthToDp("3%"), color: 'white', alignSelf: 'flex-end', fontSize: widthToDp("3%"), marginTop: heightToDp("1%"), fontFamily: "Poppins-Regular" }}>{item.chat_msg_time}</Text>
                        <Ionicons
                        name={Platform.OS==='android' ? 'md-checkmark-done-outline' : 'ios-checkmark-done-outline'}
                        size={Platform.isPad ? 30 : 15}
                        color="#fff"
                        style={{alignSelf: 'flex-end', marginRight: widthToDp("2%")}}
                        />
                      </View> : ((item.message_by === 'self' && item.type === 'image') ?
                        <View 
                          style={{ 
                            backgroundColor: '#007dfe',
                            marginBottom: heightToDp("2%"), 
                            width: widthToDp("50%"), 
                            alignSelf: 'flex-end',
                            borderTopLeftRadius: 20,
                            borderTopRightRadius: 20,
                            borderBottomLeftRadius: 20,  
                          }}>
                          <TouchableOpacity onPress={() => this.props.navigation.navigate('ChatImagePreviewScreen', { imageUrl: item.chat_message })}>
                            <Image
                              source={{ uri: item.chat_message }}
                              resizeMode="contain"
                              style={{ 
                                height: heightToDp("20%"), 
                                width: widthToDp("50%"), 
                                borderTopLeftRadius: 20,
                                borderTopRightRadius: 20,
                                borderBottomLeftRadius: 20, 
                              }}
                            />
                          </TouchableOpacity>

                          <Text style={{ 
                            position: 'absolute',
                            bottom: 20,
                            right: 5,
                            color: 'white', 
                            fontFamily: "Poppins-Regular"
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
                        </View> : ((item.message_by === 'other' && item.type === 'text') ? 
                        <View 
                          style={{ 
                            backgroundColor: '#ececec', 
                            paddingVertical: heightToDp('0.5%'),
                            width: widthToDp("40%"), 
                            borderTopRightRadius: 20,
                            borderBottomLeftRadius: 20,
                            borderBottomRightRadius: 20,
                            marginBottom: heightToDp("2%"), 
                            alignSelf: 'flex-start' 
                          }}>
                            <Autolink
                              component={Text}
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
                          <Text style={{ marginRight: widthToDp("3%"), color: 'black', alignSelf: 'flex-start', fontSize: widthToDp("2.5%"), marginLeft: widthToDp("2%"), marginTop: heightToDp("1%"), fontFamily: "Poppins-Regular" }}>{item.chat_msg_time}</Text>
                          <Ionicons
                          name={Platform.OS==='android' ? 'md-checkmark-done-outline' : 'ios-checkmark-done-outline'}
                          size={Platform.isPad ? 30 : 15}
                          color="#1b1b1b"
                          style={{alignSelf: 'flex-start', marginLeft: widthToDp("2%")}}
                          />
                        </View> : (((item.message_by === 'other' && item.type === 'image') ? 
                        <View style={{ 
                          backgroundColor: '#ececec',
                          marginBottom: heightToDp("2%"), 
                          width: widthToDp("50%"), 
                          alignSelf: 'flex-start', 
                        }}>
                          <TouchableOpacity onPress={() => this.props.navigation.navigate('ChatImagePreviewScreen', { imageUrl: item.chat_message })}>
                            <Image
                              source={{ uri: item.chat_message }}
                              style={{ 
                                height: heightToDp("20%"), 
                                width: widthToDp("50%"),
                                borderTopRightRadius: 20,
                                borderBottomLeftRadius: 20,
                                borderBottomRightRadius: 20,
                              }}
                              resizeMode="contain"
                            />
                          </TouchableOpacity>

                          <Text style={{ 
                            position: 'absolute',
                            bottom: 20,
                            left: 5,
                            color: 'white', 
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
                            color: 'white', 
                          }}
                          />
                        </View> : null))))
                    }
                  </View>

                }
              />
            </View>
            <View
              style={{
                flex: 0.065,
                borderTopWidth: 1,
                borderTopColor: '#ececec',
                paddingHorizontal: widthToDp('1%'),
                paddingVertical: this.state.isKeyboardOpened ? heightToDp("1%") : heightToDp("0%"),
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
                      height: heightToDp(`4%`),
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
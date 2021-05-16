import React, { Component } from 'react';
import { View, ScrollView, Text, Button, StyleSheet, FlatList, TextInput } from 'react-native';
import { Bubble, GiftedChat, Send, QuickReplies } from 'react-native-gifted-chat';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Icon from 'react-native-vector-icons/Ionicons';
import Icon2 from 'react-native-vector-icons/Entypo'
import axios from 'axios';
import DataAccess from '../../components/DataAccess';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { heightToDp, widthToDp } from '../../components/Responsive';
import EmojiBoard from 'react-native-emoji-board'
import ImagePicker from 'react-native-image-crop-picker';
import ImgToBase64 from 'react-native-image-base64';

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
      imagePath: ''
    }
    this.state.friendsId = this.props.route.params.friendId
  }

  componentDidMount() {
    this.getUserId()
    //this.imageToBase64Converter()
    //setInterval(() => this.getInboxChats(), 5000)

  }

  getUserId = async () => {
    let value = await AsyncStorage.getItem('userId')
    this.setState({ userId: value })
    this.getInboxChats()
  }

  getInboxChats = async () => {
    var messages = []
    await axios.get(DataAccess.BaseUrl + DataAccess.chatListInbox + this.state.userId + "/" + this.state.friendsId + "/" + this.state.page)
      .then(function (response) {
        messages = response.data.chat_history_list
        console.log(response.data.chat_history_list)
      }).catch(function (error) {
        console.log(error)
      })
    this.setState({ message: this.state.message.concat(messages) })
    this.setState({ isFetching: false })
    console.log(this.state.myMessage, "kO")
  }

  sendMessage = async () => {
    this.setState
    await axios.post(DataAccess.BaseUrl + DataAccess.addChatData, {
      "from_userID": this.state.userId,
      "to_userID": this.state.friendsId,
      "chat_message": this.state.myMessage
    }).then(function (response) {
      console.log(response.data)
    }).catch(function (error) {
      console.log(error)
    })
    this.getInboxChats()
    this.state.myMessage = ""
  }

  startEmoji = () => {
    //alert("ji")
    this.setState({ show: true })
  }

  endEmoji = (value) => {
    console.log(value.code, "fuck me")
    this.setState({ myMessage: value.code })
    this.setState({ show: false })

  }
  // onRefresh = () => {
  //   this.setState({ isFetching: true }, function () { this.getInboxChats() });
  // }
  handleLoadMore = () => {
    this.setState({ page: this.state.page + 1 }, this.getInboxChats)
  }

  // renderFooter = () => {
  //   return()
  // }


  openImageSelection = () => {

    ImagePicker.openPicker({
      width: 300,
      height: 200,
      cropping: true,
      multiple: true
    })
      .then(images => {
        this.state.imagePath = images[0].path
        console.log(this.state.imagePath)
        ImgToBase64.getBase64String(images[0].path)
          .then(base64String => console.log(base64String))
          .catch(err => console.log(err));
        //this.setState({imagePath : images[0].path}) 
      })
      .catch(err => {
        console.log(' Error fetching images from gallery ', err);
      });
    //console.log(this.state.imagePath)
  }

  // imageToBase64Converter = () => {
  //   console.log("hulo khulo")
  //   ImgToBase64.getBase64String(' file:///data/user/0/com.bezzy/cache/react-native-image-crop-picker/IMG-20210516-WA0002.jpg')
  //     .then(base64String => console.log(base64String))
  //     .catch(err => console.log(err));
  // }


  render() {
    return (
      <View style={{
        position: 'absolute',
        bottom: 0,
        width: widthToDp("100%"),
        marginBottom: heightToDp("2%")
      }}>
        <FlatList
          data={this.state.message}
          keyExtractor={item => item.id}
          inverted={true}
          style={{ backgroundColor: '#fff', height: heightToDp("70%") }}
          // onRefresh={() => this.onRefresh()}
          // refreshing={this.state.isFetching}
          onEndReached={this.handleLoadMore}
          onEndReachedThreshold={0}
          //ListFooterComponent={this.renderFooter}
          renderItem={({ item }) =>

            <View>
              {
                item.message_by === 'self' ? <View style={{ backgroundColor: 'blue', height: heightToDp("5%"), width: widthToDp("40%"), borderRadius: 20, marginBottom: heightToDp("2%"), alignSelf: 'flex-end', marginBottom: heightToDp("4%") }}>
                  <Text style={{ marginLeft: widthToDp("2%"), color: 'white' }}>{item.chat_message}</Text>
                </View> : <View style={{ backgroundColor: 'white', height: heightToDp("5%"), width: widthToDp("40%"), borderRadius: 20, marginBottom: heightToDp("2%"), alignSelf: 'flex-start' }}>
                  <Text style={{ marginLeft: widthToDp("2%") }}>{item.chat_message}</Text>
                </View>
              }
            </View>

          }
        />
        <View style={{ flexDirection: 'row', alignSelf: 'center' }}>
          <Icon2
            name="emoji-happy"
            size={25}
            onPress={() => this.startEmoji()}
            style={{ color: 'blue', marginRight: widthToDp("2%") }}
          />
          <EmojiBoard showBoard={this.state.show} onClick={(value) => this.endEmoji(value)} />
          <Icon2
            name="image"
            size={25}
            style={{ color: 'blue', marginRight: widthToDp("2%") }}
            onPress={() => this.openImageSelection()}
          />
          <View style={{ flexDirection: 'row', borderRadius: 10, borderWidth: 1, height: heightToDp("5%") }}>
            <TextInput
              placeholder={'Type your message'}
              value={this.state.myMessage}
              placeholderTextColor={'#000'}
              style={{ borderColor: 'blue', borderRadius: 2, marginBottom: heightToDp("2%"), width: widthToDp("70%"), color: '#000', height: heightToDp("5%") }}
              onChangeText={(text) => this.setState({ myMessage: text })}
            />
            <Icon
              name="send"
              size={25}
              style={{ marginTop: heightToDp("0.8%"), color: 'blue', marginRight: widthToDp("2%") }}
              onPress={() => this.sendMessage()}
            />
          </View>

        </View>

      </View>
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
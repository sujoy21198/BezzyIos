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



const DATA = [
  {
    id: 'bd7acbea-c1b1-46c2-aed5-3ad53abb28ba',
    title: 'First Item',
  },
  {
    id: '3ac68afc-c605-48d3-a4f8-fbd91aa97f63',
    title: 'Second Item',
  },
  {
    id: '58694a0f-3da1-471f-bd96-145571e29d72',
    title: 'Third Item',
  },
];

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
      show:false
    }
    this.state.friendsId = this.props.route.params.friendId
  }

  componentDidMount() {
    this.getUserId()
    setInterval(() => this.getInboxChats(), 7000)

  }

  getUserId = async () => {
    let value = await AsyncStorage.getItem('userId')
    this.setState({ userId: value })
    this.getInboxChats()
  }

  getInboxChats = async () => {
    var messages = []
    await axios.get(DataAccess.BaseUrl + DataAccess.chatList + this.state.userId + "/" + this.state.friendsId + "/1")
      .then(function (response) {
        messages = response.data.chat_history_list
        console.log(response.data.chat_history_list)
      }).catch(function (error) {
        console.log(error)
      })
    this.setState({ message: messages })
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
  }

  startEmoji = () => {
    this.state.show = true
  }

  endEmoji = (value) => {
    alert(value)
    this.state.show = false

  }
  render() {
    return (
      <View style={{
        position: 'absolute',
        bottom: 0,
        width: widthToDp("100%"),
      }}>
        <FlatList
          data={this.state.message}
          keyExtractor={item => item.id}
          inverted={true}
          renderItem={({ item }) =>

            <View>
              {
                item.message_by === 'self' ? <View style={{ backgroundColor: 'blue', height: heightToDp("5%"), width: widthToDp("40%"), borderRadius: 20, marginBottom: heightToDp("2%"), alignSelf: 'flex-end' }}>
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
          />
          <EmojiBoard showBoard={this.state.show} onClick={(value) =>this.endEmoji(value)} />
          <Icon2
            name="image"
            size={25}

          />
          <View style={{ flexDirection: 'row', borderRadius: 10, borderWidth: 1 }}>
            <TextInput
              placeholder={'Type your message'}
              placeholderTextColor={'#000'}
              style={{ borderColor: '#000', marginBottom: heightToDp("2%"), width: widthToDp("80%"), color: '#000' }}
              onChangeText={(text) => this.setState({ myMessage: text })}
            />
            <Icon
              name="send"
              size={25}
              style={{ marginTop: heightToDp("0.2%") }}
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
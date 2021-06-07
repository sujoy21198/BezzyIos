import React, { Component } from 'react'
import {View,TouchableOpacity,Text} from 'react-native'
import {notificationManager} from './NotificationManager'
import { AppEnvironmentService } from '../Service/AppEnvironmentService';

export default class Notification extends Component{
    constructor(props){
        super(props);
    }

    onPressSendNotification = () =>  {
        var notification = notificationManager;
        var senderID = "717896799169";
        notification.configure(this.onRegister,this.onNotification,this.onOpenNotification,senderID);
        notification.showNotification(
          1,
          AppEnvironmentService.GetCurrentApp(),
          "Order taken thank you.",
          {},//data
          {},//options
        );
        
      }

      onRegister(token){
        console.log("[NotificationManager] Registered", token);
      }
    
      onNotification(notify){
        console.log("[NotificationManager] onNotification", notify);
      }
    
      onOpenNotification(notify){
        console.log("[NotificationManager] onOpenNotification", notify);
        alert("Open Notification")
      }
      
    render(){
        return(
            <View>
                <TouchableOpacity
                onPress={this.onPressSendNotification}
                >
                    <Text>Send norti</Text>
                </TouchableOpacity>
                <TouchableOpacity>
                    <Text>Close</Text>
                </TouchableOpacity>
            </View>
        );
    }
}
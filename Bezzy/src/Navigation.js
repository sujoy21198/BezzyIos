import React from 'react';
import {NavigationContainer} from '@react-navigation/native'
import {createStackNavigator} from '@react-navigation/stack';
import LandingScreen from './screens/LandingScreen';
import SignInScreen from './screens/LoginStack/SignInScreen';
import SignUpScreen from './screens/LoginStack/SignUpScreen';
import ForgotPassword from './screens/LoginStack/ForgotPassword';
import OtpVerify from './screens/LoginStack/OtpVerify';
import HomeScreen from './screens/HomeStack/HomeScreen';
import ChatScreen from './screens/HomeStack/ChatScreen';
import SearchScreen from './screens/HomeStack/SearchScreen';
import ProfileScreen from './screens/HomeStack/ProfileScreen';
import FollowingScreen from './screens/HomeStack/FollowingScreen';
import FollowerScreen from './screens/HomeStack/FollowerScreen';
import BlockList from './screens/HomeStack/BlockList';
import EditProfileScreen from './screens/HomeStack/EditProfileScreen';
import MessageScreen from './screens/HomeStack/MessageScreen';
import PostScreen from './screens/HomeStack/PostScreen';
import ChangePassword from './screens/HomeStack/ChangePassword';
import ResetPassword from './screens/LoginStack/ResetPassword';
import ImagePreviewScreen from './screens/HomeStack/ImagePreviewScreen';
import CommentScreen from './screens/HomeStack/CommentScreen';
import NotificationScreen from './screens/HomeStack/NotificationScreen';
import Terms from './screens/LoginStack/Terms';
import InboxScreen from './screens/HomeStack/InboxScreen'
import ThreadCommentScreen from './screens/HomeStack/ThreadCommentScreen'
import ChatImagePreviewScreen from './screens/HomeStack/ChatImagePreviewScreen'
import PostLikedUsersList from './screens/HomeStack/PostLikedUsersList';
import InviteContactScreen from './screens/HomeStack/InviteContactScreen';
import Settings from './screens/HomeStack/Settings';
import FollowRequests from "./screens/HomeStack/FollowRequests";

const Stack = createStackNavigator();

const Navigation = () => (
    <NavigationContainer>
        <Stack.Navigator screenOptions={{animationEnabled: false}}>
            <Stack.Screen name="LandingScreen" component={LandingScreen} options={{headerShown: false}}/>
            <Stack.Screen name="SignInScreen" component={SignInScreen} options={{headerShown: false}}/>
            <Stack.Screen name="SignUpScreen" component={SignUpScreen} options={{headerShown: false}}/>
            <Stack.Screen name="ForgotPassword" component={ForgotPassword} options={{headerShown: false}}/>
            <Stack.Screen name="OtpVerify" component={OtpVerify} options={{headerShown: false}}/>
            <Stack.Screen name="HomeScreen" component={HomeScreen} options={{headerShown: false}}/>
            <Stack.Screen name="ChatScreen" component={ChatScreen} options={{headerShown: false}}/>
            <Stack.Screen name="SearchScreen" component={SearchScreen} options={{headerShown: false}}/>
            <Stack.Screen name="ProfileScreen" component={ProfileScreen} options={{headerShown: false}}/>
            <Stack.Screen name="FollowingScreen" component={FollowingScreen} options={{headerShown: false}}/>
            <Stack.Screen name="FollowerScreen" component={FollowerScreen} options={{headerShown: false}}/>
            <Stack.Screen name="BlockList" component={BlockList} options={{headerShown: false}}/>
            <Stack.Screen name="EditProfileScreen" component={EditProfileScreen} options={{headerShown: false}}/>
            <Stack.Screen name="MessageScreen" component={MessageScreen} options={{headerShown: false}}/>
            <Stack.Screen name="PostScreen" component={PostScreen} options={{headerShown: false}}/>
            <Stack.Screen name="ChangePassword" component={ChangePassword} options={{headerShown: false}}/>
            <Stack.Screen name="ResetPassword" component={ResetPassword} options={{headerShown: false}}/>
            <Stack.Screen name="ImagePreviewScreen" component={ImagePreviewScreen} options={{headerShown: false}}/>
            <Stack.Screen name="CommentScreen" component={CommentScreen} options={{headerShown: false}}/>
            <Stack.Screen name="NotificationScreen" component={NotificationScreen} options={{headerShown: false}}/>
            <Stack.Screen name="Terms" component={Terms} options={{headerShown: false}}/>
            <Stack.Screen name="InboxScreen" component={InboxScreen} options={{headerShown : false}}/>
            <Stack.Screen name = "ThreadCommentScreen" component={ThreadCommentScreen} options={{headerShown:false}}/>
            <Stack.Screen name="ChatImagePreviewScreen" component={ChatImagePreviewScreen} options={{headerShown:false}}/>
            <Stack.Screen name="PostLikedUsersList" component={PostLikedUsersList} options={{headerShown : false}}/>
            <Stack.Screen name="InviteContactScreen" component={InviteContactScreen} options={{headerShown : false}}/>
            <Stack.Screen name="Settings" component={Settings} options={{headerShown : false}}/>
            <Stack.Screen name="FollowRequests" component={FollowRequests} options={{headerShown : false}}/>
        </Stack.Navigator>
    </NavigationContainer>
)

export default Navigation;
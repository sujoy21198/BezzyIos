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

const Stack = createStackNavigator();

const Navigation = () => (
    <NavigationContainer>
        <Stack.Navigator>
            <Stack.Screen name="LandingScreen" component={LandingScreen} options={{headerShown: false}}/>
            <Stack.Screen name="SignInScreen" component={SignInScreen} options={{headerShown: false}}/>
            <Stack.Screen name="SignUpScreen" component={SignUpScreen} options={{headerShown: false}}/>
            <Stack.Screen name="ForgotPassword" component={ForgotPassword} options={{headerShown: false}}/>
            <Stack.Screen name="OtpVerify" component={OtpVerify} options={{headerShown: false}}/>
            <Stack.Screen name="HomeScreen" component={HomeScreen} options={{headerShown: false}}/>
            <Stack.Screen name="ChatScreen" component={ChatScreen} options={{headerShown: false}}/>
            <Stack.Screen name="SearchScreen" component={SearchScreen} options={{headerShown: false}}/>
            <Stack.Screen name="ProfileScreen" component={ProfileScreen} options={{headerShown: false}}/>
        </Stack.Navigator>
    </NavigationContainer>
)

export default Navigation;
import React from 'react';
import {NavigationContainer} from '@react-navigation/native'
import {createStackNavigator} from '@react-navigation/stack';
import LandingScreen from './screens/LandingScreen';
import SignInScreen from './screens/LoginStack/SignInScreen';
import SignUpScreen from './screens/LoginStack/SignUpScreen';
import ForgotPassword from './screens/LoginStack/ForgotPassword';
import OtpVerify from './screens/LoginStack/OtpVerify';

const Stack = createStackNavigator();

const Navigation = () => (
    <NavigationContainer>
        <Stack.Navigator>
            <Stack.Screen name="LandingScreen" component={LandingScreen} options={{headerShown: false}}/>
            <Stack.Screen name="SignInScreen" component={SignInScreen} options={{headerShown: false}}/>
            <Stack.Screen name="SignUpScreen" component={SignUpScreen} options={{headerShown: false}}/>
            <Stack.Screen name="ForgotPassword" component={ForgotPassword} options={{headerShown: false}}/>
            <Stack.Screen name="OtpVerify" component={OtpVerify} options={{headerShown: false}}/>
        </Stack.Navigator>
    </NavigationContainer>
)

export default Navigation;
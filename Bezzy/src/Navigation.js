import React from 'react';
import {NavigationContainer} from '@react-navigation/native'
import {createStackNavigator} from '@react-navigation/stack';
import LandingScreen from './LandingScreen';

const Stack = createStackNavigator();

const Navigation = () => (
    <NavigationContainer>
        <Stack.Navigator>
            <Stack.Screen name="LandingScreen" component={LandingScreen} options={{headerShown: false}}/>
        </Stack.Navigator>
    </NavigationContainer>
)

export default Navigation;
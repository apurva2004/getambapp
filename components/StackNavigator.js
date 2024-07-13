import { View, Text } from 'react-native'
import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import Login from '../screens/Login';
import PatientHome1 from '../screens/PatientHome1';
import DriverHome1 from '../screens/DriverHome1';
import Register from '../screens/Register';
import UserBooking from '../screens/UserBooking';
import DriverBooking from '../screens/DriverBooking';
import AboutUs from '../screens/AboutUs';
import ContactUs from '../screens/ContactUs';
import PrivacyPolicy from '../screens/PrivacyPolicy';


const Stack = createNativeStackNavigator();

const StackNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
        <Stack.Group>
            <Stack.Screen name="Login" component={Login}></Stack.Screen>

            <Stack.Screen name="Register" component={Register}></Stack.Screen>

            <Stack.Screen name="Patient1" component={PatientHome1}></Stack.Screen>

            <Stack.Screen name="Driver1" component={DriverHome1}></Stack.Screen>

            <Stack.Screen name="UserBooking" component={UserBooking}></Stack.Screen>

            <Stack.Screen name="DriverBooking" component={DriverBooking}></Stack.Screen>
            
        </Stack.Group>   
        </Stack.Navigator>
    
   
  )
}

export default StackNavigator
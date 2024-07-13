import {NavigationContainer} from '@react-navigation/native'
import StackNavigator from './components/StackNavigator';
import { createStackNavigator } from '@react-navigation/stack';
import React, { useState } from 'react';


const Stack = createStackNavigator();
const App = ()=> {
  

  return (
    
    <NavigationContainer>
       <StackNavigator/>
    </NavigationContainer>

  );
};


export default App;
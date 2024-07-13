import { View, Text, StyleSheet, Pressable, Alert, TextInput, SafeAreaView, Image } from 'react-native'
import React, { useState } from 'react'
import { useNavigation } from '@react-navigation/native'
import { FIREBASE_AUTH } from '../firebase'
import { createUserWithEmailAndPassword, } from 'firebase/auth'
import { addDoc, collection, query, where, getDocs, deleteDoc, doc, setDoc } from 'firebase/firestore'
import { FIRESTORE_DB } from '../firebase';

const Register = () => {
  const navigation = useNavigation()
  const firestore = FIRESTORE_DB
  const [email, setEmail] = useState('');
  const [password, setPass] = useState('');
  const [number, setNumber] = useState('');
  const auth = FIREBASE_AUTH

  const handleSignUp = async () => {
    try {
      const response = await createUserWithEmailAndPassword(auth, email, password)
      sendUserData()
      navigation.navigate('Login')
    }
    catch (error) { 
      
      Alert.alert('Error', "Some Error occured", [
        { text: 'OK', onPress: () => console.log(error) },
      ]);
    }
  }

  const sendUserData = async () => {
    const doc = await addDoc(collection(firestore, 'users'), {
      number: number,
      email: email,
      password: password
    })


  }

  return (
    <View style={styles.container}>

      <Image style={{ width: 100, height: 50 }}
        source={require('../assets/ambulanceIcon.png')} />

      <Text style={styles.heading}>Welcome To Careflight</Text>

      <SafeAreaView style={{ width: '70%' }}>

        <Text style={styles.labelText}>Phone Number</Text>
        <TextInput
          style={styles.input}
          type="text"
          value={number}
          onChangeText={setNumber}
        // placeholder='Phone No.'
        />

        <Text style={styles.labelText}>Email</Text>
        <TextInput
          style={styles.input}
          type="text"
          value={email}
          onChangeText={setEmail}
        />

        <Text style={styles.labelText}>Password</Text>
        <Text style={{marginBottom: 5}}>Should at least be 6 characters</Text>
        <TextInput
          style={styles.input}
          type='password'
          value={password}
          onChangeText={setPass}
        // placeholder='Password'
        />
      </SafeAreaView>

      <View style={styles.buttonContainer}>
        <Pressable onPress={() => { handleSignUp() }} style={styles.btn}>
          <Text style={styles.btnText}>Sign Up</Text>
        </Pressable>
      </View>
    </View>
  )
}

export default Register

const styles = StyleSheet.create({
  container: {
    paddingTop: 50,
    backgroundColor: '#d0d4f2',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
    width: '100%',
  },

  heading: {
    color: '#091fbd',
    fontWeight: '900',
    fontSize: 30,
    margin: 20,
  },

  labelText: {
    fontSize: 16,
    fontWeight: 'bold',
    borderRadius: 8,
    color: '#3141b5',
  },

  input: {
    fontSize: 15,
    color: 'black',
    marginBottom: 10,
    backgroundColor: '#96a0e3',
    padding: 5,
    borderRadius: 8,
  },


  buttonContainer: {
    margin: 10,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
  },

  btn: {
    borderRadius: 8,
    padding: 6,
    height: 50,
    width: '40%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#3f4ba1',
    margin: 5,
  },

  btnText: {
    fontSize: 16,
    color: 'white',
    fontWeight: 'bold'
  }

});
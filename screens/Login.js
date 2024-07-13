import { View, Text, StyleSheet, Pressable, Alert, TextInput, SafeAreaView, Image } from 'react-native'
import React, { useState } from 'react'
import { useNavigation } from '@react-navigation/native'
import { FIREBASE_AUTH } from '../firebase'
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth'

const Login = () => {
  const navigation = useNavigation()
  const [email, setEmail] = useState('');
  const [password, setPass] = useState('');
  const auth = FIREBASE_AUTH



  const handleSignUp = async () => {
    // try {
    //   const response = await createUserWithEmailAndPassword(auth, email, password)
    //   console.log(response.user)
    // }
    // catch (error) { console.log(error) }
    navigation.navigate('Register')
  }

  const handlePatientLogin = async () => {
    try {
      const response = await signInWithEmailAndPassword(auth, email, password)
      console.log(response.user.email)
      Alert.alert('Confirmation', 'Logged in as Patient', [
        { text: 'OK', onPress: () => navigation.navigate("Patient1", [email, "patient"]) },
      ]);
    }
    catch (error) {
      Alert.alert('Error', "Some Error occured", [
        { text: 'OK', onPress: () => console.log(error) },
      ]);
    }
  }

  const handleDriverLogin = async () => {
    try {
      const response = await signInWithEmailAndPassword(auth, email, password)
      console.log(response.user.email)
      Alert.alert('Confirmation', 'Logged in as Driver', [
        { text: 'OK', onPress: () => navigation.navigate("Driver1", [email]) },
      ]);
    }
    catch (error) {
      Alert.alert('Error', "Some Error occured", [
        { text: 'OK', onPress: () => console.log(error) },
      ]);
    }
  }



  const handlePatient = () => {
    Alert.alert('Confirmation', 'Logged in as Patient', [
      { text: 'OK', onPress: () => navigation.navigate("Patient") },
    ]);
    setEmail(''); setPass('');
  }

  const handleDriver = () => {
    Alert.alert('Confirmation', 'Logged in as Driver', [
      { text: 'OK', onPress: () => navigation.navigate("AmbuSelect") },
    ]);
    setEmail(''); setPass('');
  }



  return (
    <View style={styles.container}>

      <Image style={{ width: 100, height: 50 }}
        source={require('../assets/ambulanceIcon.png')} />

      <Text style={styles.heading}>Welcome To Careflight</Text>

      <SafeAreaView style={{ width: '70%' }}>
        <Text style={styles.labelText}>Email</Text>
        <TextInput
          style={styles.input}
          type="text"
          value={email}
          onChangeText={setEmail}
        // placeholder='Phone No.'
        />
        <Text style={styles.labelText}>Password</Text>
        <TextInput
          style={styles.input}
          type='password'
          value={password}
          onChangeText={setPass}
        // placeholder='Password'
        />
      </SafeAreaView>

      <View style={styles.buttonContainer}>
        <Pressable onPress={handleSignUp} style={styles.btn}>
          <Text style={styles.btnText}>SIGN UP!</Text>
        </Pressable>

        <Pressable onPress={handlePatientLogin} style={styles.btn}>
          <Text style={styles.btnText}>Login as Patient</Text>
        </Pressable>

        <Pressable onPress={handleDriverLogin} style={styles.btn}>
          <Text style={styles.btnText}>Login as Driver</Text>
        </Pressable>


      </View>
    </View>
  )
}

export default Login

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
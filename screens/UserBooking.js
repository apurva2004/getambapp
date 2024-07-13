import { StyleSheet, Text, View, Pressable, Image, Linking } from 'react-native'
import React from 'react'
import { useState, useEffect } from 'react'
import { collection, query, where, getDocs } from 'firebase/firestore'
import { FIRESTORE_DB } from '../firebase'
import { useNavigation } from '@react-navigation/native'

const UserBooking = ({ route }) => {
 
    const { driverUser } = route.params
    const [driverNum, setDriverNum] = useState(null)
    const navigation = useNavigation()

    useEffect(() => {
        const getDriverNumber = async () => {
            const driverNameQuery = query(collection(FIRESTORE_DB, 'users'), where('email', '==', driverUser));
            const driverNameSnapshot = await getDocs(driverNameQuery);

            if (!driverNameSnapshot.empty) {
                const driverNumber = driverNameSnapshot.docs[0].data().number;
                setDriverNum(driverNumber)
            }
        }

        getDriverNumber()
    }, []);

    return (
        <View style={{
            marginTop: 150,
            alignItems: 'center',
            width: '100%',
        }}>
            <Text style={{ fontSize: 50, fontWeight: 'bold', color: '#001f2b', textAlign:'center'}}>Ambulance Booked!</Text>
            <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#001f2b', marginVertical:20}}>Your Driver will be there shortly.</Text>

            <Image style={{ width: 200, height: 150, marginVertical: 10}}
                source={require('../assets/ambulancegif.gif')} />

            <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#001f2b'}}>Phone Number</Text>
            <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#001f2b' }}>{driverNum}</Text>
            <Pressable onPress={()=>{Linking.openURL(`tel:${driverNum}`)}}
                style={{
                borderRadius: 8,
                padding: 6,
                height: 45,
                width: '30%',
                justifyContent: 'center',
                alignItems: 'center',
                margin: 5,
                backgroundColor: 'darkgreen'
            }}>
                <Text style={{
                    fontSize: 18,
                    color: 'white',
                }}>Call</Text>
            </Pressable>

            <Pressable
            onPress={()=>{navigation.navigate('Login')}} 
            style={{
                borderRadius: 8,
                textAlign: 'center',
                textAlignVertical: 'center',
                height: 45,
                width: '30%',
                justifyContent: 'center',
                alignItems: 'center',
                margin: 5,
                backgroundColor: 'black',
                fontSize: 15,
                color: 'white',
            }}>
                <Text style={{
                    fontSize: 18,
                    color: 'white',
                }}>Cancel</Text>
            </Pressable>

        </View>

    )
}

export default UserBooking

const styles = StyleSheet.create({})
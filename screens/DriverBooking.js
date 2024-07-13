import { StyleSheet, Text, View, Pressable, Linking, Image } from 'react-native'
import React from 'react'
import { useState, useEffect } from 'react'
import { addDoc, collection, query, where, getDocs, doc, setDoc, updateDoc } from 'firebase/firestore'
import { FIRESTORE_DB } from '../firebase'
import { useNavigation } from '@react-navigation/native'

const DriverBooking = ({ route }) => {

    const patientUser = route.params[0]
    const patientLocation = route.params[1]
    const driverUser = route.params[2]

    const [patientNum, setPatientNum] = useState(null)
    const naviation = useNavigation()

    useEffect(() => {
        const getPatientNumber = async () => {
            const patientNameQuery = query(collection(FIRESTORE_DB, 'users'), where('email', '==', patientUser));
            const patientNameSnapshot = await getDocs(patientNameQuery);

            if (!patientNameSnapshot.empty) {
                const patientNumber = patientNameSnapshot.docs[0].data().number;
                setPatientNum(patientNumber)
            }
        }
        getPatientNumber()
    }, []);

    useEffect(() => {
        const confirmEmergency = async () => {
            const userQuery = query(collection(FIRESTORE_DB, 'driver'), where('user', '==', driverUser));
            const querySnapshot = await getDocs(userQuery);

            const document = querySnapshot.docs[0];
            const docRef = doc(FIRESTORE_DB, 'driver', document.id);



            await updateDoc(docRef, {
                patient: patientUser
            });

            console.log('Patient confirmed');
        }
        confirmEmergency();
    }, [])

    const openMapsApp = async () => {

        const latitude = patientLocation.latitude;
        const longitude = patientLocation.longitude;

        const url = `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;

        Linking.openURL(url).catch((err) => console.error('Error opening Maps app:', err));
    };

    const handleCompleted = async () => {
        const userQuery = query(collection(FIRESTORE_DB, 'driver'), where('user', '==', driverUser));
        const querySnapshot = await getDocs(userQuery);

        const document = querySnapshot.docs[0];
        const docRef = doc(FIRESTORE_DB, 'driver', document.id);

        await updateDoc(docRef, {
            onDuty: false,
            patient: null
        });
        
        naviation.navigate('Driver1', [driverUser])
        
    }


    return (
        <View style={{
            marginTop: 100,
            alignItems: 'center',
            width: '100%',

        }}>
            <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#001f2b' }}>Going to patient.</Text>

            <Image style={{ width: 70, height: 70, marginVertical: 10 }}
                source={require('../assets/driver.png')} />

            <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#001f2b' }}>{patientNum}</Text>
            <Pressable onPress={() => { Linking.openURL(`tel:${patientNum}`) }}
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
                onPress={openMapsApp}
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
                }}>OPEN MAP</Text>
            </Pressable>

            <Pressable onPress={handleCompleted}
                style={{
                    borderRadius: 8,
                    padding: 6,
                    height: 45,
                    width: '30%',
                    justifyContent: 'center',
                    alignItems: 'center',
                    margin: 5,
                    backgroundColor: 'darkblue'
                }}>
                <Text style={{
                    fontSize: 18,
                    color: 'white',
                }}>Completed</Text>
            </Pressable>

        </View>

    )
}

export default DriverBooking

const styles = StyleSheet.create({})
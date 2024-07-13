import { Pressable, StyleSheet, Text, View, Alert, Image } from 'react-native'
import { React, useState, useEffect } from 'react'
import { addDoc, collection, query, where, getDocs, doc, setDoc, updateDoc } from 'firebase/firestore'
import { FIRESTORE_DB } from '../firebase';
import * as Location from "expo-location";

import MapView from 'react-native-maps';
import { Marker } from 'react-native-maps';
import { PROVIDER_GOOGLE } from 'react-native-maps'

import { useNavigation } from '@react-navigation/native';


const DriverHome1 = ({ route }) => {

    const mapStyle = [
        {
            "featureType": "administrative",
            "elementType": "geometry",
            "stylers": [
                {
                    "visibility": "off"
                }
            ]
        },
        {
            "featureType": "administrative.neighborhood",
            "stylers": [
                {
                    "visibility": "off"
                }
            ]
        },
        {
            "featureType": "poi",
            "stylers": [
                {
                    "visibility": "off"
                }
            ]
        },
        {
            "featureType": "poi",
            "elementType": "labels.text",
            "stylers": [
                {
                    "visibility": "off"
                }
            ]
        },
        {
            "featureType": "road",
            "elementType": "labels",
            "stylers": [
                {
                    "visibility": "off"
                }
            ]
        },
        {
            "featureType": "road",
            "elementType": "labels.icon",
            "stylers": [
                {
                    "visibility": "off"
                }
            ]
        },
        {
            "featureType": "transit",
            "stylers": [
                {
                    "visibility": "off"
                }
            ]
        },
        {
            "featureType": "water",
            "elementType": "labels.text",
            "stylers": [
                {
                    "visibility": "off"
                }
            ]
        }
    ]

    const [isOnDuty, setDuty] = useState(false)
    const user = route.params[0]
    const navigation = useNavigation()


    const [currentLocation, setCurrentLocation] = useState(null);
    const [initialRegion, setInitialRegion] = useState(null);

    const [emergencies, setEmergencies] = useState([])

    const [mapNum, setMapNum] = useState(1);

    useEffect(() => {
        if (isOnDuty) {
            const getLocation = async () => {
                let { status } = await Location.requestForegroundPermissionsAsync();
                if (status !== "granted") {
                    console.log("Permission to access location was denied");
                    return;
                }

                let location = await Location.getCurrentPositionAsync({});
                setCurrentLocation(location.coords);

                setInitialRegion({
                    latitude: location.coords.latitude,
                    longitude: location.coords.longitude,
                    latitudeDelta: 0.3,
                    longitudeDelta: 0.3,
                });


                //new stuff
                const userQuery = query(collection(FIRESTORE_DB, 'driver'), where('user', '==', user));
                const querySnapshot = await getDocs(userQuery);

                if (!querySnapshot.empty) {
                    const document = querySnapshot.docs[0];
                    const docRef = doc(FIRESTORE_DB, 'driver', document.id);

                    await setDoc(docRef, {
                        location: { latitude: location.coords.latitude, longitude: location.coords.longitude },
                        user: user,
                        onDuty: true,
                        patient: null
                    });
                    // console.log('Document updated with ID:', document.id);
                }
                else {
                    const newDocRef = await addDoc(collection(FIRESTORE_DB, 'driver'), {
                        location: { latitude: location.coords.latitude, longitude: location.coords.longitude },
                        user: user,
                        patient: null
                    });
                    // console.log('New document added with ID:', newDocRef.id);
                }
            };

            getLocation();

            //new stuff
            const intervalId = setInterval(() => {
                getLocation();
            }, 10000);

            return () => clearInterval(intervalId);

        }
    }, [isOnDuty]);



    useEffect(() => {
        if (isOnDuty) {
            getEmergencies();

            const intervalId = setInterval(() => {
                getEmergencies();
            }, 5000);

            return () => clearInterval(intervalId);
        }
    }, [isOnDuty]);


    useEffect(() => {
        getEmergencies();
    }, [])


    const getEmergencies = async () => {
        const emergencyQuery = query(collection(FIRESTORE_DB, 'patient'));
        const querySnapshot = await getDocs(emergencyQuery);

        const emergencyData = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            location: doc.data().location,
            user: doc.data().user,
        }));

        // console.log("emergencyData", emergencyData) 
        setEmergencies((prevEmergencies) => {
            return emergencyData;
        });
        // console.log("emergencies", emergencies)
    }



    const setOffDuty = async () => {
        setDuty(false)
        const userQuery = query(collection(FIRESTORE_DB, 'driver'), where('user', '==', user));
        const querySnapshot = await getDocs(userQuery);

        const document = querySnapshot.docs[0];
        const docRef = doc(FIRESTORE_DB, 'driver', document.id);

        await updateDoc(docRef, {
            onDuty: false
        });

        console.log(isOnDuty);
    }

    return (
        <View style={{ alignItems: 'center', justifyContent: 'center' }}>

            <MapView provider={PROVIDER_GOOGLE} customMapStyle={mapStyle}
                style={{ height: '55%', width: '100%' }}
                initialRegion={initialRegion}>


                {emergencies.map((emer, index) => (
                    <Marker
                        key={emer.id}
                        coordinate={{ latitude: emer.location.latitude, longitude: emer.location.longitude }}>

                        <Image style={{ width: 25, height: 20 }}
                            source={require('../assets/emer.png')} />
                        <Text>{index+1}</Text>

                    </Marker>
                ))}

                {currentLocation && (
                    <Marker
                        coordinate={{
                            latitude: currentLocation.latitude,
                            longitude: currentLocation.longitude,
                        }}
                        title="Your Location"
                    />
                )}

            </MapView>


            <Pressable style={{ backgroundColor: 'black', padding: 20, borderRadius: 100, margin: 20 }}
                onPress={() => {
                    setDuty(!isOnDuty);
                    if (!isOnDuty) {
                        Alert.alert('Alert', 'Your location is now being shared', [
                            { text: 'OK', onPress: () => console.log('OK') },
                        ]);

                    } else {
                        setOffDuty();
                    }
                }}>
                {isOnDuty ? <Text style={{ fontWeight: 'bold', color: 'white', fontSize: 15 }}>On Duty</Text>
                    : <Text style={{ fontWeight: 'bold', color: 'white', fontSize: 15 }}>Off Duty</Text>}
            </Pressable>



            {isOnDuty ?
                <Text style={{ fontWeight: 900, fontSize: 22, marginBottom: 15 }}> EMERGENCIES </Text> : null}

            {(emergencies.length != 0 && isOnDuty) ?
                <>
                    {emergencies.map((emer, index) => (
                        <View key={emer.id} style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 5}}>
                            <Text style={{ marginHorizontal: 15 }}>{index + 1}. {emer.user}</Text>

                            <Pressable onPress={() => {
                                setOffDuty()
                                navigation.navigate('DriverBooking', [emer.user, emer.location, user])
                            }}
                                style={{ backgroundColor: 'darkblue', padding: 12, borderRadius: 10 }}>
                                <Text style={{ color: 'white', fontWeight: 'bold' }}>Confirm</Text>
                            </Pressable>
                        </View>
                    ))}
                </> : null}


        </View>
    )
}

export default DriverHome1

const styles = StyleSheet.create({})
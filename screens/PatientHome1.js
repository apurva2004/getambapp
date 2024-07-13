import { Pressable, StyleSheet, Text, View, Image } from 'react-native'
import React from 'react'
import { useState, useEffect } from 'react'
import MapView from 'react-native-maps';
import { Marker } from 'react-native-maps';
import { PROVIDER_GOOGLE } from 'react-native-maps'
import * as Location from "expo-location";
import { useNavigation } from '@react-navigation/native';

import { addDoc, collection, query, where, getDocs, deleteDoc, doc, setDoc } from 'firebase/firestore'
import { FIRESTORE_DB } from '../firebase';
import AboutUs from './AboutUs';
import ContactUs from './ContactUs';
import PrivacyPolicy from './PrivacyPolicy';

const PatientHome1 = ({ route }) => {

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


    const user = route.params[0]
    const type = route.params[1]
    const navigation = useNavigation()
    const firestore = FIRESTORE_DB


    const [currentLocation, setCurrentLocation] = useState(null);
    const [initialRegion, setInitialRegion] = useState(null);
    const [searching, setSearching] = useState(false)
    const [drivers, setDrivers] = useState([])

    useEffect(() => {
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
                latitudeDelta: 0.1,
                longitudeDelta: 0.1,
            });

        };

        getLocation();
    }, []);



    useEffect(() => {

        if (searching) {
            checkIfBooked();

            const intervalId = setInterval(() => {
                checkIfBooked();
            }, 3000);

            return () => clearInterval(intervalId);
        }

    }, [searching]);

    const checkIfBooked = async () => {
        try {
            const driverBookQuery = query(
                collection(FIRESTORE_DB, 'driver'),
                where('patient', '==', user),
                where('onDuty', '==', true)
              );
            const driverQuerySnapshot = await getDocs(driverBookQuery);

            if (!driverQuerySnapshot.empty) {

                const driverUser = driverQuerySnapshot.docs[0].data().user;
                console.log("Driver user:", driverUser);


                const patientQuery = query(collection(FIRESTORE_DB, 'patient'), where('user', '==', user));
                const patientQuerySnapshot = await getDocs(patientQuery);

                if (!patientQuerySnapshot.empty) {
                    const patientDocument = patientQuerySnapshot.docs[0];
                    const patientDocRef = doc(FIRESTORE_DB, 'patient', patientDocument.id);

                    // Set searching to false in the patient document
                    await deleteDoc(patientDocRef);

                    console.log("Patient booked and record deleted.");
                    setSearching(false)
                    navigation.navigate("UserBooking", { driverUser })

                } else {
                    console.log("Patient record not found.");
                }
            } else {
                console.log("No booking found for the patient.");
            }
        } catch (error) {
            console.error("Error checking if patient is booked:", error);
        }
    };


    useEffect(() => {
        getDrivers();

        const intervalId = setInterval(() => {
            getDrivers();
        }, 5000);

        return () => clearInterval(intervalId);

    }, []);



    const getDrivers = async () => {
        const emergencyQuery = query(collection(FIRESTORE_DB, 'driver'), where('onDuty', '==', true));
        const querySnapshot = await getDocs(emergencyQuery);

        if (!querySnapshot.empty) {

            const driverData = querySnapshot.docs.map((doc) => ({
                id: doc.id,
                location: doc.data().location,
                user: doc.data().user,
            }));

            setDrivers((prevDrivers) => {
                return driverData;
            });
        }
    }


    const sendUserData = async () => {
        const doc = await addDoc(collection(firestore, 'patient'), {
            location: { latitude: currentLocation.latitude, longitude: currentLocation.longitude },
            user: user
        })
    }

    const deletePatient = async () => {
        const patientQuery = query(collection(FIRESTORE_DB, 'patient'), where('user', '==', user));
        const patientQuerySnapshot = await getDocs(patientQuery);

        if (!patientQuerySnapshot.empty) {
            const patientDocument = patientQuerySnapshot.docs[0];
            const patientDocRef = doc(FIRESTORE_DB, 'patient', patientDocument.id);

            await deleteDoc(patientDocRef);

            console.log("Request deleted.");
            setSearching(false)
        }
    }

    useEffect(() => {
        return async () => { deletePatient() };
    }, []);


    return (
        <View style={{ alignItems: 'center', justifyContent: 'center' }}>
            {/* <MapView provider={PROVIDER_GOOGLE} customMapStyle={mapStyle}
                style={{ height: '55%', width: '100%' }}
                initialRegion={{
                    latitude: origin.latitude,
                    longitude: origin.longitude,
                    latitudeDelta: 0.1,
                    longitudeDelta: 0.1,
                }}>
                <Marker coordinate={{ ...origin }}>
                    {console.log(origin.latitude, origin.longitude)}
                    <Image style={{ width: 35, height: 35, resizeMode: 'cover' }}
                        source={require('../assets/yourLocation.png')} />
                </Marker>

            </MapView> */}

            {initialRegion ?
                <>
                    <MapView provider={PROVIDER_GOOGLE}
                        customMapStyle={mapStyle}
                        style={{ height: '55%', width: '100%' }}
                        initialRegion={initialRegion}>

                        {drivers.length != 0 ?
                            <>
                                {drivers.map((driver) => (
                                    <Marker
                                        key={driver.id}
                                        coordinate={{ latitude: driver.location.latitude, longitude: driver.location.longitude }}>

                                        <Image style={{ width: 25, height: 20 }}
                                            source={require('../assets/ambulance3.png')} />
                                    </Marker>
                                ))}
                            </> : null}


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

                    {!searching ? (
                        <Pressable onPress={() => { sendUserData(); setSearching(true); }}>
                            <Text style={styles.buttonText}>Book Ambulance</Text>
                        </Pressable>
                    ) : (
                        <View style={{ alignItems: 'center', marginTop: 50 }}>
                            <Image
                                source={require('../assets/loading.gif')}
                                style={{ width: 60, height: 60 }}
                            />
                            <Text style={{ fontSize: 20, marginTop: 20 }}>Searching</Text>
                            <Pressable onPress={deletePatient}>
                                <Text style={styles.cancelButton}>Cancel</Text>
                            </Pressable>
                        </View>
                    )}

<View style={styles.navButtonContainer}>
        <Pressable onPress={() => navigation.navigate('AboutUs')} style={styles.navButton}>
          <Text style={styles.navButtonText}>About Us</Text>
        </Pressable>
        <Pressable onPress={() => navigation.navigate('ContactUs')} style={styles.navButton}>
          <Text style={styles.navButtonText}>Contact Us</Text>
        </Pressable>
        <Pressable onPress={() => navigation.navigate('PrivacyPolicy')} style={styles.navButton}>
          <Text style={styles.navButtonText}>Privacy Policy</Text>
        </Pressable>
      </View>
                </> : null
           }
        </View>
    );
};

const styles = StyleSheet.create({ 
    navButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around', // Space out buttons evenly
    marginBottom: 30, // Add some margin at the bottom
    paddingHorizontal: 20, // Add some padding to the sides if necessary
  },
    buttonText: {
        backgroundColor: 'black',
        color: 'white',
        padding: 20,
        borderRadius: 20,
        marginTop: 20,
        fontSize: 20,
        fontWeight: 'bold',
    },
    cancelButton: {
        backgroundColor: 'darkred',
        color: 'white',
        padding: 10,
        borderRadius: 10,
        marginTop: 100,
        fontSize: 15,
        fontWeight: 'bold',
    },
    navButton: {
        backgroundColor: 'black',
        marginTop:240,
    padding: 5,
    borderRadius: 10,
    marginHorizontal: 10,
    },
    navButtonText: {
        color: 'white',
        fontSize: 20,
        fontWeight: 'bold',
      },
});

export default PatientHome1;
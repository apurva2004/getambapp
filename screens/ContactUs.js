import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const ContactUs = () => {
  return (
    <View style={styles.container}>
      <Text>Email: example@example.com</Text>
      <Text>Phone: +1234567890</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ContactUs;

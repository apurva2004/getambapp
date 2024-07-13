import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const AboutUs = () => {
  return (
    <View style={styles.container}>
      <Text>About Us Page</Text>
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

export default AboutUs;

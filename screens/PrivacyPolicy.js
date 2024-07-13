import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const PrivacyPolicy = () => {
  return (
    <View style={styles.container}>
      <Text>Privacy Policy Page</Text>
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

export default PrivacyPolicy;

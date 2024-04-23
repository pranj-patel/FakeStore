// SplashScreen.js
import React from 'react';
import { View, Image, StyleSheet } from 'react-native';

export const SplashScreen = () => {
  return (
    <View style={styles.container}>
      {/* Displaying splash screen image */}
      <Image
        source={require('./assets/splash_screen.png')}
        style={styles.image}
      />
    </View>
  );
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#FFFFFF',
    },
    image: {
      width: '80%',
      height: '80%',
      resizeMode: 'contain',
    },
  });
  
export default SplashScreen;

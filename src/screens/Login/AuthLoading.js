import React, {useState} from 'react';
import {
  ActivityIndicator,
  StatusBar,
  StyleSheet,
  View,
} from 'react-native';

import AsyncStorage from '@react-native-community/async-storage';

const home = ( props ) => {
  const [token, setToken] = useState(async () => {
    const userToken = await AsyncStorage.getItem('token');
    //props.navigation.navigate(userToken ? 'InsideSession' : 'SignUpScreen');
    props.navigation.navigate(userToken ? 'Home' : 'SignUpScreen');
    return userToken;
  });

  return (
    <View style={styles.container}>
      <ActivityIndicator />
      <StatusBar barStyle="default" />
    </View>
  )
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default home;
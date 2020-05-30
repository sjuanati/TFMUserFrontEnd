import React, { useState } from 'react';
import { Button, Text, Container, Card, CardItem, Body, Content, Header, Title, Left, Icon, Right } from "native-base";
import { View, StyleSheet, Image, TouchableOpacity } from 'react-native'
import Ionicons from "react-native-vector-icons/Ionicons";
import ShoppingCartIcon from '../UI/ShoppingCartIcon';

const drmaxLogo = require('../assets/images/global/DrMax.png');

const customHeader = ( props ) => {

  const goInsideSession = async () => {
    await props.navigation.navigate('InsideSession', props);
  };

  return (
    <Header style={styles.header}>
      <Left style={styles.left}>
        <TouchableOpacity
        onPress={goInsideSession}>
            <View style={styles.back}>
                <Ionicons
                name="ios-arrow-back"
                size={25}
                color="#F4B13E"
                style={styles.button}
                />
            </View>
        </TouchableOpacity>
      </Left>
      <Body style={styles.body}>
      <Image
        style={styles.logo}
        source={drmaxLogo}
      />
      </Body>
      <Right style={styles.right}>
        <TouchableOpacity onPress={() => props.navigation.navigate('OrderSummary')}>
          <ShoppingCartIcon/>
        </TouchableOpacity>
      </Right>
    </Header>
  )
};


const styles = StyleSheet.create({
  header: {
    backgroundColor: 'white',
    height: 60
  },
  body: {
    flex: 1,
    alignItems: 'center',
    marginTop: -20,
  },
  right: {
    flex: 1
  },
  left: {
    flex: 1
  },
  logo: {
    resizeMode: 'contain',
    width: 150,
  },
  button: {
    paddingLeft: 10,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    zIndex: 2,
    backgroundColor: "transparent"
  },
  back: {
      width: 80,
  }
});

export default customHeader;
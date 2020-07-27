import React, { useState } from 'react';
import { Body, Header, Left, Right } from "native-base";
import { View, StyleSheet, Image, TouchableOpacity } from 'react-native'
import Ionicons from "react-native-vector-icons/Ionicons";
import ShoppingCartIcon from '../UI/ShoppingCartIcon';
import { useDispatch, useSelector } from 'react-redux';
import { setOrdersPage } from '../store/actions/order';
const drmaxLogo = require('../assets/images/global/DrMax.png');

const customHeaderBack = (props) => {
  const dispatch = useDispatch();
  const modified = useSelector(state => state.modified);
  const ordersPage = useSelector(state => state.order.ordersPage);

  const goBack = async () => {
    if (props.navigation.state.routeName === 'OrderDetail') {
      dispatch(setOrdersPage(true));
    }
    await props.navigation.goBack(null);
  };

  return (
    <Header style={styles.mainHeader}>
      <Left style={styles.left}>
        <View style={styles.backContainer}>
          <TouchableOpacity
            onPress={goBack}>
            <Ionicons
              name="ios-arrow-back"
              size={25}
              color="#F4B13E"
              style={styles.back}
            />
          </TouchableOpacity>
        </View>
      </Left>
      <Body style={styles.body}>
        <Image
          style={styles.logo}
          source={drmaxLogo}
        />
      </Body>
      <Right style={styles.right}>
        <TouchableOpacity onPress={() => props.navigation.navigate('OrderSummary')}>
          <ShoppingCartIcon />
        </TouchableOpacity>
      </Right>
    </Header>
  )
};

const styles = StyleSheet.create({
  mainHeader: {
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
    width: 150
  },
  back: {
    paddingLeft: 10,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    zIndex: 2,
    backgroundColor: "transparent"
  },
  backContainer: {
    width: 80
  }
});

export default customHeaderBack;

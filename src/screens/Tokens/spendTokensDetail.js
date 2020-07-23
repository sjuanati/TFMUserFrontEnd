import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    Alert,
    StyleSheet,
    TouchableOpacity,
} from 'react-native';
import axios from 'axios';
import Cons from '../../shared/Constants';
import { useSelector } from 'react-redux';
import { httpUrl } from '../../../urlServer';
import CustomHeaderBack from '../../navigation/CustomHeaderBack';


const spendTokensDetail = (props) => {

    const item = props.navigation.getParam('item');
    const balance = props.navigation.getParam('balance');
    const user = useSelector(state => state.user);

    const handleConfirm = () => {
        if (balance === -2 || !balance) {
            Alert.alert(`Balance can't be checked at this time`);
        } else if (balance < item) {
        } else console.log('Confirmed!');
    }

    return (
        <View>
            <CustomHeaderBack {...props} />
            <Text>Hallo spend</Text>
        </View>
    )
}

export default spendTokensDetail;
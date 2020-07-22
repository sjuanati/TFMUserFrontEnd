import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
} from 'react-native';
import axios from 'axios';
import Cons from '../../shared/Constants';
import { useSelector } from 'react-redux';
import { httpUrl } from '../../../urlServer';
import CustomHeaderBack from '../../navigation/CustomHeaderBack';


const earnTokensDetail = (props) => {

    let item = props.navigation.getParam('item');
    console.log(item)

    return (
        <View>
            <CustomHeaderBack {...props} />
            <Text>{item.earn_desc}</Text>
            <Text>{item.earn_desc_long}</Text>
            <Text>{item.earn_qty}</Text>
            <Text>{item.validity_start_date}</Text>
            <Text>{item.validity_end_date}</Text>
        </View>
    )
}

export default earnTokensDetail;

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


const spendTokensDetail = (props) => {
    return (
        <View>
            <CustomHeaderBack {...props} />
            <Text>Hallo spend</Text>
        </View>
    )
}

export default spendTokensDetail;
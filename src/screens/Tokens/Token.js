import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
} from 'react-native';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { httpUrl } from '../../../urlServer';


const token = (props) => {

    const user = useSelector(state => state.user);
    const [balance, setBalance] = useState('');

    useEffect(() => {
        fetchTokenBalance();
    }, []);

    const fetchTokenBalance = async () => {

        await axios.get(`${httpUrl}/token/get/balance`, {
            params: { recipient: user.eth_address},
            headers: { authorization: user.token }
        }).then(res => {
            setBalance(res.data);
        }).catch(err => {
            console.log('Error in Token.js -> getOrderTrace() -> fetchTokenBalance(): ', err);
        });
    }

    return (
        <ScrollView style={styles.container}>
            <View style={styles.sectionContainer}>
                <Text> Current Balance : 
                    <Text style={styles.bold}> {(balance) ? balance : '...'}</Text> PCT
                </Text> 
            </View>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: 'white',
        paddingTop: 15,
    },
    sectionContainer: {
        alignItems: 'center'
    },
    bold: {
        fontWeight: 'bold'
    }
});

export default token;

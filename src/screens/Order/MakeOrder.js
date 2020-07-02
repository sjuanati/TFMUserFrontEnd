// Libs
import React, { useState, useEffect } from 'react';
import {
    Text,
    View,
    Image,
    StyleSheet,
    TouchableOpacity,
} from 'react-native';
import scanLogo from '../../assets/images/global/scanner.png';
import CustomHeaderBack from '../../navigation/CustomHeaderBack';

const makeOrder = (props) => {

    return (
        <View style={styles.container}>
            <CustomHeaderBack {...props} />
            <View style={styles.scanContainer}>
                <TouchableOpacity
                    onPress={() => props.navigation.navigate('MakeOrderScan')}
                    style={styles.buttonContainer}
                >
                    <Text style={styles.text}> Scan Prescription </Text>
                    <Image source={scanLogo}/>
                </TouchableOpacity>
            </View>
        </View>
    );

};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    scanContainer: {
        flex: 1,
        marginTop: 30,
        alignItems: 'center',
    },
    buttonContainer: {
        alignItems: 'center'
    },
    text: {
        fontSize: 18,
        fontWeight: '500',
    }
});

export default makeOrder;
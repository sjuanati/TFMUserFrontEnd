// Libs
import React, { useState, useEffect } from 'react';
import {
    Text,
    View,
    Image,
    StyleSheet,
    TouchableOpacity,
} from 'react-native';
import { setScanned } from '../../store/actions/order';
import { useDispatch, useSelector } from 'react-redux';
import scanLogo from '../../assets/images/global/scanner.png';
import CustomHeaderBack from '../../navigation/CustomHeaderBack';

const makeOrder = (props) => {

    const dispatch = useDispatch();
    const scanned = useSelector(state => state.order.scanned);

    const scanPrescription = () => {
        dispatch(setScanned(false));
        props.navigation.navigate('MakeOrderScan');
    }

    return (
        <View style={styles.container}>
            <CustomHeaderBack {...props} />
            <View style={styles.scanContainer}>
                <TouchableOpacity
                    onPress={() => scanPrescription()}
                    style={styles.buttonContainer}
                >
                    <Text style={styles.headerText}> Scan Prescription </Text>
                    <Image source={scanLogo}/>
                    {(scanned) ? <Text style={styles.notFoundText}> Prescription not found </Text> : null}
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
    headerText: {
        fontSize: 18,
        fontWeight: '500',
    },
    notFoundText: {
        fontSize: 16,
        color: 'red'
    }
});

export default makeOrder;
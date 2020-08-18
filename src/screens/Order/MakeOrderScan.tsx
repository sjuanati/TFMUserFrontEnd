/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import {
    Text,
    View,
    Dimensions,
    StyleSheet,
    TouchableOpacity,
} from 'react-native';
import axios from 'axios';
import globalStyles from '../../UI/Style';
import { httpUrl } from '../../../urlServer';
import { RNCamera } from 'react-native-camera';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { HomeStackParamList, Product } from '../../navigation/StackNavigator';
import { addItem, setScanned } from '../../store/actions/order';
import { useDispatch } from 'react-redux';
import { useTypedSelector } from '../../store/reducers/reducer';
import IconFlash from 'react-native-vector-icons/Ionicons';
import IconTarget from 'react-native-vector-icons/SimpleLineIcons';

const window = Dimensions.get('screen');

type Props = {
    route: RouteProp<HomeStackParamList, 'MakeOrderScan'>,
    navigation: StackNavigationProp<HomeStackParamList, 'MakeOrderScan'>
};

const MakeOrderScan = (props: Props) => {

    const dispatch = useDispatch();
    const user = useTypedSelector(state => state.user);
    const [barcode, setBarcode] = useState(null);
    const [isAlreadyScanned, setIsAlreadyScanned] = useState(false);
    const [isFlashOn, setIsFlashOn] = useState(false);

    useEffect(() => {
        if (barcode && !isAlreadyScanned) { fetchPrescription(barcode); }
    }, [barcode]);

    const onBarCodeRead = (elem) => {
        // Scan only if barcode is EAN13 compatible
        if (elem.type === 'org.gs1.EAN-13' && !barcode) {
            setBarcode(elem.data);
        }
    };

    const toggleFlash = () => {
        setIsFlashOn(!isFlashOn);
    };

    const fetchPrescription = async (ean13) => {
        setIsAlreadyScanned(true);
        await axios.get(`${httpUrl}/prescription/get`, {
            params: { ean13: ean13 },
            headers: { authorization: user.token },
        })
            .then(response => {
                // Prescription barcode found in DB -> Go to Order Summary
                if (response.data.length > 0) {
                    buildOrder(response.data);
                    // No Prescription found in DB -> Go back to MakeOrder
                } else {
                    dispatch(setScanned(true));
                    props.navigation.navigate('MakeOrder');
                }
            })
            .catch(err => {
                console.log('Error in MakeOrderScan.js -> fetchPrescription(): ', err);
            });
    };

    const buildOrder = (data: any) => {

        // Add every prescription item in the Order (redux)
        data.forEach((elem: Product) => {
            dispatch(addItem(
                elem.item_id,
                elem.product_id,
                elem.product_desc,
                elem.price,
                elem.dose_qty,
                elem.dose_form,
                elem.leaflet_url,
            ));
        });

        // Go to Order Summary screen
        setBarcode(null);
        props.navigation.navigate('OrderSummary');
    };

    return (
        <View style={styles.container}>
            <RNCamera
                style={styles.preview}
                barCodeTypes={[RNCamera.Constants.BarCodeType.ean13]}
                onBarCodeRead={onBarCodeRead}
                flashMode={(isFlashOn)
                    ? RNCamera.Constants.FlashMode.torch
                    : RNCamera.Constants.FlashMode.off}
                captureAudio={false}>
                <View style={styles.targetOverlay}>
                    <IconTarget name="target" size={30} color="grey" />
                </View>
                <View style={styles.buttonOverlay}>
                    <TouchableOpacity
                        style={[globalStyles.button, styles.button]}
                        onPress={() => props.navigation.goBack()}>
                        <Text> Back </Text>
                    </TouchableOpacity>
                </View>
            </RNCamera>
            {(isFlashOn)
                ? <View style={styles.flashOverlay}>
                    <TouchableOpacity
                        onPress={() => toggleFlash()}>
                        <IconFlash name="md-flash" size={30} color="grey" />
                    </TouchableOpacity>
                </View>
                : <View style={styles.flashOverlay}>
                    <TouchableOpacity
                        onPress={() => toggleFlash()}>
                        <IconFlash name="md-flash-off" size={30} color="grey" />
                    </TouchableOpacity>
                </View>
            }
            {(barcode)
                ? <View style={styles.scanningOverlay}>
                    <View style={styles.label}>
                        <Text style={styles.scanText}> Scanning... </Text>
                    </View>
                </View>
                : null
            }
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: 'black',
    },
    preview: {
        flex: 1,
    },
    cameraIcon: {
        margin: 5,
        height: 40,
        width: 40,
    },
    scanningOverlay: {
        position: 'absolute',
        width: '100%',
        marginTop: 150,
        alignItems: 'center',
    },
    targetOverlay: {
        alignItems: 'center',
        marginTop: window.height / 3,
    },
    flashOverlay: {
        position: 'absolute',
        width: '100%',
        marginTop: 110,
        marginLeft: 20,
        flex: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    button: {
        width: 100,
        height: 50,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 100,
    },
    buttonOverlay: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'flex-end',
        marginBottom: 20,
    },
    label: {
        width: 120,
        height: 40,
        backgroundColor: 'white',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 10,
        opacity: 0.5,
    },
    scanText: {
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default MakeOrderScan;

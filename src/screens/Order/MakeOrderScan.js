// Libs
import React, { useState } from 'react';
import {
    Text,
    View,
    Alert,
    StyleSheet,
    TouchableOpacity,
} from 'react-native';
import axios from 'axios';
import globalStyles from '../../UI/Style';
import { httpUrl } from '../../../urlServer';
import { RNCamera } from 'react-native-camera';
import { addItem } from '../../store/actions/order';
import { useSelector, useDispatch } from 'react-redux';
import CustomHeaderBack from '../../navigation/CustomHeaderBack';

const makeOrderScan = (props) => {

    const dispatch = useDispatch();
    const user = useSelector(state => state.user);
    //const [isBarCodeRead, setIsBarCodeRead] = useState(false);
    let isBarCodeRead = false;

    const onBarCodeRead = (elem) => {

        //Alert.alert("Barcode value is " + elem.data, "Barcode type is" + elem.type);
        console.log('Barcode value is ' + elem.data, 'Barcode type is ' + elem.type)
        if (elem.type === 'org.gs1.EAN-13' && !isBarCodeRead) {
            //setIsBarCodeRead(true);
            isBarCodeRead = true;
            fetchPrescription(elem.data);
        }
    }

    const fetchPrescription = async (ean13) => {

        await axios.get(`${httpUrl}/prescription/get`, {
            params: { ean13: ean13 },
            headers: { authorization: user.token }
        })
            .then(response => {
                if (response.data) {
                    console.log('Response: ', response.data);
                    buildOrder(response.data);
                }
            })
            .catch(err => {
                console.log('Error in X.js -> fetchPrescription(): ', err)
            })
    }

    const buildOrder = (data) => {
        data.forEach(elem => {
            //console.log(elem)
            dispatch(addItem(
                elem.prescription_item, 
                elem.product_desc));
        })
        props.navigation.navigate('OrderSummary');
    }

    return (
        <View style={styles.container}>
            <CustomHeaderBack {...props} />
            <RNCamera
                style={styles.preview}
                onBarCodeRead={onBarCodeRead}
                captureAudio={false}>
                <TouchableOpacity
                    style={[globalStyles.button, styles.button]}
                    onPress={() => props.navigation.goBack(null)}
                >
                    <Text> Back </Text>
                </TouchableOpacity>
            </RNCamera>
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
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    cameraIcon: {
        margin: 5,
        height: 40,
        width: 40
    },
    bottomOverlay: {
        position: "absolute",
        width: "100%",
        flex: 20,
        flexDirection: "row",
        justifyContent: "space-between"
    },
    button: {
        marginBottom: 50,
        width: 100,
        height: 50,
        alignItems: 'center',
        justifyContent: 'center',
    }
});

export default makeOrderScan;
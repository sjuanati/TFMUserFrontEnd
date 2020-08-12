import React from 'react';
import {
    Text,
    View,
    Alert,
    Linking,
    StyleSheet,
    TouchableOpacity
} from 'react-native';
import globalStyles from '../../UI/Style';
import Cons from '../../shared/Constants';
import { useSelector, useDispatch } from 'react-redux';
import { addItem, removeItem } from '../../store/actions/order';


const productDetail = (props) => {

    const { item_id, product_id, product_desc, dose_qty, dose_form, prescription,
        price, leaflet_url, screen } = props.route.params;
        
    const dispatch = useDispatch();
    const order = useSelector(state => state.order.items);

    const handleRemoveItem = () => {
        dispatch(removeItem(item_id));
        props.navigation.goBack()
    };

    const handleAddItem = () => {
        dispatch(addItem(
            order.length + 1,
            product_id,
            product_desc,
            price,
            dose_qty,
            dose_form,
            leaflet_url,
        ));
        props.navigation.goBack()
    }

    const handleURL = url => {

        Linking.canOpenURL(url)
            .then((supported) => {
                if (supported) {
                    Linking.openURL(url);
                } else {
                    Alert.alert(`No se puede abrir el navegador`);
                }
            })
            .catch(err => console.warn('Error on MakeOrderDetail.js -> handleURL(): ', err))
    };

    // Order detail can be reached from two different screens:
    // 'OrderSummary': the item can be removed
    // 'MakeOrderChoose' or 'GetOrderItem': the item can be added
    const showButtons = () => (
        <View style={styles.containerButton}>
            <TouchableOpacity
                style={[globalStyles.button, styles.button]}
                onPress={() => props.navigation.goBack()}>
                <Text style={globalStyles.buttonText}> Cancel </Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={[globalStyles.button, styles.button]}
                onPress={() => {
                    (screen === 'OrderSummary') ? handleRemoveItem() : handleAddItem()
                }}>
                <Text style={[globalStyles.buttonText, styles.bold]}>
                    {(screen === 'OrderSummary') ? 'Delete' : 'Add Product'}
                </Text>
            </TouchableOpacity>

        </View>
    );

    return (
        <View style={styles.container}>
            <View style={styles.headerContainer}>
                <Text style={styles.titleText}>{product_desc}</Text>
            </View>
            <View style={styles.sectionContainer}>
                <View style={styles.rowContainer}>
                    <Text style={styles.rowHeader}> Dose: </Text>
                    <Text style={styles.rowValue}> {dose_qty} </Text>
                </View>
                <View style={styles.rowContainer}>
                    <Text style={styles.rowHeader}> Form: </Text>
                    <Text style={styles.rowValue}> {dose_form} </Text>
                </View>
                <View style={styles.rowContainer}>
                    <Text style={styles.rowHeader}> Price: </Text>
                    <Text style={styles.rowValue}> {price} €</Text>
                </View>
                <View style={styles.rowContainer}>
                    <Text style={styles.rowHeader}> Prescription: </Text>
                    <Text style={styles.rowValue}> {(prescription) ? 'Yes' : 'No'} </Text>
                </View>
                <View style={styles.rowContainer}>
                    <Text style={styles.rowHeader}> Leaflet: </Text>
                    {(leaflet_url)
                        ? <TouchableOpacity
                            onPress={() => handleURL(leaflet_url)}>
                            <Text style={[styles.rowValue, styles.availableText]}> Available </Text>
                        </TouchableOpacity>
                        : <Text style={styles.rowValue}> Not available </Text>
                    }
                </View>
            </View>
            {showButtons()}
        </View>
    );
};


const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: Cons.COLORS.WHITE,
    },
    containerButton: {
        position: 'absolute',
        alignSelf: 'center',
        flexDirection: 'row',
        bottom: 15,
    },
    button: {
        width: 150,
        alignItems: 'center',
        margin: 15,
    },
    headerContainer: {
        margin: 15,
        borderBottomWidth: 0.3,
        borderColor: 'orange',
        paddingBottom: 10,
        alignItems: 'center'
    },
    titleText: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    bold: {
        fontWeight: 'bold'
    },
    availableText: {
        color: Cons.COLORS.BLUE,
    },
    sectionContainer: {
        marginLeft: 25,
        marginTop: 5,
    },
    rowContainer: {
        flexDirection: 'row',
        marginTop: 10,
    },
    rowHeader: {
        color: 'grey',
        width: 110,
        fontSize: 16,
    },
    rowValue: {
        fontSize: 16,
    },
});

export default productDetail;

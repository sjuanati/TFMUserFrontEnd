// Libs
import React, { useState } from 'react';
import {
    Text,
    View,
    Alert,
    FlatList,
    PixelRatio,
    StyleSheet,
    TouchableOpacity,
} from 'react-native';
import { ListItem } from 'react-native-elements';
import { useSelector, useDispatch } from 'react-redux';
import Button from '../../UI/Button';
import Cons from '../../shared/Constants';
import globalStyles from '../../UI/Style';
import fontSize from '../../shared/FontSize';
import { clearCart } from '../../store/actions/order';
import CustomHeaderBack from '../../navigation/CustomHeaderBack';

// Constants
const FONT_SIZE = fontSize(20, PixelRatio.getFontScale());


const orderSummary = (props) => {

    // Get orders from state
    const order = useSelector(state => state.order.items);
    const price = useSelector(state => state.order.price);
    const user = useSelector(state => state.user);
    const dispatch = useDispatch();


    // Remove all items from Cart
    const removeOrder = () => {
        Alert.alert(
            '¿Confirm cancellation?', 'All items will be removed from the Cart',
            [{
                text: 'Cancel', onPress: () => { }, style: 'cancel'
            }, {
                text: 'OK', onPress: async () => {
                    dispatch(clearCart(false));
                    props.navigation.navigate('Home');
                }
            }],
            { cancelable: false }
        )
    }

    // Show medicine item in List
    const renderItem = ({ item }) => {
        order[item].screen = 'OrderSummary';
        return (
            <ListItem
                title={order[item].product_desc}
                subtitle={<Text style={styles.subtitleText}>{order[item].price} € </Text>}
                onPress={() => props.navigation.navigate('ProductDetail', order[item])}
                bottomDivider
                chevron />
        )
    };

    const renderAddItem = () => (
        <View style={styles.container_body}>
            <Text style={styles.text}> No Order in Cart </Text>
            <Button target='Order' desc='Add Product' nav={props.navigation} />
        </View>
    );

    const renderOrderOverview = () => (
        <View style={styles.container_body}>
            <Text style={styles.itemHeader}>Order Summary</Text>
            <TouchableOpacity
                onPress={() => props.navigation.navigate('PharmacySearch')}>
                {(user.favPharmacyID)
                    ? <Text style={styles.subText}> Farmacia {user.favPharmacyDesc} </Text>
                    : <Text style={styles.subText}> No pharmacy selected </Text>}
            </TouchableOpacity>
            <Text style={styles.priceText}>Total price: <Text style={styles.bold}>{price} €</Text></Text>
        </View>
    );

    return (
        <View style={styles.container}>
            <CustomHeaderBack {...props} />
            {(order.length === 0) ? renderAddItem() : renderOrderOverview()}
            <View style={styles.list}>
                {(order.length > 0)
                    ? <FlatList
                        data={Object.keys(order)}
                        keyExtractor={item => item}
                        renderItem={renderItem} />
                    : null}
            </View>
            {/* <View>
                <ActivityIndicator isLoading={isLoading} />
            </View> */}
            <View style={styles.container_bottom}>
                <View style={styles.item}>
                    <TouchableOpacity
                        style={(order.length > 0 && (user.favPharmacyID !== null))
                            ? [globalStyles.button, styles.button]
                            : [globalStyles.buttonDisabled, styles.button]}
                        onPress={() => props.navigation.navigate('PurchaseOrder')}
                        disabled={(order.length > 0 && (user.favPharmacyID !== null))
                            ? false
                            : true}>
                        <Text style={[globalStyles.buttonText, styles.bold]}> Purchase </Text>
                    </TouchableOpacity>
                </View>
                {(order.length > 0 && (user.favPharmacyID !== null)) ?
                    <View style={styles.item}>
                        <TouchableOpacity
                            style={[globalStyles.button, styles.button]}
                            onPress={() => removeOrder()}>
                            <Text style={globalStyles.buttonText}> Cancel </Text>
                        </TouchableOpacity>
                    </View>
                    :
                    null}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
    },
    container_body: {
        flexDirection: 'column',
        alignItems: 'center',
        backgroundColor: Cons.COLORS.WHITE,
        paddingBottom: 15,
    },
    container_bottom: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        alignContent: 'space-between',
        marginBottom: 5,
    },
    item: {
        margin: 15,
    },
    text: {
        margin: 15,
        fontSize: FONT_SIZE,
    },
    subText: {
        marginBottom: 10,
        fontSize: FONT_SIZE,
        color: Cons.COLORS.BLUE,
    },
    priceText: {
        fontSize: 16,
    },
    bold: {
        fontWeight: 'bold',
    },
    list: {
        padding: 10,
        fontSize: 20,
        height: '50%',
    },
    itemHeader: {
        paddingTop: 10,
        paddingBottom: 5,
        fontSize: FONT_SIZE + 10,
        fontWeight: 'bold',
        color: Cons.COLORS.BLACK,
        flexDirection: 'row',
    },
    subtitleText: {
        color: 'grey',
        fontSize: 16,
    },
    button: {
        width: 120,
        alignItems: 'center'
    }
});

export default orderSummary;

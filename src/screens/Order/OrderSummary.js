// Libs
import React, { useState, useEffect } from 'react';
import {
    Text,
    View,
    TouchableOpacity,
    Alert,
    FlatList,
    StyleSheet,
    Platform,
    PixelRatio
} from 'react-native';
import { ListItem } from 'react-native-elements';
import { useSelector, useDispatch } from 'react-redux';
import Icon from 'react-native-vector-icons/Ionicons';
import axios from 'axios';

// Components
import globalStyles from '../../UI/Style';
import CustomHeaderBack from '../../navigation/CustomHeaderBack';
import { httpUrl } from '../../../urlServer';
import { clearCart } from '../../store/actions/order';
import ActivityIndicator from '../../UI/ActivityIndicator';
import Button from '../../UI/Button';
import fontSize from '../../shared/FontSize';
const FONT_SIZE = fontSize(20, PixelRatio.getFontScale());
import showToast from '../../shared/Toast';
import Cons from '../../shared/Constants';
import logger from '../../shared/logRecorder';


const orderSummary = (props) => {

    // Get orders from state
    const order = useSelector(state => state.order.items);
    const user = useSelector(state => state.user);
    const dispatch = useDispatch();
    const [isLoading, setIsLoding] = useState(false);

    // Show medicine item in List
    const renderItem = ({ item }) => (
        <ListItem
            rightAvatar={
                (order[item].itemPhoto.length > 0) ? <Icon name="ios-attach" size={30} color='gray' /> : null
            }
            title={order[item].item_description}
            // subtitle = "Farmacia X"
            // onPress = {() => navigation.navigate('OrderItem',
            //     {itemNumber: order[item].itemNumber,
            //      item_description: order[item].item_description})}
            onPress={() => props.navigation.navigate('OrderItem', order[item])}
            bottomDivider
            chevron
        />
    );

    const renderAddItem = () => (
        <View style={styles.container_body}>
            <Text style={styles.text}> Ningún producto en la cesta </Text>
            <Button target='Order' desc='Añadir producto' nav={props.navigation} />
        </View>
    );

    const renderOrderOverview = () => (
        <View style={styles.container_body}>
            <Text style={styles.itemHeader}>Resumen del pedido</Text>
            {(user.favPharmacyID) ?
                <View style={styles.container_pharmacy}>
                    <Text style={styles.subText}> Farmacia {user.favPharmacyDesc} </Text>
                    <Button target='PharmacySearch' desc='Cambiar' nav={props.navigation} />
                </View>
                :
                <View style={styles.container_pharmacy}>
                    <Text style={styles.subText}> Ninguna farmacia seleccionada </Text>
                    <Button target='PharmacySearch' desc='Seleccionar' nav={props.navigation} />
                </View>
            }
        </View>
    );

    const confirmOrder = async () => {
        console.log('order when confirming :', order);

        setIsLoding(true);
        await saveOrderToDB();
        await saveLastPharmacyToDB();
        setIsLoding(false);
    };

    const removeOrder = () => {
        Alert.alert(
            '¿Seguro que quieres cancelar el pedido?', '',
            [
                { text: 'Cancel', onPress: () => { }, style: 'cancel' },
                {
                    text: 'OK', onPress: async () => {
                        dispatch(clearCart(false));
                        props.navigation.navigate('Home');
                    }
                },
            ],
            { cancelable: false }
        )
    }


    // Save Order into PostgreSQL
    const saveOrderToDB = async () => {

        if ((user.id) && (user.favPharmacyID) && (order)) {
            await axios.post(`${httpUrl}/order/add`, {
                order,
                user,
                user_id: user.id,
            }, {
                headers: {
                    authorization: user.token,
                    user_id: user.id
                }
            })
                .then((response) => {
                    dispatch(clearCart(true));
                    console.log(`Order ${response.data[0].order_id} stored in PostgreSQL`)
                    props.navigation.navigate('Home');
                    savePhotoToS3(response.data);

                })
                .catch(async err => {
                    if (err.response && (err.response.status === 401 || err.response.status === 403)) {
                        showToast("Por favor, vuelve a entrar")
                        props.navigation.navigate('StartScreen');
                    } else if (err.response && err.response.status === 404) {
                        showToast("Error al confirmar pedido");
                    } else {
                        showToast("Ups... parece que no hay conexión");
                    }
                    Alert.alert('Error al procesar el pedido');
                    logger('ERR', 'FRONT-USER', `OrderSummary.js -> saveOrderToDB(): ${err}`, user, '');
                    console.log('Error at OrderSummary.js -> saveOrderToDB() :', err);
                })
        } else {
            logger('WRN', 'FRONT-USER', `OrderSummary.js -> saveOrderToDB() `, user, 'No User, Product/s or Pharmacy to save Order');
            console.log('Warning on OrderSummary.js -> saveOrderToDB(): No User, Product/s or Pharmacy to save Order');
        }
    };

    const savePhotoToS3 = async (photos) => {

        // For every Order item, check if any photo is assigned
        for (let i = 0; i < order.length; i++) {
            for (let j = 0; j < photos.length; j++) {
                if ((order[i].itemPhoto) && (order[i].itemPhoto === photos[j].photo_url)) {

                    // Add photo to FormData() structure
                    let photo = new FormData();
                    let URI = order[i].itemPhoto;
                    const photoName = `${photos[j].order_id}_${photos[j].order_item}.jpg`;
                    photo.append('image', {
                        uri: (Platform.OS === "ios") ? URI : `file://${URI}`,
                        name: photoName,
                        type: `image/jpg`
                    });

                    // Save photo into Server folder '/upload'
                    await axios.post(`${httpUrl}/chat/uploadPhoto`, photo, {
                        headers: { authorization: user.token }
                    }).then(async res => {
                        if (res.status === 200) console.log(`Order item ${i + 1} saved at '/upload'`)
                    }).catch(err => {
                        console.log('Error in OrderSummary.js -> savePhotoToS3() -> uploadPhoto: ', err);
                        logger('ERR', 'FRONT-USER', `OrderSummary.js -> savePhotoToS3(): ${err}`, user, `photo: ${photoName}`);
                        // TODO: if path is not reachable, server fails and exception is not captured.
                    })

                    // Transfer photo from Server to S3 and delete from '/upload'
                    await axios.post(`${httpUrl}/order/toS3`, [photo], {
                        headers: { authorization: user.token }
                    }).then(async res => {
                        if (res.status === 200) console.log(`Order item ${i} transferred to S3`)
                    }).catch(err => {
                        console.log('Error in OrderSummary.js -> savePhotoToS3() -> sendToS3: ', err);
                        logger('ERR', 'FRONT-USER', `OrderSummary.js -> savePhotoToS3(): ${err}`, user, `photo: ${photoName}`);
                    })
                }
            }
        }
    };

    const saveLastPharmacyToDB = async () => {

        if ((user.id) && (user.favPharmacyID)) {
            await axios.post(`${httpUrl}/users/pharmacy/set`, {
                user_id: user.id,
                pharmacy_id: user.favPharmacyID
            }, {
                headers: { authorization: user.token }
            })
                .then((response) => {
                    console.log(response.data);
                })
                .catch(async err => {
                    if (err.response && (err.response.status === 401 || err.response.status === 403)) {
                        showToast("Por favor, vuelve a entrar")
                        props.navigation.navigate('StartScreen');
                    } else if (err.response && err.response.status === 404) {
                        showToast("Ha ocurrido un error al guardar la farmacia preferida");
                    } else {
                        showToast("Ups... parece que no hay conexión");
                    }
                    console.log('Error on OrderSummary.js -> saveLastPharmacyToDB() :', err);
                    logger('ERR', 'FRONT-USER', `OrderSummary.js -> saveLastPharmacyToDB(): ${err}`, user, `pharmacy: ${user.favPharmacyID}`);
                })
        } else {
            console.log('Warning on OrderSummary.js -> saveLastPharmacyToDB(): No User or Pharmacy to save Order');
            logger('WRN', 'FRONT-USER', `OrderSummary.js -> saveLastPharmacyToDB() `, user, 'No User or Pharmacy to save Order');
        }
    };

    return (
        <View style={styles.container}>
            <CustomHeaderBack {...props} />

            {/* HEADER */}
            {(order.length === 0) ? renderAddItem() : renderOrderOverview()}

            {/* ORDER ITEMS */}
            <View style={styles.list}>
                {(order.length > 0) ?
                    <FlatList
                        data={Object.keys(order)}
                        keyExtractor={item => item}
                        renderItem={renderItem}
                    />
                    : null}
            </View>

            <View>
                <ActivityIndicator isLoading={isLoading} />
            </View>

            {/* CONFIRM */}
            <View style={styles.container_bottom}>

                {(order.length > 0 && (user.favPharmacyID !== null)) ?
                    <View style={styles.item}>
                        <TouchableOpacity
                            style={globalStyles.button}
                            onPress={() => removeOrder()}>
                            <Text style={globalStyles.buttonText}> Anular Pedido</Text>
                        </TouchableOpacity>
                    </View>
                    :
                    null}

                <View style={styles.item}>
                    <TouchableOpacity
                        style={(order.length > 0 && (user.favPharmacyID !== null)) ?
                            globalStyles.button
                            :
                            globalStyles.buttonDisabled}
                        onPress={() => confirmOrder()}
                        disabled={(order.length > 0 && (user.favPharmacyID !== null)) ?
                            false
                            :
                            true}>
                        <Text style={globalStyles.buttonText}> Pedir Precio </Text>
                    </TouchableOpacity>
                </View>

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
        paddingBottom: 10,
    },
    container_pharmacy: {
        alignItems: 'center'
    },
    // container_bottom: {
    //     flex: 1,
    //     alignItems: 'center',
    //     justifyContent: 'flex-end',
    //     marginBottom: 15,
    // },
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
        margin: 20,
        fontSize: FONT_SIZE,
    },
    subText: {
        marginBottom: 10,
        fontSize: FONT_SIZE,
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
});

export default orderSummary;

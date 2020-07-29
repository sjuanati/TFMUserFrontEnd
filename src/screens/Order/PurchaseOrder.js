import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    Alert,
    Image,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
} from 'react-native';
import axios from 'axios';
//mport Cons from '../../shared/Constants';
import globalStyles from '../../UI/Style';
import { httpUrl } from '../../../urlServer';
import { clearCart } from '../../store/actions/order';
import { useSelector, useDispatch } from 'react-redux';
import handleAxiosErrors from '../../shared/handleAxiosErrors';
import ActivityIndicator from '../../UI/ActivityIndicator';
import visaLogo from '../../assets/images/global/visa.png'
import bitacorasLogo from '../../assets/images/global/bitacoras.png';

const purchaseOrder = (props) => {

    const dispatch = useDispatch();
    const user = useSelector(state => state.user);
    const order = useSelector(state => state.order.items);
    const price = useSelector(state => state.order.price);
    const [balance, setBalance] = useState(-1);
    const [isSelected, setIsSelected] = useState(0);
    const [isLoading, setIsLoding] = useState(false);

    useEffect(() => {
        fetchTokenBalance();
    }, []);

    const fetchTokenBalance = async () => {
        await axios.get(`${httpUrl}/token/get/balance`, {
            params: { recipient: user.eth_address },
            headers: { authorization: user.token }
        }).then(res => {
            // Convert string into Float of 2 decimals
            const amount = Math.round(parseFloat(res.data) * 100) / 100;
            setBalance(amount);
        }).catch(err => {
            console.log('Error in Token.js -> fetchTokenBalance(): ', err);
            setBalance(-2);
        });
    }

    const confirmOrder = async () => {
        if (isSelected === 0) {
            Alert.alert('Please choose one payment method', 'VISA card or Tokens');
        } else {
            setIsLoding(true);
            await saveOrderToDB();
            await saveLastPharmacyToDB();
            setIsLoding(false);
        }
    };

    // Save Order into PostgreSQL
    const saveOrderToDB = async () => {

        if ((user.id) && (user.favPharmacyID) && (order)) {
            await axios.post(`${httpUrl}/order/add`, {
                order,
                user,
                total_price: price,
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
                })
                .catch(async err => {
                    handleAxiosErrors(props, err);
                    Alert.alert('Error al procesar el pedido');
                    console.log('Error at OrderSummary.js -> saveOrderToDB() :', err);
                })
        } else {
            console.log('Warning on OrderSummary.js -> saveOrderToDB(): No User, Product/s or Pharmacy to save Order');
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
                    handleAxiosErrors(props, err);
                    console.log('Error on OrderSummary.js -> saveLastPharmacyToDB() :', err);
                })
        } else {
            console.log('Warning on OrderSummary.js -> saveLastPharmacyToDB(): No User or Pharmacy to save Order');
        }
    };

    return (
        <View style={styles.container}>
            <ScrollView>
                <View style={styles.headerContainer}>
                    <Text style={styles.headerText}>Please choose your payment method</Text>
                </View>
                <TouchableOpacity
                    onPress={() => setIsSelected(1)}>
                    <View style={[styles.itemContainer, (isSelected == 1) ? styles.itemSelected : null]}>
                        <Image
                            style={styles.logoVISA}
                            source={visaLogo} />
                        <Text style={styles.itemText}> 4548 **** **** 3005 </Text>
                        <Text style={styles.itemSmallText}> 08/24</Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity
                    disabled={(balance < 0) ? true : false}
                    onPress={() => setIsSelected(2)}>
                    <View style={[styles.itemContainer, (isSelected == 2) ? styles.itemSelected : null]}>
                        <Image
                            style={styles.logoVISA}
                            source={bitacorasLogo} />
                        <Text style={styles.itemText}> PharmaChain Tokens </Text>
                        {(balance < 0)
                            ? <Text style={styles.itemSmallText}>Not available</Text>
                            : <Text style={styles.itemSmallText}>{balance} PCT</Text>
                        }
                    </View>
                </TouchableOpacity>
                <View>
                    <ActivityIndicator isLoading={isLoading} />
                </View>
                <View style={styles.buttonContainer}>
                    <TouchableOpacity
                        style={[globalStyles.button, styles.button]}
                        onPress={() => confirmOrder()}>
                        <Text style={styles.buttonText}> Pay </Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: 'white',
    },
    headerContainer: {
        alignItems: 'center',
        margin: 30,
    },
    headerText: {
        fontSize: 18,
        fontWeight: '300'
    },
    itemContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        height: 100,
        margin: 20,
        paddingLeft: 20,
        borderWidth: 0.5,
        borderColor: 'grey',
        borderRadius: 15,
    },
    itemSelected: {
        borderWidth: 2,
        borderColor: 'green'
    },
    itemText: {
        fontSize: 16,
        fontWeight: '300',
        paddingLeft: 10,
    },
    itemSmallText: {
        fontSize: 14,
        color: 'grey',
        paddingLeft: 20
    },
    logoVISA: {
        resizeMode: 'contain',
        width: 50
    },
    buttonContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        alignContent: 'space-between',
        marginBottom: 5,
    },
    button: {
        marginTop: 40,
        width: 150,
        alignItems: 'center',
    },
    buttonText: {
        fontSize: 17,
        fontWeight: 'bold',
    },
});

export default purchaseOrder;
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from 'react';
import {
    Text,
    View,
    Alert,
    Image,
    StyleSheet,
    TouchableOpacity,
} from 'react-native';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { httpUrl } from '../../../urlServer';
import { useTypedSelector } from '../../store/reducers/reducer';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { HomeStackParamList } from '../../navigation/StackNavigator';
import handleAxiosErrors from '../../shared/handleAxiosErrors';
import AsyncStorage from '@react-native-community/async-storage';
import { setOrdered, setScanned } from '../../store/actions/order';
import { setFavPharmacy, setData, setAddress } from '../../store/actions/user';
import Icon from 'react-native-vector-icons/Ionicons';

// import scanLogo from '../../assets/images/global/scanner.png';
import scanLogo from '../../assets/images/home/barcode-scanner-100.png';
import searchLogo from '../../assets/images/home/search-bar-100.png';
import pharmacyLogo from '../../assets/images/home/pharmacy-shop-100.png';

type Props = {
    route: RouteProp<HomeStackParamList, 'Home'>,
    navigation: StackNavigationProp<HomeStackParamList, 'Home'>
};

const Home = (props: Props) => {

    const dispatch = useDispatch();
    const user = useTypedSelector(state => state.user);
    const ordered = useTypedSelector(state => state.order.ordered);
    const scanned = useTypedSelector(state => state.order.scanned);

    useEffect(() => {
        const checkCart = () => {
            if (ordered) {
                Alert.alert('Order sent!');
                dispatch(setOrdered(false));
            }
        };
        checkCart();
    }, [ordered]);

    useEffect(() => {
        // MARK: Data is retrieved from AsyncStorage at login, but latest User's data from DB must be fetched
        const setUser = async () => {
            try {
                const usr = await AsyncStorage.getItem('user');
                const tkn = await AsyncStorage.getItem('token');
                if (usr && tkn) {
                    await axios.get(`${httpUrl}/users/profile/get`, {
                        params: { user_id: usr },
                        headers: { authorization: tkn },
                    })
                        .then(response => {
                            const res = response.data;
                            if (res.length) {
                                dispatch(setData(
                                    parseInt(usr, 10),
                                    tkn,
                                    res[0].birthday,
                                    res[0].email,
                                    res[0].gender,
                                    res[0].name,
                                    res[0].phone,
                                    res[0].photo,
                                    res[0].status,
                                    res[0].eth_address,
                                    res[0].eth_prkey,
                                ));
                                fetchPharmacy(parseInt(usr, 10), tkn);
                                fetchAddress(parseInt(usr, 10), tkn);
                            }
                        })
                        .catch(async err => {
                            handleAxiosErrors(props, err);
                            console.log('Error in Home.tsx -> setUser():', err);
                        });
                } else {
                    console.log('Warning in Home.tsx -> setUser(): Either User or Token is missing');
                }
            } catch (err) {
                console.log('Error in Home.tsx -> setUser():', err);
            }
        };
        setUser();
    }, []);

    // Retrieve last pharmacy from User
    const fetchPharmacy = async (usr: number, tkn: string) => {
        await axios.get(`${httpUrl}/users/pharmacy/get`, {
            params: { user_id: usr },
            headers: { authorization: tkn },
        })
            .then(response => {
                const res = response.data;
                if (res.length) {
                    dispatch(setFavPharmacy(
                        res[0].pharmacy_id,
                        res[0].pharmacy_desc,
                        res[0].eth_address));
                }
            })
            .catch(async err => {
                handleAxiosErrors(props, err);
            });
    };

    // Retrieve User's address
    const fetchAddress = async (usr: number, tkn: string) => {
        await axios.get(`${httpUrl}/users/address/get`, {
            params: { address_id: usr },
            headers: { authorization: tkn },
        })
            .then(response => {
                const res = response.data;
                if (res.length) {
                    dispatch(setAddress(
                        res[0].address_id,
                        res[0].status,
                        res[0].street,
                        res[0].locality,
                        res[0].province,
                        res[0].zip_code,
                        res[0].country
                    ));
                } else {
                    // Avoid redux getting data from previous session
                    dispatch(setAddress(
                        0,
                        0,
                        '',
                        '',
                        '',
                        '',
                        ''
                    ));
                }
            })
            .catch(err => {
                console.log('Error in Home.tsx -> fetchAddress():', err);
            });
    };

    const scanPrescription = () => {
        dispatch(setScanned(false));
        props.navigation.navigate('MakeOrderScan');
    };

    const chooseProduct = () => {
        props.navigation.navigate('MakeOrderChoose');
    };

    const choosePharmacy = () => {
        props.navigation.navigate('PharmacySearch');
    };

    return (
        <View style={styles.container}>

            <TouchableOpacity
                onPress={() => choosePharmacy()}
                style={styles.box}>
                <Text style={styles.headerText}> Choose Pharmacy </Text>
                <Image source={pharmacyLogo} style={[styles.logo, styles.logoPharma]} />
                {(user.favPharmacyID)
                    ? <View style={styles.favPharma}>
                        <Icon name="ios-checkmark-circle-outline" size={30} color="green" />
                        <Text> Pharmacy {user.favPharmacyDesc} </Text>
                    </View>
                    : <Text> No pharmacy selected {user.favPharmacyDesc} </Text>}
            </TouchableOpacity>

            <TouchableOpacity
                onPress={() => scanPrescription()}
                style={styles.box}>
                <Text style={styles.headerText}> Scan Prescription </Text>
                <Image source={scanLogo} style={styles.logo} />
                {(scanned) ? <Text style={styles.notFoundText}> Prescription not found </Text> : null}
            </TouchableOpacity>

            <TouchableOpacity
                onPress={() => chooseProduct()}
                style={styles.box}>
                <Text style={styles.headerText}> Choose Product </Text>
                <Image source={searchLogo} style={styles.logo} />
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: 'white',
    },
    favPharma: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingTop: 10,
    },
    box: {
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 15,
        borderColor: 'grey',
        borderWidth: 1,
        height: 160,
        marginLeft: 20,
        marginRight: 20,
        marginTop: 20,
        backgroundColor: '#F0EDE5', // Coconut Milk
        elevation: 4,
        shadowOffset: { width: 3, height: 3 },
        shadowColor: 'grey',
        shadowOpacity: 1,
        shadowRadius: 10,
    },
    headerText: {
        fontSize: 18,
        fontWeight: '500',
    },
    notFoundText: {
        fontSize: 16,
        color: 'red',
    },
    logo: {
        marginTop: 10,
        width: 70,
        height: 70,
        resizeMode: 'contain',
    },
    logoPharma: {
        marginTop: 7,
        width: 60,
        height: 60,
        resizeMode: 'contain',
    },
});

export default Home;

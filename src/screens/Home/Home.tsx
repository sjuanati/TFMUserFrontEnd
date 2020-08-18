/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from 'react';
import {
    Text,
    View,
    Alert,
    Image,
    PixelRatio,
    StyleSheet,
    TouchableOpacity,
} from 'react-native';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { useTypedSelector } from '../../store/reducers/reducer';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { HomeStackParamList } from '../../navigation/StackNavigator';
import { httpUrl } from '../../../urlServer';
import Icon from 'react-native-vector-icons/Ionicons';

// Components
import Cons from '../../shared/Constants';
import choosePharmacyLogo from '../../assets/images/home/Placeholder-yellow.png';
import otcLogo from '../../assets/images/home/OTC-yellow.png';
import pillLogo from '../../assets/images/home/Pill-Yellow.png';
import showToast from '../../shared/Toast';
import fontSize from '../../shared/FontSize';
import handleAxiosErrors from '../../shared/handleAxiosErrors';
import AsyncStorage from '@react-native-community/async-storage';
import { setOrdered } from '../../store/actions/order';
import { setFavPharmacy, setData, setAddress } from '../../store/actions/user';

const FONT_SIZE = fontSize(24, PixelRatio.getFontScale());

type Props = {
    route: RouteProp<HomeStackParamList, 'Home'>,
    navigation: StackNavigationProp<HomeStackParamList, 'Home'>
};

const Home = (props: Props) => {

    const dispatch = useDispatch();
    const user = useTypedSelector(state => state.user);
    const ordered = useTypedSelector(state => state.order.ordered);
    //const [loading, setLoading] = useState(false);
    //const [isActiveAccount, setIsActiveAccount] = useState(false);

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
                                ));
                                // If User is disabled, go to AccountDisabled screen
                                // if (res[0].status === 0) {
                                //     console.log(`User ${usr} disabled!`);
                                //     props.navigation.navigate('AccountDisabled', {
                                //         user_id: usr,
                                //     });
                                // } else {
                                fetchPharmacy(parseInt(usr, 10), tkn);
                                fetchAddress(parseInt(usr, 10), tkn);
                                //}
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
                console.log('Error in insideSession.js -> fetchAddress():', err);
            });
    };

    const renderChoosePharmacy = () => (
        <View style={[styles.containerChoosePharmacy, styles.containerRow]}>
            <TouchableOpacity
                style={styles.circle}
                onPress={() => props.navigation.navigate('PharmacySearch')}>
                <Text style={styles.textItem}> Choose </Text>
                <Text style={styles.textItem}>  Pharmacy </Text>
                <Image source={choosePharmacyLogo} style={styles.icon} />
            </TouchableOpacity>
            {(user.favPharmacyID)
                ? <View style={[styles.favPharma, styles.containerRow]}>
                    <Icon name="ios-checkmark-circle-outline" size={30} color="green" />
                    <View style={styles.container}>
                        <Text style={styles.favPharmaText}> Pharmacy </Text>
                        <Text style={styles.favPharmaText}> {user.favPharmacyDesc} </Text>
                    </View>
                </View>
                : null}
        </View>
    );

    const renderOrderProduct = () => (
        <View style={styles.containerOrderProduct}>
            <TouchableOpacity
                style={styles.circle}
                onPress={openOrder}>
                <Text style={styles.textItem}> What do </Text>
                <Text style={styles.textItem}> you need? </Text>
                <View style={styles.containerRow}>
                    <Image source={pillLogo} style={styles.icon} />
                    <Image source={otcLogo} style={styles.icon} />
                </View>
            </TouchableOpacity>
        </View>
    );

    const openOrder = () => {
        if (!user.favPharmacyID) {
            showToast('Choose pharmacy to make an Order', 'default');
        } else {
            props.navigation.navigate('MakeOrder');
        }
    };

    return (
        <View style={styles.container}>
            {renderChoosePharmacy()}
            {renderOrderProduct()}
        </View>
    );
};

const styles = StyleSheet.create({
    textItem: {
        fontSize: FONT_SIZE,
        marginBottom: 5,
    },
    favPharmaText: {
        fontSize: FONT_SIZE - 4,
        paddingTop: 5,
    },
    container: {
        flex: 1,
        flexDirection: 'column',
    },
    containerChoosePharmacy: {
        alignItems: 'flex-start',
        width: '100%',
        aspectRatio: 10 / 4,
        paddingLeft: 10,
    },
    containerOrderProduct: {
        alignItems: 'center',
        aspectRatio: 10 / 4,
    },

    containerRow: {
        flexDirection: 'row',
    },
    circle: {
        height: 160,
        width: 160,
        borderRadius: 100,
        borderWidth: 2,
        borderColor: Cons.COLORS.YELLOW,
        backgroundColor: Cons.COLORS.WHITE,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 15,
    },
    favPharma: {
        paddingLeft: 15,
        paddingTop: 80,
    },
    icon: {
        height: 55,
        width: 55,
    },
});

export default Home;

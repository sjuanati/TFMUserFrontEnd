// Libs
import React, { useState, useEffect } from 'react';
import {
    Alert,
    View,
    Text,
    Linking,
    StyleSheet,
    ScrollView,
    TouchableOpacity
} from 'react-native';
import axios from 'axios';
import Icon from 'react-native-vector-icons/Ionicons';
import { useSelector, useDispatch } from 'react-redux';

// Components
import PharmacySchedule from './PharmacySchedule';
import CustomHeaderBack from '../../navigation/CustomHeaderBack';
import { setFavPharmacy } from '../../store/actions/user';
import handleAxiosErrors from '../../shared/handleAxiosErrors';

// Global settings
import { httpUrl } from '../../../urlServer';
import globalStyles from '../../UI/Style';
import Cons from '../../shared/Constants';
import logger from '../../shared/logRecorder';

const pharmacyDetail = (props) => {

    const [pharmacy, setPharmacy] = useState({});
    const [schedule, setSchedule] = useState([]);
    const [openNow, setOpenNow] = useState(false);
    const [isShowingSchedule, setIsShowingSchedule] = useState(false);
    const [weekday, setWeekday] = useState(-1);
    const order = useSelector(state => state.order);
    const user = useSelector(state => state.user);
    const dispatch = useDispatch();
    let resultSchedule: any;
    let resultOpenNow: any;
    let resDay: any;
    const [loading, setLoading] = useState(false);

    // Retrieve schedule from given pharmacy
    const fetchSchedule = async (item) => {
        await axios.get(`${httpUrl}/pharmacy/schedule/get`, {
            params: {
                pharmacy_id: item.pharmacy_id,
            },
            headers: { authorization: user.token }
        })
            .then(response => {
                if (response.data.length > 0) {
                    const res = response.data;
                    [resultSchedule, resultOpenNow, resDay] = PharmacySchedule(res);
                    setSchedule(resultSchedule);
                    setOpenNow(resultOpenNow);
                    setWeekday(resDay);
                }
            })
            .catch(async err => {
                handleAxiosErrors(props, err);
            })
            
    };

    useEffect(() => {
        let item = props.navigation.getParam('item');
        setPharmacy(item);
        fetchSchedule(item);
    }, []);

    const handleNewOrder = () => {
        dispatch(setFavPharmacy(pharmacy.pharmacy_id, pharmacy.pharmacy_desc));
        props.navigation.navigate('Order');
    };

    const handleBackToCart = () => {
        dispatch(setFavPharmacy(pharmacy.pharmacy_id, pharmacy.pharmacy_desc));
        props.navigation.navigate('OrderSummary');
    };


    const toggleIsShowingSchedule = () => {
        const newVal = !isShowingSchedule;
        setIsShowingSchedule(newVal);
    };

    // Does a phone call to the given phone number
    const handlePhoneCall = phoneNumber => {

        const phoneCall = `tel:${phoneNumber}`;

        Linking.canOpenURL(phoneCall)
            .then(supported => {
                if (!supported) {
                    Alert.alert('Phone call is not available');
                } else {
                    return Linking.openURL(phoneCall);
                }
            })
            .catch(err => {
                console.log('Error on Pharmacy.js -> handlePhoneCall(): ', err);
            });
    };

    // Opens profile in Facebook
    const handleFacebook = fblink => {

        const FACEBOOK_ID = fblink;
        const FACEBOOK_URL_FOR_APP = `fb://profile/${FACEBOOK_ID}`;
        const FACEBOOK_URL_FOR_BROWSER = `https://fb.com/${FACEBOOK_ID}`;

        Linking.canOpenURL(FACEBOOK_URL_FOR_APP)
            .then((supported) => {
                if (!supported) {
                    Linking.openURL(FACEBOOK_URL_FOR_BROWSER);
                } else {
                    Linking.openURL(FACEBOOK_URL_FOR_APP);
                }
            })
            .catch(err => {
                console.log('Error on Pharmacy.js -> handleFacebook(): ', err);
            });
    };

    // Opens profile in Instagram
    const handleInstagram = instalink => {

        const INSTAGRAM_PROFILE = instalink;
        const INSTAGRAM_URL_FOR_APP = `instagram://user?username=${INSTAGRAM_PROFILE}`;
        const INSTAGRAM_URL_FOR_BROWSER = `https://instagram.com/${INSTAGRAM_PROFILE}`;

        Linking.canOpenURL(INSTAGRAM_URL_FOR_APP)
            .then((supported) => {
                console.log(supported);
                if (!supported) {
                    Linking.openURL(INSTAGRAM_URL_FOR_BROWSER);
                } else {
                    Linking.openURL(INSTAGRAM_URL_FOR_APP);
                }
            })
            .catch(err => {
                console.warn('Error on Pharmacy.js -> handleInstagram(): ', err);
                logger('ERR', 'FRONT-USER', `Pharmacy.js -> handleInstagram(): ${err}`, user, `instagram profile: ${INSTAGRAM_PROFILE}`);
            })
    };

    // Send an email to the given address
    const handleEmail = email => {

        const sendEmail = `mailto:${email}`;

        Linking.canOpenURL(sendEmail)
            .then((supported) => {
                if (supported) {
                    Linking.openURL(sendEmail);
                } else {
                    Alert.alert(`No se puede abrir el correo`);
                }
            })
            .catch(err => {
                console.warn('Error on Pharmacy.js -> handleEmail(): ', err);
                logger('ERR', 'FRONT-USER', `Pharmacy.js -> handleEmail(): ${err}`, user, `email: ${email}`);
            })
    };

    // Opens a URL in the browser
    const handleURL = url => {

        Linking.canOpenURL(url)
            .then((supported) => {
                if (supported) {
                    Linking.openURL(url);
                } else {
                    Alert.alert(`No se puede abrir el navegador`);
                }
            })
            .catch(err => {
                console.warn('Error on Pharmacy.js -> handleURL(): ', err);
                logger('ERR', 'FRONT-USER', `Pharmacy.js -> handleURL(): ${err}`, user, `email: ${url}`);
            })
    };

    return (
        <ScrollView>
            <View style={styles.container}>
                <CustomHeaderBack {...props} />

                {/* PHARMACY NAME */}
                <View style={[styles.header, styles.vMargin]}>
                    <Text style={styles.headerText}> {pharmacy.pharmacy_desc} </Text>
                </View>

                <View style={styles.body}>
                    {/* LICENSED PERSON */}
                    <Text style={[styles.containerText, styles.vMargin]}>
                        <Text style={styles.textBold}> Ldo.Titular: </Text>
                        <Text style={styles.textSmaller}> {pharmacy.owner_name} </Text>
                    </Text>

                    {/* SCHEDULE */}
                    <TouchableOpacity
                        onPress={() => toggleIsShowingSchedule()}>
                        <View style={[styles.containerText, styles.vMargin]}>
                            <Text style={styles.textBold}> Horario: </Text>
                            {(weekday === -1) ?
                                <Text style={styles.valuesNormal}> No disponible </Text>
                                :
                                (openNow) ?
                                    <Text style={styles.open}> Abierto ahora </Text>
                                    :
                                    <Text style={styles.closed}> Cerrado ahora </Text>}
                            {(weekday !== -1) ?
                                (openNow) ?
                                    <Icon name="ios-arrow-down" size={30} color='green' />
                                    :
                                    <Icon name="ios-arrow-down" size={30} color='red' />
                                :
                                null}

                        </View>
                        {(isShowingSchedule) ?
                            schedule.map((item, index) => {
                                if (weekday === index) {
                                    return (<Text style={styles.valuesSelected} key={index}> {item} </Text>)
                                } else {
                                    return (<Text style={styles.valuesNormal} key={index}> {item} </Text>)
                                }
                            })
                            : null}
                    </TouchableOpacity>


                    {/* ADDRESS */}
                    <Text style={[styles.textBold, styles.vMargin]}> Dirección: </Text>
                    <Text style={styles.valuesNormal}>
                        {(weekday === -1) ?
                            'No disponible'
                            :
                            `${pharmacy.address} \n ${pharmacy.zip_code} ${pharmacy.locality}`
                        }

                    </Text>
                </View>

                {/* CALL, INSTA, FB, EMAIL, WEB */}
                <View style={styles.containerButtons}>
                    <TouchableOpacity onPress={() => handlePhoneCall(pharmacy.phone_number)}>
                        <Icon name="ios-call" size={35} color='grey' style={styles.item} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => handleInstagram(pharmacy.instagram)}>
                        <Icon name="logo-instagram" size={35} color='grey' style={styles.item} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => handleFacebook(pharmacy.facebook)}>
                        <Icon name="logo-facebook" size={35} color='grey' style={styles.item} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => handleEmail(pharmacy.email)}>
                        <Icon name="ios-at" size={35} color='grey' style={styles.item} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => handleURL(pharmacy.web)}>
                        <Icon name="ios-globe" size={35} color='grey' style={styles.item} />
                    </TouchableOpacity>
                </View>

                {/* ORDER */}
                {/* <View style={styles.containerButtons}> */}
                <View style={[styles.containerButtons, styles.vMargin]}>
                    <View style={styles.item}>
                        <TouchableOpacity
                            style={globalStyles.button}
                            onPress={() => handleNewOrder()}>
                            <Text style={globalStyles.buttonText}> {`Seleccionar y`} </Text>
                            <Text style={globalStyles.buttonText}> {`nuevo pedido`} </Text>
                        </TouchableOpacity>
                    </View>

                    {(order.length != 0) ?
                        <View style={styles.item}>
                            <TouchableOpacity
                                style={globalStyles.button}
                                onPress={() => handleBackToCart()}>
                                <Text style={globalStyles.buttonText}> {`  Seleccionar y`} </Text>
                                <Text style={globalStyles.buttonText}> {`volver al carrito`} </Text>
                            </TouchableOpacity>
                        </View>
                        : null}

                </View>

            </View>
        </ScrollView>
    )
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    containerText: {
        flexDirection: 'row',
    },
    containerButtons: {
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    item: {
        margin: 15,
    },
    header: {
        backgroundColor: Cons.COLORS.GREEN,
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        height: 50,
    },
    headerText: {
        fontSize: 30,
        fontWeight: 'bold',
        color: Cons.COLORS.WHITE,
    },
    body: {
        marginLeft: 20,
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
        flexDirection: 'column',
    },
    textBold: {
        fontSize: 20,
        fontWeight: 'bold',
        color: Cons.COLORS.BLACK,
    },
    valuesNormal: {
        fontSize: 20,
        color: Cons.COLORS.BLACK,
        marginLeft: 30,
        marginBottom: 5,
    },
    valuesSelected: {
        fontSize: 20,
        color: Cons.COLORS.BLACK,
        fontWeight: 'bold',
        marginLeft: 30,
        marginBottom: 5,
    },
    textSmaller: {
        fontSize: 15,
    },
    open: {
        fontSize: 20,
        color: 'green',
        marginRight: 5,
    },
    closed: {
        fontSize: 20,
        color: 'red',
        marginRight: 5,
    },
    vMargin: {
        marginBottom: 20
    }
});

export default pharmacyDetail;
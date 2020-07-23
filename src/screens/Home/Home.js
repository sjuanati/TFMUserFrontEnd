import React, { useEffect, useState } from 'react';
import {
    Text,
    View,
    Alert,
    Image,
    PixelRatio,
    StyleSheet,
    TouchableOpacity,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import Icon from 'react-native-vector-icons/Ionicons';

// Components
import Cons from '../../shared/Constants';
import { setOrdered } from '../../store/actions/order';
import choosePharmacyLogo from '../../assets/images/home/Placeholder-yellow.png';
import otcLogo from '../../assets/images/home/OTC-yellow.png';
import pillLogo from '../../assets/images/home/Pill-Yellow.png';
import showToast from '../../shared/Toast';
import fontSize from '../../shared/FontSize';
const FONT_SIZE = fontSize(24, PixelRatio.getFontScale());


const home = (props) => {

    const dispatch = useDispatch();
    const user = useSelector(state => state.user);
    const ordered = useSelector(state => state.order.ordered);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        checkCart();
    }, [ordered]);

    //TODO: recover previous cart status, retrieving data from DB
    const checkCart = () => {
        if (ordered) {
            //showToast('Pedido enviado!', 'default');
            Alert.alert('Order sent!');
            dispatch(setOrdered(false));
        }
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
                    <Icon name="ios-checkmark-circle-outline" size={30} color='green' />
                    <View style={styles.container}>
                        <Text style={styles.favPharmaText}> Farmacia </Text>
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
            props.navigation.navigate('Order');
        }
    }

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

export default home;
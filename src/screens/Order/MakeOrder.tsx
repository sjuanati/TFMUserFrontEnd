import React from 'react';
import {
    Text,
    View,
    Image,
    StyleSheet,
    TouchableOpacity,
} from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { HomeStackParamList } from '../../navigation/StackNavigator';
import { setScanned } from '../../store/actions/order';
import { useDispatch } from 'react-redux';
import { useTypedSelector } from '../../store/reducers/reducer';
import scanLogo from '../../assets/images/global/scanner.png';
import searchLogo from '../../assets/images/global/search.png';

type Props = {
    route: RouteProp<HomeStackParamList, 'MakeOrder'>,
    navigation: StackNavigationProp<HomeStackParamList, 'MakeOrder'>
};

const MakeOrder = (props: Props) => {

    const dispatch = useDispatch();
    const scanned = useTypedSelector(state => state.order.scanned);

    const scanPrescription = () => {
        dispatch(setScanned(false));
        props.navigation.navigate('MakeOrderScan');
    };

    const chooseProduct = () => {
        props.navigation.navigate('MakeOrderChoose');
    };

    return (
        <View style={styles.container}>
            <View style={styles.itemContainer}>
                <TouchableOpacity
                    onPress={() => scanPrescription()}
                    style={styles.buttonContainer}>
                    <Text style={styles.headerText}> Scan Prescription </Text>
                    <Image source={scanLogo} />
                    {(scanned) ? <Text style={styles.notFoundText}> Prescription not found </Text> : null}
                </TouchableOpacity>
            </View>
            <View style={styles.itemContainer}>
                <Text>
                    or
                </Text>
            </View>
            <View style={styles.itemContainer}>
                <TouchableOpacity
                    onPress={() => chooseProduct()}
                    style={styles.buttonContainer}>
                    <Text style={styles.headerText}> Choose Product </Text>
                    <Image source={searchLogo}
                        style={styles.logo} />
                </TouchableOpacity>
            </View>

        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    itemContainer: {
        marginTop: 60,
        alignItems: 'center',
    },
    buttonContainer: {
        alignItems: 'center',
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
        marginTop: -5,
        width: 100,
        height: 100,
        resizeMode: 'contain',
    },
});

export default MakeOrder;

import React from 'react';
import { 
    Text,
    View,
    Image,
    StyleSheet
} from 'react-native';
import visaLogo from '../assets/images/global/visa.png';

const paymentVISA = () => (
    <View style={styles.paymentContainer}>
        <Image
            style={styles.logoContainer}
            source={visaLogo} />
        <Text style={styles.paymentItemText}> 4548 **** **** 3005 </Text>
        <Text style={styles.paymentItemSmallText}> 08/24</Text>
    </View>
);

const styles = StyleSheet.create({
    paymentContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        height: 70,
        margin: 20,
        paddingLeft: 20,
        borderWidth: 0.5,
        borderColor: 'grey',
        borderRadius: 15,
    },
    paymentItemText: {
        fontSize: 16,
        fontWeight: '300',
        paddingLeft: 10,
    },
    paymentItemSmallText: {
        fontSize: 14,
        color: 'grey',
        paddingLeft: 20,
    },
    logoContainer: {
        resizeMode: 'contain',
        width: 50,
        height: 50,
    },
});

export default paymentVISA;

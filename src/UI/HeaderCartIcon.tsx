import React, {FC} from 'react';
import { Text, View, Image, StyleSheet, PixelRatio } from 'react-native';
import { useTypedSelector } from '../store/reducers/reducer';
const Cart = require('../assets/images/global/cart.png');
import Cons from '../shared/Constants';

// Font size management
let FONT_SIZE = 16;
if (PixelRatio.getFontScale() > 1) {FONT_SIZE = 12;}

const HeaderCartIcon: FC = () => {

    const cartItems = useTypedSelector(state => state.order.items);

    return (
        <View>
            <Image
                style={styles.cartIcon}
                source={Cart} />
            <View style={(cartItems.length < 10)
                ? styles.cartContainerLowerNumber
                : styles.cartContainerHigherNumber}>
                <Text style={styles.chartText}> {cartItems.length} </Text>
            </View >
        </View>
    );
};

const styles = StyleSheet.create({
    cartIcon: {
        height: 40,
        width: 40,
        right: 11,
    },
    cartContainerLowerNumber: {
        position: 'absolute',
        height: 30,
        width: 30,
        //right: -2.5,
        right: 10,
        bottom: 12,
    },
    cartContainerHigherNumber: {
        position: 'absolute',
        height: 30,
        width: 30,
        //right: 2,
        right: 13,
        bottom: 12,
    },
    chartText: {
        color: Cons.COLORS.BLACK,
        fontSize: FONT_SIZE,
    },

});

export default HeaderCartIcon;

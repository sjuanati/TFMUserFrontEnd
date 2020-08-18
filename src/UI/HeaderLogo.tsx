import React from 'react';
import { View, StyleSheet, Image } from 'react-native';
const drmaxLogo = require('../assets/images/global/DrMax.png');

const headerLogo = () => {

    return (
        <View style={styles.header}>
            <Image
                style={styles.logo}
                source={drmaxLogo} />
        </View>
    );
};

const styles = StyleSheet.create({
    header: {
        flex: 1,
        backgroundColor: 'white',
        height: 60,
        alignItems: 'center',
    },
    logo: {
        resizeMode: 'contain',
        width: 150,
        height: 40,
    },
});

export default headerLogo;

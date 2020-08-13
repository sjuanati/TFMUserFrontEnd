import React from 'react';
import { View, StyleSheet } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

const headerBackIcon = (props) => (
    <View style={styles.back}>
        <Ionicons
            name="ios-arrow-back"
            size={25}
            color="#F4B13E"
            style={styles.back}
        />
    </View>
);

const styles = StyleSheet.create({
    backContainer: {
        width: 80,
    },
    back: {
        paddingLeft: 10,
        zIndex: 2,
        backgroundColor: 'transparent',
    },
});

export default headerBackIcon;

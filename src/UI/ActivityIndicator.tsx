import React from 'react';
import {
    View,
    StyleSheet,
    ActivityIndicator,
} from 'react-native';


const activityIndicator = ({ isLoading }: {isLoading: boolean}) => {
    return (
        <View>
            <ActivityIndicator
                size="large"
                color="#6B5B95"
                style={styles.loading}
                animating={(isLoading) ? true : false}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    loading: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        alignItems: 'center',
        justifyContent: 'center',
    },
});

export default activityIndicator;

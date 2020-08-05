
import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';


const keypad = (props) => {

    return (
    <View style={styles.keyboardContainer}>
        <View style={styles.keypadRows}>
            <TouchableOpacity
                onPress={() => props.onAddNumber('1')}
                style={styles.key}>
                <Text style={styles.keyText}>1</Text>
            </TouchableOpacity>
            <TouchableOpacity
                onPress={() => props.onAddNumber('2')}
                style={styles.key}>
                <Text style={styles.keyText}>2</Text>
            </TouchableOpacity>
            <TouchableOpacity
                onPress={() => props.onAddNumber('3')}
                style={styles.key}>
                <Text style={styles.keyText}>3</Text>
            </TouchableOpacity>
        </View>
        <View style={styles.keypadRows}>
            <TouchableOpacity
                onPress={() => props.onAddNumber('4')}
                style={styles.key}>
                <Text style={styles.keyText}>4</Text>
            </TouchableOpacity>
            <TouchableOpacity
                onPress={() => props.onAddNumber('5')}
                style={styles.key}>
                <Text style={styles.keyText}>5</Text>
            </TouchableOpacity>
            <TouchableOpacity
                onPress={() => props.onAddNumber('6')}
                style={styles.key}>
                <Text style={styles.keyText}>6</Text>
            </TouchableOpacity>
        </View>
        <View style={styles.keypadRows}>
            <TouchableOpacity
                onPress={() => props.onAddNumber('7')}
                style={styles.key}>
                <Text style={styles.keyText}>7</Text>
            </TouchableOpacity>
            <TouchableOpacity
                onPress={() => props.onAddNumber('8')}
                style={styles.key}>
                <Text style={styles.keyText}>8</Text>
            </TouchableOpacity>
            <TouchableOpacity
                onPress={() => props.onAddNumber('9')}
                style={styles.key}>
                <Text style={styles.keyText}>9</Text>
            </TouchableOpacity>
        </View>
        <View style={styles.keypadRows}>
            <TouchableOpacity
                onPress={() => props.onAddNumber(',')}
                style={styles.key}>
                <Text style={styles.keyText}>,</Text>
            </TouchableOpacity>
            <TouchableOpacity
                onPress={() => props.onAddNumber('0')}
                style={styles.key}>
                <Text style={styles.keyText}>0</Text>
            </TouchableOpacity>
            <TouchableOpacity
                onPress={() => props.onRemoveNumber()}
                style={styles.key}>
                <Text style={styles.keyText}>
                    <Ionicons
                        name='arrow-back-sharp'
                        size={25}
                    />
                </Text>
            </TouchableOpacity>
        </View>
    </View>
    )
}

const styles = StyleSheet.create({
    keyboardContainer: {
        marginTop: 15,
    },
    keypadRows: {
        marginTop: 20,
        flexDirection: 'row',
        justifyContent: 'space-evenly',
    },
    key: {
        width: 50,
        height: 50,
        alignItems: 'center',
        justifyContent: 'center',
    },
    keyText: {
        fontSize: 26,
    },
});

export default keypad;
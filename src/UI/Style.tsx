import { StyleSheet } from 'react-native';

export default StyleSheet.create({
    button: {
        backgroundColor: '#F7CF46',  // orange
        padding: 10,
        borderRadius: 15,
        elevation:4,
        shadowOffset: { width: 3, height: 3 },
        shadowColor: 'grey',
        shadowOpacity: 0.5,
        shadowRadius: 10,
    },
    buttonDisabled: {
        backgroundColor: '#F7CF46',  // orange
        padding: 10,
        borderRadius: 15,
        elevation:4,
        shadowOffset: { width: 3, height: 3 },
        shadowColor: 'grey',
        shadowOpacity: 0.5,
        shadowRadius: 10,
        opacity: 0.5,
    },
    buttonText: {
        fontSize: 17,
    },
});

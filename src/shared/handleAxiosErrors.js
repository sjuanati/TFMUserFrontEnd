import { Alert } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
//import showToast from './Toast';

const handleAxiosErrors = async (props, err) => {
    if (err.response && (err.response.status === 401 || err.response.status === 403)) {
        //showToast('Please sign in again', 'default');
        Alert.alert('Please sign in again');
        await AsyncStorage.clear();
        props.navigation.navigate('StartScreen');
    } else if (err.response && err.response.status === 400) {
        //showToast('Error found', 'danger');
        Alert.alert('Error found');
    } else {
        //showToast('No connection available', 'warning');
        Alert.alert('Connection not available');
    }
};

export default handleAxiosErrors;

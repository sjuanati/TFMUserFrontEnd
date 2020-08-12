import AsyncStorage from '@react-native-community/async-storage';
import showToast from './Toast';

const handleAxiosErrors = async (props, err) => {
    if (err.response && (err.response.status === 401 || err.response.status === 403)) {
        showToast('Please sign in again', 'default');
        await AsyncStorage.clear();
        props.navigation.navigate('StartScreen');
    } else if (err.response && err.response.status === 400) {
        showToast('Error found', 'danger');
    } else {
        showToast('No connection available', 'warning');
    }
};

export default handleAxiosErrors;

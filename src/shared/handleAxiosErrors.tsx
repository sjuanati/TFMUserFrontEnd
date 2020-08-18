import AsyncStorage from '@react-native-community/async-storage';
import showToast from './Toast';

const HandleAxiosErrors = async (props: any, err: any) => {
    if (err.response && (err.response.status === 401 || err.response.status === 403)) {
        showToast('Please sign in again', 'warning');
        await AsyncStorage.clear();
        props.navigation.navigate('SignIn');
    } else if (err.response && err.response.status === 400) {
        showToast('Error found', 'danger');
    } else {
        showToast('No connection available', 'warning');
    }
};

export default HandleAxiosErrors;

import { Toast } from 'native-base';

const showToast = (text: string, type) => {
    Toast.show({
        text: text,
        type: type,
        position: 'bottom',
        duration: 3000,
    });
};

export default showToast;

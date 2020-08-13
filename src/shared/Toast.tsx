import { Toast } from 'native-base';

const showToast = (text, type) => {
    Toast.show({
        text: text,
        type: type,
        position: 'bottom',
        duration: 3000,
    });
};

export default showToast;

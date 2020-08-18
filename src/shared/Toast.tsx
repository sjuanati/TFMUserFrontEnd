import { Toast } from 'native-base';

type Type = 'danger' | 'success' | 'warning' | undefined;

const showToast = (text: string, type: Type) => {
    Toast.show({
        text: text,
        type: type,
        position: 'bottom',
        duration: 3000,
    });
};

export default showToast;

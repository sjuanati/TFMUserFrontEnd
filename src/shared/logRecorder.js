import axios from 'axios';
import { Platform } from 'react-native';
import { httpUrl } from '../../urlServer';

const save = async (type, source, msg, user, extra) => {

    try {
        extra += ` user_id: ${user.id} platform: ${Platform.OS} ${Platform.Version}`;
        await axios.post(`${httpUrl}/log/save`, {
            type,
            source,
            msg,
            extra,
        }, {
            headers: {
                authorization: user.token,
            }
        })
            .then(response => {
                if (response.data !== '') {
                    const data = response.data;
                    console.log('log recorded: ', data);
                }
            })
            .catch(err => {
                console.log('Error on logRecorder.js -> save() : ', err);
            })
    } catch (err) {
        console.log('Error in logRecorder.js (User):', err);
    }


}

export default save;

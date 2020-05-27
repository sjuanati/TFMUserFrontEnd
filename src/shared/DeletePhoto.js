import RNFS from 'react-native-fs';

// Delete photos from Order in device storage 
const deletePhoto = (order) => {

    order.forEach((item) => {

        //TODO: ANDROID case
        console.log('item before', item);
        const filePath = item.itemPhoto.split('///').pop();
        console.log('item afterwards', filePath)

        RNFS.exists(filePath)
        .then((res) => {
          if (res) {
            RNFS.unlink(filePath)
                .then(() => console.log('FILE DELETED'))
                .catch(err => console.log('Error on DeletePhoto.js -> deletePhoto() : ', err));
          }
        }) 
    })

}

export default deletePhoto;
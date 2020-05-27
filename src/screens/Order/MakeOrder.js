// Libs
import React, { useState } from 'react';
import {
    Text,
    View,
    StyleSheet,
    TouchableOpacity,
    Image, ScrollView,
    TextInput,
    KeyboardAvoidingView,
    Alert,
    Platform,
    PixelRatio,
} from 'react-native';
import axios from 'axios';
import { Spinner } from "native-base";
import { useDispatch, useSelector } from 'react-redux';
import ImagePicker from 'react-native-image-picker';
import Icon from 'react-native-vector-icons/Ionicons';
import IconMaterial from 'react-native-vector-icons/MaterialCommunityIcons';

// Components
import globalStyles from '../../UI/Style';
import CustomHeaderBack from '../../navigation/CustomHeaderBack';
import { addItem } from '../../store/actions/order';
import DeletePhoto from '../../shared/DeletePhoto';
import fontSize from '../../shared/FontSize';
import showToast from '../../shared/Toast';
import { httpUrl } from '../../../urlServer';
import Cons from '../../shared/Constants';
import logger from '../../shared/logRecorder';

// Font size management
let FONT_SIZE = fontSize(20, PixelRatio.getFontScale());

const makeOrder = (props) => {

    const [photoOrder, setPhotoOrder] = useState('');
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();
    const order = useSelector(state => state.order.items);
    const user = useSelector(state => state.user);
    const maxItemsPerOrder = 50;
    let itemsNumber = order.length;
    let itemDescription = '';
    let itemDescriptionTextInput = '';

    // Make photo of prescription or health card
    const addPhoto = () => {

        // Set quality depending on device (iOS, Android)
        let setting: object;
        Platform.OS === 'ios' ?
        setting = {
            quality: 0,
            noData: true,
            maxWidth: 1000,
            maxHeight: 1000,
            storageOptions: {
                skipBackup: true,
            }
        }
        :
        setting = {
            quality: 0.2,
            noData: true,
            storageOptions: {
                skipBackup: true,
            }
        }

        // Take photo from Camera or choose photo from Library
        ImagePicker.showImagePicker(
            setting,
            response => {
                if (response.error) {
                    showToast("Cámara no disponible")
                } else if (!response.didCancel) {
                    console.log('Added photo to device storage : ', response.uri);
                    checkPhoto();
                    setPhotoOrder(response.uri);
                }
            }
        )
    };

    // If user repeats a photo, delete the previous one from device storage
    const checkPhoto = () => {
        if (photoOrder) {
            const uri = [{ itemPhoto: photoOrder }];
            DeletePhoto(uri);
        }
    };

    // Update Order state and go to order summary screen
    const handleOrder = (option) => {

        // Remove any space before and after user's text
        let itemDescTrimmed = itemDescription.trim();

        // Add item only if order is not empty (has either product description or photo)
        if ((itemDescTrimmed.length > 0) || (photoOrder.length > 0)) {
            if (itemDescTrimmed === '') {
                //itemDescTrimmed = 'Producto/s con receta médica';
                itemDescTrimmed = 'Producto con imagen adjunta';
            }
            itemsNumber++;
            dispatch(addItem(itemsNumber, itemDescTrimmed, photoOrder));
        }

        switch (option) {
            case 'confirm':
                clearContents();
                props.navigation.navigate('OrderSummary');
                break;
            case 'add': default:
                clearContents();
                break;
        }
    };

    const clearContents = () => {
        setPhotoOrder('');
        itemDescriptionTextInput.clear();
    };

    // Handle Order description TextInput
    const handleItemDescription = (value) => {
        itemDescription = value;
    };

    return (
        <View style={{flex: 1}}>
        <CustomHeaderBack {...props} />
            <KeyboardAvoidingView
                style={styles.keyboard}
                behavior={Platform.OS == "ios" ? "position" : "height"}
                enabled
                keyboardVerticalOffset={Platform.OS === 'ios' ? -20 : 90}
            >
            <ScrollView>
                <View style={styles.container}>
                    <Text style={styles.textHeader}>Nuevo Pedido</Text>
                    <Text style={styles.textPharmacy}> Farmacia {user.favPharmacyDesc}</Text>
                    {/* <Text style={styles.textSubHeader}>Haz una foto de tu Receta o de tu tarjeta sanitaria si es electrónica:</Text> */}
                    <Text style={styles.textSubHeader}></Text>
                    <View style={styles.containerPhoto}>
                        {(photoOrder) ? 
                            <View style={styles.image}>
                                <Image
                                    source={photoOrder ? { uri: photoOrder } : null}
                                    style={styles.photoOrder}
                                />
                            </View>
                            : null
                        }
                        <TouchableOpacity
                            style={globalStyles.button}
                            onPress={() => addPhoto()}>
                            {(photoOrder.length === 0) ?
                                <View style={styles.containerIconButton}>
                                    <Icon name="ios-camera" size={35} color='gray' />
                                    <Text style={[globalStyles.buttonText, {fontSize: FONT_SIZE}]}> Añadir foto </Text>
                                </View>
                                :
                                <Text style={[globalStyles.buttonText,{fontSize: FONT_SIZE}]}> Repetir foto </Text>
                            }
                        </TouchableOpacity>
                    </View>
                    <Text style={styles.textSubHeader}>¿Quieres pedir más cosas?, escríbelo a continuación:</Text>
                    <TextInput
                        style={styles.input}
                        placeholder={` Productos sin receta, \n parafarmacia...`}
                        multiline={true}
                        maxLength={999}
                        onChangeText={handleItemDescription}
                        ref={input => { itemDescriptionTextInput = input }}>
                    </TextInput>
                    <View style={styles.containerButton}>
                        <View style={styles.item}>
                            <TouchableOpacity
                                style={(order.length >= maxItemsPerOrder) ? globalStyles.buttonDisabled : globalStyles.button}
                                onPress={() => handleOrder('add')}
                                disabled={(order.length >= maxItemsPerOrder ? true : false)}>
                                <Text style={[globalStyles.buttonText,{fontSize: FONT_SIZE}]}> {`Pide algo más`} </Text>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.item}>
                            <TouchableOpacity
                                style={globalStyles.button}
                                onPress={() => handleOrder('confirm')}>
                                <Text style={[globalStyles.buttonText,{fontSize: FONT_SIZE}]}> {`Siguiente `} </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    {/* <View style={styles.containerButton}> */}
                    {(order.length >= maxItemsPerOrder) ?
                        Alert.alert(`Se ha llegado al número máximo de productos por pedido (${maxItemsPerOrder})`)
                        : null
                    }
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
        </View>
    );

};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'flex-start',
        flexDirection: 'column',
    },
    containerButton: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    containerPhoto: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingBottom: 10,
    },
    containerIconButton: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    textHeader: {
        // paddingTop: 10,
        paddingTop: 5,
        fontSize: FONT_SIZE + 8,
        fontWeight: 'bold',
        color: Cons.COLORS.DARK_GREY,
    },
    textSubHeader: {
        padding: 10,
        fontSize: FONT_SIZE,
        color: Cons.COLORS.DARK_GREY,
    },
    textPharmacy: {
        //padding: 5,
        paddingTop: 5,
        fontSize: FONT_SIZE -2,
        // color: Cons.COLORS.DARK_GREY,
    },
    photoOrder: {
        width: '100%',
        height: 100,
    },
    input: {
        margin: 10,
        height: 140,
        width: '90%',
        borderColor: Cons.COLORS.YELLOW,
        backgroundColor: Cons.COLORS.WHITE,
        borderWidth: 2,
        borderRadius: 10,
        fontSize: FONT_SIZE,
        marginBottom: 5,
    },
    item: {
        padding: 20
    },
    image: {
        margin: 10,
        height: 100,
        width: '40%',
        borderColor: Cons.COLORS.YELLOW,
        backgroundColor: Cons.COLORS.WHITE,
        borderWidth: 2,
        borderRadius: 10,
        fontSize: 15,
    },
    // Maybe not necessary with scrollview management
    extraPadding: {
        paddingBottom: 50,
        alignItems: 'center'
    },
    keyboard: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
    }
});

export default makeOrder;
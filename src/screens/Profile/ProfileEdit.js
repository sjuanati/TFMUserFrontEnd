import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    Modal,
    Alert,
    Picker,
    Platform,
    TextInput,
    StyleSheet,
    ScrollView,
    ActionSheetIOS,
    //ImageBackground,
    TouchableOpacity,
    KeyboardAvoidingView
} from 'react-native';

import axios from 'axios';
import moment from 'moment';
import { useSelector, useDispatch } from 'react-redux';
import DatePicker from '@react-native-community/datetimepicker';
import { httpUrl } from '../../../urlServer';
import Cons from '../../shared/Constants';
import ActivityIndicator from '../../UI/ActivityIndicator';
import { setData, setAddress } from '../../store/actions/user';
import { setIsModalProfileOpen } from '../../store/actions/modal';
//import ImagePicker from 'react-native-image-picker';
//import { setAvatar } from '../../store/actions/avatar';
//import DeletePhoto from '../../shared/DeletePhoto';

const profileEdit = (props) => {

    const dispatch = useDispatch();
    const user = useSelector(state => state.user);
    const avatar = useSelector(state => state.avatar);
    const modal = useSelector(state => state.modal);
    const [name, setName] = useState(user.name);
    const [gender, setGender] = useState(user.gender);
    let parsedBirthday: Date;
    if (user.birthday) {
        parsedBirthday = new Date(moment(user.birthday).format('YYYY-MM-DD'));
    } else {
        parsedBirthday = new Date(moment('1980-01-01').format('YYYY-MM-DD'))
        user.birthday = parsedBirthday;
    }
    const [birthday, setBirthday] = useState(parsedBirthday);
    const [phone, setPhone] = useState(user.phone);
    const [email, setEmail] = useState(user.email);
    const [street, setStreet] = useState(user.street);
    const [locality, setLocality] = useState(user.locality);
    const [zipcode, setZipcode] = useState(user.zip_code);
    const [country, setCountry] = useState(user.country);
    const [photo, setPhoto] = useState('');
    const [isPickerOpen, setIsPickerOpen] = useState(false);
    const [isLoading, setIsLoding] = useState(false);
    let gndProfile: any;
    const MALE = 'ios-male';
    const FEMALE = 'ios-female';
    const OTHERS = 'ios-transgender';
    if (user.gender === 'Female') {
        gndProfile = FEMALE;
    } else if (user.gender === 'Others') {
        gndProfile = OTHERS;
    } else {
        gndProfile = MALE;
    }
    const [genderIcon, setgenderIcon] = useState(gndProfile);

    useEffect(() => {
        setPhoto(avatar.photo);
    }, [avatar.photo]);

    const checkTextInput = async () => {
        return new Promise((resolve) => {

            // Check if email is filled in
            if (email && user.email) {

                const emailChecked = email.toLowerCase().trim();
                const emailPattern = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;

                // Check if email has been updated
                if (user.email !== emailChecked) {

                    // Check if email structure is correct
                    if (!emailPattern.test(emailChecked)) {
                        Alert.alert('Please insert a valid email');
                        resolve(false);
                    }

                    // Check if email already exists in DB
                    axios.get(`${httpUrl}/users/check/email`, {
                        params: { user_id: user.id, email: emailChecked },
                        headers: { authorization: user.token }
                    })
                        .then(response => {
                            if ((response.data.length > 0) && (response.data[0].count > 0)) {
                                Alert.alert('An account with this email already exists');
                                resolve(false);
                            } else {
                                resolve(true);
                            }
                        })
                        .catch(err => {
                            console.log('Error at ProfileEdit.js -> checkTextInput() :', err);
                            resolve(false);
                        })
                } else resolve(true);
            } else resolve(false);
        })
    }

    // Check if age is fulfilled and > 18 years old
    const checkAge = () => {
        if (!user.birthday) {
            Alert.alert('Please insert your birthday');
            return false;
        } else if (moment().diff(birthday, 'years') < 18) {
            Alert.alert('You must be over 18 years old');
            return false;
        }
        return true;
    }

    const toggleIsModalOpen = () => {
        const prev = modal.isModalProfileOpen;
        dispatch(setIsModalProfileOpen(!prev));
    }

    const showDatePicker = () => {
        setIsPickerOpen(true);
    }

    const datePickerHandler = (event, selectedDate) => {
        const currentDate = selectedDate || birthday;
        if (Platform.OS === 'android') setIsPickerOpen(false);
        setBirthday(currentDate);
    }

    // Close Modal and undo field updates
    const closeProfile = () => {
        setIsPickerOpen(false);
        toggleIsModalOpen();
        setName(user.name);
        setGender(user.gender);
        setBirthday(parsedBirthday);
        setPhone(user.phone);
        setEmail(user.email);
        setStreet(user.street);
        setLocality(user.locality);
        setZipcode(user.zip_code);
        setCountry(user.country);
        setPhoto(avatar.photo);
        //TODO: Remove files if App closes, but not during the execution. Otherwise, the photo can't be loaded
        // Alt: Load photo in binary into avatar.photo, and delete the file right afterwards.
        //removePhotoFromFile();
    }

    const saveProfile = async () => {
        if (await checkTextInput() && checkAge()) {
            setIsLoding(true);

            // Update User in Redux
            dispatch(setData(
                user.id,
                user.token,
                birthday,
                email.toLowerCase().trim(),
                gender,
                name,
                phone,
                user.eth_address,
            ));
            dispatch(setAddress(
                user.id,
                1,
                street,
                locality,
                '', //province, 
                zipcode,
                country
            ))

            // Update User's profile, address and photo. In case of error, show message and do not close Modal
            if ((await saveProfileToDB()) && (await saveAddressToDB()) /*&& (await savePhotoToS3([{ photo_url: photo }])) */) {
                toggleIsModalOpen();
                //TODO: Remove files if App closes, but not during the execution. Otherwise, the photo can't be loaded
                // Alt: Load photo in binary into avatar.photo, and delete the file right afterwards.
                //removePhotoFromFile();
            } else {
                Alert.alert('Error al guardar el perfil');
            }
            setIsLoding(false);
        }
    }

    // Save User's profile (name, gender, email) to DB
    const saveProfileToDB = async () => {
        return new Promise((resolve) => {

            if (user.id) {
                axios.post(`${httpUrl}/users/profile/set`, {
                    user: {
                        id: user.id,
                        name: name,
                        gender: gender,
                        email: email.toLowerCase().trim(),
                        birthday: birthday,
                        phone: phone,
                        photo: (photo) ? `${user.id}.jpg` : null
                    }
                }, {
                    headers: {
                        authorization: user.token,
                        user_id: user.id
                    }
                })
                    .then((response) => {
                        if (response.status === 202) {
                            Alert.alert('Error when saving profile');
                            resolve(false);
                        } else {
                            resolve(true);
                        }

                    })
                    .catch(error => {
                        Alert.alert('Error when saving profile');
                        console.log('Error at ProfileEdit.js -> saveProfileToDB() :', error);
                        resolve(false);
                    })
            } else {
                console.log('Warning on ProfileEdit.js -> saveProfileToDB(): No User to save Profile');
                resolve(false);
            }
        })
    }

    // Save User's address (street, locality, zipcode, country) to DB
    const saveAddressToDB = async () => {
        return new Promise((resolve) => {

            if (user.id) {
                axios.post(`${httpUrl}/users/address/set`, {
                    address: {
                        id: user.id,
                        street: street,
                        locality: locality,
                        zipcode: zipcode,
                        country: country
                    }
                }, {
                    headers: {
                        authorization: user.token,
                        user_id: user.id
                    }
                })
                    .then((response) => {
                        if (response.status === 202) {
                            Alert.alert('Error when saving address');
                            resolve(false);
                        } else {
                            resolve(true);
                        }
                    })
                    .catch(err => {
                        Alert.alert('Error when saving address');
                        console.log('Error at ProfileEdit.js -> saveAddressToDB() :', err);
                        resolve(false);
                    })
            } else {
                console.log('Warning on ProfileEdit.js -> saveAddressToDB(): No User to save Address');
                resolve(false);
            }
        })
    }

    // TODO: Component to save photo/s to S3
    // const savePhotoToS3 = async (photos) => {
    //     return new Promise((resolve) => {

    //         if (photos.length > 0 && photo !== avatar.photo) {
    //             dispatch(setAvatar(photo));

    //             // Add photo to FormData() structure
    //             let targetPhoto = new FormData();
    //             let URI = photos[0].photo_url;
    //             const photoName = `${user.id}.jpg`;
    //             targetPhoto.append('image', {
    //                 uri: (Platform.OS === "ios") ? URI : `file://${URI}`,
    //                 name: photoName,
    //                 type: `image/jpg`
    //             });

    //             // Save photo into Server folder '/upload'
    //             axios.post(`${httpUrl}/chat/uploadPhoto`,
    //                 targetPhoto, {
    //                 headers: { authorization: user.token }
    //             }).then(async res => {
    //                 if (res.status === 200) {
    //                     // Transfer photo from Server to S3 and delete from '/upload'
    //                     axios.post(`${httpUrl}/users/profile/toS3`,
    //                         {
    //                             pics: [targetPhoto],
    //                             type: 'users',
    //                         },
    //                         {
    //                             headers: { authorization: user.token }
    //                         }).then(async res => {
    //                             if (res.status === 200) console.log(`Photo from user ${user.id} transferred to S3`)
    //                             resolve(true);
    //                         }).catch(err => {
    //                             console.log('Error in ProfileEdit.js -> savePhotoToS3() -> sendToS3: ', err);
    //                             logger('ERR', 'FRONT-USER', `ProfileEdit.js -> savePhotoToS3() -> sendToS3: ${err}`, user, `photo: ${photoName}`);
    //                             resolve(false);
    //                         })
    //                 }
    //             }).catch(err => {
    //                 console.log('Error in ProfileEdit.js -> savePhotoToS3() -> uploadPhoto: ', err);
    //                 logger('ERR', 'FRONT-USER', `ProfileEdit.js -> savePhotoToS3() -> uploadPhoto: ${err}`, user, `photo: ${photoName}`);
    //                 resolve(false);
    //                 // TODO: if path is not reachable, server fails and exception is not captured.
    //             })
    //         } else {
    //             console.log('no change');
    //             dispatch(setAvatar(avatar.photo)); // needed?
    //             resolve(true);
    //         }
    //     })
    // };

    const handleGenderIOS = () =>
        ActionSheetIOS.showActionSheetWithOptions(
            {
                options: ["Cancel", "Male", "Female", "Others"],
                cancelButtonIndex: 0
            },
            buttonIndex => {
                if (buttonIndex === 1) {
                    setGender('Male');
                    setgenderIcon(MALE);
                } else if (buttonIndex === 2) {
                    setGender('Female');
                    setgenderIcon(FEMALE);
                } else if (buttonIndex === 3) {
                    setGender('Others');
                    setgenderIcon(OTHERS);
                }
            }
        );

    const handleGenderAndroid = (value) => {
        setGender(value);
        if (value === 'Male') {
            setgenderIcon(MALE);
        } else if (value === 'Female') {
            setgenderIcon(FEMALE);
        } else if (value === 'Others') {
            setgenderIcon(OTHERS);
        }
    }

    // const changePhoto = () => {

    //     // Set quality depending on device (iOS, Android)
    //     let setting: object;
    //     Platform.OS === 'ios' ?
    //         setting = {
    //             quality: 0,
    //             noData: true,
    //             // maxWidth: 1000,
    //             // maxHeight: 1000,
    //             allowsEditing: true,
    //             storageOptions: {
    //                 skipBackup: true,
    //             }
    //         }
    //         :
    //         setting = {
    //             quality: 0.2,
    //             noData: true,
    //             storageOptions: {
    //                 skipBackup: true,
    //             }
    //         }

    //     // Take photo from Camera or choose photo from Library
    //     ImagePicker.showImagePicker(
    //         setting,
    //         response => {
    //             if (response.error) {
    //                 Alert.alert("Cámara no disponible")
    //             } else if (!response.didCancel) {
    //                 console.log('Added photo to device storage : ', response.uri);
    //                 //TODO: Remove files if App closes, but not during the execution. Otherwise, the photo can't be loaded
    //                 // Alt: Load photo in binary into avatar.photo, and delete the file right afterwards.
    //                 //removePhotoFromFile();
    //                 setPhoto(response.uri);
    //             }
    //         }
    //     )
    // }

    // If user repeats a photo, delete the previous one from device storage
    // const removePhotoFromFile = () => {
    //     if (photo) {
    //         const uri = [{ itemPhoto: photo }];
    //         DeletePhoto(uri, user);
    //     }
    // };

    return (

        <Modal visible={modal.isModalProfileOpen} animationType='slide'>
            <KeyboardAvoidingView
                style={styles.keyboard}
                behavior={Platform.OS == "ios" ? "padding" : "height"}
                enabled
                keyboardVerticalOffset={10}
            >
                <ScrollView>
                    <View style={styles.containerModal}>
                        <View style={styles.containerHeaderButtons}>
                            <TouchableOpacity
                                style={styles.button}
                                onPress={closeProfile}>
                                <Text style={styles.buttonText}> Close </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.button}
                                onPress={saveProfile}>
                                <Text style={[styles.buttonText, styles.textBold]}> Save </Text>
                            </TouchableOpacity>
                        </View>
                        <View>
                            <ActivityIndicator isLoading={isLoading} />
                        </View>

                        {/* <View style={styles.containerHeader}>
                            <View style={styles.profileImage}>
                                <ImageBackground
                                    source={photo ? { uri: photo } : null}
                                    style={styles.image}>
                                </ImageBackground>
                            </View>
                            <TouchableOpacity
                                style={styles.button}
                                onPress={changePhoto}>
                                <Text style={styles.buttonText}> Cambiar foto </Text>
                            </TouchableOpacity>
                        </View> */}


                        <View style={styles.container}>
                            <View style={styles.inputContainer}>
                                <Text style={styles.text}>Nombre y apellidos </Text>
                                <TextInput
                                    style={(Platform.OS === 'ios') ? styles.inputTextIOS : styles.inputTextAndroid}
                                    maxLength={254}
                                    onChangeText={value => setName(value)}
                                    value={name}
                                />
                            </View>
                            <View style={styles.inputContainer}>
                                <Text style={styles.text}>Género </Text>
                                {(Platform.OS === 'android') ?
                                    <Picker
                                        selectedValue={gender}
                                        onValueChange={value => handleGenderAndroid(value)}
                                    >
                                        <Picker.Item label="Male" value="Male" />
                                        <Picker.Item label="Female" value="Female" />
                                        <Picker.Item label="Others" value="Others" />
                                    </Picker>
                                    :
                                    <TextInput
                                        style={styles.inputTextIOS}
                                        placeholder={'Choose'}
                                        onTouchStart={() => { handleGenderIOS() }}
                                        value={gender}
                                    />
                                }
                            </View>
                            <View style={styles.inputContainer}>
                                <Text style={styles.text}>Fecha de nacimiento </Text>
                                <TouchableOpacity onPress={() => showDatePicker()}>
                                    <TextInput
                                        style={(Platform.OS === 'ios') ? styles.inputTextIOS : styles.inputTextAndroid}
                                        editable={false}
                                        pointerEvents='none'
                                        onTouchStart={() => { showDatePicker() }}
                                        value={moment(birthday).format('DD-MM-YYYY')}
                                    />
                                </TouchableOpacity>
                                {(isPickerOpen) ?
                                    <View>
                                        <DatePicker
                                            minimumDate={new Date(1901, 0, 1)}
                                            maximumDate={new Date()}
                                            value={birthday}
                                            mode='date'
                                            display='default'
                                            onChange={datePickerHandler}
                                        />
                                    </View>
                                    : null
                                }
                            </View>
                            <View style={styles.inputContainer}>
                                <Text style={styles.text}>Teléfono móvil </Text>
                                <TextInput
                                    style={(Platform.OS === 'ios') ? styles.inputTextIOS : styles.inputTextAndroid}
                                    maxLength={20}
                                    onChangeText={(value) => { setPhone(value) }}
                                    value={phone}
                                />
                            </View>
                            <View style={styles.inputContainer}>
                                <Text style={styles.text}>Correo electrónico </Text>
                                <TextInput
                                    style={(Platform.OS === 'ios') ? styles.inputTextIOS : styles.inputTextAndroid}
                                    maxLength={254}
                                    autoCapitalize='none'
                                    keyboardType='email-address'
                                    onChangeText={(value) => { setEmail(value) }}
                                    value={email}
                                />
                            </View>
                            <View style={styles.containerAddress}>
                                <Text style={styles.text}>Domicilio </Text>
                                <View style={styles.inputContainerAddress}>
                                    <Text style={[styles.text, styles.textAddress]}>Calle </Text>
                                    <TextInput
                                        style={(Platform.OS === 'ios') ? styles.inputTextIOS : styles.inputTextAndroid}
                                        maxLength={99}
                                        onChangeText={(value) => { setStreet(value) }}
                                        value={street}
                                    />
                                </View>
                                <View style={styles.inputContainerAddress}>
                                    <Text style={[styles.text, styles.textAddress]}>Ciudad </Text>
                                    <TextInput
                                        style={(Platform.OS === 'ios') ? styles.inputTextIOS : styles.inputTextAndroid}
                                        maxLength={99}
                                        onChangeText={(value) => { setLocality(value) }}
                                        value={locality}
                                    />
                                </View>
                                <View style={styles.inputContainerAddress}>
                                    <Text style={[styles.text, styles.textAddress]}>Código postal </Text>
                                    <TextInput
                                        style={(Platform.OS === 'ios') ? styles.inputTextIOS : styles.inputTextAndroid}
                                        maxLength={9}
                                        onChangeText={(value) => { setZipcode(value) }}
                                        value={zipcode}
                                    />
                                </View>
                                <View style={styles.inputContainerAddress}>
                                    <Text style={[styles.text, styles.textAddress]}>País </Text>
                                    <TextInput
                                        style={(Platform.OS === 'ios') ? styles.inputTextIOS : styles.inputTextAndroid}
                                        maxLength={49}
                                        onChangeText={(value) => { setCountry(value) }}
                                        value={country}
                                    />
                                </View>
                            </View>
                        </View>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </Modal>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
    },
    containerHeader: {
        alignItems: 'center',
    },
    containerHeaderButtons: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginLeft: 20,
        marginRight: 20,
    },
    containerModal: {
        flex: 1,
        marginTop: 60,
        borderRadius: 5,
        paddingBottom: 100,
    },
    containerAddress: {
        marginTop: 25,
        marginLeft: 15,
    },
    inputContainer: {
        marginTop: 30,
        marginLeft: 15,
        marginRight: 15,
        borderBottomWidth: 0.3,
        borderColor: 'orange'
    },
    inputContainerAddress: {
        marginLeft: 15,
        marginRight: 15,
        borderBottomWidth: 0.3,
        borderColor: 'orange'
    },
    inputTextAndroid: {
        fontSize: 18,
        marginBottom: -10,
    },
    inputTextIOS: {
        marginTop: 15,
        marginBottom: 5,
        fontSize: 18,
    },
    text: {
        fontFamily: 'HelveticaNeue',
        color: '#525775',
        fontSize: 16,
    },
    textBold: {
        fontWeight: 'bold'
    },
    textAddress: {
        marginTop: 10,
    },
    profileImage: {
        width: 150,
        height: 150,
        borderRadius: 150 / 2,
        borderColor: Cons.COLORS.DARK_GREY,
        borderWidth: 0.5,
        overflow: 'hidden',
        marginBottom: 20,
    },
    image: {
        flex: 1,
        width: undefined,
        height: undefined,
    },
    button: {
        marginTop: 10,
        marginBottom: 30,
        alignItems: 'center',
    },
    icon: {
        marginLeft: 15,
        marginRight: 10,
        color: 'grey',
    },
    iconGender: {
        marginLeft: 5,
        color: 'grey',
    },
    buttonText: {
        fontSize: 17,
        color: Cons.COLORS.BLUE,
    },
    keyboard: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
    },
    ender: {
        paddingBottom: 10,
        marginBottom: 30,
        borderBottomWidth: 0.3,
        borderColor: 'orange',
    }
});

export default profileEdit;
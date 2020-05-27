import React, { useState } from 'react';
import {
    View,
    Text,
    Modal,
    Alert,
    Picker,
    Linking,
    Platform,
    TextInput,
    StyleSheet,
    ScrollView,
    ActionSheetIOS,
    ImageBackground,
    TouchableOpacity,
    KeyboardAvoidingView
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import moment from 'moment';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
//import { Picker } from '@react-native-community/picker';
import DatePicker from '@react-native-community/datetimepicker';

import { httpUrl } from '../../../urlServer';
import globalStyles from '../../UI/Style';
import logger from '../../shared/logRecorder';
//import showToast from '../../shared/Toast';
import Cons from '../../shared/Constants';
import ActivityIndicator from '../../UI/ActivityIndicator';
import { setData, setAddress } from '../../store/actions/user';

const imageMan = require('../../assets/images/profile/face-shadow-drawing.jpg');
const imageWoman = require('../../assets/images/profile/face-shadow-woman.jpg');
const imageManWoman = require('../../assets/images/profile/face-shadow-man-woman.jpg');

const profile = (props) => {

    const dispatch = useDispatch();
    const user = useSelector(state => state.user);
    const [name, setName] = useState(user.name);
    const [gender, setGender] = useState(user.gender);
    let parsedBirthday: Date;
    if (user.birthday) {
        parsedBirthday = new Date(moment(user.birthday).format('YYYY-MM-DD'));
    } else {
        parsedBirthday = new Date(moment('1980-01-01').format('YYYY-MM-DD'))
    }
    const [birthday, setBirthday] = useState(parsedBirthday);
    const [phone, setPhone] = useState(user.phone);
    const [email, setEmail] = useState(user.email);
    const [street, setStreet] = useState(user.street);
    const [locality, setLocality] = useState(user.locality);
    const [zipcode, setZipcode] = useState(user.zip_code);
    const [country, setCountry] = useState(user.country);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isPickerOpen, setIsPickerOpen] = useState(false);
    const [isLoading, setIsLoding] = useState(false);
    let imgProfile: any;
    let gndProfile: any;
    const MALE = 'ios-male';
    const FEMALE = 'ios-female';
    const OTHERS = 'ios-transgender';
    if (user.gender === 'Femenino') {
        imgProfile = imageWoman;
        gndProfile = FEMALE;
    } else if (user.gender === 'Otros') {
        imgProfile = imageManWoman;
        gndProfile = OTHERS;
    } else {
        imgProfile = imageMan;
        gndProfile = MALE;
    }
    const [imageProfile, setimageProfile] = useState(imgProfile);
    const [genderIcon, setgenderIcon] = useState(gndProfile);


    const logOut = () => {
        Alert.alert(
            '¿Seguro que quieres salir?',
            'Volverás a la pantalla de inicio',
            [
                { text: 'Cancel', onPress: () => { }, style: 'cancel' },
                {
                    text: 'OK', onPress: async () => {
                        props.navigation.navigate('Auth');
                    }
                },
            ],
            { cancelable: false }
        )
    };

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
                        Alert.alert('Por favor, introduzca un correo electrónico válido');
                        resolve(false);
                    }

                    // Check if email already exists in DB
                    axios.get(`${httpUrl}/users/check/email`, {
                        params: { user_id: user.id, email: emailChecked },
                        headers: { authorization: user.token }
                    })
                        .then(response => {
                            if ((response.data.length > 0) && (response.data[0].count > 0)) {
                                Alert.alert('Ya existe una cuenta con ese correo electrónico');
                                resolve(false);
                            } else {
                                resolve(true);
                            }
                        })
                        .catch(err => {
                            console.log('Error at Profile.js -> checkTextInput() :', err);
                            resolve(false);
                        })
                } else resolve(true);
            } else resolve(false);
        })
    }

    const toggleIsModalOpen = () => {
        const prev = isModalOpen;
        setIsModalOpen(!prev);
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
    }

    const saveProfile = async () => {
        if (await checkTextInput()) {
            setIsLoding(true);

            // Update User in Redux
            dispatch(setData(
                user.id,
                user.token,
                birthday,
                email,
                gender,
                name,
                phone,
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

            // TODO: save photo to S3
            // Update User's profile and address. In case of error, show message and do not close Modal
            if ((await saveProfileToDB()) && (await saveAddressToDB())) {
                toggleIsModalOpen();
            }
            setIsLoding(false);
        } else {
            Alert.alert('No se puede comprobar el correo electrónico');
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
                        email: email,
                        birthday: birthday,
                        phone: phone,
                    }
                }, {
                    headers: {
                        authorization: user.token,
                        user_id: user.id
                    }
                })
                    .then((response) => {
                        if (response.status === 202) {
                            Alert.alert('Error al guardar perfil');
                            resolve(false);
                        } else {
                            resolve(true);
                        }

                    })
                    .catch(error => {
                        Alert.alert('Error al guardar perfil');
                        logger('ERR', 'FRONT-USER', `Profile.js -> saveProfileToDB(): ${error}`, user, '');
                        console.log('Error at Profile.js -> saveProfileToDB() :', error);
                        resolve(false);
                    })
            } else {
                logger('WRN', 'FRONT-USER', `Profile.js -> saveProfileToDB(): `, user, 'No User to save Profile');
                console.log('Warning on Profile.js -> saveProfileToDB(): No User to save Profile');
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
                            Alert.alert('Error al guardar domicilio');
                            resolve(false);
                        } else {
                            resolve(true);
                        }
                    })
                    .catch(err => {
                        Alert.alert('Error al guardar dirección');
                        logger('ERR', 'FRONT-USER', `Profile.js -> saveAddressToDB(): ${err}`, user, '');
                        console.log('Error at Profile.js -> saveAddressToDB() :', err);
                        resolve(false);
                    })
            } else {
                logger('WRN', 'FRONT-USER', `Profile.js -> saveAddressToDB(): `, user, 'No User to save Address');
                console.log('Warning on Profile.js -> saveAddressToDB(): No User to save Address');
                resolve(false);
            }
        })
    }

    // Send an email to DrMAX
    const handleEmail = () => {
        let sendEmail: String;
        (Platform.OS === 'ios')
            ? sendEmail = `mailto:support@doctormax.es&subject=Consulta de ${user.name} [${user.id}]`
            : sendEmail = `mailto:support@doctormax.es?subject=Consulta de ${user.name} [${user.id}]`
        Linking.canOpenURL(sendEmail)
            .then((supported) => {
                if (supported) {
                    Linking.openURL(sendEmail);
                } else {
                    Alert.alert(`No se puede abrir el correo`);
                }
            })
            .catch(err => {
                Alert.alert('Ha habido un error con el correo electrónico');
                logger('ERR', 'FRONT-USER', `Profile.js -> handleEmail(): ${err}`, user, `email: ${sendEmail}`);
                console.log('Error on Profile.js -> handleEmail(): ', err);
            })
    };

    // Opens a URL in the browser
    const handleURL = () => {
        const url = 'https://www.doctormax.es/privacidad-y-condiciones-de-uso/'
        Linking.canOpenURL(url)
            .then((supported) => {
                if (supported) {
                    Linking.openURL(url);
                } else {
                    Alert.alert(`No se puede abrir el navegador`);
                }
            })
            .catch(err => {
                Alert.alert('Ha habido un error con el navegador');
                logger('ERR', 'FRONT-USER', `Profile.js -> handleURL(): ${err}`, user, `email:  ${url}`);
                console.log('Error on Pharmacy.js -> handleURL(): ', err);
            })
    };

    const handleGenderIOS = () =>
        ActionSheetIOS.showActionSheetWithOptions(
            {
                options: ["Cancel", "Masculino", "Femenino", "Otros"],
                cancelButtonIndex: 0
            },
            buttonIndex => {
                if (buttonIndex === 1) {
                    setGender('Masculino');
                    setimageProfile(imageMan);
                    setgenderIcon(MALE);
                } else if (buttonIndex === 2) {
                    setGender('Femenino');
                    setimageProfile(imageWoman);
                    setgenderIcon(FEMALE);
                } else if (buttonIndex === 3) {
                    setGender('Otros');
                    setimageProfile(imageManWoman);
                    setgenderIcon(OTHERS);
                }
            }
        );

    const handleGenderAndroid = (value) => {
        setGender(value);
        if (value === 'Masculino') {
            setimageProfile(imageMan);
            setgenderIcon(MALE);
        } else if (value === 'Femenino') {
            setimageProfile(imageWoman);
            setgenderIcon(FEMALE);
        } else if (value === 'Otros') {
            setimageProfile(imageManWoman);
            setgenderIcon(OTHERS);
        }
    }

    const renderEditProfile = () => (

        <Modal visible={isModalOpen} animationType='slide'>
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
                                <Text style={styles.buttonText}> Cerrar </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.button}
                                onPress={saveProfile}>
                                <Text style={[styles.buttonText, styles.textBold]}> Guardar </Text>
                            </TouchableOpacity>
                        </View>
                        <View>
                            <ActivityIndicator isLoading={isLoading} />
                        </View>
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
                                        <Picker.Item label="Masculino" value="Masculino" />
                                        <Picker.Item label="Femenino" value="Femenino" />
                                        <Picker.Item label="Otros" value="Otros" />
                                    </Picker>
                                    :
                                    <TextInput
                                        style={styles.inputTextIOS}
                                        placeholder={'Selecciona'}
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

    const renderShowProfile = () => (
        <View>
            <TouchableOpacity
                style={styles.buttonEdit}
                onPress={toggleIsModalOpen}>
                <Text style={styles.buttonText}> Editar </Text>
            </TouchableOpacity>
            <View style={styles.containerHeader}>
                <View style={styles.profileImage}>
                    <ImageBackground
                        source={imageProfile}
                        style={styles.image}
                        resizeMode='center'>
                    </ImageBackground>
                </View>
                <Text style={[styles.text, styles.textHeader]}> {user.name} </Text>
                {(user.birthday) ?
                    <View style={styles.containerSubHeader}>
                        <Text style={styles.text}> {moment(user.birthday).format('DD-MM-YYYY')}  | </Text>
                        <Text style={styles.text}> {moment(user.birthday).fromNow().replace(/\D/g, '')} años | </Text>
                        <Ionicons
                            name={genderIcon}
                            size={20}
                            style={(genderIcon === 'ios-female')
                                ? styles.iconGenderRotate
                                : styles.iconGender}
                        />
                    </View>
                    :
                    null
                }
            </View>
            <View style={[styles.containerItems, { marginLeft: 6 }]}>
                <Ionicons name="ios-phone-portrait" size={30} style={styles.icon} />
                <Text style={styles.text}>{user.phone}</Text>
            </View>

            <View style={styles.containerItems}>
                <Ionicons name="ios-at" size={30} style={styles.icon} />
                <Text style={styles.text}>{user.email}</Text>
            </View>
            <View style={styles.containerItems}>
                <Ionicons name="md-home" size={30} style={styles.icon} />
                {(user.street) ?
                    <View style={styles.container}>
                        <Text style={styles.text}>{user.street}, {user.locality} {} </Text>
                        <Text style={styles.text}>{user.zip_code} {user.country}  </Text>
                    </View>
                    :
                    <Text style={styles.text}> Domicilio incompleto </Text>
                }
            </View>
        </View>
    )

    const renderContactUs = () => (
        <View>
            <View style={[styles.containerContact, { marginTop: 20 }]}>
                <Text style={[styles.text, styles.margins]}> Si tienes cualquier duda, por favor, contacta con nosotros ;) </Text>
            </View>
            <View style={styles.button}>
                <TouchableOpacity
                    onPress={handleEmail}
                    style={[globalStyles.button, styles.buttonExit]}>
                    <View style={styles.containerIconButton}>
                        <MaterialCommunityIcons name="email-outline" size={25} color={'black'} />
                        <Text style={globalStyles.buttonText}> Contactar </Text>
                    </View>
                </TouchableOpacity>
            </View>
            <TouchableOpacity onPress={handleURL}>
                <Text style={[styles.buttonText, styles.containerContact]}> Política de Privacidad </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={logOut}>
                <Text style={[styles.buttonText, styles.containerContact, styles.ender]}> Salir </Text>
            </TouchableOpacity>
        </View>
    );

    return (
        <ScrollView style={styles.container}>
            {renderEditProfile()}
            {renderShowProfile()}
            {renderContactUs()}
        </ScrollView>
    )
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
    },
    containerHeader: {
        alignItems: 'center',
    },
    containerSubHeader: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    containerHeaderButtons: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginLeft: 20,
        marginRight: 20,
    },
    containerItems: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: 10,
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
    containerIconButton: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
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
    containerContact: {
        padding: 10,
        borderTopWidth: 0.3,
        borderColor: 'orange'
    },
    margins: {
        marginLeft: 25,
        marginRight: 25,
        marginTop: 10,
        textAlign: 'center'
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
    textHeader: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 15,
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
    image: {
        flex: 1,
        width: undefined,
        height: undefined,
    },
    titleBar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 24,
        marginHorizontal: 16
    },
    profileImage: {
        width: 150,
        height: 150,
        borderRadius: 150 / 2,
        overflow: 'hidden',
        marginBottom: 20,
    },
    button: {
        marginTop: 10,
        marginBottom: 30,
        alignItems: 'center',
    },
    buttonEdit: {
        margin: 10,
        alignItems: 'flex-end',
    },
    buttonExit: {
        width: 150,
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
    iconGenderRotate: {
        marginLeft: 5,
        color: 'grey',
        transform: [{ rotate: '-45deg' }]
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
export default profile;
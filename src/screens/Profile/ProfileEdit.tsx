import React, { useState } from 'react';
import {
    View,
    Text,
    Modal,
    Alert,
    Platform,
    TextInput,
    StyleSheet,
    ScrollView,
    ActionSheetIOS,
    TouchableOpacity,
    KeyboardAvoidingView,
} from 'react-native';
import axios from 'axios';
import moment from 'moment';
import { useDispatch } from 'react-redux';
import {Picker} from '@react-native-community/picker';
import { useTypedSelector } from '../../store/reducers/reducer';
import DatePicker from '@react-native-community/datetimepicker';
import { httpUrl } from '../../../urlServer';
import Cons from '../../shared/Constants';
import ActivityIndicator from '../../UI/ActivityIndicator';
import { setData, setAddress } from '../../store/actions/user';
import { setIsModalProfileOpen } from '../../store/actions/modal';

const ProfileEdit = () => {

    const dispatch = useDispatch();
    const user = useTypedSelector(state => state.user);
    const modal = useTypedSelector(state => state.modal);
    const [name, setName] = useState<string>(user.name);
    const [gender, setGender] = useState<string>(user.gender);
    let parsedBirthday: Date;
    if (user.birthday) {
        parsedBirthday = new Date(moment(user.birthday).format('YYYY-MM-DD'));
    } else {
        parsedBirthday = new Date(moment('1980-01-01').format('YYYY-MM-DD'));
        user.birthday = parsedBirthday;
    }
    const [birthday, setBirthday] = useState<Date>(parsedBirthday);
    const [phone, setPhone] = useState<string>(user.phone);
    const [email, setEmail] = useState<string>(user.email);
    const [street, setStreet] = useState<string>(user.street);
    const [locality, setLocality] = useState<string>(user.locality);
    const [zipcode, setZipcode] = useState<string>(user.zip_code);
    const [country, setCountry] = useState<string>(user.country);
    const [isPickerOpen, setIsPickerOpen] = useState<boolean>(false);
    const [isLoading, setIsLoding] = useState<boolean>(false);

    const checkTextInput = async () => {
        return new Promise<boolean>((resolve) => {

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
                        headers: { authorization: user.token },
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
                            console.log('Error in ProfileEdit.tsx -> checkTextInput() :', err);
                            resolve(false);
                        });
                } else { resolve(true); }
            } else { resolve(false); }
        });
    };

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
    };

    const toggleIsModalOpen = () => {
        const prev = modal.isModalProfileOpen;
        dispatch(setIsModalProfileOpen(!prev));
    };

    const showDatePicker = () => {
        setIsPickerOpen(true);
    };

    const datePickerHandler = (event: any, selectedDate: Date) => {
        const currentDate = selectedDate || birthday;
        if (Platform.OS === 'android') { setIsPickerOpen(false); }
        setBirthday(currentDate);
    };

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
    };

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
                user.user_status,
                user.eth_address,
            ));
            dispatch(setAddress(
                user.id,
                1,
                street,
                locality,
                '',
                zipcode,
                country
            ));

            // Update User's profile and address. In case of error, show message and do not close Modal
            if ((await saveProfileToDB()) && (await saveAddressToDB())) {
                toggleIsModalOpen();
            } else {
                Alert.alert('Error al guardar el perfil');
            }
            setIsLoding(false);
        }
    };

    // Save User's profile (name, gender, email) to DB
    const saveProfileToDB = async () => {
        return new Promise<boolean>((resolve) => {

            if (user.id) {
                axios.post(`${httpUrl}/users/profile/set`, {
                    user: {
                        id: user.id,
                        name: name,
                        gender: gender,
                        email: email.toLowerCase().trim(),
                        birthday: birthday,
                        phone: phone,
                        photo: null,
                    },
                }, {
                    headers: {
                        authorization: user.token,
                        user_id: user.id,
                    },
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
                        console.log('Error in ProfileEdit.tsx -> saveProfileToDB() :', error);
                        resolve(false);
                    });
            } else {
                console.log('Warning in ProfileEdit.tsx -> saveProfileToDB(): No User to save Profile');
                resolve(false);
            }
        });
    };

    // Save User's address (street, locality, zipcode, country) to DB
    const saveAddressToDB = async () => {
        return new Promise<boolean>((resolve) => {

            if (user.id) {
                axios.post(`${httpUrl}/users/address/set`, {
                    address: {
                        id: user.id,
                        street: street,
                        locality: locality,
                        zipcode: zipcode,
                        country: country,
                    },
                }, {
                    headers: {
                        authorization: user.token,
                        user_id: user.id,
                    },
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
                        console.log('Error in ProfileEdit.tsx -> saveAddressToDB() :', err);
                        resolve(false);
                    });
            } else {
                console.log('Warning in ProfileEdit.tsx -> saveAddressToDB(): No User to save Address');
                resolve(false);
            }
        });
    };

    const handleGenderIOS = () =>
        ActionSheetIOS.showActionSheetWithOptions(
            {
                options: ['Cancel', 'Male', 'Female', 'Others'],
                cancelButtonIndex: 0,
            },
            buttonIndex => {
                if (buttonIndex === 1) {
                    setGender('Male');
                } else if (buttonIndex === 2) {
                    setGender('Female');
                } else if (buttonIndex === 3) {
                    setGender('Others');
                }
            }
        );

    const handleGenderAndroid = (value: string) => setGender(value);

    return (
        <Modal visible={modal.isModalProfileOpen} animationType="slide">
            <KeyboardAvoidingView
                style={styles.keyboard}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                enabled
                keyboardVerticalOffset={10}>
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
                        <View style={styles.container}>
                            <View style={styles.inputContainer}>
                                <Text style={styles.text}>Nombre y apellidos </Text>
                                <TextInput
                                    style={(Platform.OS === 'ios') ? styles.inputTextIOS : styles.inputTextAndroid}
                                    maxLength={254}
                                    onChangeText={value => setName(value)}
                                    value={name} />
                            </View>
                            <View style={styles.inputContainer}>
                                <Text style={styles.text}>Género </Text>
                                {(Platform.OS === 'android') ?
                                    <Picker
                                        selectedValue={gender}
                                        onValueChange={value => handleGenderAndroid(value)}>
                                        <Picker.Item label="Male" value="Male" />
                                        <Picker.Item label="Female" value="Female" />
                                        <Picker.Item label="Others" value="Others" />
                                    </Picker>
                                    :
                                    <TextInput
                                        style={styles.inputTextIOS}
                                        placeholder={'Choose'}
                                        onTouchStart={() => { handleGenderIOS(); }}
                                        value={gender} />
                                }
                            </View>
                            <View style={styles.inputContainer}>
                                <Text style={styles.text}>Fecha de nacimiento </Text>
                                <TouchableOpacity onPress={() => showDatePicker()}>
                                    <TextInput
                                        style={(Platform.OS === 'ios') ? styles.inputTextIOS : styles.inputTextAndroid}
                                        editable={false}
                                        pointerEvents="none"
                                        onTouchStart={() => { showDatePicker(); }}
                                        value={moment(birthday).format('DD-MM-YYYY')} />
                                </TouchableOpacity>
                                {(isPickerOpen) ?
                                    <View>
                                        <DatePicker
                                            minimumDate={new Date(1901, 0, 1)}
                                            maximumDate={new Date()}
                                            value={birthday}
                                            mode="date"
                                            display="default"
                                            onChange={datePickerHandler} />
                                    </View>
                                    : null
                                }
                            </View>
                            <View style={styles.inputContainer}>
                                <Text style={styles.text}>Mobile phone </Text>
                                <TextInput
                                    style={(Platform.OS === 'ios') ? styles.inputTextIOS : styles.inputTextAndroid}
                                    maxLength={20}
                                    onChangeText={(value) => { setPhone(value); }}
                                    value={phone} />
                            </View>
                            <View style={styles.inputContainer}>
                                <Text style={styles.text}>Email </Text>
                                <TextInput
                                    style={(Platform.OS === 'ios') ? styles.inputTextIOS : styles.inputTextAndroid}
                                    maxLength={254}
                                    autoCapitalize="none"
                                    keyboardType="email-address"
                                    onChangeText={(value) => { setEmail(value); }}
                                    value={email} />
                            </View>
                            <View style={styles.containerAddress}>
                                <Text style={styles.text}>Domicilio </Text>
                                <View style={styles.inputContainerAddress}>
                                    <Text style={[styles.text, styles.textAddress]}>Street </Text>
                                    <TextInput
                                        style={(Platform.OS === 'ios') ? styles.inputTextIOS : styles.inputTextAndroid}
                                        maxLength={99}
                                        onChangeText={(value) => { setStreet(value); }}
                                        value={street} />
                                </View>
                                <View style={styles.inputContainerAddress}>
                                    <Text style={[styles.text, styles.textAddress]}>Location </Text>
                                    <TextInput
                                        style={(Platform.OS === 'ios') ? styles.inputTextIOS : styles.inputTextAndroid}
                                        maxLength={99}
                                        onChangeText={(value) => { setLocality(value); }}
                                        value={locality} />
                                </View>
                                <View style={styles.inputContainerAddress}>
                                    <Text style={[styles.text, styles.textAddress]}>Postal code </Text>
                                    <TextInput
                                        style={(Platform.OS === 'ios') ? styles.inputTextIOS : styles.inputTextAndroid}
                                        maxLength={9}
                                        onChangeText={(value) => { setZipcode(value); }}
                                        value={zipcode} />
                                </View>
                                <View style={styles.inputContainerAddress}>
                                    <Text style={[styles.text, styles.textAddress]}>Country </Text>
                                    <TextInput
                                        style={(Platform.OS === 'ios') ? styles.inputTextIOS : styles.inputTextAndroid}
                                        maxLength={49}
                                        onChangeText={(value) => { setCountry(value); }}
                                        value={country} />
                                </View>
                            </View>
                        </View>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </Modal>
    );
};

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
        borderColor: 'orange',
    },
    inputContainerAddress: {
        marginLeft: 15,
        marginRight: 15,
        borderBottomWidth: 0.3,
        borderColor: 'orange',
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
        fontWeight: 'bold',
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
    },
});

export default ProfileEdit;

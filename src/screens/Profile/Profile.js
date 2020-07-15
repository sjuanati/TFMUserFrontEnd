import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    Alert,
    Linking,
    Platform,
    StyleSheet,
    ScrollView,
    ImageBackground,
    TouchableOpacity,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import moment from 'moment';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AsyncStorage from '@react-native-community/async-storage';

import globalStyles from '../../UI/Style';
import logger from '../../shared/logRecorder';
import Cons from '../../shared/Constants';
import ProfileEdit from './ProfileEdit';
import { setIsModalProfileOpen } from '../../store/actions/modal';

const profile = (props) => {

    const dispatch = useDispatch();
    const user = useSelector(state => state.user);
    const avatar = useSelector(state => state.avatar);
    const modal = useSelector(state => state.modal);

    console.log('avatar: ', avatar)

    let genderIcon: any;
    const MALE = 'ios-male';
    const FEMALE = 'ios-female';
    const OTHERS = 'ios-transgender';
    if (user.gender === 'Femenino') {
        genderIcon = FEMALE;
    } else if (user.gender === 'Otros') {
        genderIcon = OTHERS;
    } else {
        genderIcon = MALE;
    }


    const logOut = () => {
        Alert.alert(
            '¿Seguro que quieres salir?',
            'Volverás a la pantalla de inicio',
            [
                { text: 'Cancel', onPress: () => { }, style: 'cancel' },
                {
                    text: 'OK', onPress: async () => {
                        // Remove user/token from AsyncStorage
                        await AsyncStorage.clear();
                        props.navigation.navigate('Auth');
                    }
                },
            ],
            { cancelable: false }
        )
    };

    const toggleIsModalOpen = () => {
        const prev = modal.isModalProfileOpen;
        dispatch(setIsModalProfileOpen(!prev));
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


    const renderShowProfile = () => (
        <View>
            <TouchableOpacity
                style={styles.buttonEdit}
                onPress={toggleIsModalOpen}>
                <Text style={styles.buttonText}> Editar </Text>
            </TouchableOpacity>
            <View style={styles.containerHeader}>
                {/* <View style={styles.profileImage}>
                    <ImageBackground
                        source={avatar.photo ? { uri: avatar.photo } : null}
                        style={styles.image}
                        resizeMode='cover'>
                    </ImageBackground>
                </View> */}
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
            <ProfileEdit />
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
    containerItems: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: 10,
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
    image: {
        flex: 1,
        width: undefined,
        height: undefined,
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
    ender: {
        paddingBottom: 10,
        marginBottom: 30,
        borderBottomWidth: 0.3,
        borderColor: 'orange',
    }
});

export default profile;
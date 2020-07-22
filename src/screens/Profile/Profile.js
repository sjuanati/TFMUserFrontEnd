import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    Alert,
    Linking,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
} from 'react-native';
import moment from 'moment';
import QRCode from 'react-native-qrcode-svg';
import ProfileEdit from './ProfileEdit';
import Cons from '../../shared/Constants';
import { useSelector, useDispatch } from 'react-redux';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-community/async-storage';
import { setIsModalProfileOpen } from '../../store/actions/modal';


const profile = (props) => {

    const dispatch = useDispatch();
    const user = useSelector(state => state.user);
    //const avatar = useSelector(state => state.avatar);
    const modal = useSelector(state => state.modal);

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

    // Opens a URL in the browser
    const handleURL = () => {
        const url = 'https://www.doctormax.es/privacidad-y-condiciones-de-uso/'
        Linking.canOpenURL(url)
            .then((supported) => {
                if (supported) {
                    Linking.openURL(url);
                } else {
                    Alert.alert(`The Browser can't be launched`);
                }
            })
            .catch(err => {
                Alert.alert("There's been an error with the Browser");
                console.log('Error on Profile.js -> handleURL(): ', err);
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
                <Text style={[styles.text, styles.textHeader]}> {user.name} </Text>
                {(user.birthday)
                    ? <View style={styles.containerSubHeader}>
                        <Text style={styles.text}> {moment(user.birthday).format('DD-MM-YYYY')}  | </Text>
                        <Text style={styles.text}> {moment(user.birthday).fromNow().replace(/\D/g, '')} years | </Text>
                        <Ionicons
                            name={genderIcon}
                            size={20}
                            style={(genderIcon === 'ios-female')
                                ? styles.iconGenderRotate
                                : styles.iconGender}
                        />
                    </View>
                    : null
                }
            </View>
            <View style={styles.containerHeader}>
                <QRCode
                    value={user.eth_address}
                    color={"black"}
                    backgroundColor={"white"}
                    size={125}
                    logoMargin={2}
                    logoSize={30}
                    logoBorderRadius={10}
                    logoBackgroundColor={"transparent"}
                />
            </View>
            <View style={styles.containerBody}>
                <View style={styles.containerItems}>
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
                            <Text style={styles.text}>{user.street}, {user.locality} </Text>
                            <Text style={styles.text}>{user.zip_code} {user.country}  </Text>
                        </View>
                        :
                        <Text style={styles.text}> Incomplete Address </Text>
                    }
                </View>
                <View>
                    <TouchableOpacity onPress={handleURL}>
                        <Text style={[styles.buttonText, styles.containerContact]}> Privacy Policy </Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={logOut}>
                        <Text style={[styles.buttonText, styles.containerContact, styles.ender]}> Logout </Text>
                    </TouchableOpacity>
                </View>
            </View>

        </View>
    )


    return (
        <ScrollView style={styles.container}>
            <ProfileEdit />
            {renderShowProfile()}
        </ScrollView>
    )
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: 'white',
    },
    containerHeader: {
        alignItems: 'center',
        marginBottom: 5,
    },
    containerSubHeader: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    containerBody: {
        marginTop: 20,
    },
    containerItems: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: 10,
    },
    buttonText: {
        fontSize: 17,
        color: Cons.COLORS.BLUE,
    },
    containerContact: {
        padding: 10,
    },
    textHeader: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    text: {
        fontFamily: 'HelveticaNeue',
        color: '#525775',
        fontSize: 16,
    },
    // image: {
    //     flex: 1,
    //     width: undefined,
    //     height: undefined,
    // },
    // profileImage: {
    //     width: 150,
    //     height: 150,
    //     borderRadius: 150 / 2,
    //     borderColor: Cons.COLORS.DARK_GREY,
    //     borderWidth: 0.5,
    //     overflow: 'hidden',
    //     marginBottom: 20,
    // },
    button: {
        marginTop: 10,
        marginBottom: 30,
        alignItems: 'center',
    },
    buttonEdit: {
        margin: 10,
        alignItems: 'flex-end',
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
    ender: {
        paddingBottom: 10,
        marginBottom: 30,
        borderBottomWidth: 0.3,
        borderColor: 'orange',
    }
});

export default profile;
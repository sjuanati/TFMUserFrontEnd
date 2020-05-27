import React, { useEffect } from 'react';
import { Button, Card, Header, Title, Item, Icon, Input, Text, Container, Content, Toast, List, ListItem, Right, Body, Left, Thumbnail } from "native-base";
import { View, Image, TouchableOpacity, StyleSheet, ImageBackground } from 'react-native';
const yellowIcon = require('../../assets/images/global/yellowIcon.png');
const yellowHome = require('../../assets/images/bottomBar/yellow/home.png');
const backgroundImage = require('../../assets/images/global/background.jpg');
const profileYellow = require('../../assets/images/bottomBar/yellow/profile.png');
const drmax = require('../../assets/images/global/DrMax.png');
import { useDispatch } from 'react-redux';
import axios from 'axios';

import AsyncStorage from '@react-native-community/async-storage';
import { setFavPharmacy, setData, setAddress } from '../../store/actions/user';
import { httpUrl } from '../../../urlServer';
import logger from '../../shared/logRecorder';

const insideSession = (props) => {

    const dispatch = useDispatch();
    const showProfile = async () => {
        await props.navigation.navigate('Perfil', props);
    };

    useEffect(() => {
        setUser();
    }, []);

    // MARK: Data is retrieved from AsyncStorage at login, but latest User's data from DB must be fetched
    const setUser = async () => {
        try {
            const usr = JSON.parse(await AsyncStorage.getItem('user'));
            const tkn = await AsyncStorage.getItem('token');
            const user = {
                id: usr.id,
                token: tkn
            }
            await axios.get(`${httpUrl}/users/profile/get`, {
                params: { user_id: usr.id },
                headers: { authorization: tkn }
            })
                .then(response => {
                    const res = response.data;
                    if (res.length) {
                        dispatch(setData(
                            usr.id,
                            tkn,
                            res[0].birthday,
                            res[0].email,
                            res[0].gender,
                            res[0].name,
                            res[0].phone
                        ));
                        fetchPharmacy(usr, tkn);
                        fetchAddress(usr, tkn);
                    }
                })
                .catch(err => {
                    if (err.response && err.response.status === 404) {
                        logger('ERR', 'FRONT-USER', `setUser.js : ${err}`, user, '');
                    }
                    console.log('Error in insideSession.js -> setUser():' , err);
                })
        } catch (err) {
            console.log('Error in insideSession.js -> setUser():', err);
        }
    }

    // Retrieve last pharmacy from User
    const fetchPharmacy = async (usr, tkn) => {
        await axios.get(`${httpUrl}/users/pharmacy/get`, {
            params: { user_id: usr.id },
            headers: { authorization: tkn }
        })
            .then(response => {
                const res = response.data;
                if (res.length) {
                    dispatch(setFavPharmacy(
                        res[0].pharmacy_id,
                        res[0].pharmacy_desc));
                }
            })
            .catch(err => {
                console.log('Error in insideSession.js -> fetchPharmacy():', err);
            })
    };

    // Retrieve User's address
    const fetchAddress = async (usr, tkn) => {
        await axios.get(`${httpUrl}/users/address/get`, {
            params: { address_id: usr.id },
            headers: { authorization: tkn }
        })
            .then(response => {
                const res = response.data;
                if (res.length) {
                    dispatch(setAddress(
                        res[0].address_id,
                        res[0].status,
                        res[0].street,
                        res[0].locality,
                        res[0].province,
                        res[0].zip_code,
                        res[0].country))
                } else {
                    // Avoid redux getting data from previous session
                    dispatch(setAddress(
                        null,
                        null,
                        null,
                        null,
                        null,
                        null,
                        null))
                }
            })
            .catch(err => {
                console.log('Error in insideSession.js -> fetchAddress():', err);
            })
    };

    return (
        <Container>
            <Header style={styles.header}>
                <Left style={styles.left}>

                </Left>
                <Body style={styles.body}>
                    <Image
                        style={styles.logo}
                        //source={require('../images/DrMax.png')}
                        source={drmax}
                    />
                </Body>
                <Right style={styles.right}>
                    <TouchableOpacity onPress={showProfile}>
                        <Image
                            style={styles.iconHeader}
                            source={profileYellow} />
                    </TouchableOpacity>
                </Right>
            </Header>
            <ImageBackground
                style={styles.backgroundImage}
                source={backgroundImage}>
                <Image
                    style={styles.bigLogo}
                    source={yellowIcon}
                />
                <Content padder>
                    <TouchableOpacity activeOpacity={1}
                        onPress={async () => await props.navigation.navigate('Home')}>
                        <Card style={styles.roundCard}>
                            <Image
                                style={styles.iconHome}
                                source={yellowHome}
                            />
                            <Text style={styles.text}>
                                Pide en tu
              </Text>
                            <Text style={styles.text}>
                                FARMACIA
              </Text>
                        </Card>
                    </TouchableOpacity>
                </Content>
            </ImageBackground>
        </Container>
    )
};

const styles = StyleSheet.create({
    container: {
        // flex: 1,
        // alignItems: 'center',
        // justifyContent: 'center'
    },
    header: {
        backgroundColor: 'white',
        height: 60
    },
    iconHeader: {
        height: 25,
        width: 25,
        paddingRight: 10,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.5,
        zIndex: 2,
        backgroundColor: "transparent"
    },
    body: {
        flex: 1,
        alignItems: 'center'
    },
    right: {
        flex: 1
    },
    left: {
        flex: 1
    },
    bigLogo: {
        resizeMode: 'contain',
        height: 130,
        width: 130,
        marginTop: '25%'
    },
    backgroundImage: {
        flex: 1,
        resizeMode: "cover",
        justifyContent: "center",
        alignItems: 'center'
    },
    logo: {
        resizeMode: 'contain',
        height: 150,
        width: 150
    },
    iconHome: {
        height: 50,
        width: 50,
        alignSelf: 'center',
        marginBottom: '10%'
    },
    text: {
        textAlign: 'center',
        fontSize: 20
    },
    headerTitle: {
        marginStart: 5,
        marginTop: 5,
        backgroundColor: 'white',
        borderWidth: 0,
        height: 35,
        alignItems: 'flex-start'
    },
    titlePage: {
        fontSize: 30,
        fontWeight: 'bold',
        textAlign: 'left'
    },
    roundCard: {
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: '30%',
        width: 180,
        height: 180,
        borderRadius: 1000,
        borderColor: '#F4B13E',
        shadowOpacity: 0.2
    }
});

export default insideSession;
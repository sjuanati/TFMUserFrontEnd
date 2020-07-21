import React, { useState, useEffect } from 'react';
import { 
    Card, 
    Header, 
    Text, 
    Container, 
    Content,
    Right, 
    Body, 
    Left
} from "native-base";
import { 
    Image,
    StyleSheet,
    TouchableOpacity,
    ImageBackground
} from 'react-native';
import axios from 'axios';
import { httpUrl } from '../../../urlServer';
import { useDispatch } from 'react-redux';
import { encode as btoa } from 'base-64';
import { setAvatar } from '../../store/actions/avatar';
import handleAxiosErrors from '../../shared/handleAxiosErrors';
import AsyncStorage from '@react-native-community/async-storage';
import { setFavPharmacy, setData, setAddress } from '../../store/actions/user';

const drmax = require('../../assets/images/global/DrMax.png');
const yellowIcon = require('../../assets/images/global/yellowIcon.png');
const yellowHome = require('../../assets/images/bottomBar/yellow/home.png');
const backgroundImage = require('../../assets/images/global/background.jpg');

const insideSession = (props) => {

    const dispatch = useDispatch();
    const [isActiveAccount, setIsActiveAccount] = useState(false);

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
                            res[0].phone,
                            res[0].photo,
                            res[0].status,
                            res[0].eth_address,
                        ));
                        // If User is disabled, go to AccountDisabled screen
                        if (res[0].status === 0) {
                            console.log(`User ${usr.id} disabled!`);
                            props.navigation.navigate('AccountDisabled', {
                                user_id: usr.id
                            });
                        } else {
                            setIsActiveAccount(true);
                            fetchPharmacy(usr, tkn);
                            fetchAddress(usr, tkn);
                            loadPhotoFromS3(res[0].photo, usr, tkn);
                        }
                    }
                })
                .catch(async err => {
                    handleAxiosErrors(props, err);
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
            .catch(async err => {
                handleAxiosErrors(props, err);
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
                        res[0].country
                    ));
                } else {
                    // Avoid redux getting data from previous session
                    dispatch(setAddress(
                        null,
                        null,
                        null,
                        null,
                        null,
                        null,
                        null
                    ));
                }
            })
            .catch(err => {
                console.log('Error in insideSession.js -> fetchAddress():', err);
            })
    };

        // Load profile photo
        const loadPhotoFromS3 = async (photo, usr, tkn) => {
            console.log('photo?', photo)
            if (photo) {
                //setIsLoding(true);
                await axios.get(`${httpUrl}/order/getLinePhoto`, {
                    params: {
                        photo: photo,
                        type: 'userProfile',
                    },
                    headers: { authorization: tkn }
                })
                    .then(response => {
                        let base64Flag = 'data:image/jpeg;base64,';
                        let imageStr = response.data.Body.data;
                        let binary = '';
                        let bytes = new Uint8Array(imageStr);
                        let len = bytes.byteLength;
                        for (let i = 0; i < len; i++) {
                            binary += String.fromCharCode(bytes[i]);
                        }
                        let src = btoa(binary);
                        dispatch(setAvatar(base64Flag + src));
                    })
                    .catch(err => {
                        console.log('Error at InsideSession.js -> loadPhotoFromS3() :', err);
                    })
            }
        };

    return (
        <Container>
            <Header style={styles.header}>
                <Left style={styles.left}>
                </Left>
                <Body style={styles.body}>
                    <Image
                        style={styles.logo}
                        source={drmax}
                    />
                </Body>
                <Right style={styles.right}>
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
                        onPress={async () => await props.navigation.navigate('Home')}
                        disabled={(isActiveAccount ? false : true)}
                        >
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
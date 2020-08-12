import React, { useState } from 'react';
import {
   View,
   Alert,
   Image,
   Linking,
   Platform,
   StyleSheet,
   ImageBackground,
   KeyboardAvoidingView
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import {
   Button,
   Text,
   Container,
   Content,
   Form,
   Item,
   Input,
   Toast,
   Spinner
} from "native-base";
import axios from 'axios';
import Cons from '../../shared/Constants';
import CheckBox from 'react-native-vector-icons/MaterialCommunityIcons';
import { httpUrl } from '../../../urlServer';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useDispatch } from 'react-redux';
import { setToken } from '../../store/actions/user';

const image = require('../../assets/images/global/DrMax.png');
const backgroundImage = require('../../assets/images/global/background.jpg');

const lockGrey = require('../../assets/images/login/lock.png');
const phoneGrey = require('../../assets/images/login/phone.png');
const userGrey = require('../../assets/images/login/user.png');
const emailGrey = require('../../assets/images/login/email.png');

const signup = (props) => {
   const dispatch = useDispatch();
   const [isLegalAccepted, setIsLegalAccepted] = useState(false);
   const [loading, setLoading] = useState(false);
   const [user, setUser] = useState({
      name: '',
      email: '',
      password: '',
      repeatPassword: '',
      phone: ''
   });
   const updateField = (key, value) => {
      setUser({
         ...user,
         [key]: value
      });
   };

   const showToast = (text) => {
      Toast.show({
         text: text,
         position: "bottom",
      });
   };

   const toggleIsLegalAccepted = () => {
      const prev = isLegalAccepted;
      setIsLegalAccepted(!isLegalAccepted);
   }

   const legalAlert = () => {
      Alert.alert('Por favor, marca la casilla de términos y condiciones legales');
   }

   // Opens a URL in the browser
   const handleURL = () => {
      const url = 'https://www.doctormax.es/privacidad-y-condiciones-de-uso/'
      Linking.canOpenURL(url)
         .then((supported) => {
            if (supported) {
               Linking.openURL(url);
            } else {
               Alert.alert(`Can't open browser`);
            }
         })
         .catch(err => {
            Alert.alert('Browser error');
            console.log('Error on SignUp.js -> handleURL(): ', err);
         })
   };


   const register = () => {
      if (user.email && user.password) {
         if (user.password === user.repeatPassword) {
            setLoading(true);
            axios.post(`${httpUrl}/users/register`, {
               name: user.name,
               email: user.email,
               password: user.password,
               phone: user.phone
            }).then(async res => {
               if (res.status === 200 && res.data.token) {
                  const newToken = JSON.stringify(res.data.token);
                  await AsyncStorage.clear();
                  await AsyncStorage.setItem('token', newToken);
                  await AsyncStorage.setItem('user', JSON.stringify(res.data));
                  setLoading(false);
                  //props.navigation.navigate('Main');
                  dispatch(setToken(newToken));
               } else {
                  showToast("There was an error");
                  setLoading(false);
               }
            }).catch((err) => {
               if (err.response && err.response.status === 400) {
                  showToast("Error al crear usuario, prueba en unos instantes");
               } else if (err.response && err.response.status === 404) {
                  showToast("Email account already exists");
               } else {
                  showToast("Connection issues");
               }
               setLoading(false);
            });
         } else {
            showToast("Password does not match");
         }
      } else {
         showToast("Fill in all fields");
      }
   };

   return (
      <Container style={styles.container}>
         <ImageBackground
            style={styles.backgroundImage}
            source={backgroundImage}>
            <KeyboardAvoidingView
               behavior={Platform.OS == "ios" ? "padding" : null}
               keyboardVerticalOffset={Platform.OS == "ios" ? -30 : 500}
               style={styles.containerKeyboard}>
               <Image
                  style={styles.logo}
                  source={image}
               />
               {(loading) ?
                  <Content style={styles.content}>
                     <Spinner color='#F4B13E' />
                  </Content>
                  : (
                     <Content style={styles.content}>
                        <Form style={styles.form}>
                           <Item rounded
                              style={styles.input}>
                              <Image
                                 style={styles.iconInput}
                                 source={userGrey} />
                              <Input type="text"
                                 placeholder="Nombre"
                                 maxLength={254}
                                 onChangeText={(name) => updateField('name', name)}
                                 value={user.name} />
                           </Item>
                           <Item rounded
                              style={styles.input}>
                              <Image
                                 style={styles.iconInput}
                                 source={emailGrey} />
                              <Input type="text"
                                 autoCapitalize='none'
                                 placeholder="Email"
                                 keyboardType="email-address"
                                 maxLength={254}
                                 onChangeText={(mail) => updateField('email', mail)}
                                 value={user.email} />
                           </Item>
                           <Item rounded
                              style={styles.input}>
                              <Image
                                 style={styles.iconInput}
                                 source={phoneGrey} />
                              <Input type="number"
                                 maxLength={20}
                                 placeholder="Telefono"
                                 keyboardType="phone-pad"
                                 onChangeText={(phone) => updateField('phone', phone)}
                                 value={user.phone} />
                           </Item>
                           <Item rounded
                              style={styles.input}>
                              <Image
                                 style={styles.iconInput}
                                 source={lockGrey} />
                              <Input autoCapitalize='none'
                                 secureTextEntry={true}
                                 type="text"
                                 maxLength={254}
                                 placeholder="Contraseña"
                                 onChangeText={(pass) => updateField('password', pass)}
                                 value={user.password} />
                           </Item>
                           <Item rounded
                              style={styles.input}>
                              <Image
                                 style={styles.iconInput}
                                 source={lockGrey} />
                              <Input autoCapitalize='none'
                                 secureTextEntry={true}
                                 type="text"
                                 maxLength={254}
                                 placeholder="Repetir Contraseña"
                                 onChangeText={(repeatPass) => updateField('repeatPassword', repeatPass)}
                                 value={user.repeatPassword} />
                           </Item>
                           <View style={[styles.text, styles.containerCheckBox]}>
                              <TouchableOpacity onPress={toggleIsLegalAccepted}>
                                 <CheckBox
                                    name={(isLegalAccepted) ? 'checkbox-marked' : 'checkbox-blank-outline'}
                                    size={30}
                                 />
                              </TouchableOpacity>
                              <Text> Acepto los </Text>
                              <TouchableOpacity onPress={handleURL}>
                                 <Text style={styles.textLegal}>términos y condiciones legales </Text>
                              </TouchableOpacity>
                           </View>
                           <Button block rounded
                              style={styles.button}
                              //   onPress={register}>
                              onPress={(isLegalAccepted) ? register : legalAlert}>
                              <Text>Registrarme</Text>
                           </Button>
                        </Form>
                        <Text style={styles.text}>
                           <Text>¿Tienes cuenta? </Text>
                           <Text style={styles.bold}
                              onPress={() => props.navigation.navigate('SignIn')}>
                              Accede
              </Text>
                        </Text>
                     </Content>
                  )}
            </KeyboardAvoidingView>
         </ImageBackground>
      </Container>
   )
};


const styles = StyleSheet.create({
   container: {
      flex: 1,
      flexDirection: "row",
      alignItems: 'center'
   },
   containerKeyboard: {
      flex: 1,
      alignItems: 'center'
   },
   iconInput: {
      width: 25,
      height: 25,
      marginLeft: 10
   },
   backgroundImage: {
      flex: 1,
      resizeMode: "cover",
      justifyContent: "center",
      alignItems: 'center'
   },
   logo: {
      resizeMode: 'contain',
      height: 180,
      width: 300,
   },
   text: {
      marginTop: '2%',
      textAlign: 'center'
   },
   input: {
      color: 'white',
      backgroundColor: 'white',
      marginBottom: '2%',
      width: 300
   },
   form: {
      padding: '4%',
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center'
   },
   button: {
      marginTop: '7%',
      marginHorizontal: '30%',
      backgroundColor: '#F4B13E'
   },
   bold: {
      fontWeight: 'bold'
   },
   containerCheckBox: {
      flex: 1,
      paddingTop: 15,
      flexDirection: 'row',
      alignItems: 'center',
   },
   textLegal: {
      color: Cons.COLORS.BLUE
   },
});

export default signup;
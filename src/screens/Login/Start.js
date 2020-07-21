import React, { useState } from 'react';

import { StyleSheet, Image, ImageBackground } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';

import { Spinner, Button, Text, Container, Content, Form, Item, Input, Toast } from "native-base";

import axios from 'axios';

import { httpUrl } from '../../../urlServer';

const lockGrey = require('../../assets/images/login/lock.png');
//const passwordGrey = require('../images/darkgrey/password.png');
const emailGrey = require('../../assets/images/login/email.png');
const image = require('../../assets/images/global/DrMax.png');
const backgroundImage = require('../../assets/images/global/background.jpg');

const start = props => {
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState({
    email: '',
    password: ''
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
      duration: 3000,
    });
  };

  const login = () => {
    if(user.email && user.password) {
      setLoading(true);
      axios.post(`${httpUrl}/users/login`, {
        email: user.email,
        password: user.password
      }).then(async res => {
        console.log(res.status);
        if(res.status === 200 && res.data.token) {
          await AsyncStorage.setItem('token', JSON.stringify(res.data.token));
          await AsyncStorage.setItem('user', JSON.stringify(res.data));
          setLoading(false);
          props.navigation.navigate('Main');
        } else {
          {showToast("Ha ocurrido un error")}
          setLoading(false);
        }
      }).catch((err) => {
        if(err.response && (err.response.status === 401 || err.response.status === 403)) {
          {showToast("Error en email o contraseña")}
        } else if(err.response && err.response.status === 404) {
          {showToast("No hay ningún usuario con este email")}
        } else {
          {showToast("Ups... parece que no hay conexión")}
        }
        setLoading(false);
      });
    } else {
      {showToast("Complete all parameters")}
    }
  };

  return (
    <Container style={styles.container}>
      <ImageBackground
        style={styles.backgroundImage}
        source={backgroundImage}>
        <Image
          style={styles.logo}
          source={image}
        />
        {(loading) ?
          <Content style={styles.spinnerContent}>
            <Spinner color='#F4B13E' />
          </Content>
          : (
          <Content>
            <Form style={styles.form}>
              <Item rounded
                    style={styles.input}>
                <Image
                  style={styles.iconInput}
                  source={emailGrey}/>
                <Input autoCapitalize='none'
                       placeholder="Email"
                       keyboardType="email-address"
                       maxLength={254}
                       onChangeText={(mail) => updateField('email', mail)}
                       value={user.email}/>
              </Item>
              <Item rounded
                    style={styles.input}>
                <Image
                  style={styles.iconInput}
                  source={lockGrey}/>
                <Input autoCapitalize='none'
                       secureTextEntry={true}
                       maxLength={254}
                       placeholder="Contraseña"
                       onChangeText={(pass) => updateField('password', pass)}
                       value={user.password}/>
              </Item>
              <Button block rounded
                      style={styles.button}
                      onPress={login}>
                <Text>Acceder</Text>
              </Button>
            </Form>
            <Text style={styles.text}>
              <Text>¿No tienes cuenta? </Text>
              <Text style={styles.bold}
                    onPress={() => props.navigation.navigate('SignUpScreen')}>
                Crea una
              </Text>
            </Text>
          </Content>
        )}
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
  spinnerContent: {
    paddingTop: '50%'
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
    height: 260,
    width: 300,
  },
  text: {
    marginTop: '2%',
    textAlign: 'center',
    width: '100%'
  },
  input: {
    color: 'white',
    backgroundColor: 'white',
    marginBottom: '2%',
    width: 300
  },
  form: {
    paddingHorizontal: '4%',
    paddingBottom: '4%',
    // paddingTop: '50%',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  button: {
    marginTop: '2%',
    marginHorizontal: '30%',
    backgroundColor: '#F4B13E'
  },
  bold: {
    fontWeight: 'bold'
  }
});
export default start;
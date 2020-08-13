import React, { useState } from 'react';
import { 
  Spinner,
  Button,
  Text,
  Container,
  Content,
  Form,
  Item,
  Input,
} from 'native-base';
import axios from 'axios';
import { httpUrl } from '../../../urlServer';
import { StyleSheet, Image, ImageBackground } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import handleAxiosErrors from '../../shared/handleAxiosErrors';
import { useDispatch } from 'react-redux';
import { setToken } from '../../store/actions/user';
import showToast from '../../shared/Toast';

const lockGrey = require('../../assets/images/login/lock.png');
const emailGrey = require('../../assets/images/login/email.png');
const image = require('../../assets/images/global/DrMax.png');
const backgroundImage = require('../../assets/images/global/background.jpg');

const SignIn = props => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState({
    email: '',
    password: '',
  });
  const updateField = (key, value) => {
    setUser({
      ...user,
      [key]: value,
    });
  };

  const login = () => {
    if (user.email && user.password) {
      setLoading(true);
      axios.post(`${httpUrl}/users/login`, {
        email: user.email,
        password: user.password,
      }).then(async res => {
        if (res.status === 200 && res.data.token) {
          const userToken = JSON.stringify(res.data.token);
          await AsyncStorage.setItem('token', userToken);
          const userId = JSON.stringify(res.data.id);
          await AsyncStorage.setItem('user', userId);
          //await AsyncStorage.setItem('user', JSON.stringify(res.data));
          setLoading(false);
          //props.navigation.navigate('Main');
          dispatch(setToken(userToken));
        } else {
          showToast('There was an error', 'default');
          setLoading(false);
        }
      }).catch((err) => {
        handleAxiosErrors(props, err);
        setLoading(false);
      });
    } else {
      showToast('Fill in all parameters', 'default');
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
            <Spinner color="#F4B13E" />
          </Content>
          : (
          <Content>
            <Form style={styles.form}>
              <Item rounded
                    style={styles.input}>
                <Image
                  style={styles.iconInput}
                  source={emailGrey}/>
                <Input autoCapitalize="none"
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
                <Input autoCapitalize="none"
                       secureTextEntry={true}
                       maxLength={254}
                       placeholder="Password"
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
                    onPress={() => props.navigation.navigate('SignUp')}>
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
    flexDirection: 'row',
    alignItems: 'center',
  },
  containerKeyboard: {
    flex: 1,
    alignItems: 'center',
  },
  spinnerContent: {
    paddingTop: '50%',
  },
  iconInput: {
    width: 25,
    height: 25,
    marginLeft: 10,
  },
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
    alignItems: 'center',
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
    width: 300,
  },
  form: {
    paddingHorizontal: '4%',
    paddingBottom: '4%',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    marginTop: '2%',
    marginHorizontal: '30%',
    backgroundColor: '#F4B13E',
  },
  bold: {
    fontWeight: 'bold',
  },
});

export default SignIn;

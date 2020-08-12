import React, { useEffect } from 'react';
import { setToken } from '../store/actions/user';
import { useDispatch, useSelector } from 'react-redux';
import { NavigationContainer } from '@react-navigation/native';
import AsyncStorage from '@react-native-community/async-storage';
import { LoginStackScreen } from './StackNavigator';
import { AppTabScreens } from './BottomTabNavigator';

const appNavigator = () => {

    const dispatch = useDispatch();
    const user = useSelector(state => state.user);

    useEffect(() => {
        const getToken = async () => dispatch(setToken(await AsyncStorage.getItem('token')));
        getToken();
    }, [])

    return (
        <NavigationContainer>
            {(user.token == null)
                ? <LoginStackScreen />
                : <AppTabScreens />
            }
        </NavigationContainer>
    )
};

export default appNavigator;

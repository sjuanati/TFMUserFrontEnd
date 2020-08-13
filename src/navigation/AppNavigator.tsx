import React, { useEffect } from 'react';
import { setToken } from '../store/actions/user';
import { useDispatch } from 'react-redux';
import { useTypedSelector } from '../store/reducers/reducer';
import { NavigationContainer } from '@react-navigation/native';
import AsyncStorage from '@react-native-community/async-storage';
import { LoginStackScreen } from './StackNavigator';
import { AppTabScreens } from './BottomTabNavigator';

const AppNavigator = () => {

    const dispatch = useDispatch();
    const user = useTypedSelector(state => state.user);

    useEffect(() => {
        const getToken = async () => dispatch(setToken(await AsyncStorage.getItem('token')));
        getToken();
    }, [dispatch]);

    return (
        <NavigationContainer>
            {(user.token == null)
                ? <LoginStackScreen />
                : <AppTabScreens />
            }
        </NavigationContainer>
    );
};

export default AppNavigator;

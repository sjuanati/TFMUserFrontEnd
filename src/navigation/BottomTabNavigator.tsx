import React from 'react';
import {
    Image,
    StyleSheet,
} from 'react-native';
import {
    HomeStackScreen,
    OrderStackScreen,
    TokenStackScreen,
    ProfileStackScreen,
} from './StackNavigator';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

const homeOrange = require('../assets/images/bottomBar/yellow/home-orange.png');
const homeGrey = require('../assets/images/bottomBar/grey/home-grey.png');
const ordersOrange = require('../assets/images/bottomBar/yellow/list-orange.png');
const ordersGrey = require('../assets/images/bottomBar/grey/list-grey.png');
const ethereumOrange = require('../assets/images/bottomBar/yellow/ethereum-orange.png');
const ethereumGrey = require('../assets/images/bottomBar/grey/ethereum-grey.png');
const profileOrange = require('../assets/images/bottomBar/yellow/user-orange.png');
const profileGrey = require('../assets/images/bottomBar/grey/user-grey.png');

const Tab = createBottomTabNavigator();

const AppTabScreens = () => (
    <Tab.Navigator
        initialRouteName="Home"
        tabBarOptions={{
            activeTintColor: '#e91e63',
            showLabel: false,
        }} >
        <Tab.Screen
            name="Home"
            component={HomeStackScreen}
            options={{
                tabBarLabel: 'Home',
                tabBarIcon: ({ focused }) => (focused
                    ? <Image
                        style={styles.iconHome}
                        source={homeOrange} />
                    : <Image
                        style={styles.iconHome}
                        source={homeGrey} />
                ),
            }} />
        <Tab.Screen
            name="Orders"
            component={OrderStackScreen}
            options={{
                tabBarLabel: 'Orders',
                tabBarIcon: ({ focused }) => (focused
                    ? <Image
                        style={styles.iconHome}
                        source={ordersOrange} />
                    : <Image
                        style={styles.iconHome}
                        source={ordersGrey} />
                ),
            }} />
        <Tab.Screen
            name="Tokens"
            component={TokenStackScreen}
            options={{
                tabBarLabel: 'Tokens',
                tabBarIcon: ({ focused }) => (focused
                    ? <Image
                        style={styles.iconHome}
                        source={ethereumOrange} />
                    : <Image
                        style={styles.iconHome}
                        source={ethereumGrey} />
                ),
            }} />
        <Tab.Screen
            name="Profile"
            component={ProfileStackScreen}
            options={{
                tabBarLabel: 'Profile',
                tabBarIcon: ({ focused }) => (focused
                    ? <Image
                        style={styles.iconHome}
                        source={profileOrange} />
                    : <Image
                        style={styles.iconHome}
                        source={profileGrey} />
                ),
            }} />
    </Tab.Navigator>
);

const styles = StyleSheet.create({
    iconHome: {
        width: 30,
        height: 30,
    },
});

export { AppTabScreens };

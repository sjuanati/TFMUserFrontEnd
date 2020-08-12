import React from 'react';
import { TouchableOpacity } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';

// Home Tab screens
import Home from '../screens/Home/Home';
import PharmacySearch from '../screens/Pharmacy/PharmacySearch';
import PharmacyDetails from '../screens/Pharmacy/PharmacyDetail';
import MakeOrder from '../screens/Order/MakeOrder';
import MakeOrderScan from '../screens/Order/MakeOrderScan';
import MakeOrderChoose from '../screens/Order/MakeOrderChoose';
import OrderSummary from '../screens/Order/OrderSummary';
import PurchaseOrder from '../screens/Order/PurchaseOrder';
import ProductDetail from '../screens/Order/ProductDetail';
// Orders Tab screens
import Orders from '../screens/Order/GetOrder';
import OrderDetail from '../screens/Order/GetOrderDetail';
import OrderTrace from '../screens/Order/GetOrderTrace';
// Tokens Tab screens
import Tokens from '../screens/Tokens/Token';
import EarnTokensDetail from '../screens/Tokens/earnTokensDetail';
// Profile Tab screens
import Profile from '../screens/Profile/Profile';
// Login screens
import SignIn from '../screens/Login/SignIn';
import SignUp from '../screens/Login/SignUp';

import CartIcon from '../UI/HeaderCartIcon';
import BackIcon from '../UI/HeaderBackIcon';
import HeaderLogo from '../UI/HeaderLogo';

const HomeStack = createStackNavigator();

const HomeStackScreen = () => (
    <HomeStack.Navigator
        screenOptions={(props) => ({
            headerTitle: () => <HeaderLogo />,
            headerRight: () => (
                <TouchableOpacity
                    onPress={() => props.navigation.navigate('OrderSummary')}>
                    <CartIcon />
                </TouchableOpacity>),
            headerBackImage: () => <BackIcon />,
            headerBackTitleVisible: false,
        })}>
        <HomeStack.Screen
            name="Home"
            component={Home}
            options={{ headerShown: true }} />
        <HomeStack.Screen
            name="PharmacySearch"
            component={PharmacySearch}
            options={{ headerShown: true }} />
        <HomeStack.Screen
            name="PharmacyDetails"
            component={PharmacyDetails}
            options={{ headerShown: true }} />
        <HomeStack.Screen
            name="MakeOrder"
            component={MakeOrder}
            options={{ headerShown: true }} />
        <HomeStack.Screen
            name="MakeOrderScan"
            component={MakeOrderScan}
            options={{ headerShown: true }} />
        <HomeStack.Screen
            name="MakeOrderChoose"
            component={MakeOrderChoose}
            options={{ headerShown: true }} />
        <HomeStack.Screen
            name="OrderSummary"
            component={OrderSummary}
            options={{ headerShown: true }} />
        <HomeStack.Screen
            name="PurchaseOrder"
            component={PurchaseOrder}
            options={{ headerShown: true }} />
        <HomeStack.Screen
            name="ProductDetail"
            component={ProductDetail}
            options={{ headerShown: true }} />
    </HomeStack.Navigator>
);

const OrderStack = createStackNavigator();

const OrderStackScreen = () => (
    <OrderStack.Navigator
        screenOptions={(props) => ({
            headerTitle: () => <HeaderLogo />,
            headerRight: () => (
                <TouchableOpacity
                    onPress={() => props.navigation.navigate('OrderSummary')}>
                    <CartIcon />
                </TouchableOpacity>),
            headerBackImage: () => <BackIcon />,
            headerBackTitleVisible: false,
        })}>
        <OrderStack.Screen
            name="Orders"
            component={Orders}
            options={{ headerShown: true }} />
        <OrderStack.Screen
            name="OrderDetail"
            component={OrderDetail}
            options={{ headerShown: true }} />
        <OrderStack.Screen
            name="OrderSummary"
            component={OrderSummary}
            options={{ headerShown: true }} />
        <OrderStack.Screen
            name="OrderTrace"
            component={OrderTrace}
            options={{ headerShown: true }} />
        <OrderStack.Screen
            name="ProductDetail"
            component={ProductDetail}
            options={{ headerShown: true }} />
    </OrderStack.Navigator>
);

const TokenStack = createStackNavigator();

const TokenStackScreen = () => (
    <TokenStack.Navigator
        screenOptions={(props) => ({
            headerTitle: () => <HeaderLogo />,
            headerRight: () => (
                <TouchableOpacity
                    onPress={() => props.navigation.navigate('OrderSummary')}>
                    <CartIcon />
                </TouchableOpacity>),
            headerBackImage: () => <BackIcon />,
            headerBackTitleVisible: false,
        })}>
        <TokenStack.Screen
            name="Tokens"
            component={Tokens}
            options={{ headerShown: true }} />
        <TokenStack.Screen
            name="EarnTokensDetail"
            component={EarnTokensDetail}
            options={{ headerShown: true }} />
    </TokenStack.Navigator>
);

const ProfileStack = createStackNavigator();

const ProfileStackScreen = () => (
    <ProfileStack.Navigator
        screenOptions={(props) => ({
            headerTitle: () => <HeaderLogo />,
            headerRight: () => (
                <TouchableOpacity
                    onPress={() => props.navigation.navigate('OrderSummary')}>
                    <CartIcon />
                </TouchableOpacity>),
            headerBackImage: () => <BackIcon />,
            headerBackTitleVisible: false,
        })}>
        <ProfileStack.Screen
            name="Profile"
            component={Profile}
            options={{ headerShown: true }} />
        <ProfileStack.Screen
            name="OrderSummary"
            component={OrderSummary}
            options={{ headerShown: true }} />
    </ProfileStack.Navigator>
);

const LoginStack = createStackNavigator();

const LoginStackScreen = () => (
    <LoginStack.Navigator>
        <LoginStack.Screen
            name="SignIn"
            component={SignIn}
            options={{ headerShown: false }} />
        <LoginStack.Screen
            name="SignUp"
            component={SignUp}
            options={{ headerShown: false }} />
    </LoginStack.Navigator>
);

export {
    HomeStackScreen,
    OrderStackScreen,
    TokenStackScreen,
    ProfileStackScreen,
    LoginStackScreen
}
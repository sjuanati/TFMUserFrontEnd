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
import EarnTokensDetail from '../screens/Tokens/EarnTokensDetail';
// Profile Tab screens
import Profile from '../screens/Profile/Profile';
// Login screens
import SignIn from '../screens/Login/SignIn';
import SignUp from '../screens/Login/SignUp';

import CartIcon from '../UI/HeaderCartIcon';
import BackIcon from '../UI/HeaderBackIcon';
import HeaderLogo from '../UI/HeaderLogo';

export interface Product {
    item_id: number,
    dose_form: string,
    dose_qty: string,
    leaflet_url: string,
    max_date: Date,
    prescription: boolean,
    price: number,
    product_desc: string,
    product_id: number,
    screen: string,
}

export interface Pharma {
    communication: string,
    country: string,
    creation_date: Date,
    distance: number,
    email: string,
    eth_address: string,
    facebook: string,
    gps_latitude: number,
    gps_longitude: number,
    icon: null,
    instagram: string,
    locality: string,
    municipality: string,
    nif: string,
    opening_hours: null,
    owner_name: string,
    password: string,
    pharmacy_code: string,
    pharmacy_desc: string,
    pharmacy_id: number,
    phone_number: string,
    province: string,
    status: number,
    street: string,
    token: string,
    update_date: Date,
    web: string,
    whatsapp: string,
    zip_code: string
}

export type HomeStackParamList = {
    Home: undefined;
    PharmacySearch: undefined;
    PharmacyDetails: Pharma;
    MakeOrder: undefined;
    MakeOrderScan: undefined;
    MakeOrderChoose: undefined;
    OrderSummary: undefined;
    PurchaseOrder: undefined;
    ProductDetail: Product;
};

//const HomeStack = createStackNavigator();
const HomeStack = createStackNavigator<HomeStackParamList>();

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

export interface OrderType {
    chat_id: number,
    creation_date: Date,
    order_id: string,
    order_item: number,
    order_id_app: number,
    pharmacy_desc: string,
    pharmacy_id: number,
    status: number,
    status_desc: string,
    total_price: number,
    unseen: boolean,
    user_id: number,
}

export type OrderStackParamList = {
    Orders: undefined;
    OrderDetail: { order_id: string };
    OrderSummary: undefined;
    OrderTrace: { order_id: string };
    ProductDetail: undefined;
};

//const OrderStack = createStackNavigator();
const OrderStack = createStackNavigator<OrderStackParamList>();

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


export interface EarnToken {
    earn_desc: string,
    earn_desc_long: string,
    earn_qty: 50,
    id: string,
    photo: string,
    supplier_desc: string,
    validity_end_date: Date,
    validity_start_date: Date,
}

export type TokenStackParamList = {
    Tokens: undefined;
    EarnTokensDetail: EarnToken;
};

//const TokenStack = createStackNavigator();
const TokenStack = createStackNavigator<TokenStackParamList>();

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


export type LoginStackParamList = {
    SignIn: undefined;
    SignUp: undefined;
};

//const LoginStack = createStackNavigator();
const LoginStack = createStackNavigator<LoginStackParamList>();

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
    LoginStackScreen,
};

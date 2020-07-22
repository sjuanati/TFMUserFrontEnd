import React from 'react';
import { Image, StyleSheet } from 'react-native';
import { createStackNavigator } from 'react-navigation-stack';
import { createBottomTabNavigator } from 'react-navigation-tabs';

import Home from '../screens/Home/Home';
import Orders from '../screens/Order/GetOrder';
import OrderDetail from '../screens/Order/GetOrderDetail';
import Tokens from '../screens/Tokens/Token';
import EarnTokensDetail from '../screens/Tokens/earnTokensDetail';
import SpendTokensDetail from '../screens/Tokens/spendTokensDetail';
import Profile from '../screens/Profile/Profile';
import CustomHeader from '../navigation/CustomHeader';
import InsideSession from '../screens/Home/InsideSession';
import PharmacySearch from '../screens/Pharmacy/PharmacySearch';
import PharmacyDetails from '../screens/Pharmacy/PharmacyDetail';
import MakeOrder from '../screens/Order/MakeOrder';
import MakeOrderScan from '../screens/Order/MakeOrderScan';
import MakeOrderChoose from '../screens/Order/MakeOrderChoose';
import OrderSummary from '../screens/Order/OrderSummary';
import ProductDetail from '../screens/Order/ProductDetail';
import FullScreenImage from '../screens/Order/GetOrderImage';
import OrderTrace from '../screens/Order/GetOrderTrace';

const homeYellow = require('../assets/images/bottomBar/yellow/home.png');
const homeGrey = require('../assets/images/bottomBar/grey/home.png');
const historialYellow = require('../assets/images/bottomBar/yellow/historial.png');
const historialGrey = require('../assets/images/bottomBar/grey/historial.png');
const profileYellow = require('../assets/images/bottomBar/yellow/profile.png');
const profileGrey = require('../assets/images/bottomBar/grey/profile.png');


const HomeStack = createStackNavigator({
    Home: Home,
    PharmacySearch: {
        screen: PharmacySearch,
        navigationOptions: {
            headerShown: false
        }
    },
    PharmacyDetails: {
        screen: PharmacyDetails,
        navigationOptions: {
            headerShown: false
        }
    },
    Order: {
        screen: MakeOrder,
        navigationOptions: {
            headerShown: false
        }
    },
    MakeOrderScan: {
        screen: MakeOrderScan,
        navigationOptions: {
            headerShown: false
        }
    },
    MakeOrderChoose: {
        screen: MakeOrderChoose,
        navigationOptions: {
            headerShown: false
        }
    },
    OrderSummary: {
        screen: OrderSummary,
        navigationOptions: {
            headerShown: false
        }
    },
    ProductDetail: {
        screen: ProductDetail,
        navigationOptions: {
            headerShown: false
        }
    },
},
    {
        defaultNavigationOptions: {
            header: props => <CustomHeader {...props} />
        }
    }
);

HomeStack.navigationOptions = {
    tabBarLabel: 'Home',
    tabBarIcon: ({ focused }) => {
        return focused ?
            <Image
                style={styles.iconHome}
                source={homeYellow} /> :
            <Image
                style={styles.iconHome}
                source={homeGrey} />
    }
};

const OrdersStack = createStackNavigator({
    Orders: Orders,
    OrderDetail: {
        screen: OrderDetail,
        navigationOptions: {
            headerShown: false
        }
    },
    OrderSummary: {
        screen: OrderSummary,
        navigationOptions: {
            headerShown: false
        }
    },
    FullScreenImage: {
        screen: FullScreenImage,
        navigationOptions: {
            headerShown: false
        }
    },
    OrderTrace: {
        screen: OrderTrace,
        navigationOptions: {
            headerShown: false
        }
    },
    ProductDetail: {
        screen: ProductDetail,
        navigationOptions: {
            headerShown: false
        }
    },
},
    {
        defaultNavigationOptions: {
            header: props => <CustomHeader {...props} />
        }
    }
);

OrdersStack.navigationOptions = {
    tabBarLabel: 'Orders',
    tabBarIcon: ({ focused }) => {
        return focused ?
            <Image
                style={styles.iconHome}
                source={historialYellow} /> :
            <Image
                style={styles.iconHome}
                source={historialGrey} />
    }
};

const TokensStack = createStackNavigator({
    Tokens: Tokens,
    EarnTokensDetail: {
        screen: EarnTokensDetail,
        navigationOptions: {
            headerShown: false
        }
    },
    SpendTokensDetail: {
        screen: SpendTokensDetail,
        navigationOptions: {
            headerShown: false
        }
    },
},
    {
        defaultNavigationOptions: {
            header: props => <CustomHeader {...props} />
        }
    }
);

TokensStack.navigationOptions = {
    tabBarLabel: 'Tokens',
    tabBarIcon: ({ focused }) => {
        return focused ?
            <Image
                style={styles.iconHome}
                source={historialYellow} /> :
            <Image
                style={styles.iconHome}
                source={historialGrey} />
    }
};

const ProfileStack = createStackNavigator({
    Profile: Profile,
    OrderSummary: {
        screen: OrderSummary,
        navigationOptions: {
            headerShown: false
        }
    },
},
    {
        defaultNavigationOptions: {
            header: props => <CustomHeader {...props} />
        },
    }
);

ProfileStack.navigationOptions = {
    tabBarLabel: 'Profile',
    tabBarIcon: ({ focused }) => {
        return focused ?
            <Image
                style={styles.iconHome}
                source={profileYellow} /> :
            <Image
                style={styles.iconHome}
                source={profileGrey} />
    }
};

const MainTabNavigator = createBottomTabNavigator({
    HomeStack,
    OrdersStack,
    TokensStack,
    ProfileStack
},
    {
        defaultNavigationOptions: {
            // header: props => <CustomHeader {...props} />
        },
        tabBarOptions: {
            activeTintColor: '#F4B13E',
            activeBackgroundColor: '#f0f0f0',
            inactiveTintColor: 'black',
            inactiveBackgroundColor: '#F0F0F0',
            style: {
                height: 60,
                backgroundColor: '#F0F0F0',
                paddingBottom: 5
            }
        }
    }
);

const styles = StyleSheet.create({
    iconHome: {
        width: 25,
        height: 25
    }
});

const DrawerNavigator = createStackNavigator({
    Home: {
        screen: MainTabNavigator
    },
    // Cart: Cart,
    InsideSession: InsideSession
}, {
    initialRouteName: 'InsideSession',
    defaultNavigationOptions: {
        headerShown: false
    }    // contentComponent: props => <SideBar {...props} />,
}
);

export default StackNavigator = createStackNavigator({
    DrawerNavigator: {
        screen: DrawerNavigator
    }
},
    {
        defaultNavigationOptions: {
            headerShown: false
        }
    }
);

import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack'

import MainTabNavigator from './MainTabNavigator';
import Start from '../screens/Login/Start';
import SignUp from '../screens/Login/SignUp'
import AuthLoading from '../screens/Login/AuthLoading';


const AuthStack = createStackNavigator(
  {
    SignUpScreen: SignUp,
    StartScreen: Start
  }, {
    defaultNavigationOptions: {
      headerShown: false
    }
  }
);

export default createAppContainer(createSwitchNavigator({
    AuthLoading: AuthLoading,
    Main: MainTabNavigator,
    Auth: AuthStack
  },
  {
    initialRouteName: 'AuthLoading'
  }
));
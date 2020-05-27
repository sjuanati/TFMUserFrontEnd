import React, { useState } from 'react';
import { Platform, StatusBar, StyleSheet, View } from 'react-native';

import { Root, Button, Text, Container, Content } from "native-base";

import AppNavigator from './src/navigation/AppNavigator';
import {createStore, combineReducers} from 'redux';
import {Provider} from 'react-redux';
import orderReducer from './src/store/reducers/order';
import userReducer from './src/store/reducers/user';

// Set global state variables through Redux
const rootReducer = combineReducers({
  order: orderReducer,
  user: userReducer
});
const store = createStore(rootReducer);

const App = props => {
  return (
    <Provider store={store}>
      <Container>
        {/*{Platform.OS === 'ios' && <StatusBar barStyle="default" />}*/}
        <Root>
          <AppNavigator />
        </Root>
      </Container>
    </Provider>
  );
};

export default App;

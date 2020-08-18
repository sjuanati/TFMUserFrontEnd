import React from 'react';
import AppNavigator from './src/navigation/AppNavigator';
import { createStore, combineReducers } from 'redux';
import { Provider } from 'react-redux';
import orderReducer from './src/store/reducers/order';
import userReducer from './src/store/reducers/user';
//import avatarReducer from './src/store/reducers/avatar';
import modalReducer from './src/store/reducers/modal';
import { Root } from 'native-base'

// Set global state variables through Redux
const rootReducer = combineReducers({
   order: orderReducer,
   user: userReducer,
   //avatar: avatarReducer,
   modal: modalReducer,
});
const store = createStore(rootReducer);

const App = () => {
   return (
      <Provider store={store}>
         <Root>
            <AppNavigator />
         </Root>
      </Provider>
   );
};

export default App;

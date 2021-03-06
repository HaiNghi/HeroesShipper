

import React, { Component } from 'react';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import ReduxThunk from 'redux-thunk';
import SplashScreen from 'react-native-splash-screen';
import PushNotification from 'react-native-push-notification';
import firebase from 'firebase';
import reducers from './src/reducers';
import AppNavigation from './src/routes/route';
// import Home from './src/containers/Home';

export default class App extends Component {
  componentDidMount() {
    SplashScreen.hide();
    const config = {
      // apiKey: 'AIzaSyCMZ9wQNLZVwPHobdiWLzeIvHecCgWoAa4',
      // authDomain: 'heroes-4875a.firebaseapp.com',
      // databaseURL: 'https://heroes-4875a.firebaseio.com',
      // projectId: 'heroes-4875a',
      // storageBucket: 'heroes-4875a.appspot.com',
      // messagingSenderId: '434547978170'

      // apiKey: 'AIzaSyCmVBNyzhhvvr3pOnGM7eLJvz6i_HcTQsY',
      // authDomain: 'heroes-demo-6e61e.firebaseapp.com',
      // databaseURL: 'https://heroes-demo-6e61e.firebaseio.com',
      // projectId: 'heroes-demo-6e61e',
      // storageBucket: 'heroes-demo-6e61e.appspot.com',
      // messagingSenderId: '124925794813'

      apiKey: 'AIzaSyDVpmneY0JvpKS9fBmr5gx3M58DdE7ThRg',
      authDomain: 'heroes-demo2.firebaseapp.com',
      databaseURL: 'https://heroes-demo2.firebaseio.com',
      projectId: 'heroes-demo2',
      storageBucket: 'heroes-demo2.appspot.com',
      messagingSenderId: '709191546348'
    };
    firebase.initializeApp(config);
  }
  render() {
    const store = createStore(reducers, {}, applyMiddleware(ReduxThunk));
    return (
      <Provider store={store}>
        <AppNavigation />
      </Provider>
    );
  }
}


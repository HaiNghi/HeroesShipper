import React from 'react';
import { StackNavigator, DrawerNavigator } from 'react-navigation';
import { Root } from 'native-base';
import SlideMenu from '../components/SlideMenu';
import Home from '../containers/Home';
import Login from '../containers/Login';
import Register from '../containers/Register';
import AccountVerification from '../containers/AccountVerification';
import DeliveryDetail from '../containers/DeliveryDetail';
import DefaultRoute from '../containers/DefaultRoute';
import ReceivingPackageVerification from '../components/ReceivingPackageVerification';
import CameraScreen from '../components/CameraScreen';

const MainNavigator = DrawerNavigator({
    Home: { 
        screen: Home
    },
    DefaultRoute: {
        screen: DefaultRoute
    }
}, 
{
    contentComponent: props => <SlideMenu {...props} />,
    headerMode: 'none',
    navigationOptions: {
        drawerLockMode: 'locked-closed'
      }   
});

const AppNavigator = StackNavigator({
    Login: {
        screen: Login
    },
    Register: {
        screen: Register
    },
    MainNavigator: { 
        screen: MainNavigator,
       
    },
    AccountVerification: {
        screen: AccountVerification
    },
    DeliveryDetail: {
        screen: DeliveryDetail
    },
    ReceivingPackageVerification: {
        screen: ReceivingPackageVerification
    },
    CameraScreen: {
        screen: CameraScreen
    }
    
}, 
{
    initialRouterName: 'Home',
    headerMode: 'none', 
    drawerPosition: 'Left',
    drawerOpenRoute: 'DrawerOpen',
    drawerCloseRoute: 'DrawerClose',
    drawerToggleRoute: 'DrawerToggle',
    navigationOptions: {
        gesturesEnabled: false,
    }
});

export default () => 
    <Root>
        <AppNavigator />
    </Root>;

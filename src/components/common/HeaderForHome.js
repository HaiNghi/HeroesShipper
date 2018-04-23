import React, { Component } from 'react';
import { Switch, Alert, AsyncStorage } from 'react-native';
import { Header, Body, Title, Left, Button, Icon, Right } from 'native-base';
import styles from './styles';


class HeaderForHome extends Component {
    constructor(props) {
        super(props);
        this.state = { online: true };
        this.isOnline();
    }


    componentWillReceiveProps(nextProps) {
        if (nextProps.isOnlineError !== this.props.isOnlineError) {
            this.setState({ online: !this.state.online });
            Alert.alert('Unable to switch mode! Please try again.');
        }
    }

    onCheckStatus() {
        if (this.props.pickedPackageList.length > 0 || this.props.deliveringPackageList.length > 0) {
            Alert.alert('You can not switch to offline mode because you still have packages to deliver!');
        } else {
            if (this.state.online) {
                Alert.alert('You are offline');
            } else {
                Alert.alert('You are online');
            }
            this.setState({ online: !this.state.online });
            this.props.isOnline();
        }
    }

    isOnline = () => {
        console.log(1);
        AsyncStorage.getItem('is_online', (error, result) => {
            if (result !== '1') {
                this.setState({ online: false });
            } else {
                this.setState({ online: true });
            }
        });
    }

    drawerOpen = () => {
        if (!this.props.nodrawer) {
            this.props.navigation.navigate('DrawerOpen');
        } else { 
            console.log('No drawer');
        }
    }
    render() {
        return (
            <Header style={{ backgroundColor: '#ff5e3a' }} iosBarStyle="light-content">
                <Left>
                    <Button transparent onPress={() => this.drawerOpen()}>
                        <Icon name="ios-menu" style={styles.icon} /> 
                    </Button>
                </Left>
                <Body>
                    <Title style={styles.headerTextStyle}>{this.props.headerText}</Title>
                </Body>
                <Right>
                    <Switch value={this.state.online} style={{ transform: [{ scaleX: .6 }, { scaleY: .6 }] }} 
                            onValueChange={() => this.onCheckStatus()}
                    />
                </Right>
            </Header>
        );
    }
}

export { HeaderForHome };


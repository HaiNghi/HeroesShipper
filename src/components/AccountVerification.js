import React, { Component } from 'react';
import { Image } from 'react-native';
import { Container, View, Text, Button, Input, Item } from 'native-base';
import { HeaderBase } from './common';
import { AccountValidation, LoginFormStyle, RegisterStyle } from './styles';
/* eslint-disable global-require */

class AccountVerification extends Component {
    render() {
        return (
            <Container >
                <HeaderBase 
                    headerText="Account Verification"
                    left={true}
                    previousPage="Register"
                    navigation={this.props.navigation}
                />
                <View style={LoginFormStyle.secondBodyStyle}>
                    <View style={{ alignItems: 'center' }} >
                        <Image 
                            source={require('./image/sms-message-2.png')} 
                            style={AccountValidation.imageValidation}
                        />
                        <Text style={[LoginFormStyle.textStyle, { margin: 20 }]}>Mobile Verification</Text>
                        <Text style={[RegisterStyle.textStyle, { color: 'black', fontSize: 16 }]}>We have sent you a code on your mobile number. Please enter it below to verify.</Text>
                    </View>
                    <View style={AccountValidation.viewDirection}>
                        <Item regular style={AccountValidation.inputWrapperValidation}>
                            <Input placeholder='Regular Textbox' />
                        </Item>
                        <Button onPress={() => this.onSubmit()} style={AccountValidation.buttonValidation}><Text>SUBMIT</Text></Button>
                    </View>
                </View>
            </Container>
        );
    }
}
export default AccountVerification;

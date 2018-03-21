import React, { Component } from 'react';
import { Container, View, Text, Button } from 'native-base';
import CodeInput from 'react-native-confirmation-code-input';
import { HeaderBase } from './common';
import { LoginFormStyle, RegisterStyle } from './styles';
/* eslint-disable global-require */

class ReceivingPackageVerification extends Component {
    render() {
        return (
            <Container >
                <HeaderBase 
                    headerText="RECEIVING PACKAGE CONFIRMATION"
                    navigation={this.props.navigation}
                />
                <View style={[LoginFormStyle.secondBodyStyle]}>
                    <View style={{ alignItems: 'center', height: 250 }} >
                        <Text style={[LoginFormStyle.textStyle, { marginTop: 20, fontSize: 30, marginBottom: 20 }]}>Package Confirmation</Text>
                        <Text style={[RegisterStyle.textStyle, { color: '#000', fontSize: 16, margin: 20 }]}>Enter your OTP code to confirm .</Text>
                        <CodeInput
                                ref="codeInputRef2"
                                keyboardType="numeric"
                                codeLength={4}
                                compareWithCode='1234'
                                autoFocus={false}
                                inactiveColor='#000000'
                                activeColor='#ff5e3a'
                                size={60}
                                cellBorderWidth={2}
                                codeInputStyle={{ fontWeight: '800' }}
                                onFulfill={() => console.log('OK')}
                        />
                    </View>
                    <Button full transparent onPress={() => this.props.navigation.navigate('CameraScreen')}><Text>Scan QR code</Text></Button>
                  
                </View>
            </Container>
        );
    }
}
export default ReceivingPackageVerification;

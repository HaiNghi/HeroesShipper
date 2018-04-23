import React, { Component } from 'react';
import { Container, View, Text, Button } from 'native-base';
import CodeInput from 'react-native-confirmation-code-input';
import Modal from 'react-native-modal';
import { HeaderBase, Spinner, Modals } from './common';
import { LoginFormStyle, RegisterStyle } from './styles';
/* eslint-disable global-require */

class ReceivingPackageVerification extends Component {
    onCheckCode = (code) => {
        this.props.waitForCheck();
        if (this.props.navigation.state.params.status === 'receive_from_po') {
            this.props.verifyCodeForReceivingPackage(code, this.props.navigation.state.params.packageId);
        } else {
            this.props.verifyCodeForDeliveringSuccess(code, this.props.navigation.state.params.packageId);
        }
    }
    onDismiss = () => {
        this.props.disableModal();
        this.props.navigation.state.params.updateDirectionButton();
        this.props.navigation.goBack(null);
        // this.props.navigation.navigate('Home');
    }
    render() {
        return (
            <Container >
                <HeaderBase 
                    headerText="PACKAGE CONFIRMATION"
                    navigation={this.props.navigation}
                />
                <View style={[LoginFormStyle.secondBodyStyle]}>
                    <View style={{ alignItems: 'center', height: 250 }} >
                        <Text style={[LoginFormStyle.textStyle, { marginTop: 20, fontSize: 30, marginBottom: 20 }]}>Package Confirmation</Text>
                        {
                            (this.props.navigation.state.params.status === 'receive_from_po') ?
                                <Text style={[RegisterStyle.textStyle, { color: '#000', fontSize: 16, margin: 20 }]}>Enter Package Owner's code to confirm .</Text>
                            :
                                <Text style={[RegisterStyle.textStyle, { color: '#000', fontSize: 16, margin: 20 }]}>Enter verified code that we sent to Receiver to confirm .</Text>
                        }
                        
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
                                onFulfill={(isvalid, code) => this.onCheckCode(code)}
                        />
                    </View>
                    {/* <Button full transparent onPress={() => this.props.navigation.navigate('CameraScreen')}><Text>Scan QR code</Text></Button> */}
                    <Modal isVisible={this.props.loading}>
                            <Spinner />
                    </Modal>
                    
                    <Modals 
                        isVisible={this.props.fail}
                        title='Verify failed!' 
                        subtitle={this.props.message}
                        onPress={() => this.props.disableModal()}
                    />
                    <Modals 
                        isVisible={this.props.success}
                        title='Verify successfully!' 
                        subtitle={this.props.message}
                        onPress={() => this.onDismiss()}
                    />
                   
                </View>
            </Container>
        );
    }
}
export default ReceivingPackageVerification;

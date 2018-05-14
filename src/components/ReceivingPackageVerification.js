import React, { Component } from 'react';
import { Container, View, Text, Card, CardItem, Left, Body, Content } from 'native-base';
import CodeInput from 'react-native-confirmation-code-input';
import Modal from 'react-native-modal';
import { HeaderBase, Spinner, Modals } from './common';
import { LoginFormStyle, RegisterStyle, styles } from './styles';
/* eslint-disable global-require */

class ReceivingPackageVerification extends Component {
    componentDidMount() {
        this.props.deleteData();
        this.props.navigation.state.params.updateConfirmation();
    }
    onCheckCode = (code) => {
        this.props.waitForCheck();
        if (this.props.navigation.state.params.status === 'receive_from_po') {
            this.props.verifyCodeForReceivingPackage(code, this.props.navigation.state.params.packageInfo.id);
        } else {
            this.props.verifyCodeForDeliveringSuccess(code, this.props.navigation.state.params.packageInfo.id);
        }
    }
    onDismiss = () => {
        this.props.disableModal();
        this.props.navigation.state.params.updateDirectionButton();
        this.props.navigation.state.params.updateConfirmation();
        this.props.navigation.goBack(null);
    }
    render() {
        const { packageInfo } = this.props.navigation.state.params;
        let size = null;
        if (packageInfo.size) {
            size = JSON.parse(packageInfo.size);
        }
        return (
            <Container >
                <HeaderBase 
                    headerText="CONFIRMATION"
                    navigation={this.props.navigation}
                />
                <Content>
                    <Card style={{ marginTop: 20 }}>
                        <Text style={styles.labelStyle}>PACKAGE INFO</Text>
                        <CardItem>
                            <Left>
                                <Body>
                                    <Text style={{ marginBottom: 10 }}>Sender: {packageInfo.user.first_name} {packageInfo.user.last_name} - {packageInfo.user.phone}</Text>
                                    <Text style={{ marginBottom: 10 }}>Receiver: {packageInfo.receiver_name} - {packageInfo.receiver_phone}</Text>
                                    <Text style={{ marginBottom: 10 }}>Destination: {packageInfo.destination_address}</Text>
                                    <Text style={{ marginBottom: 10 }}>Package type: {packageInfo.package_type.name}</Text>
                                    {
                                        (packageInfo.size) &&
                                            <Text style={{ marginBottom: 10 }}>Size: H: {size.height}, W: {size.width}, L: {size.length}</Text>
                                    }
                                    <Text>Earnings: {packageInfo.price} VND</Text>
                                </Body>
                            </Left>
                        </CardItem>
                    </Card>
                    <Card style={{ marginTop: 20 }}>
                        <Text style={styles.labelStyle}>PACKAGE CONFIRMATION</Text>
                        <CardItem>
                            <Left>
                                <Body>
                                    <View style={{ alignItems: 'center' }} >
                                        
                                        {
                                            (this.props.navigation.state.params.status === 'receive_from_po') ?
                                                <Text style={[RegisterStyle.textStyle, { color: '#000', fontSize: 16, margin: 10 }]}>Enter Package Owner's code to confirm .</Text>
                                            :
                                                <Text style={[RegisterStyle.textStyle, { color: '#000', fontSize: 16, margin: 10 }]}>Enter verified code that we sent to Receiver to confirm .</Text>
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
                                </Body>
                            </Left>
                        </CardItem>
                    </Card>
                </Content>
               
                <View style={[LoginFormStyle.secondBodyStyle]}>
                {/* <View style={{ marginTop: 30, borderWidth: 1, borderRadius: 7, padding: 10 }}>
                        <Text style={{ marginBottom: 10 }}>Sender: </Text>
                        <Text style={{ marginBottom: 10 }}>Receiver: </Text>
                        <Text style={{ marginBottom: 10 }}>Package type: {packageInfo.package_type}</Text>
                        {
                            (packageInfo.size) &&
                                <Text style={{ marginBottom: 10 }}>Size: H: {packageInfo.size.height}, W: {packageInfo.size.weight}, L: {packageInfo.size.length}</Text>
                        }
                        <Text>Earnings: {packageInfo.price} VND</Text>
                    </View> */}
                    
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

import React, { Component } from 'react';
import { View, Text } from 'react-native';
import QRCodeScanner from 'react-native-qrcode-scanner';
import { HeaderBase } from './common';

export default class CameraScreen extends Component {
    constructor(props) {
        super(props);
        this.scanner = null;
    }
    onScan = (e) => {
        alert('QR scanned');
        // this.scanner.reactivate();
    }
  render() {
    return (
        <View style={{ flex: 1 }}>
            <HeaderBase 
                headerText='QR CODE CONFIRMATION' 
                navigation={this.props.navigation} 
                left
                previousPage='ReceivingPackageVerification'
            />
            <QRCodeScanner
                ref={(node) => { this.scanner = node; }}
                containerStyle={{ backgroundColor: '#000' }}
                onRead={(e) => this.onScan(e)}
                reactivate
                reactivateTimeout={3}
                topContent={(
                    <Text>
                        Please scan QR code of package we sent you to confirm.
                    </Text>
                )}
            />
        </View>
    
    );
  }
}

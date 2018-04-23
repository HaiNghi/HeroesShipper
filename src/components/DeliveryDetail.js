import React, { Component } from 'react';
import { Image, AsyncStorage, Alert } from 'react-native';
import { Container, View, Text, Left, Right } from 'native-base';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import Modal from 'react-native-modal';
import { HeaderBase, Spinner, SubmitButton, Modals } from './common';
import { DeliveryDetailStyle, styles } from './styles';
/* eslint-disable global-require */
let user = [];
class DeliveryDetail extends Component {
    constructor(props) {
        super(props);
        this.state = { showModal: false };
        AsyncStorage.getItem('user_info', (error, result) => {
            user = JSON.parse(result);
        });
    }
    componentDidMount() {
        this.props.deleteData();
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.error !== this.props.error && nextProps.error) {
            this.setState({ showModal: true });
        }
        if (nextProps.route !== this.props.route) {
            this.setState({ showSpinner: false });
            this.props.navigation.state.params.updateDirectionButton();
            this.onDismiss();
        }
    }
    onChoosePackage = (packageId) => {
        const { numberOfPackage } = this.props.navigation.state.params;
            if (user.is_online !== 1) Alert.alert('You cannot pick up a new package since you are in offline mode'); 
            else {
                if ((user.rating > 3 && numberOfPackage < 4) || (user.rating < 4 && numberOfPackage < 3)) {
                    this.props.waitForCheck();
                    this.props.choosePackage(packageId);
                } else {
                    Alert.alert('You reached your maximum packages!');
                }
            }
    }

    onDismiss() {
        // this.props.navigation.state.params.updateRoute();
        this.props.navigation.goBack(null);
    }
    render() {
        const { packageDetail, status } = this.props.navigation.state.params;
        let packageObj = null;
        if (packageDetail.package_type.optional_package === 1) {
            packageObj = JSON.parse(packageDetail.size);
        }
        return (
            <Container >
                <HeaderBase headerText='PACKAGE INFORMATION' navigation={this.props.navigation} />
                <Container>
                    <View style={DeliveryDetailStyle.mapContainer}>
                        <MapView 
                            style={DeliveryDetailStyle.map}
                            provider={PROVIDER_GOOGLE}
                            region={this.props.navigation.state.params.currentLocation}
                        />
                    </View>
                    <View style={DeliveryDetailStyle.viewContainer} >
                        <View style={DeliveryDetailStyle.innerWrapper}>
                            <Left style={[DeliveryDetailStyle.contentPosition, { marginRight: 5 }]}>
                                <Text style={[DeliveryDetailStyle.textStyle, { margin: 5, fontSize: 20 }]}>SENDER</Text>
                                <Text style={[DeliveryDetailStyle.textStyle]}>{packageDetail.user.first_name}</Text>
                                <Text style={DeliveryDetailStyle.textStyle}>{packageDetail.pickup_location_address}</Text>
                            </Left>
                            <Right style={[DeliveryDetailStyle.contentPosition, { marginLeft: 5 }]}>
                                <Text style={[DeliveryDetailStyle.textStyle, { margin: 5, fontSize: 20 }]}>RECEIVER</Text>
                                <Text style={DeliveryDetailStyle.textStyle}>{packageDetail.receiver_name}</Text>
                                <Text style={DeliveryDetailStyle.textStyle}>{packageDetail.destination_address}</Text>
                            </Right>
                        </View>
                        <View style={[DeliveryDetailStyle.innerWrapper, { flexDirection: 'column' }]}>
                            <Image source={require('./image/delivery-man-2.png')} style={{ alignSelf: 'center' }} />
                            <View style={{ borderWidth: 1, borderColor: '#fff', borderRadius: 7, padding: 10 }}>
                            {
                                    (packageDetail.package_type.optional_package === 1) ? (
                                        
                                        <View>
                                            <Text style={{ color: '#fff', fontWeight: 'bold', marginBottom: 5 }}>Size: length: {packageObj.length}, width: {packageObj.width}, height: {packageObj.height}</Text>
                                        </View>
                                        
                                    ) : (
                                        <Text style={{ color: '#fff', fontWeight: 'bold' }}>Type: {packageDetail.package_type.name} </Text>
                                    )
                                        
                                }
                                <Text style={{ color: '#fff', fontWeight: 'bold' }}>Distance: {packageDetail.distance} KM</Text>
                                <Text style={{ color: '#fff', fontWeight: 'bold' }}>Price: {packageDetail.price} VND</Text>
                            </View>
                        </View>
                        <View style={DeliveryDetailStyle.submitButton}>
                        {
                            (status === 1) &&
                            <SubmitButton 
                                onPress={() => this.onChoosePackage(packageDetail.id)} 
                                style={{ backgroundColor: '#48A814' }}
                            >
                                PICK
                            </SubmitButton>
                        }
                        {/* { 
                            (status === 2) &&
                            <SubmitButton 
                                onPress={() => console.log('ABC')} 
                                style={{ backgroundColor: '#48A814' }}
                            >
                                RECEIVE PACKAGE
                            </SubmitButton>
                        } */}
                        </View>
                    </View>
                    <Modal isVisible={this.props.loading} >
                        <View style={styles.spinnerContainer}>
                            <Spinner />
                        </View>
                    </Modal>
                    <Modals 
                        isVisible={this.state.showModal}
                        title='This package has been picked up!'
                        subtitle='Please choose the other packages'
                        onPress={() => { this.setState({ showModal: false }); this.props.navigation.navigate.goBack(); }}
                    />
                </Container>
            </Container>
        );
    }
}
export default DeliveryDetail;

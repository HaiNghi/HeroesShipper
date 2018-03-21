import React, { Component } from 'react';
import { View, Alert, Image, ScrollView } from 'react-native';
import { Text, Button, List, ListItem, Icon } from 'native-base'; 
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import PushNotification from 'react-native-push-notification';
import Modal from 'react-native-modal';
import firebase from 'firebase';
import SearchBox from '../SearchBox';
import SearchResult from '../SearchResults';
import { SubmitButton, Spinner } from '../common';
import styles from './MapContainerStyle';
import { pushNotifications } from '../../notificationService';


pushNotifications.configure();
/* eslint-disable global-require */

class MapContainer extends Component {
        constructor(props) {
            super(props);
            this.state = { 
                showWarningModal: false, 
                showSpinner: false, 
                status: '',
                packageId: '',
                showDetailPackageList: false,
                showButton: false
            };
            this.mapRef = null;
        }
        componentDidMount() {
           this.pushNotification();
        }
        
        componentWillReceiveProps(nextProps) {
            if (nextProps.loading) {
                this.setState({ showSpinner: false });
                this.props.navigation.navigate('DeliveryDetail', 
                    {
                        currentLocation: this.props.region, 
                        packageDetail: nextProps.packageDetail,
                        status: this.state.status
                    }
                );
            }
        }
        onDecline = () => {
            this.setState({ showWarningModal: false });
        }
        onMarkerPressed = (marker, item) => {
            setTimeout(() => // sadly, we need timeout to make this command run in next cycle, after map updates.
                this[marker].showCallout()
                , 0);
                // });
            this.setState({ packageId: item.id });
            (item.status === 2) ? this.setState({ showButton: true }) : this.setState({ showButton: false }); 
        }

        onConfirm = () => {
            if (this.state.packageId === '') {
                Alert.alert(
                    'You haven\' t choose any package yet!',
                    null,
                    [
                      { text: 'DISMISS', onPress: () => console.log('Ask me later pressed') },
                    ],
                );
            } else {
                Alert.alert(
                    `Are you sure you already took the package number ${this.state.packageId}`,
                    null,
                    [
                      { text: 'YES', onPress: () => this.setState({ packageId: '' }) },
                      { text: 'NO', onPress: () => this.setState({ packageId: '' }), style: 'cancel' },
                    ],
                  
                  );
            }
        }

        pushNotification = () => {
            let newPackage = '';
            const array = [];
            console.log(array);
            firebase.database().ref('package/available/')
            .on('child_added', (snapshot) => {
                newPackage = snapshot.val();
                array.push(newPackage);
                console.log(array);

                // PushNotification.localNotificationSchedule({
                //     message: `New package s${newPackage.id} has been registered!`, 
                //     date: new Date(Date.now() + (3 * 1000)), 
                //     userInfo: { id: `${newPackage.id}` }
                // });
                PushNotification.localNotification({
                    title: `New package ${newPackage.id} has been registered!`,
                    message: `Destination: ${newPackage.destination_address}`,
                    playSound: true,
                    soundName: 'default',
                    userInfo: { id: `${newPackage.id}` }
                });
            });
            firebase.database().ref('package/available/')
            .on('child_removed', (snapshot1) => {
                const pickedUpPackage = snapshot1.val();
                console.log(pickedUpPackage.id);
                for (let i = 0; i < array.length; i++) {
                    if (pickedUpPackage.id === array[i].id) {
                        PushNotification.cancelLocalNotifications({ id: `${pickedUpPackage.id}` });
                        array.slice(i, 1);
                    }
                }
          });
        }

        handleMarkerPress = (packageId, packageStatus) => {
            // const markerID = event.nativeEvent.id;
            this.setState({ showSpinner: true }, function () {
                this.setState({ status: packageStatus });
            });
            this.props.getPackageDetail(packageId);
        }
        handlePress() {
            console.log(1212);
            pushNotifications.localNotification();
        }
        renderCallout = (item) => {
            return (
              <MapView.Callout tooltip onPress={() => this.handleMarkerPress(item.id, item.status)}>
                <View style={styles.mapCallOut}>
                    <Text style={{ fontSize: 12 }}><Text style={styles.labelStyle}>Destination:</Text> {item.destination_address}</Text>
                    <Text style={{ fontSize: 12 }}><Text style={styles.labelStyle}>Price:</Text> {item.price} VND</Text>
                    <Text style={{ fontSize: 12 }}><Text style={styles.labelStyle}>Distance:</Text> {item.distance} Km</Text>
                </View>
              </MapView.Callout>
            );
        }
       
        render() {
            const {
                region, 
                // toogleSearchResult, 
                // getAddressPredictions, 
                // resultTypes, 
                // predictions,
                // getSelectedAddress,
                // getPickUp,
                // pickUp,
                // deleteResultAddress,
                // showDropOff,
                changeRegion,
                } = this.props;
            return (
                <View style={styles.container}>
                    <MapView
                        provider={PROVIDER_GOOGLE}
                        style={styles.map}
                         region={{
                            latitude: region.latitude,
                            longitude: region.longitude,
                            latitudeDelta: region.latitudeDelta,
                            longitudeDelta: region.longitudeDelta
                        }}  
                        onRegionChangeComplete={item => changeRegion(item)}
                        showsUserLocation
                    >
                    {/* <MapView.Marker 
                        coordinate={region}
                        pinColor='red' 
                        identifier={'1'}
                    /> */}

                    {
                        this.props.packageList.map((item) => {
                            return (
                                <MapView.Marker 
                                    coordinate={{
                                        latitude: item.latitude,
                                        longitude: item.longitude
                                    }}
                                    image={require('../image/package-marker.png')}
                                    identifier={`${item.id}`}
                                    key={item.id}
                                    onPress={() => this.onMarkerPressed(`marker + ${item.id}`, item)}
                                    ref={(c) => { this[`marker + ${item.id}`] = c; }}
                                >
                                {this.renderCallout(item)}
                                </MapView.Marker>
                            );
                        })
                    }

                    {
                        this.props.chosenPackageList.map((item) => {
                            return (
                                <MapView.Marker 
                                    coordinate={{
                                        latitude: item.latitude,
                                        longitude: item.longitude
                                    }}
                                    image={require('../image/package-checked.png')}
                                    identifier={`${item.id}`}
                                    key={item.id}
                                    onPress={() => this.onMarkerPressed(`marker + ${item.id}`, item)}
                                    ref={(c) => { this[`marker + ${item.id}`] = c; }}
                                >
                                {this.renderCallout(item)}
                                </MapView.Marker>
                            );
                        })
                    }

                    </MapView>
        
                    {/* <SearchBox 
                        toogleSearchResult={toogleSearchResult} 
                        getAddressPredictions={getAddressPredictions} 
                        region={region}
                        getPickUp={getPickUp}
                        pickUp={pickUp}
                        deleteResultAddress={deleteResultAddress}
                        showDropOf={showDropOff}
                    />
                        
                    { (resultTypes.pickUp) &&
                        <SearchResult 
                            predictions={predictions} getSelectedAddress={getSelectedAddress}
                        />
                    } */}
                  {
                      (this.state.showButton) &&
                        /* <SubmitButton onPress={() => this.onConfirm()}> */
                        <SubmitButton onPress={() => this.props.navigation.navigate('ReceivingPackageVerification')}> 
                            RECEIVE PACKAGE
                        </SubmitButton>
                  }
                    <View style={styles.buttonWrapper} >
                        <Button iconLeft rounded success style={{ marginLeft: 10 }} onPress={() => this.setState({ showDetailPackageList: true })}>
                            <Image source={require('../image/deliver.png')} style={[styles.buttonModal, { marginLeft: 8 }]} />
                            <Text style={{ fontWeight: 'bold', fontSize: 18 }}>{this.props.chosenPackageList.length}</Text>
                        </Button>
                    </View>
                  
                
                    <Modal isVisible={this.state.showDetailPackageList} style={styles.modalStyle}>
                        <View style={{ flexWrap: 'wrap' }}>
                            <ScrollView style={{ backgroundColor: '#fff', height: 400 }}>
                                <List>
                                    <ListItem itemHeader first style={{ backgroundColor: '#d3d3d3' }}>
                                        <Text>ACCEPTED</Text>
                                    </ListItem>
                                    {
                                        this.props.chosenPackageList.map((item) => {
                                            return (
                                                <ListItem key={item.id}>
                                                    <Image source={require('../image/package-checked.png')} style={styles.buttonModal} />
                                                    <Text >{item.destination_address}</Text>
                                                </ListItem>
                                            );
                                        })
                                    }
                                </List>
                                <List>
                                    <ListItem itemHeader style={{ backgroundColor: '#d3d3d3' }}>
                                        <Text>DELIVERING</Text>
                                    </ListItem>
                                    
                                </List>
                            </ScrollView>
                            <Button transparent full onPress={() => this.setState({ showDetailPackageList: false })}>
                                <Icon 
                                    name="ios-arrow-dropdown-outline" 
                                    style={{ fontSize: 50, marginTop: 10, justifyContent: 'center', color: '#fff' }} 
                                />
                            </Button>
                        </View>
                    </Modal>
                    
                    <Modal isVisible={this.state.showSpinner} >
                        <View style={styles.spinnerContainer}>
                            <Spinner />
                        </View>
                    </Modal>
                </View> 
            );
        }
}
    
export default MapContainer;

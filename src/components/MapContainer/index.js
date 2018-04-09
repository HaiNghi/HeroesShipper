import React, { Component } from 'react';
import { View, Alert, Image, ScrollView, Dimensions, AsyncStorage } from 'react-native';
import { Text, Button, List, ListItem, Icon } from 'native-base'; 
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import polyline from '@mapbox/polyline';
import PushNotification from 'react-native-push-notification';
import Modal from 'react-native-modal';
import CircleButton from 'react-native-circle-button';
import firebase from 'firebase';
import axios from 'axios';
// import SearchBox from '../SearchBox';
// import SearchResult from '../SearchResults';
import { SubmitButton, Spinner } from '../common';
import styles from './MapContainerStyle';
import { pushNotifications } from '../../notificationService';

/* eslint-disable global-require */
let user = [];
AsyncStorage.getItem('user_info', (error, result) => {
        user = JSON.parse(result);
});
const GOOGLE_MAPS_APIKEY = 'AIzaSyBSw2SzeTbROHDQHohGL-5_tfKE52EoZUc';
pushNotifications.configure();
const { width, height } = Dimensions.get('window');
const ASPECT_RATION = width / height;
const LATITUDEDELTA = 0.02;
const LONGTITUDEDELTA = ASPECT_RATION * LATITUDEDELTA;

class MapContainer extends Component {
        constructor(props) {
            super(props);
            this.state = { 
                showWarningModal: false, 
                showSpinner: false, 
                status: '',
                packageId: '',
                showDetailPackageList: false,
                showButton: false,
                currentLocation: {
                    latitude: 0,
                    longitude: 0,
                    latitudeDelta: 0,
                    longitudeDelta: 0
                },
                id: '',
                coords: [],
                directionButton: true
            };
            this.mapRef = null;
        }
        componentDidMount = () => {
            this.pushNotification();
        //    this.renderRoute();
           navigator.geolocation.getCurrentPosition(
            (position) => {
                this.setState({ currentLocation: {
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                    latitudeDelta: LATITUDEDELTA,
                    longitudeDelta: LONGTITUDEDELTA
                } }); 
            },
            (error) => console.log(error.message),
            {
                enableHighAccurancy: true, timeout: 30000, maximumAge: 1000 }
            );
            this.watchID = navigator.geolocation.watchPosition(this.getLocationSuccess,
            {
                enableHighAccurancy: true, timeout: 20000, maximumAge: 1000, distanceFilter: 30 }
            );
        }
        // update mapview when shipper is moving
        getLocationSuccess = (position) => {
            this.props.updateCurrentLocation(user.shipper_id, position.coords.latitude, position.coords.longitude);
            this.props.changeRegion(position.coords, 'watchPosition');
        }
        // get shortest route between 2 coordinates
        getShortestRouteDirections = (startLoc, destinationLoc) => {
            axios.get(`https://maps.googleapis.com/maps/api/directions/json?origin=${startLoc}&destination=${destinationLoc}&mode=bicyling&key=${GOOGLE_MAPS_APIKEY}`)
            .then((response) => {
                console.log(response);
                const points = polyline.decode(response.data.routes[0].overview_polyline.points);
                console.log(points);
                const coords = points.map((point) => {
                    return {
                        latitude: point[0],
                        longitude: point[1]
                    };
                });
                console.log(coords);
                const newCoordsArray = [...this.state.coords, coords];
                this.setState({ coords: newCoordsArray });
            })
            .catch((error) => {
                Alert.alert(error);
            });
        }
        pushNotification = () => {
            let newPackage = '';
            const array = [];
            console.log(array);
            firebase.database().ref('package/available/')
            .on('child_added', (snapshot) => {
                newPackage = snapshot.val();
                console.log(array);
                if (user.rating > 3) {
                    PushNotification.localNotification({
                        alertAction: 'DetailPackage',
                        title: `New package ${newPackage.id} has been registered!`,
                        message: `Destination: ${newPackage.destination_address}`,
                        playSound: true,
                        soundName: 'default',
                        userInfo: { id: `${newPackage.id}` }
                    });
                }
                if (user.rating <= 3) {
                    array.push(newPackage);
                    PushNotification.localNotificationSchedule({
                            message: `New package s${newPackage.id} has been registered!`, 
                            date: new Date(Date.now() + (20 * 1000)), 
                            userInfo: { id: `${newPackage.id}` }
                    });
                }
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
       
        componentWillReceiveProps = (nextProps) => { 
            if (nextProps.loading) {
                this.setState({ showSpinner: false });
                this.props.navigation.navigate('DeliveryDetail', 
                    {
                        currentLocation: this.props.region, 
                        packageDetail: nextProps.packageDetail,
                        status: this.state.status,
                        updateDirectionButton: this.onUpdateDirectionButton.bind(this)
                    }
                );
            }
            if (nextProps.route.length > 0 && nextProps.route !== this.props.route) {
                console.log(nextProps.route);
                console.log('1');
                this.renderRoute(nextProps.route);
            }
        }
        componentWillUnmount = () => {
            navigator.geolocation.clearWatch(this.watchID);
        }
        // show callout of that marker
        onMarkerPressed = (marker, item) => {
            setTimeout(() => 
                this[marker].showCallout()
                , 0);
                // });
            this.setState({ packageId: item.id });
            (item.status === 2) ? this.setState({ showButton: true }) : this.setState({ showButton: false }); 
        }
        
        // get package's information
        handleMarkerPress = (packageId, packageStatus) => {
            // const markerID = event.nativeEvent.id;
            this.setState({ showSpinner: true }, function () {
                this.setState({ status: packageStatus });
            });
            this.props.getPackageDetail(packageId);
        }
        handlePress = () => {
            console.log(1212);
            pushNotifications.localNotification();
        }
        onChangeRegion = (item, type) => {
            this.props.changeRegion(item, type);
        }
        onCheckCode = (packageId) => {
            this.setState({ showDetailPackageList: false });
            this.props.navigation.navigate('ReceivingPackageVerification', { packageId, status: 'send_to_rc', updateDirectionButton: this.onUpdateDirectionButton.bind(this) });
        }
        showDetailPackageList = () => {
            AsyncStorage.getItem('user_info', (error, result) => {
                this.setState({ id: JSON.parse(result).shipper_id });
            });
            if (this.props.pickedPackageList.length === 0 && this.props.deliveringPackageList.length === 0) {
                Alert.alert('No trips to show! ');
            } 
            if (this.props.pickedPackageList.length < 2 && this.props.deliveringPackageList.length === 0) {
                    this.props.pickedPackageList.map((item) => 
                        this.props.navigation.navigate('ReceivingPackageVerification', { packageId: item.id, status: 'receive_from_po' })
                    );
            } else {
                    this.setState({ showDetailPackageList: true });
            }
        }
        
        onReceivePackage = () => {
            this.setState({ showButton: false });
            this.props.navigation.navigate('ReceivingPackageVerification', { packageId: this.state.packageId, status: 'receive_from_po' });
        }
        onReceivePackageByList = (packageId) => {
            this.setState({ showDetailPackageList: false });
            this.props.navigation.navigate('ReceivingPackageVerification', { packageId, status: 'receive_from_po' });
        }
        onVerifyCodeForDeliveringSuccess = (packageId, status) => {
            if (status === 3) {
                this.onCheckCode(packageId);
            } else {
                Alert.alert('You have not received the package from Package Owner yet !');
            }
        }
        findShortestRoute = () => {
            if (this.props.pickedPackageList.length > 0 || this.props.deliveringPackageList.length > 0) {
                this.setState({ coords: [] });
                this.setState({ directionButton: false });
                this.props.findShortestRoute();
            }
        }
        renderCallout = (item) => {
            return (
              <MapView.Callout tooltip onPress={() => this.handleMarkerPress(item.id, item.status)}>
                <View style={styles.mapCallOut}>
                    <Text style={{ fontSize: 12 }}><Text style={styles.labelStyle}>Destination:</Text> {item.destination_address}</Text>
                    <Text style={{ fontSize: 12 }}><Text style={styles.labelStyle}>Earnings:</Text> {item.price} VND</Text>
                    <Text style={{ fontSize: 12 }}><Text style={styles.labelStyle}>Distance:</Text> {item.distance} Km</Text>
                </View>
              </MapView.Callout>
            );
        }
         // get 2 locations ' coordinates to map
        renderRoute(route) {
            console.log(route);
            let i = 0;
                for (i = 0; i < route.length; i++) {
                    if (i === route.length - 1) {
                        break;
                    } else {
                        this.getShortestRouteDirections(route[i], route[i + 1]);
                    }
                }
        }
        // change directionButton 's state
        onUpdateDirectionButton = () => {
            if (this.props.pickedPackageList.length > 0 || this.props.deliveringPackageList.length > 0) {
                this.setState({ directionButton: true });
            } else {
                this.setState({ coords: [] });
                this.setState({ directionButton: false });
            }
        }
        render() {
            const {
                region, 
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
                        onRegionChangeComplete={(item) => changeRegion(item, 'changeRegion')}
                        showsUserLocation
                        followsUserLocation
                    >

                    {
                        this.props.packageList.map((item) => {
                            return (
                                <MapView.Marker 
                                    coordinate={{
                                        latitude: item.pickup_latitude,
                                        longitude: item.pickup_longitude
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
                                        latitude: item.pickup_latitude,
                                        longitude: item.pickup_longitude
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

                    {
                        this.props.pickedPackageDestinationList.map((item) => {
                            return (
                                <MapView.Marker 
                                    coordinate={{
                                        latitude: item.destination_latitude,
                                        longitude: item.destination_longitude
                                    }}
                                    image={require('../image/flag.png')}
                                    /* identifier={`${item.id}`} */
                                    key={item.id}
                                    onPress={() => this.onVerifyCodeForDeliveringSuccess(item.id, item.status)}
                                    /* onPress={() => this.onMarkerPressed(`marker + ${item.id}`, item)} */
                                    /* ref={(c) => { this[`marker + ${item.id}`] = c; }} */
                                >
                                {this.renderCallout(item)}
                                </MapView.Marker>
                            );
                        })
                    }

                    {
                        this.state.coords.map((coords, index) => {
                            return (
                                <MapView.Polyline
                                index={index}
                                coordinates={coords}
                                strokeWidth={5}
                                strokeColor="blue"
                                key={index}
                                />
                            );
                        })
                    }

                    </MapView>
                    <View style={{ flex: 4 / 5, top: 15, position: 'absolute', flexDirection: 'row', alignSelf: 'flex-end', marginRight: 10}}>
                    {
                        (this.state.directionButton) ?
                            <Button transparent onPress={() => this.findShortestRoute()}>
                                <Image source={require('../image/turn-right-sign.png')} style={{ width: 50, height: 50 }} />
                            </Button>
                        :
                            <Button disabled transparent>
                                <Image source={require('../image/turn-right-sign-disable.png')} style={{ width: 50, height: 50 }} />
                            </Button>
                    }
                    </View>
                    <View style={styles.buttonWrapper} >
                        <Button 
                            /* iconLeft  */
                            rounded 
                            success 
                            onPress={() => this.showDetailPackageList()}
                            style={{ backgroundColor: '#ff5a3e' }}
                        >
                            {/* <Image source={require('../image/deliver.png')} style={styles.buttonModal} /> */}
                            
                            {
                                (this.props.pickedPackageList.length > 1) ?
                                    <Text style={{ textAlign: 'center', padding: 10, fontSize: 16 }}>RECEIVE <Text style={{ fontWeight: 'bold', fontSize: 22 }}>{this.props.pickedPackageList.length}</Text> PACKAGES</Text> 
                                :
                                    <Text style={{ textAlign: 'center', padding: 10, fontSize: 16 }}>RECEIVE <Text style={{ fontWeight: 'bold', fontSize: 22 }}>{this.props.pickedPackageList.length}</Text> PACKAGE</Text>
                            }
                            
                        </Button>
                        {/* <CircleButton size={45} onPress={() => alert('OK')} /> */}
                    </View>
                    <Modal isVisible={this.state.showDetailPackageList} style={styles.modalStyle}>
                        <View style={{ flexWrap: 'wrap', flex: 4 / 5 }}>
                            <ScrollView 
                                        style={{ backgroundColor: '#fff' }}
                                        automaticallyAdjustContentInsets={false}
                            >
                                <List>
                                    {
                                        (this.props.pickedPackageList.length > 0) &&
                                        <ListItem itemHeader first style={{ backgroundColor: '#d3d3d3' }}>
                                            <Text>PICKED</Text>
                                        </ListItem>
                                    }
                                   
                                    {
                                        this.props.pickedPackageList.map((item) => {
                                            return (
                                                <ListItem 
                                                    key={item.id}
                                                    onPress={() => this.onReceivePackageByList(item.id)}
                                                >
                                                    <Image source={require('../image/destination.png')} style={styles.iconStyle} />
                                                    <Text >{item.pickup_location_address}</Text>
                                                </ListItem>
                                            );
                                        })
                                    }
                                </List>
                                <List>
                                    {
                                        (this.props.deliveringPackageList.length > 0) &&
                                        <ListItem itemHeader style={{ backgroundColor: '#d3d3d3' }}>
                                            <Text>DELIVERING</Text>
                                        </ListItem>
                                    }
                                    
                                    {
                                        this.props.deliveringPackageList.map((item) => {
                                            return (
                                                <ListItem key={item.id} onPress={() => this.onCheckCode(item.id)}>
                                                    <Image source={require('../image/deliver.png')} style={styles.iconStyle} />
                                                    <Text >{item.destination_address}</Text>
                                                </ListItem>
                                            );
                                        })
                                    }
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

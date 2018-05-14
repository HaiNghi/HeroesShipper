import React, { Component } from 'react';
import { View, Alert, Image, ScrollView, Dimensions, AsyncStorage, ListView } from 'react-native';
import { Text, Button, List, ListItem, Icon } from 'native-base'; 
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import polyline from '@mapbox/polyline';
import PushNotification from 'react-native-push-notification';
import Modal from 'react-native-modal';
import firebase from 'firebase';
import axios from 'axios';
import SearchBox from '../SearchBox';
import SearchResult from '../SearchResults';
import { Spinner } from '../common';
import styles from './MapContainerStyle';

/* eslint-disable global-require */
let user = [];
AsyncStorage.getItem('user_info', (error, result) => {
        user = JSON.parse(result);
});
const GOOGLE_MAPS_APIKEY = 'AIzaSyBSw2SzeTbROHDQHohGL-5_tfKE52EoZUc';
class MapContainer extends Component {
        constructor(props) {
            super(props);
            // config notification and handle event 
            this.state = { 
                showWarningModal: false, 
                showSpinner: false, 
                status: '',
                packageId: '',
                showDetailPackageList: false,
                currentLocation: {
                    latitude: 0,
                    longitude: 0
                },
                id: '',
                coords: [],
                directionButton: true,
                packageInfo: {},
                showPackageInfoModal: false,
                showOneLocationPackageListModal: false,
                uneditable: false,
                confirmation: false
            };
            this.mapRef = null;
            this.ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
            this.configNotification();
        }
        
        componentDidMount = () => {
            this.pushNotification();
            this.mapRef.fitToElements(true);
            this.watchID = navigator.geolocation.watchPosition(this.getLocationSuccess,
            {
                enableHighAccurancy: true, timeout: 20000, maximumAge: 1000, distanceFilter: 30 }
            );
        }

        // update mapview when shipper is moving
        getLocationSuccess = (position) => {
            this.setState({ currentLocation: { latitude: position.coords.latitude, longitude: position.coords.longitude } });
            this.props.updateCurrentLocation(user.shipper_id, position.coords.latitude, position.coords.longitude);
            this.props.changeRegion(position.coords, 'watchPosition');
        }

        // get shortest route between 2 coordinates
        async getShortestRouteDirections(startLoc, destinationLoc) {
            await axios.get(`https://maps.googleapis.com/maps/api/directions/json?origin=${startLoc}&destination=${destinationLoc}&mode=bicyling&key=${GOOGLE_MAPS_APIKEY}`)
            .then((response) => {
                const points = polyline.decode(response.data.routes[0].overview_polyline.points);
                const coords = points.map((point) => {
                    return {
                        latitude: point[0],
                        longitude: point[1]
                    };
                });
                const newCoordsArray = [...this.state.coords, coords];
                this.setState({ coords: newCoordsArray });
                this.mapRef.fitToElements(true);
            })
            .catch((error) => {
                Alert.alert(error);
            });
        }

        componentWillReceiveProps = (nextProps) => { 
            if (nextProps.loading === false) {
                this.setState({ showSpinner: false });
            } else {
                this.setState({ showSpinner: false }, function () {
                    // click item of packages list in modal
                    if (this.state.confirmation) {
                        if (this.state.status === 2) {
                            this.props.navigation.navigate('ReceivingPackageVerification', { status: 'receive_from_po', packageInfo: nextProps.packageDetail, updateDirectionButton: this.onUpdateDirectionButton.bind(this), updateConfirmation: this.onUpdateConfirmation.bind(this) });
                        } else {
                            this.props.navigation.navigate('ReceivingPackageVerification', { status: 'send_to_rc', packageInfo: nextProps.packageDetail, updateDirectionButton: this.onUpdateDirectionButton.bind(this), updateConfirmation: this.onUpdateConfirmation.bind(this) });
                        }
                    } else {
                        // click an icon on the map
                        this.props.navigation.navigate('DeliveryDetail', 
                        {
                            currentLocation: this.props.region, 
                            packageDetail: nextProps.packageDetail,
                            status: this.state.status,
                            updateDirectionButton: this.onUpdateDirectionButton.bind(this),
                            numberOfPackage: this.props.allPackageList.length,
                            
                        }
                        );
                    }
                });
            }
            // render route on map after getting data from API
            if (nextProps.route.length > 0 && nextProps.route !== this.props.route) {
                this.renderRoute(nextProps.route);
            }
            // update the status of direction button when inputing final destination
            if (this.props.isExisted !== nextProps.isExisted || (nextProps.isExisted && nextProps.dropOff === '')) {
                if (this.state.directionButton === false) this.setState({ directionButton: true });
            }
        }

        componentWillUnmount = () => {
            navigator.geolocation.clearWatch(this.watchID);
        }

        //reset the status of confirmation: it distinguish between clicking icon on map or clicking item on packages list in modal 
        onUpdateConfirmation = () => {
            this.setState({ confirmation: false });
        }

        // show callout of that marker
        onMarkerPressed = (marker, item) => {
            setTimeout(() => 
                this[marker].showCallout()
                , 0);
                // });
            this.setState({ packageId: item.id });
        }
        
        // get package's information
        handleMarkerPress = (packageId, packageStatus) => {
            // const markerID = event.nativeEvent.id;
            this.setState({ showSpinner: true }, function () {
                this.setState({ status: packageStatus });
            });
            this.props.getPackageDetail(packageId);
        }

        // update location when zoom in / zoom out
        onChangeRegion = (item, type) => {
            this.props.changeRegion(item, type);
        }

        // navigate to package information screen to confirm delivery successfully
        onCheckCode = (packageId) => {
            this.setState({ showDetailPackageList: false });
            this.props.navigation.navigate('ReceivingPackageVerification', { packageId, status: 'send_to_rc', updateDirectionButton: this.onUpdateDirectionButton.bind(this) });
        }

        // show the picked/delivering packages 
        showDetailPackageList = () => {
            AsyncStorage.getItem('user_info', (error, result) => {
                this.setState({ id: JSON.parse(result).shipper_id });
            });
            if (this.props.pickedPackageList.length === 0 && this.props.deliveringPackageList.length === 0) {
                Alert.alert('No trips to show! ');
            } 
            if (this.props.pickedPackageList.length < 2 && this.props.deliveringPackageList.length === 0) {
                this.props.pickedPackageList.map((item) => 
                    this.setState({ status: item.status }, function () {
                        this.props.getPackageDetail(item.id);
                        this.setState({ confirmation: true });
                        }
                    )
                );
            } else {
                this.setState({ showDetailPackageList: true });
            }
        }

        // navigate to package confirmation to confirm receiving package from po
        onReceivePackageByList = (packageId, item) => {
            this.setState({ showDetailPackageList: false, confirmation: true, status: item.status });
            this.props.getPackageDetail(packageId);
            // if (item.status === 2) {
            //     this.props.navigation.navigate('ReceivingPackageVerification', { packageId, status: 'receive_from_po', packageInfo: item, updateDirectionButton: this.onUpdateDirectionButton.bind(this) });
            // } else {
            //     this.props.navigation.navigate('ReceivingPackageVerification', { packageId, status: 'send_to_rc', packageInfo: item, updateDirectionButton: this.onUpdateDirectionButton.bind(this) });
            // }
        }

        // check if shipper has not received the package yet
        onVerifyCodeForDeliveringSuccess = (packageId, status) => {
            if (status === 3) {
                this.onCheckCode(packageId);
            } else {
                Alert.alert('You have not received the package from Package Owner yet !');
            }
        }

        getCurrentLocation = () => {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    this.setState({ currentLocation: {
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude
                    } }); 
                },
                (error) => console.log(error.message),
                {
                    enableHighAccurancy: true, timeout: 30000, maximumAge: 1000 }
                );
        }

        // Find shortest route
        findShortestRoute = () => {
            const { region, pickedPackageList, deliveringPackageList, isExisted, dropOff, finalDestination } = this.props;
            // if have packages
            if (pickedPackageList.length > 0 || deliveringPackageList.length > 0) {
                if ((isExisted && dropOff !== '') || (!isExisted)) {
                    this.setState({ coords: [], 
                        showSpinner: true,
                        directionButton: false
                    });
                    this.props.findShortestRoute(finalDestination.latitude, finalDestination.longitude);
                } else {
                    Alert.alert('You forgot to input destination location');
                }
            } 
            // No package but set default route at the beginning
            if (pickedPackageList.length === 0 && deliveringPackageList.length === 0) {
                if (isExisted) {
                    if (dropOff !== '') {
                        this.setState({ coords: [], directionButton: false });
                        const current = `"${this.state.currentLocation.latitude}, ${this.state.currentLocation.longitude}"`;
                        const final = `"${finalDestination.latitude}, ${finalDestination.longitude}"`;
                        this.getShortestRouteDirections(current, final);
                    } else {
                        Alert.alert('You forgot to input destination location');
                    }
                } else {
                    this.setState({ coords: [] });
                }
            }
        }

        // call out event
        renderCallout = (item, type) => {
            return (
              <MapView.Callout tooltip onPress={() => this.handleMarkerPress(item.id, item.status)}>
                <View style={styles.mapCallOut}>
                    <Text style={{ fontSize: 12, marginBottom: 10 }}><Text style={styles.labelStyle}>Destination:</Text> {item.destination_address}</Text>
                    <Text style={{ fontSize: 12, marginBottom: 10 }}><Text style={styles.labelStyle}>Earnings:</Text> {item.price} VND</Text>
                    <Text style={{ fontSize: 12 }}><Text style={styles.labelStyle}>Distance:</Text> {item.distance} Km</Text>
                    {
                        (type !== 'destination' && type !== 'chosen') &&
                        <Button success full small style={{ borderRadius: 5, marginTop: 5, bottom: 1, height: 30 }}><Text style={{ fontSize: 12 }}>Pick</Text></Button>
                    }
                    
                </View>
              </MapView.Callout>
            );
        }

         // get 2 locations ' coordinates to map
        renderRoute(route) {
            let i = 0;
            for (i = 0; i < route.length - 1; i++) {
                this.getShortestRouteDirections(route[i], route[i + 1]);
            }
            this.setState({ showSpinner: false });
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

        // show package info when clicking item of modal list
        onPackageInfo = (item) => {
            this.setState({ packageInfo: item }, this.setState({ showPackageInfoModal: true }));
        }

        // get packages list in one location
        getPackageList = (item) => {
            AsyncStorage.getItem('user_info', (error, result) => {
                this.props.getOneLocationPickedPackageList(JSON.parse(result).shipper_id, item);
                this.props.getOneLocationPackageList(item);
                this.setState({ showOneLocationPackageListModal: true });
            });
        }

        // If new package has been registered or it has been canceled, push notification.
        pushNotification = () => {
            let newPackage = '';
            AsyncStorage.getItem('user_info', (error, result) => {
                user = JSON.parse(result);
            }).then(() => {
                const ref = firebase.database().ref(`shipper/${user.shipper_id}/notification`);
                ref.on('child_added', (snapshot) => {
                    newPackage = snapshot.val();
                    if (newPackage.status === 1) {
                        PushNotification.localNotification({
                            alertAction: 'DetailPackage',
                            title: `New package ${newPackage.id} has been registered!`,
                            message: `Destination: ${newPackage.destination_address}`,
                            playSound: true,
                            soundName: 'default',
                            userInfo: { package: newPackage }
                        });
                        ref.child(`${newPackage.id}`).remove();
                    } else {
                        PushNotification.localNotification({
                            alertAction: 'DetailPackage',
                            title: `Package ${newPackage.id} has been canceled!`,
                            message: `Destination: ${newPackage.destination_address}`,
                            playSound: true,
                            soundName: 'default',
                            userInfo: { package: newPackage }
                        });
                        ref.child(`${newPackage.id}`).remove();
                        this.setState({ directionButton: true, coords: [] });
                    }
                });
            });
        }

        //config notification
        configNotification = () => {
            PushNotification.configure({
                onNotification: (notification) => {
                    console.log(notification);
                    if (notification.data.package.status === 1) {
                        this.setState({ status: notification.data.package.status, showOneLocationPackageListModal: false });
                        this.props.getPackageDetail(notification.data.package.id);
                    }
                },
                permissions: {
                    alert: true,
                    badge: true,
                    sound: true
                },
                popInitialNotification: true,
                requestPermissions: true,
            });
        }

        render() {
            const {
                region, 
                changeRegion,
                } = this.props;
            const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
            return (
                <View style={styles.container}>
                    <MapView
                        ref={ref => {
                            this.mapRef = ref;
                        }}
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
                        (this.props.finalDestination.latitude !== null) &&
                            <MapView.Marker 
                                coordinate={{
                                    latitude: this.props.finalDestination.latitude,
                                    longitude: this.props.finalDestination.longitude
                                }}
                                image={require('../image/destination.png')}
                            />
                        
                    }
                    

                    {
                        this.props.differentLocationPackageList.map((item) => {
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
                        this.props.sameLocationPackageList.map((item) => {
                            return (
                                <MapView.Marker 
                                    coordinate={{
                                        latitude: item.pickup_latitude,
                                        longitude: item.pickup_longitude
                                    }}
                                    image={require('../image/gift-box.png')}
                                    identifier={`${item.id}`}
                                    key={item.id}
                                    description={`Number of package: ${this.props.oneLocationPackageList.length}\nPicked: ${this.props.oneLocationPickedPackageList.length}`}
                                    onPress={() => this.getPackageList(item)}
                                    
                                    /* ref={(c) => { this[`marker + ${item.id}`] = c; }} */
                                >
                                   
                                </MapView.Marker>
                                
                            );
                        })
                    }

                    {
                        this.props.multiPackageAtOneLocationList.map((item) => {
                            return (
                                <MapView.Marker 
                                    coordinate={{
                                        latitude: item.pickup_latitude,
                                        longitude: item.pickup_longitude
                                    }}
                                    image={require('../image/gift-box1.png')}
                                    identifier={`${item.id}`}
                                    key={item.id}
                                    description={`Number of package: ${this.props.oneLocationPackageList.length}\nPicked: ${this.props.oneLocationPickedPackageList.length}`}
                                    onPress={() => this.getPackageList(item)}
                                    
                                    /* ref={(c) => { this[`marker + ${item.id}`] = c; }} */
                                />
                                
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
                                {this.renderCallout(item, 'chosen')}
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
                                    key={item.id}
                                    /* onPress={() => this.onVerifyCodeForDeliveringSuccess(item.id, item.status)} */
                                    /* onPress={() => this.onMarkerPressed(`marker + ${item.id}`, item)}  */
                                    /* ref={(c) => { this[`marker + ${item.id}`] = c; }} */
                                >
                                {this.renderCallout(item, 'destination')}
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
                                    strokeWidth={3}
                                    strokeColor="#007FFF"
                                    key={index}
                                />
                            );
                        })
                    }
                    </MapView>
                    <SearchBox 
                        getAddressPredictions={this.props.getAddressPredictions} 
                        region={region}
                        getDropOff={this.props.getDropOff}
                        dropOff={this.props.dropOff}
                        deleteResultAddress={this.props.deleteResultAddress}
                        uneditable={this.state.uneditable}
                        haveFinalDestination={this.props.haveFinalDestination}
                        isExisted={this.props.isExisted}
                    />
                    
                    { (this.props.toogle) &&
                        <SearchResult 
                            predictions={this.props.predictions} getSelectedAddress={this.props.getSelectedAddress}
                        />
                    } 
                    
                    {
                        (this.props.dropOff === '' || (this.props.dropOff !== '' && this.props.toogle === false)) &&
                        <View style={{ flex: 4 / 5, top: 25, position: 'relative', flexDirection: 'row', alignSelf: 'flex-end', marginRight: 10 }}>
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
                    }
                    {
                        (this.props.dropOff === '' || (this.props.dropOff !== '' && this.props.toogle === false)) &&
                        <View style={styles.buttonWrapper} >
                            <Button 
                                /* iconLeft  */
                                rounded 
                                success 
                                onPress={() => this.showDetailPackageList()}
                                style={{ backgroundColor: '#ff5a3e' }}
                            >
                                <View style={styles.viewContainer}>
                                    {
                                        (this.props.pickedPackageList.length > 1) ?
                                            <Text style={styles.titleStyle}>RECEIVE PACKAGES </Text>
                                        :
                                            <Text style={styles.titleStyle}>RECEIVE PACKAGE </Text>
                                    }
                                
                                    
                                    <View style={styles.numberViewContainer}>
                                        <Text style={styles.numberText}>{this.props.pickedPackageList.length}</Text>
                                    </View>
                                </View>
                            </Button>
                        </View>
                    }

                    <Modal isVisible={this.state.showDetailPackageList} style={styles.modalStyle}>
                        <View style={{ flexWrap: 'wrap', flex: 4 / 5, borderRadius: 10 }}>
                            <ScrollView 
                                        style={{ backgroundColor: '#fff' }}
                                        automaticallyAdjustContentInsets={false}
                            >
                            
                                <List>
                                    <ListItem itemHeader first style={{ backgroundColor: '#d3d3d3', justifyContent: 'center', alignItems: 'center' }}>
                                        <View style={{ flex: 2 / 5, flexDirection: 'row' }}>
                                            <Image source={require('../image/destination.png')} style={styles.iconStyle} />
                                            <Text>: PICK UP</Text>
                                        </View>
                                        <View style={{ flex: 2 / 5, flexDirection: 'row' }}>
                                            <Image source={require('../image/deliver.png')} style={styles.iconStyle} />
                                            <Text>: DROP-OFF</Text>
                                        </View>
                                        

                                    </ListItem>
                                </List> 
                                
                                <List
                                    dataSource={this.ds.cloneWithRows(this.props.allPackageList)}
                                    renderRow={item =>
                                        <ListItem 
                                            key={item.id}
                                            onPress={() => this.onReceivePackageByList(item.id, item)}
                                        >
                                            <Image source={(item.status === 2) ? require('../image/destination.png') : require('../image/deliver.png')} style={styles.iconStyle} />
                                            {
                                                (item.status === 2) ? <Text>{item.pickup_location_address}</Text> : <Text>{item.destination_address}</Text>
                                            }
                                        </ListItem>
                                    }
                                    renderLeftHiddenRow={item =>
                                    <Button full onPress={() => this.onPackageInfo(item)}>
                                        <Icon active name="information-circle" />
                                    </Button>}
                                    leftOpenValue={75}
                                />
                                {/* <List>
                                    {
                                        (this.props.deliveringPackageList.length > 0) &&
                                        <ListItem itemHeader style={{ backgroundColor: '#d3d3d3' }}>
                                            <Text>DELIVERING</Text>
                                        </ListItem>
                                    }
                                    
                                </List>
                                <List
                                    dataSource={this.ds.cloneWithRows(this.props.deliveringPackageList)}
                                    renderRow={item =>
                                        <ListItem key={item.id} onPress={() => this.onCheckCode(item.id)}>
                                            <Image source={require('../image/deliver.png')} style={styles.iconStyle} />
                                            <Text >{item.destination_address}</Text>
                                        </ListItem>}
                                    renderLeftHiddenRow={item =>
                                    <Button full onPress={() => this.onPackageInfo(item)}>
                                        <Icon active name="information-circle" />
                                    </Button>}
                                    leftOpenValue={75}
                                /> */}
                            </ScrollView>
                            
                            <Button transparent full onPress={() => this.setState({ showDetailPackageList: false })}>
                                <Icon 
                                    name="ios-arrow-dropdown-outline" 
                                    style={{ fontSize: 50, marginTop: 10, justifyContent: 'center', color: '#fff' }} 
                                />
                            </Button>
                        </View>

                        <Modal isVisible={this.state.showPackageInfoModal}>
                            <View style={styles.packageInfoModal}>
                                <View style={styles.innerWrapper}>
                                    <View style={{ flexDirection: 'column', flex: 2/5 }}>
                                        <Image source={require('../image/box-3.png')} style={{ alignSelf: 'center' }} />
                                        <Text style={styles.packageId}>Package id: {this.state.packageInfo.id} </Text>
                                    </View>
                                    <View style={{ flexDirection: 'column', flex: 3/5 }}>
                                        <Text style={{ fontSize: 13 }}><Text style={styles.labelStyle}>Package type:</Text> {this.state.packageInfo.package_type}</Text>
                                        {
                                            (this.state.packageInfo.size) && 
                                                <View>
                                                    <Text style={{ fontSize: 13 }}><Text style={styles.labelStyle}>Height:</Text> {this.state.packageInfo.size.height}</Text>
                                                    <Text style={{ fontSize: 13 }}><Text style={styles.labelStyle}>Width:</Text> {this.state.packageInfo.size.width}</Text>
                                                    <Text style={{ fontSize: 13 }}><Text style={styles.labelStyle}>length:</Text> {this.state.packageInfo.size.length}</Text>
                                                </View>
                                           
                                        }
                                        <Text style={{ fontSize: 13 }}><Text style={styles.labelStyle}>Destination:</Text> {this.state.packageInfo.destination_address}</Text>
                                        <Text style={{ fontSize: 13 }}><Text style={styles.labelStyle}>Earnings:</Text> {this.state.packageInfo.price} VND</Text>
                                    </View>
                                </View>
                                <View>
                                <View style={styles.straightLine} />
                                    <Button transparent full onPress={() => this.setState({ showPackageInfoModal: false })}><Text>OK</Text></Button>
                                </View>
                            </View>
                        </Modal>
                    </Modal>

                    <Modal isVisible={this.state.showSpinner}>
                        <View style={styles.spinnerContainer}>
                            <Spinner />
                        </View>
                    </Modal>
                    
                    <Modal isVisible={this.state.showOneLocationPackageListModal} style={styles.modalStyle}>
                        <View style={{ flexWrap: 'wrap', flex: 4 / 5 }}>
                            <ScrollView 
                                        style={{ backgroundColor: '#fff' }}
                                        automaticallyAdjustContentInsets={false}
                            >
                                {
                                    (this.props.oneLocationPackageList.length > 0) &&
                                    <List>
                                        <ListItem itemHeader first style={{ backgroundColor: '#d3d3d3' }}>
                                            <Text>PACKAGE'S NUMBER: {this.props.oneLocationPackageList.length}</Text>
                                        </ListItem>
                                    </List> 
                                }
                               
                                <List
                                    dataSource={this.ds.cloneWithRows(this.props.oneLocationPackageList)}
                                    renderRow={item =>
                                        <ListItem 
                                            key={item.id}
                                            onPress={() => { 
                                                            this.props.getPackageDetail(item.id); 
                                                            this.setState({ showOneLocationPackageListModal: false, status: item.status }); 
                                                            }
                                                    }
                                        >
                                            <Image source={require('../image/flag.png')} style={styles.iconStyle} />
                                            <Text >{item.destination_address}</Text>
                                        </ListItem>}
                                    renderLeftHiddenRow={item =>
                                    <Button full onPress={() => this.onPackageInfo(item)}>
                                        <Icon active name="information-circle" />
                                    </Button>}
                                    leftOpenValue={75}
                                />
                                
                                {
                                    (this.props.oneLocationPickedPackageList.length > 0) &&
                                    <List>
                                        <ListItem itemHeader style={{ backgroundColor: '#d3d3d3' }}>
                                            <Text>PICKED</Text>
                                        </ListItem>
                                    </List>
                                }
                                
                                <List
                                    dataSource={this.ds.cloneWithRows(this.props.oneLocationPickedPackageList)}
                                    renderRow={item =>
                                        <ListItem key={item.id} onPress={() => { this.onReceivePackageByList(item.id, item); this.setState({ showOneLocationPackageListModal: false }); }}>
                                            <Image source={require('../image/deliver.png')} style={styles.iconStyle} />
                                            <Text >{item.destination_address}</Text>
                                        </ListItem>}
                                    renderLeftHiddenRow={item =>
                                    <Button full onPress={() => this.onPackageInfo(item)}>
                                        <Icon active name="information-circle" />
                                    </Button>}
                                    leftOpenValue={75}
                                />
                                
                            </ScrollView>
                            
                            <Button transparent full onPress={() => this.setState({ showOneLocationPackageListModal: false })}>
                                <Icon 
                                    name="ios-arrow-dropdown-outline" 
                                    style={{ fontSize: 50, marginTop: 10, justifyContent: 'center', color: '#fff' }} 
                                />
                            </Button>
                        </View>
                        <Modal isVisible={this.state.showPackageInfoModal}>
                            <View style={styles.packageInfoModal}>
                                <View style={styles.innerWrapper}>
                                    <View style={{ flexDirection: 'column', flex: 2 / 5 }}>
                                        <Image source={require('../image/box-3.png')} style={{ alignSelf: 'center' }} />
                                        <Text style={styles.packageId}>Package id: {this.state.packageInfo.id} </Text>
                                    </View>
                                    <View style={{ flexDirection: 'column', flex: 3 / 5 }}>
                                        <Text style={{ fontSize: 13 }}><Text style={styles.labelStyle}>Package type:</Text> {this.state.packageInfo.package_type}</Text>
                                        {
                                            (this.state.packageInfo.size) && 
                                                <View>
                                                    <Text style={{ fontSize: 13 }}><Text style={styles.labelStyle}>Height:</Text> {this.state.packageInfo.size.height}</Text>
                                                    <Text style={{ fontSize: 13 }}><Text style={styles.labelStyle}>Width:</Text> {this.state.packageInfo.size.width}</Text>
                                                    <Text style={{ fontSize: 13 }}><Text style={styles.labelStyle}>length:</Text> {this.state.packageInfo.size.length}</Text>
                                                </View>
                                           
                                        }
                                        <Text style={{ fontSize: 13 }}><Text style={styles.labelStyle}>Destination:</Text> {this.state.packageInfo.destination_address}</Text>
                                        <Text style={{ fontSize: 13 }}><Text style={styles.labelStyle}>Earnings:</Text> {this.state.packageInfo.price} VND</Text>
                                    </View>
                                </View>
                                <View>
                                <View style={styles.straightLine} />
                                    <Button transparent full onPress={() => this.setState({ showPackageInfoModal: false })}><Text>OK</Text></Button>
                                </View>
                            </View>
                        </Modal>
                    </Modal>
                    
                </View> 
            );
        }
}
    
export default MapContainer;

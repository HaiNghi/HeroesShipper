import React, { Component } from 'react';
import { AsyncStorage } from 'react-native';
import { Container } from 'native-base';
import MapContainer from './MapContainer';
import { HeaderForHome } from './common';

class Home extends Component {
    constructor(props) {
        super(props);
        this.state = { id: 0 };
        this.timer = 0;
    }
    componentDidMount() {
        this.props.getCurrentLocation();
        // this.props.getSameLocationPackageList();
        AsyncStorage.getItem('user_info', (error, result) => {
            if (result !== null) {
                this.setState({ id: JSON.parse(result).shipper_id });
                this.props.getPackageList(JSON.parse(result).shipper_id);
                this.props.getAllPickedPackageList(this.state.id);
                this.props.getChosenPackageList(this.state.id); 
                this.props.getPickedPackageList(this.state.id);
                this.props.getDeliveringPackageList(this.state.id);
                this.props.getPickedPackageDestinationList(this.state.id);
            }
        });
    } 

    render() {
        return (
            <Container>
                <HeaderForHome 
                        headerText="Shipper" navigation={this.props.navigation} 
                        pickedPackageList={this.props.pickedPackageList}
                        deliveringPackageList={this.props.deliveringPackageList}
                        isOnline={this.props.isOnline}
                        isOnlineError={this.props.inOnlineError}
                />
                {this.props.region.latitude &&
                    <MapContainer 
                        region={this.props.region} 
                        getAddressPredictions={this.props.getAddressPredictions}
                        predictions={this.props.predictions}
                        getSelectedAddress={this.props.getSelectedAddress}
                        getDropOff={this.props.getDropOff}
                        dropOff={this.props.dropOff}
                        deleteResultAddress={this.props.deleteResultAddress}
                        toogle={this.props.toogle}
                        haveFinalDestination={this.props.haveFinalDestination}
                        finalDestination={this.props.finalDestination}
                        isExisted={this.props.isExisted}
                        navigation={this.props.navigation}
                        packageList={this.props.packageList}
                        sameLocationPackageList={this.props.sameLocationPackageList}
                        differentLocationPackageList={this.props.differentLocationPackageList}
                        chosenPackageList={this.props.chosenPackageList}
                        getPackageDetail={this.props.getPackageDetail}
                        packageDetail={this.props.packageDetail}
                        loading={this.props.loading}
                        route={this.props.route}
                        changeRegion={this.props.changeRegion}
                        pickedPackageList={this.props.pickedPackageList}
                        deliveringPackageList={this.props.deliveringPackageList}
                        getPickedPackageList={this.props.getPickedPackageList}
                        getDeliveringPackageList={this.props.getDeliveringPackageList}
                        updateCurrentLocation={this.props.updateCurrentLocation}
                        pickedPackageDestinationList={this.props.pickedPackageDestinationList}
                        findShortestRoute={this.props.findShortestRoute}
                        route={this.props.route}
                        deleteData={this.props.deleteData}
                        getOneLocationPackageList={this.props.getOneLocationPackageList}
                        oneLocationPackageList={this.props.oneLocationPackageList}
                        getOneLocationPickedPackageList={this.props.getOneLocationPickedPackageList}
                        oneLocationPickedPackageList={this.props.oneLocationPickedPackageList}
                        allPackageList={this.props.allPackageList}
                        multiPackageAtOneLocationList={this.props.multiPackageAtOneLocationList}
                    />
                }
                
            </Container>
        );
    }
}

export default Home;

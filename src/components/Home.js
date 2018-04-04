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
        this.props.getPackageList();
        AsyncStorage.getItem('user_info', (error, result) => {
            this.setState({ id: JSON.parse(result).shipper_id });
            this.props.getChosenPackageList(this.state.id); 
            this.props.getPickedPackageList(this.state.id);
            this.props.getDeliveringPackageList(this.state.id);
            this.props.getPickedPackageDestinationList(this.state.id);
        });
    } 

    render() {
        return (
            <Container>
                <HeaderForHome headerText="Shipper" navigation={this.props.navigation} />
                {this.props.region.latitude &&
                    <MapContainer 
                        region={this.props.region} 
                        /* toogleSearchResult={this.props.toogleSearchResult}
                        getAddressPredictions={this.props.getAddressPredictions}
                        resultTypes={this.props.resultTypes}
                        predictions={this.props.predictions}
                        getSelectedAddress={this.props.getSelectedAddress}
                        getPickUp={this.props.getPickUp}
                        pickUp={this.props.pickUp}
                        currentLocation={this.props.currentLocation}
                        deleteResultAddress={this.props.deleteResultAddress}
                        deleted={this.props.deleted}
                        showDropOff={false} */
                        packageList={this.props.packageList}
                        chosenPackageList={this.props.chosenPackageList}
                        getPackageDetail={this.props.getPackageDetail}
                        packageDetail={this.props.packageDetail}
                        loading={this.props.loading}
                        navigation={this.props.navigation}
                        route={this.props.route}
                        changeRegion={this.props.changeRegion}
                        pickedPackageList={this.props.pickedPackageList}
                        deliveringPackageList={this.props.deliveringPackageList}
                        getPickedPackageList={this.props.getPickedPackageList}
                        getDeliveringPackageList={this.props.getDeliveringPackageList}
                        updateCurrentLocation={this.props.updateCurrentLocation}
                        pickedPackageDestinationList={this.props.pickedPackageDestinationList}
                    />
                }
                
            </Container>
        );
    }
}

export default Home;

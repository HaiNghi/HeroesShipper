import React, { Component } from 'react';
import { Container } from 'native-base';
import DefaultRouteContainer from './MapContainer/DefaultRouteContainer';
import { HeaderForHome } from './common';

class DefaultRoute extends Component {
    componentDidMount() {
        this.props.getCurrentLocation();
    } 

    render() {
        return (
            <Container>
                
                <HeaderForHome headerText="Default Route" navigation={this.props.navigation} />
                
                {this.props.region.latitude &&
                    <DefaultRouteContainer 
                        region={this.props.region} 
                        getInputData={this.props.getInputData} 
                        toogleSearchResult={this.props.toogleSearchResult}
                        getAddressPredictions={this.props.getAddressPredictions}
                        resultTypes={this.props.resultTypes}
                        predictions={this.props.predictions}
                        inputData={this.props.inputData}
                        getSelectedAddress={this.props.getSelectedAddress}
                        getPickUp={this.props.getPickUp}
                        getDropOff={this.props.getDropOff}
                        pickUp={this.props.pickUp}
                        dropOff={this.props.dropOff}
                        pickUpRegion={this.props.pickUpRegion}
                        nextRegion={this.props.nextRegion}
                        currentLocation={this.props.currentLocation}
                        deleteResultAddress={this.props.deleteResultAddress}
                        deleted={this.props.deleted}
                        navigation={this.props.navigation}
                        showDropOff={true}
                    />
                }
                
            </Container>
        );
    }
}

export default DefaultRoute;

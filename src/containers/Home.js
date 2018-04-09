import { connect } from 'react-redux';

import Home from '../components/Home';
import {
    getCurrentLocation, 
    toogleSearchResult,
    getAddressPredictions,
    getSelectedAddress,
    getPickUp,
    deleteResultAddress,
    getPackageList,
    getPackageDetail,
    getChosenPackageList,
    changeRegion,
    getPickedPackageList,
    getDeliveringPackageList,
    getPickedPackageDestinationList,
    findShortestRoute
} from '../actions';
import { doGetPackageDetail, processUpdatingCurrentPositon, processFindingShortestRoute } from '../api/api';

const mapStateToProps = (state) => ({
    region: state.map.region,
    resultTypes: state.map.resultTypes || {},
    predictions: state.map.predictions || [],
    pickUp: state.map.pickUp,
    currentLocation: state.map.currentLocation,
    deleted: state.map.deleted,
    packageList: state.map.packageList || [],
    packageDetail: state.map.packageDetail || [],
    loading: state.map.loading,
    chosenPackageList: state.map.chosenPackageList || [],
    route: state.map.route || [],
    pickedPackageList: state.map.pickedPackageList || [],
    deliveringPackageList: state.map.deliveringPackageList || [],
    pickedPackageDestinationList: state.map.pickedPackageDestinationList || []
});

const mapDispatchToProps = (dispatch) => ({
    getCurrentLocation: () => {
        dispatch(getCurrentLocation());
    },
    toogleSearchResult: (text) => {
        dispatch(toogleSearchResult(text));
    },
    getAddressPredictions: (text, { region }) => {
        dispatch(getAddressPredictions(text, { region }));
    },
    getSelectedAddress: (placeID) => {
        dispatch(getSelectedAddress(placeID));
    },
    getPickUp: (text) => {
        dispatch(getPickUp(text));
    },
    deleteResultAddress: (text) => {
        dispatch(deleteResultAddress(text));
    },
    getPackageList: () => {
        dispatch(getPackageList());
    },
    getChosenPackageList: (userId) => {
        dispatch(getChosenPackageList(userId));
    },
    getPackageDetail: (index) => {
        doGetPackageDetail(dispatch, getPackageDetail, index);
    },
    changeRegion: (region, type) => {
        dispatch(changeRegion(region, type));
    },
    getPickedPackageList: (userId) => {
        dispatch(getPickedPackageList(userId));
    },
    getDeliveringPackageList: (userId) => {
        dispatch(getDeliveringPackageList(userId));
    },
    getPickedPackageDestinationList: (userId) => {
        dispatch(getPickedPackageDestinationList(userId));
    },
    updateCurrentLocation: (shipperId, latitude, longitude) => {
        processUpdatingCurrentPositon(shipperId, latitude, longitude);
    },
    findShortestRoute: () => {
        processFindingShortestRoute(dispatch, findShortestRoute);
    }
});

export default connect(mapStateToProps, mapDispatchToProps)(Home);

import { connect } from 'react-redux';

import Home from '../components/Home';
import * as Actions from '../actions';
import * as API from '../api/api';

const mapStateToProps = (state) => ({
    region: state.map.region,
    toogle: state.map.toogle,
    predictions: state.map.predictions || [],
    dropOff: state.map.dropOff,
    isExisted: state.map.isExisted,
    finalDestination: state.map.finalDestination || {},
    packageList: state.map.packageList || [],
    sameLocationPackageList: state.map.sameLocationPackageList || [],
    oneLocationPackageList: state.map.oneLocationPackageList || [],
    differentLocationPackageList: state.map.differentLocationPackageList || [],
    packageDetail: state.map.packageDetail || [],
    loading: state.map.loading,
    chosenPackageList: state.map.chosenPackageList || [],
    oneLocationPickedPackageList: state.map.oneLocationPickedPackageList || [],
    route: state.map.route || [],
    pickedPackageList: state.map.pickedPackageList || [],
    deliveringPackageList: state.map.deliveringPackageList || [],
    pickedPackageDestinationList: state.map.pickedPackageDestinationList || [],
    isOnlineError: state.auth.isOnlineError,
    allPackageList: state.map.allPackageList,
    multiPackageAtOneLocationList: state.map.multiPackageAtOneLocationList || []
});

const mapDispatchToProps = (dispatch) => ({
    getCurrentLocation: () => {
        dispatch(Actions.getCurrentLocation());
    },
    getAddressPredictions: (text, { region }) => {
        dispatch(Actions.getAddressPredictions(text, { region }));
    },
    getSelectedAddress: (placeID) => {
        dispatch(Actions.getSelectedAddress(placeID));
    },
    deleteResultAddress: (text) => {
        dispatch(Actions.deleteResultAddress(text));
    },
    getPackageList: (userId) => {
        dispatch(Actions.getPackageList(userId));
    },
    getSameLocationPackageList: () => {
        dispatch(Actions.getSameLocationPackageList());
    },
    getOneLocationPackageList: (item) => {
        dispatch(Actions.getOneLocationPackageList(item));
    },
    getChosenPackageList: (userId) => {
        dispatch(Actions.getChosenPackageList(userId));
    },
    getPackageDetail: (index) => {
        API.doGetPackageDetail(dispatch, Actions.getPackageDetail, index);
    },
    changeRegion: (region, type) => {
        dispatch(Actions.changeRegion(region, type));
    },
    getDropOff: (text) => {
        dispatch(Actions.getDropOff(text));
    },
    getPickedPackageList: (userId) => {
        dispatch(Actions.getPickedPackageList(userId));
    },
    getDeliveringPackageList: (userId) => {
        dispatch(Actions.getDeliveringPackageList(userId));
    },
    getPickedPackageDestinationList: (userId) => {
        dispatch(Actions.getPickedPackageDestinationList(userId));
    },
    getOneLocationPickedPackageList: (userId, item) => {
        dispatch(Actions.getOneLocationPickedPackageList(userId, item));
    },
    updateCurrentLocation: (shipperId, latitude, longitude) => {
        API.processUpdatingCurrentPositon(shipperId, latitude, longitude);
    },
    findShortestRoute: (latitude, longitude) => {
        API.processFindingShortestRoute(dispatch, Actions.findShortestRoute, latitude, longitude);
    },
    deleteData: () => {
        dispatch(Actions.deleteData());
    },
    isOnline: () => {
        API.processIsOnline(dispatch, Actions.isOnline);
    },
    getAllPickedPackageList: (userId) => {
        dispatch(Actions.getAllPickedPackageList(userId));
    },
    haveFinalDestination: () => {
        dispatch(Actions.haveFinalDestination());
    }
});

export default connect(mapStateToProps, mapDispatchToProps)(Home);

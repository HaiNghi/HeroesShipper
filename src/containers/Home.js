import { connect } from 'react-redux';

import Home from '../components/Home';
import {
    getCurrentLocation, 
    getAddressPredictions,
    getSelectedAddress,
    deleteResultAddress,
    getPackageList,
    getSameLocationPackageList,
    getOneLocationPackageList,
    getPackageDetail,
    getChosenPackageList,
    changeRegion,
    getPickedPackageList,
    getDeliveringPackageList,
    getPickedPackageDestinationList,
    findShortestRoute,
    deleteData,
    isOnline,
    getOneLocationPickedPackageList,
    getAllPickedPackageList,
    getDropOff,
    haveFinalDestination
} from '../actions';
import { doGetPackageDetail, 
        processUpdatingCurrentPositon, 
        processFindingShortestRoute,
        processIsOnline
} from '../api/api';

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
        dispatch(getCurrentLocation());
    },
    getAddressPredictions: (text, { region }) => {
        dispatch(getAddressPredictions(text, { region }));
    },
    getSelectedAddress: (placeID) => {
        dispatch(getSelectedAddress(placeID));
    },
    deleteResultAddress: (text) => {
        dispatch(deleteResultAddress(text));
    },
    getPackageList: (userId) => {
        dispatch(getPackageList(userId));
    },
    getSameLocationPackageList: () => {
        dispatch(getSameLocationPackageList());
    },
    getOneLocationPackageList: (item) => {
        dispatch(getOneLocationPackageList(item));
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
    getDropOff: (text) => {
        dispatch(getDropOff(text));
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
    getOneLocationPickedPackageList: (userId, item) => {
        dispatch(getOneLocationPickedPackageList(userId, item));
    },
    updateCurrentLocation: (shipperId, latitude, longitude) => {
        processUpdatingCurrentPositon(shipperId, latitude, longitude);
    },
    findShortestRoute: (latitude, longitude) => {
        processFindingShortestRoute(dispatch, findShortestRoute, latitude, longitude);
    },
    deleteData: () => {
        dispatch(deleteData());
    },
    isOnline: () => {
        processIsOnline(dispatch, isOnline);
    },
    getAllPickedPackageList: (userId) => {
        dispatch(getAllPickedPackageList(userId));
    },
    haveFinalDestination: () => {
        dispatch(haveFinalDestination());
    }
});

export default connect(mapStateToProps, mapDispatchToProps)(Home);

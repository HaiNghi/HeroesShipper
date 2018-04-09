import RNGooglePlaces from 'react-native-google-places';
import firebase from 'firebase';
import { 
    GET_CURRENT_LOCATION, 
    GET_INPUT, 
    TOOGLE_SEARCH_RESULT,
    GET_ADDRESS_PREDICTIONS,
    GET_SELECTED_ADDRESS,
    GET_PICK_UP,
    GET_DROP_OFF,
    DELETE_RESULT_ADDRESS,
    GET_PACKAGE_LIST_SUCCESS,
    GET_PACKAGE_DETAIL,
    DELETE_DATA,
    CHOOSE_PACKAGE,
    GET_CHOSEN_PACKAGE_LIST_SUCCESS,
    CHANGE_REGION,
    INPUT_EMAIL,
    INPUT_PASSWORD,
    LOGIN_SUCCESS,
    LOGIN_FAIL,
    LOADING,
    DISABLE_MODAL,
    VERIFY_RECEIVING_PACKAGE,
    VERIFY_RECEIVING_PACKAGE_FAILED,
    LOAD_SPINNER,
    GET_PICKED_PACKAGE_LIST,
    GET_DELIVERING_PACKAGE_LIST,
    GET_PICKED_PACKAGE_DESTINATION_LIST,
    VERIFY_DELIVERING_SUCCESS,
    CHANGE_REGION_1,
    FIND_SHORTEST_ROUTE
} from './types';

export const getCurrentLocation = () => {
    return (dispatch) => {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                dispatch({
                    type: GET_CURRENT_LOCATION,
                    payload: position
                });
            },
         
            (error) => console.log(error.message),
            {
                enableHighAccurancy: true, timeout: 30000, maximumAge: 0 }
        );
    };
};

export const getInputData = (text) => {
    return {
        type: GET_INPUT,
        payload: text
    };
};

export const getPickUp = (text) => {
    return {
        type: GET_PICK_UP,
        payload: text
    };
};

export const getDropOff = (text) => {
    return {
        type: GET_DROP_OFF,
        payload: text
    };
};

export const toogleSearchResult = (text) => {
    return {
        type: TOOGLE_SEARCH_RESULT,
        payload: text
    };
};
export const getAddressPredictions = (text, { region }) => {
    return (dispatch) => {
        console.log(text);
        RNGooglePlaces.getAutocompletePredictions(text,
            {
                type: 'establishments',
                country: 'VN',
                latitude: region.latitude,
                longitude: region.longitude,
                longitudeDelta: region.longitudeDelta,
                latitudeDelta: region.latitudeDelta,
                radius: 0.01
            }
        ).then((results) => dispatch({
            type: GET_ADDRESS_PREDICTIONS,
            payload: results
        }))
        .catch((error) => console.log(error.message));
    };
};

export const getSelectedAddress = (address) => {
    return (dispatch) => {
        RNGooglePlaces.lookUpPlaceByID(address)
        .then((results) => {
            dispatch({
                type: GET_SELECTED_ADDRESS,
                payload: results
            });
        })
        .catch((error) => {
            console.log(error.message);
        });
    };
};

export const deleteResultAddress = (text) => {
    return {
        type: DELETE_RESULT_ADDRESS,
        payload: text
    };
};

export const getPackageList = () => {
    return (dispatch) => {
        console.log('OK');
        let arr = [];
        firebase.database().ref('package/available/')
            .on('value', snapshot => {
                if (snapshot.val() !== null) {
                    arr = Object.entries(snapshot.val()).map(e => Object.assign(e[1], { key: e[0] }));
                } else {
                    arr = [];
                }
                dispatch({ type: GET_PACKAGE_LIST_SUCCESS, payload: arr });
        });
    };
};

export const getChosenPackageList = (userId) => {
    return (dispatch) => {
        console.log('OK');
        let arr = [];
        firebase.database().ref(`package/shipper/${userId}`).orderByChild('status')
            .on('value', snapshot => {
                if (snapshot.val() !== null) {
                    arr = Object.entries(snapshot.val()).map(e => Object.assign(e[1], { key: e[0] }));
                } else {
                    arr = [];
                }
                dispatch({ type: GET_CHOSEN_PACKAGE_LIST_SUCCESS, payload: arr });
        });
    };
};

export const getPickedPackageDestinationList = (userId) => {
    return (dispatch) => {
        console.log('OK');
        let arr = [];
        firebase.database().ref(`package/shipper/${userId}`).orderByChild('status')
            .on('value', snapshot => {
                if (snapshot.val() !== null) {
                    arr = Object.entries(snapshot.val()).map(e => Object.assign(e[1], { key: e[0] }));
                } else {
                    arr = [];
                }
                dispatch({ type: GET_PICKED_PACKAGE_DESTINATION_LIST, payload: arr });
        });
    };
};

export const getPackageDetail = (packageDetail) => {
    return {
        type: GET_PACKAGE_DETAIL,
        payload: packageDetail
    };
};

export const deleteData = () => {
    return {
        type: DELETE_DATA,
    };
};

export const choosePackage = (coordinates) => {
    return {
        type: CHOOSE_PACKAGE,
        payload: coordinates
    };
};
export const changeRegion = (region, status) => {
    return (dispatch) => {
        if (status === 'watchPosition') {
            dispatch({
                type: CHANGE_REGION,
                payload: region
            });
        } else {
            dispatch({
                type: CHANGE_REGION_1,
                payload: region
            });
        }
    };
    // return {
    //     type: CHANGE_REGION,
    //     payload: { region, status }
    // };
};
export const inputEmail = (text) => {
    return {
        type: INPUT_EMAIL,
        payload: text
    };
};
export const inputPassword = (text) => {
    return {
        type: INPUT_PASSWORD,
        payload: text
    };
};
export const loginSuccess = () => {
    return {
        type: LOGIN_SUCCESS,
    };
};
export const loginFail = (errorCode) => {
    return (dispatch) => {
        dispatch(loadSpinner());
        setTimeout(() => dispatch({
            type: LOGIN_FAIL,
            payload: errorCode
        }), 500);
    };
};

export const loadSpinner = () => {
    return {
        type: LOADING
    };
};

export const disableModal = () => {
    return {
        type: DISABLE_MODAL
    };
};

export const verifyCodeForReceivingPackage = (result) => {
    return (dispatch) => {
        dispatch(waitForCheck());
        setTimeout(() => dispatch({
            type: VERIFY_RECEIVING_PACKAGE,
            payload: result
        }), 500);
    };
};
export const verifyCodeForReceivingPackageFailed = (result) => {
    return (dispatch) => {
        dispatch(waitForCheck());
        setTimeout(() => dispatch({
            type: VERIFY_RECEIVING_PACKAGE_FAILED,
            payload: result
        }), 500);
    };
};
export const waitForCheck = () => {
    return {
        type: LOAD_SPINNER
    };
};

export const getPickedPackageList = (userId) => {
    return (dispatch) => {
        console.log('OK');
        let arr = [];
        firebase.database().ref(`package/shipper/${userId}`).orderByChild('status').equalTo(2)
            .on('value', snapshot => {
                if (snapshot.val() !== null) {
                    arr = Object.entries(snapshot.val()).map(e => Object.assign(e[1], { key: e[0] }));
                } else {
                    arr = [];
                }
                dispatch({ type: GET_PICKED_PACKAGE_LIST, payload: arr });
        });
    };
};
export const getDeliveringPackageList = (userId) => {
    return (dispatch) => {
        console.log('OK');
        let arr = [];
        firebase.database().ref(`package/shipper/${userId}`).orderByChild('status').equalTo(3)
            .on('value', snapshot => {
                if (snapshot.val() !== null) {
                    arr = Object.entries(snapshot.val()).map(e => Object.assign(e[1], { key: e[0] }));
                } else {
                    arr = [];
                }
                dispatch({ type: GET_DELIVERING_PACKAGE_LIST, payload: arr });
        });
    };
};

export const verifyCodeForDeliveringSuccess = (result) => {
    return (dispatch) => {
        dispatch(waitForCheck());
        setTimeout(() => dispatch({
            type: VERIFY_DELIVERING_SUCCESS,
            payload: result
        }), 500);
    };
};

export const findShortestRoute = (result) => {
    return {
        type: FIND_SHORTEST_ROUTE,
        payload: result
    };
};

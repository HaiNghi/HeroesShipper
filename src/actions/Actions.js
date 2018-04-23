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
    GET_SAME_LOCATION_PACKAGE_LIST_SUCCESS,
    GET_ONE_LOCATION_PACKAGE_LIST,
    GET_DIFFERENT_LOCATION_PACKAGE_LIST_SUCCESS,
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
    GET_ONE_LOCATION_PICKED_PACKAGE_LIST,
    GET_DELIVERING_PACKAGE_LIST,
    GET_PICKED_PACKAGE_DESTINATION_LIST,
    VERIFY_DELIVERING_SUCCESS,
    CHANGE_REGION_1,
    FIND_SHORTEST_ROUTE,
    LOG_OUT,
    REFRESH_DATA,
    IS_ONLINE,
    IS_ONLINE_ERROR,
    GET_HISTORY_LIST,
    GET_OUT_COME,
    GET_ALL_PICKED_PACKAGE_LIST,
    GET__LIST_HAVING_MULTI_CHOSEN_PACKAGE_AT_ONE_LOCATION,
    CHOOSE_PACKAGE_ERROR,

} from './types';

import * as Types from './types';

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

export const haveFinalDestination = () => {
    return {
        type: Types.HAVE_FINAL_DESTINATION
    };
};

// export const getPackageList = (type) => {
//     return (dispatch) => {
//         let sameLocation = [];
//         let differentLocation = [];
//         let arr = [];
//         let list = [];
//         firebase.database().ref('request-ship/')
//             .on('value', snapshot => {
//                 if (snapshot.val() !== null) {
//                     arr = Object.entries(snapshot.val()).map(e => Object.assign(e[1], { key: e[0] }));
//                     switch (type) {
//                         case 'sameLocation': { 
//                             sameLocation = onCheckSameLocationPackage(arr);
//                             differentLocation = onCheckDifferentLocationPackage(arr, sameLocation);
//                             list = onCheckSameLocationMultiPackageAndPickedUpPackage('1', differentLocation, sameLocation); 
//                             break; 
//                         }
//                         case 'differentLocation': { 
//                             sameLocation = onCheckSameLocationPackage(arr);
//                             differentLocation = onCheckDifferentLocationPackage(arr, sameLocation); 
//                             differentLocation = onCheckDifferentLocationPackageButNoPickedUpPackage('1', differentLocation);
//                             break; 
//                         }
                        
//                         default:
//                     }
//                 } else {
//                     arr = [];
//                 }
//                 switch (type) {
//                     case 'sameLocation': { dispatch({ type: GET_SAME_LOCATION_PACKAGE_LIST_SUCCESS, payload: sameLocation }); break; }
//                     case 'differentLocation': { dispatch({ type: GET_DIFFERENT_LOCATION_PACKAGE_LIST_SUCCESS, payload: differentLocation }); break; }
//                     default: dispatch({ type: GET_PACKAGE_LIST_SUCCESS, payload: arr });
//                 }   
//         });
//     };
// };

export const getPackageList = (userId) => {
    return (dispatch) => {
        let sameLocation = [];
        let tmp = [];
        let differentLocation = [];
        let differentLocationHavingNoPickedPackage = [];
        let arr = [];
        let sameLocationHavingNoPickedPackage = [];
        firebase.database().ref('request-ship/')
            .on('value', snapshot => {
                if (snapshot.val() !== null) {
                    arr = Object.entries(snapshot.val()).map(e => Object.assign(e[1], { key: e[0] }));
                    sameLocation = onCheckSameLocationPackage(arr);
                    differentLocation = onCheckDifferentLocationPackage(arr, sameLocation);
                    tmp = onCheckSameLocationPackage(arr);
                    sameLocationHavingNoPickedPackage = onCheckNoPickedUpPackage(userId, tmp);  
                    differentLocationHavingNoPickedPackage = onCheckNoPickedUpPackage(userId, differentLocation);
                } else {
                    arr = [];
                }
                dispatch({ type: GET_SAME_LOCATION_PACKAGE_LIST_SUCCESS, payload: sameLocationHavingNoPickedPackage }); 
                dispatch({ type: GET_DIFFERENT_LOCATION_PACKAGE_LIST_SUCCESS, payload: differentLocationHavingNoPickedPackage }); 
                dispatch({ type: GET_PACKAGE_LIST_SUCCESS, payload: arr });
            });
        };
};

// export const getSameLocationPackageList = () => {
//     return (dispatch) => {
//         let arr = [];
//         firebase.database().ref('request-ship/')
//             .on('value', snapshot => {
//                 if (snapshot.val() !== null) {
//                     arr = Object.entries(snapshot.val()).map(e => Object.assign(e[1], { key: e[0] }));
//                     onCheckSameLocationPackage(arr);
//                 } else {
//                     arr = [];
//                 }
//                 dispatch({ type: GET_SAME_LOCATION_PACKAGE_LIST_SUCCESS, payload: arr });
//         });
//     };
// };

export const getOneLocationPackageList = (item) => {
    return (dispatch) => {
        let arr = [];
        firebase.database().ref('request-ship/')
            .on('value', snapshot => {
                if (snapshot.val() !== null) {
                    arr = Object.entries(snapshot.val()).map(e => Object.assign(e[1], { key: e[0] }));
                    arr = onOneLocationPackageList(arr, item);
                } else {
                    arr = [];
                }
                dispatch({ type: GET_ONE_LOCATION_PACKAGE_LIST, payload: arr });
        });
    };
};

export const getChosenPackageList = (userId) => {
    return (dispatch) => {
        let arr = [];
        let arr2 = [];
        let list = [];
        let sameLocationPackageList = [];
        let diffrentLocationChosenPackageList = [];
        let sameLocationJustHavingChosenPackageList = [];
        let differentPartOfArr = [];
        let samePackageInDifferentPart = [];
        let tmp = [];
        firebase.database().ref('request-ship/')
        .on('value', snapshot => {
            if (snapshot.val() !== null) {
                arr2 = Object.entries(snapshot.val()).map(e => Object.assign(e[1], { key: e[0] }));
                sameLocationPackageList = onCheckSameLocationPackage(arr2);
                tmp = onCheckDifferentLocationPackage(arr2, sameLocationPackageList);
            } else {
                sameLocationPackageList = [];
            }
            
            firebase.database().ref(`shipper/${userId}/request-ship`).orderByChild('status')
            .on('value', sn => {
                if (sn.val() !== null) {
                    arr = Object.entries(sn.val()).map(e => Object.assign(e[1], { key: e[0] }));
                    diffrentLocationChosenPackageList = onCheckDifferentLocationPackage(arr, sameLocationPackageList);
                    diffrentLocationChosenPackageList = onCheckDifferentLocationPackage(diffrentLocationChosenPackageList, tmp);
                    sameLocationJustHavingChosenPackageList = onCheckSameLocationPackage(diffrentLocationChosenPackageList); 
                    list = onCheckDifferentLocationPackage(diffrentLocationChosenPackageList, sameLocationJustHavingChosenPackageList);
                    
                    differentPartOfArr = onCheckDifferentLocationPackage(arr, list);
                    samePackageInDifferentPart = onCheckSameLocationPackage(differentPartOfArr);
                    differentPartOfArr = onCheckDifferentLocationPackage(differentPartOfArr, samePackageInDifferentPart);
                    for (let i = 0; i < differentPartOfArr.length; i++) {
                        samePackageInDifferentPart.push(differentPartOfArr[i]);
                    }
                } else {
                    arr = [];
                }
                dispatch({ type: GET__LIST_HAVING_MULTI_CHOSEN_PACKAGE_AT_ONE_LOCATION, payload: samePackageInDifferentPart });
                dispatch({ type: GET_CHOSEN_PACKAGE_LIST_SUCCESS, payload: list });
            });
        });
    };
};

export const getOneLocationPickedPackageList = (userId, item) => {
    return (dispatch) => {
        let arr = [];
        let i = 0;
        const list = [];
        firebase.database().ref(`shipper/${userId}/request-ship`).orderByChild('status')
            .on('value', snapshot => {
                if (snapshot.val() !== null) {
                    arr = Object.entries(snapshot.val()).map(e => Object.assign(e[1], { key: e[0] }));
                    for (i = 0; i < arr.length; i++) {
                        if (item.pickup_latitude === arr[i].pickup_latitude && item.pickup_longitude === arr[i].pickup_longitude && arr[i].status < 4) {
                            list.push(arr[i]);
                        }
                    }
                } else {
                    arr = [];
                }
                dispatch({ type: GET_ONE_LOCATION_PICKED_PACKAGE_LIST, payload: list });
        });
    };
};

export const getPickedPackageDestinationList = (userId) => {
    return (dispatch) => {
        let arr = [];
        firebase.database().ref(`shipper/${userId}/request-ship`).orderByChild('status')
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
    return (dispatch) => {
        dispatch(waitForCheck());
        setTimeout(() => dispatch({
            type: CHOOSE_PACKAGE,
            payload: coordinates
        }), 500);
    };
};

export const choosePackageError = () => {
    return (dispatch) => {
        dispatch(waitForCheck());
        setTimeout(() => dispatch({
            type: CHOOSE_PACKAGE_ERROR
        }), 500);
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
        let arr = [];
        firebase.database().ref(`shipper/${userId}/request-ship/`).orderByChild('status').equalTo(2)
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
        let arr = [];
        firebase.database().ref(`shipper/${userId}/request-ship`).orderByChild('status').equalTo(3)
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

export const getAllPickedPackageList = (userId) => {
    return (dispatch) => {
        let arr = [];
        firebase.database().ref(`shipper/${userId}/request-ship`).orderByChild('order_by')
            .on('value', snapshot => {
                if (snapshot.val() !== null) {
                    arr = Object.entries(snapshot.val()).map(e => Object.assign(e[1], { key: e[0] }));
                    arr.sort(compare);
                } else {
                    arr = [];
                }
                dispatch({ type: GET_ALL_PICKED_PACKAGE_LIST, payload: arr });
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

export const logOut = () => {
    return (dispatch) => {
        dispatch(loadSpinner());
        setTimeout(() => dispatch({
            type: LOG_OUT,
        }), 500);
    };
};

export const refreshData = () => {
    return {
        type: REFRESH_DATA
    };
};

export const isOnline = (result) => {
    if (result) {
        return {
            type: IS_ONLINE
        };
    } 
    return {
        type: IS_ONLINE_ERROR
    };
};

export const getHistoryList = (result) => {
    return {
        type: GET_HISTORY_LIST,
        payload: result
    };
};

export const getOutCome = (result) => {
    return {
        type: GET_OUT_COME,
        payload: result
    };
};


const onCheckSameLocationPackage = (list) => {
    const sameLocation = [];
    let i = 0;
    let j = 0;
    for (i = 0; i < list.length; i++) {
        for (j = i + 1; j < list.length; j++) {
            if (list[i].pickup_latitude === list[j].pickup_latitude && list[i].pickup_longitude === list[j].pickup_longitude) {
                if (sameLocation.length === 0) {
                    sameLocation.push(list[i]);
                } else {
                    let count = 0;
                    let k = 0;
                    for (k = 0; k < sameLocation.length; k++) {
                        if (list[i].pickup_latitude === sameLocation[k].pickup_latitude && list[i].pickup_longitude === sameLocation[k].pickup_longitude) {
                            count++;
                        }
                    }
                    if (count === 0) {
                        sameLocation.push(list[i]);
                    }
                }
            }
        }
    }
    // console.log(sameLocation);
    return sameLocation;
};

const onCheckDifferentLocationPackage = (packageList, sameLocationPackageList) => {
    const others = [];
    let i = 0;
    let j = 0;
    let count = 0;
    for (i = 0; i < packageList.length; i++) {
        for (j = 0; j < sameLocationPackageList.length; j++) {
           if (packageList[i].pickup_latitude === sameLocationPackageList[j].pickup_latitude && packageList[i].pickup_longitude === sameLocationPackageList[j].pickup_longitude) {
               count++;
           }
        }
        if (count === 0) {
            others.push(packageList[i]);
        }
        count = 0;
    }
    // console.log(others);
    return others;
};

const onOneLocationPackageList = (packageList, item) => {
    let i = 0;
    const list = [];
    for (i = 0; i < packageList.length; i++) {
        if (packageList[i].pickup_latitude === item.pickup_latitude && packageList[i].pickup_longitude === item.pickup_longitude) {
            list.push(packageList[i]);
        }
    }
    return list;
};

// const onDifferentLocationChosenPackageList = (diffrentLocationChosenPackageList, tmp) => {
//     let i = 0;
//     let j = 0;
//     let count = 0;
//     const list = [];
//     for (i = 0; i < diffrentLocationChosenPackageList.length; i++) {
//         for (j = 0; j < tmp.length; j++) {
//             if (diffrentLocationChosenPackageList[i].pickup_latitude === tmp[j].pickup_latitude &&
//                 diffrentLocationChosenPackageList[i].pickup_longitude === tmp[j].pickup_longitude && tmp[j].status === 1) {
//                     count++;
//             }
//         } 
//         if (count === 0) {
//             list.push(diffrentLocationChosenPackageList[i]);
//         }
//     }
//     return list;
// }; 


const onCheckNoPickedUpPackage = (userId, list) => {
    let arr = [];
    const tmp = list;
    let i = 0;
    let j = 0;
    firebase.database().ref(`shipper/${userId}/request-ship`).orderByChild('status')
        .on('value', snapshot => {
            if (snapshot.val() !== null) {
                arr = Object.entries(snapshot.val()).map(e => Object.assign(e[1], { key: e[0] }));
                for (i = 0; i < arr.length; i++) {
                    for (j = 0; j < list.length; j++) {
                        if (arr[i].pickup_latitude === list[j].pickup_latitude && arr[i].pickup_longitude === list[j].pickup_longitude) {
                            tmp.splice(j, 1);
                        }
                    }
                }
            } else {
                arr = [];
            }
    });
    return tmp;
};

const compare = (a, b) => {
    const genreA = a.order_by;
    const genreB = b.order_by;
    
    let comparison = 0;
    if (genreA > genreB) {
      comparison = 1;
    } else if (genreA < genreB) {
      comparison = -1;
    }
    return comparison;
};


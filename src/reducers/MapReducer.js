import { Dimensions } from 'react-native';
import * as Types from '../actions/types';

const INITIAL_STATE = { 
    region: {},   
    predictions: {},
    dropOff: '',
    dropOffObj: {},
    finalDestination: { latitude: null, longitude: null },
    currentLocation: { pickUp: false, dropOff: false },
    arrayMarker: [],
    packageList: [],
    sameLocationPackageList: [],
    oneLocationPackageList: [],
    differentLocationPackageList: [],
    chosenPackageList: [],
    oneLocationPickedPackageList: [],
    packageDetail: [],
    loading: false,
    route: [],
    pickedPackageList: [],
    pickedPackageDestinationList: [],
    deliveringPackageList: [],
    allPackageList: [],
    multiPackageAtOneLocationList: [],
    error: false,
    toogle: false,
    isExisted: false
};
const { width, height } = Dimensions.get('window');
const ASPECT_RATION = width / height;
const LATITUDEDELTA = 0.02;
const LONGTITUDEDELTA = ASPECT_RATION * LATITUDEDELTA;


export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case Types.GET_CURRENT_LOCATION: {
            const LATITUDE = action.payload.coords.latitude;
            const LONGTITUDE = action.payload.coords.longitude;
            return { ...state, 
                region: {
                        latitude: LATITUDE,
                        longitude: LONGTITUDE,
                        latitudeDelta: LATITUDEDELTA,
                        longitudeDelta: LONGTITUDEDELTA
                },
            };
        }
       
        case Types.GET_DROP_OFF: {
            if (action.payload === '') {
                return { ...state,
                    toogle: false,
                    dropOff: action.payload
                };
            } else {
                return { ...state, 
                    dropOff: action.payload,
                    toogle: true
                };
            }
        }
            
            
        case Types.GET_ADDRESS_PREDICTIONS:
            return { ...state, 
                    predictions: action.payload,
            };
        case Types.GET_SELECTED_ADDRESS: 
            return { ...state,
                dropOff: action.payload.name,
                toogle: false,
                finalDestination: {
                    latitude: action.payload.latitude,
                    longitude: action.payload.longitude
                },
            };
            
        case Types.DELETE_RESULT_ADDRESS: 
            return { ...state, 
                dropOff: '',
                toogle: false,
                finalDestination: {
                    latitude: null,
                    longitude: null
                }
            };
            
        case Types.GET_PACKAGE_LIST_SUCCESS:
            console.log(action.payload);
            return { ...state,
                    packageList: action.payload,
            };
        case Types.GET_SAME_LOCATION_PACKAGE_LIST_SUCCESS:
            return { ...state,
                    sameLocationPackageList: action.payload,
            };
        case Types.GET_ONE_LOCATION_PACKAGE_LIST: 
            return { ...state,
                    oneLocationPackageList: action.payload
            };
        case Types.GET_DIFFERENT_LOCATION_PACKAGE_LIST_SUCCESS:
            return { ...state,
                differentLocationPackageList: action.payload,
            };
        
        case Types.GET_CHOSEN_PACKAGE_LIST_SUCCESS:
            return { ...state,
                    chosenPackageList: action.payload,
            };
        case Types.GET_ONE_LOCATION_PICKED_PACKAGE_LIST: 
            return { ...state,
                    oneLocationPickedPackageList: action.payload
            };
        case Types.GET_PACKAGE_DETAIL:
        console.log(action.payload);
            return { ...state,
                    packageDetail: action.payload,
                    loading: true
            };
        case Types.DELETE_DATA: 
            return { ...state,
                    loading: false
            };
        case Types.HAVE_FINAL_DESTINATION:
            return { ...state,
                isExisted: !state.isExisted,
                dropOff: '',
                finalDestination: {
                    latitude: null,
                    longitude: null
                }
            };
        case Types.CHANGE_REGION:
            console.log(action.payload);
            return { ...state,
                region: {
                    latitude: action.payload.latitude,
                    longitude: action.payload.longitude,
                    latitudeDelta: LATITUDEDELTA,
                    longitudeDelta: LONGTITUDEDELTA
                }
            };
        case Types.CHANGE_REGION_1: 
            return { ...state,
                    region: {
                        latitude: action.payload.latitude,
                        longitude: action.payload.longitude,
                        latitudeDelta: action.payload.latitudeDelta,
                        longitudeDelta: action.payload.longitudeDelta
                    }
                };
        case Types.GET_PICKED_PACKAGE_LIST:
            return { ...state,
                pickedPackageList: action.payload
            };
        case Types.GET_DELIVERING_PACKAGE_LIST:
            return { ...state,
                deliveringPackageList: action.payload
            };
        case Types.GET_PICKED_PACKAGE_DESTINATION_LIST:
            return { ...state,
                pickedPackageDestinationList: action.payload
            };
        case Types.FIND_SHORTEST_ROUTE:
            return { ...state,
                route: action.payload
            };
        case Types.GET_ALL_PICKED_PACKAGE_LIST:
            return { ...state,
                allPackageList: action.payload
            };
        case Types.GET__LIST_HAVING_MULTI_CHOSEN_PACKAGE_AT_ONE_LOCATION:
            return { ...state,
                multiPackageAtOneLocationList: action.payload
            };
        
        case Types.REFRESH_DATA: 
            return { ...INITIAL_STATE 
            };
        default:
            return state;
    }
};

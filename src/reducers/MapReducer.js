import { Dimensions } from 'react-native';
import { 
    GET_CURRENT_LOCATION, 
    GET_ADDRESS_PREDICTIONS,
    GET_SELECTED_ADDRESS,
    GET_DROP_OFF,
    DELETE_RESULT_ADDRESS,
    GET_PACKAGE_LIST_SUCCESS,
    GET_PACKAGE_DETAIL,
    DELETE_DATA,
    GET_CHOSEN_PACKAGE_LIST_SUCCESS,
    CHANGE_REGION,
    CHANGE_REGION_1,
    GET_PICKED_PACKAGE_LIST,
    GET_DELIVERING_PACKAGE_LIST,
    GET_PICKED_PACKAGE_DESTINATION_LIST,
    FIND_SHORTEST_ROUTE,
    REFRESH_DATA,
    GET_SAME_LOCATION_PACKAGE_LIST_SUCCESS,
    GET_DIFFERENT_LOCATION_PACKAGE_LIST_SUCCESS,
    GET_ONE_LOCATION_PACKAGE_LIST,
    GET_ONE_LOCATION_PICKED_PACKAGE_LIST,
    GET_ALL_PICKED_PACKAGE_LIST,
    GET__LIST_HAVING_MULTI_CHOSEN_PACKAGE_AT_ONE_LOCATION,
    HAVE_FINAL_DESTINATION
} from '../actions/types';

// import * as Type from '../action/types';
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
        case GET_CURRENT_LOCATION: {
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
       
        case GET_DROP_OFF: {
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
            
            
        case GET_ADDRESS_PREDICTIONS:
            return { ...state, 
                    predictions: action.payload,
            };
        case GET_SELECTED_ADDRESS: 
            return { ...state,
                dropOff: action.payload.name,
                toogle: false,
                finalDestination: {
                    latitude: action.payload.latitude,
                    longitude: action.payload.longitude
                },
            };
            
        case DELETE_RESULT_ADDRESS: 
            return { ...state, 
                dropOff: '',
                toogle: false,
                finalDestination: {
                    latitude: null,
                    longitude: null
                }
            };
            
        case GET_PACKAGE_LIST_SUCCESS:
            console.log(action.payload);
            return { ...state,
                    packageList: action.payload,
            };
        case GET_SAME_LOCATION_PACKAGE_LIST_SUCCESS:
            return { ...state,
                    sameLocationPackageList: action.payload,
            };
        case GET_ONE_LOCATION_PACKAGE_LIST: 
            return { ...state,
                    oneLocationPackageList: action.payload
            };
        case GET_DIFFERENT_LOCATION_PACKAGE_LIST_SUCCESS:
            return { ...state,
                differentLocationPackageList: action.payload,
            };
        
        case GET_CHOSEN_PACKAGE_LIST_SUCCESS:
            return { ...state,
                    chosenPackageList: action.payload,
            };
        case GET_ONE_LOCATION_PICKED_PACKAGE_LIST: 
            return { ...state,
                    oneLocationPickedPackageList: action.payload
            };
        case GET_PACKAGE_DETAIL:
        console.log(action.payload);
            return { ...state,
                    packageDetail: action.payload,
                    loading: true
            };
        case DELETE_DATA: 
            return { ...state,
                    loading: false
            };
        case HAVE_FINAL_DESTINATION:
            return { ...state,
                isExisted: !state.isExisted,
                dropOff: '',
                finalDestination: {
                    latitude: null,
                    longitude: null
                }
            };
        case CHANGE_REGION:
            console.log(action.payload);
            return { ...state,
                region: {
                    latitude: action.payload.latitude,
                    longitude: action.payload.longitude,
                    latitudeDelta: LATITUDEDELTA,
                    longitudeDelta: LONGTITUDEDELTA
                }
            };
        case CHANGE_REGION_1: 
            return { ...state,
                    region: {
                        latitude: action.payload.latitude,
                        longitude: action.payload.longitude,
                        latitudeDelta: action.payload.latitudeDelta,
                        longitudeDelta: action.payload.longitudeDelta
                    }
                };
        case GET_PICKED_PACKAGE_LIST:
            return { ...state,
                pickedPackageList: action.payload
            };
        case GET_DELIVERING_PACKAGE_LIST:
            return { ...state,
                deliveringPackageList: action.payload
            };
        case GET_PICKED_PACKAGE_DESTINATION_LIST:
            return { ...state,
                pickedPackageDestinationList: action.payload
            };
        case FIND_SHORTEST_ROUTE:
            return { ...state,
                route: action.payload
            };
        case GET_ALL_PICKED_PACKAGE_LIST:
            return { ...state,
                allPackageList: action.payload
            };
        case GET__LIST_HAVING_MULTI_CHOSEN_PACKAGE_AT_ONE_LOCATION:
            return { ...state,
                multiPackageAtOneLocationList: action.payload
            };
        
        case REFRESH_DATA: 
            return { ...INITIAL_STATE 
            };
        default:
            return state;
    }
};

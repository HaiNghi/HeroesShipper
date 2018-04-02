import { Dimensions } from 'react-native';
import { 
    GET_CURRENT_LOCATION, 
    TOOGLE_SEARCH_RESULT, 
    GET_ADDRESS_PREDICTIONS,
    GET_SELECTED_ADDRESS,
    GET_PICK_UP,
    GET_DROP_OFF,
    DELETE_RESULT_ADDRESS,
    GET_PACKAGE_LIST_SUCCESS,
    GET_PACKAGE_DETAIL,
    DELETE_DATA,
    GET_CHOSEN_PACKAGE_LIST_SUCCESS,
    CHANGE_REGION,
    GET_PICKED_PACKAGE_LIST,
    GET_DELIVERING_PACKAGE_LIST
} from '../actions/types';

const INITIAL_STATE = { 
    region: {}, 
    inputData: {}, 
    resultTypes: {}, 
    predictions: {},
    pickUp: '',
    dropOff: '',
    pickUpObj: {},
    dropOffObj: {},
    nextRegion: {},
    pickUpRegion: {},
    currentLocation: { pickUp: false, dropOff: false },
    arrayMarker: [],
    deleted: false,
    packageList: [],
    chosenPackageList: [],
    packageDetail: [],
    loading: false,
    route: [],
    pickedPackageList: [],
    deliveringPackageList: []
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
                
                pickUpRegion: {
                    latitude: LATITUDE,
                    longitude: LONGTITUDE,
                    latitudeDelta: LATITUDEDELTA,
                    longitudeDelta: LONGTITUDEDELTA
                },
                pickUp: '',
                dropOff: '',
                nextRegion: {
                    latitude: null,
                    longitude: null,
                    latitudeDelta: null,
                    longitudeDelta: null
                },
                };
            }
       
        case GET_PICK_UP:
            return { ...state, 
                    pickUp: action.payload,
                    region: state.pickUpRegion,
            };
        case GET_DROP_OFF:
            return { ...state, 
                    dropOff: action.payload,
            };
        case TOOGLE_SEARCH_RESULT: {
            if (action.payload === 'pickUp') {
                return { ...state, 
                        resultTypes: { pickUp: true, dropOff: false }, 
                        predictions: {},
                     };
            } else {
                return { ...state, 
                    resultTypes: { pickUp: false, dropOff: true }, 
                    predictions: {},
                };
            }
        }
        case GET_ADDRESS_PREDICTIONS:
            return { ...state, 
                    predictions: action.payload,
            };
        case GET_SELECTED_ADDRESS: {
            console.log(state.resultTypes.pickUp);
            if (state.resultTypes.pickUp) {
                return { ...state,
                        resultTypes: { pickUp: false, dropOff: false }, 
                        pickUp: action.payload.name,
                        region: {
                            latitude: action.payload.latitude,
                            longitude: action.payload.longitude,
                            latitudeDelta: LATITUDEDELTA,
                            longitudeDelta: LONGTITUDEDELTA
                        },
                        pickUpRegion: state.region,
                        currentLocation: { pickUp: !state.currentLocation.pickUp, dropOff: state.currentLocation.dropOff },
                      
                        // arrayMarker:[...state.arrayMarker,pickUpRegion]
                };
            } else {
                return { ...state,
                    dropOff: action.payload.name,
                    resultTypes: { pickUp: false, dropOff: false }, 
                    nextRegion: {
                        latitude: action.payload.latitude,
                        longitude: action.payload.longitude,
                        latitudeDelta: LATITUDEDELTA,
                        longitudeDelta: LONGTITUDEDELTA
                    },
                    currentLocation: { pickUp: state.currentLocation.pickUp, 
                                    dropOff: !state.currentLocation.dropOff },
                    // arrayMarker:[...state.arrayMarker,nextRegion]
                };
            }
        }
        case DELETE_RESULT_ADDRESS: {
            console.log(state.pickUpRegion);
            if (action.payload === 'pickUp') {
                return { ...state, 
                        pickUp: '',
                        resultTypes: { pickUp: false, dropOff: false }, 
                        deleted: true,
                        region: state.pickUpRegion,
                };
            } else {
                return { ...state, 
                    dropOff: '',
                    resultTypes: { pickUp: false, dropOff: false }, 
                    deleted: true,
                    nextRegion: {
                        latitude: null,
                        longitude: null,
                        latitudeDelta: null,
                        longitudeDelta: null
                    },
                    packageDetail: [],
                };
            }
        }
        case GET_PACKAGE_LIST_SUCCESS:
            console.log(action.payload);
            return { ...state,
                    packageList: action.payload,
            };
        case GET_CHOSEN_PACKAGE_LIST_SUCCESS:
            return { ...state,
                    chosenPackageList: action.payload,
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
        case CHANGE_REGION:
        console.log(action.payload);
            return { ...state,
                region: action.payload
            };
        case GET_PICKED_PACKAGE_LIST:
            return { ...state,
                pickedPackageList: action.payload
            };
        case GET_DELIVERING_PACKAGE_LIST:
            return { ...state,
                deliveringPackageList: action.payload
            };
        default:
            return state;
    }
};

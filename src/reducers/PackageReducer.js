import { 
    CHOOSE_PACKAGE,
    LOAD_SPINNER,
    VERIFY_RECEIVING_PACKAGE,
    VERIFY_RECEIVING_PACKAGE_FAILED,
    DISABLE_MODAL,
    VERIFY_DELIVERING_SUCCESS,
    GET_HISTORY_LIST,
    GET_OUT_COME,
    CHOOSE_PACKAGE_ERROR
} from '../actions/types';

const INITIAL_STATE = { 
    route: [],
    loading: false,
    success: false,
    message: '',
    historyList: [],
    outCome: '',
    fail: false,
    error: false
};

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case CHOOSE_PACKAGE:
            return { ...state,
                    route: action.payload,
                    error: false
            };
        case CHOOSE_PACKAGE_ERROR:
            return { ...state,
                error: true
            };
        case LOAD_SPINNER: 
            return { ...state,
                loading: !state.loading
            };
        case VERIFY_RECEIVING_PACKAGE:
            return { ...state,
                success: true,
                message: action.payload
            };
        case VERIFY_RECEIVING_PACKAGE_FAILED:
            return { ...state,
                fail: true,
                message: action.payload
            };
        case DISABLE_MODAL:
            return { ...state,
                fail: false,
                success: false
            };
        case VERIFY_DELIVERING_SUCCESS: 
            return { ...state,
                success: true,
                message: action.payload
            };
        case GET_HISTORY_LIST: 
            return { ...state,
                    historyList: action.payload
            };
        case GET_OUT_COME: 
            return { ...state,
                    outCome: action.payload
            };
        default:
            return state;
    }
};

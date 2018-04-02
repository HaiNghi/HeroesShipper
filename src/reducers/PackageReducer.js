import { 
    CHOOSE_PACKAGE,
    LOAD_SPINNER,
    VERIFY_RECEIVING_PACKAGE,
    VERIFY_RECEIVING_PACKAGE_FAILED,
    DISABLE_MODAL,
    VERIFY_DELIVERING_SUCCESS
} from '../actions/types';

const INITIAL_STATE = { 
    route: [],
    loading: false,
    success: false,
    message: '',
    fail: false,
};

export default (state = INITIAL_STATE, action) => {
    console.log(action);
    switch (action.type) {
        case CHOOSE_PACKAGE:
            return { ...state,
                    route: action.payload
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
        default:
            return state;
    }
};

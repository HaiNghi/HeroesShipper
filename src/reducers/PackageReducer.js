import * as Types from '../actions/types';

const INITIAL_STATE = { 
    route: [],
    loading: false,
    success: false,
    message: '',
    historyList: [],
    outCome: { daily: { total: '' }, weekly: { total: '' } },
    fail: false,
    error: false
};

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case Types.CHOOSE_PACKAGE:
            return { ...state,
                    route: action.payload,
                    error: false
            };
        case Types.CHOOSE_PACKAGE_ERROR:
            return { ...state,
                error: true
            };
        case Types.LOAD_SPINNER: 
            return { ...state,
                loading: !state.loading
            };
        case Types.VERIFY_RECEIVING_PACKAGE:
            return { ...state,
                success: true,
                message: action.payload
            };
        case Types.VERIFY_RECEIVING_PACKAGE_FAILED:
            return { ...state,
                fail: true,
                message: action.payload
            };
        case Types.DISABLE_MODAL:
            return { ...state,
                fail: false,
                success: false
            };
        case Types.VERIFY_DELIVERING_SUCCESS: 
            return { ...state,
                success: true,
                message: action.payload
            };
        case Types.GET_HISTORY_LIST: 
            return { ...state,
                    historyList: action.payload
            };
        case Types.GET_OUT_COME: 
            return { ...state,
                    outCome: { daily: { total: action.payload.daily.total }, weekly: { total: action.payload.weekly.total } }
            };
        default:
            return state;
    }
};

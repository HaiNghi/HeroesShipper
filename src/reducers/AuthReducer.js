import * as Types from '../actions/types';

const INITIAL_STATE = { 
    email: '',
    password: '',
    loginSuccess: '',
    loading: false,
    success: false,
    fail: false,
    errorCode: '',
    showModal: false,
    logOutSuccess: false,
    status: false,
    isOnlineError: false
};

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case Types.INPUT_EMAIL:
            return { ...state,
                    email: action.payload,
            };
        case Types.INPUT_PASSWORD: {
            return { ...state,
                password: action.payload,
                fail: false
            };
        }
        case Types.LOGIN_SUCCESS: {
            return { ...state,
                ...INITIAL_STATE,
                success: true
            };
        }
        case Types.LOGIN_FAIL: {
            return { ...state,
                fail: true,
                showModal: true,
                errorCode: action.payload
            };
        }
        case Types.LOADING: {
            return { ...state,
                    loading: !state.loading,
            };
        }
        case Types.DISABLE_MODAL: {
            return { ...state,
                    showModal: false,
                    password: ''
            };
        }
        case Types.LOG_OUT: {
            return { ...INITIAL_STATE,
                logOutSuccess: true,
            };
        }
        case Types.IS_ONLINE: {
            return { ...state,
                status: !state.status,
                isOnlineError: false
            };
        }
        case Types.IS_ONLINE_ERROR: {
            return { ...state,
                isOnlineError: true
            };
        }
        default:
            return state;
    }
};

import { 
    CHOOSE_PACKAGE,
} from '../actions/types';

const INITIAL_STATE = { 
    route: [],
};

export default (state = INITIAL_STATE, action) => {
    console.log(action);
    switch (action.type) {
        case CHOOSE_PACKAGE:
            return { ...state,
                    route: action.payload
            };
        
        default:
            return state;
    }
};

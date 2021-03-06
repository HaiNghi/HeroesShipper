import { combineReducers } from 'redux'; 
import AuthReducer from './AuthReducer';
import MapReducer from './MapReducer';
import PackageReducer from './PackageReducer';

export default combineReducers({
    auth: AuthReducer,
    map: MapReducer,
    package: PackageReducer
});

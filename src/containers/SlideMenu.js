import { connect } from 'react-redux';

import SlideMenu from '../components/SlideMenu';
import {
    logOut,
    loadSpinner,
    refreshData
} from '../actions';
import { processLogOut } from '../api/api';

const mapStateToProps = (state) => ({
    loading: state.auth.loading,
    logOutSuccess: state.auth.logOutSuccess
});

const mapDispatchToProps = (dispatch) => ({
    logOut: () => {
        processLogOut(dispatch, logOut);
    },
    loadingSpinner: () => {
        dispatch(loadSpinner());
    },
    refreshData: () => {
        dispatch(refreshData());
    }
});

export default connect(mapStateToProps, mapDispatchToProps)(SlideMenu);

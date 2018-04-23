import { connect } from 'react-redux';

import DeliveryDetail from '../components/DeliveryDetail';
import {
    deleteData,
    choosePackage,
    choosePackageError,
    waitForCheck
} from '../actions';
import { doChoosePackage } from '../api/api';

const mapStateToProps = (state) => ({
    // loading: state.map.loading,
    route: state.package.route,
    error: state.package.error,
    loading: state.package.loading
});

const mapDispatchToProps = (dispatch) => ({
    deleteData: () => {
        dispatch(deleteData());
    },
    waitForCheck: () => {
        dispatch(waitForCheck());
    },
    choosePackage: (packageId) => {
        doChoosePackage(dispatch, choosePackage, choosePackageError, packageId);
    },
    
});

export default connect(mapStateToProps, mapDispatchToProps)(DeliveryDetail);

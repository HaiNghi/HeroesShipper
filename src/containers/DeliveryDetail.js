import { connect } from 'react-redux';

import DeliveryDetail from '../components/DeliveryDetail';
import * as Actions from '../actions';
import * as API from '../api/api';

const mapStateToProps = (state) => ({
    // loading: state.map.loading,
    route: state.package.route,
    error: state.package.error,
    loading: state.package.loading
});

const mapDispatchToProps = (dispatch) => ({
    deleteData: () => {
        dispatch(Actions.deleteData());
    },
    waitForCheck: () => {
        dispatch(Actions.waitForCheck());
    },
    choosePackage: (packageId) => {
        API.doChoosePackage(dispatch, Actions.choosePackage, Actions.choosePackageError, packageId);
    },
    
});

export default connect(mapStateToProps, mapDispatchToProps)(DeliveryDetail);

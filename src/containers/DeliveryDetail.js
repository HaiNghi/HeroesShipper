import { connect } from 'react-redux';

import DeliveryDetail from '../components/DeliveryDetail';
import {
    deleteData,
    choosePackage
} from '../actions';
import { doChoosePackage } from '../api/api';

const mapStateToProps = (state) => ({
    // loading: state.map.loading,
    route: state.package.route
});

const mapDispatchToProps = (dispatch) => ({
    deleteData: () => {
        dispatch(deleteData());
    },
    choosePackage: (packageId) => {
        doChoosePackage(dispatch, choosePackage, packageId);
    }
});

export default connect(mapStateToProps, mapDispatchToProps)(DeliveryDetail);

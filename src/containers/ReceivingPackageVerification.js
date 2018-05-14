import { connect } from 'react-redux';

import ReceivingPackageVerification from '../components/ReceivingPackageVerification';
import * as Actions from '../actions';
import * as API from '../api/api';

const mapStateToProps = (state) => ({
   success: state.package.success,
   fail: state.package.fail,
   message: state.package.message,
   loading: state.package.loading
});

const mapDispatchToProps = (dispatch) => ({
    verifyCodeForReceivingPackage: (verifyCode, packageId) => {
        API.processVerificationForReceivingPackage(dispatch, Actions.verifyCodeForReceivingPackage, 
            Actions.verifyCodeForReceivingPackageFailed, verifyCode, packageId);
    },
    waitForCheck: () => {
        dispatch(Actions.waitForCheck());
    },
    disableModal: () => {
        dispatch(Actions.disableModal());
    },
    verifyCodeForDeliveringSuccess: (verifyCode, packageId) => {
        API.processVerifyCodeForDeliveringSuccess(dispatch, Actions.verifyCodeForDeliveringSuccess, 
            Actions.verifyCodeForReceivingPackageFailed, verifyCode, packageId);
    },
    deleteData: () => {
        dispatch(Actions.deleteData());
    },
});

export default connect(mapStateToProps, mapDispatchToProps)(ReceivingPackageVerification);

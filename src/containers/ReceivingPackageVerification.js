import { connect } from 'react-redux';

import ReceivingPackageVerification from '../components/ReceivingPackageVerification';
import {
    verifyCodeForReceivingPackage,
    verifyCodeForReceivingPackageFailed,
    waitForCheck,
    disableModal,
    verifyCodeForDeliveringSuccess
} from '../actions';
import { processVerificationForReceivingPackage, 
        processVerifyCodeForDeliveringSuccess
} from '../api/api';

const mapStateToProps = (state) => ({
   success: state.package.success,
   fail: state.package.fail,
   message: state.package.message,
   loading: state.package.loading
});

const mapDispatchToProps = (dispatch) => ({
    verifyCodeForReceivingPackage: (verifyCode, packageId) => {
        processVerificationForReceivingPackage(dispatch, verifyCodeForReceivingPackage, verifyCodeForReceivingPackageFailed, verifyCode, packageId);
    },
    waitForCheck: () => {
        dispatch(waitForCheck());
    },
    disableModal: () => {
        dispatch(disableModal());
    },
    verifyCodeForDeliveringSuccess: (verifyCode, packageId) => {
        processVerifyCodeForDeliveringSuccess(dispatch, verifyCodeForDeliveringSuccess, verifyCodeForReceivingPackageFailed, verifyCode, packageId);
    }
});

export default connect(mapStateToProps, mapDispatchToProps)(ReceivingPackageVerification);

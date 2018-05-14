import { connect } from 'react-redux';

import Histories from '../components/Histories';
import * as Actions from '../actions';
import * as API from '../api/api';

const mapStateToProps = (state) => ({
    historyList: state.package.historyList,
    outCome: state.package.outCome || {}
});

const mapDispatchToProps = (dispatch) => ({
    // loading: () => {
    //     dispatch(loading());
    // },
    getHistoryList: () => {
        API.processGettingHistoryList(dispatch, Actions.getHistoryList);
    },
    getOutCome: () => {
        API.processGetOutCome(dispatch, Actions.getOutCome);
    }
});

export default connect(mapStateToProps, mapDispatchToProps)(Histories);


import { connect } from 'react-redux';

import Histories from '../components/Histories';
import {
    // loading,
    getHistoryList,
    getOutCome
} from '../actions';
import { processGettingHistoryList, processGetOutCome } from '../api/api';

const mapStateToProps = (state) => ({
    historyList: state.package.historyList,
    outCome: state.package.outCome
});

const mapDispatchToProps = (dispatch) => ({
    // loading: () => {
    //     dispatch(loading());
    // },
    getHistoryList: () => {
       processGettingHistoryList(dispatch, getHistoryList);
    },
    getOutCome: () => {
        processGetOutCome(dispatch, getOutCome);
    }
});

export default connect(mapStateToProps, mapDispatchToProps)(Histories);


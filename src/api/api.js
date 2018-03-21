import axios from 'axios';
import { Alert, AsyncStorage } from 'react-native';

const baseURL = 'http://192.168.21.181:8000';
// const baseURL = 'http://127.0.0.1:8000';
// const baseURL = 'http://ec2-34-231-21-217.compute-1.amazonaws.com:8000';
let user = [];
AsyncStorage.getItem('user_info', (error, result) => {
        user = JSON.parse(result);
});

export const processLogin = (dispatch, loginSuccess, loginFail, loadSpinner, email, password) => {
        axios.post(`${baseURL}/api/login`, {
                email,
                password
        }).then((response) => {
                console.log(response);
                AsyncStorage.setItem('user_info', JSON.stringify(response.data.data));
                dispatch(loginSuccess());
        }).catch((error) => {
                // dispatch(loadSpinner());
                dispatch(loginFail(error.response.status));
                // if (error.response.status === 422) {
                //         Alert.alert('Invalid address');
                // } else {
                //         Alert.alert('Login failed', 'Unable to login, either email nor password is uncorrect.');
                // }
                console.log(error.response);
                // Alert(error.response.data.error.)
        });
};
export const doGetPackageDetail = (dispatch, getPackageDetail, index) => {
        axios.get(`${baseURL}/api/requestShips/${index}`, {
                headers: { Authorization: `Bearer ${user.token}` }
        })
        .then((response) => {
                console.log(response);
                dispatch(getPackageDetail(response.data.data));
        })
        .catch((error) => {
                Alert.alert(error.message);
        });   
};

export const doChoosePackage = (dispatch, choosePackage, packageId) => {
        console.log(user.token);
        axios.post(`${baseURL}/api/shipper/trip`, 
                {
                        request_ship_id: packageId
                }, {
                        headers: { Authorization: `Bearer ${user.token}`  
                }
        }).then((response) => {
                console.log(response.data.data);
                dispatch(choosePackage(response.data.data));
        }).catch((error) => {
                Alert.alert(error.message);
        });
};
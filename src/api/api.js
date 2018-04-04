import axios from 'axios';
import { Alert, AsyncStorage } from 'react-native';

// const baseURL = 'http://192.168.21.181:8000';
// const baseURL = 'http://127.0.0.1:8000';
const baseURL = 'http://ec2-34-231-21-217.compute-1.amazonaws.com:8000';
let user = [];
export const processLogin = (dispatch, loginSuccess, loginFail, loadSpinner, email, password) => {
        axios.post(`${baseURL}/api/login`, {
                email,
                password
        }).then((response) => {
                console.log(response);
                switch (response.data.data.role_id) {
                        case 2: {
                                AsyncStorage.setItem('user_info', JSON.stringify(response.data.data));
                                AsyncStorage.getItem('user_info', (error, result) => {
                                        user = JSON.parse(result);
                                        console.log('1');
                                });
                                dispatch(loginSuccess());
                                break;
                        }
                        default: {
                                dispatch(loginFail('Unable to login. Try again!'));
                                break;
                        }
                }
        }).catch((error) => {
                dispatch(loginFail(error.response.status));
                console.log(error.response);
        });
};
export const doGetPackageDetail = (dispatch, getPackageDetail, index) => {
        AsyncStorage.getItem('user_info', (error, result) => {
                user = JSON.parse(result);
        });
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
export const processVerificationForReceivingPackage = (dispatch, verifyCodeForReceivingPackage, 
                                                        verifyCodeForReceivingPackageFailed,
                                                        verifyCode, packageId) => {
        console.log(verifyCode, packageId); 

        axios.put(`${baseURL}/api/shipper/trip/${packageId}`, 
        { po_verification_code: verifyCode }, 
        { headers: { Authorization: `Bearer ${user.token}` }
        }).then((response) => {
                console.log(response);
                dispatch(verifyCodeForReceivingPackage(response.data.message));
                // } else {
                //         dispatch(verifyCodeForReceivingPackageFailed(response.data.data.message));
                // }
        }).catch((error) => {
                dispatch(verifyCodeForReceivingPackageFailed(error.response.data.message));
                console.log(error.response);
        });
};

export const processVerifyCodeForDeliveringSuccess = (dispatch, verifyCodeForDeliveringPackage, 
                                                        verifyCodeForReceivingPackageFailed,
                                                        verifyCode, packageId) => {
        console.log(verifyCode, packageId); 

        axios.put(`${baseURL}/api/receiver/trip/${packageId}`, 
                { receiver_verification_code: verifyCode }, 
                { headers: { Authorization: `Bearer ${user.token}` }
        }).then((response) => {
                console.log(response);
                dispatch(verifyCodeForDeliveringPackage(response.data.message));
        }).catch((error) => {
                dispatch(verifyCodeForReceivingPackageFailed(error.response.data.message));
                console.log(error.response);
        });
};

export const processUpdatingCurrentPositon = (shipperId, currentLatitude, currentLongitude) => {
        console.log(shipperId, currentLatitude, currentLongitude);
        axios.put(`${baseURL}/api/shippers/${shipperId}`, 
                { latitude: currentLatitude,
                  longitude: currentLongitude      
                }, 
                { headers: { Authorization: `Bearer ${user.token}` }
        }).then((response) => {
                console.log(response);
        }).catch((error) => {
                console.log(error.response);
        });
};

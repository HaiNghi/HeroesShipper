import axios from 'axios';
import { Alert, AsyncStorage } from 'react-native';

// const baseURL = 'http://192.168.21.181:8000';
// const baseURL = 'http://127.0.0.1:8000';
// const baseURL = 'http://ec2-34-231-21-217.compute-1.amazonaws.com:8000';
const baseURL = 'http://ec2-54-198-63-122.compute-1.amazonaws.com';
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
                                AsyncStorage.setItem('is_online', `${response.data.data.is_online}`);
                                AsyncStorage.getItem('user_info', (error, result) => {
                                        user = JSON.parse(result);
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
                dispatch(getPackageDetail(response.data.data));
        })
        .catch((error) => {
                Alert.alert(error.message);
        });   
};

export const doChoosePackage = (dispatch, choosePackage, choosePackageError, packageId) => {
        axios.post(`${baseURL}/api/shipper/trip`, 
                {
                        request_ship_id: packageId
                }, {
                        headers: { Authorization: `Bearer ${user.token}`  
                }
        }).then((response) => {
                console.log(response.data);
                dispatch(choosePackage(response.data.data));
        }).catch((error) => {
                console.log(error);
                dispatch(choosePackageError());
        });
};
export const processVerificationForReceivingPackage = (dispatch, verifyCodeForReceivingPackage, 
                                                        verifyCodeForReceivingPackageFailed,
                                                        verifyCode, packageId) => {
        axios.put(`${baseURL}/api/shipper/trip/${packageId}`, 
        { po_verification_code: verifyCode }, 
        { headers: { Authorization: `Bearer ${user.token}` }
        }).then((response) => {
                dispatch(verifyCodeForReceivingPackage(response.data.message));
        }).catch((error) => {
                dispatch(verifyCodeForReceivingPackageFailed(error.response.data.message));
                console.log(error.response);
        });
};

export const processVerifyCodeForDeliveringSuccess = (dispatch, verifyCodeForDeliveringPackage, 
                                                        verifyCodeForReceivingPackageFailed,
                                                        verifyCode, packageId) => {
        axios.put(`${baseURL}/api/receiver/trip/${packageId}`, 
                { receiver_verification_code: verifyCode }, 
                { headers: { Authorization: `Bearer ${user.token}` }
        }).then((response) => {
                dispatch(verifyCodeForDeliveringPackage(response.data.message));
        }).catch((error) => {
                dispatch(verifyCodeForReceivingPackageFailed(error.response.data.message));
                console.log(error.response);
        });
};

export const processUpdatingCurrentPositon = (shipperId, currentLatitude, currentLongitude) => {
        // console.log(shipperId, currentLatitude, currentLongitude);
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

export const processFindingShortestRoute = (dispatch, findShortestRoute, latitude, longitude) => {
        console.log(latitude, longitude);
        let URL = '';
        (latitude === null) ? URL = `${baseURL}/api/shortestRoute` 
        : URL = `${baseURL}/api/shortestRoute?destination={"latitude":${latitude}, "longitude":${longitude}}`;
        console.log(URL);
        axios.get(URL, {
                headers: { Authorization: `Bearer ${user.token}` }
        })
        .then((response) => {
                dispatch(findShortestRoute(response.data.data));
        })
        .catch((error) => {
                Alert.alert(error.message);
        });   
};

export const processLogOut = (dispatch, logOut) => {
        axios.get(`${baseURL}/api/logout`, {
                headers: { Authorization: `Bearer ${user.token}` }
        })
        .then((response) => {
                dispatch(logOut());
        })
        .catch((error) => {
                Alert.alert(error.message);
        });   
};

export const processIsOnline = (dispatch, isOnline) => {
        let status = 0;
        axios.get(`${baseURL}/api/shipper/online`, 
         { headers: { Authorization: `Bearer ${user.token}` }
        }).then((response) => {
                AsyncStorage.getItem('is_online', (error, result) => {
                        if (result === '0') {
                                status = 1;
                        } 
                        AsyncStorage.setItem('is_online', `${status}`);
                });
                dispatch(isOnline(response.data.success));
        }).catch((error) => {
                Alert.alert(error.message);
        });      
};

export const processGettingHistoryList = (dispatch, getHistoryList) => {
        axios.get(`${baseURL}/api/shipper/trip`, {
                headers: { Authorization: `Bearer ${user.token}` } 
        })
        .then((response) => {
                dispatch(getHistoryList(response.data.data));
        })
        .catch((error) => {
                Alert.alert(error.message);
        });   
};

export const processGetOutCome = (dispatch, getOutCome) => {
        axios.get(`${baseURL}/api/shipper/outcome`, {
                headers: { Authorization: `Bearer ${user.token}` } 
        })
        .then((response) => {
                dispatch(getOutCome(response.data.data.daily.total));
        })
        .catch((error) => {
                Alert.alert(error.message);
        });  
};

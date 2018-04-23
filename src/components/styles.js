import { StyleSheet } from 'react-native';

export const LoginFormStyle = StyleSheet.create({
    headerStyle: { 
        backgroundColor: '#ff5e3a', 
        opacity: 0.75, 
        flex: 1
    },
    innerStyle: { 
        flexDirection: 'row', 
        marginTop: 30, 
        justifyContent: 'center' 
    },
    headerTextStyle: { 
        fontSize: 30, 
        fontWeight: 'bold', 
        color: '#fff' 
    },
    secondBodyStyle: { 
        margin: 30, 
        justifyContent: 'center' 
    },
    textStyle: {
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: 20
    },
    inputBackGroundStyle: {
        backgroundColor: '#fff' 
    },
    secondInputStyle: { 
        marginLeft: 20, 
        marginRight: 20, 
        marginBottom: 20 
    },
    buttonStyle: {
        margin: 20, 
        backgroundColor: '#006600' 
    }
});

export const SlideMenuStyle = StyleSheet.create({
    imageIconStyle: {
        height: 25, 
        width: 25, 
        marginLeft: 20, 
        padding: 10 
    },
    drawerItemStyle: {
        flexDirection: 'row', 
        justifyContent: 'center', 
        flex: 1,  
        paddingTop: 10, 
        paddingLeft: 10, 
        paddingRight: 10,
        marginTop: 10
    },
    drawerItemText: {
        marginLeft: 10, 
        flex: 1, 
        alignItems: 'center',  
        padding: 7, 
        alignSelf: 'center',
        fontSize: 15,
    },
    avatar: { 
        width: 90, 
        height: 90, 
        marginBottom: 10 
    },
});

export const RegisterStyle = StyleSheet.create({
    textStyle: {
        textAlign: 'center',
        color: '#fff',
        fontSize: 12,
        fontStyle: 'italic'
    },
});

export const styles = StyleSheet.create({
    containerStyle: {
        backgroundColor: '#E9E9E9' 
    },
    
    textStyle: {
        fontSize: 17,
        textAlign: 'center',
        justifyContent: 'center',
        lineHeight: 30,
        color: 'black',
        fontWeight: 'bold',
        marginBottom: 15,
        marginTop: 15
    },
    //Modal
    innerContainer: {
        alignItems: 'center',
        height: 205,
        backgroundColor: '#fff',
        opacity: 1
        
    },
    imageStyle: {
        width: 50, 
        height: 50, 
        marginTop: 15
    },
    spinnerContainer: {
        flex: 1, 
        flexDirection: 'column', 
        alignItems: 'center' 
    }
});
export const AccountValidation = StyleSheet.create({
    viewDirection: {
        flexDirection: 'row', 
        margin: 20
    },
    inputWrapperValidation: {
        flex: 2, 
        backgroundColor: '#fff', 
        marginRight: 10
    },
    buttonValidation: {
        alignSelf: 'center', 
        backgroundColor: '#ff5e3a'
    },
    imageValidation: {
        width: 150,
        height: 150,
        justifyContent: 'center',
        alignItems: 'center'
    }
 });
 
export const DeliveryDetailStyle = StyleSheet.create({
    map: {
        ...StyleSheet.absoluteFillObject
    },
    mapContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    viewContainer: {
        position: 'absolute', 
        backgroundColor: '#000000', 
        opacity: 0.85, 
        flex: 1, 
        width: '100%', 
        height: '100%'
    },
    innerWrapper: {
        flex: 1, 
        flexDirection: 'row', 
        height: 60, 
        margin: 10, 
    },
    contentPosition: {
        alignSelf: 'flex-start',
    },
    textStyle: {
        color: '#fff',
        margin: 5,
        textAlign: 'justify'
    },
    imageStyle: {
        width: 80,
        height: 80
    },
    submitButton: { 
        bottom: 1, 
        flex: 1, 
        alignItems: 'center', 
        position: 'relative', 
        marginTop: 30 
    }
});

export const HistoryStyle = StyleSheet.create(
    {
        container: { 
            alignSelf: 'center', 
            justifyContent: 'center', 
            alignItems: 'center', 
            margin: 15 
        },
        title: { 
            fontSize: 16, 
            textAlign: 
            'center', 
            fontWeight: 
            'bold', 
            marginBottom: 20
        }
    }
);
 

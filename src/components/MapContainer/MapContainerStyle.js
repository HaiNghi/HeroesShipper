import { StyleSheet } from 'react-native';

const styles = {
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    map: {
        ...StyleSheet.absoluteFillObject
    },
    innerContainer: {
        alignItems: 'center',
        height: 400,
        backgroundColor: '#fff',
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
    imageStyle: { 
        width: 50, 
        height: 50, 
        marginTop: 15 
    },

    //Map.CallOut
    mapCallOut: { 
        flexWrap: 'wrap', 
        width: 150, 
        height: 100, 
        borderRadius: 7, 
        padding: 5,
        backgroundColor: '#fff'
    },
    labelStyle: { 
        fontWeight: 'bold', 
        fontSize: 12,
        color: 'black'
    },
    spinnerContainer: {
        flex: 1, 
        flexDirection: 'column', 
        alignSelf: 'center'
    },
    modalButton: { 
        borderRadius: 7, 
        marginRight: 20, 
        paddingLeft: 20, 
        paddingRight: 20 
    },
    //button show package list
    buttonWrapper: { 
        bottom: 10,
        position: 'absolute',
        flexDirection: 'row',
        // alignSelf: 'flex-end',
        justifyContent: 'space-between',
        alignSelf: 'center',
        // marginRight: 20,
        marginLeft: 10,
   },
   buttonModal: { 
        width: 20, 
        height: 20, 
        marginLeft: 8
    },
    //modal show package list
    modalStyle: {
        flexDirection: 'column', 
        flex: 1, 
        marginRight: 20
    },
    iconStyle: {
        width: 20, 
        height: 20, 
        marginLeft: 2,
        marginRight: 5
    },

    // modal show package info in package list
    packageInfoModal: { 
        margin: 20, 
        backgroundColor: '#fff', 
        borderRadius: 10 
    },
    innerWrapper: { 
        flexWrap: 'wrap', 
        flexDirection: 'row', 
        padding: 10 
    },
    packageId: { 
        textAlign: 'center', 
        fontWeight: 'bold', 
        fontSize: 14, 
        margin: 10 
    },
    straightLine: { 
        borderWidth: 0.4, 
        borderColor: 'gray', 
        marginTop: 7 
    },

    // receive button
    viewContainer: {
        flexDirection: 'row', 
        marginRight: 10, 
        alignItems: 'center'
    },
    titleStyle: {
        textAlign: 'center', 
        padding: 10, 
        fontSize: 16
    },
    numberViewContainer: {
        width: 20, 
        height: 20, 
        borderRadius: 5, 
        backgroundColor: '#fff', 
        alignItems: 'center' 
    },
    numberText: {
        color: '#000', 
        fontWeight: 'bold'
    }

    
};

export default styles;

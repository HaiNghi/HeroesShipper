import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import styles from './styles';

const SubmitButton = ({ children, onPress, style }) => {
    return (
        <View style={styles.buttonStyle}>
             <TouchableOpacity style={[styles.buttonInnerStyle, style]} onPress={onPress}>
                <Text style={styles.textStyle}>{ children }</Text>
           </TouchableOpacity>
        </View> 

    );
};

export { SubmitButton };


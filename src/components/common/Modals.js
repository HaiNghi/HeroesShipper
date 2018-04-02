import React from 'react';
import { View } from 'react-native';
import { Button, Text } from 'native-base';
import Modal from 'react-native-modal';
import styles from './styles';

const Modals = ({ title, subtitle, isVisible, onPress }) => {
    return (
        <Modal isVisible={isVisible}>
            <View style={styles.modalContainer}>
                <View>
                    <Text style={styles.titleStyle}>{title}</Text>
                    <Text note style={styles.subtitleStyle}>{subtitle}</Text>
                </View>
                <View style={{ borderWidth: 0.4, borderColor: '#000' }} />
            <Button transparent full onPress={onPress}><Text>OK</Text></Button>
            </View>
        </Modal>
    );
};

export { Modals };
